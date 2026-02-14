import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) { }

  async create(
    storeId: string,
    data: {
      name: string;
      description?: string;
      price: number;
      discountPrice?: number;
      stock: number;
      category?: string;
      colors?: string[];
      sizes?: string[];
    },
    files?: Express.Multer.File[],
  ) {
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      try {
        const uploadPromises = files.map((file) =>
          this.cloudinary.uploadFile(file),
        );
        const results = await Promise.all(uploadPromises);
        imageUrls = results.map((r) => r.secure_url);
      } catch (error) {
        console.error('Error uploading images to Cloudinary:', error);
        // Log to file for debugging
        const fs = require('fs');
        const path = require('path');
        const logPath = path.join(process.cwd(), 'upload-error.log');
        const errorMessage = `[${new Date().toISOString()}] Upload Error: ${error.message}\nStack: ${error.stack}\n\n`;
        fs.appendFileSync(logPath, errorMessage);

        throw new Error('Image upload failed: ' + error.message);
      }
    }

    // Determine tenantId based on storeId
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { tenantId: true },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    try {
      return await this.prisma.product.create({
        data: {
          ...data,
          images: imageUrls,
          storeId,
          tenantId: store.tenantId,
        },
      });
    } catch (error) {
      console.error('Error creating product in database:', error);
      throw error;
    }
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      discountPrice?: number;
      stock?: number;
      category?: string;
      colors?: string[];
      sizes?: string[];
      existingImages?: string[];
    },
    files?: Express.Multer.File[],
  ) {
    let newImageUrls: string[] = [];

    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        this.cloudinary.uploadFile(file),
      );
      const results = await Promise.all(uploadPromises);
      newImageUrls = results.map((r) => r.secure_url);
    }

    // Only allow updating base fields
    const { existingImages, ...updateData } = data;

    // Build the update object for Prisma
    const prismaUpdate: any = { ...updateData };

    // Get current product to check stock if we are updating it
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) throw new NotFoundException('Product not found');

    // IMPORTANT: Only update images if they were explicitly provided or new files uploaded.
    // If neither, we skip the 'images' field entirely to avoid wiping existing ones.
    if (newImageUrls.length > 0 || existingImages !== undefined) {
      prismaUpdate.images = [...(existingImages || []), ...newImageUrls];
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: prismaUpdate,
    });

    // Log manual stock adjustment if changed
    if (data.stock !== undefined && data.stock !== existingProduct.stock) {
      const adjustment = updatedProduct.stock - existingProduct.stock;
      const isRestock = adjustment > 0;

      await this.prisma.eventLog.create({
        data: {
          tenantId: updatedProduct.tenantId,
          storeId: updatedProduct.storeId,
          eventType: isRestock ? 'PRODUCT_RESTOCKED' : 'STOCK_ADJUSTED_MANUALLY',
          payload: {
            productId: updatedProduct.id,
            productName: updatedProduct.name,
            prevStock: existingProduct.stock,
            newStock: updatedProduct.stock,
            adjustment,
          },
        },
      });

      // If stock went UP, record restock in Inventory
      if (isRestock) {
        const inventory = await this.prisma.inventory.findUnique({
          where: { productId: id },
        });

        const restockEntry = {
          date: new Date().toISOString(),
          prevQuantity: existingProduct.stock,
          newQuantity: updatedProduct.stock,
          added: adjustment,
        };

        if (inventory) {
          const currentHistory = (inventory.restockHistory as any[]) || [];
          await this.prisma.inventory.update({
            where: { productId: id },
            data: {
              quantity: updatedProduct.stock,
              lastRestockedAt: new Date(),
              restockHistory: [...currentHistory, restockEntry],
            },
          });
        } else {
          // Create inventory record if it doesn't exist
          await this.prisma.inventory.create({
            data: {
              tenantId: updatedProduct.tenantId,
              storeId: updatedProduct.storeId,
              productId: id,
              quantity: updatedProduct.stock,
              lastRestockedAt: new Date(),
              restockHistory: [restockEntry],
            },
          });
        }
      }
    }

    return updatedProduct;
  }

  async findAll(subdomain: string) {
    const store = await this.prisma.store.findUnique({
      where: { subdomain },
      include: { products: true },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store.products;
  }

  async findByStoreId(storeId: string) {
    return this.prisma.product.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySellerUserId(userId: string) {
    const store = await this.prisma.store.findUnique({
      where: { ownerId: userId },
    });

    if (!store) {
      throw new NotFoundException('Store not found for this seller');
    }

    return this.findByStoreId(store.id);
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return product;
  }
}
