import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
    constructor(private prisma: PrismaService) { }

    async getProductHistory(productId: string) {
        // Fetch logs related to this product through the payload JSON
        const logs = await this.prisma.eventLog.findMany({
            where: {
                OR: [
                    {
                        eventType: 'STOCK_REDUCED_BY_ORDER',
                        payload: {
                            path: ['productId'],
                            equals: productId,
                        },
                    },
                    {
                        eventType: 'STOCK_ADJUSTED_MANUALLY',
                        payload: {
                            path: ['productId'],
                            equals: productId,
                        },
                    },
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 20, // Only last 20 events
        });

        return logs.map(log => ({
            id: log.id,
            type: log.eventType,
            date: log.createdAt,
            payload: log.payload
        }));
    }
}
