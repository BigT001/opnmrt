import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StoresModule } from '../stores/stores.module';
import { AiService } from './ai.service';

@Module({
    imports: [PrismaModule, StoresModule],
    providers: [AnalyticsService, AiService],
    controllers: [AnalyticsController],
    exports: [AnalyticsService, AiService],
})
export class AnalyticsModule { }
