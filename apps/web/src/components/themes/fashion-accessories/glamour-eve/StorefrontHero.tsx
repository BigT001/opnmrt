'use client';

import { HeroProps } from '../../types';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export function GlamourEveHero({ store }: HeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={containerRef} className="relative h-[110vh] flex items-center overflow-hidden bg-black pt-20">
            {/* Background Image with Parallax */}
            <motion.div style={{ y }} className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
                <img
                    src={store.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3"}
                    alt="Hero"
                    className="w-full h-full object-cover object-[75%_center]"
                />
            </motion.div>

            <div className="relative z-20 max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16 w-full">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="inline-block text-[#D4AF37] uppercase tracking-[0.4em] text-[10px] font-black mb-8 border-l-2 border-[#D4AF37] pl-4">
                            L'Élite de la Mode
                        </span>

                        <h1 className="text-[clamp(3.5rem,10vw,8.5rem)] font-serif text-white leading-[0.9] tracking-tighter mb-10 overflow-hidden">
                            <motion.span
                                className="block"
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            >
                                {store.heroTitle || "Style That"}
                            </motion.span>
                            <motion.span
                                className="block italic text-[#D4AF37]"
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            >
                                {store.heroSubtitle ? (store.heroSubtitle.split('.')[0]) : "Defines You"}
                            </motion.span>
                        </h1>

                        <motion.p
                            className="text-white/60 text-lg md:text-xl max-w-xl leading-relaxed mb-10 font-light tracking-wide uppercase text-[12px]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.8 }}
                        >
                            Experience the intersection of luxury and modernity. Our curated collections are designed for those who demand excellence in every stitch.
                        </motion.p>

                        <motion.div
                            className="flex flex-wrap items-center gap-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1 }}
                        >
                            <button className="group relative overflow-hidden bg-[#D4AF37] px-10 py-5 text-black font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:pr-14 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                                <span className="relative z-10 flex items-center gap-4">
                                    Explore Collection
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                </span>
                            </button>

                            <button className="text-white/80 hover:text-[#D4AF37] transition-colors uppercase tracking-[0.2em] text-[11px] font-black underline underline-offset-8">
                                Lookbook 2024
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Vertical Scroll Indicator */}
            <motion.div
                style={{ opacity }}
                className="absolute bottom-10 left-10 hidden lg:flex flex-col items-center gap-4 text-white/40"
            >
                <span className="uppercase tracking-[0.5em] text-[8px] font-black rotate-90 mb-12">Scroll</span>
                <div className="w-[1px] h-20 bg-gradient-to-b from-[#D4AF37] to-transparent" />
            </motion.div>

            {/* Side Branding */}
            <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden xl:block pointer-events-none">
                <span className="text-[12rem] font-serif text-white/[0.03] leading-none uppercase tracking-tighter select-none rotate-90 origin-center translate-x-1/2">
                    GLAMOUR EVE
                </span>
            </div>
        </section>
    );
}

