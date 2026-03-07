import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { EmailService } from '../common/email.service';
import { RealtimeService } from '../realtime/realtime.service';
import { StoresService } from '../stores/stores.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private realtime: RealtimeService,
    private storesService: StoresService,
  ) { }

  async findByBuyerId(buyerId: string) {
    return this.prisma.order.findMany({
      where: { buyerId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByStoreId(storeId: string) {
    return this.prisma.order.findMany({
      where: { storeId },
      include: {
        buyer: true,
        items: {
          include: {
            product: true,
          },
        },
        dispatchTask: {
          include: {
            dispatch: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findBySellerUserId(userId: string) {
    const store = await this.prisma.store.findUnique({
      where: { ownerId: userId },
    });

    if (!store) {
      return [];
    }

    return this.findByStoreId(store.id);
  }

  async create(
    userId: string,
    data: {
      storeId: string;
      totalAmount: number;
      vatAmount?: number;
      customerName?: string;
      customerEmail?: string;
      items: { productId: string; quantity: number; price: number }[];
    },
  ) {
    try {
      if (!userId) {
        throw new UnauthorizedException('Please login to place an order.');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, tenantId: true }
      });

      if (!user) {
        throw new UnauthorizedException('Buyer account not found. Please log in again.');
      }

      const tenantId = user.tenantId || 'system';
      // SMART UPDATE: Find the SINGLE most recent active pending order
      const existingPendingOrder = await this.prisma.order.findFirst({
        where: {
          buyerId: userId,
          storeId: data.storeId,
          status: 'PENDING',
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (existingPendingOrder) {
        console.log(`♻️ Updating existing pending order with current cart: ${existingPendingOrder.id}`);

        return this.prisma.$transaction(async (tx) => {
          // 1. CLEANUP: Cancel any OTHER pending orders for this store/user to ensure single active order
          await tx.order.updateMany({
            where: {
              buyerId: userId,
              storeId: data.storeId,
              status: 'PENDING',
              id: { not: existingPendingOrder.id } // Don't cancel the one we're updating
            },
            data: { status: 'CANCELLED' }
          });

          // 2. Clear items from the active pending order
          await tx.orderItem.deleteMany({
            where: { orderId: existingPendingOrder.id },
          });

          // 2. Update order with new items and total
          const updatedOrder = await tx.order.update({
            where: { id: existingPendingOrder.id },
            data: {
              totalAmount: data.totalAmount,
              vatAmount: data.vatAmount || 0,
              lastAttemptAt: new Date(),
              retryCount: { increment: 1 },
              items: {
                create: data.items.map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.price,
                })),
              },
            },
            include: {
              items: {
                include: { product: true },
              },
            },
          });

          return updatedOrder;
        });
      }

      // No existing pending order - create new one
      console.log('✨ Creating new pending order (first attempt)');

      return this.prisma.$transaction(async (tx) => {
        // 1. Cancel any stale pending orders (just in case they exist)
        await tx.order.updateMany({
          where: {
            buyerId: userId,
            storeId: data.storeId,
            status: 'PENDING',
          },
          data: { status: 'CANCELLED' }
        });

        // 2. Create the new active order
        const order = await tx.order.create({
          data: {
            tenantId,
            storeId: data.storeId,
            buyerId: userId,
            customerName: data.customerName,
            customerEmail: data.customerEmail || user.email,
            totalAmount: data.totalAmount,
            vatAmount: data.vatAmount || 0,
            status: 'PENDING',
            retryCount: 0,
            items: {
              create: data.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
          include: {
            items: {
              include: { product: true },
            },
          },
        });

        return order;
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      console.error('[ORDERS_CREATE_ERROR]', error);
      throw new BadRequestException(error?.message || 'Failed to create order');
    }
  }

  async createOfflineOrder(
    userId: string,
    data: {
      storeId: string;
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
      paymentMethod?: string;
      discount?: number;
      totalAmount: number;
      vatAmount?: number;
      items: { productId: string; quantity: number; price: number }[];
    },
  ) {
    const store = await this.prisma.store.findUnique({
      where: { id: data.storeId },
    });

    if (!store) throw new Error('Store not found');
    if (store.ownerId !== userId) throw new Error('Unauthorized');

    // Pre-fetch inventory records OUTSIDE the transaction to minimize connection hold time
    const productIds = data.items.map((i) => i.productId);
    const inventoryRecords = await this.prisma.inventory.findMany({
      where: { productId: { in: productIds } },
      select: { productId: true },
    });
    const inventoryProductIds = new Set(inventoryRecords.map((r) => r.productId));

    try {
      // Increased timeout to handle remote DB latency; all writes are now parallelized
      const order = await this.prisma.$transaction(async (tx) => {
        // 1. Create the order record
        const createdOrder = await tx.order.create({
          data: {
            tenantId: store.tenantId || 'system',
            storeId: data.storeId,
            type: 'OFFLINE',
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerPhone: data.customerPhone,
            paymentMethod: data.paymentMethod || 'CASH',
            discount: data.discount || 0,
            totalAmount: data.totalAmount,
            vatAmount: data.vatAmount || 0,
            status: 'PAID',
            items: {
              create: data.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          } as any,
          include: {
            items: {
              include: { product: true },
            },
          },
        });

        // 2. Parallelise all inventory & event writes for speed
        await Promise.all([
          // 2a. Decrement product stock for all items in one batch
          ...data.items.map((item) =>
            tx.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            }),
          ),
          // 2b. Decrement inventory table rows only where they exist
          ...data.items
            .filter((item) => inventoryProductIds.has(item.productId))
            .map((item) =>
              tx.inventory.update({
                where: { productId: item.productId },
                data: { quantity: { decrement: item.quantity } },
              }),
            ),
          // 2c. Batch-create event logs for audit trail
          tx.eventLog.createMany({
            data: data.items.map((item) => ({
              tenantId: store.tenantId || 'system',
              storeId: data.storeId,
              eventType: 'STOCK_REDUCED_BY_OFFLINE_ORDER',
              payload: {
                orderId: createdOrder.id,
                productId: item.productId,
                quantityReduced: item.quantity,
              },
            })),
          }),
        ]);

        return createdOrder;
      }, { timeout: 15000 }); // 15s timeout for remote DB

      // Side-effects run AFTER transaction commits — don't hold the connection
      this.storesService.invalidateStats(data.storeId);
      this.realtime.emitStatsUpdate(data.storeId);

      return order;
    } catch (error) {
      console.error('CRITICAL: Failed to create offline order:', error);
      throw error;
    }
  }

  async updateOrderStatus(
    orderId: string,
    status: string,
    paymentRef?: string,
    txClient?: Prisma.TransactionClient,
  ) {
    console.log(`[ORDERS_DEBUG] 🔄 Updating order ${orderId} status to: ${status} (ref: ${paymentRef})`);

    const client = txClient || (this.prisma as any);

    // 1. Perform update (using internal transaction if no txClient provided)
    const operation = async (p: Prisma.TransactionClient) => {
      console.log(`[ORDERS_DEBUG] 🔍 Looking up order ${orderId}...`);
      // Get current order to check previous status and items
      const existingOrder = await p.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } } },
      });

      if (!existingOrder) {
        console.error(`[ORDERS_DEBUG] ❌ Order ${orderId} NOT FOUND`);
        throw new Error('Order not found');
      }

      const previousStatus = existingOrder.status;
      console.log(`[ORDERS_DEBUG] 📋 Order found. Previous status: ${previousStatus}`);

      // 2. Perform the update
      console.log(`[ORDERS_DEBUG] 🚀 Executing DB update for order ${orderId}...`);
      const result = await p.order.update({
        where: { id: orderId },
        data: {
          status,
          ...(paymentRef && { paymentRef }),
        },
        include: {
          buyer: true,
          store: {
            include: {
              owner: true, // Include store owner for seller email
            },
          },
          items: {
            include: {
              product: true,
            },
          },
        },
      });
      console.log(`[ORDERS_DEBUG] ✅ DB update successful for order ${orderId}`);

      // 3. Handle Inventory reduction if status changed to PAID for the first time
      if (status === 'PAID' && previousStatus !== 'PAID') {
        console.log(`[ORDERS_DEBUG] 📉 Reducing inventory for order ${orderId}...`);
        for (const item of existingOrder.items) {
          // Decrement Product stock
          await p.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          // Sync with Inventory table if record exists
          const inv = await p.inventory.findUnique({
            where: { productId: item.productId },
          });

          if (inv) {
            await p.inventory.update({
              where: { productId: item.productId },
              data: {
                quantity: {
                  decrement: item.quantity,
                },
              },
            });
          }

          // Record the event in EventLog for audit trailing
          await p.eventLog.create({
            data: {
              tenantId: existingOrder.tenantId,
              storeId: existingOrder.storeId,
              eventType: 'STOCK_REDUCED_BY_ORDER',
              payload: {
                orderId: existingOrder.id,
                productId: item.productId,
                productName: item.product.name,
                quantityReduced: item.quantity,
                prevStock: item.product.stock,
                newStock: item.product.stock - item.quantity,
              },
            },
          });
        }

        // Record ORDER_PLACED event for notifications
        await p.eventLog.create({
          data: {
            tenantId: existingOrder.tenantId,
            storeId: existingOrder.storeId,
            eventType: 'ORDER_PLACED',
            payload: {
              orderId: existingOrder.id,
              amount: Number(existingOrder.totalAmount),
              customerName: result.buyer?.name || 'A Customer',
              customerId: result.buyer?.id,
              itemsCount: existingOrder.items.length
            },
          },
        });
      }

      return result;
    };

    const updatedOrder = txClient ? await operation(txClient) : await this.prisma.$transaction(operation);

    // 4. Real-time updates for dashboard
    if (status === 'PAID') {
      this.storesService.invalidateStats(updatedOrder.storeId);
      this.realtime.emitStatsUpdate(updatedOrder.storeId);
      this.realtime.emitNotification(updatedOrder.storeId, {
        eventType: 'ORDER_PLACED',
        payload: {
          customerName: updatedOrder.buyer?.name || 'A Customer',
          amount: Number(updatedOrder.totalAmount),
          orderId: updatedOrder.id
        },
        createdAt: new Date()
      });
    }

    // 4. Send emails (FIRE-AND-FORGET: Do not await to avoid blocking the user response)
    const buyer = updatedOrder.buyer;
    if (status === 'PAID' && buyer?.email) {
      // Background process: intentionally not awaited
      this.emailService.sendOrderEmails({
        customerEmail: buyer.email,
        customerName: buyer.name || 'Valued Customer',
        sellerEmail: updatedOrder.store.owner.email,
        sellerName: updatedOrder.store.owner.name || 'Store Owner',
        orderId: updatedOrder.id,
        orderDate: new Date(updatedOrder.createdAt).toLocaleDateString(
          'en-US',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          },
        ),
        items: updatedOrder.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: Number(item.price),
        })),
        totalAmount: Number(updatedOrder.totalAmount),
        storeName: updatedOrder.store.name,
        storeSubdomain: updatedOrder.store.subdomain,
        paymentReference: paymentRef || 'N/A',
      }).then(emailResults => {
        if (emailResults.buyer.success) {
          console.log('✅ Buyer email sent successfully');
        } else {
          console.error('❌ Failed to send buyer email:', emailResults.buyer.error);
        }
        if (emailResults.seller.success) {
          console.log('✅ Seller email sent successfully');
        } else {
          console.error('❌ Failed to send seller email:', emailResults.seller.error);
        }
      }).catch(error => {
        console.error('🔥 CRITICAL: Background email sending crashed:', error);
      });
    }

    return updatedOrder;
  }

  async trackAbandonment(orderId: string, reason?: string) {
    console.log(`📊 Tracking abandonment for order ${orderId}: ${reason || 'unknown'}`);

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        abandonReason: reason || 'payment_modal_closed',
        lastAttemptAt: new Date(),
      },
    });
  }
  async updateStatusBySeller(userId: string, orderId: string, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { store: true },
    });

    if (!order) throw new Error('Order not found');
    if (order.store.ownerId !== userId) {
      throw new Error('Unauthorized access');
    }

    return this.updateOrderStatus(orderId, status);
  }
}
