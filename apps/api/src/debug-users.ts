
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debug() {
    const users = await prisma.user.findMany({
        include: { managedStore: true }
    });
    console.log('--- DEBUG USERS ---');
    users.forEach(u => {
        console.log(`Email: ${u.email}, Role: ${u.role}, storeId: ${u.storeId}, ManagedStore: ${u.managedStore?.subdomain || 'none'}`);
    });
    console.log('--- END DEBUG ---');
}

debug()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
