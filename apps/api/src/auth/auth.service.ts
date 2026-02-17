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
import type { RegisterInput, LoginInput } from '@opnmart/shared';

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

  async sendOtp(email: string, phone?: string) {
    // Generate 6-digit OTP locally
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // TTL: 5 minutes (300000 ms)
    await this.cacheManager.set(`otp_${email}`, otp, 300000);

    // ALWAYS LOG OTP FOR DEV (Bypass Resend restrictions)
    console.log(`\n🔑 [DEV MODE] OTP for ${email}: ${otp}\n`);

    try {
      // Send Email via Resend
      const { data, error } = await this.resend.emails.send({
        from: 'OPNMRT <onboarding@resend.dev>', // Use verified domain in prod
        to: [email],
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

  async verifyOtp(email: string, otp: string, phone?: string) {
    // Verify against local cache
    const cachedOtp = await this.cacheManager.get(`otp_${email}`);

    if (cachedOtp !== otp) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }

    // Clear OTP to prevent replay
    await this.cacheManager.del(`otp_${email}`);

    // Mark as verified
    await this.cacheManager.set(`verified_${email}`, true, 600000); // 10 mins validity for registration
    return { success: true };
  }

  async register(
    input: RegisterInput & { subdomain?: string; storeName?: string },
  ) {
    try {
      console.log('[REGISTER] Starting registration for:', input.email);

      // Check if verified
      const isVerified = await this.cacheManager.get(`verified_${input.email}`);
      console.log('[REGISTER] Verification status:', isVerified);

      if (!isVerified) {
        throw new UnauthorizedException(
          'Email/Phone not verified. Please verify OTP first.',
        );
      }

      const existingUser = await this.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
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
            email: input.email,
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
            paystackPublicKey: store.paystackPublicKey,
            chatAiEnabled: store.chatAiEnabled,
            // Secret key is NEVER sent to frontend for security
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
      console.log(`Login attempt for email: ${input.email}`);
      const user = await this.prisma.user.findUnique({
        where: { email: input.email },
        include: { managedStore: true },
      });

      if (!user) {
        console.error(`[AUTH_LOGIN_FAILED] User not found: ${input.email}`);
        throw new UnauthorizedException('Invalid email or password. Please try again.');
      }

      const isPasswordValid = await bcrypt.compare(
        input.password,
        user.password,
      );
      if (!isPasswordValid) {
        console.error(`[AUTH_LOGIN_FAILED] Invalid password for: ${input.email}`);
        throw new UnauthorizedException('Invalid email or password. Please try again.');
      }

      // Restrict Buyers to their specific store
      if (user.role === 'BUYER' && input.subdomain) {
        console.log(`[AUTH_LOGIN] Checking BUYER store restriction: ${user.email} in ${input.subdomain}`);
        const targetStore = await this.prisma.store.findUnique({
          where: { subdomain: input.subdomain.toLowerCase() },
        });

        if (!targetStore || user.storeId !== targetStore.id) {
          console.error(
            `[AUTH_LOGIN_FAILED] Store mismatch for BUYER: ${input.email} trying to access ${input.subdomain}. Registered storeId: ${user.storeId}, Target storeId: ${targetStore?.id}`,
          );
          throw new UnauthorizedException(
            'This account is not registered with this store',
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
            chatAiEnabled: user.managedStore.chatAiEnabled,
            // Secret key is NEVER sent to frontend for security
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
          chatAiEnabled: user.managedStore.chatAiEnabled,
          // Secret key is NEVER sent to frontend for security
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
