const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const orders = await prisma.order.count();
        const items = await prisma.orderItem.count();
        console.log('ORDER_COUNT:', orders);
        console.log('ORDER_ITEM_COUNT:', items);
    } catch (error) {
        console.error('DB_ERROR:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
