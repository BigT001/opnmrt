'use client';

import { HeroProps } from '../types';
import { EditableText, EditableImage } from '../EditableContent';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ShoppingCart, Globe, ShieldCheck } from 'lucide-react';
import React, { useRef } from 'react';

export function DefaultHero({ store, isPreview, onConfigChange }: HeroProps) {
    const containerRef = useRef(null);
    const { scrollY } = useScroll();

    // Parallax effects
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);
    const y2 = useTransform(scrollY, [0, 500], [0, -50]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    const handleSave = (key: string, value: string) => {
        onConfigChange?.({ [key]: value });
    };

    return (
        <section ref={containerRef} className="relative min-h-[90vh] flex items-center bg-white overflow-hidden">
            {/* Background Decorative Text - Ultra Subtle */}
            <div className="absolute inset-0 z-0 flex items-center justify-center select-none pointer-events-none opacity-[0.03]">
                <h1 className="text-[25vw] font-black uppercase tracking-tighter italic">
                    {store.name}
                </h1>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-20 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-24">

                    {/* Left Side: Content */}
                    <div className="w-full lg:w-1/2 space-y-8 md:space-y-10 order-2 lg:order-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-center lg:justify-start gap-4">
                                <span className="bg-primary w-10 h-[2px]" />
                                <span className="text-[10px] md:text-[11px] font-black text-primary uppercase tracking-[0.5em]">
                                    Signature Collection
                                </span>
                            </div>

                            <h1 className="text-6xl md:text-8xl xl:text-[110px] font-black text-gray-900 tracking-tighter leading-[0.85] uppercase italic">
                                <EditableText
                                    value={store.heroTitle || "Curated Excellence."}
                                    onSave={val => handleSave('heroTitle', val)}
                                    isPreview={isPreview}
                                    label="Hero Title"
                                />
                            </h1>

                            <p className="text-lg md:text-xl text-gray-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium tracking-tight">
                                <EditableText
                                    value={store.heroSubtitle || "Discover our meticulously selected collection of high-end essentials designed for the modern individual."}
                                    onSave={val => handleSave('heroSubtitle', val)}
                                    isPreview={isPreview}
                                    multiline
                                    label="Hero Subtitle"
                                />
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="flex flex-wrap gap-6 md:gap-8 items-center justify-center lg:justify-start"
                        >
                            <button
                                onClick={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })}
                                className="group relative px-10 py-5 md:px-12 md:py-6 bg-gray-900 text-white text-[11px] md:text-[12px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-black transition-all duration-500 overflow-hidden shadow-2xl shadow-gray-200"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    Shop Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                                </span>
                                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            </button>

                            <div className="flex flex-col border-l border-gray-100 pl-6 md:pl-8 text-left">
                                <span className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-1">Index Volume</span>
                                <span className="text-[13px] md:text-[15px] font-black text-gray-900 uppercase tracking-tighter italic">№ 2024.01</span>
                            </div>
                        </motion.div>

                        {/* Minimalist Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex justify-center lg:justify-start gap-8 md:gap-10 pt-4"
                        >
                            <div className="flex items-center gap-2 md:gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                                <Globe className="w-4 h-4" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Global Ops</span>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Secure Drop</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Visuals */}
                    <div className="w-full lg:w-1/2 order-1 lg:order-2 relative px-4 sm:px-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className="relative group"
                        >
                            {/* Main Collection Image */}
                            <motion.div
                                style={{ y: y1 }}
                                className="relative aspect-[4/5] rounded-[3.5rem] md:rounded-[5rem] overflow-hidden shadow-[0_60px_100px_-30px_rgba(0,0,0,0.15)] group-hover:shadow-[0_80px_120px_-30px_rgba(0,0,0,0.2)] transition-shadow duration-1000"
                            >
                                <EditableImage
                                    src={store.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000"}
                                    onSave={url => handleSave('heroImage', url)}
                                    isPreview={isPreview}
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-[3s]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            </motion.div>


                            {/* Floating Decorative Card */}
                            <motion.div
                                style={{ y: y2 }}
                                className="absolute -bottom-6 -left-4 md:-bottom-10 md:-left-12 lg:-left-20 bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl border border-gray-50 max-w-[180px] md:max-w-[240px] animate-in fade-in slide-in-from-left-8 duration-1000 delay-500"
                            >
                                <div className="space-y-3 md:space-y-4">
                                    <div className="w-8 h-8 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                        <ShoppingCart className="w-4 h-4 md:w-5 h-5" />
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <h4 className="text-[11px] md:text-[15px] font-black text-gray-900 uppercase italic tracking-tighter leading-none">New Release</h4>
                                        <p className="text-[8px] md:text-[10px] font-bold text-gray-300 uppercase tracking-widest">Handmade Excellence</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                        <span className="text-[8px] md:text-[10px] font-black text-primary uppercase italic tracking-widest animate-pulse">Live Now</span>
                                        <ArrowRight className="w-3 h-3 text-gray-200" />
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity }}
                className="absolute bottom-10 left-10 hidden xl:flex flex-col items-center gap-4 group cursor-pointer"
                onClick={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })}
            >
                <div className="w-px h-20 bg-gradient-to-b from-gray-200 to-transparent group-hover:from-primary transition-colors duration-500" />
                <span className="[writing-mode:vertical-lr] text-[9px] font-black text-gray-300 group-hover:text-gray-900 uppercase tracking-[0.4em] transition-colors duration-500">
                    Scroll Down
                </span>
            </motion.div>
        </section>
    );
}
