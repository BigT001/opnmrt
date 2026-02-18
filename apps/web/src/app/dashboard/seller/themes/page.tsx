'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { themeMetadata, ThemeMetadata } from '@/components/themes/registry';
import { ThemeCategory } from '@/components/themes/types';
import { ThemeMiniPreview } from '@/components/themes/ThemeMiniPreview';
import Link from 'next/link';
import api from '@/lib/api';

export default function ThemesPage() {
    const { store, setStore } = useAuthStore();
    const [updating, setUpdating] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const categories: { id: ThemeCategory; name: string }[] = [
        { id: 'FASHION_ACCESSORIES', name: 'Fashion & Accessories' },
        { id: 'BEAUTY_SKINCARE', name: 'Beauty & Skincare' },
        { id: 'GADGETS_ACCESSORIES', name: 'Gadgets & Accessories' }
    ];

    const defaultTheme = themeMetadata.find(t => t.id === 'DEFAULT');
    const otherThemes = themeMetadata.filter(t => t.id !== 'DEFAULT');

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
                </div>
                {message && (
                    <div className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-900/5 animate-in fade-in slide-in-from-top-4 duration-500 ${message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                        {message.text}
                    </div>
                )}
            </div>

            {/* Featured / Default Theme Section */}
            {defaultTheme && (
                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Baseline Foundation</h2>
                        <div className="h-px bg-slate-100 flex-1"></div>
                    </div>
                    <div className="max-w-sm">
                        <ThemeCard
                            theme={defaultTheme}
                            isActive={store?.theme === defaultTheme.id}
                            isUpdating={updating === defaultTheme.id}
                            onActivate={() => handleActivate(defaultTheme.id)}
                            store={store}
                        />
                    </div>
                </section>
            )}

            {/* Categorized Themes */}
            <div className="space-y-12">
                {categories.map((category) => (
                    <section key={category.id} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">{category.name}</h2>
                            <div className="h-px bg-slate-100 flex-1"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherThemes.filter(t => t.category === category.id).map((theme) => (
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
                ))}
            </div>
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
    const getPreviewStyles = (id: string) => {
        switch (id) {
            case 'MINIMAL_LUXE': return 'bg-white border-slate-100';
            case 'GLAMOUR_EVE': return 'bg-slate-900 text-white';
            case 'CHIC_URBAN': return 'bg-zinc-900';
            case 'DEFAULT': return 'bg-indigo-600';
            default: return 'bg-slate-50';
        }
    };

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
            <div className={`h-44 w-full relative overflow-hidden flex items-center justify-center ${getPreviewStyles(theme.id)}`}>
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>

                {store && (
                    <div className="transform group-hover:scale-105 transition-transform duration-700 w-full h-full">
                        <ThemeMiniPreview themeId={theme.id} store={store} />
                    </div>
                )}

                {/* Live Preview Button (Overlay) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 z-20">
                    <div className="px-5 py-2 bg-white text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-full shadow-2xl">
                        Preview Store
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-black text-slate-900 truncate">{theme.name}</h3>
                    {isActive && (
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    )}
                </div>
                <p className="text-[10px] font-medium text-slate-400 leading-relaxed line-clamp-2 mb-4">{theme.description}</p>

                <div className="mt-auto flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        {!isActive ? (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onActivate();
                                }}
                                disabled={isUpdating}
                                className="flex-1 py-2 bg-slate-900 hover:bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-full transition-all disabled:opacity-50"
                            >
                                {isUpdating ? 'Applying...' : 'Activate'}
                            </button>
                        ) : (
                            <div className="flex-1 py-2 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full text-center border border-emerald-100">
                                Active
                            </div>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick();
                            }}
                            className="flex-1 py-2 bg-white border border-slate-200 text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-slate-50 transition-all"
                        >
                            Customize
                        </button>
                    </div>
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className="w-full py-1.5 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-600 transition-colors flex items-center justify-center"
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
