'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Loader2, Bell, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import { RechartsAreaChart } from '@/components/dashboard/RechartsAreaChart';
import { BarChart, Bar, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { useSocket } from '@/hooks/useSocket';

interface Stats {
    totalOrders: number;
    activeOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalProductsSold: number;
    totalCustomers: number;
    topProducts: {
        id: string;
        name: string;
        price: number;
        stocks: number;
        sales: number;
        earnings: number;
        image?: string;
    }[];
    funnel: {
        sessions: number;
        productViews: number;
        addToCart: number;
        checkout: number;
    };
    weeklySales: { name: string; value: number }[];
    onboarding: {
        hasProducts: boolean;
        hasLogo: boolean;
        hasPayments: boolean;
        hasBio: boolean;
        dismissed: boolean;
    };
}

export default function SellerDashboardPage() {
    const { user, store } = useAuthStore();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const socket = useSocket(user?.id, store?.id);

    const fetchStats = async () => {
        if (!store?.id) return;
        try {
            const res = await api.get(`/stores/${store.id}/stats`);
            setStats(res.data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!store?.id) return;
        fetchStats();
    }, [store?.id]);

    useEffect(() => {
        if (!socket) return;

        socket.on('stats_updated', () => {
            console.log('[REALTIME] Refreshing dashboard metrics...');
            fetchStats();
        });

        return () => {
            socket.off('stats_updated');
        };
    }, [socket]);

    if (!user) return null;

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    const funnel = stats?.funnel || { sessions: 0, productViews: 0, addToCart: 0, checkout: 0 };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="xl:col-span-3 space-y-8">

                {/* 1. HERO SECTION */}
                <div className="bg-gradient-to-br from-[#2E6B4E] via-[#1F4D36] to-[#153625] rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 text-white relative overflow-hidden group min-h-[160px] sm:min-h-[180px] flex items-center shadow-2xl shadow-emerald-900/10">
                    <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
                        {/* Left Side: Metrics */}
                        <div className="max-w-md w-full md:w-auto text-center md:text-left">
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-emerald-300/80 mb-1 sm:mb-2 block">Weekly Sales Performance</span>
                            <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-1">
                                {formatPrice(Number(stats?.totalRevenue || 0))}
                            </h2>
                            <p className="text-[10px] sm:text-xs text-emerald-100/70 font-medium mb-4 sm:mb-6">Total revenue generated</p>

                            <div className="flex items-center justify-center md:justify-start space-x-2 sm:space-x-3 mb-2 sm:mb-6">
                                <div className="bg-white/10 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/5 flex items-center space-x-2">
                                    <span className="text-xs sm:text-emerald-300">📦</span>
                                    <span className="font-bold text-xs sm:text-sm">{stats?.totalOrders || 0}</span>
                                    <span className="text-[8px] sm:text-[10px] uppercase tracking-wide opacity-70">Orders</span>
                                </div>
                                <div className="bg-emerald-500/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-emerald-500/20 flex items-center space-x-1">
                                    <span className="text-emerald-400 text-[10px] sm:text-xs">📈</span>
                                    <span className="text-[8px] sm:text-[10px] font-bold text-emerald-300 uppercase tracking-wide">Growth</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Graph Visual */}
                        <div className="w-full md:w-1/2 h-40 hidden md:block relative">
                            <div className="absolute inset-0 bg-gradient-to-l from-[#153625] to-transparent z-10 pointer-events-none" />
                            <RechartsAreaChart className="w-full h-full" data={stats?.weeklySales || []} />
                        </div>
                    </div>
                </div>


                {/* 2. TOP STATS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <InfusedStat label="Orders" value={stats?.activeOrders?.toString() || "0"} color="text-amber-600" bgColor="bg-amber-50" icon="🔥" />
                    <InfusedStat label="Sold" value={stats?.totalProductsSold?.toString() || "0"} color="text-blue-600" bgColor="bg-blue-50" icon="🏷️" />
                    <InfusedStat label="Users" value={stats?.totalCustomers?.toString() || "0"} color="text-violet-600" bgColor="bg-violet-50" icon="👥" />
                    <InfusedStat label="Visits" value={stats?.funnel?.sessions?.toString() || "0"} color="text-emerald-600" bgColor="bg-emerald-50" icon="🌍" />
                </div>

                {/* Top Selling Products */}
                <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-100 overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6 sm:mb-8 px-1">
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-none">Top selling products</h3>
                            <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Best Performing Items</p>
                        </div>
                        <Link
                            href="/dashboard/seller/products"
                            className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-slate-100 transition-all text-center"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="overflow-x-auto -mx-4 sm:mx-0 no-scrollbar">
                        <table className="w-full min-w-[500px] sm:min-w-0">
                            <thead>
                                <tr className="text-left text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-[0.15em] border-b border-slate-50">
                                    <th className="pb-3 pt-2 font-black px-4 sm:px-6">Product Details</th>
                                    <th className="pb-3 pt-2 font-black hidden md:table-cell">Stock</th>
                                    <th className="pb-3 pt-2 font-black hidden lg:table-cell">Price</th>
                                    <th className="pb-3 pt-2 font-black hidden sm:table-cell text-center">Sales</th>
                                    <th className="pb-3 pt-2 font-black text-right px-4 sm:px-6">Earnings</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs sm:text-sm font-bold text-slate-900">
                                {stats?.topProducts && stats.topProducts.length > 0 ? (
                                    stats.topProducts.map((p) => (
                                        <ProductRow
                                            key={p.id}
                                            name={p.name}
                                            stocks={p.stocks.toLocaleString()}
                                            price={formatPrice(p.price)}
                                            sales={p.sales.toLocaleString()}
                                            earnings={formatPrice(p.earnings)}
                                            image={p.image}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-16 sm:py-24 text-center">
                                            <div className="flex flex-col items-center opacity-40 scale-90 sm:scale-100">
                                                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-slate-50 rounded-2xl sm:rounded-3xl flex items-center justify-center text-2xl sm:text-3xl mb-3 sm:mb-4 border border-slate-100">🏷️</div>
                                                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Inventory is fresh</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sales Funnel Section */}
                <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 lg:p-8 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6 px-1">
                        <div className="flex flex-col">
                            <h3 className="text-lg font-bold text-slate-900 leading-none">Sales funnel</h3>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mt-1">Performance Pipeline</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border border-emerald-100 uppercase tracking-widest flex items-center gap-1.5 sm:gap-2">
                                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Live
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-10 px-1">
                        <FunnelStat
                            label="Visitors"
                            value={funnel.sessions >= 1000 ? `${(funnel.sessions / 1000).toFixed(1)}K` : funnel.sessions.toString()}
                            trend={null}
                            sub={funnel.sessions > 0 ? `${((funnel.productViews / (funnel.sessions || 1)) * 100).toFixed(0)}% conv.` : 'No data'}
                        />
                        <FunnelStat
                            label="Views"
                            value={funnel.productViews >= 1000 ? `${(funnel.productViews / 1000).toFixed(1)}K` : funnel.productViews.toString()}
                            trend={null}
                            sub={funnel.productViews > 0 ? `${((funnel.addToCart / (funnel.productViews || 1)) * 100).toFixed(0)}% click` : 'No data'}
                        />
                        <FunnelStat
                            label="Added"
                            value={funnel.addToCart >= 1000 ? `${(funnel.addToCart / 1000).toFixed(1)}K` : funnel.addToCart.toString()}
                            trend={null}
                            sub={funnel.addToCart > 0 ? `${((funnel.checkout / (funnel.addToCart || 1)) * 100).toFixed(0)}% comp.` : 'No data'}
                        />
                        <FunnelStat
                            label="Sales"
                            value={funnel.checkout >= 1000 ? `${(funnel.checkout / 1000).toFixed(1)}K` : funnel.checkout.toString()}
                            trend={null}
                            sub="Optimized"
                        />
                    </div>

                    <div className="h-32 sm:h-44 w-full mt-2 sm:mt-4 bg-slate-50/30 rounded-2xl p-3 sm:p-4 border border-slate-100/50 group/chart">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'Sessions', value: funnel.sessions, detail: 'Store visitors' },
                                { name: 'Views', value: funnel.productViews, detail: 'Customers views' },
                                { name: 'Cart', value: funnel.addToCart, detail: 'Items in cart' },
                                { name: 'Checkout', value: funnel.checkout, detail: 'Conversions' }
                            ]}>
                                <defs>
                                    <linearGradient id="funnelGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.2} />
                                    </linearGradient>
                                </defs>
                                <Bar
                                    dataKey="value"
                                    fill="url(#funnelGradient)"
                                    radius={[8, 8, 4, 4]}
                                    barSize={20}
                                    className="sm:barSize-40 transition-all duration-300"
                                />
                                <RechartsTooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                    content={({ active, payload }: any) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-slate-900 text-white p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-2xl border border-slate-800 animate-in zoom-in duration-200 pointer-events-none">
                                                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                                                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-500" />
                                                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-emerald-400">{data.name}</span>
                                                    </div>
                                                    <p className="text-xs sm:text-[13px] font-black mb-0.5">{payload[0].value.toLocaleString()}</p>
                                                    <p className="text-[7px] sm:text-[8px] text-slate-400 font-medium leading-tight">{data.detail}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Right Widget Rail */}
            <div className="hidden xl:block space-y-6 xl:sticky xl:top-0 self-start">
                {/* Recent Notifications Widget */}
                <NotificationsWidget storeId={store?.id || ''} />

                {/* OpenMart News / Updates */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-md font-bold text-slate-900">OPNMRT News</h3>
                        <button className="text-slate-400 font-bold tracking-widest">•••</button>
                    </div>
                    <div className="bg-primary/5 rounded-2xl p-4 flex items-center justify-center h-32 relative overflow-hidden">
                        <div className="text-5xl z-10 opacity-40">🗞️</div>
                        <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
                            <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Coming Soon</p>
                            <p className="text-[9px] text-slate-400 font-bold leading-tight">Platform updates and business tips will appear here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FunnelStat({ label, value, trend, sub }: { label: string; value: string; trend: string | null; sub: string }) {
    return (
        <div className="space-y-1 sm:space-y-2 p-1">
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-[0.15em]">{label}</p>
            <div className="flex items-center space-x-2">
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{value}</p>
                {trend && <span className="text-[9px] bg-emerald-100/50 text-emerald-600 px-1.5 py-0.5 rounded-full font-black">+{trend}%</span>}
            </div>
            <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-tight">{sub}</p>
        </div>
    );
}

function ProductRow({ name, stocks, price, sales, earnings, image }: { name: string; stocks: string; price: string; sales: string; earnings: string; image?: string }) {
    return (
        <tr className="border-t border-slate-50 group hover:bg-slate-50/80 transition-all duration-300">
            <td className="py-4 px-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                    {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-slate-50 flex items-center justify-center text-xl">🧺</div>
                    )}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-slate-900 font-black text-sm truncate max-w-[140px] sm:max-w-[220px] tracking-tight">{name}</span>
                    <span className="text-[8px] text-emerald-600 font-black uppercase tracking-widest mt-0.5 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-500" />
                        Live on Store
                    </span>
                </div>
            </td>
            <td className="py-4 text-slate-500 font-bold text-xs hidden md:table-cell">{stocks}</td>
            <td className="py-4 text-slate-500 font-bold text-xs hidden lg:table-cell">{price}</td>
            <td className="py-4 text-slate-500 font-bold text-xs hidden sm:table-cell">{sales}</td>
            <td className="py-4 text-right px-6">
                <div className="flex flex-col items-end">
                    <span className="text-slate-900 font-black text-sm tracking-tight">{earnings}</span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest sm:hidden">Total Earnings</span>
                </div>
            </td>
        </tr>
    );
}

function NotificationsWidget({ storeId }: { storeId: string }) {
    const { user } = useAuthStore();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket(user?.id, storeId);

    const fetchNotifications = async () => {
        try {
            const res = await api.get(`/analytics/notifications/${storeId}`);
            setNotifications(res.data || []);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!storeId) return;
        fetchNotifications();
    }, [storeId]);

    useEffect(() => {
        if (!socket) return;

        socket.on('notification_received', () => {
            console.log('[REALTIME] New activity detected, syncing widget...');
            fetchNotifications();
        });

        return () => {
            socket.off('notification_received');
        };
    }, [socket]);

    useEffect(() => {
        const interval = setInterval(fetchNotifications, 60000); // Poll as fallback
        return () => clearInterval(interval);
    }, [storeId]);

    return (
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-0.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.15em]">Recent Activity</h3>
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-4">Real-time Stream</p>
                </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar max-h-[460px] pb-2">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-32">
                        <div className="w-8 h-8 border-3 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin mb-3" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Syncing Stream...</p>
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map((n) => (
                        <div key={n.id} className="flex gap-4 group cursor-default">
                            <div className="w-11 h-11 rounded-[1.25rem] bg-slate-50 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 group-hover:bg-white group-hover:shadow-lg transition-all duration-300 border border-transparent group-hover:border-slate-100">
                                {n.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <p className="text-[11px] font-black text-slate-900 leading-tight uppercase tracking-tight group-hover:text-emerald-600 transition-colors">{n.title}</p>
                                    <span className="text-[10px] text-slate-200 font-bold">//</span>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-normal line-clamp-2 pr-4 font-medium">{n.message}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-3xl mb-4 border border-slate-100 opacity-50">✨</div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">All caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function OnboardingStep({ label, done, href, icon, desc }: { label: string; done: boolean; href: string; icon: string; desc: string }) {
    return (
        <Link
            href={href}
            className={`p-6 rounded-[2rem] border transition-all flex flex-col gap-4 relative group/step ${done
                ? 'bg-emerald-50/50 border-emerald-100'
                : 'bg-white border-slate-100 hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1'
                }`}
        >
            <div className="flex justify-between items-start">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-all duration-500 ${done ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400 group-hover/step:bg-emerald-50 group-hover/step:text-emerald-600'}`}>
                    {done ? '✓' : icon}
                </div>
                {!done && <ArrowRight className="w-5 h-5 text-slate-300 group-hover/step:text-emerald-500 group-hover/step:translate-x-1 transition-all" />}
            </div>
            <div>
                <p className={`text-[11px] font-black uppercase tracking-[0.15em] mb-1.5 ${done ? 'text-emerald-600' : 'text-slate-900 group-hover/step:text-emerald-600 transition-colors'}`}>{label}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">{desc}</p>
            </div>
            {done && (
                <div className="absolute top-6 right-6 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500 text-white rounded-full scale-75 origin-right">
                    <span className="text-[8px] font-black uppercase tracking-widest">Active</span>
                </div>
            )}
        </Link>
    );
}

function InfusedStat({ label, value, color, bgColor, icon }: { label: string; value: string; color: string; bgColor: string; icon: string }) {
    return (
        <div className={`${bgColor} rounded-[2rem] p-4 sm:p-5 flex justify-between items-center transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-200/50 border border-white/50 group/stat`}>
            <div className="flex flex-col min-w-0">
                <p className="text-xl sm:text-2xl font-black text-slate-900 leading-none mb-2 tracking-tight">{value}</p>
                <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight truncate">{label}</p>
            </div>
            <div className={`w-10 sm:w-11 h-10 sm:h-11 rounded-2xl bg-white flex items-center justify-center text-lg sm:text-xl shadow-sm ${color} shrink-0 ml-3 group-hover/stat:rotate-12 transition-transform duration-500`}>
                {icon}
            </div>
        </div>
    );
}
