'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Plus,
    Send,
    Bot,
    TrendingUp,
    Clock,
    ChevronRight,
    ChevronLeft,
    PlusCircle,
    Zap,
    Search,
    MessageCircle,
    MessageSquare,
    Calendar,
    ArrowRight,
    LayoutDashboard,
    User as UserIcon,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Info,
    ChevronDown,
    MoreHorizontal,
    Lightbulb,
    ShoppingBag,
    Users,
    Package,
    Loader2,
    Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { FormattedMessage } from '@/components/FormattedMessage';
import { AiAdvisor } from '@/components/dashboard/AiAdvisor';

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

// --- Main Page ---

const QUICK_PROMPTS = [
    { label: 'Inventory Audit', prompt: 'Run a full inventory audit and tell me which items are trending down.' },
    { label: 'Traffic Boost', prompt: 'How can I increase traffic to my store this week?' },
    { label: 'Trend Analysis', prompt: 'What are the top 3 trending products in my category right now?' },
    { label: 'Sales Velocity', prompt: 'Calculate my daily sales velocity for the last 7 days.' },
    { label: 'Future Predictions', prompt: 'Based on my recent sales, predict my revenue for next month.' },
    { label: 'Marketing Copy', prompt: 'Write an email draft for a "flash sale" on my latest collection.' },
    { label: 'Slow Stock', prompt: 'Which products haven\'t sold in the last 30 days?' },
    { label: 'Growth Plan', prompt: 'Give me 3 actionable tips to grow my business today.' },
];

export default function AnalyticsPage() {
    const { store, user } = useAuthStore();
    const { setMobileMenuOpen } = useUIStore();
    const [conversations, setConversations] = useState<any[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [advices, setAdvices] = useState<string[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [aiStatus, setAiStatus] = useState<any>({ ready: true, circuitBroken: false });
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [activeDrawerTab, setActiveDrawerTab] = useState<'history' | 'advice'>('history');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Load + Real-time polling
    useEffect(() => {
        if (!store?.id) return;
        fetchConversations();
        fetchNotifications();
        fetchLiveAdvice();
        fetchAiStatus();

        // 1. Poll for notifications frequently (every 10 seconds) - DB only
        const notifyInterval = setInterval(() => {
            fetchNotifications();
            fetchAiStatus();
        }, 10000);

        // 2. Poll for AI advice occasionally (every 5 minutes) - AI limited
        const adviceInterval = setInterval(() => {
            fetchLiveAdvice();
        }, 300000);

        return () => {
            clearInterval(notifyInterval);
            clearInterval(adviceInterval);
        };
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

    const fetchAiStatus = async () => {
        try {
            const res = await api.get('/analytics/ai-status');
            setAiStatus(res.data);
        } catch (err) { console.warn('Status check failed', err); }
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

    const handleSendMessage = async (e?: React.FormEvent, directMessage?: string) => {
        if (e) e.preventDefault();
        const userMsg = (directMessage || input).trim();
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

    const handleDiscussAdvice = (advice: string) => {
        const cleanAdvice = advice.replace(/^"|"$/g, '');
        const prompt = `I'd like to discuss this advice: "${cleanAdvice}". What specific steps should I take?`;
        handleSendMessage({ preventDefault: () => { } } as any, prompt);
    };

    return (
        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 lg:left-24 flex flex-col lg:flex-row bg-white font-sans overflow-hidden transition-all duration-500 z-[105]">
            {/* Mobile Header: Integrated Dashboard & WhatsApp Style */}
            <div className="lg:hidden flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-white/95 backdrop-blur-xl sticky top-0 z-[150]">
                <div className="flex items-center gap-1.5">
                    {/* Main Sidebar Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 text-slate-600 active:scale-90 transition-all"
                    >
                        <Menu size={22} strokeWidth={2.5} />
                    </button>

                    <div className="w-px h-5 bg-slate-200 mx-0.5" />

                    {/* Back Arrow to Dashboard */}
                    {(currentSessionId || messages.length > 0) && (
                        <button
                            onClick={() => { setCurrentSessionId(null); setMessages([]); }}
                            className="p-2 -ml-1 text-slate-900 active:scale-75 transition-all"
                        >
                            <ChevronLeft size={28} strokeWidth={2.5} />
                        </button>
                    )}

                    {/* Chat Identity */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-md relative group">
                            <Bot size={16} className="text-emerald-400" />
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[12px] font-black tracking-tight text-slate-900 leading-none">BigT Intelligence</p>
                            <span className="text-[9px] font-bold text-emerald-500 mt-0.5">Online</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { setActiveDrawerTab('advice'); setIsHistoryOpen(true); }}
                        className="p-2 text-slate-400 active:scale-90 transition-all"
                    >
                        <Zap size={18} />
                    </button>

                    {/* Merchant Avatar to Storefront */}
                    <a
                        href={`/store/${store?.subdomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 shadow-sm overflow-hidden active:scale-90 transition-all ml-1"
                    >
                        {store?.logo ? (
                            <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-emerald-600 text-white text-[10px] font-black">
                                {store?.name?.charAt(0) || 'O'}
                            </div>
                        )}
                    </a>
                </div>
            </div>

            {/* History & Advice Overlay for Mobile */}
            <AnimatePresence>
                {isHistoryOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsHistoryOpen(false)}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Left Sidebar: Session History & Intelligence Centre */}
            <div className={`
                fixed inset-y-0 left-0 w-[85%] sm:w-80 bg-white lg:relative lg:flex flex-col border-r border-slate-100 p-0 shrink-0 z-50 transition-all duration-500 ease-spotlight
                ${isHistoryOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="lg:hidden flex flex-col p-5 pb-2">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Bot size={18} className="text-emerald-500" />
                            <span className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-900">Intelligence Hub</span>
                        </div>
                        <button onClick={() => setIsHistoryOpen(false)} className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 active:scale-75 transition-all">
                            <ChevronRight className="rotate-180" size={18} />
                        </button>
                    </div>

                    <div className="flex p-1 bg-slate-100 rounded-2xl mb-4">
                        <button
                            onClick={() => setActiveDrawerTab('history')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeDrawerTab === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                        >
                            <Clock size={14} /> History
                        </button>
                        <button
                            onClick={() => setActiveDrawerTab('advice')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeDrawerTab === 'advice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                        >
                            <Zap size={14} /> Advice
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col p-5 overflow-hidden">
                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        {(activeDrawerTab === 'history' || !isHistoryOpen) && (
                            <motion.div
                                key="history"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex-1 flex flex-col min-h-0"
                            >
                                <button
                                    onClick={() => { handleNewChat(); if (isHistoryOpen) setIsHistoryOpen(false); }}
                                    className="w-full mb-6 flex items-center justify-between px-5 py-4 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-black transition-all group shrink-0 shadow-xl shadow-slate-900/10 active:scale-95"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                                            <Plus size={18} strokeWidth={3} />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-widest text-white">New Analysis</span>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4 px-2">Store Records</p>
                                        <div className="space-y-1">
                                            {conversations.map(c => (
                                                <SidebarItem
                                                    key={c.id}
                                                    active={currentSessionId === c.id}
                                                    title={c.title || 'Analysis Session'}
                                                    date={new Date(c.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                    onClick={() => { switchSession(c.id); if (isHistoryOpen) setIsHistoryOpen(false); }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeDrawerTab === 'advice' && isHistoryOpen && (
                            <motion.div
                                key="advice"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex-1 overflow-y-auto no-scrollbar"
                            >
                                <AiAdvisor
                                    storeId={store?.id || ''}
                                    advices={advices}
                                    notifications={notifications}
                                    onDiscuss={(advice) => {
                                        handleDiscussAdvice(advice);
                                        setIsHistoryOpen(false);
                                    }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 pt-6 border-t border-slate-100 shrink-0">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-loose">Powered by<br /><span className="text-emerald-500">BigT Intelligence v3.0</span></p>
                    </div>
                </div>
            </div>

            {/* Center Area: Chat Interface */}
            <div className="flex-1 flex flex-col relative bg-white overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.02)]">
                {/* Desktop Arena Header (if in chat) */}
                {(currentSessionId || messages.length > 0) && !loading && (
                    <div className="hidden lg:flex items-center justify-between px-14 py-4 border-b border-slate-50 bg-white/50 backdrop-blur-sm sticky top-0 z-20">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => { setCurrentSessionId(null); setMessages([]); }}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                            >
                                <ChevronLeft size={16} strokeWidth={3} /> Dashboard
                            </button>
                            <div className="w-px h-6 bg-slate-200" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Intelligence Stream</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-800">BigT Intelligent Core Active</span>
                        </div>
                    </div>
                )}

                {/* Messages Arena */}
                <div className="flex-1 overflow-y-auto px-0 lg:px-14 space-y-6 lg:space-y-12 no-scrollbar scroll-smooth relative">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

                    {loading && messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing with history...</p>
                        </div>
                    )}

                    {messages.length === 0 && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto pb-10 lg:pb-20 relative z-10 px-4">
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="mb-6 lg:mb-8"
                            >
                                <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-2 leading-tight">
                                    <span className="text-slate-300 font-medium">Hello,</span> <span className="text-emerald-600">BigT</span>
                                </h1>
                                <p className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
                                    Your personal store architect
                                </p>
                            </motion.div>

                            <div className="max-w-xl mx-auto mb-12 space-y-4 px-4">
                                <p className="text-sm lg:text-base font-bold text-slate-800 leading-relaxed">
                                    I am your all-in-one store architect. Beyond tracking transactions, I generate professional marketing copy, provide data-driven strategic advice, and perform deep-dive financial and inventory audits to scale your business.
                                </p>
                                <p className="text-[11px] lg:text-sm text-slate-500 font-medium leading-relaxed opacity-60">
                                    Ask me for a stock audit, traffic growth strategies, or localized profit predictions.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-4xl mx-auto px-2">
                                {QUICK_PROMPTS.slice(0, 4).map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSendMessage({ preventDefault: () => { } } as any, q.prompt)}
                                        className="group p-4 lg:p-6 bg-white border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/20 rounded-[1.5rem] lg:rounded-[2rem] text-left transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/5 active:scale-95"
                                    >
                                        <div className="flex flex-col h-full justify-between gap-2">
                                            <p className="text-[9px] lg:text-[11px] font-black text-emerald-600 uppercase tracking-widest">{q.label}</p>
                                            <p className="text-[10px] lg:text-[11px] text-slate-500 font-bold leading-snug line-clamp-2">{q.prompt}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-6 lg:gap-8 pt-6 lg:pt-0">
                        {messages.map((msg, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={idx}
                                className={`flex gap-1.5 lg:gap-4 w-full px-2 lg:px-4 ${msg.role === 'user' ? 'justify-end' : ''}`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full shadow-lg flex items-center justify-center shrink-0 border border-emerald-400 overflow-hidden bg-white mt-1 z-10">
                                        <Bot size={18} className="text-emerald-500" />
                                    </div>
                                )}

                                <div className={`space-y-1 w-full max-w-[99%] flex-1 flex flex-col ${msg.role === 'user' ? 'items-end' : ''}`}>
                                    {msg.role === 'assistant' && (
                                        <p className="text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 mb-0.5 px-2">BigT Intelligence Core</p>
                                    )}
                                    <div className={`text-[13.5px] lg:text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-slate-900 text-white p-4 lg:p-5 rounded-[1.25rem] lg:rounded-[2rem] rounded-tr-none shadow-md font-bold'
                                        : 'bg-white border border-slate-100 p-4 lg:p-6 rounded-[1.25rem] lg:rounded-[2rem] rounded-tl-none shadow-sm w-full font-medium text-slate-800'
                                        }`}>
                                        {msg.role === 'assistant' ? (
                                            <FormattedMessage content={msg.content} />
                                        ) : (
                                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                        )}
                                    </div>
                                    <div className={`flex items-center gap-2 px-2 mt-1 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-center gap-1">
                                                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                                <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">Verified Data</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200 mt-1">
                                        <UserIcon size={14} className="text-slate-400" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4 w-full pr-12 px-2"
                        >
                            <div className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden bg-white">
                                <Bot size={20} className="text-emerald-500 animate-pulse" />
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="flex gap-1.5 px-6 py-4 bg-white border border-slate-100 rounded-[2rem] rounded-tl-none shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                                </div>
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-300 px-3 animate-pulse">BigT is analyzing your data...</p>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 lg:p-4 border-t border-slate-50 relative shrink-0 z-20 bg-white">
                    <form
                        onSubmit={(e) => {
                            handleSendMessage(e);
                            const textarea = e.currentTarget.querySelector('textarea');
                            if (textarea) textarea.style.height = 'auto';
                        }}
                        className="relative max-w-2xl mx-auto flex items-end gap-2 p-1.5 bg-slate-100 border border-slate-200 rounded-[2rem] focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/5 focus-within:border-emerald-300 transition-all shadow-sm"
                    >
                        <div className="pl-3 pb-3 text-slate-400">
                            <Sparkles size={16} className="text-emerald-500" />
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e as any);
                                    e.currentTarget.style.height = 'auto';
                                }
                            }}
                            placeholder="Ask BigT anything..."
                            className="flex-1 bg-transparent border-0 focus:ring-0 text-slate-800 placeholder-slate-400 font-bold text-[14px] py-3.5 px-1 resize-none max-h-[120px] overflow-y-auto leading-relaxed"
                            rows={1}
                            style={{ height: 'auto', minHeight: '40px' }}
                        />
                        <div className="pb-1 pr-1">
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="w-11 h-11 flex items-center justify-center bg-slate-900 text-white rounded-full hover:bg-emerald-600 transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-slate-900/10 active:scale-90"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
                            </button>
                        </div>
                    </form>
                    <p className="text-[8px] lg:text-[10px] text-center text-slate-300 font-black uppercase tracking-widest mt-3 opacity-60">
                        Secure Database Analysis • Pro Environment
                    </p>
                </div>
            </div>

            {/* Right Pane: Intelligence Stream */}
            <div className="w-96 border-l border-slate-50 bg-white flex flex-col p-8 shrink-0 z-10 hidden xl:flex">
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <AiAdvisor
                        storeId={store?.id || ''}
                        advices={advices}
                        notifications={notifications}
                        onDiscuss={handleDiscussAdvice}
                    />
                </div>
            </div>
        </div>
    );
}
