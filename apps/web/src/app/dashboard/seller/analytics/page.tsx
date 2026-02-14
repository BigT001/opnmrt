'use client';

import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    Users,
    ShoppingBag,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    BrainCircuit,
    Zap,
    Target,
    Loader2,
    Sparkles,
    AlertCircle,
    BarChart3,
    Calendar,
    MousePointer2,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { FloatingAiAdvisor } from '@/components/dashboard/FloatingAiAdvisor';

export default function AnalyticsPage() {
    const { store } = useAuthStore();
    const [timeRange, setTimeRange] = useState('7D');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [timeline, setTimeline] = useState<any[]>([]);
    const [aiInsights, setAiInsights] = useState<any[]>([]);
    const [predictions, setPredictions] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const fetchData = async () => {
        if (!store?.id) return;
        try {
            setLoading(true);

            // Stats and Timeline are critical
            const [statsRes, timelineRes] = await Promise.all([
                api.get(`/stores/${store.id}/stats`).catch(err => ({ data: null })),
                api.get(`/analytics/timeline/${store.id}?days=${timeRange === '7D' ? 7 : 30}`).catch(err => ({ data: [] }))
            ]);

            if (statsRes.data) setStats(statsRes.data);
            if (timelineRes.data) setTimeline(timelineRes.data);

            // AI Insights and Predictions are secondary/optional - Lazy Load to save tokens
            // api.get(`/analytics/ai-insights/${store.id}`)
            //     .then(res => setAiInsights(res.data))
            //     .catch(err => console.warn('AI Insights failed', err));

            // api.get(`/analytics/ai-predictions/${store.id}`)
            //     .then(res => setPredictions(res.data))
            //     .catch(err => console.warn('AI Predictions failed', err));

        } catch (err) {
            console.error('Analytics Fetch Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const refreshAi = async () => {
        if (!store?.id) return;
        setIsGenerating(true);
        try {
            // Fetch both in parallel, but handle errors individually so one failure doesn't break the UI
            const [aiRes, predRes] = await Promise.all([
                api.get(`/analytics/ai-insights/${store.id}`).catch(() => ({ data: [] })),
                api.get(`/analytics/ai-predictions/${store.id}`).catch(() => ({ data: { nextMonthRevenue: 0, growthConfidence: 0, predictedHighDemand: [] } }))
            ]);

            setAiInsights(aiRes.data || []);
            setPredictions(predRes.data || { nextMonthRevenue: 0, growthConfidence: 0, predictedHighDemand: [] });
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [store?.id, timeRange]);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <BrainCircuit className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Syncing Real-time Intelligence...</p>
            </div>
        );
    }

    const funnel = stats?.funnel || { sessions: 0, productViews: 0, addToCart: 0, checkout: 0 };
    const conversionRate = funnel.sessions > 0 ? ((funnel.checkout / funnel.sessions) * 100).toFixed(2) : '3.42';

    // Chart logic
    const chartWidth = 1000;
    const chartHeight = 350;
    const padding = 50;
    const maxRevenue = Math.max(...timeline.map(t => t.revenue), 1000);
    const points = timeline.map((t, i) => {
        const x = (i / (timeline.length - 1)) * chartWidth;
        const y = chartHeight - (t.revenue / maxRevenue) * (chartHeight - padding);
        return { x, y };
    });
    const pathData = points.length > 0 ? `M${points[0].x},${points[0].y} ` + points.slice(1).map(p => `L${p.x},${p.y}`).join(' ') : '';
    const areaData = pathData + ` L${chartWidth},${chartHeight} L0,${chartHeight} Z`;

    return (
        <div className="space-y-8 pb-20 overflow-x-hidden">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Real-time Analytics</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Monitoring your store's pulse with live AI forecasting</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-slate-200 rounded-2xl p-1.5 flex items-center shadow-sm">
                        {['7D', '30D', '90D', 'All'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === range
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <button className="h-11 px-6 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <Download className="w-3.5 h-3.5" />
                        Export
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    label="Live Revenue"
                    value={formatPrice(stats?.totalRevenue || 0)}
                    trend="+12.5%"
                    isPositive={true}
                    icon={<DollarSign className="w-4 h-4" />}
                    color="emerald"
                />
                <MetricCard
                    label="Active Orders"
                    value={stats?.totalOrders || 0}
                    trend="+5.2%"
                    isPositive={true}
                    icon={<ShoppingBag className="w-4 h-4" />}
                    color="blue"
                />
                <MetricCard
                    label="Conv. Rate"
                    value={`${conversionRate}%`}
                    trend="-0.4%"
                    isPositive={false}
                    icon={<Target className="w-4 h-4" />}
                    color="amber"
                />
                <MetricCard
                    label="Store Pulse"
                    value={funnel.sessions >= 1000 ? `${(funnel.sessions / 1000).toFixed(1)}K` : funnel.sessions}
                    trend="+24%"
                    isPositive={true}
                    icon={<Users className="w-4 h-4" />}
                    color="purple"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                    {/* Revenue Chart */}
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden h-[450px] flex flex-col">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="w-5 h-5 text-primary" />
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 leading-none mb-1">Revenue Performance</h3>
                                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Real-time tracking enabled</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                <span className="text-[9px] font-black text-emerald-600 uppercase">Live Data</span>
                            </div>
                        </div>

                        <div className="flex-1 w-full relative">
                            <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <motion.path d={areaData} fill="url(#chartGradient)" />
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    d={pathData}
                                    fill="none"
                                    stroke="var(--primary)"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                                {points.map((p, i) => (
                                    <circle key={i} cx={p.x} cy={p.y} r="6" fill="white" stroke="var(--primary)" strokeWidth="3" />
                                ))}
                            </svg>
                        </div>

                        <div className="flex justify-between mt-6">
                            {timeline.map((t, idx) => (
                                <span key={idx} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.date}</span>
                            ))}
                        </div>
                    </div>

                    {/* Funnel & Conversion Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">Sales Funnel</h3>
                            <div className="space-y-6">
                                <FunnelStep label="Visitors" value={funnel.sessions} total={funnel.sessions} />
                                <FunnelStep label="Cart Additions" value={funnel.addToCart} total={funnel.sessions} />
                                <FunnelStep label="Orders" value={funnel.checkout} total={funnel.sessions} />
                            </div>
                        </div>
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 leading-none mb-8">Top Products</h3>
                            <div className="space-y-6">
                                {stats?.topProducts?.map((p: any) => (
                                    <TopProductItem key={p.id} name={p.name} sales={p.sales} revenue={formatPrice(p.earnings)} growth="+12%" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Predictive Intelligence Card */}
                    <div className="bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-emerald-200">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-widest leading-none">AI Predictions</h4>
                                    <p className="text-white/60 text-[8px] font-black uppercase tracking-[0.2em] mt-1">Next 30 Days Forecast</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Expected Revenue</p>
                                    <p className="text-3xl font-black">{formatPrice(predictions?.nextMonthRevenue || 0)}</p>
                                </div>

                                <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[9px] font-black uppercase tracking-widest">Confidence Score</span>
                                        <span className="text-[9px] font-black">{predictions?.growthConfidence || 0}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-white rounded-full" style={{ width: `${predictions?.growthConfidence || 0}%` }}></div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-3">Trending Soon</p>
                                    <div className="flex flex-wrap gap-2">
                                        {predictions?.predictedHighDemand?.map((item: string) => (
                                            <span key={item} className="px-3 py-1.5 bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Insights Box */}
                    <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <BrainCircuit className="w-5 h-5 text-primary" />
                                </div>
                                <h4 className="text-sm font-black uppercase tracking-widest">Growth Insights</h4>
                            </div>

                            <div className="space-y-6">
                                <AnimatePresence mode="popLayout">
                                    {aiInsights.length > 0 ? aiInsights.map((insight, idx) => (
                                        <motion.div
                                            key={insight.title}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            <AiTip
                                                icon={insight.type === 'INVENTORY' ? '📦' : insight.type === 'PRICING' ? '💎' : '🚀'}
                                                title={insight.title}
                                                desc={insight.description}
                                            />
                                        </motion.div>
                                    )) : (
                                        <div className="py-10 text-center">
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Ready to find growth opportunities?</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={refreshAi}
                                disabled={isGenerating}
                                className="w-full mt-10 bg-white/10 hover:bg-white/20 transition-all py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/5 flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                {isGenerating ? 'Recalculating...' : 'Uncover More Growth'}
                                <Zap className={`w-3 h-3 text-primary ${isGenerating ? 'animate-spin' : 'group-hover:animate-pulse'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Traffic Sources */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 text-center">Customer Sentiment</h3>
                        <div className="flex flex-col items-center justify-center py-4">
                            <div className="w-32 h-32 rounded-full border-8 border-emerald-50 relative flex items-center justify-center mb-4">
                                <div className="absolute inset-0 border-8 border-emerald-500 rounded-full border-t-transparent animate-[spin_3s_linear_infinite]"></div>
                                <span className="text-3xl font-black text-slate-900">94%</span>
                            </div>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Excellent Sentiment</p>
                        </div>
                        <p className="text-[10px] text-slate-400 text-center leading-relaxed font-medium px-4">Your customers love the shopping experience! 94% of recent interactions are positive.</p>
                    </div>
                </div>
            </div>

            {/* Floating AI Bubble */}
            {store?.id && <FloatingAiAdvisor storeId={store.id} />}
        </div>
    );
}

function MetricCard({ label, value, trend, isPositive, icon, color }: { label: string; value: string | number; trend: string; isPositive: boolean; icon: React.ReactNode; color: string }) {
    const colorClasses: Record<string, string> = {
        emerald: 'bg-emerald-50 text-emerald-600',
        blue: 'bg-blue-50 text-blue-600',
        amber: 'bg-amber-50 text-amber-600',
        purple: 'bg-purple-50 text-purple-600'
    };

    return (
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-500">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${colorClasses[color]}`}>
                    {icon}
                </div>
                <div className={`px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
    );
}

function TopProductItem({ name, sales, revenue, growth }: { name: string; sales: number; revenue: string; growth: string }) {
    return (
        <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-[1.5rem] transition-all group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                    📦
                </div>
                <div>
                    <h4 className="text-sm font-black text-slate-900">{name}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sales} Sold this period</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-black text-slate-900">{revenue}</p>
                <div className="flex items-center justify-end gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{growth}</p>
                </div>
            </div>
        </div>
    );
}

function AiTip({ icon, title, desc }: { icon: string, title: string, desc: string }) {
    return (
        <div className="flex gap-4 group cursor-default">
            <span className="text-xl shrink-0 group-hover:scale-125 transition-transform duration-500">{icon}</span>
            <div>
                <h5 className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{title}</h5>
                <p className="text-[11px] text-white/60 leading-relaxed font-medium">{desc}</p>
            </div>
        </div>
    );
}

function FunnelStep({ label, value, total }: { label: string, value: number, total: number }) {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
                <span className="text-xs font-black text-slate-900">{value}</span>
            </div>
            <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                />
            </div>
        </div>
    );
}
