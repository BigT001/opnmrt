'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function AdminPayments() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch admin stats:', err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="mb-10">
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Fiscal Hub</h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-3 px-1">Subscription Tiers & Gateway Management</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <TierCard
                    name="Genesis Tier"
                    price="₦4,990"
                    period="/Month"
                    trial="14-Day Full Access Trial"
                    features={[
                        'Up to 30 Active Products',
                        'Basic Inventory Tracking',
                        'Direct Paystack Settlement',
                        '1 Storefront Theme Access',
                        'Weekly Business Audit',
                        'Standard Order Management'
                    ]}
                    activeSellers={stats?.tierCounts?.free || 0}
                    color="slate"
                />
                <TierCard
                    name="Ascend Pro"
                    price="₦14,990"
                    period="/Month"
                    features={[
                        'All features in Genesis',
                        'VAT Management System',
                        'Unlimited Product Catalog',
                        'Up to 4 Storefront Themes',
                        'Daily AI Strategy Engine',
                        'BigT AI Content Marketing',
                        'Live Sales Funnel Analytics',
                        'Direct Paystack Assistance',
                        'Priority Design Support',
                        'Offline Sales Records'
                    ]}
                    activeSellers={stats?.tierCounts?.pro || 0}
                    color="emerald"
                    featured
                />
                <TierCard
                    name="Apex Suite"
                    price="₦44,990"
                    period="/Month"
                    comingSoon
                    features={[]}
                    activeSellers={stats?.tierCounts?.enterprise || 0}
                    color="emerald"
                />
            </div>

            <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-12 shadow-3xl">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tight uppercase">Platform Gateways</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Global Transaction Infrastructure</p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-xl">💳</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <GatewayCard name="Paystack (Nigeria/Ghana)" status="Connected" icon="🏦" lastSync="2 mins ago" active />
                    <GatewayCard name="Stripe (International)" status="System Dormant" icon="🌍" lastSync="Never" />
                </div>
            </div>
        </div>
    );
}

function TierCard({ name, price, period, features, activeSellers, color, trial, featured = false, comingSoon = false }: any) {
    const colors: any = {
        slate: 'border-white/5 bg-slate-900/40',
        emerald: 'border-emerald-500/20 bg-emerald-500/5',
    };

    return (
        <motion.div
            whileHover={comingSoon ? {} : { y: -8, scale: 1.02 }}
            className={`border rounded-[3.5rem] p-10 relative overflow-hidden flex flex-col shadow-2xl transition-all ${colors[color]} ${featured ? 'ring-1 ring-emerald-500/40 shadow-emerald-500/10' : ''} ${comingSoon ? 'opacity-60 grayscale' : ''}`}
        >
            {featured && !comingSoon && (
                <div className="absolute top-8 right-8 bg-emerald-500 text-[#010409] text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                    Most Popular
                </div>
            )}

            {comingSoon && (
                <div className="absolute top-8 right-8 bg-slate-700 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                    Coming Soon
                </div>
            )}

            <div className="mb-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{featured ? 'Professional Engine' : 'Sovereign Plan'}</p>
                <h4 className="text-xl font-black text-white uppercase tracking-tight">{name}</h4>
            </div>

            <div className="flex items-baseline space-x-1 mb-1">
                <span className="text-4xl font-black text-white tracking-widest">{price}</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{period}</span>
            </div>
            {trial ? (
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-6">{trial}</p>
            ) : (
                <div className="h-4 mb-2" />
            )}

            <div className="flex-1 pt-6 border-t border-white/5">
                {comingSoon ? (
                    <div className="h-full flex items-center justify-center min-h-[300px]">
                        <p className="text-4xl font-black text-slate-800 uppercase tracking-tighter rotate-[-12deg] opacity-20 select-none">COMING SOON</p>
                    </div>
                ) : (
                    <ul className="space-y-3 mb-10">
                        {features.map((f: string, i: number) => (
                            <li key={i} className="flex items-start space-x-4 text-xs font-bold text-slate-400 leading-tight">
                                <span className="text-emerald-500 mt-0.5 text-[10px]">◆</span>
                                <span>{f}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="pt-6 border-t border-white/5">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-600">Active Ecosystems</span>
                    <span className="text-emerald-500">{activeSellers}</span>
                </div>
            </div>
        </motion.div>
    );
}

function GatewayCard({ name, status, icon, lastSync, active = false }: any) {
    return (
        <div className={`rounded-3xl p-8 flex items-center justify-between group transition-all border ${active ? 'bg-slate-950 border-emerald-500/30' : 'bg-slate-900/50 border-white/5 grayscale'}`}>
            <div className="flex items-center space-x-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all ${active ? 'bg-emerald-500 text-[#010409] shadow-lg' : 'bg-slate-800'}`}>
                    {icon}
                </div>
                <div>
                    <h5 className="text-lg font-black text-white uppercase tracking-tight">{name}</h5>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1 font-mono">Status Check: {lastSync}</p>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-white/5'}`}>
                    {status}
                </span>
                <button className={`text-[10px] font-black uppercase tracking-widest mt-4 transition-all ${active ? 'text-emerald-500 hover:text-white' : 'text-slate-700 pointer-events-none'}`}>
                    {active ? 'Manage Keys →' : 'Deploy Module'}
                </button>
            </div>
        </div>
    );
}




