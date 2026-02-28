
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function check() {
    const email = 'sta99175@gmail.com';
    const user = await prisma.user.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } },
        include: { managedStore: true }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    console.log('--- USER DATA ---');
    console.log(`Email: "${user.email}"`);
    console.log(`Role: ${user.role}`);
    console.log(`StoreId: ${user.storeId}`);
    console.log(`Hash: ${user.password}`);

    // Test common passwords just in case, or just verify it's a valid hash
    const isValidHash = typeof user.password === 'string' && user.password.startsWith('$2');
    console.log(`Is valid bcrypt hash format: ${isValidHash}`);
}

check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
