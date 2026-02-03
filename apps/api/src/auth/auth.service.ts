import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import type { RegisterInput, LoginInput } from '@opnmart/shared';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(input: RegisterInput & { subdomain?: string; storeName?: string }) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: input.email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(input.password, 10);

        // Use a transaction to ensure both user and store are created
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: input.email,
                    password: hashedPassword,
                    name: input.name,
                    role: input.role,
                },
            });

            let store: any = null;
            if (input.role === 'SELLER' && input.subdomain && input.storeName) {
                // Check if subdomain is taken
                const existingStore = await tx.store.findUnique({
                    where: { subdomain: input.subdomain },
                });

                if (existingStore) {
                    throw new ConflictException('Subdomain is already taken');
                }

                store = await tx.store.create({
                    data: {
                        name: input.storeName,
                        subdomain: input.subdomain.toLowerCase(),
                        tenantId: `t_${Math.random().toString(36).substring(2, 11)}`,
                        ownerId: user.id,
                    },
                });
            }

            const tokens = await this.generateTokens(user.id, user.email, user.role);

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                store: store ? {
                    id: store.id,
                    name: store.name,
                    subdomain: store.subdomain,
                    logo: store.logo,
                    heroImage: store.heroImage,
                    primaryColor: store.primaryColor,
                    theme: store.theme,
                    themeConfig: store.themeConfig,
                } : null,
                ...tokens,
            };
        });
    }

    async login(input: LoginInput) {
        try {
            console.log(`Login attempt for email: ${input.email}`);
            const user = await this.prisma.user.findUnique({
                where: { email: input.email },
                include: { managedStore: true },
            });

            if (!user) {
                console.log(`Login failed: User not found for email ${input.email}`);
                throw new UnauthorizedException('Invalid credentials');
            }

            const isPasswordValid = await bcrypt.compare(input.password, user.password);

            if (!isPasswordValid) {
                console.log(`Login failed: Invalid password for email ${input.email}`);
                throw new UnauthorizedException('Invalid credentials');
            }

            const tokens = await this.generateTokens(user.id, user.email, user.role);

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                store: user.managedStore ? {
                    id: user.managedStore.id,
                    name: user.managedStore.name,
                    subdomain: user.managedStore.subdomain,
                    logo: user.managedStore.logo,
                    heroImage: user.managedStore.heroImage,
                    primaryColor: user.managedStore.primaryColor,
                    theme: user.managedStore.theme,
                    themeConfig: user.managedStore.themeConfig,
                } : null,
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
                role: user.role,
            },
            store: user.managedStore ? {
                id: user.managedStore.id,
                name: user.managedStore.name,
                subdomain: user.managedStore.subdomain,
                logo: user.managedStore.logo,
                heroImage: user.managedStore.heroImage,
                primaryColor: user.managedStore.primaryColor,
                theme: user.managedStore.theme,
                themeConfig: user.managedStore.themeConfig,
            } : null,
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
