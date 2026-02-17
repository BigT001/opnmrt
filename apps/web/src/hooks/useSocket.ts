import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (userId: string | undefined, storeId?: string) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!userId) return;

        const token = localStorage.getItem('token');
        if (!token) {
            console.debug('No auth token found, skipping socket connection');
            return;
        }

        // Extract origin to avoid connecting to /api namespace
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const socketUrl = new URL(apiUrl).origin;

        console.log(`[SOCKET] Connecting to ${socketUrl} for user: ${userId}`);

        const socket = io(socketUrl, {
            auth: { token: `Bearer ${token}` },
            transports: ['websocket', 'polling'],
            path: '/socket.io/',
            reconnectionAttempts: 10,
            reconnectionDelay: 2000,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('[SOCKET] Connected successfully');
            if (storeId) {
                socket.emit('join_store', storeId);
                console.log(`[SOCKET] Joined store room: ${storeId}`);
            }
        });

        socket.on('connect_error', (err) => {
            console.error('[SOCKET] Connection error:', err);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [userId, storeId]);

    return socketRef.current;
};
