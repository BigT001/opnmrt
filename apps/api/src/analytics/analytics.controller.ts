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
}
