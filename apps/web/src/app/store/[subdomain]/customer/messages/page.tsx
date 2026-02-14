'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { MessageCircle, Send, Loader2, Store, User } from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { useAuthStore } from '@/store/useAuthStore';

export default function CustomerMessagesPage() {
    const { subdomain } = useParams<{ subdomain: string }>();
    const { user } = useAuthStore();
    const socket = useSocket(user?.id);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [storeInfo, setStoreInfo] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function initChat() {
            try {
                // 1. Resolve store info
                const storeRes = await api.get(`/stores/resolve?subdomain=${subdomain}`);
                setStoreInfo(storeRes.data);

                // 2. Fetch messages
                const msgRes = await api.get(`/chat/messages?storeId=${storeRes.data.id}`);
                setMessages(msgRes.data);

                // 3. Mark as read
                await api.post('/chat/read', {
                    otherUserId: storeRes.data.ownerId,
                    storeId: storeRes.data.id
                });
            } catch (error) {
                console.error("Failed to initialize chat:", error);
            } finally {
                setLoading(false);
            }
        }
        initChat();
    }, [subdomain]);

    useEffect(() => {
        if (!socket) return;

        socket.on('newMessage', (message: any) => {
            setMessages(prev => [...prev, message]);

            // Mark as read if it's from the store
            if (message.senderRole === 'SELLER') {
                api.post('/chat/read', {
                    otherUserId: message.senderId,
                    storeId: message.storeId
                });
            }
        });

        return () => {
            socket.off('newMessage');
        };
    }, [socket]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !storeInfo) return;

        setSending(true);
        try {
            const res = await api.post('/chat/send', {
                content: newMessage,
                storeId: storeInfo.id,
            });
            setMessages([...messages, res.data]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[600px] bg-white rounded-[2.5rem] border border-slate-100 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[700px] space-y-6">
            <div className="shrink-0">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Messages</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Direct support from {storeInfo?.name || 'the seller'}</p>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden relative transition-colors duration-300">
                {/* Chat Header */}
                <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black">
                        <Store className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 dark:text-white text-sm">{storeInfo?.name}</h3>
                        <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Store Owner Online</p>
                    </div>
                </div>

                {/* Messages Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth no-scrollbar"
                >
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-10">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-2xl mb-4">💬</div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white">No messages yet</h4>
                            <p className="text-xs text-slate-400 mt-2 max-w-[200px]">Send a message to the seller to start a conversation about your orders or products.</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.senderRole === 'BUYER';
                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex items-end gap-3 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm ${isMe ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-slate-900 dark:bg-white text-white dark:text-black'
                                            }`}>
                                            {isMe ? <User className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                                        </div>
                                        <div className={`p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${isMe
                                            ? 'bg-slate-900 dark:bg-blue-600 text-white rounded-br-none'
                                            : 'bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 rounded-bl-none'
                                            }`}>
                                            {msg.content}
                                            <div className={`text-[9px] mt-2 font-bold uppercase tracking-widest opacity-40 ${isMe ? 'text-right' : 'text-left'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSend} className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-50 dark:border-slate-800">
                    <div className="relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="w-full h-14 pl-6 pr-16 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/10 focus:border-slate-200 dark:focus:border-slate-700 transition-all text-slate-900 dark:text-white shadow-sm"
                        />
                        <button
                            type="submit"
                            disabled={sending || !newMessage.trim()}
                            className="absolute right-2 top-2 w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center hover:bg-black dark:hover:bg-slate-200 transition-all disabled:opacity-50 shadow-lg shadow-slate-900/20"
                        >
                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
