const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearUsers() {
    try {
        console.log('🗑️  Clearing all users and stores from database...');

        // Delete in order to respect foreign key constraints
        await prisma.message.deleteMany({});
        console.log('✅ Deleted all messages');

        await prisma.orderItem.deleteMany({});
        console.log('✅ Deleted all order items');

        await prisma.payment.deleteMany({});
        console.log('✅ Deleted all payments');

        await prisma.order.deleteMany({});
        console.log('✅ Deleted all orders');

        await prisma.inventory.deleteMany({});
        console.log('✅ Deleted all inventory');

        await prisma.product.deleteMany({});
        console.log('✅ Deleted all products');

        await prisma.analytics.deleteMany({});
        console.log('✅ Deleted all analytics');

        await prisma.eventLog.deleteMany({});
        console.log('✅ Deleted all event logs');

        await prisma.store.deleteMany({});
        console.log('✅ Deleted all stores');

        await prisma.user.deleteMany({});
        console.log('✅ Deleted all users');

        console.log('\n🎉 Database cleared successfully!');
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

clearUsers();
