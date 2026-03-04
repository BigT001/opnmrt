'use client';

import React from 'react';
import { StoreData } from './types';

interface ThemeMiniPreviewProps {
    themeId: string;
    store: StoreData;
}

/**
 * Lightweight preview card for theme selection.
 * Uses immersive Hero-focused layouts to show the core brand identity.
 */
export function ThemeMiniPreview({ themeId, store }: ThemeMiniPreviewProps) {
    const isAppify = themeId === 'APPIFY';
    const isVantage = themeId === 'VANTAGE';
    const isElectshop = themeId === 'ELECTSHOP';

    // Premium Theme Assets
    const fashionHero = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop'; // Vantage style
    const gadgetHero = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop'; // Electshop style
    const appifyHero = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop';
    const defaultHero = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop';

    const getThemeConfig = () => {
        if (isAppify) return { img: appifyHero, title: 'Appify Mobile', accent: 'bg-emerald-500' };
        if (isVantage) return { img: fashionHero, title: 'Vantage Premium', accent: 'bg-indigo-600' };
        if (isElectshop) return { img: gadgetHero, title: 'Electshop Elite', accent: 'bg-amber-500' };
        return { img: defaultHero, title: 'Modern Default', accent: 'bg-slate-900' };
    };

    const config = getThemeConfig();

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden flex flex-col bg-slate-50 font-sans">
            {/* Header Hint */}
            <div className="absolute top-0 inset-x-0 h-10 bg-white/60 backdrop-blur-md z-10 flex items-center justify-between px-3 border-b border-white/20">
                <div className="flex items-center gap-1.5">
                    <div className={`w-4 h-4 rounded-md ${config.accent} shadow-sm flex items-center justify-center text-[6px] text-white font-black`}>{(store?.name?.[0] || 'O').toUpperCase()}</div>
                    <span className="text-[8px] font-black text-slate-800 tracking-tight uppercase truncate max-w-[80px]">{store?.name || 'Store'}</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400/20" />
                </div>
            </div>

            {/* Immersive Hero Section (The Core Display) */}
            <div className="flex-1 relative group grow">
                <img
                    src={config.img}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    alt={config.title}
                />

                {/* Theme Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4 pb-10">
                    <div className={`h-1 w-8 ${config.accent} rounded-full mb-2`} />
                    <h2 className="text-[20px] font-black text-white leading-tight mb-1 tracking-tighter shadow-sm">
                        {config.title}
                    </h2>
                    <p className="text-[9px] font-bold text-white/70 uppercase tracking-widest mb-3">
                        {isAppify ? 'Mobile App Experience' : isElectshop ? 'High-Performance Tech' : 'Premium Brand Aesthetic'}
                    </p>

                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 bg-white text-slate-900 text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">
                            Explore Collection
                        </div>
                    </div>
                </div>

                {/* Floating Elements for realism */}
                <div className="absolute top-14 right-4 space-y-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-[8px]">🛒</div>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-[8px]">♥</div>
                </div>
            </div>

            {/* Hint of Products at the bottom */}
            <div className="h-6 bg-white/90 backdrop-blur-sm flex items-center gap-2 px-4 border-t border-slate-100 shrink-0">
                <div className="h-1 w-12 bg-slate-200 rounded-full" />
                <div className="h-1 w-8 bg-slate-100 rounded-full" />
            </div>
        </div>
    );
}
