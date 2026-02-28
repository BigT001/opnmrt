import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (userId: string | undefined, storeId?: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!userId) {
            setSocket(null);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            console.debug('No auth token found, skipping socket connection');
            setSocket(null);
            return;
        }

        // Extract origin to avoid connecting to /api namespace
        // Use explicit Socket URL or derive from API URL origin
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ||
            (process.env.NEXT_PUBLIC_API_URL ? new URL(process.env.NEXT_PUBLIC_API_URL).origin : 'http://127.0.0.1:4000');

        console.log(`[SOCKET] Connecting to ${socketUrl} for user: ${userId}`);

        const socketInstance = io(socketUrl, {
            auth: { token: `Bearer ${token}` },
            transports: ['websocket', 'polling'],
            path: '/socket.io/',
            reconnectionAttempts: 10,
            reconnectionDelay: 2000,
        });

        socketInstance.on('connect', () => {
            console.log('[SOCKET] Connected successfully');
            if (storeId) {
                socketInstance.emit('join_store', storeId);
                console.log(`[SOCKET] Joined store room: ${storeId}`);
            }
            setSocket(socketInstance);
        });

        socketInstance.on('connect_error', (err) => {
            console.error('[SOCKET] Connection error:', err);
        });

        return () => {
            socketInstance.disconnect();
            setSocket(null);
        };
    }, [userId, storeId]);

    return socket;
};
