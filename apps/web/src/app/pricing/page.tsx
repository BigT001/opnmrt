'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Shield, Crown } from 'lucide-react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingBackground } from '@/components/landing/LandingBackground';
import Link from 'next/link';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden relative">
            <LandingBackground />
            <LandingNavbar />

            <main className="relative pt-32 pb-40">
                <section className="px-6 py-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 uppercase">
                            Transparent <span className="text-emerald-500 italic">Fueling.</span>
                        </h1>
                        <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                            No hidden fees. No transaction cuts. Choose the tier that matches your ambition and scale without friction.
                        </p>
                    </motion.div>
                </section>

                <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PricingCard
                        tier="Pioneer"
                        price="0"
                        desc="Perfect for launching your first digital storefront."
                        features={[
                            "Single Custom Subdomain",
                            "Standard Theme Library",
                            "Up to 50 Products",
                            "Standard AI Insights",
                            "Standard Support"
                        ]}
                        icon={<Zap className="w-5 h-5 text-slate-400" />}
                    />

                    <PricingCard
                        tier="Architect"
                        price="49"
                        desc="Built for businesses ready to dominate their niche."
                        features={[
                            "Unlimited Custom Domains",
                            "Premium Theme Access",
                            "Unlimited Products",
                            "Advanced AI Neural Core",
                            "Priority Support",
                            "Zero Transaction Fees"
                        ]}
                        icon={<Sparkles className="w-5 h-5 text-emerald-400" />}
                        recommended={true}
                    />

                    <PricingCard
                        tier="Enterprise"
                        price="Custom"
                        desc="Private clusters for massive multi-tenant operations."
                        features={[
                            "Private Infrastructure",
                            "Dedicated AI Training",
                            "White-label Capability",
                            "24/7 Neural Concierge",
                            "Custom Integration Support"
                        ]}
                        icon={<Crown className="w-5 h-5 text-amber-400" />}
                    />
                </section>

                <section className="max-w-4xl mx-auto px-6 mt-40 text-center">
                    <div className="glass-panel p-12 rounded-[3rem] border border-white/5">
                        <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter italic">The OPNMRT Guarantee</h3>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-8">Full Sovereignty • No Hidden Fees • Bank-Grade Security</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <GuaranteeItem icon={<Shield size={16} />} text="End-to-End Encryption" />
                            <GuaranteeItem icon={<Zap size={16} />} text="100ms Page Loads" />
                            <GuaranteeItem icon={<Check size={16} />} text="Cancel Anytime" />
                        </div>
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
}

function PricingCard({ tier, price, desc, features, icon, recommended }: any) {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className={`glass-panel p-10 rounded-[4rem] border ${recommended ? 'border-emerald-500/30' : 'border-white/5'} relative overflow-hidden flex flex-col`}
        >
            {recommended && (
                <div className="absolute top-8 right-[-35px] bg-emerald-500 text-[#030712] text-[10px] font-black py-1 px-10 rotate-45 uppercase tracking-[0.2em] shadow-lg">
                    Best Value
                </div>
            )}

            <div className="flex items-center space-x-3 mb-8">
                <div className={`p-3 rounded-2xl bg-white/5 ${recommended ? 'text-emerald-400 border border-emerald-500/20' : 'text-slate-500'}`}>
                    {icon}
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{tier}</h3>
            </div>

            <div className="mb-8">
                <div className="flex items-baseline space-x-1">
                    <span className="text-5xl font-black text-white tracking-tighter">{price === 'Custom' ? price : `$${price}`}</span>
                    {price !== 'Custom' && <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">/Month</span>}
                </div>
                <p className="mt-4 text-sm text-slate-500 font-medium italic">{desc}</p>
            </div>

            <div className="space-y-4 mb-12 flex-1">
                {features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-center space-x-3 group">
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${recommended ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-600'}`}>
                            <Check size={12} />
                        </div>
                        <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors tracking-tight">{feature}</span>
                    </div>
                ))}
            </div>

            <Link
                href="/register"
                className={`w-full py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] transition-all text-center ${recommended
                        ? 'bg-emerald-500 text-[#030712] shadow-xl shadow-emerald-500/20 hover:scale-[1.02]'
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
            >
                {price === '0' ? 'Start Free' : 'Get Started'}
            </Link>
        </motion.div>
    );
}

function GuaranteeItem({ icon, text }: any) {
    return (
        <div className="flex items-center justify-center space-x-2 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
            <div className="text-emerald-500">{icon}</div>
            <span>{text}</span>
        </div>
    );
}
