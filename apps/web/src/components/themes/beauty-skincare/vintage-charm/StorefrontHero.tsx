'use client';

import { HeroProps } from '../../types';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function VintageCharmHero({ store }: HeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    return (
        <section ref={containerRef} className="relative h-[100vh] flex items-center justify-center overflow-hidden bg-[#F9F4EE]">
            {/* Background Image Layer */}
            <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
                <img
                    src={store.heroImage || "https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?auto=format&fit=crop&q=80&w=2940"}
                    alt="Heritage Beauty"
                    className="w-full h-full object-cover brightness-[0.85] contrast-[1.1] grayscale-[0.2]"
                />
                <div className="absolute inset-0 bg-[#1B3022]/10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F9F4EE]" />
            </motion.div>

            {/* Decorative Botanical Overlays */}
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                <motion.img
                    initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
                    animate={{ opacity: 0.15, rotate: 0, scale: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    src="https://www.transparenttextures.com/patterns/natural-paper.png"
                    className="absolute -top-20 -left-20 w-[600px] opacity-10 rotate-12"
                />
            </div>

            {/* Content Container */}
            <motion.div
                style={{ opacity }}
                className="relative z-20 max-w-[1400px] mx-auto px-10 text-center"
            >
                <div className="inline-block relative px-12 py-20">
                    {/* Ornate Frame Border */}
                    <div className="absolute inset-0 border-[1px] border-[#1B3022]/30 vintage-border" />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="space-y-8 relative z-10"
                    >
                        <span className="font-cursive text-4xl text-[#8B4513] block drop-shadow-sm">
                            Since 1924
                        </span>
                        <h1 className="text-7xl md:text-9xl font-black text-[#1B3022] tracking-tighter leading-[0.85] uppercase max-w-4xl mx-auto">
                            {store.heroTitle || "T I M E L E S S // B E A U T Y"}
                        </h1>
                        <p className="font-serif text-xl md:text-2xl text-[#1B3022]/70 max-w-2xl mx-auto italic leading-relaxed">
                            {store.heroSubtitle || "Pure botanical extracts meeting century-old laboratory wisdom."}
                        </p>

                        <div className="pt-10">
                            <button className="group relative px-12 py-5 bg-[#1B3022] text-[#F9F4EE] font-bold uppercase tracking-[0.2em] text-xs overflow-hidden transition-all hover:bg-[#8B4513]">
                                <span className="relative z-10">Enter the Archive</span>
                                <div className="absolute inset-0 bg-[#F9F4EE]/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Corner Decorative Elements */}
            <div className="absolute bottom-10 left-10 z-30 font-mono text-[9px] text-[#1B3022]/40 tracking-[0.3em] uppercase hidden lg:block">
                Curated Selection // Batch_01 // Global_Distribution
            </div>
            <div className="absolute bottom-10 right-10 z-30 font-mono text-[9px] text-[#1B3022]/40 tracking-[0.3em] uppercase hidden lg:block">
                Pure Formula_Protection // (c) 1924-2024
            </div>
        </section>
    );
}

