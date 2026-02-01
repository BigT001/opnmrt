import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'demo@opnmart.com';

    // Upsert User
    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password: '$2a$10$YourHashedPasswordHereOrJustMeta', // Dummy hash or string
            name: 'Demo Seller',
            role: 'SELLER',
        },
    });

    // Upsert Store
    const store = await prisma.store.upsert({
        where: { subdomain: 'demo' },
        update: {},
        create: {
            name: 'Demo Store',
            subdomain: 'demo',
            tenantId: 'demo-tenant',
            ownerId: user.id,
            plan: 'FREE',
        },
    });

    console.log({ user, store });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
