const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixZorSubdomain() {
    try {
        console.log('Fixing subdomain "Zor" to "zor"...');

        // Find the store with capitalized subdomain
        const store = await prisma.store.findFirst({
            where: { subdomain: 'Zor' }
        });

        if (store) {
            console.log('Found store:', store.name);

            // Update to lowercase
            const updated = await prisma.store.update({
                where: { id: store.id },
                data: { subdomain: 'zor' }
            });

            console.log('✅ Successfully updated subdomain to:', updated.subdomain);
        } else {
            console.log('Store "Zor" not found (maybe already fixed).');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixZorSubdomain();
