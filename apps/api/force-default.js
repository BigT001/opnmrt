const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function forceDefaultTheme() {
    try {
        const store = await prisma.store.update({
            where: { subdomain: 'zor' },
            data: { theme: 'DEFAULT' }
        });
        console.log(`Successfully updated store ${store.subdomain} to theme: ${store.theme}`);
    } catch (error) {
        console.error('Failed to update store theme:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

forceDefaultTheme();
