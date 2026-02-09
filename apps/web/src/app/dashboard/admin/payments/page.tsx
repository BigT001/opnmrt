'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AdminPayments() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <TierCard
                    name="Free Tier"
                    price="$0"
                    features={['Up to 10 products', 'Basic themes', 'opnmart.com subdomain', '2% transaction fee']}
                    activeSellers={120}
                    color="slate"
                />
                <TierCard
                    name="Pro Seller"
                    price="$29/mo"
                    features={['Unlimited products', 'Premium themes', 'Custom domains', '0% transaction fee', 'Advanced AI insights']}
                    activeSellers={45}
                    color="indigo"
                    featured
                />
                <TierCard
                    name="Enterprise"
                    price="Custom"
                    features={['Dedicated support', 'API access', 'Multi-staff accounts', 'White-label dashboard']}
                    activeSellers={5}
                    color="emerald"
                />
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
                <h3 className="text-xl font-black text-white tracking-tight mb-8">Payment Gateways</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GatewayCard name="Paystack" status="Connected" icon="🏦" lastSync="5 mins ago" />
                    <GatewayCard name="Stripe" status="Disabled" icon="💳" lastSync="Never" />
                </div>
            </div>
        </div>
    );
}

function TierCard({ name, price, features, activeSellers, color, featured = false }: any) {
    const colors: any = {
        slate: 'border-slate-800 bg-slate-900/40 text-slate-400',
        indigo: 'border-indigo-500/30 bg-indigo-600/5 text-indigo-400',
        emerald: 'border-emerald-500/30 bg-emerald-600/5 text-emerald-400',
    };

    return (
        <div className={`border rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col ${colors[color]} ${featured ? 'ring-2 ring-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.1)]' : ''}`}>
            {featured && (
                <div className="absolute top-6 right-6 bg-indigo-500 text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest">
                    Most Popular
                </div>
            )}
            <h4 className="text-lg font-black text-white mb-1">{name}</h4>
            <div className="flex items-baseline space-x-1 mb-6">
                <span className="text-3xl font-black text-white">{price}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">per unit</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
                {features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center space-x-3 text-sm font-medium text-slate-400">
                        <span className="text-emerald-500">✓</span>
                        <span>{f}</span>
                    </li>
                ))}
            </ul>
            <div className="pt-6 border-t border-slate-800">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Active Merchants</span>
                    <span className="text-white">{activeSellers}</span>
                </div>
            </div>
        </div>
    );
}

function GatewayCard({ name, status, icon, lastSync }: any) {
    return (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex items-center justify-between group hover:border-indigo-500/50 transition-all">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div>
                    <h5 className="text-sm font-black text-white">{name}</h5>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Last Sync: {lastSync}</p>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${status === 'Connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>
                    {status}
                </span>
                <button className="text-[10px] font-bold text-indigo-400 uppercase mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    Configure →
                </button>
            </div>
        </div>
    );
}
