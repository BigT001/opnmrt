import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) { }

  async getStats() {
    const [
      totalSellers,
      totalBuyers,
      totalOrders,
      totalRevenue,
      totalStores,
      topStores,
      recentSellers,
      recentBuyers,
      recentOrders,
      storesByPlan
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'SELLER' } }),
      this.prisma.user.count({ where: { role: 'BUYER' } }),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        where: { status: 'PAID' },
        _sum: { totalAmount: true },
      }),
      this.prisma.store.count(),
      this.prisma.store.findMany({
        take: 5,
        include: {
          _count: {
            select: { orders: true }
          }
        },
        orderBy: {
          orders: { _count: 'desc' }
        }
      }),
      this.prisma.user.findMany({
        where: { role: 'SELLER' },
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.findMany({
        where: { role: 'BUYER' },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { managedStore: true } // Some buyers might be associated with a store
      }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { store: true }
      }),
      this.prisma.store.groupBy({
        by: ['plan'],
        _count: { id: true }
      })
    ]);

    // Plan pricing (Mocked for now since it's not in DB yet)
    const planPricing: Record<string, number> = {
      'FREE': 0,
      'PRO': 15000,
      'ENTERPRISE': 50000
    };

    const tierRevenue = storesByPlan.reduce((acc, curr) => {
      const plan = curr.plan || 'FREE';
      acc[plan] = (acc[plan] || 0) + (curr._count.id * (planPricing[plan] || 0));
      return acc;
    }, {} as Record<string, number>);

    // Total OpenMart Revenue (Subscription Revenue)
    const totalSubscriptionRevenue = Object.values(tierRevenue).reduce((a, b) => a + b, 0);

    // Fetch daily revenue for the last 30 days (Revenue Trajectory)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyRevenueRaw = await this.prisma.order.findMany({
      where: {
        status: 'PAID',
        createdAt: { gte: thirtyDaysAgo }
      },
      select: {
        totalAmount: true,
        createdAt: true
      }
    });

    // Group by day for the chart
    const dailyRevenueMap = new Map<string, number>();
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyRevenueMap.set(d.toISOString().split('T')[0], 0);
    }

    dailyRevenueRaw.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (dailyRevenueMap.has(date)) {
        dailyRevenueMap.set(date, (dailyRevenueMap.get(date) || 0) + Number(order.totalAmount));
      }
    });

    const revenueGrowth = Array.from(dailyRevenueMap.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalSellers,
      totalBuyers,
      totalOrders,
      totalPlatformRevenue: totalRevenue._sum.totalAmount || 0,
      totalSubscriptionRevenue,
      tierRevenue: {
        free: tierRevenue['FREE'] || 0,
        pro: tierRevenue['PRO'] || 0,
        enterprise: tierRevenue['ENTERPRISE'] || 0
      },
      tierCounts: {
        free: storesByPlan.find(s => s.plan === 'FREE')?._count.id || 0,
        pro: storesByPlan.find(s => s.plan === 'PRO')?._count.id || 0,
        enterprise: storesByPlan.find(s => s.plan === 'ENTERPRISE')?._count.id || 0,
      },
      totalStores,
      topStores: topStores.map(s => ({
        name: s.name,
        subdomain: s.subdomain,
        orderCount: s._count.orders
      })),
      revenueGrowth,
      activity: {
        merchants: recentSellers.map(u => ({
          title: 'New Merchant Onboarded',
          desc: u.name || u.email,
          time: u.createdAt
        })),
        buyers: recentBuyers.map(u => ({
          title: 'New Buyer Joined',
          desc: u.name || u.email,
          time: u.createdAt
        })),
        system: recentOrders.map(o => ({
          title: 'Direct Transaction Successful',
          desc: `₦${o.totalAmount} at ${o.store.name}`,
          time: o.createdAt
        }))
      }
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
                orders: true,
              },
            },
          },
        },
      },
    });
  }

  async getBuyers() {
    return this.prisma.user.findMany({
      where: { role: 'BUYER' },
      include: {
        orders: true,
      },
    });
  }

  async getOrders() {
    return this.prisma.order.findMany({
      include: {
        buyer: true,
        store: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
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
                orders: true,
              },
            },
            orders: {
              include: {
                buyer: true,
                items: {
                  include: {
                    product: true,
                  },
                },
              },
              orderBy: { createdAt: 'desc' },
            },
            products: true,
          },
        },
      },
    });

    if (!seller) return null;

    // Fetch buyers associated with this store
    const buyers = await this.prisma.user.findMany({
      where: {
        role: 'BUYER',
        storeId: seller.managedStore?.id,
      },
      include: {
        orders: {
          where: { storeId: seller.managedStore?.id },
        },
      },
    });

    return {
      ...seller,
      buyers,
    };
  }
  async getLogistics() {
    return this.prisma.user.findMany({
      where: { role: 'DISPATCH' },
      include: {
        dispatchProfile: {
          include: {
            riders: true,
            tasks: {
              include: {
                rider: true,
                order: {
                  include: {
                    store: true,
                    buyer: true
                  }
                }
              },
              orderBy: { createdAt: 'desc' }
            }
          }
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveLogistics(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, include: { dispatchProfile: true } });
    if (!user || !user.dispatchProfile) {
      throw new Error('Logistics profile not found');
    }

    return this.prisma.dispatchProfile.update({
      where: { id: user.dispatchProfile.id },
      data: { isVerified: true },
    });
  }
}
