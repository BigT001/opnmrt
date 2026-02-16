import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatGateway } from './chat.gateway';
import { ChatAiService } from './chat-ai.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private chatGateway: ChatGateway,
    private ai: ChatAiService,
  ) { }

  async sendMessage(
    userId: string,
    data: {
      content: string;
      storeId: string;
      orderId?: string;
      recipientId?: string;
    },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    //@ts-ignore
    if (!user) throw new NotFoundException('User not found');

    let recipientId = data.recipientId;

    if (!recipientId) {
      const store = await this.prisma.store.findUnique({
        where: { id: data.storeId },
      });
      if (store) {
        recipientId = store.ownerId;
      }
    }

    const message = await this.prisma.message.create({
      data: {
        content: data.content,
        storeId: data.storeId,
        tenantId: user.tenantId || 'system',
        orderId: data.orderId,
        senderId: userId,
        senderRole: user.role,
        recipientId: recipientId, // Now always set
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    });

    // Notify recipients via WebSocket
    if (recipientId) {
      this.chatGateway.sendToUser(recipientId, 'newMessage', message);
    }

    // AI AUTO-REPLY LOGIC:
    // If a BUYER sends a message to a STORE, and that store has AI enabled, generate a response.
    // We execute this in the background (no await) to keep the initial message send "instant".
    if (user.role === 'BUYER' && recipientId) {
      this.handleAiAutoReply(userId, data.storeId, data.content, recipientId);
    }

    return message;
  }

  private async handleAiAutoReply(buyerId: string, storeId: string, content: string, ownerId: string) {
    try {
      const store = await this.prisma.store.findUnique({
        where: { id: storeId },
        // @ts-ignore
        select: { chatAiEnabled: true, ownerId: true }
      });

      // @ts-ignore
      if (store?.chatAiEnabled) {
        // Get last few messages for context
        const history = await this.prisma.message.findMany({
          where: {
            storeId: storeId,
            OR: [
              { senderId: buyerId, recipientId: ownerId },
              { senderId: ownerId, recipientId: buyerId }
            ]
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        });

        // Generate AI response
        const aiResponse = await this.ai.generateSupportResponse({
          storeId: storeId,
          buyerId: buyerId,
          messageHistory: history.reverse(),
          currentMessage: content
        });

        // Send the AI response as the store owner
        if (aiResponse) {
          setTimeout(async () => {
            const aiMsg = await this.sendMessage(ownerId, {
              content: aiResponse,
              storeId: storeId,
              recipientId: buyerId
            });

            // Notify the store owner dashboard as well
            this.chatGateway.sendToUser(ownerId, 'newMessage', aiMsg);
          }, 500); // Slightly reduced delay
        }
      }
    } catch (err) {
      console.error('[AI_AUTO_REPLY_ERROR]', err);
    }
  }

  async toggleAiMode(storeId: string, enabled: boolean) {
    return this.prisma.store.update({
      where: { id: storeId },
      // @ts-ignore - Temporary suppression: field exists in DB but Prisma client needs manual refresh (EPERM on generate)
      data: { chatAiEnabled: enabled },
      // @ts-ignore - Temporary suppression: field exists in DB but Prisma client needs manual refresh
      select: { id: true, chatAiEnabled: true }
    });
  }

  async getAiSuggestion(storeId: string, otherUserId: string, currentMessage: string) {
    const history = await this.prisma.message.findMany({
      where: {
        storeId,
        OR: [
          { senderId: otherUserId },
          { recipientId: otherUserId }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    return this.ai.generateSupportResponse({
      storeId,
      buyerId: otherUserId,
      messageHistory: history.reverse(),
      currentMessage
    });
  }

  async getMessages(userId: string, storeId: string) {
    return this.prisma.message.findMany({
      where: {
        storeId,
        OR: [{ senderId: userId }, { recipientId: userId }],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { name: true, role: true } },
      },
    });
  }

  async getStoreConversations(storeId: string, userId: string) {
    // 1. Get existing message history
    const messages = await this.prisma.message.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    const conversationsMap = new Map();

    messages.forEach((msg) => {
      const isFromBuyer = msg.senderRole === 'BUYER';
      const otherUserId = isFromBuyer ? msg.senderId : msg.recipientId;

      if (otherUserId && otherUserId !== userId) {
        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            userId: otherUserId,
            userName: isFromBuyer ? msg.sender.name : 'Customer',
            lastMessage: msg.content,
            time: msg.createdAt,
            unreadCount: 0,
          });
        }

        // If this is a message FROM the buyer TO us, and it's unread
        if (
          msg.senderId === otherUserId &&
          msg.recipientId === userId &&
          !msg.isRead
        ) {
          conversationsMap.get(otherUserId).unreadCount++;
        }

        // Keep trying to find the best name if we don't have it
        if (
          isFromBuyer &&
          conversationsMap.get(otherUserId).userName === 'Customer'
        ) {
          conversationsMap.get(otherUserId).userName = msg.sender.name;
        }
      }
    });

    // 2. Fetch distinct buyers who have placed orders
    const orderBuyers = await this.prisma.order.findMany({
      where: { storeId },
      distinct: ['buyerId'],
      select: {
        buyer: {
          select: { id: true, name: true, createdAt: true },
        },
      },
    });

    // 3. Fetch users explicitly linked to this store (e.g. signed up on store domain)
    const storeUsers = await this.prisma.user.findMany({
      where: { storeId, role: 'BUYER' },
      select: { id: true, name: true, createdAt: true },
    });

    // 4. Merge all potential contacts
    const allPotentialContacts = new Map<string, { id: string; name: string | null; createdAt: Date }>();

    orderBuyers.forEach((order) => {
      if (order.buyer) allPotentialContacts.set(order.buyer.id, order.buyer);
    });

    storeUsers.forEach((user) => {
      allPotentialContacts.set(user.id, user);
    });

    // 5. Add any missing contacts to conversations map
    for (const contact of allPotentialContacts.values()) {
      if (contact.id !== userId && !conversationsMap.has(contact.id)) {
        conversationsMap.set(contact.id, {
          userId: contact.id,
          userName: contact.name || 'Customer',
          lastMessage: 'Start a conversation',
          time: contact.createdAt,
          unreadCount: 0,
        });
      }
    }

    // Sort by most recent activity (message time or signup time)
    return Array.from(conversationsMap.values()).sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );
  }

  async getUserMessagesForStore(
    userId: string,
    storeId: string,
    otherUserId: string,
  ) {
    // Direct thread between seller and a specific buyer
    const messages = await this.prisma.message.findMany({
      where: {
        storeId,
        OR: [
          { senderId: userId, recipientId: otherUserId },
          { senderId: otherUserId, recipientId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { name: true, role: true } },
      },
    });

    // Mark as read when seller views the thread
    await this.markAsRead(userId, otherUserId, storeId);

    return messages;
  }

  async markAsRead(userId: string, otherUserId: string, storeId: string) {
    return this.prisma.message.updateMany({
      where: {
        storeId,
        senderId: otherUserId,
        recipientId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string, storeId?: string) {
    return this.prisma.message.count({
      where: {
        recipientId: userId,
        ...(storeId && { storeId }),
        isRead: false,
      },
    });
  }
}
