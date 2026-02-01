const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkZor() {
    try {
        console.log('Checking for store with subdomain "zor"...');
        const store = await prisma.store.findUnique({
            where: { subdomain: 'zor' },
            include: { owner: true }
        });

        if (store) {
            console.log('✅ Store Found:');
            console.log(JSON.stringify(store, null, 2));
        } else {
            console.log('❌ Store with subdomain "zor" NOT FOUND.');

            // Try to find any store named "Zor"
            const storeByName = await prisma.store.findFirst({
                where: { name: 'Zor' }
            });

            if (storeByName) {
                console.log('⚠️  Found store by name "Zor":');
                console.log(JSON.stringify(storeByName, null, 2));
            } else {
                console.log('❌ No store found with name "Zor" either.');
            }
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkZor();
