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
    const [totalOrders, totalRevenue, totalProducts, topProducts, funnelData] =
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
          _count: { _all: true },
        }),
      ]);

    // Fetch product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });
        return {
          id: product?.id,
          name: product?.name,
          price: Number(product?.price || 0),
          stocks: product?.stock,
          sales: item._sum.quantity,
          earnings: Number(product?.price || 0) * (item._sum.quantity || 0),
          image: product?.images?.[0] || '',
        };
      }),
    );

    const funnel: any = {
      sessions: 0,
      productViews: 0,
      addToCart: 0,
      checkout: totalOrders,
    };

    funnelData.forEach((item) => {
      if (item.eventType === 'SESSION_START') funnel.sessions = item._count._all;
      if (item.eventType === 'PRODUCT_VIEW')
        funnel.productViews = item._count._all;
      if (item.eventType === 'ADD_TO_CART') funnel.addToCart = item._count._all;
      if (item.eventType === 'CHECKOUT_START')
        funnel.checkout = item._count._all;
    });

    // Fallback/Mock Ratios if no events yet
    if (funnel.sessions === 0 && funnel.productViews === 0) {
      funnel.sessions = Math.max(totalOrders * 12, 142);
      funnel.productViews = Math.max(totalOrders * 8, 86);
      funnel.addToCart = Math.max(totalOrders * 3, 24);
      funnel.checkout = totalOrders;
    }

    return {
      totalOrders,
      totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
      totalProducts,
      topProducts: topProductsWithDetails,
      funnel,
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

    return rawCustomers.map((customer) => {
      const totalSpent = customer.orders.reduce(
        (sum, order) => sum + Number(order.totalAmount),
        0,
      );
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
