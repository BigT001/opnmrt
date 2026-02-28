
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function reset() {
    const emails = ['sta99175@gmail.com', 'samuelstanley@gmail.com', 'info.samuelstanley@gmail.com'];
    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await prisma.user.updateMany({
        where: { email: { in: emails, mode: 'insensitive' } },
        data: { password: hashedPassword }
    });

    console.log(`Reset ${result.count} user(s). New password for all is ${newPassword}`);
}

reset()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
