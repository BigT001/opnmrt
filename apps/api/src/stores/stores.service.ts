import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class StoresService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
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

  async update(
    id: string,
    data: any,
    files?: { logo?: Express.Multer.File[]; heroImage?: Express.Multer.File[] },
  ) {
    try {
      const updateData: any = { ...data };
      console.log('Update Store Data:', JSON.stringify(updateData, null, 2));

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
    try {
      console.log('[GET_STATS] Starting for storeId:', storeId);

      const [totalOrders, totalRevenue, totalProducts, topProducts, funnelData, totalProductsSoldData, totalCustomers, activeOrders, weeklySalesData] =
        await Promise.all([
          this.prisma.order.count({ where: { storeId } }),
          this.prisma.order.aggregate({
            where: { storeId, status: 'PAID' },
            _sum: { totalAmount: true },
          }),
          this.prisma.product.count({ where: { storeId } }),
          // Top Selling Products
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
          }),
          // Aggregate Funnel from EventLog
          this.prisma.eventLog.groupBy({
            by: ['eventType'],
            where: { storeId },
            _count: { id: true },
          }),
          // Total Products Sold (Quantity)
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
          }),
          // Total Customers
          this.prisma.user.count({
            where: {
              role: 'BUYER',
              storeId: storeId,
            },
          }),
          // Active Orders
          this.prisma.order.count({
            where: {
              storeId,
              status: { in: ['PAID', 'SHIPPED'] },
            },
          }),
          // Weekly Sales Chart Data (Last 7 Days)
          this.prisma.order.groupBy({
            by: ['createdAt'],
            where: {
              storeId,
              status: 'PAID',
              createdAt: {
                gte: new Date(new Date().setDate(new Date().getDate() - 7)),
              },
            },
            _sum: {
              totalAmount: true,
            },
          }),
        ]);

      console.log('[GET_STATS] Basic queries completed');
      console.log('[GET_STATS] Top products count:', topProducts.length);

      // Fetch product details for top products with safety
      const topProductsWithDetails = await Promise.all(
        topProducts.map(async (item) => {
          try {
            const product = await this.prisma.product.findUnique({
              where: { id: item.productId },
            });
            return {
              id: product?.id,
              name: product?.name || 'Deleted Product',
              price: Number(product?.price || 0),
              stocks: product?.stock || 0,
              sales: item._sum.quantity || 0,
              earnings: Number(product?.price || 0) * (item._sum.quantity || 0),
              image: product?.images?.[0] || '',
            };
          } catch (e) {
            console.error('[TOP_PRODUCT_FETCH_ERROR]', item.productId, e);
            return null;
          }
        }),
      );

      console.log('[GET_STATS] Product details fetched');

      const funnel: any = {
        sessions: 0,
        productViews: 0,
        addToCart: 0,
        checkout: totalOrders,
      };

      funnelData.forEach((item) => {
        if (item.eventType === 'SESSION_START') funnel.sessions = item._count.id;
        if (item.eventType === 'PRODUCT_VIEW')
          funnel.productViews = item._count.id;
        if (item.eventType === 'ADD_TO_CART') funnel.addToCart = item._count.id;
        if (item.eventType === 'CHECKOUT_START')
          funnel.checkout = item._count.id;
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
        // Since we grouped by createdAt (timestamp), we need to aggregate by day in JS
        const salesForDay = weeklySalesData.filter((item) => {
          const itemDate = new Date(item.createdAt).toISOString().split('T')[0];
          return itemDate === day.date;
        });
        const total = salesForDay.reduce((acc, curr) => acc + (Number(curr._sum.totalAmount) || 0), 0);
        return { name: day.dayName, value: total };
      });

      // Remove Fallback/Mock Ratios to ensure accurate data for new accounts
      // console.log('[GET_STATS] Success');

      return {
        totalOrders,
        totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
        totalProducts,
        totalProductsSold: totalProductsSoldData._sum.quantity || 0,
        totalCustomers,
        activeOrders,
        topProducts: topProductsWithDetails.filter(Boolean),
        funnel,
        weeklySales,
      };
    } catch (error) {
      console.error('[GET_STORE_STATS_SERVICE_ERROR]', {
        storeId,
        error: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
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
