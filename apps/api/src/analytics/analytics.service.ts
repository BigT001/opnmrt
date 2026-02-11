import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async trackEvent(storeId: string, eventType: string, payload: any, tenantId?: string) {
        try {
            // If tenantId is not provided, we try to find it from the store
            let finalTenantId = tenantId;
            if (!finalTenantId) {
                const store = await this.prisma.store.findUnique({
                    where: { id: storeId },
                    select: { tenantId: true },
                });
                finalTenantId = store?.tenantId;
            }

            if (!finalTenantId) return null;

            return await this.prisma.eventLog.create({
                data: {
                    storeId,
                    tenantId: finalTenantId,
                    eventType,
                    payload: payload || {},
                },
            });
        } catch (error) {
            console.error('[ANALYTICS_TRACK_ERROR]', error);
            return null;
        }
    }
}
