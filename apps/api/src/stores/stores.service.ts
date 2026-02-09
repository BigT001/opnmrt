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
        const [totalOrders, totalRevenue, totalProducts] = await Promise.all([
            this.prisma.order.count({ where: { storeId } }),
            this.prisma.order.aggregate({
                where: { storeId, status: 'PAID' },
                _sum: { totalAmount: true },
            }),
            this.prisma.product.count({ where: { storeId } }),
        ]);

        return {
            totalOrders,
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            totalProducts,
        };
    }

    async getCustomers(storeId: string) {
        const rawCustomers = await this.prisma.user.findMany({
            where: {
                role: 'BUYER',
                storeId: storeId,
            },
            include: {
                orders: {
                    where: { storeId: storeId },
                    select: {
                        totalAmount: true,
                        createdAt: true,
                    },
                },
            },
        });

        return rawCustomers.map(customer => {
            const totalSpent = customer.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
            const lastSeen = customer.orders.length > 0
                ? customer.orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt
                : customer.createdAt;

            return {
                id: customer.id,
                name: customer.name || 'Anonymous',
                email: customer.email,
                ordersCount: customer.orders.length,
                totalSpent,
                lastSeen,
            };
        });
    }

    async getCustomerStats(storeId: string) {
        const customers = await this.getCustomers(storeId);

        const totalCustomers = customers.length;
        const totalSpend = customers.reduce((sum, c) => sum + c.totalSpent, 0);
        const totalOrders = customers.reduce((sum, c) => sum + c.ordersCount, 0);

        const avgOrderValue = totalOrders > 0 ? totalSpend / totalOrders : 0;
        const customerLTV = totalCustomers > 0 ? totalSpend / totalCustomers : 0;

        // Simple mock for retention rate for now
        const retentionRate = totalCustomers > 0 ? 65 : 0;

        return {
            totalCustomers,
            avgOrderValue,
            customerLTV,
            retentionRate,
        };
    }
}
