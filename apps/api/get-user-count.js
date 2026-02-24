const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.user.count();
        console.log('USER_COUNT:', count);
    } catch (error) {
        console.error('DB_ERROR:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
