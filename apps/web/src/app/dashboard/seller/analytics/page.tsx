'use client';

import React from 'react';

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">AI Insights</h1>
                    <p className="text-slate-500 mt-1">Predictive analytics and performance optimization</p>
                </div>
                <div className="flex items-center space-x-2 bg-slate-900 px-6 py-2.5 rounded-xl shadow-lg shadow-slate-200 cursor-pointer hover:bg-black transition-all">
                    <span className="text-xs font-bold text-white">Refresh Reports</span>
                    <span className="text-xs">✨</span>
                </div>
            </div>

            {/* AI Highlight Header */}
            <div className="bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] rounded-[2.5rem] p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="bg-white/10 w-fit px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                            GEMINI 1.5 PRO ACTIVE
                        </div>
                        <h2 className="text-4xl font-black leading-tight">Sales projected to increase by 14% this month.</h2>
                        <p className="opacity-70 text-sm max-w-sm leading-relaxed">Based on current traffic trends and conversion optimization, your store is on track to outperform last month. Consider increasing stock for "Classic White Tee".</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <StatBox label="Conversion Rate" value="4.2%" trend="+0.5%" />
                        <StatBox label="Returning Rate" value="28%" trend="+12%" />
                        <StatBox label="Avg. Order Value" value="$82" trend="+$4" />
                        <StatBox label="Site Traffic" value="12.4K" trend="+2.4K" />
                    </div>
                </div>
            </div>

            {/* AI Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-white">
                <AiRecommendation
                    title="Optimize Pricing"
                    desc="Reduce 'Leather Keychain' to $7.99 to match market demand."
                    gain="Est. +$420 profit"
                />
                <AiRecommendation
                    title="Smart Inventory"
                    desc="Restock 'Wireless Earbuds' before Friday evening spike."
                    gain="Save $120 in lost sales"
                />
                <AiRecommendation
                    title="Customer Outreach"
                    desc="24 customers haven't purchased in 30 days. Send AI nudge."
                    gain="Est. 12% re-engagement"
                />
            </div>
        </div>
    );
}

function StatBox({ label, value, trend }: { label: string; value: string; trend: string }) {
    return (
        <div className="bg-white/5 backdrop-blur-sm p-5 rounded-3xl border border-white/10">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-xl font-black mb-1">{value}</p>
            <p className="text-[10px] font-black text-emerald-400">{trend}</p>
        </div>
    );
}

function AiRecommendation({ title, desc, gain }: { title: string; desc: string; gain: string }) {
    return (
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm group hover:shadow-xl transition-all h-full flex flex-col">
            <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-6 shadow-inner ring-1 ring-slate-100">
                ✨
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2 truncate">{title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-1">{desc}</p>
            <div className="bg-emerald-50 px-4 py-2 rounded-xl text-[10px] font-black text-emerald-700 uppercase tracking-widest w-fit">
                {gain}
            </div>
        </div>
    );
}
