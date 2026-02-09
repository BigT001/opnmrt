import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
    constructor(
        private prisma: PrismaService,
        private chatGateway: ChatGateway
    ) { }

    async sendMessage(userId: string, data: { content: string, storeId: string, orderId?: string, recipientId?: string }) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const message = await this.prisma.message.create({
            data: {
                content: data.content,
                storeId: data.storeId,
                tenantId: user.tenantId || 'system',
                orderId: data.orderId,
                senderId: userId,
                senderRole: user.role,
                recipientId: data.recipientId,
            },
            include: {
                sender: { select: { id: true, name: true, role: true } }
            }
        });

        // Notify recipient via WebSocket
        if (data.recipientId) {
            this.chatGateway.sendToUser(data.recipientId, 'newMessage', message);
        } else {
            // If buyer sends to store, notify store owner (seller)
            const store = await this.prisma.store.findUnique({ where: { id: data.storeId } });
            if (store) {
                this.chatGateway.sendToUser(store.ownerId, 'newMessage', message);
            }
        }

        return message;
    }

    async getMessages(userId: string, storeId: string) {
        return this.prisma.message.findMany({
            where: {
                storeId,
                OR: [
                    { senderId: userId },
                    { recipientId: userId }
                ]
            },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: { select: { name: true, role: true } }
            }
        });
    }

    async getStoreConversations(storeId: string) {
        const messages = await this.prisma.message.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' },
            include: {
                sender: {
                    select: { id: true, name: true, email: true, role: true }
                }
            }
        });

        const conversationsMap = new Map();

        messages.forEach(msg => {
            const otherUserId = msg.senderRole === 'BUYER' ? msg.senderId : msg.recipientId;

            if (otherUserId && !conversationsMap.has(otherUserId)) {
                conversationsMap.set(otherUserId, {
                    userId: otherUserId,
                    userName: msg.senderRole === 'BUYER' ? msg.sender.name : 'Customer',
                    lastMessage: msg.content,
                    time: msg.createdAt,
                    // We'll calculate unread count separately or here? 
                    // Let's keep it simple for now and just return basics
                });
            }
        });

        return Array.from(conversationsMap.values());
    }

    async getUserMessagesForStore(userId: string, storeId: string, otherUserId: string) {
        // Direct thread between seller and a specific buyer
        const messages = await this.prisma.message.findMany({
            where: {
                storeId,
                OR: [
                    { senderId: userId, recipientId: otherUserId },
                    { senderId: otherUserId, recipientId: userId }
                ]
            },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: { select: { name: true, role: true } }
            }
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
            }
        });
    }
}
