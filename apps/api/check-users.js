const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            select: { email: true, role: true }
        });
        console.log('--- USERS IN DB ---');
        console.log(users);
        console.log('-------------------');
    } catch (err) {
        console.error('Error fetching users:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
