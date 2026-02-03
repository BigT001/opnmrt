'use client';

import { HeroProps } from '../../types';
import { motion } from 'framer-motion';
import { Smartphone, Laptop, Sparkles, ChevronRight } from 'lucide-react';

export function TechSpecHero({ store }: HeroProps) {
    return (
        <div className="relative h-[650px] overflow-hidden bg-[#6B21A8]">
            {/* Mesh Gradient / Wave Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B21A8] via-[#8B5CF6] to-[#DB2777]" />
                <svg className="absolute bottom-0 left-0 w-full h-auto opacity-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fill="#ffffff" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,138.7C960,160,1056,224,1152,224C1248,224,1344,160,1392,128L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
                {/* Animated Glows */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#DB2777] rounded-full blur-[120px] mix-blend-screen"
                />
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto px-10 h-full flex flex-col items-start justify-center text-white">
                <div className="grid lg:grid-cols-2 gap-20 items-center w-full">
                    {/* Text Content */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20 rounded-sm w-fit"
                        >
                            <Sparkles className="w-3 h-3 text-yellow-400" />
                            {store.heroSubtitle || "New Arrivals 2026"}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-7xl font-black uppercase tracking-tighter leading-[0.9] italic"
                        >
                            {store.heroTitle || "Perfect New\nGeneration Hardware"}
                        </motion.h1>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="bg-white text-black px-12 py-5 font-black text-xs uppercase tracking-[0.3em] hover:bg-[#E72E46] hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3 group"
                        >
                            Shop Now
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </motion.button>
                    </div>

                    {/* Hardware Visualizer (3D Style Stack) */}
                    <div className="relative hidden lg:block">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1, delay: 0.5, type: "spring" }}
                            className="relative z-20"
                        >
                            <img
                                src={store.heroImage || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=2942"}
                                alt="Main hardware"
                                className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] transform -rotate-12"
                            />
                        </motion.div>

                        {/* Ghost Laptops (Stacking effect as seen in screenshot) */}
                        <motion.div
                            initial={{ opacity: 0, x: 50, y: -50 }}
                            animate={{ opacity: 0.3, x: 80, y: -80 }}
                            transition={{ duration: 1.2, delay: 0.8 }}
                            className="absolute inset-0 z-10 pointer-events-none"
                        >
                            <img
                                src={store.heroImage || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=2942"}
                                alt="Hardware stack 1"
                                className="w-full h-auto transform -rotate-6 filter blur-[2px]"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -50, y: 50 }}
                            animate={{ opacity: 0.2, x: -80, y: 80 }}
                            transition={{ duration: 1.2, delay: 1 }}
                            className="absolute inset-0 z-0 pointer-events-none"
                        >
                            <img
                                src={store.heroImage || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=2942"}
                                alt="Hardware stack 2"
                                className="w-full h-auto transform rotate-12 filter blur-[4px]"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Pagination Dots (Simulated as in screenshot) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {[0, 1, 2].map((i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full border border-white/40 ${i === 0 ? 'bg-white' : 'bg-transparent'}`} />
                ))}
            </div>
        </div>
    );
}

