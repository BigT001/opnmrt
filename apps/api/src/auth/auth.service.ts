import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Resend } from 'resend';
import type { RegisterInput, LoginInput } from '@opnmrt/shared';

@Injectable()
export class AuthService {
  private resend: Resend;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    // Initialize Resend with API Key from environment
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendOtp(email: string, phone?: string, subdomain?: string) {
    const normalizedEmail = email.toLowerCase();
    const scope = subdomain ? `${subdomain.toLowerCase()}_` : 'global_';
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // TTL: 5 minutes
    await this.cacheManager.set(`otp_${scope}${normalizedEmail}`, otp, 300000);

    console.log(`\n🔑 [AUTH] OTP for ${normalizedEmail} (Scope: ${scope}): ${otp}\n`);

    try {
      // Send Email via Resend
      const { data, error } = await this.resend.emails.send({
        from: 'OPNMRT <onboarding@opnmrt.com>', // User confirmed domain verified
        to: [normalizedEmail],
        subject: 'Your OPNMRT Verification Code',
        html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Verify your identity</h2>
                        <p>Use the following code to complete your registration:</p>
                        <div style="background: #f4f4f5; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #10b981;">${otp}</span>
                        </div>
                        <p style="color: #666; font-size: 14px;">This code will expire in 5 minutes.</p>
                    </div>
                `,
      });

      if (error) {
        console.warn(
          `⚠️ [Resend Restricted] Email to ${email} failed. Use the OTP from console: ${otp}`,
        );
        // treating as success in dev so you can proceed
      }
    } catch (error) {
      console.error('OTP Send Error (Non-Fatal):', error);
    }

    // Simulate SMS for now (Cost Saving)
    if (phone) {
      console.log(`[SMS SIMULATION] To: ${phone}, Code: ${otp}`);
    }

    return { success: true, message: 'Verification code sent (check console)' };
  }

  async verifyOtp(email: string, otp: string, subdomain?: string, phone?: string) {
    const normalizedEmail = email.toLowerCase();
    const scope = subdomain ? `${subdomain.toLowerCase()}_` : 'global_';
    const cachedOtp = await this.cacheManager.get(`otp_${scope}${normalizedEmail}`);

    if (cachedOtp !== otp) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }

    // Clear OTP
    await this.cacheManager.del(`otp_${scope}${normalizedEmail}`);

    // Mark as verified for 10 mins
    await this.cacheManager.set(`verified_${scope}${normalizedEmail}`, true, 600000);
    return { success: true };
  }

  async register(
    input: RegisterInput & {
      subdomain?: string;
      storeName?: string;
      biography?: string;
      address?: string;
      state?: string;
      lga?: string;
    },
  ) {
    try {
      const normalizedEmail = input.email.toLowerCase();
      console.log('[REGISTER] Starting registration for:', normalizedEmail);

      // Check if verified
      // SELLERS always verify on the global scope because their subdomain is new
      const scope = (input.role === 'SELLER' || !input.subdomain) ? 'global_' : `${input.subdomain.toLowerCase()}_`;
      const isVerified = await this.cacheManager.get(`verified_${scope}${normalizedEmail}`);
      console.log(`[REGISTER] Verification status (Scope: ${scope}):`, isVerified);

      if (!isVerified) {
        throw new UnauthorizedException(
          'Security Check: Email/Phone not verified for this session.',
        );
      }

      const targetSubdomain = input.subdomain?.toLowerCase();
      let targetStoreId: string | null = null;
      if (targetSubdomain) {
        const store = await this.prisma.store.findUnique({ where: { subdomain: targetSubdomain } });
        targetStoreId = store?.id || null;
      }

      // --- STRICT UNIQUENESS CHECKS ---
      if (input.role === 'SELLER') {
        // Sellers check globally
        const existingEmail = await this.prisma.user.findFirst({
          where: { email: { equals: normalizedEmail, mode: 'insensitive' } as any },
        });
        if (existingEmail) {
          throw new ConflictException('This email is already registered as a merchant or customer.');
        }

        if (input.phone) {
          const existingPhone = await this.prisma.user.findFirst({
            where: { phone: input.phone },
          });
          if (existingPhone) {
            throw new ConflictException('This phone number is already registered.');
          }
        }
      } else {
        // Buyers check within the store scope
        const existingEmail = await this.prisma.user.findFirst({
          where: {
            email: { equals: normalizedEmail, mode: 'insensitive' } as any,
            storeId: targetStoreId,
          },
        });

        if (existingEmail) {
          throw new ConflictException('An account with this email is already registered at this store.');
        }

        if (input.phone) {
          const existingPhone = await this.prisma.user.findFirst({
            where: {
              phone: input.phone,
              storeId: targetStoreId,
            },
          });
          if (existingPhone) {
            throw new ConflictException('This phone number is already registered at this store.');
          }
        }
      }

      console.log('[REGISTER] Hashing password...');
      const hashedPassword = await bcrypt.hash(input.password, 10);

      console.log('[REGISTER] Starting transaction...');
      // Use a transaction to ensure both user and store are created
      const { user, store } = await this.prisma.$transaction(async (tx) => {
        let userStoreId: string | undefined;
        let tenantId: string | undefined;

        if (input.role === 'BUYER' && input.subdomain) {
          const targetStore = await tx.store.findUnique({
            where: { subdomain: input.subdomain.toLowerCase() },
          });
          if (targetStore) {
            userStoreId = targetStore.id;
            tenantId = targetStore.tenantId;
          }
        }

        console.log('[REGISTER] Creating user with data:', {
          email: input.email,
          phone: input.phone,
          name: input.name,
          role: input.role,
        });

        const newUser = await tx.user.create({
          data: {
            email: normalizedEmail,
            phone: input.phone,
            password: hashedPassword,
            name: input.name,
            role: input.role,
            storeId: userStoreId,
            tenantId: tenantId,
          },
        });

        console.log('[REGISTER] User created:', newUser.id);

        let newStore: any = null;
        if (input.role === 'SELLER' && input.subdomain && input.storeName) {
          const lowSubdomain = input.subdomain.toLowerCase();
          console.log('[REGISTER] Checking subdomain:', lowSubdomain);

          // Check if subdomain is taken
          const existingStore = await tx.store.findUnique({
            where: { subdomain: lowSubdomain },
          });

          if (existingStore) {
            throw new ConflictException('Subdomain is already taken');
          }

          console.log('[REGISTER] Creating store...');
          newStore = await tx.store.create({
            data: {
              name: input.storeName,
              subdomain: lowSubdomain,
              biography: input.biography,
              address: input.address,
              state: input.state,
              lga: input.lga,
              tenantId: `t_${Math.random().toString(36).substring(2, 11)}`,
              ownerId: newUser.id,
            },
          });
          console.log('[REGISTER] Store created:', newStore.id);
        }

        return { user: newUser, store: newStore };
      });

      console.log('[REGISTER] Transaction completed successfully');

      const tokens = await this.generateTokens(user.id, user.email, user.role);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          phone: user.phone,
          role: user.role,
        },
        store: store
          ? {
            id: store.id,
            name: store.name,
            subdomain: store.subdomain,
            logo: store.logo,
            heroImage: store.heroImage,
            primaryColor: store.primaryColor,
            theme: store.theme,
            themeConfig: store.themeConfig,
            utilityBill: store.utilityBill,
            verificationStatus: store.verificationStatus,
            chatAiEnabled: store.chatAiEnabled,
            officialEmail: (store as any).officialEmail,
            whatsappNumber: (store as any).whatsappNumber,
            biography: (store as any).biography,
            paystackSecretKey: store.paystackSecretKey ? '********' : null,
            paystackWebhookSecret: store.paystackWebhookSecret ? '********' : null,
          }
          : null,
        ...tokens,
      };
    } catch (error) {
      console.error('[REGISTER] Error during registration:', error);
      throw error;
    }
  }

  async login(input: LoginInput) {
    try {
      const subdomain = input.subdomain?.toLowerCase();
      let targetStoreId: string | null = null;
      if (subdomain) {
        const store = await this.prisma.store.findUnique({ where: { subdomain } });
        targetStoreId = store?.id || null;
      }

      const normalizedEmail = input.email.toLowerCase();
      console.log(`[AUTH_DEBUG] Login attempt: email=${normalizedEmail}, subdomain=${subdomain}`);

      // 1. Find user by email globally first to see if they exist at all
      const user = await this.prisma.user.findFirst({
        where: { email: { equals: normalizedEmail, mode: 'insensitive' } as any },
        include: { managedStore: true },
      });

      console.log(`[AUTH_DEBUG] Global User found: ${!!user}, Role: ${user?.role}, storeId: ${user?.storeId}`);

      if (!user) {
        console.error(`[AUTH_LOGIN_FAILED] Email not found: ${normalizedEmail}`);
        throw new UnauthorizedException('Invalid email or password. Please try again.'); // Uniform message
      }

      // 2. Check Password
      const isPasswordValid = await bcrypt.compare(
        input.password,
        user.password,
      );
      console.log(`[AUTH_DEBUG] Password valid: ${isPasswordValid}`);

      if (!isPasswordValid) {
        console.error(`[AUTH_LOGIN_FAILED] Invalid password for: ${normalizedEmail}`);
        throw new UnauthorizedException('Invalid email or password. Please try again.');
      }

      // 3. Store Permissions / Scoping
      if (input.subdomain) {
        const targetStore = await this.prisma.store.findUnique({
          where: { subdomain: input.subdomain.toLowerCase() },
        });

        if (!targetStore) {
          throw new UnauthorizedException('Store not found.');
        }

        const isOwner = user.managedStore?.id === targetStore.id;
        const isCustomer = user.storeId === targetStore.id;

        if (!isOwner && !isCustomer) {
          console.error(`[AUTH_BLOCKED] User ${user.email} not authorized for store ${targetStore.subdomain}`);
          throw new UnauthorizedException(
            user.role === 'SELLER'
              ? 'Merchant access denied. You can only log into your own storefront.'
              : `This account belongs to another store on our network.`
          );
        }
      } else {
        // Global Login
        if (user.role === 'BUYER') {
          throw new UnauthorizedException(
            'Customer accounts must log in through their specific store portal.',
          );
        }
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          phone: user.phone,
          role: user.role,
        },
        store: user.managedStore
          ? {
            id: user.managedStore.id,
            name: user.managedStore.name,
            subdomain: user.managedStore.subdomain,
            logo: user.managedStore.logo,
            heroImage: user.managedStore.heroImage,
            primaryColor: user.managedStore.primaryColor,
            theme: user.managedStore.theme,
            themeConfig: user.managedStore.themeConfig,
            paystackPublicKey: user.managedStore.paystackPublicKey,
            aiMessaging: user.managedStore.aiMessaging,
            aiInventory: user.managedStore.aiInventory,
            aiStrategy: user.managedStore.aiStrategy,
            aiFinancials: user.managedStore.aiFinancials,
            chatAiEnabled: user.managedStore.chatAiEnabled,
            officialEmail: (user.managedStore as any).officialEmail,
            whatsappNumber: (user.managedStore as any).whatsappNumber,
            address: (user.managedStore as any).address,
            ownerName: (user.managedStore as any).ownerName,
            instagram: (user.managedStore as any).instagram,
            twitter: (user.managedStore as any).twitter,
            facebook: (user.managedStore as any).facebook,
            tiktok: (user.managedStore as any).tiktok,
            biography: (user.managedStore as any).biography,
            paystackSecretKey: user.managedStore.paystackSecretKey ? '********' : null,
            paystackWebhookSecret: user.managedStore.paystackWebhookSecret ? '********' : null,
          }
          : null,
        ...tokens,
      };
    } catch (error) {
      console.error('Login error detailed:', error);
      throw error;
    }
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { managedStore: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        phone: user.phone,
        role: user.role,
      },
      store: user.managedStore
        ? {
          id: user.managedStore.id,
          name: user.managedStore.name,
          subdomain: user.managedStore.subdomain,
          logo: user.managedStore.logo,
          heroImage: user.managedStore.heroImage,
          primaryColor: user.managedStore.primaryColor,
          theme: user.managedStore.theme,
          themeConfig: user.managedStore.themeConfig,
          paystackPublicKey: user.managedStore.paystackPublicKey,
          aiMessaging: user.managedStore.aiMessaging,
          aiInventory: user.managedStore.aiInventory,
          aiStrategy: user.managedStore.aiStrategy,
          aiFinancials: user.managedStore.aiFinancials,
          chatAiEnabled: user.managedStore.chatAiEnabled,
          officialEmail: (user.managedStore as any).officialEmail,
          whatsappNumber: (user.managedStore as any).whatsappNumber,
          address: (user.managedStore as any).address,
          ownerName: (user.managedStore as any).ownerName,
          instagram: (user.managedStore as any).instagram,
          twitter: (user.managedStore as any).twitter,
          facebook: (user.managedStore as any).facebook,
          tiktok: (user.managedStore as any).tiktok,
          biography: (user.managedStore as any).biography,
          paystackSecretKey: user.managedStore.paystackSecretKey ? '********' : null,
          paystackWebhookSecret: user.managedStore.paystackWebhookSecret ? '********' : null,
        }
        : null,
    };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_SECRET,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_SECRET, // In production, use a different secret for refresh
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
