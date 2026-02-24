'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ConsultancyCard = () => (
    <div className="relative overflow-hidden rounded-[32px] md:rounded-[48px] bg-white p-8 md:p-10 flex flex-col justify-between aspect-[3/4] md:aspect-auto md:h-full border border-gray-100 shadow-sm">
        {/* Subtle gradient accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-orange-500" />
            </div>
            <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-black text-[#0a0a0a] uppercase italic tracking-tighter leading-tight">
                    Style<br />Consultancy
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed max-w-[140px]">
                    Bespoke tailoring guidance for elite members.
                </p>
            </div>
        </div>

        <button className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-orange-900/10 active:scale-95">
            Waitlist Now
        </button>
    </div>
);

const IntelligenceDrop = () => (
    <div className="relative overflow-hidden rounded-[32px] md:rounded-[48px] bg-[#0a0a0a] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* The strong orange glow from the reference image */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-md">
            <h3 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter truncate md:whitespace-normal leading-none">
                The Intelligence Drop
            </h3>
            <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed opacity-80">
                Get early access to collections and exclusive insights into the design process.
            </p>
        </div>

        <div className="relative z-10 w-full md:w-auto flex flex-col items-end gap-3">
            <div className="relative w-full md:w-[400px]">
                <input
                    type="email"
                    placeholder="ENTER EMAIL"
                    className="w-full h-16 bg-white/5 border border-white/10 rounded-full px-8 text-white text-[11px] font-bold tracking-widest outline-none focus:border-orange-500/50 transition-colors uppercase"
                />
                <button className="absolute right-2 top-2 bottom-2 px-8 bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-black uppercase tracking-widest rounded-full transition-all active:scale-95">
                    Subscribe
                </button>
            </div>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">
                No Spam. Only Excellence.
            </p>
        </div>
    </div>
);

export function AppifyEditorialFeature() {
    return (
        <section className="px-5 md:px-32 lg:px-64 py-16 md:py-24">
            <div className="max-w-[1600px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/4"
                    >
                        <ConsultancyCard />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="lg:w-3/4"
                    >
                        <IntelligenceDrop />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
