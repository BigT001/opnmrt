const { PrismaClient } = require('@prisma/client');

async function checkStores() {
    const prisma = new PrismaClient();

    try {
        const stores = await prisma.store.findMany({
            include: {
                owner: {
                    select: {
                        email: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        products: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        const fs = require('fs');
        const path = require('path');

        let output = `\n📊 Total Stores: ${stores.length}\n`;
        output += '='.repeat(60) + '\n';

        stores.forEach((store, idx) => {
            output += `\n${idx + 1}. Store: ${store.name}\n`;
            output += `   Subdomain: '${store.subdomain}'\n`; // Added quotes to see spaces/case
            output += `   Owner: ${store.owner.name} (${store.owner.email})\n`;
            output += `   Products: ${store._count.products}\n`;
            output += `   URL: http://${store.subdomain}.localhost:3000\n`;
            output += `   Created: ${store.createdAt.toLocaleString()}\n`;
        });

        output += '\n' + '='.repeat(60) + '\n';

        console.log(output);
        fs.writeFileSync(path.join(__dirname, 'stores-list.txt'), output);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkStores();
