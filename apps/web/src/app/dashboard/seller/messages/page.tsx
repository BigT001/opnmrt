'use client';

import React, { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, Loader2, User, MessageSquare, ArrowRight } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';

export default function SellerMessagesPage() {
    const { store, user } = useAuthStore();
    const socket = useSocket(user?.id);
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [msgLoading, setMsgLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!store) return;
        async function fetchConversations() {
            try {
                const res = await api.get(`/chat/conversations?storeId=${store!.id}`);
                // For each conversation, we should fetch unread count if backend supports it
                // For now, let's just use the basic data
                setConversations(res.data);
            } catch (error) {
                console.error("Failed to fetch conversations:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchConversations();
    }, [store]);

    useEffect(() => {
        if (!socket) return;

        socket.on('newMessage', (message: any) => {
            const isFromSelected = selectedUserId === message.senderId || selectedUserId === message.recipientId;

            if (isFromSelected) {
                setMessages(prev => [...prev, message]);
                if (message.senderRole === 'BUYER') {
                    api.post('/chat/read', { otherUserId: message.senderId, storeId: store?.id });
                }
            }

            setConversations(prev => {
                const otherId = message.senderRole === 'BUYER' ? message.senderId : message.recipientId;
                const existing = prev.find(c => c.userId === otherId);

                if (existing) {
                    return prev.map(c => c.userId === otherId ? {
                        ...c,
                        lastMessage: message.content,
                        time: message.createdAt,
                        unread: isFromSelected ? false : (message.senderRole === 'BUYER' ? true : c.unread)
                    } : c).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
                } else {
                    return [{
                        userId: otherId,
                        userName: message.senderRole === 'BUYER' ? message.sender.name : 'Customer',
                        lastMessage: message.content,
                        time: message.createdAt,
                        unread: message.senderRole === 'BUYER'
                    }, ...prev];
                }
            });
        });

        return () => {
            socket.off('newMessage');
        };
    }, [socket, selectedUserId, store]);

    useEffect(() => {
        if (!selectedUserId || !store) return;
        async function fetchMessages() {
            setMsgLoading(true);
            try {
                const res = await api.get(`/chat/messages?storeId=${store!.id}&otherUserId=${selectedUserId}`);
                setMessages(res.data);

                // Mark as read
                await api.post('/chat/read', { otherUserId: selectedUserId, storeId: store!.id });

                // Update local conversation list to remove unread badge
                setConversations(prev => prev.map(c => c.userId === selectedUserId ? { ...c, unread: false } : c));
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            } finally {
                setMsgLoading(false);
            }
        }
        fetchMessages();
    }, [selectedUserId, store]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUserId || !store) return;

        setSending(true);
        try {
            const res = await api.post('/chat/send', {
                content: newMessage,
                storeId: store!.id,
                recipientId: selectedUserId,
            });
            setMessages([...messages, res.data]);
            setNewMessage('');

            setConversations(prev => prev.map(c =>
                c.userId === selectedUserId ? { ...c, lastMessage: res.data.content, time: res.data.createdAt } : c
            ));
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
            </div>
        );
    }

    const selectedChat = conversations.find(c => c.userId === selectedUserId);

    return (
        <div className="h-[calc(100vh-12rem)] flex flex-col space-y-6 lg:space-y-8">
            <div className="flex justify-between items-end shrink-0">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight px-4 lg:px-0">Messages</h1>
                    <p className="text-slate-500 mt-1 text-xs lg:text-sm px-4 lg:px-0">Direct customer support management</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row lg:space-x-8 min-h-0 space-y-4 lg:space-y-0 pb-4 lg:pb-0">
                {/* Chat List */}
                <div className={`w-full lg:w-80 bg-white rounded-[2rem] lg:rounded-[2.5rem] p-4 lg:p-6 shadow-sm border border-slate-100 flex flex-col overflow-hidden ${selectedUserId ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="px-2 mb-6 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search buyers..."
                            className="w-full bg-slate-50 border border-slate-50 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold outline-none focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100/50 transition-all placeholder:font-medium text-slate-900"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar px-2">
                        {conversations.length === 0 ? (
                            <p className="text-center text-[10px] text-slate-400 font-bold uppercase mt-10">No conversations</p>
                        ) : (
                            conversations.map((chat) => (
                                <div
                                    key={chat.userId}
                                    onClick={() => setSelectedUserId(chat.userId)}
                                    className={`p-4 rounded-2xl cursor-pointer transition-all relative ${selectedUserId === chat.userId ? 'bg-slate-900 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-500'
                                        }`}
                                >
                                    {chat.unread && selectedUserId !== chat.userId && (
                                        <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full ring-4 ring-white shadow-sm" />
                                    )}
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-xs font-black truncate max-w-[120px] ${selectedUserId === chat.userId ? 'text-white' : 'text-slate-900'}`}>
                                            {chat.userName}
                                        </span>
                                        <span className="text-[9px] opacity-60 font-medium">
                                            {new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className={`text-[11px] line-clamp-1 italic ${chat.unread ? 'font-black text-slate-900 opacity-90' : 'opacity-70'}`}>
                                        {chat.lastMessage}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`flex-1 bg-white rounded-[2rem] lg:rounded-[3rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] ${selectedUserId ? 'flex' : 'hidden lg:flex'}`}>
                    {selectedUserId ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 lg:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setSelectedUserId(null)} className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-900">
                                        <ArrowRight className="w-5 h-5 rotate-180" />
                                    </button>
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xs lg:text-sm">
                                        {selectedChat?.userName?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 text-xs lg:text-sm">{selectedChat?.userName}</h3>
                                        <p className="text-[9px] lg:text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Customer Thread</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 no-scrollbar"
                            >
                                {msgLoading ? (
                                    <div className="h-full flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-300" /></div>
                                ) : (
                                    messages.map((msg) => {
                                        const isMe = msg.senderRole === 'SELLER';
                                        return (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`flex items-end gap-3 max-w-[85%] lg:max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                                    <div className={`p-4 rounded-2xl text-[12px] lg:text-[13px] leading-relaxed shadow-sm ${isMe
                                                        ? 'bg-slate-900 text-white rounded-br-none'
                                                        : 'bg-slate-50 text-slate-900 border border-slate-100 rounded-bl-none'
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

                            {/* Footer */}
                            <form onSubmit={handleSend} className="p-4 lg:p-6 bg-slate-50/50 border-t border-slate-50">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your reply here..."
                                        className="w-full h-12 lg:h-14 pl-6 pr-16 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-200 transition-all text-slate-900 shadow-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending || !newMessage.trim()}
                                        className="absolute right-2 top-2 lg:top-2 w-8 h-8 lg:w-10 lg:h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-all disabled:opacity-50 shadow-lg shadow-slate-900/20"
                                    >
                                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                            <div className="w-16 h-16 lg:w-24 lg:h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-4xl lg:text-5xl mb-6 shadow-inner ring-1 ring-slate-100">
                                💬
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Select a conversation</h3>
                            <p className="text-xs lg:text-sm text-slate-500 max-w-sm mb-8 leading-relaxed">View and respond to direct messages from your customers here. Your replies appear instantly to them.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
