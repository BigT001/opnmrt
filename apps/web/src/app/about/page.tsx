'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingBackground } from '@/components/landing/LandingBackground';
import { Globe, Heart, Shield, Cpu } from 'lucide-react';

export default function AboutPage() {
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
                            The <span className="text-emerald-500 italic">Ecosystem</span> of Choice.
                        </h1>
                        <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                            We believe commerce should be decentralized, intelligent, and sovereign. OPNMRT was built to give the power back to the creators.
                        </p>
                    </motion.div>
                </section>

                {/* Vision Grid */}
                <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 py-24">
                    <VisionCard
                        title="Commerce Independence"
                        desc="Your brand is yours. We provide the engine, you provide the vision. No predatory algorithms or data harvesting—just raw commerce power."
                        icon={<Shield className="w-8 h-8" />}
                    />
                    <VisionCard
                        title="Neural Assistance"
                        desc="AI shouldn't replace the merchant; it should empower them. Our tools are designed to automate the mundane and highlight the extraordinary."
                        icon={<Cpu className="w-8 h-8" />}
                    />
                    <VisionCard
                        title="Open Ecosystem"
                        desc="OPNMRT is built on the principle of openness. Our API-first approach means you can build, extend, and innovate without permission."
                        icon={<Globe className="w-8 h-8" />}
                    />
                    <VisionCard
                        title="Merchant-First"
                        desc="Every decision we make starts with the merchant's success in mind. If you win, the ecosystem wins."
                        icon={<Heart className="w-8 h-8" />}
                    />
                </section>

                {/* The Team / Story (Simplified) */}
                <section className="max-w-5xl mx-auto px-6 py-40 text-center">
                    <h2 className="text-3xl font-black text-white mb-12 uppercase tracking-tighter italic">Born from Frustration</h2>
                    <p className="text-lg text-slate-400 leading-relaxed font-medium mb-12">
                        OPNMRT was founded in 2026 by a collective of retail veterans and AI researchers who were tired of the "platform tax."
                        We saw world-class merchants being throttled by outdated monolithic platforms and decided to build the engine we always wanted.
                    </p>
                    <div className="flex flex-wrap justify-center gap-10">
                        <StatCircle value="2026" label="ESTD" />
                        <StatCircle value="Global" label="Impact" />
                        <StatCircle value="Open" label="Source" />
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
}

function VisionCard({ title, desc, icon }: any) {
    return (
        <div className="glass-panel p-12 rounded-[4rem] border border-white/5 space-y-8 group hover:border-emerald-500/20 transition-all">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-[#030712] transition-all">
                {icon}
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{title}</h3>
            <p className="text-slate-400 font-medium leading-relaxed italic">{desc}</p>
        </div>
    );
}

function StatCircle({ value, label }: any) {
    return (
        <div className="text-center">
            <div className="w-24 h-24 rounded-full border-2 border-emerald-500/30 flex items-center justify-center mb-4">
                <span className="text-xl font-black text-white tracking-tighter uppercase">{value}</span>
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        </div>
    );
}
