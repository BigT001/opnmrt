import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const defaultPassword = await bcrypt.hash('password123', 10);

    // Secure admin setup using environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'opnmrtadmin@opnmrt.com';
    const rawAdminPassword = process.env.ADMIN_PASSWORD || 'Masterc0de@opnmrt1992@';
    const adminPassword = await bcrypt.hash(rawAdminPassword, 10);

    // 1. Create/Update Admin
    let admin = await prisma.user.findFirst({
        where: { email: adminEmail }
    });

    if (admin) {
        await prisma.user.update({
            where: { id: admin.id },
            data: {
                email: adminEmail,
                password: adminPassword,
                role: 'ADMIN'
            }
        });
    } else {
        admin = await prisma.user.create({
            data: {
                email: adminEmail,
                password: adminPassword,
                name: 'System Admin',
                role: 'ADMIN',
            },
        });
    }

    // 2. Create/Update Seller
    let seller = await prisma.user.findFirst({
        where: { email: 'seller@opnmrt.com' }
    });

    if (seller) {
        await prisma.user.update({
            where: { id: seller.id },
            data: { password: defaultPassword }
        });
    } else {
        seller = await prisma.user.create({
            data: {
                email: 'seller@opnmrt.com',
                password: defaultPassword,
                name: 'Demo Merchant',
                role: 'SELLER',
            },
        });
    }

    // 3. Create Demo Stores
    const stores = [
        { name: 'Heritage Threads', subdomain: 'heritage', plan: 'FREE', theme: 'VANTAGE' },
        { name: 'Eco Glow Cosmetics', subdomain: 'ecoglow', plan: 'PRO', theme: 'ELECTSHOP' },
        { name: 'Titan Electronics', subdomain: 'titan', plan: 'ENTERPRISE', theme: 'APPIFY' }
    ];

    for (const s of stores) {
        let u = await prisma.user.findFirst({ where: { email: `${s.subdomain}@opnmrt.com` } });
        if (!u) {
            u = await prisma.user.create({
                data: {
                    email: `${s.subdomain}@opnmrt.com`,
                    password: defaultPassword,
                    name: `${s.name} Admin`,
                    role: 'SELLER'
                }
            });
        }

        await prisma.store.upsert({
            where: { subdomain: s.subdomain },
            update: { plan: s.plan },
            create: {
                name: s.name,
                subdomain: s.subdomain,
                tenantId: `${s.subdomain}-tenant`,
                ownerId: u.id,
                plan: s.plan,
                theme: s.theme,
            }
        });
    }

    // 4. Create some Buyers and Orders
    const buyers = [
        { name: 'Samuel Akpan', email: 'samuel@gmail.com' },
        { name: 'Adetola Johnson', email: 'adetola@gmail.com' }
    ];

    for (const b of buyers) {
        let u = await prisma.user.findFirst({ where: { email: b.email } });
        if (!u) {
            u = await prisma.user.create({
                data: {
                    email: b.email,
                    password: defaultPassword,
                    name: b.name,
                    role: 'BUYER'
                }
            });
        }
    }

    console.log('Seeding completed successfully with tiered plans.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

