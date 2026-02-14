'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface Stats {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
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
                <div className="bg-gradient-to-br from-[#2E6B4E] via-[#1F4D36] to-[#153625] rounded-[2.5rem] p-8 text-white relative overflow-hidden group min-h-[220px] flex items-center shadow-2xl shadow-emerald-900/10">
                    <div className="relative z-10 max-w-md">
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-300/80 mb-2 block">Weekly Sales Performance</span>
                        <h2 className="text-3xl font-extrabold leading-tight">
                            {formatPrice(Number(stats?.totalRevenue || 0))} <span className="text-sm font-medium opacity-60 ml-2">Total revenue</span>
                        </h2>
                        <div className="flex items-center space-x-2 text-xs mt-3 mb-6">
                            <span className="bg-white/10 backdrop-blur-md text-emerald-100 px-2 py-1 rounded-lg font-bold border border-white/10">{stats?.totalOrders || 0} Orders</span>
                            <span className="text-emerald-300 font-medium">Verified Growth</span>
                        </div>
                        <Link href="/dashboard/seller/analytics" className="bg-primary inline-block text-white px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-orange-950/20 text-xs">
                            View Detailed Report
                        </Link>
                    </div>
                    {/* Polished Illustration */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center pointer-events-none overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="text-8xl opacity-20 filter blur-[1px] transform rotate-12">📦</div>
                        <div className="text-[10rem] ml-10 translate-y-8 filter drop-shadow-2xl">📈</div>
                    </div>
                </div>

                {/* 2. TOP STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InfusedStat label="Active Orders" value={stats?.totalOrders.toString() || "0"} sub="Total Lifetime" color="text-emerald-600" icon="📦" />
                    <InfusedStat label="Products" value={stats?.totalProducts.toString() || "0"} sub="Live items" color="text-primary" icon="🏷️" />
                    <InfusedStat label="Total Stores" value="1" sub="Single Space" color="text-rose-500" icon="🏛️" />
                </div>

                {/* Sales Funnel Section */}
                <div className="bg-white rounded-[2.5rem] p-6 lg:p-10 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-bold text-slate-900">Sales funnel</h3>
                        <button className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 font-bold tracking-widest px-2">•••</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <FunnelStat
                            label="All sessions"
                            value={funnel.sessions >= 1000 ? `${(funnel.sessions / 1000).toFixed(1)}K` : funnel.sessions.toString()}
                            trend="+8.32%"
                            sub={`No activity ${(100 - (funnel.productViews / (funnel.sessions || 1) * 100)).toFixed(1)}%`}
                        />
                        <FunnelStat
                            label="Product views"
                            value={funnel.productViews >= 1000 ? `${(funnel.productViews / 1000).toFixed(1)}K` : funnel.productViews.toString()}
                            trend="+8.32%"
                            sub={`No cart add ${(100 - (funnel.addToCart / (funnel.productViews || 1) * 100)).toFixed(1)}%`}
                        />
                        <FunnelStat
                            label="Add to cart"
                            value={funnel.addToCart >= 1000 ? `${(funnel.addToCart / 1000).toFixed(1)}K` : funnel.addToCart.toString()}
                            trend="+8.32%"
                            sub={`Abandoned ${(100 - (funnel.checkout / (funnel.addToCart || 1) * 100)).toFixed(1)}%`}
                        />
                        <FunnelStat
                            label="Checkout"
                            value={funnel.checkout >= 1000 ? `${(funnel.checkout / 1000).toFixed(1)}K` : funnel.checkout.toString()}
                            trend="+8.32%"
                            sub="Completed Orders"
                        />
                    </div>

                    {/* Chart visual placeholder */}
                    <div className="h-40 relative flex items-end space-x-0.5 mt-8 overflow-hidden rounded-2xl bg-slate-50/50 p-4">
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
            <div className="space-y-8">
                {/* Top Categories Gauge Widget */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-md font-bold text-slate-900">Top categories</h3>
                        <button className="text-slate-400 font-bold tracking-widest">•••</button>
                    </div>
                    {/* Gauge placeholder */}
                    <div className="relative h-48 flex items-center justify-center mb-8">
                        <div className="w-40 h-40 border-[16px] border-slate-100 rounded-full"></div>
                        <div className="absolute w-40 h-40 border-[16px] border-emerald-500 border-b-transparent border-l-transparent rotate-45 rounded-full"></div>
                        <div className="absolute text-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Sales</p>
                            <p className="text-2xl font-extrabold text-slate-900">24,329,7</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <CategoryStat label="Fashion" value="80.02%" color="bg-primary" />
                        <CategoryStat label="Electronics" value="24.53%" color="bg-emerald-500" />
                        <CategoryStat label="Food" value="16.47%" color="bg-amber-400" />
                    </div>
                    <Link href="/dashboard/seller/analytics" className="w-full mt-8 py-4 border border-slate-100 rounded-2xl text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center">
                        View details ↗
                    </Link>
                </div>

                {/* Next Upcoming Event */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-md font-bold text-slate-900">Next Upcoming Event</h3>
                        <button className="text-slate-400 font-bold tracking-widest">•••</button>
                    </div>
                    <div className="bg-primary/5 rounded-3xl p-4 mb-4 flex items-center justify-center h-48 relative overflow-hidden">
                        <div className="text-6xl z-10">⏳</div>
                        <div className="absolute inset-0 bg-slate-100/50 flex flex-col justify-end p-4">
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div className="w-2/3 h-full bg-primary"></div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <EventItem date="12-14 December 2024" time="20:00" title="Lazada 12.12 event special sales" />
                        <EventItem date="12-14 December 2024" time="20:00" title="Free shipping worldwide" />
                    </div>
                    <button className="w-full mt-8 py-4 border border-slate-100 rounded-2xl text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all">
                        View event calendar ↗
                    </button>
                </div>
            </div>
        </div>
    );
}

function FunnelStat({ label, value, trend, sub }: { label: string; value: string; trend: string; sub: string }) {
    return (
        <div className="space-y-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</p>
            <div className="flex items-center space-x-2">
                <p className="text-2xl font-extrabold text-slate-900">{value}</p>
                <span className="text-[10px] bg-emerald-50 text-emerald-500 px-1.5 py-0.5 rounded-full font-bold">%{trend}</span>
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
            <td className="py-5 text-right flex items-center justify-end space-x-2">
                <span>{earnings}</span>
                <span className="text-[8px] text-emerald-500">+8.32%</span>
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

function InfusedStat({ label, value, sub, color, icon }: { label: string; value: string; sub: string; color: string; icon: string }) {
    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex items-center space-x-6 transition-all hover:shadow-md group">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <div className="flex items-baseline space-x-2">
                    <p className={`text-3xl font-black ${color}`}>{value}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
                </div>
            </div>
        </div>
    );
}
