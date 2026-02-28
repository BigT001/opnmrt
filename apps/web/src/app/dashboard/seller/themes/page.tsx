'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { themeMetadata, ThemeMetadata } from '@/components/themes/metadata';
import { ThemeCategory } from '@/components/themes/types';
import { ThemeMiniPreview } from '@/components/themes/ThemeMiniPreview';
import Link from 'next/link';
import api from '@/lib/api';

export default function ThemesPage() {
    const { store, setStore } = useAuthStore();
    const [updating, setUpdating] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const filteredThemes = themeMetadata;

    const handleActivate = async (themeId: string) => {
        if (!store?.id) return;
        setUpdating(themeId);
        setMessage(null);

        try {
            const response = await api.patch(`/stores/${store.id}`, { theme: themeId });
            setStore(response.data);
            setMessage({ type: 'success', text: `Theme ${themeId.replace(/_/g, ' ')} activated!` });
            setTimeout(() => window.location.reload(), 800);
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Failed to activate theme.' });
        } finally {
            setUpdating(null);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        OPN MART <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] uppercase tracking-widest rounded-full">STUDIO</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">Select a meticulously crafted theme to transform your storefront.</p>
                </div>
                {message && (
                    <div className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-900/5 animate-in fade-in slide-in-from-top-4 duration-500 ${message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                        {message.text}
                    </div>
                )}
            </div>

            {/* Quick Tip for Themes */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div>
                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1">Guide: Dressing Your Store</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                        Your theme is like your storefront's window display. Pick a style that matches your products. Each theme is fully mobile-responsive and optimized for high-speed shopping. You can preview any theme with your actual products before activating it!
                    </p>
                </div>
            </div>

            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Official Collections</h2>
                    <div className="h-px bg-slate-100 flex-1"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl">
                    {filteredThemes.map((theme) => (
                        <ThemeCard
                            key={theme.id}
                            theme={theme}
                            isActive={store?.theme === theme.id}
                            isUpdating={updating === theme.id}
                            onActivate={() => handleActivate(theme.id)}
                            store={store}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

function ThemeCard({ theme, isActive, isUpdating, onActivate, store, featured }: {
    theme: ThemeMetadata;
    isActive: boolean;
    isUpdating: boolean;
    onActivate: () => void;
    store: any;
    featured?: boolean;
}) {
    const handleCardClick = () => {
        window.location.href = `/dashboard/seller/themes/preview/${theme.id}`;
    };

    return (
        <div
            onClick={handleCardClick}
            className={`group bg-white rounded-[2rem] border-2 ${isActive ? 'border-primary shadow-2xl shadow-primary/10' : 'border-slate-50 hover:border-slate-200'} overflow-hidden flex flex-col transition-all duration-500 cursor-pointer relative ${featured ? 'scale-[1.02] origin-left' : ''}`}
        >
            {/* Recommendation Badge */}
            {!isActive && store?.category === theme.category && (
                <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-white/90 backdrop-blur-md text-primary text-[8px] font-black uppercase tracking-widest rounded-full border border-primary/20 shadow-sm">
                    Recommended
                </div>
            )}

            {/* Preview Section */}
            <div className={`h-48 w-full relative overflow-hidden flex items-center justify-center bg-slate-50`}>
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>

                {store && (
                    <div className="transform group-hover:scale-105 transition-transform duration-700 w-full h-full">
                        <ThemeMiniPreview themeId={theme.id} store={store} />
                    </div>
                )}

                {/* Live Preview Button (Overlay) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 z-20">
                    <div className="px-5 py-2 bg-white text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-full shadow-2xl flex items-center gap-2">
                        <svg className="w-3 h-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        Preview Store
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-[13px] font-black text-slate-900 tracking-tight">{theme.name}</h3>
                    {isActive && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                        </div>
                    )}
                </div>
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed line-clamp-2 mb-6">{theme.description}</p>

                <div className="mt-auto flex items-center gap-3">
                    {!isActive ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onActivate();
                            }}
                            disabled={isUpdating}
                            className="flex-1 py-3 bg-slate-900 hover:bg-black text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-slate-200"
                        >
                            {isUpdating ? 'Applying...' : 'Activate'}
                        </button>
                    ) : (
                        <div className="flex-1 py-3 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-2xl text-center border border-slate-100">
                            Current Theme
                        </div>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick();
                        }}
                        className="p-3 bg-white border border-slate-100 text-slate-900 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center group"
                    >
                        <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
