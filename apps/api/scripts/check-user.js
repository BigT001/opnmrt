const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
    const email = 'sta99175@gmail.com';
    console.log('Attempting to check user:', email);
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { managedStore: true }
        });
        console.log('User found:', JSON.stringify(user, null, 2));
    } catch (error) {
        console.log('--- DETAILED PRISMA ERROR ---');
        console.log('Message:', error.message);
        console.log('Code:', error.code);
        console.log('Client Version:', error.clientVersion);
        if (error.meta) console.log('Meta:', JSON.stringify(error.meta, null, 2));
        console.log('Full Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
