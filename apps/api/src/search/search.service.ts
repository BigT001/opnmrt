import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
    constructor(private prisma: PrismaService) { }

    async globalSearch(storeId: string, query: string) {
        if (!query || query.length < 2) return { products: [], orders: [], customers: [] };

        const lowerQuery = query.toLowerCase();

        const [products, orders, customers] = await Promise.all([
            // Search Products
            this.prisma.product.findMany({
                where: {
                    storeId,
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                        { category: { contains: query, mode: 'insensitive' } },
                    ],
                },
                take: 5,
                select: { id: true, name: true, price: true, images: true, category: true },
            }),

            // Search Orders
            this.prisma.order.findMany({
                where: {
                    storeId,
                    OR: [
                        { id: { contains: query, mode: 'insensitive' } },
                        { paymentRef: { contains: query, mode: 'insensitive' } },
                        { buyer: { name: { contains: query, mode: 'insensitive' } } },
                        { buyer: { email: { contains: query, mode: 'insensitive' } } },
                    ],
                },
                take: 5,
                include: {
                    buyer: { select: { name: true, email: true } },
                },
            }),

            // Search Customers
            this.prisma.user.findMany({
                where: {
                    role: 'BUYER',
                    storeId: storeId, // BUYERs are store specific in this context
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { email: { contains: query, mode: 'insensitive' } },
                    ],
                },
                take: 5,
                select: { id: true, name: true, email: true, image: true },
            }),
        ]);

        return {
            products,
            orders,
            customers,
        };
    }
}
