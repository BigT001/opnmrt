import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (userId: string | undefined) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!userId) return;

        const token = localStorage.getItem('token');
        // Extract origin to avoid connecting to /api namespace
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const socketUrl = new URL(apiUrl).origin;

        const socket = io(socketUrl, {
            auth: { token: `Bearer ${token}` },
            transports: ['websocket'],
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        return () => {
            socket.disconnect();
        };
    }, [userId]);

    return socketRef.current;
};
