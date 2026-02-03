'use client';

import { HeroProps } from '../../types';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Sparkles, MoveRight } from 'lucide-react';
import { useRef } from 'react';

export function PureBotanicalHero({ store }: HeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    return (
        <section
            ref={containerRef}
            className="relative h-[95vh] flex items-center justify-center overflow-hidden bg-[#F9FAF8]"
        >
            {/* Immersive Background */}
            <motion.div
                style={{ y, opacity }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[#F9FAF8]/20 via-transparent to-[#F9FAF8] z-10" />
                <div className="absolute inset-0 bg-[#7C9082]/10 mix-blend-multiply z-10" />
                <img
                    src={store.heroImage || "https://images.unsplash.com/photo-1541250848049-b4f71413cc30?auto=format&fit=crop&q=80&w=2940"}
                    alt="Botanical Background"
                    className="w-full h-full object-cover scale-105"
                />
            </motion.div>

            {/* Floating Organic Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -30, 0],
                            rotate: [0, 15, 0],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            delay: i * 1.5,
                        }}
                        className="absolute text-[#7C9082]"
                        style={{
                            left: `${15 + i * 15}%`,
                            top: `${20 + (i % 3) * 20}%`,
                        }}
                    >
                        <Leaf className="w-12 h-12 stroke-[1px]" />
                    </motion.div>
                ))}
            </div>

            {/* Hero Content */}
            <div className="relative z-20 max-w-[1400px] mx-auto px-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center gap-8"
                >
                    <div className="flex items-center gap-4 text-[#7C9082] py-2 px-6 rounded-full border border-[#7C9082]/20 bg-white/40 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 fill-current" />
                        <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold">Nature's Own Sanctuary</span>
                    </div>

                    <div className="space-y-4">
                        <h2 className="font-sans text-[12px] uppercase tracking-[0.5em] text-[#1C2B21]/40">EST. 2024 — {store.name}</h2>
                        <h1 className="text-7xl md:text-9xl font-serif text-[#1C2B21] tracking-tighter leading-[0.9] flex flex-col items-center">
                            <span>{store.heroTitle?.split(' ')[0] || "Fresh"}</span>
                            <span className="italic text-[#7C9082] -mt-2">{store.heroTitle?.split(' ').slice(1).join(' ') || "Botanicals"}</span>
                        </h1>
                    </div>

                    <p className="max-w-xl mx-auto font-serif italic text-2xl text-[#1C2B21]/60 leading-relaxed">
                        "{store.heroSubtitle || "Breath in the purity of hand-picked ingredients, curated for the modern soul seeking stillness."}"
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative flex items-center gap-6 px-12 py-6 bg-[#1C2B21] text-white rounded-full overflow-hidden shadow-2xl shadow-[#1C2B21]/20 transition-all duration-500 hover:pr-10"
                    >
                        <span className="font-sans text-sm font-bold uppercase tracking-[0.3em] relative z-10 transition-colors group-hover:text-white">
                            Explore Collection
                        </span>
                        <div className="relative z-10 p-1 rounded-full bg-white/10">
                            <MoveRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1" />
                        </div>
                        <div className="absolute inset-0 bg-[#7C9082] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1]" />
                    </motion.button>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30"
            >
                <div className="w-[1px] h-16 bg-[#1C2B21]" />
                <span className="font-sans text-[9px] uppercase tracking-[0.3em] [writing-mode:vertical-lr]">Scroll to Breathe</span>
            </motion.div>
        </section>
    );
}

