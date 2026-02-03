const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function checkStoreTheme() {
    const stores = await prisma.store.findMany();
    let report = '--- STORES THEMES REPORT ---\n';
    stores.forEach(s => {
        report += `Subdomain: ${s.subdomain} | Theme: ${s.theme} | Name: ${s.name}\n`;
    });
    report += '---------------------------\n';
    fs.writeFileSync('themes-report.txt', report);
    console.log('Report written to themes-report.txt');
    await prisma.$disconnect();
}

checkStoreTheme();
