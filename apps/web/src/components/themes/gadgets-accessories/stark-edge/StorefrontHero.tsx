'use client';

import { HeroProps } from '../../types';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Activity, ShieldCheck, Zap } from 'lucide-react';

export function StarkEdgeHero({ store }: HeroProps) {
    return (
        <section className="relative min-h-[90vh] bg-[#080808] flex items-center justify-center overflow-hidden pt-16">
            {/* Structural Vector Lines */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#00F0FF] shadow-[0_0_15px_#00F0FF]" />
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#00F0FF] shadow-[0_0_15px_#00F0FF]" />
                <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-[#00F0FF] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-[#00F0FF]/30 rotate-45" />
            </div>

            {/* Background Content */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808] z-10" />
                {store.heroImage ? (
                    <img
                        src={store.heroImage}
                        alt="Hardware Architecture"
                        className="w-full h-full object-cover grayscale opacity-30 scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-[#111]" />
                )}
            </div>

            <div className="relative z-20 max-w-[1400px] mx-auto px-10 w-full">
                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    {/* Left: System Branding */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4 text-[#00F0FF]"
                            >
                                <Terminal className="w-5 h-5" />
                                <span className="font-data text-xs uppercase tracking-[0.4em] font-bold">Initiating Link...</span>
                                <div className="h-[1px] w-20 bg-[#00F0FF]/30" />
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                className="text-7xl md:text-9xl font-tactical font-black text-white leading-none tracking-tighter"
                            >
                                {store.heroTitle?.split(' ').map((word, i) => (
                                    <span key={i} className="block last:text-outline-white last:text-transparent">
                                        {word}
                                    </span>
                                )) || (
                                        <>
                                            ENGINEERED<br />
                                            <span className="text-[#00F0FF]">PERFORMANCE</span>
                                        </>
                                    )}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="max-w-md font-tactical text-lg text-white/60 leading-relaxed border-l-2 border-white/10 pl-8"
                            >
                                {store.heroSubtitle || "Revolutionary hardware architecture for the next generation of digital portability."}
                            </motion.p>
                        </div>

                        <div className="flex flex-wrap gap-8 pt-4">
                            <button className="group relative h-16 px-10 bg-[#00F0FF] text-black font-tactical font-black uppercase text-xs tracking-widest overflow-hidden">
                                <span className="relative z-10">Shop Devices</span>
                                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            </button>
                            <button className="h-16 px-10 border border-white/10 text-white font-tactical uppercase text-[10px] tracking-[0.3em] hover:bg-white hover:text-black transition-all">
                                Technical Specs
                            </button>
                        </div>
                    </div>

                    {/* Right: Device Calibration HUD */}
                    <div className="hidden lg:block relative">
                        <div className="absolute -inset-10 border border-[#333] rounded-full animate-[spin_20s_linear_infinite]" />
                        <div className="absolute -inset-20 border border-[#00F0FF]/10 rounded-full animate-[spin_30s_linear_infinite_reverse]" />

                        <div className="relative bg-[#111]/80 backdrop-blur-xl border border-[#333] p-12 rounded-sm space-y-12 shadow-2xl">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="text-[10px] font-data text-[#00F0FF] uppercase tracking-widest">Device Status: Optimal</div>
                                    <div className="text-2xl font-tactical font-black text-white">Next-Gen Hardware</div>
                                </div>
                                <Zap className="w-8 h-8 text-[#00F0FF]" />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                {[
                                    { icon: Cpu, label: "Core Speed", val: "5.4 GHz" },
                                    { icon: Activity, label: "Battery Health", val: "100%" }
                                ].map((stat, i) => (
                                    <div key={i} className="space-y-2 p-4 border border-[#333] bg-[#080808]">
                                        <stat.icon className="w-4 h-4 text-white/40" />
                                        <div className="text-[8px] font-data text-white/40 uppercase">{stat.label}</div>
                                        <div className="text-lg font-data font-bold text-white">{stat.val}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-[8px] font-data text-white/40 uppercase">
                                    <span>Charging Efficiency</span>
                                    <span>98%</span>
                                </div>
                                <div className="h-1 w-full bg-[#1A1A1A]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '98%' }}
                                        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                                        className="h-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tactical Decor */}
                        <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-[#00F0FF]" />
                        <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-[#00F0FF]" />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .text-outline-white {
                    -webkit-text-stroke: 1px rgba(255,255,255,0.3);
                }
            `}</style>
        </section>
    );
}

