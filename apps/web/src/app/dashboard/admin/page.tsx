'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { APP_BASE_DOMAIN } from '@/lib/config';

import { formatDistanceToNow } from 'date-fns';

export default function AdminOverview() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'merchants' | 'buyers' | 'system'>('merchants');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('admin/stats');
                setStats(response.data);
            } catch (err) {
                console.error('Failed to fetch admin stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse text-slate-700">
                <div className="h-20 bg-slate-900/50 rounded-3xl w-full" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-40 bg-slate-900/50 rounded-3xl" />
                    ))}
                </div>
            </div>
        );
    }

    // Prepare chart data from stats.revenueGrowth
    const chartData = stats?.revenueGrowth?.slice(-7) || [];
    const maxRevenue = Math.max(...chartData.map((d: any) => d.amount), 1);

    return (
        <div className="space-y-12 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 bg-emerald-500 text-[#010409] text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/10">HQ Command</div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Platform Revenue Tiers (Subscription Revenue) */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <RevenueCard label="Free Tier" value={`₦${Number(stats?.tierRevenue?.free || 0).toLocaleString()}`} count={stats?.totalStores || 0} color="slate" />
                    <RevenueCard label="Pro Revenue" value={`₦${Number(stats?.tierRevenue?.pro || 0).toLocaleString()}`} count={Math.ceil((stats?.tierRevenue?.pro || 0) / 15000)} color="emerald" />
                    <RevenueCard label="Enterprise" value={`₦${Number(stats?.tierRevenue?.enterprise || 0).toLocaleString()}`} count={Math.ceil((stats?.tierRevenue?.enterprise || 0) / 50000)} color="emerald" />
                    <RevenueCard label="Total Subscriptions" value={`₦${Number(stats?.totalSubscriptionRevenue || 0).toLocaleString()}`} isTotal color="emerald" highlight />
                </div>
            </div>

            {/* Core Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Direct Transactions" value={`₦${Number(stats?.totalPlatformRevenue || 0).toLocaleString()}`} icon="💳" color="emerald" subtitle="Gross Merchant Sales" />
                <StatCard label="Active Sellers" value={stats?.totalSellers || 0} icon="👨‍💼" color="emerald" subtitle="Verified Merchants" />
                <StatCard label="Global Users" value={stats?.totalBuyers || 0} icon="👥" color="emerald" subtitle="Acquired Customers" />
                <StatCard label="Open Stores" value={stats?.totalStores || 0} icon="🏗️" color="emerald" subtitle="Live Environments" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Revenue Trajectory Chart */}
                <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-12 shadow-3xl group">
                    <div className="flex justify-between items-start mb-16">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-widest leading-none">Revenue Trajectory</h3>
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-3 font-mono">Dynamic Performance Forecasting</p>
                        </div>
                        <div className="bg-slate-950 p-1.5 rounded-2xl border border-white/10 flex items-center">
                            <button className="px-6 py-2.5 bg-emerald-500 text-[#010409] text-[10px] font-black rounded-xl uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all">Direct Sales</button>
                            <button className="px-6 py-2.5 text-slate-600 text-[10px] font-black rounded-xl uppercase tracking-widest hover:text-white transition-all">Subscriptions</button>
                        </div>
                    </div>
                    <div className="h-80 flex flex-col justify-end space-y-6">
                        <div className="flex items-end space-x-6 h-full px-4">
                            {chartData.map((d: any, i: number) => {
                                const height = maxRevenue > 0 ? (d.amount / maxRevenue) * 100 : 5;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.max(height, 5)}%` }}
                                        transition={{ delay: i * 0.1, duration: 1.5, ease: "circOut" }}
                                        className="flex-1 bg-emerald-500 rounded-t-3xl relative group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-600 to-transparent opacity-40" />
                                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {/* Tooltip */}
                                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-black p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 shadow-2xl z-30 pointer-events-none min-w-[100px] border border-black/5">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{d.date}</p>
                                            <p className="text-[11px] font-black tracking-tighter leading-none">₦{Number(d.amount).toLocaleString()}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between text-[11px] font-black text-slate-700 uppercase tracking-[0.2em] pt-8 border-t border-white/5 font-mono">
                            {chartData.map((d: any, i: number) => (
                                <span key={i}>{new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Neural Activity Feed with Tabs */}
                <div className="lg:col-span-4 bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] shadow-3xl flex flex-col overflow-hidden">
                    <div className="p-10 pb-6 border-b border-white/5">
                        <h3 className="text-xl font-black text-white uppercase tracking-widest leading-none mb-4">Neural Activity</h3>
                        <div className="flex gap-2">
                            <ActivityTab active={activeTab === 'merchants'} onClick={() => setActiveTab('merchants')}>Merchants</ActivityTab>
                            <ActivityTab active={activeTab === 'buyers'} onClick={() => setActiveTab('buyers')}>Buyers</ActivityTab>
                            <ActivityTab active={activeTab === 'system'} onClick={() => setActiveTab('system')}>Operations</ActivityTab>
                        </div>
                    </div>

                    <div className="space-y-1 p-8 flex-1 overflow-y-auto no-scrollbar">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                {(stats?.activity?.[activeTab as keyof typeof stats.activity] || []).length > 0 ? (
                                    stats.activity[activeTab as keyof typeof stats.activity].map((item: any, idx: number) => (
                                        <ActivityItem
                                            key={idx}
                                            icon={activeTab === 'merchants' ? '👨‍💼' : activeTab === 'buyers' ? '👤' : '⚡'}
                                            title={item.title}
                                            desc={item.desc}
                                            time={formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                                        />
                                    ))
                                ) : (
                                    <div className="py-20 flex flex-col items-center justify-center text-center opacity-20 grayscale">
                                        <div className="text-5xl mb-6">🛰️</div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">No Stream Data Predicted</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Top Stores */}
                <div className="md:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 shadow-3xl">
                    <h3 className="text-lg font-black text-white uppercase tracking-widest leading-none mb-10">Elite Storefronts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stats?.topStores?.map((store: any, idx: number) => (
                            <div key={idx} className="bg-slate-950/50 border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-xl font-black text-emerald-400">
                                        {store.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{store.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{store.subdomain}.{APP_BASE_DOMAIN}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-white leading-none">{store.orderCount}</p>
                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Orders</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Platform Health */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 shadow-3xl flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-widest leading-none mb-10">System Bio</h3>
                        <div className="space-y-8">
                            <HealthMetric label="Gateway Uptime" value="99.98%" status="optimal" />
                            <HealthMetric label="DB Latency" value="12ms" status="optimal" />
                            <HealthMetric label="Media Optimization" value="Active" status="optimal" />
                            <HealthMetric label="CDN Propagation" value="Global" status="optimal" />
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Command Center Footer */}
            <div className="bg-emerald-500/90 backdrop-blur-3xl py-6 px-12 rounded-[2.5rem] flex items-center justify-between shadow-2xl shadow-emerald-500/20 border border-white/20">
                <div className="flex items-center space-x-6 text-[#030712]">
                    <div className="p-3 bg-white/20 rounded-2xl">
                        <span className="text-2xl">⚡</span>
                    </div>
                    <div>
                        <span className="text-sm font-black uppercase tracking-tighter leading-none block">Predictive Analytics Engine</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#030712]/60 mt-1 block">Cross-tenant inventory balancing enabled</span>
                    </div>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-white bg-slate-950 px-8 py-4 rounded-2xl hover:bg-black transition-all active:scale-95 shadow-2xl ring-2 ring-white/5">
                    Launch Insight Terminal
                </button>
            </div>
        </div>
    );
}

function RevenueCard({ label, value, count, color, isTotal = false, highlight = false }: { label: string, value: string, count?: number, color: string, isTotal?: boolean, highlight?: boolean }) {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className={`p-8 rounded-[2.5rem] border ${highlight ? 'bg-emerald-500 border-white/20' : 'bg-slate-900/50 border-white/5'} transition-all shadow-2xl relative overflow-hidden group`}
        >
            {highlight && <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />}
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${highlight ? 'text-[#010409]/60' : 'text-slate-500'}`}>{label}</p>
                    {!isTotal && <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${highlight ? 'bg-[#010409]/10 text-[#010409]' : 'bg-slate-950 text-slate-500'}`}>{count} Stores</span>}
                </div>
                <p className={`text-3xl font-black tracking-tight ${highlight ? 'text-[#010409]' : 'text-white'}`}>{value}</p>
                {isTotal && <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest">Platform Gross Profit</p>}
            </div>
        </motion.div>
    );
}

function ActivityTab({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-emerald-500 text-[#010409] shadow-lg shadow-emerald-500/10' : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5'
                }`}
        >
            {children}
        </button>
    );
}

function HealthMetric({ label, value, status }: { label: string, value: string, status: 'optimal' | 'warning' | 'critical' }) {
    return (
        <div className="flex items-center justify-between group">
            <div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 group-hover:text-emerald-500/50 transition-colors">{label}</p>
                <p className="text-xl font-black text-white tracking-[0.1em]">{value}</p>
            </div>
            <div className={`w-3.5 h-3.5 rounded-full ${status === 'optimal' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]'} animate-pulse`} />
        </div>
    );
}

function StatCard({ label, value, icon, color, subtitle }: { label: string; value: string | number; icon: string; color: string; subtitle?: string }) {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-3xl"
        >
            <div className="absolute -right-6 -bottom-6 text-9xl opacity-[0.03] transition-transform group-hover:scale-110 group-hover:-rotate-12 duration-1000 pointer-events-none select-none">
                {icon}
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-emerald-500 transition-colors">{label}</span>
                </div>
                <p className="text-4xl font-black text-white tracking-tighter leading-none mb-3">{value}</p>
                {subtitle && <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">{subtitle}</p>}
            </div>
        </motion.div>
    );
}

function ActivityItem({ icon, title, desc, time }: { icon: string; title: string; desc: string; time: string }) {
    return (
        <div className="flex items-start space-x-6 border-l-2 border-white/5 pl-8 py-3 hover:border-emerald-500/50 transition-all group relative">
            <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-800 border border-white/10 group-hover:bg-emerald-500 transition-colors" />
            <div className="w-12 h-12 bg-slate-950/50 rounded-2xl flex items-center justify-center text-xl shrink-0 border border-white/5 group-hover:border-emerald-500/20 transition-all group-hover:scale-110">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-black text-slate-100 truncate group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{title}</h4>
                    <span className="text-[9px] font-black text-slate-600 whitespace-nowrap ml-4 font-mono">{time}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-bold truncate tracking-tight">{desc}</p>
            </div>
        </div>
    );
}

