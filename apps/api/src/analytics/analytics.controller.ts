import { Controller, Post, Body } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) { }

    @Post('track')
    async track(@Body() body: { storeId: string; eventType: string; payload?: any; tenantId?: string }) {
        return this.analyticsService.trackEvent(body.storeId, body.eventType, body.payload, body.tenantId);
    }
}
