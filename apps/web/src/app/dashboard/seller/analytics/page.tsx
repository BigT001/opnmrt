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
    CheckCircle2,
    AlertCircle,
    Info,
    Bell,
    MoreHorizontal,
    Lightbulb,
    ArrowRight,
    Zap,
    Clock,
    ChevronRight,
    LayoutDashboard,
    ShoppingBag,
    Users,
    Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
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
    const [conversations, setConversations] = useState<any[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [advices, setAdvices] = useState<string[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [aiStatus, setAiStatus] = useState<any>({ ready: true, circuitBroken: false });
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
        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 lg:left-24 flex bg-white font-sans overflow-hidden transition-all duration-500">
            {/* Left Sidebar: Session History */}
            <div className="w-72 border-r border-slate-200 flex flex-col bg-slate-50/20 p-6 shrink-0 transition-all duration-300">
                <button
                    onClick={handleNewChat}
                    className="w-full mb-10 flex items-center justify-between px-6 py-4 bg-white border border-slate-100 rounded-[2rem] hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105 group-hover:bg-emerald-600">
                            <Plus size={20} />
                        </div>
                        <span className="text-[12px] font-black uppercase tracking-widest text-slate-800">New Analysis</span>
                    </div>
                </button>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4 px-2">Store Records</p>
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

                <div className="mt-auto px-2 pt-6 border-t border-slate-100">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-loose">Powered by<br /><span className="text-emerald-500">BigT Intelligence v3.0</span></p>
                </div>
            </div>

            {/* Center Area: Chat Interface */}
            <div className="flex-1 flex flex-col relative bg-white overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.02)]">
                {/* Messages Arena */}
                <div className="flex-1 overflow-y-auto p-8 lg:p-14 space-y-12 no-scrollbar scroll-smooth relative">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-[radial-gradient(#f8fafc_2px,transparent_2px)] [background-size:40px_40px] opacity-60 pointer-events-none" />

                    {loading && messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing with history...</p>
                        </div>
                    )}

                    {messages.length === 0 && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto pb-20 relative z-10 px-6">
                            <h2 className="text-6xl font-black text-slate-900 tracking-tighter mb-2 leading-tight">
                                <span className="text-slate-300 font-medium">Meet</span> <span className="text-emerald-600">BigT</span>
                            </h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">
                                Your Personal Store Manager
                            </p>

                            <div className="max-w-xl mx-auto mb-16 space-y-3">
                                <p className="text-base font-medium text-slate-800 leading-relaxed">
                                    I track your sales as they happen to help you sell more.
                                </p>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Ask me anything about your stock, money, or what to do next to grow your business.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl mx-auto">
                                {QUICK_PROMPTS.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSendMessage({ preventDefault: () => { } } as any, q.prompt)}
                                        className="group p-6 bg-white border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/20 rounded-[2rem] text-left transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1"
                                    >
                                        <div className="flex flex-col h-full justify-between gap-3">
                                            <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">{q.label}</p>
                                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">{q.prompt}</p>
                                        </div>
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
                            className={`flex gap-4 w-full px-4 mb-6 ${msg.role === 'user' ? 'justify-end' : ''}`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="w-10 h-10 rounded-2xl shadow-xl flex items-center justify-center shrink-0 border border-indigo-400 overflow-hidden bg-white">
                                    <img src="/bigt-avatar.svg" className="w-full h-full object-cover" alt="BigT" />
                                </div>
                            )}

                            <div className={`space-y-1.5 w-full flex flex-col ${msg.role === 'user' ? 'items-end' : ''}`}>
                                {msg.role === 'assistant' && (
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 px-1">BigT Intelligence</p>
                                )}
                                <div className={`max-w-[92%] text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-slate-900 text-white p-5 rounded-[2rem] rounded-tr-none shadow-sm font-medium'
                                    : 'bg-white border border-slate-100 p-6 rounded-[2rem] rounded-tl-none shadow-sm w-full'
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
                                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                                    <UserIcon size={18} className="text-slate-600" />
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4 w-full pr-12"
                        >
                            <div className="w-10 h-10 rounded-2xl shadow-xl flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden bg-white">
                                <img src="/bigt-avatar.svg" className="w-full h-full object-cover animate-pulse" alt="Thinking..." />
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
                <div className="p-4 border-t border-slate-50 relative shrink-0 z-20 bg-white">
                    <form
                        onSubmit={(e) => {
                            // Regular submit logic 
                            handleSendMessage(e);
                            // Reset height on submit
                            const textarea = e.currentTarget.querySelector('textarea');
                            if (textarea) textarea.style.height = 'auto';
                        }}
                        className="relative max-w-2xl mx-auto flex items-end gap-2 p-2 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-200 transition-all shadow-sm"
                    >
                        <div className="pl-3 pb-3 text-slate-400">
                            <Sparkles size={18} className="text-slate-300" />
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e as any);
                                    e.currentTarget.style.height = 'auto'; // Reset height
                                }
                            }}
                            placeholder="Message BigT about your business..."
                            className="flex-1 bg-transparent border-0 focus:ring-0 text-slate-800 placeholder-slate-400 font-medium text-sm py-3 px-2 resize-none max-h-[150px] overflow-y-auto"
                            rows={1}
                            style={{ height: 'auto', minHeight: '44px' }}
                        />
                        <div className="pb-1 pr-1">
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-full hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </button>
                        </div>
                    </form>
                    <p className="text-[10px] text-center text-slate-300 font-bold uppercase tracking-widest mt-3">
                        Analysis based on real-time database logs. Factual and data-driven only.
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
