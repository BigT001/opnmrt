'use client';

import React from 'react';
import { HeroProps } from '../types';
import { motion } from 'framer-motion';
import { ChevronRight, MessageCircle } from 'lucide-react';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import { EditableText, EditableImage } from '../EditableContent';
import toast from 'react-hot-toast';

export function ElectshopHero({ store, isPreview, onConfigChange }: HeroProps) {
    const { toggleDrawer } = useChatStore();
    const { user } = useAuthStore();

    const config = store.themeConfig || {};
    const effectivePrimaryColor = config.primaryColor || store.primaryColor || '#2874f0';

    const handleSave = (key: string, value: string) => {
        onConfigChange?.({ [key]: value });
    };

    // Using a high-fidelity wide tech/lifestyle image for an immersive background
    const heroImage = store.heroImage || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=2000';

    return (
        <section className="relative h-[600px] lg:h-[750px] overflow-hidden bg-gray-900 border-b border-gray-800">
            {/* Wide Immersive Background Image */}
            <div className="absolute inset-0 z-0">
                <EditableImage
                    src={heroImage}
                    onSave={(url: string) => handleSave('heroImage', url)}
                    isPreview={isPreview}
                    className="w-full h-full object-cover object-center lg:object-right transform scale-105"
                    aspectRatio="aspect-[21/9]"
                    label="Hero Image"
                />
                {/* Multi-layered Gradients for Premium Feel & Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent lg:from-black/60 lg:via-black/20 lg:to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Decorative Light Leak/Accent */}
            <div className="absolute top-0 left-0 w-full h-full mix-blend-overlay z-[1] pointer-events-none" style={{ backgroundColor: `${effectivePrimaryColor}0D` }} />

            <div className="max-w-7xl mx-auto px-4 h-full flex items-center relative z-10">
                {/* High-End Text Content Overlay */}
                <div className="w-full lg:w-3/4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-3xl"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 px-3 py-1 backdrop-blur-md border rounded-full mb-8"
                            style={{ backgroundColor: `${effectivePrimaryColor}33`, borderColor: `${effectivePrimaryColor}4D` }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: effectivePrimaryColor }} />
                            <EditableText
                                value={(config as any).heroBadge || 'Next-Gen Electronics'}
                                onSave={(val: string) => handleSave('heroBadge', val)}
                                isPreview={isPreview}
                                className="text-[10px] font-black text-white uppercase tracking-[0.4em]"
                                label="Badge"
                            />
                        </motion.div>

                        <h1 className="text-5xl lg:text-[95px] font-black text-white leading-[0.85] tracking-tighter mb-10 uppercase italic">
                            <EditableText
                                value={config.heroTitle || 'Elevate Your Digital Lifestyle'}
                                onSave={(val: string) => handleSave('heroTitle', val)}
                                isPreview={isPreview}
                                label="Title"
                            />
                        </h1>

                        <div className="text-gray-300 text-base lg:text-lg mb-12 max-w-xl font-medium leading-relaxed">
                            <EditableText
                                value={config.heroSubtitle || 'Experience the pinnacle of technology with our curated collection of high-performance devices, engineered for those who demand excellence.'}
                                onSave={(val: string) => handleSave('heroSubtitle', val)}
                                isPreview={isPreview}
                                multiline
                                label="Description"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                            <button
                                className="px-10 py-4 text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2 group"
                                style={{ backgroundColor: effectivePrimaryColor, boxShadow: `0 25px 50px -12px ${effectivePrimaryColor}66` }}
                            >
                                <EditableText
                                    value={(config as any).heroButtonText || 'Explore Store'}
                                    onSave={(val: string) => handleSave('heroButtonText', val)}
                                    isPreview={isPreview}
                                    label="Button Text"
                                />
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => {
                                    if (!user) {
                                        toast.error('Please login to start a live chat');
                                        return;
                                    }
                                    toggleDrawer();
                                }}
                                className="px-10 py-4 bg-white/10 backdrop-blur-xl text-white border border-white/20 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-white/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2 group"
                            >
                                <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" style={{ color: effectivePrimaryColor }} />
                                <EditableText
                                    value={(config as any).heroSupportText || 'Support'}
                                    onSave={(val: string) => handleSave('heroSupportText', val)}
                                    isPreview={isPreview}
                                    label="Support Text"
                                />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Subtle Edge Glow */}
            <div className="absolute bottom-0 left-0 w-full h-px" style={{ backgroundImage: `linear-gradient(to right, transparent, ${effectivePrimaryColor}4D, transparent)` }} />
        </section>
    );
}
