'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { RechartsAreaChart } from '@/components/dashboard/RechartsAreaChart';

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
}

export default function SellerDashboardPage() {
    const { user, store } = useAuthStore();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!store?.id) return;

        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/stores/${store.id}/stats`);
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [store?.id]);

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
                <div className="bg-gradient-to-br from-[#2E6B4E] via-[#1F4D36] to-[#153625] rounded-[2rem] p-6 lg:p-8 text-white relative overflow-hidden group min-h-[180px] flex items-center shadow-2xl shadow-emerald-900/10">
                    <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-8">
                        {/* Left Side: Metrics */}
                        <div className="max-w-md w-full md:w-auto text-center md:text-left">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/80 mb-2 block">Weekly Sales Performance</span>
                            <h2 className="text-3xl font-black leading-tight mb-1">
                                {formatPrice(Number(stats?.totalRevenue || 0))}
                            </h2>
                            <p className="text-xs text-emerald-100/70 font-medium mb-6">Total revenue generated</p>

                            <div className="flex items-center justify-center md:justify-start space-x-3 mb-6">
                                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5 flex items-center space-x-2">
                                    <span className="text-emerald-300">📦</span>
                                    <span className="font-bold text-sm">{stats?.totalOrders || 0}</span>
                                    <span className="text-[10px] uppercase tracking-wide opacity-70">Orders</span>
                                </div>
                                <div className="bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center space-x-1">
                                    <span className="text-emerald-400 text-xs">📈</span>
                                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wide">Verified Growth</span>
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
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <InfusedStat label="Active Orders" value={stats?.activeOrders?.toString() || "0"} color="text-indigo-600" bgColor="bg-indigo-50" icon="⚡" />
                    <InfusedStat label="Orders" value={stats?.totalOrders.toString() || "0"} color="text-emerald-600" bgColor="bg-emerald-50" icon="📦" />
                    <InfusedStat label="Products sold" value={stats?.totalProductsSold?.toString() || "0"} color="text-blue-600" bgColor="bg-blue-50" icon="🏷️" />
                    <InfusedStat label="New Customers" value={stats?.totalCustomers?.toString() || "0"} color="text-amber-600" bgColor="bg-amber-50" icon="👥" />
                    <InfusedStat label="Website Visits" value={stats?.funnel?.sessions?.toString() || "0"} color="text-rose-600" bgColor="bg-rose-50" icon="🌍" />
                </div>

                {/* Sales Funnel Section */}
                <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Sales funnel</h3>
                        <button className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 font-bold tracking-widest px-2">•••</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <FunnelStat
                            label="All sessions"
                            value={funnel.sessions >= 1000 ? `${(funnel.sessions / 1000).toFixed(1)}K` : funnel.sessions.toString()}
                            trend={null}
                            sub={funnel.sessions > 0 ? `No activity ${(100 - (funnel.productViews / (funnel.sessions || 1) * 100)).toFixed(1)}%` : 'No data yet'}
                        />
                        <FunnelStat
                            label="Product views"
                            value={funnel.productViews >= 1000 ? `${(funnel.productViews / 1000).toFixed(1)}K` : funnel.productViews.toString()}
                            trend={null}
                            sub={funnel.productViews > 0 ? `No cart add ${(100 - (funnel.addToCart / (funnel.productViews || 1) * 100)).toFixed(1)}%` : 'No data yet'}
                        />
                        <FunnelStat
                            label="Add to cart"
                            value={funnel.addToCart >= 1000 ? `${(funnel.addToCart / 1000).toFixed(1)}K` : funnel.addToCart.toString()}
                            trend={null}
                            sub={funnel.addToCart > 0 ? `Abandoned ${(100 - (funnel.checkout / (funnel.addToCart || 1) * 100)).toFixed(1)}%` : 'No data yet'}
                        />
                        <FunnelStat
                            label="Checkout"
                            value={funnel.checkout >= 1000 ? `${(funnel.checkout / 1000).toFixed(1)}K` : funnel.checkout.toString()}
                            trend={null}
                            sub="Completed Orders"
                        />
                    </div>

                    {/* Chart visual placeholder */}
                    <div className="h-32 relative flex items-end space-x-0.5 mt-4 overflow-hidden rounded-2xl bg-slate-50/50 p-4">
                        {[...Array(40)].map((_, i) => (
                            <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                        ))}
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent" />
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="bg-white rounded-[2.5rem] p-6 lg:p-10 shadow-sm border border-slate-100 overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-bold text-slate-900">Top selling products</h3>
                        <button className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 font-bold tracking-widest px-2">•••</button>
                    </div>

                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="text-left text-[10px] text-slate-400 uppercase tracking-widest">
                                    <th className="pb-6 font-bold">Products</th>
                                    <th className="pb-6 font-bold">Stocks</th>
                                    <th className="pb-6 font-bold">Price</th>
                                    <th className="pb-6 font-bold">Sales</th>
                                    <th className="pb-6 font-bold text-right">Earnings</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-bold text-slate-900">
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
                                        <td colSpan={5} className="py-10 text-center text-slate-400 italic">No products sold yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right Widget Rail */}
            <div className="space-y-6 xl:sticky xl:top-6 self-start">
                {/* Top Categories Gauge Widget */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-md font-bold text-slate-900">Top categories</h3>
                        <button className="text-slate-400 font-bold tracking-widest">•••</button>
                    </div>
                    {/* Gauge placeholder */}
                    <div className="relative h-40 flex items-center justify-center mb-6">
                        <div className="w-32 h-32 border-[12px] border-slate-100 rounded-full"></div>
                        <div className="absolute w-32 h-32 border-[12px] border-emerald-500 border-b-transparent border-l-transparent rotate-45 rounded-full"></div>
                        <div className="absolute text-center px-4">
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Revenue</p>
                            <p className="text-lg font-extrabold text-slate-900 truncate w-24">
                                {formatPrice(Number(stats?.totalRevenue || 0))}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <CategoryStat label="General" value="100%" color="bg-primary" />
                        <p className="text-[9px] text-slate-400 mt-2 italic px-2">Categorized sales will appear here</p>
                    </div>
                    <Link href="/dashboard/seller/analytics" className="w-full mt-6 py-3 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center">
                        View details ↗
                    </Link>
                </div>

                {/* OpenMart News / Updates */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-md font-bold text-slate-900">OpenMart News</h3>
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
        <div className="space-y-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</p>
            <div className="flex items-center space-x-2">
                <p className="text-2xl font-extrabold text-slate-900">{value}</p>
                {trend && <span className="text-[10px] bg-emerald-50 text-emerald-500 px-1.5 py-0.5 rounded-full font-bold">%{trend}</span>}
            </div>
            <p className="text-[10px] text-slate-400 font-medium italic">{sub}</p>
        </div>
    );
}

function ProductRow({ name, stocks, price, sales, earnings, image }: { name: string; stocks: string; price: string; sales: string; earnings: string; image?: string }) {
    return (
        <tr className="border-t border-slate-50 group hover:bg-slate-50/50 transition-colors">
            <td className="py-5 flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                    {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-lg">👕</span>
                    )}
                </div>
                <span className="truncate max-w-[150px]">{name}</span>
            </td>
            <td className="py-5 text-slate-500">{stocks}</td>
            <td className="py-5 text-slate-500">{price}</td>
            <td className="py-5 text-slate-500">{sales}</td>
            <td className="py-5 text-right">
                <span>{earnings}</span>
            </td>
        </tr>
    );
}

function CategoryStat({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div className="flex items-center justify-between text-[11px] font-bold">
            <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-slate-500 uppercase tracking-widest">{label}</span>
            </div>
            <span className="text-slate-900">{value}</span>
        </div>
    );
}

function EventItem({ date, time, title }: { date: string; time: string; title: string }) {
    return (
        <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">📅</div>
            <div>
                <p className="text-xs font-bold text-slate-900">{title}</p>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">{date} | {time}</p>
            </div>
        </div>
    );
}

function InfusedStat({ label, value, color, bgColor, icon }: { label: string; value: string; color: string; bgColor: string; icon: string }) {
    return (
        <div className={`${bgColor} rounded-[1.5rem] p-5 flex justify-between items-center transition-all hover:scale-[1.02] shadow-sm`}>
            <div className="flex flex-col">
                <p className="text-2xl font-black text-slate-900 leading-none mb-2">{value}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide leading-tight">{label}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center text-lg shadow-sm ${color} shrink-0 ml-3`}>
                {icon}
            </div>
        </div>
    );
}
