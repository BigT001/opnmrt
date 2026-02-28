
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function reset() {
    const email = 'sta99175@gmail.com';
    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await prisma.user.updateMany({
        where: { email: { equals: email, mode: 'insensitive' } },
        data: { password: hashedPassword }
    });

    console.log(`Reset ${user.count} user(s). New password is ${newPassword}`);
}

reset()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
