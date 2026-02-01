const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkStores() {
    try {
        const stores = await prisma.store.findMany({
            include: {
                owner: {
                    select: {
                        email: true,
                        name: true,
                    }
                }
            }
        });

        console.log('All Stores:');
        console.log(JSON.stringify(stores, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkStores();
