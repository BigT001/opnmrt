'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { getThemeComponents, themeMetadata } from '@/components/themes/registry';
import api from '@/lib/api';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function ThemePreviewPage() {
    const params = useParams<{ themeId: string }>();
    const router = useRouter();
    const { store, setStore } = useAuthStore();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActivating, setIsActivating] = useState(false);

    const theme = themeMetadata.find(t => t.id === params.themeId);
    const themeName = params.themeId || 'MINIMAL_LUXE';
    const components = getThemeComponents(themeName);
    const { Layout, StorefrontHero, ProductGrid } = components;

    useEffect(() => {
        const fetchData = async () => {
            if (!store?.subdomain) return;
            try {
                // Using subdomain for public access or direct store fetch if needed
                const res = await api.get(`/products?subdomain=${store.subdomain}`);
                setProducts(res.data);
            } catch (err) {
                console.error('Failed to fetch products for preview:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [store?.subdomain]);

    const handleActivate = async () => {
        if (!store?.id) return;
        setIsActivating(true);
        try {
            const response = await api.patch(`/stores/${store.id}`, { theme: themeName });
            setStore(response.data);
            router.push('/dashboard/seller/themes');
        } catch (error) {
            console.error('Activation failed:', error);
        } finally {
            setIsActivating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Preparing Live Simulation</p>
                </div>
            </div>
        );
    }

    if (!store) return (
        <div className="flex-1 flex flex-col items-center justify-center bg-white p-10 text-center">
            <h1 className="text-xl font-black text-slate-900 mb-4">Store Data Missing</h1>
            <button onClick={() => router.push('/dashboard/seller/themes')} className="text-primary font-bold">Back to Themes</button>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
            {/* Preview Control Bar */}
            <div className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 z-[110] shadow-2xl">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                        title="Back to Themes"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="h-8 w-px bg-white/10 mx-2"></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 leading-none mb-1">Previewing Theme</span>
                        <span className="text-sm font-bold text-white tracking-tight">{theme?.name || themeName}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex flex-col items-end">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live Simulation</span>
                        </div>
                        <span className="text-[8px] font-bold text-white/30 truncate max-w-[150px]">{store.name} storefront</span>
                    </div>

                    <div className="h-8 w-px bg-white/10 mx-2 hidden lg:block"></div>

                    <button
                        onClick={handleActivate}
                        disabled={isActivating || store.theme === themeName}
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all shadow-xl active:scale-95 ${store.theme === themeName
                                ? 'bg-emerald-500 text-white opacity-50 cursor-default'
                                : 'bg-primary text-white hover:brightness-110 shadow-emerald-900/20'
                            }`}
                    >
                        {isActivating ? 'Activating...' : store.theme === themeName ? 'Already Active' : 'Activate Theme'}
                    </button>
                </div>
            </div>

            {/* The Actual Storefront Preview Canvas */}
            <div className="flex-1 overflow-y-auto bg-white no-scrollbar">
                <Layout store={store}>
                    <div className="pb-32">
                        <StorefrontHero store={store} />
                        <ProductGrid
                            products={products}
                            subdomain={store.subdomain}
                            storeId={store.id}
                        />
                    </div>
                </Layout>
            </div>
        </div>
    );
}
