import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    // 1. Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@opnmart.com' },
        update: {},
        create: {
            email: 'admin@opnmart.com',
            password,
            name: 'System Admin',
            role: 'ADMIN',
        },
    });

    // 2. Create Seller
    const seller = await prisma.user.upsert({
        where: { email: 'seller@opnmart.com' },
        update: {},
        create: {
            email: 'seller@opnmart.com',
            password,
            name: 'Demo Merchant',
            role: 'SELLER',
        },
    });

    // 3. Create Store
    const store = await prisma.store.upsert({
        where: { subdomain: 'demo' },
        update: {},
        create: {
            name: 'Digital Emerald Store',
            subdomain: 'demo',
            tenantId: 'demo-tenant',
            ownerId: seller.id,
            plan: 'FREE',
            theme: 'NEON_STREAM',
        },
    });

    console.log('Seeding completed:');
    console.log({
        admin: { email: admin.email, password: 'password123' },
        seller: { email: seller.email, password: 'password123', store: store.subdomain }
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
