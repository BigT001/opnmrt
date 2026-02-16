import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../common/email.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
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
      throw new Error('Store not found for this seller');
    }

    return this.findByStoreId(store.id);
  }

  async create(
    userId: string,
    data: {
      storeId: string;
      totalAmount: number;
      items: { productId: string; quantity: number; price: number }[];
    },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

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
          tenantId: user.tenantId || 'system',
          storeId: data.storeId,
          buyerId: userId,
          totalAmount: data.totalAmount,
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
  }


  async updateOrderStatus(
    orderId: string,
    status: string,
    paymentRef?: string,
  ) {
    // 1. Wrap in a transaction for atomicity
    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      // Get current order to check previous status and items
      const existingOrder = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } } },
      });

      if (!existingOrder) {
        throw new Error('Order not found');
      }

      const previousStatus = existingOrder.status;

      // 2. Perform the update
      const result = await tx.order.update({
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

      // 3. Handle Inventory reduction if status changed to PAID for the first time
      if (status === 'PAID' && previousStatus !== 'PAID') {
        for (const item of existingOrder.items) {
          // Decrement Product stock
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          // Sync with Inventory table if record exists
          const inv = await tx.inventory.findUnique({
            where: { productId: item.productId },
          });

          if (inv) {
            await tx.inventory.update({
              where: { productId: item.productId },
              data: {
                quantity: {
                  decrement: item.quantity,
                },
              },
            });
          }

          // Record the event in EventLog for audit trailing
          await tx.eventLog.create({
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
      }

      return result;
    });

    // 4. Send emails (Deferred until after transaction success)
    if (status === 'PAID' && updatedOrder.buyer.email) {
      try {
        const emailResults = await this.emailService.sendOrderEmails({
          // Customer info
          customerEmail: updatedOrder.buyer.email,
          customerName: updatedOrder.buyer.name || 'Valued Customer',

          // Seller info
          sellerEmail: updatedOrder.store.owner.email,
          sellerName: updatedOrder.store.owner.name || 'Store Owner',

          // Order info
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

          // Store info
          storeName: updatedOrder.store.name,
          storeSubdomain: updatedOrder.store.subdomain,

          // Payment info
          paymentReference: paymentRef || 'N/A',
        });

        // Log results
        if (emailResults.buyer.success) {
          console.log('✅ Buyer email sent successfully');
        } else {
          console.error(
            '❌ Failed to send buyer email:',
            emailResults.buyer.error,
          );
        }

        if (emailResults.seller.success) {
          console.log('✅ Seller email sent successfully');
        } else {
          console.error(
            '❌ Failed to send seller email:',
            emailResults.seller.error,
          );
        }
      } catch (error) {
        console.error('Failed to send emails, but order was updated:', error);
      }
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
