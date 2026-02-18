const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    try {
        const stores = await prisma.store.findMany({
            include: { owner: true }
        });
        fs.writeFileSync('stores-list.json', JSON.stringify(stores, null, 2), 'utf8');
        console.log('Saved to stores-list.json');
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
