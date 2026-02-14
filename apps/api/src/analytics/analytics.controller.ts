import { Controller, Post, Body, Get, Param, Query, InternalServerErrorException } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { StoresService } from '../stores/stores.service';
import { AiService } from './ai.service';

@Controller('analytics')
export class AnalyticsController {
    constructor(
        private analyticsService: AnalyticsService,
        private aiService: AiService,
        private storesService: StoresService
    ) { }

    @Post('track')
    async track(@Body() body: { storeId: string; eventType: string; payload?: any; tenantId?: string }) {
        return this.analyticsService.trackEvent(body.storeId, body.eventType, body.payload, body.tenantId);
    }

    @Get('notifications/:storeId')
    async getNotifications(@Param('storeId') storeId: string) {
        try {
            return await this.analyticsService.getNotifications(storeId);
        } catch (error) {
            console.error('[NOTIFICATIONS_ERROR]', error);
            throw error;
        }
    }

    @Get('timeline/:storeId')
    async getTimeline(@Param('storeId') storeId: string, @Query('days') days?: string) {
        return this.analyticsService.getTimelineStats(storeId, days ? parseInt(days) : 7);
    }

    @Get('ai-insights/:storeId')
    async getAiInsights(@Param('storeId') storeId: string) {
        try {
            const stats = await this.storesService.getStoreStats(storeId);
            const timeline = await this.analyticsService.getTimelineStats(storeId, 30);
            const customers = await this.storesService.getCustomerStats(storeId);

            return await this.aiService.generateInsights({
                ...stats,
                timeline,
                customers
            });
        } catch (error: any) {
            console.error('[GET_AI_INSIGHTS_ERROR]', error);
            throw new InternalServerErrorException(error?.message || 'AI Insights failed');
        }
    }

    @Get('ai-predictions/:storeId')
    async getAiPredictions(@Param('storeId') storeId: string) {
        try {
            const stats = await this.storesService.getStoreStats(storeId);
            const timeline = await this.analyticsService.getTimelineStats(storeId, 30);
            return await this.aiService.getPredictions({ ...stats, timeline });
        } catch (error: any) {
            console.error('[GET_AI_PREDICTIONS_ERROR]', error);
            throw new InternalServerErrorException(error?.message || 'AI Predictions failed');
        }
    }

    @Post('ai-ask/:storeId')
    async askAi(@Param('storeId') storeId: string, @Body() body: { question: string }) {
        try {
            const stats = await this.storesService.getStoreStats(storeId);
            return {
                answer: await this.aiService.askQuestion(body.question, stats)
            };
        } catch (error) {
            console.error('[ASK_AI_ERROR]', error);
            throw error;
        }
    }

    @Get('ai-chat/conversations/:storeId')
    async getConversations(@Param('storeId') storeId: string) {
        return this.aiService.getConversations(storeId);
    }

    @Post('ai-chat/new/:storeId')
    async createNewChat(@Param('storeId') storeId: string, @Body() body: { title?: string }) {
        return this.aiService.createConversation(storeId, body.title);
    }

    @Get('ai-chat/history/:storeId/:conversationId')
    async getConversationHistory(@Param('storeId') storeId: string, @Param('conversationId') conversationId: string) {
        return await (this.aiService as any).prisma.aiConversation.findUnique({
            where: { id: conversationId },
            include: { messages: { orderBy: { createdAt: 'asc' } } }
        });
    }

    @Get('ai-chat/live-advice/:storeId')
    async getLiveAdvice(@Param('storeId') storeId: string) {
        try {
            const stats = await this.storesService.getStoreStats(storeId);
            const inventoryData = await this.analyticsService.getInventorySnapshot(storeId);
            return await this.aiService.getLiveAdvice(storeId, { ...stats, inventory: inventoryData });
        } catch (error) {
            return ["Analyzing store trends...", "Preparing fresh suggestions..."];
        }
    }

    @Get('ai-chat/history/:storeId')
    async getChatHistory(@Param('storeId') storeId: string) {
        return this.aiService.getLatestConversation(storeId);
    }

    @Post('ai-chat/message')
    async postChatMessage(@Body() body: { storeId: string; message: string; conversationId?: string }) {
        // Fetch rich context for BigT
        try {
            const stats = await this.storesService.getStoreStats(body.storeId);
            const timeline = await this.analyticsService.getTimelineStats(body.storeId, 30);

            // Fetch inventory data (stock levels + restock history)
            const inventoryData = await this.analyticsService.getInventorySnapshot(body.storeId);

            // Fetch store profile info (for marketing context)
            const storeProfile = await this.storesService.findOne(body.storeId);

            const context = {
                ...stats,
                timeline,
                inventory: inventoryData,
                storeProfile: {
                    name: storeProfile.name,
                    subdomain: storeProfile.subdomain,
                    theme: storeProfile.theme,
                    plan: storeProfile.plan,
                }
            };

            return await this.aiService.processUserMessage(body.storeId, body.message, context, body.conversationId);
        } catch (error) {
            console.error('[CHAT_MESSAGE_ERROR]', error);
            throw new InternalServerErrorException('Failed to process message');
        }
    }
}
