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

    @Get('ai-status')
    async getAiStatus() {
        return this.aiService.getStatus();
    }

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
        console.log('[CHAT_MESSAGE] Received:', { storeId: body.storeId, message: body.message?.substring(0, 50), conversationId: body.conversationId });

        // Build context gracefully — don't let one failure kill everything
        const context: any = {
            totalOrders: 0,
            totalRevenue: 0,
            totalProducts: 0,
            topProducts: [],
            funnel: {},
            timeline: [],
            inventory: { note: 'Inventory data unavailable' },
            storeProfile: { name: 'Your Store' },
        };

        try {
            const stats = await this.storesService.getStoreStats(body.storeId);
            Object.assign(context, stats);
            console.log('[CHAT_MESSAGE] Stats loaded');
        } catch (err) {
            console.warn('[CHAT_MESSAGE] Stats fetch failed (non-fatal):', err?.message || err);
        }

        try {
            const timeline = await this.analyticsService.getTimelineStats(body.storeId, 30);
            context.timeline = timeline;
        } catch (err) {
            console.warn('[CHAT_MESSAGE] Timeline fetch failed (non-fatal):', err?.message || err);
        }

        try {
            const inventoryData = await this.analyticsService.getInventorySnapshot(body.storeId);
            context.inventory = inventoryData;
        } catch (err) {
            console.warn('[CHAT_MESSAGE] Inventory fetch failed (non-fatal):', err?.message || err);
        }

        try {
            const storeProfile = await this.storesService.findOne(body.storeId);
            context.storeProfile = {
                name: storeProfile.name,
                subdomain: storeProfile.subdomain,
                theme: storeProfile.theme,
                plan: storeProfile.plan,
            };
        } catch (err) {
            console.warn('[CHAT_MESSAGE] Store profile fetch failed (non-fatal):', err?.message || err);
        }

        // CRITICAL: Trim context to save tokens and stay within TPM limits
        if (context.timeline && context.timeline.length > 7) {
            context.timeline = context.timeline.slice(-7); // Only last 7 days
        }
        if (context.topProducts && context.topProducts.length > 5) {
            context.topProducts = context.topProducts.slice(0, 5);
        }
        if (context.inventory && context.inventory.snapshot && context.inventory.snapshot.length > 10) {
            context.inventory.snapshot = context.inventory.snapshot.slice(0, 10);
        }

        try {
            console.log('[CHAT_MESSAGE] Sending to AI with trimmed context');
            const result = await this.aiService.processUserMessage(body.storeId, body.message, context, body.conversationId);
            console.log('[CHAT_MESSAGE] AI responded successfully');
            return result;
        } catch (error) {
            console.error('[CHAT_MESSAGE_AI_ERROR]', error);
            throw new InternalServerErrorException('Failed to process message');
        }
    }
}
