import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (userId: string | undefined) => {
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

        console.log(`Connecting to socket at: ${socketUrl} for user: ${userId}`);

        const socket = io(socketUrl, {
            auth: { token: `Bearer ${token}` },
            transports: ['polling', 'websocket'], // Allow fallback to polling
            path: '/socket.io/', // Explicitly set default path
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
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
