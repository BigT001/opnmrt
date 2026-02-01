import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class StoresService {
    constructor(
        private prisma: PrismaService,
        private cloudinary: CloudinaryService
    ) { }

    async findBySubdomain(subdomain: string) {
        return this.prisma.store.findUnique({
            where: { subdomain },
        });
    }

    async findByCustomDomain(domain: string) {
        return this.prisma.store.findUnique({
            where: { customDomain: domain },
        });
    }

    async findOne(id: string) {
        const store = await this.prisma.store.findUnique({
            where: { id },
        });

        if (!store) {
            throw new NotFoundException(`Store with ID ${id} not found`);
        }

        return store;
    }

    async update(id: string, data: any, files?: { logo?: Express.Multer.File[], heroImage?: Express.Multer.File[] }) {
        try {
            const updateData: any = { ...data };
            console.log('Update Store Data:', JSON.stringify(updateData, null, 2));

            if (files?.logo?.[0]) {
                const result = await this.cloudinary.uploadFile(files.logo[0], 'opnmart-stores/logos');
                updateData.logo = result.secure_url;
            }

            if (files?.heroImage?.[0]) {
                const result = await this.cloudinary.uploadFile(files.heroImage[0], 'opnmart-stores/heros');
                updateData.heroImage = result.secure_url;
            }

            return await this.prisma.store.update({
                where: { id },
                data: updateData,
            });
        } catch (error) {
            console.error('[STORES_SERVICE_UPDATE_ERROR]', error);
            throw error;
        }
    }

    async getStoreStats(storeId: string) {
        // Placeholder for AI insights/analytics later
        return {
            storeId,
            message: 'Stats logic coming soon',
        };
    }
}
