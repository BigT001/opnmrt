const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkStore() {
    const store = await prisma.store.findUnique({
        where: { subdomain: 'samstar' }
    });
    console.log(store ? `Store found: ${store.name}` : 'Store not found');
    await prisma.$disconnect();
}

checkStore();
