'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Send,
    Bot,
    User as UserIcon,
    Loader2,
    TrendingUp,
    Sparkles,
    Plus,
    MessageSquare,
    Search,
    Clock,
    Zap,
    ChevronRight,
    LayoutDashboard,
    ShoppingBag,
    Users,
    Package,
    ArrowRight,
    Lightbulb,
    History,
    MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';

// --- Components ---

const SidebarItem = ({ active, title, onClick, icon: Icon = MessageSquare, date }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${active
                ? 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
    >
        <Icon size={14} className={active ? 'text-indigo-400' : 'text-slate-400'} />
        <div className="flex-1 text-left truncate">
            <p className={`text-[11px] font-bold ${active ? 'text-white' : 'text-slate-700'}`}>{title}</p>
            {date && <p className="text-[8px] font-black uppercase tracking-widest mt-0.5 opacity-50">{date}</p>}
        </div>
        <MoreHorizontal size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />
    </button>
);

const AdviceCard = ({ content }: { content: string }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 group hover:border-indigo-300 transition-all cursor-default"
    >
        <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm text-indigo-600">
                <Lightbulb size={14} />
            </div>
            <p className="text-[11px] font-bold text-slate-800 leading-relaxed">
                {content}
            </p>
        </div>
    </motion.div>
);

const IntelligenceStream = ({ advices, notifications }: any) => (
    <div className="flex flex-col h-full space-y-8 overflow-y-auto no-scrollbar pt-2">
        <div>
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Zap size={12} className="text-amber-500" /> Live Advice Engine
                </h4>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="space-y-3">
                {advices.length > 0 ? (
                    advices.map((a: string, i: number) => <AdviceCard key={i} content={a} />)
                ) : (
                    <p className="text-[10px] text-slate-400 italic font-medium px-2">Gathering fresh store insights...</p>
                )}
            </div>
        </div>

        <div>
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <History size={12} /> Pulse Feed
                </h4>
            </div>
            <div className="space-y-5 px-1">
                {notifications.slice(0, 8).map((n: any) => (
                    <div key={n.id} className="flex gap-3">
                        <div className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                        <div>
                            <p className="text-[10px] text-slate-700 font-bold leading-snug">{n.message}</p>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1 block">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- Main Page ---

export default function AnalyticsPage() {
    const { store } = useAuthStore();
    const [conversations, setConversations] = useState<any[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [advices, setAdvices] = useState<string[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Load
    useEffect(() => {
        if (!store?.id) return;
        fetchConversations();
        fetchNotifications();
        fetchLiveAdvice();
    }, [store?.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            const res = await api.get(`/analytics/ai-chat/conversations/${store?.id}`);
            const convs = res.data || [];
            setConversations(convs);
            if (convs.length > 0 && !currentSessionId) {
                switchSession(convs[0].id);
            }
        } catch (err) { console.error('History failed', err); }
    };

    const fetchNotifications = async () => {
        try {
            const res = await api.get(`/analytics/notifications/${store?.id}`);
            setNotifications(res.data || []);
        } catch (err) { console.warn('Pulse failed', err); }
    };

    const fetchLiveAdvice = async () => {
        try {
            const res = await api.get(`/analytics/ai-chat/live-advice/${store?.id}`);
            setAdvices(res.data || []);
        } catch (err) { console.warn('Advice failed', err); }
    };

    const switchSession = async (id: string) => {
        setCurrentSessionId(id);
        setLoading(true);
        try {
            const res = await api.get(`/analytics/ai-chat/history/${store?.id}/${id}`);
            setMessages(res.data?.messages || []);
        } catch (err) {
            console.error('Session load failed', err);
        } finally {
            setLoading(false);
        }
    };

    const handleNewChat = async () => {
        setLoading(true);
        try {
            const res = await api.post(`/analytics/ai-chat/new/${store?.id}`, { title: 'New Analysis' });
            setConversations(prev => [res.data, ...prev]);
            setCurrentSessionId(res.data.id);
            setMessages([]);
        } catch (err) {
            console.error('New chat failed', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const userMsg = input.trim();
        if (!userMsg || loading) return;

        setInput('');
        const optimisticMsg = { role: 'user', content: userMsg, createdAt: new Date() };
        setMessages(prev => [...prev, optimisticMsg]);
        setLoading(true);

        try {
            const res = await api.post('/analytics/ai-chat/message', {
                storeId: store?.id,
                message: userMsg,
                conversationId: currentSessionId
            });
            setMessages(prev => [...prev, res.data]);
            // Refresh conversation list to show updated title/time if needed
            fetchConversations();
        } catch (err) {
            console.error('Send failed', err);
            setMessages(prev => [...prev, { role: 'assistant', content: "Connection interrupted. Let's try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 top-20 left-24 right-0 bottom-0 flex bg-white font-sans overflow-hidden">
            {/* Left Sidebar: Session History */}
            <div className="w-72 border-r border-slate-100 flex flex-col bg-slate-50/50 p-4 shrink-0">
                <button
                    onClick={handleNewChat}
                    className="w-full mb-6 flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                            <Plus size={18} />
                        </div>
                        <span className="text-[12px] font-black uppercase tracking-widest text-slate-800">New Analysis</span>
                    </div>
                </button>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-2">Store Management</p>
                        <div className="space-y-1">
                            {conversations.map(c => (
                                <SidebarItem
                                    key={c.id}
                                    active={currentSessionId === c.id}
                                    title={c.title || 'Analysis Session'}
                                    date={new Date(c.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    onClick={() => switchSession(c.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-auto px-2 pt-4 border-t border-slate-100 italic opacity-50">
                    <p className="text-[9px] font-bold text-slate-400">Powered by BigT Intelligence v2.0</p>
                </div>
            </div>

            {/* Center Area: Chat Interface */}
            <div className="flex-1 flex flex-col relative bg-white">
                {/* Minimal Header */}
                <div className="px-8 py-4 border-b border-slate-50 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                            {conversations.find(c => c.id === currentSessionId)?.title || 'Analysis Arena'}
                        </h3>
                        <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-full">Secure Context</div>
                    </div>
                </div>

                {/* Messages Arena */}
                <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar scroll-smooth">
                    {messages.length === 0 && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto pb-20">
                            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-8 shadow-2xl rotate-3">
                                <Bot size={36} className="text-white" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 leading-none">
                                Ready to analyze, {store?.ownerName || 'Samstar'}?
                            </h2>
                            <p className="text-sm font-bold text-slate-400 leading-relaxed mb-10">
                                I've mapped your store's performance. Ask me about inventory gaps, marketing ROI, or next month's projections.
                            </p>
                            <div className="grid grid-cols-2 gap-3 w-full">
                                {[
                                    "Run inventory audit",
                                    "Suggest traffic plan",
                                    "Analyze top trends",
                                    "Check daily velocity"
                                ].map(q => (
                                    <button
                                        key={q}
                                        onClick={() => setInput(q)}
                                        className="p-4 bg-slate-50 rounded-2xl text-[11px] font-bold text-slate-700 hover:bg-slate-900 hover:text-white transition-all text-left flex items-center justify-between group"
                                    >
                                        {q} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={idx}
                            className={`flex gap-8 max-w-4xl mx-auto ${msg.role === 'user' ? 'justify-end' : ''}`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="w-10 h-10 rounded-2xl bg-slate-900 shadow-xl flex items-center justify-center shrink-0 border border-slate-800">
                                    <Bot size={20} className="text-white" />
                                </div>
                            )}

                            <div className={`space-y-3 max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                                <div className={`text-[14px] leading-relaxed whitespace-pre-wrap font-medium ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white p-5 rounded-[2rem] rounded-tr-none shadow-xl shadow-indigo-100'
                                        : 'text-slate-800 pt-2'
                                    }`}>
                                    {msg.content}
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-300 px-1">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            {msg.role === 'user' && (
                                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                                    <UserIcon size={18} className="text-indigo-600" />
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {loading && (
                        <div className="flex gap-8 max-w-4xl mx-auto animate-pulse">
                            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div className="flex items-center gap-3 pt-3">
                                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Processing live data...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-8 bg-white border-t border-slate-50 shrink-0">
                    <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                            <Sparkles size={18} />
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Message BigT about your business..."
                            className="w-full bg-slate-50 border-2 border-transparent rounded-[2rem] pl-16 pr-16 py-6 text-sm font-bold focus:outline-none focus:bg-white focus:border-indigo-600/10 focus:shadow-2xl transition-all shadow-inner placeholder:text-slate-400"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="absolute right-3 top-3 bottom-3 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-[1.5rem] disabled:opacity-30 disabled:grayscale transition-all shadow-lg active:scale-95 flex items-center justify-center"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                    <p className="text-[9px] text-center mt-4 text-slate-400 font-bold uppercase tracking-widest leading-none">
                        Analysis based on real-time database logs. Factual and data-driven only.
                    </p>
                </div>
            </div>

            {/* Right Pane: Intelligence Stream */}
            <div className="w-80 border-l border-slate-100 bg-white flex flex-col p-6 shrink-0 z-10">
                <IntelligenceStream advices={advices} notifications={notifications} />
            </div>
        </div>
    );
}
