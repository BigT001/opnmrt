'use client';

import React, { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, Loader2, User, MessageSquare, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
    const [aiEnabled, setAiEnabled] = useState(store?.chatAiEnabled || false);
    const [aiSuggesting, setAiSuggesting] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!store) return;
        async function fetchConversations() {
            try {
                const res = await api.get(`chat/conversations?storeId=${store!.id}`);
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
                    api.post('chat/read', { otherUserId: message.senderId, storeId: store?.id });
                }
            }

            setConversations(prev => {
                const otherId = message.senderRole === 'BUYER' ? message.senderId : message.recipientId;
                const existingIndex = prev.findIndex(c => c.userId === otherId);

                if (existingIndex !== -1) {
                    const existing = prev[existingIndex];
                    const updated = {
                        ...existing,
                        lastMessage: message.content,
                        time: message.createdAt,
                        unreadCount: (selectedUserId === otherId || message.senderRole === 'SELLER')
                            ? 0
                            : (existing.unreadCount || 0) + 1
                    };

                    const filtered = prev.filter(c => c.userId !== otherId);
                    return [updated, ...filtered];
                } else {
                    return [{
                        userId: otherId,
                        userName: message.senderRole === 'BUYER' ? message.sender.name : 'Customer',
                        lastMessage: message.content,
                        time: message.createdAt,
                        unreadCount: message.senderRole === 'BUYER' ? 1 : 0
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
                const res = await api.get(`chat/messages?storeId=${store!.id}&otherUserId=${selectedUserId}`);
                setMessages(res.data);

                // Mark as read
                await api.post('chat/read', { otherUserId: selectedUserId, storeId: store!.id });

                // Update local conversation list to remove unread badge
                setConversations(prev => prev.map(c => c.userId === selectedUserId ? { ...c, unreadCount: 0 } : c));
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

    // AI Toggle State: Sync with store on load/update
    useEffect(() => {
        if (store?.chatAiEnabled !== undefined) {
            setAiEnabled(store.chatAiEnabled);
        }
    }, [store?.chatAiEnabled]);

    const toggleAiMode = async () => {
        if (!store) return;
        const newState = !aiEnabled;
        setAiEnabled(newState);
        try {
            const res = await api.post('chat/toggle-ai', { storeId: store.id, enabled: newState });
            // Update global store
            useAuthStore.getState().setStore({ ...store, chatAiEnabled: res.data.chatAiEnabled });
        } catch (error) {
            console.error("Failed to toggle AI mode:", error);
            setAiEnabled(!newState);
        }
    };

    const handleSmartSuggest = async () => {
        if (!selectedUserId || !store) return;
        setAiSuggesting(true);
        try {
            const res = await api.post('chat/ai-suggestion', {
                storeId: store.id,
                otherUserId: selectedUserId,
                currentMessage: messages[messages.length - 1]?.content || ''
            });
            setNewMessage(res.data.suggestion);
        } catch (error) {
            console.error("Failed to get suggestion:", error);
        } finally {
            setAiSuggesting(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUserId || !store) return;

        setSending(true);
        try {
            const res = await api.post('chat/send', {
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
        <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-6rem)] flex flex-col lg:flex-row lg:space-x-8 min-h-0 pb-0 lg:pb-4 overflow-hidden">
            {/* Chat List Column */}
            <div className={`w-full lg:w-96 flex flex-col min-h-0 p-4 lg:p-0 ${selectedUserId ? 'hidden lg:flex' : 'flex'}`}>
                {/* High-Density Utility Bar */}
                <div className="mb-4 flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        {/* BT Brand Mark */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-700 ${aiEnabled ? 'bg-emerald-600 shadow-lg shadow-emerald-500/20' : 'bg-slate-900 shadow-lg shadow-slate-900/10'}`}>
                            <span className="text-[10px] font-black text-white tracking-widest leading-none mt-0.5">BT</span>
                        </div>

                        <div className="flex flex-col">
                            <span className={`text-[8px] font-black tracking-[0.2em] uppercase transition-colors duration-500 ${aiEnabled ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {aiEnabled ? 'Engine Active' : 'Manual Mode'}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-tight leading-none text-slate-900 mt-0.5">
                                BigT Support
                            </span>
                        </div>

                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleAiMode();
                            }}
                            className={`w-10 h-6 h-[22px] rounded-full p-1 transition-all duration-500 relative shrink-0 cursor-pointer ${aiEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all duration-500 flex items-center justify-center transform ${aiEnabled ? 'translate-x-4.5' : 'translate-x-0'}`}>
                                {aiEnabled && <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsSearchVisible(!isSearchVisible)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${isSearchVisible ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-white border-transparent text-slate-400 hover:text-slate-900'}`}
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </div>

                {/* Animated Search Area */}
                <AnimatePresence mode="wait">
                    {isSearchVisible && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className="px-2 mb-4 overflow-hidden"
                        >
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search catalog..."
                                    className="w-full bg-slate-50 border border-slate-100/50 rounded-xl pl-10 pr-4 py-2.5 text-[11px] font-bold outline-none focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all text-slate-900"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Chat List - Separate "Cardless" container */}
                <div className="flex-1 bg-white lg:rounded-[2.5rem] rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {conversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-3xl mb-4">📭</div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Empty Inbox</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {conversations.map((chat) => (
                                    <div
                                        key={chat.userId}
                                        onClick={() => setSelectedUserId(chat.userId)}
                                        className={`px-5 py-4 cursor-pointer transition-all flex items-center gap-4 ${selectedUserId === chat.userId
                                            ? 'bg-slate-900 text-white'
                                            : 'hover:bg-slate-50/80 text-slate-500'
                                            }`}
                                    >
                                        <div className="relative shrink-0">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-black shadow-sm overflow-hidden shrink-0 ${selectedUserId === chat.userId ? 'bg-white/20 text-white ring-2 ring-white/20' : 'bg-slate-100 text-slate-900 border border-slate-200'
                                                }`}>
                                                {(chat.userImage || chat.image) ? (
                                                    <img src={chat.userImage || chat.image} alt={chat.userName} className="w-full h-full object-cover" />
                                                ) : (
                                                    chat.userName?.[0]?.toUpperCase() || 'U'
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className={`text-[13px] font-black truncate ${selectedUserId === chat.userId ? 'text-white' : 'text-slate-900'}`}>
                                                    {chat.userName}
                                                </span>
                                                <span className={`text-[9px] font-bold uppercase tracking-tight shrink-0 ${selectedUserId === chat.userId ? 'text-white/50' : 'text-slate-400'}`}>
                                                    {new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`text-[11px] line-clamp-1 italic tracking-tight flex-1 ${chat.unreadCount > 0 && selectedUserId !== chat.userId ? 'font-black text-slate-900 opacity-100 not-italic' : 'opacity-60'}`}>
                                                    {chat.lastMessage}
                                                </p>
                                                {chat.unreadCount > 0 && selectedUserId !== chat.userId && (
                                                    <div className="h-4.5 min-w-[18px] px-1 bg-emerald-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-md animate-pulse shrink-0">
                                                        {chat.unreadCount}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Chat Area - Immersive Full Page on Mobile */}
            <div className={`flex-1 bg-white lg:rounded-[2.5rem] lg:border lg:border-slate-100 lg:shadow-sm flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] ${selectedUserId ? 'flex' : 'hidden lg:flex'}`}>
                {selectedUserId ? (
                    <>
                        {/* Chat Header - WhatsApp Style */}
                        <div className="p-3.5 lg:p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedUserId(null)} className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-900 active:bg-slate-100 rounded-full transition-all">
                                    <ArrowRight className="w-5 h-5 rotate-180" />
                                </button>
                                <div className="w-10 h-10 lg:w-11 lg:h-11 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-xs overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                                    {(selectedChat?.userImage || selectedChat?.image) ? (
                                        <img src={selectedChat.userImage || selectedChat.image} alt={selectedChat.userName} className="w-full h-full object-cover" />
                                    ) : (
                                        selectedChat?.userName?.[0]?.toUpperCase() || 'U'
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="font-black text-slate-900 text-[13px] leading-tight">{selectedChat?.userName}</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Customer Stream</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area - WhatsApp style background */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-4 no-scrollbar bg-[#f0f2f5] relative"
                            style={{
                                backgroundImage: `radial-gradient(#d1d5db 0.5px, transparent 0.5px)`,
                                backgroundSize: '24px 24px'
                            }}
                        >
                            <div className="flex justify-center mb-8">
                                <span className="px-3 py-1 bg-white/60 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 shadow-sm border border-slate-100/50">
                                    End-to-End Encrypted
                                </span>
                            </div>

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
                                            <div className={`p-3 lg:p-4 rounded-2xl text-[12px] lg:text-[13px] leading-relaxed shadow-sm max-w-[85%] lg:max-w-[70%] relative ${isMe
                                                ? 'bg-emerald-600 text-white rounded-tr-none'
                                                : 'bg-white text-slate-900 rounded-tl-none border border-slate-100'
                                                }`}>
                                                {/* Bubble Tail effect */}
                                                <div className={`absolute top-0 w-3 h-3 ${isMe
                                                    ? '-right-1.5 bg-emerald-600'
                                                    : '-left-1.5 bg-white border-l border-t border-slate-100'
                                                    } rotate-45 z-0`} />

                                                <div className="relative z-10">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            p: ({ children }) => <p className="m-0 whitespace-pre-wrap">{children}</p>,
                                                            a: ({ node, ...props }) => (
                                                                <a
                                                                    {...props}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={`inline-flex items-center gap-1 underline font-bold ${isMe ? 'text-emerald-200 hover:text-white' : 'text-emerald-600 hover:text-emerald-700'}`}
                                                                >
                                                                    {props.children}
                                                                    <ExternalLink className="w-3 h-3" />
                                                                </a>
                                                            ),
                                                            strong: ({ children }) => <strong className="font-black">{children}</strong>
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                    <div className={`text-[8px] mt-1.5 font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        {isMe && <span className="text-[10px]">✓✓</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>

                        {/* Message Input - Floating Style */}
                        <div className="p-3 lg:p-6 bg-white border-t border-slate-100">
                            <form onSubmit={handleSend} className="max-w-4xl mx-auto">
                                <div className="flex flex-col gap-2">
                                    {/* AI Suggestion - Persistently available for drafting assistance */}
                                    <div className="flex items-center gap-2 mb-1">
                                        <button
                                            type="button"
                                            onClick={handleSmartSuggest}
                                            disabled={aiSuggesting || !selectedUserId}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all shadow-sm disabled:opacity-50"
                                        >
                                            <Sparkles className={`w-3 h-3 ${aiSuggesting ? 'animate-spin' : ''}`} />
                                            {aiSuggesting ? 'Thinking...' : 'AI Suggestion'}
                                        </button>
                                        <div className="h-px flex-1 bg-slate-50" />
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder={aiEnabled ? "BigT AI active... auto-reply incoming" : "Message..."}
                                                className="w-full h-11 lg:h-14 bg-slate-50 border border-slate-100/50 rounded-full px-5 text-[13px] font-bold outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all text-slate-900"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={sending || !newMessage.trim()}
                                            className="w-11 h-11 lg:w-14 lg:h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20 active:scale-95 shrink-0"
                                        >
                                            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 fill-current" />}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
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
    );
}
