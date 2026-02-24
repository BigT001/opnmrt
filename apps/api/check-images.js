const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({
        select: { name: true, images: true }
    });
    fs.writeFileSync('product_images_dump.json', JSON.stringify(products, null, 2));
    console.log('Dumped ' + products.length + ' products to product_images_dump.json');
    await prisma.$disconnect();
}

main().catch(console.error);
