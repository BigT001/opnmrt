import { Injectable } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';

@Injectable()
export class RealtimeService {
    constructor(private gateway: RealtimeGateway) { }

    emitNotification(storeId: string, notification: any) {
        this.gateway.emitToStore(storeId, 'notification_received', notification);
    }

    emitStatsUpdate(storeId: string) {
        this.gateway.emitToStore(storeId, 'stats_updated', {
            timestamp: new Date(),
            refresh: true
        });
    }
}
