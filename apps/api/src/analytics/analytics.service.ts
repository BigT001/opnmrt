import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class AnalyticsService {
    constructor(
        private prisma: PrismaService,
        private realtime: RealtimeService,
    ) { }

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

            const log = await this.prisma.eventLog.create({
                data: {
                    storeId,
                    tenantId: finalTenantId,
                    eventType,
                    payload: payload || {},
                },
            });

            if (log) {
                // Immediate notification broadcast
                this.realtime.emitNotification(storeId, log);

                // Dashboard Stats broadcast if critical event
                const statsEvents = ['ORDER_PLACED', 'PAYMENT_SUCCESS', 'PRODUCT_VIEW', 'ADD_TO_CART', 'CHECKOUT_START', 'SESSION_START'];
                if (statsEvents.includes(eventType)) {
                    this.realtime.emitStatsUpdate(storeId);
                }
            }

            return log;
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
                        case 'ORDER_PLACED':
                            const p = event.payload as any;
                            title = 'NEW ORDER';
                            message = `${p?.customerName || 'A customer'} just placed an order of ${p?.amount ? '₦' + p.amount.toLocaleString() : 'some value'}.`;
                            icon = '🛍️';
                            link = '/dashboard/seller/orders';
                            break;
                        case 'CUSTOMER_ACCOUNT_CREATED':
                        case 'NEW_CUSTOMER':
                            title = 'NEW MEMBER';
                            message = `${(event.payload as any)?.customerName || 'A new visitor'} just joined the store!`;
                            icon = '👤';
                            link = '/dashboard/seller/customers';
                            break;
                        case 'PRODUCT_VIEW':
                        case 'PRODUCT_VIEWED':
                            const vp = event.payload as any;
                            const viewerName = vp?.customerName || vp?.userName;
                            if (viewerName) {
                                title = 'BROWSING';
                                message = `${viewerName} is looking at "${vp?.productName || 'a product'}".`;
                                icon = '👀';
                            } else {
                                title = 'VISITOR';
                                message = `A guest is viewing "${vp?.productName || 'a product'}" right now.`;
                                icon = '👣';
                            }
                            break;
                        case 'ADD_TO_CART':
                            const cp = event.payload as any;
                            const cartUser = cp?.customerName || cp?.userName;
                            title = 'CART';
                            message = `${cartUser || 'A shopper'} added "${cp?.productName || 'an item'}" to their cart.`;
                            icon = '🛒';
                            break;
                        case 'STOCK_REDUCED_BY_ORDER':
                        case 'STOCK_LOW':
                            const sp = event.payload as any;
                            const stockLeft = sp?.newStock || 0;

                            if (stockLeft <= 10) {
                                title = 'LOW STOCK';
                                message = `Urgent: "${sp?.productName || 'Product'}" is running low (${stockLeft} units left).`;
                                icon = '⚠️';
                            } else {
                                title = 'STOCK';
                                message = `"${sp?.productName || 'Product'}" inventory reduced to ${stockLeft} units.`;
                                icon = '📉';
                            }
                            link = '/dashboard/seller/inventory';
                            break;
                        case 'PRODUCT_CREATED':
                        case 'NEW_PRODUCT_ADDED':
                            const prod = event.payload as any;
                            title = 'NEW PRODUCT';
                            message = `"${prod?.productName || prod?.name || 'A new product'}" was added with ${prod?.initialStock || 0} units.`;
                            icon = '📦';
                            link = '/dashboard/seller/products';
                            break;
                        case 'PRODUCT_UPDATED':
                            title = 'UPDATE';
                            message = `"${(event.payload as any)?.productName || 'A product'}" details were modified.`;
                            icon = '✏️';
                            link = '/dashboard/seller/products';
                            break;
                        case 'PRODUCT_RESTOCKED':
                        case 'STOCK_ADJUSTED_MANUALLY':
                            const restockProd = event.payload as any;
                            const adjustmentCount = restockProd?.adjustment ?? restockProd?.quantityAdded ?? restockProd?.added ?? 0;
                            const isPositive = adjustmentCount > 0;

                            title = isPositive ? 'RESTOCK' : 'STOCK ADJUST';
                            message = `"${restockProd?.productName || 'A product'}" ${isPositive ? 'restocked' : 'adjusted'} (${isPositive ? '+' : ''}${adjustmentCount} units).`;
                            icon = isPositive ? '📦' : '🔧';
                            link = '/dashboard/seller/inventory';
                            break;
                        case 'USER_LOGIN':
                            title = 'LOGIN';
                            message = `${(event.payload as any)?.userName || 'A user'} logged in to the dashboard.`;
                            icon = '🔑';
                            break;
                        case 'SESSION_START':
                        case 'VISIT':
                            title = 'SESSION';
                            message = 'A new shopping session started on your store.';
                            icon = '🌐';
                            break;
                        case 'CHECKOUT_START':
                            const chkP = event.payload as any;
                            const checkoutUser = chkP?.customerName || chkP?.userName;
                            title = 'CHECKOUT';
                            message = `${checkoutUser || 'A customer'} started the checkout process.`;
                            icon = '💳';
                            break;
                        default:
                            title = event.eventType.replace(/_/g, ' ').toUpperCase();
                            if (title.length > 15) title = 'ACTIVITY';
                            message = `A store activity was recorded.`;
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

    async getInventorySnapshot(storeId: string) {
        try {
            // Get all products with their inventory records
            const products = await this.prisma.product.findMany({
                where: { storeId },
                select: {
                    id: true,
                    name: true,
                    stock: true,
                    updatedAt: true,
                    inventory: {
                        select: {
                            quantity: true,
                            lowStockAlert: true,
                            lastRestockedAt: true,
                            restockHistory: true,
                        }
                    }
                },
                orderBy: { stock: 'asc' }, // Low stock first
            });

            // Get recent PRODUCT_RESTOCKED events
            const recentRestockEvents = await this.prisma.eventLog.findMany({
                where: {
                    storeId,
                    eventType: { in: ['PRODUCT_RESTOCKED', 'STOCK_ADJUSTED_MANUALLY'] },
                },
                orderBy: { createdAt: 'desc' },
                take: 10,
            });

            const lowStockProducts = products.filter(p => p.stock <= (p.inventory?.lowStockAlert || 5));
            const outOfStockProducts = products.filter(p => p.stock === 0);

            // Detect recently added products (within last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const recentlyAddedProducts = products.filter(p => new Date(p.updatedAt) > sevenDaysAgo);

            return {
                totalProducts: products.length,
                outOfStockCount: outOfStockProducts.length,
                lowStockCount: lowStockProducts.length,
                recentlyAddedCount: recentlyAddedProducts.length,
                recentlyAddedProducts: recentlyAddedProducts.map(p => ({
                    name: p.name,
                    id: p.id,
                    currentStock: p.stock,
                    addedAt: p.updatedAt,
                })),
                outOfStockProducts: outOfStockProducts.map(p => ({ name: p.name, id: p.id })),
                lowStockProducts: lowStockProducts.map(p => ({
                    name: p.name,
                    currentStock: p.stock,
                    lastRestockedAt: p.inventory?.lastRestockedAt || null,
                })),
                products: products.map(p => ({
                    name: p.name,
                    currentStock: p.stock,
                    lastRestockedAt: p.inventory?.lastRestockedAt || null,
                    restockHistory: p.inventory?.restockHistory || [],
                })),
                recentStockEvents: recentRestockEvents.map(e => ({
                    type: e.eventType,
                    date: e.createdAt,
                    details: e.payload,
                })),
            };
        } catch (error) {
            console.error('[INVENTORY_SNAPSHOT_ERROR]', error);
            return {
                totalProducts: 0,
                outOfStockCount: 0,
                lowStockCount: 0,
                outOfStockProducts: [],
                lowStockProducts: [],
                products: [],
                recentStockEvents: [],
            };
        }
    }

    async getProductAnalysis(productId: string) {
        try {
            const product = await this.prisma.product.findUnique({
                where: { id: productId },
                include: {
                    inventory: true,
                    orderItems: {
                        where: {
                            order: {
                                status: 'PAID'
                            }
                        },
                        select: {
                            quantity: true,
                            price: true
                        }
                    }
                }
            });

            if (!product) return null;

            const totalSold = product.orderItems.reduce((acc, item) => acc + item.quantity, 0);
            const totalRevenue = product.orderItems.reduce((acc, item) => acc + (item.quantity * Number(item.price)), 0);

            return {
                id: product.id,
                name: product.name,
                currentStock: product.stock,
                totalSold,
                totalRevenue,
                lastRestockedAt: product.inventory?.lastRestockedAt || null,
                price: Number(product.price)
            };
        } catch (error) {
            console.error('[GET_PRODUCT_ANALYSIS_ERROR]', error);
            return null;
        }
    }
}
