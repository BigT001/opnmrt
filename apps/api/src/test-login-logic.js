
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testLogin() {
    const email = 'sta99175@gmail.com';
    const password = 'password123';
    const subdomain = undefined;

    console.log(`Testing login for ${email} with password ${password}`);

    const normalizedEmail = email.toLowerCase();
    const user = await prisma.user.findFirst({
        where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
        include: { managedStore: true },
    });

    if (!user) {
        console.log('User not found in DB');
        return;
    }

    console.log('User found:', user.email, 'Role:', user.role);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (isPasswordValid) {
        console.log('Login logic SUCCESS');
    } else {
        console.log('Login logic FAILED');
    }
}

testLogin()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
