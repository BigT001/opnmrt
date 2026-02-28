import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ||
    (process.env.NEXT_PUBLIC_API_URL ? new URL(process.env.NEXT_PUBLIC_API_URL).origin : 'http://127.0.0.1:4000');

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    auth: (cb) => {
        cb({
            token: typeof window !== 'undefined' ? `Bearer ${localStorage.getItem('token')}` : null
        });
    }
});
