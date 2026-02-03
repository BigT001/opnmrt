const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const email = 'test@opnmart.com';
    const password = 'Password123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: { password: hashedPassword },
        create: {
            email,
            password: hashedPassword,
            name: 'Test User',
            role: 'SELLER',
        },
    });

    console.log(`User ${email} created/updated with password: ${password}`);

    // Also ensure a store exists for this user
    const store = await prisma.store.upsert({
        where: { ownerId: user.id },
        update: {},
        create: {
            name: 'Test Store',
            subdomain: 'test',
            tenantId: 't_test123',
            ownerId: user.id,
            theme: 'MINIMAL_LUXE'
        }
    });

    console.log(`Store created for user: ${store.subdomain}.localhost:3000`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
