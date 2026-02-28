import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { EncryptionUtil } from '../common/encryption.util';

@Injectable()
export class StoresService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) { }

  async findBySubdomain(subdomain: string) {
    return this.prisma.store.findUnique({
      where: { subdomain },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          }
        }
      }
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

  async update(
    id: string,
    data: any,
    files?: {
      logo?: Express.Multer.File[];
      heroImage?: Express.Multer.File[];
      utilityBill?: Express.Multer.File[];
    },
  ) {
    try {
      const updateData: any = { ...data };
      console.log('Update Store Data:', JSON.stringify(updateData, null, 2));

      // Handle boolean strings from multipart/form-data
      const booleanFields = [
        'aiMessaging',
        'aiInventory',
        'aiStrategy',
        'aiFinancials',
        'chatAiEnabled',
        'useWhatsAppCheckout',
      ];
      booleanFields.forEach((field) => {
        if (updateData[field] !== undefined) {
          if (updateData[field] === 'true' || updateData[field] === true) {
            updateData[field] = true;
          } else if (
            updateData[field] === 'false' ||
            updateData[field] === false
          ) {
            updateData[field] = false;
          }
        }
      });

      // Parse categories JSON string from multipart form-data
      if (updateData.categories !== undefined) {
        try {
          updateData.categories =
            typeof updateData.categories === 'string'
              ? JSON.parse(updateData.categories)
              : updateData.categories;
        } catch {
          updateData.categories = [];
        }
      }

      if (files?.logo?.[0]) {
        const result = await this.cloudinary.uploadFile(
          files.logo[0],
          'opnmart-stores/logos',
        );
        updateData.logo = result.secure_url;
      }

      if (files?.heroImage?.[0]) {
        const result = await this.cloudinary.uploadFile(
          files.heroImage[0],
          'opnmart-stores/heros',
        );
        updateData.heroImage = result.secure_url;
      }

      // Handle encryption for Paystack keys if they are being updated
      if (updateData.paystackSecretKey === '********') {
        delete updateData.paystackSecretKey;
      } else if (updateData.paystackSecretKey) {
        updateData.paystackSecretKey = await EncryptionUtil.encrypt(updateData.paystackSecretKey);
      }

      if (updateData.paystackWebhookSecret === '********') {
        delete updateData.paystackWebhookSecret;
      } else if (updateData.paystackWebhookSecret) {
        updateData.paystackWebhookSecret = await EncryptionUtil.encrypt(updateData.paystackWebhookSecret);
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

  public invalidateStats(storeId: string) {
    this.statsCache.delete(storeId);
    console.log(`[GET_STATS][${storeId}] Cache invalidated manually`);
  }

  private statsCache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 2 * 60 * 1000; // 2 minutes cache for "instant" feel

  async getStoreStats(storeId: string) {
    const cached = this.statsCache.get(storeId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log(`[GET_STATS][${storeId}] Returning cached data`);
      return cached.data;
    }

    const startTime = Date.now();
    try {
      console.log(`[GET_STATS][${storeId}] Execution started at ${new Date().toISOString()}`);

      // Parallelize all primary queries
      const [
        totalOrders,
        totalRevenueResult,
        totalProducts,
        funnelData,
        totalProductsSoldResult,
        totalCustomers,
        activeOrders,
        weeklySalesData,
        topProductsResult,
        storeData
      ] = await Promise.all([
        this.prisma.order.count({ where: { storeId } }).catch(e => { console.error(`[STATS_ERROR][${storeId}] totalOrders:`, e.message); return 0; }),
        this.prisma.order.aggregate({
          where: { storeId, status: 'PAID' },
          _sum: { totalAmount: true },
        }).catch(e => { console.error(`[STATS_ERROR][${storeId}] totalRevenue:`, e.message); return { _sum: { totalAmount: 0 } }; }),
        this.prisma.product.count({ where: { storeId } }).catch(e => { console.error(`[STATS_ERROR][${storeId}] totalProducts:`, e.message); return 0; }),
        this.prisma.eventLog.groupBy({
          by: ['eventType'],
          where: { storeId },
          _count: { id: true },
        }).catch(e => { console.error(`[STATS_ERROR][${storeId}] funnelData:`, e.message); return []; }),
        this.prisma.orderItem.aggregate({
          where: {
            order: {
              storeId,
              status: 'PAID',
            },
          },
          _sum: {
            quantity: true,
          },
        }).catch(e => { console.error(`[STATS_ERROR][${storeId}] totalProductsSold:`, e.message); return { _sum: { quantity: 0 } }; }),
        this.prisma.user.count({
          where: {
            role: 'BUYER',
            storeId: storeId,
          },
        }).catch(e => { console.error(`[STATS_ERROR][${storeId}] totalCustomers:`, e.message); return 0; }),
        this.prisma.order.count({
          where: {
            storeId,
            status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] },
          },
        }).catch(e => { console.error(`[STATS_ERROR][${storeId}] activeOrders:`, e.message); return 0; }),
        this.prisma.order.findMany({
          where: {
            storeId,
            status: 'PAID',
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
          select: {
            totalAmount: true,
            createdAt: true,
          },
        }).catch(e => { console.error(`[STATS_ERROR][${storeId}] weeklySales:`, e.message); return []; }),
        this.prisma.orderItem.groupBy({
          by: ['productId'],
          where: {
            order: {
              storeId,
              status: 'PAID',
            },
          },
          _sum: {
            quantity: true,
          },
          orderBy: {
            _sum: {
              quantity: 'desc',
            },
          },
          take: 5,
        }).catch(e => { console.error(`[STATS_ERROR][${storeId}] topProducts:`, e.message); return []; }),
        this.prisma.store.findUnique({
          where: { id: storeId },
          select: {
            logo: true,
            paystackPublicKey: true,
            biography: true,
            theme: true,
            primaryColor: true,
            onboardingDismissed: true,
          }
        })
      ]);

      console.log(`[GET_STATS][${storeId}] DB Core Queries completed in ${Date.now() - startTime}ms`);

      // Optimize product details fetching - use findMany instead of findUnique in a loop
      const productIds = topProductsResult.map(item => item.productId);
      const products = productIds.length > 0
        ? await this.prisma.product.findMany({ where: { id: { in: productIds } } })
        : [];

      const topProductsWithDetails = topProductsResult.map((item) => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return null;
        return {
          id: product.id,
          name: product.name,
          price: Number(product.price || 0),
          stocks: product.stock || 0,
          sales: item._sum.quantity || 0,
          earnings: Number(product.price || 0) * (item._sum.quantity || 0),
          image: product.images?.[0] || '',
        };
      }).filter(Boolean);

      const funnel: any = {
        sessions: 0,
        productViews: 0,
        addToCart: 0,
        checkout: totalOrders,
      };

      funnelData.forEach((item: any) => {
        if (item.eventType === 'SESSION_START') funnel.sessions = item._count.id;
        if (item.eventType === 'PRODUCT_VIEW') funnel.productViews = item._count.id;
        if (item.eventType === 'ADD_TO_CART') funnel.addToCart = item._count.id;
        if (item.eventType === 'CHECKOUT_START') funnel.checkout = item._count.id;
      });

      // Process Weekly Sales Data
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          date: d.toISOString().split('T')[0],
          dayName: days[d.getDay()],
        };
      });

      const weeklySales = last7Days.map((day) => {
        const salesForDay = (weeklySalesData as any[]).filter((item) => {
          const itemDate = new Date(item.createdAt).toISOString().split('T')[0];
          return itemDate === day.date;
        });
        const total = salesForDay.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);
        return { name: day.dayName, value: total };
      });

      const result = {
        totalOrders,
        totalRevenue: Number(totalRevenueResult?._sum?.totalAmount || 0),
        totalProducts,
        totalProductsSold: totalProductsSoldResult?._sum?.quantity || 0,
        totalCustomers,
        activeOrders,
        topProducts: topProductsWithDetails.filter(Boolean),
        funnel,
        weeklySales,
        onboarding: {
          hasProducts: totalProducts > 0,
          hasLogo: !!storeData?.logo,
          hasPayments: !!storeData?.paystackPublicKey,
          hasBio: !!storeData?.biography,
          dismissed: !!storeData?.onboardingDismissed,
        }
      };

      console.log(`[GET_STATS][${storeId}] Total execution time: ${Date.now() - startTime}ms`);
      this.statsCache.set(storeId, { data: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      console.error(`[GET_STORE_STATS_FATAL][${storeId}]`, {
        message: error.message,
        duration: Date.now() - startTime
      });
      // Fallback object to prevent dashboard crash
      return {
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalProductsSold: 0,
        totalCustomers: 0,
        activeOrders: 0,
        topProducts: [],
        funnel: { sessions: 0, productViews: 0, addToCart: 0, checkout: 0 },
        weeklySales: [],
      };
    }
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
            status: true,
          },
        },
      },
    });

    return rawCustomers.map((customer) => {
      let validOrdersCount = 0;
      const totalSpent = customer.orders.reduce((sum, order) => {
        if (
          ['PAID', 'COMPLETED', 'DELIVERED', 'SHIPPED'].includes(
            order.status as string,
          )
        ) {
          validOrdersCount++;
          return sum + Number(order.totalAmount);
        }
        return sum;
      }, 0);
      const lastSeen =
        customer.orders.length > 0
          ? customer.orders.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          )[0].createdAt
          : customer.createdAt;

      return {
        id: customer.id,
        name: customer.name || 'Anonymous',
        email: customer.email,
        image: customer.image,
        ordersCount: customer.orders.length,
        validOrdersCount,
        totalSpent,
        lastSeen,
      };
    });
  }

  async getCustomerStats(storeId: string) {
    const customers = await this.getCustomers(storeId);

    const totalCustomers = customers.length;
    const totalSpend = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalOrders = customers.reduce((sum, c) => sum + c.validOrdersCount, 0);

    const avgOrderValue = totalOrders > 0 ? totalSpend / totalOrders : 0;
    const customerLTV = totalCustomers > 0 ? totalSpend / totalCustomers : 0;

    // Real Retention Rate: Customers with > 1 order
    const repeatCustomers = customers.filter((c) => c.ordersCount > 1).length;
    const retentionRate =
      totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

    return {
      totalCustomers,
      avgOrderValue,
      customerLTV,
      retentionRate: Math.round(retentionRate),
    };
  }

  async getCustomerDetails(storeId: string, customerId: string) {
    const customer = await this.prisma.user.findUnique({
      where: { id: customerId },
      include: {
        orders: {
          where: { storeId: storeId },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Calculate aggregates
    const stats = {
      pending: { count: 0, value: 0 },
      paid: { count: 0, value: 0 },
      cancelled: { count: 0, value: 0 },
      total: { count: 0, value: 0 },
    };

    customer.orders.forEach((order) => {
      const val = Number(order.totalAmount);
      stats.total.count++;
      stats.total.value += val;

      if (order.status === 'PENDING') {
        stats.pending.count++;
        stats.pending.value += val;
      } else if (
        ['PAID', 'COMPLETED', 'DELIVERED', 'SHIPPED'].includes(order.status)
      ) {
        stats.paid.count++;
        stats.paid.value += val;
      } else if (order.status === 'CANCELLED') {
        stats.cancelled.count++;
        stats.cancelled.value += val;
      }
    });

    return {
      profile: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        image: customer.image,
        shippingAddress: customer.shippingAddress,
        createdAt: customer.createdAt,
      },
      stats,
      recentOrders: customer.orders.slice(0, 50),
    };
  }
}
