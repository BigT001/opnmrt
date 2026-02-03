'use client';

import { HeroProps } from '../../types';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play } from 'lucide-react';

export function RadiantGlowHero({ store }: HeroProps) {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#FFF9F0]">
            {/* Background Image with Light Leak Overlays */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "easeOut" }}
                    className="w-full h-full"
                >
                    <img
                        src={store.heroImage || "https://images.unsplash.com/photo-1596462502278-27bfad450526?auto=format&fit=crop&q=80&w=2600"}
                        alt="Radiant Skin"
                        className="w-full h-full object-cover brightness-[0.9] sepia-[0.1]"
                    />
                </motion.div>

                {/* Light Leak Overlays */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-[#E2AFA2]/40 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#FFF9F0]/80 via-[#FFF9F0]/20 to-transparent" />

                {/* Luminous Dust Particles (CSS) */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [-10, -500],
                                x: [Math.random() * 100, Math.random() * 200],
                                opacity: [0, 0.4, 0]
                            }}
                            transition={{
                                duration: 10 + Math.random() * 10,
                                repeat: Infinity,
                                delay: i * 2,
                                ease: "linear"
                            }}
                            className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
                            style={{
                                left: `${Math.random() * 100}%`,
                                bottom: '-20px'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-10 text-center flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="flex items-center gap-4 text-[#C19A6B]">
                        <div className="h-[1px] w-8 bg-current" />
                        <span className="font-sans text-[10px] uppercase tracking-[0.5em] font-black">Luminous Standard</span>
                        <div className="h-[1px] w-8 bg-current" />
                    </div>

                    <h1 className="text-7xl md:text-9xl font-luminous italic tracking-tight text-[#2D1E1E] leading-none max-w-5xl">
                        {store.heroTitle || "Captured in the"} <span className="shimmer-text">light.</span>
                    </h1>

                    <p className="font-sans text-sm tracking-[0.1em] text-[#2D1E1E]/60 max-w-xl leading-relaxed mt-4">
                        {store.heroSubtitle || "Discover the intersection of advanced dermatology and sun-drenched botanical wisdom. A glow that radiates from within."}
                    </p>

                    <div className="flex items-center gap-10 mt-12">
                        <button className="group relative flex items-center gap-6 px-12 py-5 bg-[#2D1E1E] text-white rounded-full overflow-hidden transition-all duration-700 hover:pr-10">
                            <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold relative z-10">Explore Collection</span>
                            <div className="relative z-10 p-1.5 rounded-full bg-white/10 group-hover:bg-[#C19A6B] transition-colors duration-500">
                                <ArrowRight className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute inset-0 bg-[#C19A6B] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1]" />
                        </button>

                        <button className="group flex items-center gap-4 text-[#2D1E1E] font-sans text-[10px] uppercase tracking-[0.4em] font-black">
                            <div className="w-14 h-14 rounded-full border border-[#C19A6B]/30 flex items-center justify-center group-hover:bg-[#C19A6B]/10 transition-all duration-500">
                                <Play className="w-4 h-4 fill-current ml-1" />
                            </div>
                            The Ritual
                        </button>
                    </div>
                </motion.div>

                {/* Floating Discovery Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-24 p-2 bg-white/40 backdrop-blur-3xl rounded-full border border-white/40 shadow-2xl flex items-center gap-8 pl-8 pr-2 group"
                >
                    <div className="flex flex-col">
                        <span className="font-sans text-[8px] uppercase tracking-widest text-[#2D1E1E]/40 font-black">What is your</span>
                        <span className="font-sans text-[11px] font-bold text-[#2D1E1E]">Skin Aura?</span>
                    </div>
                    <div className="h-4 w-[1px] bg-[#C19A6B]/20" />
                    <div className="flex flex-col">
                        <span className="font-sans text-[8px] uppercase tracking-widest text-[#2D1E1E]/40 font-black">Curated for</span>
                        <span className="font-sans text-[11px] font-bold text-[#2D1E1E]">Daily Luminosity</span>
                    </div>
                    <button className="h-14 w-14 rounded-full bg-[#C19A6B] text-white flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(193,154,107,0.4)] transition-all">
                        <Sparkles className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>

            {/* Corner Sun Flare */}
            <div className="absolute -top-48 -right-48 w-96 h-96 bg-[#C19A6B]/10 rounded-full blur-[100px] pointer-events-none" />
        </section>
    );
}

