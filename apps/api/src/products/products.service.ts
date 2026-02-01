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
                const uploadPromises = files.map(file => this.cloudinary.uploadFile(file));
                const results = await Promise.all(uploadPromises);
                imageUrls = results.map(r => r.secure_url);
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
            const uploadPromises = files.map(file => this.cloudinary.uploadFile(file));
            const results = await Promise.all(uploadPromises);
            newImageUrls = results.map(r => r.secure_url);
        }

        const finalImages = [...(data.existingImages || []), ...newImageUrls];

        // Only allow updating base fields
        const { existingImages, ...updateData } = data;

        return this.prisma.product.update({
            where: { id },
            data: {
                ...updateData,
                images: finalImages,
            },
        });
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

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id }
        });
        return product;
    }
}
