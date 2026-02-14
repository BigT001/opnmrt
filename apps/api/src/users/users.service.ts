import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async syncCart(userId: string, items: any[], merge = true) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { cart: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let existingItems: any[] = [];
    if (user.cart && Array.isArray(user.cart)) {
      existingItems = user.cart as any[];
    } else {
      // Handle empty or invalid
      existingItems = [];
    }

    // Map Strategy: Key = storeId + productId
    const mergedMap = new Map();

    if (merge) {
      // Populate from existing
      for (const item of existingItems) {
        const key = `${item.storeId}-${item.id}`; // Assuming 'id' is productId
        mergedMap.set(key, { ...item }); // Clone
      }

      // Merge new items (prefer provided items for same keys)
      for (const item of items) {
        const key = `${item.storeId}-${item.id}`;
        // By setting same key, we overwrite existing or add new
        mergedMap.set(key, { ...item });
      }
    } else {
      // Overwrite mode: provided items are the truth
      for (const item of items) {
        const key = `${item.storeId}-${item.id}`;
        mergedMap.set(key, { ...item });
      }
    }

    const finalItems = Array.from(mergedMap.values());


    // Save
    await this.prisma.user.update({
      where: { id: userId },
      data: { cart: finalItems },
    });

    return finalItems;
  }

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
        cart: true,
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
      cart?: any;
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

    // CRITICAL: Only update phone if it's different from current phone
    // This prevents unique constraint errors when syncing during checkout
    if (data.phone !== undefined) {
      const currentUser = await this.prisma.user.findUnique({
        where: { id },
        select: { phone: true },
      });

      if (currentUser?.phone === data.phone) {
        // Phone is the same, don't update it
        delete data.phone;
      }
    }

    // Debug log
    // console.log('Updating user:', id, data);

    try {
      console.log('--- STARTING PRISMA UPDATE ---');
      console.log('ID:', id);
      console.log('DATA AFTER NAME LOGIC:', JSON.stringify(data));

      const result = await this.prisma.user.update({
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
          cart: true,
        },
      });
      console.log('--- PRISMA UPDATE SUCCESS ---');
      return result;
    } catch (error: any) {
      // PERSISTENT LOGGING TO AVOID TERMINAL TRUNCATION
      const fs = require('fs');
      const crashLogPath = 'c:\\Users\\HomePC\\Desktop\\opnmart\\apps\\api\\crash.log';
      const logEntry = `[${new Date().toISOString()}] PATCH FAILED\n` +
        `ID: ${id}\n` +
        `Data: ${JSON.stringify(data)}\n` +
        `Error: ${error.message}\n` +
        `Stack: ${error.stack}\n` +
        `${'='.repeat(50)}\n`;
      fs.appendFileSync(crashLogPath, logEntry);

      console.error('@@@PRISMA_PATCH_FAILED@@@', error.message);

      if (error.code === 'P2002') {
        const target = error.meta?.target || [];
        if (target.includes('email')) {
          throw new ConflictException('This email is already taken by another account.');
        }
        if (target.includes('phone')) {
          throw new ConflictException('This phone number is already registered to another user.');
        }
      }
      throw error;
    }
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
