import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getStats() {
        const [totalSellers, totalBuyers, totalOrders, totalRevenue, totalStores] = await Promise.all([
            this.prisma.user.count({ where: { role: 'SELLER' } }),
            this.prisma.user.count({ where: { role: 'BUYER' } }),
            this.prisma.order.count(),
            this.prisma.order.aggregate({
                where: { status: 'PAID' },
                _sum: { totalAmount: true }
            }),
            this.prisma.store.count()
        ]);

        return {
            totalSellers,
            totalBuyers,
            totalOrders,
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            totalStores
        };
    }

    async getSellers() {
        return this.prisma.user.findMany({
            where: { role: 'SELLER' },
            include: {
                managedStore: {
                    include: {
                        _count: {
                            select: {
                                products: true,
                                orders: true
                            }
                        }
                    }
                }
            }
        });
    }

    async getBuyers() {
        return this.prisma.user.findMany({
            where: { role: 'BUYER' },
            include: {
                orders: true
            }
        });
    }

    async getOrders() {
        return this.prisma.order.findMany({
            include: {
                buyer: true,
                store: true,
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getSellerDetail(id: string) {
        const seller = await this.prisma.user.findUnique({
            where: { id },
            include: {
                managedStore: {
                    include: {
                        _count: {
                            select: {
                                products: true,
                                orders: true
                            }
                        },
                        orders: {
                            include: {
                                buyer: true,
                                items: {
                                    include: {
                                        product: true
                                    }
                                }
                            },
                            orderBy: { createdAt: 'desc' }
                        },
                        products: true
                    }
                }
            }
        });

        if (!seller) return null;

        // Fetch buyers associated with this store
        const buyers = await this.prisma.user.findMany({
            where: {
                role: 'BUYER',
                storeId: seller.managedStore?.id
            },
            include: {
                orders: {
                    where: { storeId: seller.managedStore?.id }
                }
            }
        });

        return {
            ...seller,
            buyers
        };
    }
}
