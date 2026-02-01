const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
    const prisma = new PrismaClient();

    try {
        console.log('=== Checking Database ===\n');

        // Get all users
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log(`Total Users: ${users.length}`);
        users.forEach((user, idx) => {
            console.log(`\n${idx + 1}. ${user.name} (${user.email})`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Created: ${user.createdAt}`);
        });

        // Get all stores
        const stores = await prisma.store.findMany({
            include: {
                owner: {
                    select: {
                        email: true,
                        name: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log(`\n\n=== Stores ===`);
        console.log(`Total Stores: ${stores.length}\n`);
        stores.forEach((store, idx) => {
            console.log(`${idx + 1}. ${store.name}`);
            console.log(`   Subdomain: ${store.subdomain}`);
            console.log(`   Owner: ${store.owner.name} (${store.owner.email})`);
            console.log(`   Access URL: http://${store.subdomain}.localhost:3000`);
            console.log(`   Created: ${store.createdAt}\n`);
        });

        // Find sellers without stores
        const sellersWithoutStores = users.filter(u => u.role === 'SELLER' && !stores.some(s => s.ownerId === u.id));
        if (sellersWithoutStores.length > 0) {
            console.log(`\n=== ⚠️  Sellers WITHOUT Stores ===`);
            sellersWithoutStores.forEach(user => {
                console.log(`- ${user.name} (${user.email})`);
            });
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabase();
