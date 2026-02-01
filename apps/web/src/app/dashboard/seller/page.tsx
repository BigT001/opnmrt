'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function SellerDashboardPage() {
    const { user, store } = useAuthStore();

    if (!user) return null;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="xl:col-span-3 space-y-8">

                {/* 1. HERO SECTION (Reduced size & polished) */}
                <div className="bg-gradient-to-br from-[#2E6B4E] via-[#1F4D36] to-[#153625] rounded-[2.5rem] p-8 text-white relative overflow-hidden group min-h-[220px] flex items-center shadow-2xl shadow-emerald-900/10">
                    <div className="relative z-10 max-w-md">
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-300/80 mb-2 block">Weekly Sales Performance</span>
                        <h2 className="text-3xl font-extrabold leading-tight">
                            $8,567.00 <span className="text-sm font-medium opacity-60 ml-2">Total profit</span>
                        </h2>
                        <div className="flex items-center space-x-2 text-xs mt-3 mb-6">
                            <span className="bg-white/10 backdrop-blur-md text-emerald-100 px-2 py-1 rounded-lg font-bold border border-white/10">2,478 Selling</span>
                            <span className="text-emerald-300 font-medium">↑ 110% growth</span>
                        </div>
                        <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-orange-950/20 text-xs">
                            View Detailed Report
                        </button>
                    </div>
                    {/* Polished Illustration */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center pointer-events-none overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="text-8xl opacity-20 filter blur-[1px] transform rotate-12">📦</div>
                        <div className="text-[10rem] ml-10 translate-y-8 filter drop-shadow-2xl">📈</div>
                    </div>
                </div>

                {/* 2. TOP STATS (Now below the hero) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InfusedStat label="Active Orders" value="0" sub="Processing" color="text-emerald-600" icon="📦" />
                    <InfusedStat label="Products" value="0" sub="New items" color="text-primary" icon="🏷️" />
                    <InfusedStat label="Low Stock" value="0" sub="Alerts active" color="text-rose-500" icon="⚠️" />
                </div>

                {/* Sales Funnel Section */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-bold text-slate-900">Sales funnel</h3>
                        <button className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 font-bold tracking-widest px-2">•••</button>
                    </div>

                    <div className="grid grid-cols-4 gap-6 mb-10">
                        <FunnelStat label="All sessions" value="289.12K" trend="+8.32%" sub="No shipping activity 48.5%" />
                        <FunnelStat label="Product views" value="184.64K" trend="+8.32%" sub="No cart addition 24.9%" />
                        <FunnelStat label="Add to cart" value="156.3K" trend="+8.32%" sub="Cart abandon 16.7%" />
                        <FunnelStat label="Checkout" value="65.8K" trend="+8.32%" sub="Checkout abandon 19.2%" />
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
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-bold text-slate-900">Top selling products</h3>
                        <button className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 font-bold tracking-widest px-2">•••</button>
                    </div>

                    <table className="w-full">
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
                            <ProductRow name="Uniqlo T-shirt airism" stocks="12,245" price="$10.50" sales="8,983" earnings="$1,933,984" />
                            <ProductRow name="Uniqlo Cargo pants" stocks="8,463" price="$24.00" sales="1,293" earnings="$2,433,94" />
                            <ProductRow name="Club 1989 basic hoodies" stocks="24,432" price="$46.80" sales="120" earnings="$965,93" />
                            <ProductRow name="Humblezing backpack" stocks="19,498" price="$105.24" sales="4,425" earnings="$14,894,93" />
                        </tbody>
                    </table>
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
                    <button className="w-full mt-8 py-4 border border-slate-100 rounded-2xl text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all">
                        View details ↗
                    </button>
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

function ProductRow({ name, stocks, price, sales, earnings }: { name: string; stocks: string; price: string; sales: string; earnings: string }) {
    return (
        <tr className="border-t border-slate-50 group hover:bg-slate-50/50 transition-colors">
            <td className="py-5 flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg">👕</div>
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
