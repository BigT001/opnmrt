
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Starting fresh database reset (Preserving ADMINs)...');

    try {
        // 1. Delete dependent transactional data
        console.log('🗑️ Clearing transactional data...');
        await prisma.eventLog.deleteMany({});
        await prisma.message.deleteMany({});
        await prisma.analytics.deleteMany({});
        await prisma.orderItem.deleteMany({});
        await prisma.payment.deleteMany({});
        await prisma.order.deleteMany({});

        // 2. Delete inventory and products
        console.log('🗑️ Clearing inventory and products...');
        await prisma.inventory.deleteMany({});
        await prisma.product.deleteMany({});

        // 3. Delete stores
        console.log('🗑️ Clearing stores...');
        await prisma.store.deleteMany({});

        // 4. Delete users who are SELLERs or BUYERs
        console.log('🗑️ Clearing sellers and buyers...');
        const result = await prisma.user.deleteMany({
            where: {
                role: {
                    in: ['SELLER', 'BUYER']
                }
            }
        });

        console.log(`✅ Reset complete! Deleted ${result.count} users (Sellers/Buyers) and all associated data.`);
    } catch (error) {
        console.error('❌ Error during reset:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
