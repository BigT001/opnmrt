'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Share2,
    Target,
    Zap,
    Image as ImageIcon,
    FileText,
    TrendingUp,
    Layout
} from 'lucide-react';

export default function MarketingDashboard() {
    return (
        <div className="space-y-10 pb-20">
            {/* Header section with glassmorphism */}
            <div className="relative p-10 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] -mr-48 -mt-48 animate-pulse" />
                <div className="relative z-10">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight uppercase leading-none">BigT AI Marketing</h1>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">Intelligent Content Generation & Strategy</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* AI Content Engine */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">AI Content Engine</h3>
                                <p className="text-xs text-slate-500 font-medium">Generate high-converting copy in seconds</p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl">
                                <FileText className="w-6 h-6 text-emerald-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ToolCard
                                icon={<ImageIcon className="w-5 h-5" />}
                                title="Product Descriptions"
                                desc="Compelling copy that drives sales"
                                active
                            />
                            <ToolCard
                                icon={<Share2 className="w-5 h-5" />}
                                title="Social Media Posts"
                                desc="Engaging updates for Instagram & Twitter"
                            />
                            <ToolCard
                                icon={<Target className="w-5 h-5" />}
                                title="Email Campaigns"
                                desc="Personalized marketing sequences"
                            />
                            <ToolCard
                                icon={<Zap className="w-5 h-5" />}
                                title="Ad Copy"
                                desc="Facebook & Google Ads optimized for ROI"
                            />
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-50 flex justify-center">
                            <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center space-x-3">
                                <Sparkles className="w-4 h-4" />
                                <span>Launch Content Generator</span>
                            </button>
                        </div>
                    </div>

                    {/* Marketing Strategy Area */}
                    <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-200/50">
                        <div className="flex items-center space-x-3 mb-8">
                            <TrendingUp className="w-6 h-6 text-slate-400" />
                            <h3 className="text-xl font-bold text-slate-900">Growth Implementation</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: "Trend Analysis", status: "Active", val: "High Impact" },
                                { title: "Competitor Intel", status: "Syncing", val: "Awaiting Data" },
                                { title: "Seasonal Planning", status: "Ready", val: "Q2 Strategy" }
                            ].map((s, i) => (
                                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center transition-all hover:translate-x-1">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="font-bold text-slate-700">{s.title}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{s.status}</p>
                                        <p className="text-xs font-black text-slate-900">{s.val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar widgets */}
                <div className="space-y-8">
                    {/* Active Themes Tracker */}
                    <div className="bg-emerald-500 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <Layout className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
                        <h4 className="text-xs font-black uppercase tracking-widest opacity-70 mb-2">Platform Power</h4>
                        <div className="flex items-baseline space-x-2 mb-6">
                            <span className="text-4xl font-black">4</span>
                            <span className="text-xs font-bold uppercase">Themes Enabled</span>
                        </div>
                        <p className="text-[10px] leading-relaxed font-bold opacity-80 uppercase tracking-tight">
                            Your current Ascend Pro tier allows you to switch between 4 premium storefront themes.
                        </p>
                        <button className="mt-8 w-full bg-white text-emerald-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
                            Change Theme →
                        </button>
                    </div>

                    {/* AI Tip of the day */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                            <Zap className="w-5 h-5 text-amber-600" />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">AI Strategy Tip</h4>
                        <p className="text-sm font-bold text-slate-900 leading-relaxed italic">
                            "Increasing your product image brightness by 10% can improve click-through rates by up to 15% during rainy seasons."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToolCard({ icon, title, desc, active = false }: any) {
    return (
        <div className={`p-6 rounded-[2rem] border transition-all cursor-pointer ${active ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${active ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {icon}
            </div>
            <h5 className={`font-bold text-sm mb-1 ${active ? 'text-emerald-900' : 'text-slate-900'}`}>{title}</h5>
            <p className="text-[10px] text-slate-500 font-medium leading-tight">{desc}</p>
        </div>
    );
}
