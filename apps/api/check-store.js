const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const store = await prisma.store.findUnique({
        where: { subdomain: 'samstar' }
    });
    console.log(JSON.stringify(store, null, 2));
    await prisma.$disconnect();
}

main().catch(console.error);
