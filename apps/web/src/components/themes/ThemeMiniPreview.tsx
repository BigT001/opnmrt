'use client';

import React from 'react';
import { StoreData } from './types';

interface ThemeMiniPreviewProps {
    themeId: string;
    store: StoreData;
}

/**
 * Lightweight preview card for theme selection.
 * Uses static color/layout hints instead of rendering actual theme components,
 * which avoids triggering heavy Turbopack compilation of all themes at once.
 */
export function ThemeMiniPreview({ themeId, store }: ThemeMiniPreviewProps) {
    const isAppify = themeId === 'APPIFY';

    // Realistic placeholders
    const fashionHero = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop';
    const gadgetHero = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop';
    const product1 = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop';
    const product2 = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop';

    if (isAppify) {
        return (
            <div className="absolute inset-0 w-full h-full overflow-hidden flex flex-col bg-slate-50 font-sans">
                {/* Immersive App Header */}
                <div className="p-4 flex flex-col gap-3 shrink-0 bg-white">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&auto=format&fit=crop" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">Hi, Best Seller</span>
                                <span className="text-[10px] text-slate-900 font-black tracking-tight">{store.name}</span>
                            </div>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                            <div className="w-3 h-3 bg-white rounded-sm" />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
                    {/* App Hero */}
                    <div className="h-28 w-full rounded-2xl overflow-hidden relative group">
                        <img src={fashionHero} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent p-4 flex flex-col justify-center">
                            <div className="h-1 w-6 bg-emerald-500 rounded-full mb-1" />
                            <div className="text-[11px] font-black text-white leading-none mb-1">New Collection</div>
                            <div className="text-[8px] font-medium text-white/80">Shop the latest trends</div>
                        </div>
                    </div>

                    {/* App Products */}
                    <div className="grid grid-cols-2 gap-3 pb-4">
                        {[product1, product2].map((img, i) => (
                            <div key={i} className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                                <div className="aspect-square rounded-lg overflow-hidden mb-2">
                                    <img src={img} className="w-full h-full object-cover" />
                                </div>
                                <div className="h-1.5 w-12 bg-slate-100 rounded-full mb-1" />
                                <div className="h-1.5 w-8 bg-emerald-500/20 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="h-14 bg-white border-t border-slate-100 flex items-center justify-around px-2 shrink-0">
                    <div className="w-5 h-5 rounded-full bg-slate-900 opacity-20" />
                    <div className="w-5 h-5 rounded-full bg-slate-900 opacity-20" />
                    <div className="p-3 bg-emerald-500 -mt-10 rounded-full shadow-xl shadow-emerald-200 border-4 border-white">
                        <div className="w-4 h-4 bg-white rounded-sm" />
                    </div>
                    <div className="w-5 h-5 rounded-full bg-slate-900 opacity-20" />
                    <div className="w-5 h-5 rounded-full bg-slate-900 opacity-20" />
                </div>
            </div>
        );
    }

    // DEFAULT THEME
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden flex flex-col bg-white font-sans">
            {/* Desktop Nav */}
            <div className="h-12 border-b border-slate-50 flex items-center px-4 gap-4 bg-white">
                <div className="w-6 h-6 bg-indigo-600 rounded-lg" />
                <div className="flex gap-3">
                    <div className="h-1 w-6 bg-slate-200 rounded-full" />
                    <div className="h-1 w-6 bg-slate-200 rounded-full" />
                    <div className="h-1 w-6 bg-slate-200 rounded-full" />
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
                {/* Hero Banner */}
                <div className="h-32 bg-slate-100 relative">
                    <img src={gadgetHero} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center p-4">
                        <div className="text-[14px] font-black text-white leading-tight mb-1">Modern Essentials</div>
                        <div className="px-3 py-1 bg-white text-slate-900 text-[7px] font-black uppercase rounded-sm">Explore Shop</div>
                    </div>
                </div>

                {/* Grid Rows */}
                <div className="p-3 grid grid-cols-3 gap-2">
                    {[product1, product2, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format'].map((img, i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                            <div className="aspect-square bg-slate-50 rounded-lg overflow-hidden">
                                <img src={img} className="w-full h-full object-cover" />
                            </div>
                            <div className="h-1 w-10 bg-slate-200 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// We no longer need getPreviewConfig as the logic is now inline and specific to the 2 themes.
