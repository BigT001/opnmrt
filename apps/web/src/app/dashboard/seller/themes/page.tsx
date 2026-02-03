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

    const handleActivate = async (themeId: string) => {
        if (!store?.id) return;
        setUpdating(themeId);
        setMessage(null);

        try {
            const response = await api.patch(`/stores/${store.id}`, { theme: themeId });
            setStore(response.data);
            setMessage({ type: 'success', text: `Theme ${themeId.replace(/_/g, ' ')} activated successfully!` });
        } catch (error: any) {
            console.error('Theme activation failed:', error);
            setMessage({ type: 'error', text: 'Failed to activate theme.' });
        } finally {
            setUpdating(null);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Themes</h1>
                    <p className="text-slate-500 mt-1">Choose a design that matches your brand's personality</p>
                </div>
                {message && (
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                        {message.text}
                    </div>
                )}
            </div>

            <div className="space-y-16">
                {categories.map((category) => (
                    <section key={category.id} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{category.name}</h2>
                            <div className="h-px bg-slate-200 w-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {themeMetadata.filter(t => t.category === category.id).map((theme) => (
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

function ThemeCard({ theme, isActive, isUpdating, onActivate, store }: {
    theme: ThemeMetadata;
    isActive: boolean;
    isUpdating: boolean;
    onActivate: () => void;
    store: any;
}) {
    // Generate a simple preview based on theme ID
    const getPreviewStyles = (id: string) => {
        switch (id) {
            case 'MINIMAL_LUXE': return 'bg-white border-slate-100 flex flex-col items-center justify-center';
            case 'GLAMOUR_EVE': return 'bg-indigo-50 border-indigo-100';
            case 'CHIC_URBAN': return 'bg-zinc-900 border-zinc-800';
            case 'VINTAGE_CHARM': return 'bg-[#fdfbf7] border-stone-200';
            case 'PURE_BOTANICAL': return 'bg-emerald-50 border-emerald-100';
            case 'RADIANT_GLOW': return 'bg-rose-50 border-rose-100';
            case 'STARK_EDGE': return 'bg-white border-black border-2';
            case 'TECH_SPEC': return 'bg-slate-900 border-slate-700';
            case 'NEON_STREAM': return 'bg-black border-cyan-500/30';
            default: return 'bg-slate-50';
        }
    };

    return (
        <div className={`bg-white rounded-[2.5rem] border ${isActive ? 'border-primary ring-4 ring-primary/5' : 'border-slate-100'} overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 group`}>
            {/* Preview Section */}
            <div className={`h-48 w-full relative overflow-hidden flex ${getPreviewStyles(theme.id)}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>

                {/* Live component preview */}
                {store && (
                    <ThemeMiniPreview themeId={theme.id} store={store} />
                )}

                {/* Status Badge */}
                {isActive && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/20">
                        Current Theme
                    </div>
                )}

                {/* Live Preview Button (Overlay) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100">
                    <Link
                        href={`/dashboard/seller/themes/preview/${theme.id}`}
                        className="px-6 py-2.5 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-2xl hover:bg-slate-50 transition-colors"
                    >
                        Live Preview
                    </Link>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex flex-col flex-1">
                <div className="mb-6">
                    <h3 className="text-lg font-black text-slate-900">{theme.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{theme.description}</p>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between gap-4">
                    {!isActive ? (
                        <button
                            onClick={onActivate}
                            disabled={isUpdating}
                            className="flex-1 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
                        >
                            {isUpdating ? 'Activating...' : 'Activate Theme'}
                        </button>
                    ) : (
                        <div className="flex-1 py-3 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl text-center border border-emerald-100">
                            Active
                        </div>
                    )}
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
