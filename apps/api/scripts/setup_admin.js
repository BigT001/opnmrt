
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    const email = 'info.samuelstanley@gmail.com';
    const password = 'mastercode1992@';

    let user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.log('Admin user not found. Creating...');
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Super Admin',
                role: 'ADMIN'
            }
        });
        console.log('Admin user created successfully.');
    } else {
        console.log('Admin user already exists.');
        // Ensure role is ADMIN
        if (user.role !== 'ADMIN') {
            await prisma.user.update({
                where: { id: user.id },
                data: { role: 'ADMIN' }
            });
            console.log('User role updated to ADMIN.');
        }
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
