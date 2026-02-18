'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
    X, MessageCircle, Send, Loader2, Store, User,
    ExternalLink, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useSocket } from '@/hooks/useSocket';
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function AppifyChatDrawer() {
    const { isOpen, toggleDrawer, unreadCount, incrementUnread, resetUnread } = useChatStore();
    const { subdomain } = useParams<{ subdomain: string }>();
    const { user } = useAuthStore();
    const socket = useSocket(user?.id);

    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [storeInfo, setStoreInfo] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial load
    useEffect(() => {
        if (!isOpen) return;

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
            if (storeInfo && message.storeId === storeInfo.id) {
                setMessages(prev => [...prev, message]);
                incrementUnread();

                if (message.senderRole === 'SELLER') {
                    api.post('/chat/read', {
                        otherUserId: message.senderId,
                        storeId: message.storeId
                    });
                }
            }
        });

        // Listen for internal notifications and turn them into chat messages (UI-only for now)
        socket.on('notification', (notif: any) => {
            const systemMsg = {
                id: 'notif-' + Date.now(),
                content: `🔔 **Notification**: ${notif.title}\n\n${notif.message}`,
                senderRole: 'SELLER', // Show as store/system message
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

        setSending(true);
        try {
            const res = await api.post('/chat/send', {
                content: newMessage,
                storeId: storeInfo.id,
            });
            setMessages(prev => [...prev, res.data]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setSending(false);
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
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={toggleDrawer}
                    />

                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute inset-x-0 bottom-0 h-[85vh] bg-white rounded-t-[40px] flex flex-col overflow-hidden shadow-2xl"
                    >
                        {/* Pull Indicator */}
                        <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full" />
                        </div>

                        {/* Header */}
                        <div className="px-5 py-2.5 border-b border-gray-50 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-500/20 shrink-0">
                                    <MessageCircle className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-[13px] font-black text-[#1a1a2e] uppercase italic tracking-tighter leading-none">Support</h2>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[7px] text-gray-400 font-bold uppercase tracking-widest leading-none">Instant Response</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={toggleDrawer}
                                className="w-8 h-8 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center active:scale-95 transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-grow overflow-y-auto px-6 py-8 space-y-6 custom-scrollbar bg-gray-50/30"
                        >
                            {loading ? (
                                <div className="h-full flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-40">
                                    <div className="w-20 h-20 bg-gray-100 rounded-[35px] flex items-center justify-center text-3xl mb-6">💬</div>
                                    <h4 className="text-[12px] font-black text-[#1a1a2e] uppercase tracking-widest">No messages yet</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 max-w-[180px]">Ask us anything about our products or your orders!</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = msg.senderRole === 'BUYER';
                                    const isSystem = msg.isSystem;

                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`flex items-end gap-3 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${isMe ? 'bg-gray-100 text-gray-500' : isSystem ? 'bg-orange-100 text-orange-600' : 'bg-[#0a0a0a] text-white'
                                                    }`}>
                                                    {isMe ? <User className="w-4 h-4" /> : isSystem ? <Bell className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                                                </div>
                                                <div className={`p-4 rounded-[24px] text-[13px] leading-relaxed shadow-sm relative overflow-hidden break-words ${isMe
                                                    ? 'bg-[#0a0a0a] text-white rounded-br-sm'
                                                    : isSystem
                                                        ? 'bg-orange-50 border border-orange-100 text-[#1a1a2e] rounded-bl-sm'
                                                        : 'bg-white border border-gray-100 text-[#1a1a2e] rounded-bl-sm'
                                                    }`}>
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            p: ({ children }) => <p className="m-0 whitespace-pre-wrap font-medium">{children}</p>,
                                                            strong: ({ children }) => <strong className="font-black uppercase tracking-tighter">{children}</strong>,
                                                            a: ({ node, ...props }) => {
                                                                const isInternal = props.href?.includes(window.location.host) || props.href?.startsWith('/');
                                                                if (isInternal) {
                                                                    const path = props.href?.includes(window.location.host)
                                                                        ? props.href.split(window.location.host).pop()
                                                                        : props.href;

                                                                    return (
                                                                        <Link
                                                                            href={path || '/'}
                                                                            onClick={() => toggleDrawer()}
                                                                            className="font-black underline decoration-2 underline-offset-2 hover:opacity-70 transition-opacity text-orange-600"
                                                                        >
                                                                            {props.children}
                                                                        </Link>
                                                                    );
                                                                }
                                                                return (
                                                                    <a
                                                                        {...props}
                                                                        className="font-black underline decoration-2 underline-offset-2 hover:opacity-70 transition-opacity text-orange-600"
                                                                    />
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                    <div className={`text-[8px] mt-2 font-black uppercase tracking-[0.2em] opacity-30 ${isMe ? 'text-right' : 'text-left'}`}>
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
                        <div className="p-6 bg-white border-t border-gray-50 pb-10">
                            <form
                                onSubmit={handleSend}
                                className="relative flex items-center gap-3"
                            >
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Message SAMSTAR..."
                                        className="w-full h-14 pl-6 pr-14 bg-gray-50 border-none rounded-[20px] text-[12px] font-bold text-[#1a1a2e] placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-500/20 transition-all shadow-inner"
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending || !newMessage.trim()}
                                        className="absolute right-2 top-2 w-10 h-10 bg-[#0a0a0a] text-white rounded-xl flex items-center justify-center active:scale-90 transition-all disabled:opacity-30 disabled:grayscale"
                                    >
                                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
