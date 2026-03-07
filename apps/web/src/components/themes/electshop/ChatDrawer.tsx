'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
    X, MessageCircle, Send, Loader2, Store, User,
    Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useSocket } from '@/hooks/useSocket';
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ElectshopChatDrawer() {
    const { isOpen, toggleDrawer, incrementUnread, resetUnread } = useChatStore();
    const { subdomain } = useParams<{ subdomain: string }>();
    const { user } = useAuthStore();

    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [storeInfo, setStoreInfo] = useState<any>(null);

    const socket = useSocket(user?.id, storeInfo?.id);

    const scrollRef = useRef<HTMLDivElement>(null);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Initial load
    useEffect(() => {
        if (!isOpen) return;

        async function initChat() {
            try {
                // 1. Resolve store info
                const storeRes = await api.get(`stores/resolve?subdomain=${subdomain}`);
                setStoreInfo(storeRes.data);

                // 2. Fetch messages
                const msgRes = await api.get(`chat/messages?storeId=${storeRes.data.id}`);
                setMessages(msgRes.data);

                // 3. Mark as read
                await api.post('chat/read', {
                    otherUserId: storeRes.data.ownerId,
                    storeId: storeRes.data.id
                });
                resetUnread();
            } catch (error) {
                console.error("Failed to initialize chat:", error);
            } finally {
                setLoading(false);
            }
        }
        initChat();
    }, [subdomain, isOpen]);

    // Socket listener for new messages
    useEffect(() => {
        if (!socket) return;

        socket.on('newMessage', (message: any) => {
            // Only add if it belongs to this store
            if (storeInfo && (message.storeId === storeInfo.id || message.conversationId === storeInfo.id)) {
                setMessages(prev => {
                    // Avoid duplicates
                    if (prev.some(m => m.id === message.id || (m.isOptimistic && m.content === message.content))) {
                        return prev.map(m => (m.isOptimistic && m.content === message.content) ? message : m);
                    }
                    return [...prev, message];
                });

                if (message.senderRole === 'SELLER') {
                    incrementUnread();
                    api.post('chat/read', {
                        otherUserId: message.senderId,
                        storeId: message.storeId
                    });
                }
            }
        });

        socket.on('notification', (notif: any) => {
            const systemMsg = {
                id: 'notif-' + Date.now(),
                content: `🔔 **Notification**: ${notif.title}\n\n${notif.message}`,
                senderRole: 'SELLER',
                createdAt: new Date().toISOString(),
                isSystem: true
            };
            setMessages(prev => [...prev, systemMsg]);
            incrementUnread();
        });

        return () => {
            socket.off('newMessage');
            socket.off('notification');
        };
    }, [socket, storeInfo]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !storeInfo || sending) return;

        const content = newMessage;
        setNewMessage('');

        // Optimistic Update
        const optimisticMsg = {
            id: 'temp-' + Date.now(),
            content,
            senderRole: 'BUYER',
            senderId: user?.id,
            createdAt: new Date().toISOString(),
            isOptimistic: true
        };
        setMessages(prev => [...prev, optimisticMsg]);

        try {
            const res = await api.post('chat/send', {
                content,
                storeId: storeInfo.id,
            });

            // Replace optimistic message with actual
            setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? res.data : m));
        } catch (error) {
            console.error("Failed to send message:", error);
            // Remove optimistic on failure
            setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
            setNewMessage(content); // Restore input
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[3000] overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-2xl"
                        onClick={toggleDrawer}
                    />

                    <motion.div
                        initial={isMobile ? { y: '100%' } : { x: '100%' }}
                        animate={isMobile ? { y: 0 } : { x: 0 }}
                        exit={isMobile ? { y: '100%' } : { x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="absolute bottom-0 inset-x-0 md:inset-y-0 md:right-0 md:left-auto w-full md:w-[480px] h-[90vh] md:h-full bg-white flex flex-col overflow-hidden shadow-2xl border-l border-gray-100"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center">
                                    <MessageCircle className="w-6 h-6 text-brand" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Chat with Big T</h2>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Big T is Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={toggleDrawer}
                                className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-grow overflow-y-auto px-8 py-10 space-y-8 bg-gray-50/30"
                        >
                            {loading ? (
                                <div className="h-full flex items-center justify-center text-brand">
                                    <Loader2 className="w-10 h-10 animate-spin" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                    <div className="w-24 h-24 bg-gray-100 rounded-[40px] flex items-center justify-center text-4xl mb-6 shadow-inner">💬</div>
                                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-widest">No conversation yet</h4>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 max-w-[200px]">Send a message to start chatting with Big T!</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = msg.senderRole === 'BUYER';
                                    const isSystem = msg.isSystem;

                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`flex items-start gap-4 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 shadow-sm ${isMe ? 'bg-gray-200 text-gray-500' : isSystem ? 'bg-brand/10 text-brand' : 'bg-gray-950 text-white'
                                                    }`}>
                                                    {isMe ? <User className="w-5 h-5" /> : isSystem ? <Bell className="w-5 h-5" /> : <Store className="w-5 h-5 text-white" />}
                                                </div>
                                                <div className={`p-5 rounded-[24px] text-[13px] leading-relaxed shadow-sm relative overflow-hidden ${isMe
                                                    ? 'bg-gray-100 text-gray-950 rounded-tr-sm'
                                                    : isSystem
                                                        ? 'bg-brand/5 border border-brand/10 text-gray-900 rounded-tl-sm'
                                                        : 'bg-white border border-gray-100 text-gray-950 rounded-tl-sm'
                                                    }`}>
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            p: ({ children }) => <p className="m-0 whitespace-pre-wrap font-bold">{children}</p>,
                                                            strong: ({ children }) => <strong className="font-black italic uppercase tracking-tighter">{children}</strong>,
                                                            a: ({ node, ...props }) => {
                                                                const isInternal = props.href?.includes(typeof window !== 'undefined' ? window.location.host : '') || props.href?.startsWith('/');
                                                                if (isInternal) {
                                                                    const path = props.href?.includes(typeof window !== 'undefined' ? window.location.host : '')
                                                                        ? props.href.split(typeof window !== 'undefined' ? window.location.host : '').pop()
                                                                        : props.href;

                                                                    return (
                                                                        <Link
                                                                            href={path || '/'}
                                                                            onClick={() => toggleDrawer()}
                                                                            className="font-black underline decoration-2 underline-offset-2 hover:opacity-70 transition-opacity text-brand"
                                                                        >
                                                                            {props.children}
                                                                        </Link>
                                                                    );
                                                                }
                                                                return (
                                                                    <a
                                                                        {...props}
                                                                        className="font-black underline decoration-2 underline-offset-2 hover:opacity-70 transition-opacity text-brand"
                                                                    />
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                    <div className={`text-[8px] mt-3 font-black uppercase tracking-[0.2em] opacity-40 ${isMe ? 'text-right' : 'text-left'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-8 bg-white border-t border-gray-100 pb-12">
                            <form
                                onSubmit={handleSend}
                                className="relative flex items-center gap-4"
                            >
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="w-full h-16 pl-8 pr-20 bg-gray-50 border border-gray-100 rounded-2xl text-[12px] font-bold text-gray-900 placeholder:text-gray-400 outline-none focus:border-brand/50 transition-all shadow-inner"
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending || !newMessage.trim()}
                                        className="absolute right-2.5 top-2.5 w-11 h-11 bg-brand text-white rounded-[14px] flex items-center justify-center active:scale-90 transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-brand/20"
                                    >
                                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    </button>
                                </div>
                            </form>
                            <p className="text-center text-[9px] font-black text-gray-400 uppercase tracking-widest mt-6 opacity-40">
                                Powered by OPNMRT Live Chat
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
