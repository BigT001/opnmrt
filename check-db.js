const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const userCount = await prisma.user.count();
        const orderCount = await prisma.order.count();
        const storeCount = await prisma.store.count();
        console.log({ userCount, orderCount, storeCount });

        // Check for any particularly large stores
        const stores = await prisma.store.findMany({
            select: {
                id: true,
                name: true,
                _count: {
                    select: {
                        orders: true,
                        products: true,
                        customers: true
                    }
                }
            }
        });
        console.log('Stores summary:', JSON.stringify(stores, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
