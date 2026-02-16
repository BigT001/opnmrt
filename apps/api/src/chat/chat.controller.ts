import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private chatService: ChatService) { }

  @Post('send')
  async sendMessage(
    @GetUser('userId') userId: string,
    @Body()
    data: {
      content: string;
      storeId: string;
      orderId?: string;
      recipientId?: string;
    },
  ) {
    return this.chatService.sendMessage(userId, data);
  }

  @Get('messages')
  async getMessages(
    @GetUser('userId') userId: string,
    @Query('storeId') storeId: string,
    @Query('otherUserId') otherUserId?: string,
  ) {
    if (otherUserId) {
      return this.chatService.getUserMessagesForStore(
        userId,
        storeId,
        otherUserId,
      );
    }
    return this.chatService.getMessages(userId, storeId);
  }

  @Get('conversations')
  async getConversations(
    @GetUser('userId') userId: string,
    @Query('storeId') storeId: string,
  ) {
    return this.chatService.getStoreConversations(storeId, userId);
  }

  @Get('unread-count')
  async getUnreadCount(
    @GetUser('userId') userId: string,
    @Query('storeId') storeId?: string,
  ) {
    return { count: await this.chatService.getUnreadCount(userId, storeId) };
  }

  @Post('read')
  async markAsRead(
    @GetUser('userId') userId: string,
    @Body() data: { otherUserId: string; storeId: string },
  ) {
    return this.chatService.markAsRead(userId, data.otherUserId, data.storeId);
  }

  @Post('toggle-ai')
  async toggleAiMode(
    @GetUser('userId') userId: string,
    @Body() data: { storeId: string; enabled: boolean },
  ) {
    return this.chatService.toggleAiMode(data.storeId, data.enabled);
  }

  @Post('ai-suggestion')
  async getAiSuggestion(
    @GetUser('userId') userId: string,
    @Body() data: { storeId: string; otherUserId: string; currentMessage: string },
  ) {
    const suggestion = await this.chatService.getAiSuggestion(
      data.storeId,
      data.otherUserId,
      data.currentMessage,
    );
    return { suggestion };
  }
}
