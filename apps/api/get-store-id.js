const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const store = await prisma.store.findFirst();
        console.log('STORE_ID:', store ? store.id : 'NONE');
        const count = await prisma.eventLog.count();
        console.log('EVENT_LOG_COUNT:', count);
    } catch (error) {
        console.error('DB_ERROR:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
