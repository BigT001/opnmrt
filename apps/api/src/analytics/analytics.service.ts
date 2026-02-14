import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async trackEvent(storeId: string, eventType: string, payload: any, tenantId?: string) {
        try {
            // If tenantId is not provided, we try to find it from the store
            let finalTenantId = tenantId;
            if (!finalTenantId) {
                const store = await this.prisma.store.findUnique({
                    where: { id: storeId },
                    select: { tenantId: true },
                });
                finalTenantId = store?.tenantId;
            }

            if (!finalTenantId) return null;

            return await this.prisma.eventLog.create({
                data: {
                    storeId,
                    tenantId: finalTenantId,
                    eventType,
                    payload: payload || {},
                },
            });
        } catch (error) {
            console.error('[ANALYTICS_TRACK_ERROR]', error);
            return null;
        }
    }

    async getNotifications(storeId: string) {
        try {
            const events = await this.prisma.eventLog.findMany({
                where: { storeId },
                orderBy: { createdAt: 'desc' },
                take: 20,
            });

            // Map events to user-friendly notifications with error safety
            return events.map(event => {
                try {
                    let title = 'System Update';
                    let message = 'An event occurred in your store.';
                    let icon = '🔔';
                    let link = '#';

                    switch (event.eventType) {
                        case 'ORDER_CREATED':
                            title = 'New Order';
                            const orderIdTail = event.id.slice(-6).toUpperCase();
                            message = `Order #${orderIdTail} received.`;
                            icon = '📦';
                            link = '/dashboard/seller/orders';
                            break;
                        case 'ADD_TO_CART':
                            title = 'Cart Activity';
                            message = 'A customer added an item to their cart.';
                            icon = '🛒';
                            break;
                        case 'PRODUCT_VIEW':
                            title = 'Product Viewed';
                            message = 'A customer is looking at your products.';
                            icon = '👀';
                            break;
                        case 'STOCK_REDUCED_BY_ORDER':
                            title = 'Inventory Update';
                            const payload = event.payload as any;
                            message = `${payload?.productName || 'A product'} stock reduced by ${payload?.quantityReduced || 1}.`;
                            icon = '📉';
                            link = '/dashboard/seller/products';
                            break;
                        case 'SESSION_START':
                            title = 'New Visitor';
                            message = 'A new shopper has started browsing.';
                            icon = '👋';
                            break;
                    }

                    return {
                        id: event.id,
                        title,
                        message,
                        icon,
                        link,
                        createdAt: event.createdAt,
                    };
                } catch (mapErr) {
                    console.error('[NOTIFICATIONS_MAP_ERROR]', event.id, mapErr);
                    return null;
                }
            }).filter(Boolean);
        } catch (error) {
            console.error('[GET_NOTIFICATIONS_SERVICE_ERROR]', error);
            return [];
        }
    }

    async getTimelineStats(storeId: string, days: number = 7) {
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        startDate.setDate(startDate.getDate() - days + 1);

        const orders = await this.prisma.order.findMany({
            where: {
                storeId,
                status: 'PAID',
                createdAt: { gte: startDate }
            },
            select: {
                totalAmount: true,
                createdAt: true
            }
        });

        // Initialize daily buckets
        const dailyData: Record<string, { revenue: number, orders: number, date: string }> = {};
        for (let i = 0; i < days; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            const displayDate = d.toLocaleDateString('en-US', { weekday: 'short' });
            dailyData[dateStr] = { revenue: 0, orders: 0, date: displayDate };
        }

        orders.forEach(order => {
            const dateStr = order.createdAt.toISOString().split('T')[0];
            if (dailyData[dateStr]) {
                dailyData[dateStr].revenue += Number(order.totalAmount);
                dailyData[dateStr].orders += 1;
            }
        });

        return Object.values(dailyData);
    }
}
