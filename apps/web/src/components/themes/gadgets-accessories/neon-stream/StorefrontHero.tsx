'use client';

import { HeroProps } from '../../types';
import { motion } from 'framer-motion';
import { ChevronRight, Play, Sparkles } from 'lucide-react';

export function NeonStreamHero({ store }: HeroProps) {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
            {/* Energy Flow Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00F5FF]/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#BF00FF]/20 rounded-full blur-[150px] animate-pulse delay-700" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                        <Sparkles className="w-4 h-4 text-[#00F5FF]" />
                        <span className="text-[10px] font-black font-syne tracking-[0.3em] uppercase text-[#00F5FF]">System_Online // Stream_Active</span>
                    </div>

                    <h1 className="text-6xl md:text-9xl font-black font-syne tracking-tighter uppercase italic leading-[0.8] text-white">
                        {store.heroTitle || "NEXT GEN"} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] to-[#BF00FF]">HARDWARE</span>
                    </h1>

                    <p className="max-w-xl mx-auto text-gray-400 font-inter text-lg leading-relaxed">
                        {store.heroSubtitle || "Unlock peak performance with our curated stream of electric hardware. Built for the elite, deployed for you."}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                        <button className="group relative px-10 py-5 bg-[#00F5FF] text-black font-black font-syne text-xs uppercase tracking-[0.3em] flex items-center gap-3 overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(0,245,255,0.6)] active:scale-95">
                            <span className="relative z-10 flex items-center gap-2">
                                INITIALIZE ACQUISITION
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 opacity-20" />
                        </button>

                        <button className="flex items-center gap-3 text-white font-black font-syne text-xs uppercase tracking-[0.3em] hover:text-[#BF00FF] transition-colors group">
                            <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center group-hover:border-[#BF00FF]/50 transition-colors">
                                <Play className="w-4 h-4 fill-current ml-1" />
                            </div>
                            View Showcase
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">Scroll to Interface</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-[#00F5FF] to-transparent shadow-[0_0_8px_#00F5FF]" />
            </div>
        </section>
    );
}

