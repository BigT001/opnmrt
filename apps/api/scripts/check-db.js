const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const stores = await prisma.store.findMany();
    const users = await prisma.user.findMany();

    console.log(JSON.stringify({
        stores: stores.map(s => ({ id: s.id, name: s.name, subdomain: s.subdomain })),
        users: users.map(u => ({
            id: u.id,
            email: u.email,
            role: u.role,
            hasPassword: !!u.password,
            passwordPreview: u.password ? u.password.substring(0, 10) + '...' : 'NONE'
        }))
    }, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
