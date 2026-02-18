import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
    cors: { origin: '*' },
})
export class RealtimeGateway implements OnGatewayConnection {
    @WebSocketServer() server: Server;

    constructor(private jwtService: JwtService) { }

    async handleConnection(client: Socket) {
        try {
            const authHeader = client.handshake.auth.token || client.handshake.headers.authorization;
            const token = authHeader?.split(' ')[1] || authHeader;

            if (token) {
                this.jwtService.verify(token);
            }
        } catch (e) {
            // console.warn('WebSocket connection unauthorized', e.message);
        }
    }

    @SubscribeMessage('join_store')
    handleJoinStore(client: Socket, storeId: string) {
        if (!storeId) return { success: false, message: 'storeId is required' };
        client.join(`store_${storeId}`);
        console.log(`[REALTIME] Client ${client.id} joined room: store_${storeId}`);
        return { success: true };
    }

    emitToStore(storeId: string, event: string, data: any) {
        this.server.to(`store_${storeId}`).emit(event, data);
    }
}
