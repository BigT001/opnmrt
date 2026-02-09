
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const counts = await prisma.user.groupBy({
        by: ['role'],
        _count: true
    });
    console.log('Current User Counts:', JSON.stringify(counts, null, 2));
}

main().finally(() => prisma.$disconnect());
