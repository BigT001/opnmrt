const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            select: { email: true, role: true, name: true }
        });
        fs.writeFileSync('users-list.json', JSON.stringify(users, null, 2), 'utf8');
        console.log('Saved to users-list.json');
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
