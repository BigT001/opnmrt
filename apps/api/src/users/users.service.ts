import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        image: true,
        role: true,
        // @ts-ignore
        shippingAddress: true,
        // @ts-ignore
        savedCards: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      image?: string;
      shippingAddress?: any;
      savedCards?: any;
    },
  ) {
    // Check if name is being updated and if it's already set
    if (data.name) {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { name: true },
      });

      if (user?.name) {
        // Name immutable if set
        delete data.name;
      }
    }

    // Debug log
    // console.log('Updating user:', id, data);

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        image: true,
        role: true,
        // @ts-ignore
        shippingAddress: true,
        // @ts-ignore
        savedCards: true,
      },
    });
  }

  async changePassword(id: string, oldPass: string, newPass: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { passwordHistory: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) throw new UnauthorizedException('Incorrect current password');

    // Check password history
    for (const history of user.passwordHistory) {
      const isUsed = await bcrypt.compare(newPass, history.password);
      if (isUsed) {
        throw new BadRequestException(
          'You cannot use a previously used password.',
        );
      }
    }

    // Also check current password (already covered by history + current implies it was used)
    // Note: Logic above checks if *new* password matches *any* old password.
    // We should also check if it matches the *current* password explicitly if not in history yet
    const isSameAsCurrent = await bcrypt.compare(newPass, user.password);
    if (isSameAsCurrent) {
      throw new BadRequestException(
        'New password cannot be the same as the current password.',
      );
    }

    const hashedPassword = await bcrypt.hash(newPass, 10);

    // Transaction to update password and add to history
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordHistory.create({
        data: {
          userId: id,
          password: hashedPassword, // Store the hash
        },
      }),
    ]);

    return { success: true };
  }
}
