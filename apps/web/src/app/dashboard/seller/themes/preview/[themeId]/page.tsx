'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { getThemeComponents, themeMetadata } from '@/components/themes/registry';
import { ThemeEditor } from '@/components/themes/ThemeEditor';
import { ThemeConfig } from '@/components/themes/types';
import api from '@/lib/api';
import { Loader2, ArrowLeft, Eye, Layout as LayoutIcon, Zap, PanelRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemePreviewPage() {
    const params = useParams<{ themeId: string }>();
    const router = useRouter();
    const { store, setStore } = useAuthStore();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showEditor, setShowEditor] = useState(true);
    const [previewPath, setPreviewPath] = useState('index');
    const [tempConfig, setTempConfig] = useState<ThemeConfig>({
        headerVariant: 'Header1',
        heroTitle: (store as any)?.heroTitle || '',
        heroSubtitle: (store as any)?.heroSubtitle || '',
        primaryColor: (store as any)?.primaryColor || '#000000',
        borderRadius: 'rounded-xl',
        primaryFont: 'font-sans',
        name: store?.name || '',
        logo: store?.logo || ''
    });

    const [themeComponents, setThemeComponents] = useState<any>(null);
    const theme = themeMetadata.find(t => t.id === params.themeId);
    const themeName = params.themeId || 'DEFAULT';

    useEffect(() => {
        const loadComponents = async () => {
            try {
                const comps = await getThemeComponents(themeName);
                setThemeComponents(comps);
            } catch (err) {
                console.error('Failed to load theme components:', err);
            }
        };
        loadComponents();
    }, [themeName]);

    const { Layout, StorefrontHero, ProductGrid, StorefrontPage } = themeComponents || {};

    useEffect(() => {
        if (store?.themeConfig) {
            setTempConfig(prev => ({ ...prev, ...store.themeConfig }));
        }
    }, [store]);

    useEffect(() => {
        const fetchData = async () => {
            if (!store?.subdomain) return;
            try {
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

    const handlePublish = async () => {
        if (!store?.id) return;
        setIsSaving(true);
        try {
            const response = await api.patch(`/stores/${store.id}`, {
                theme: themeName,
                themeConfig: tempConfig,
                heroTitle: tempConfig.heroTitle,
                heroSubtitle: tempConfig.heroSubtitle,
                primaryColor: tempConfig.primaryColor,
                name: tempConfig.name,
                logo: tempConfig.logo
            });
            setStore(response.data);
            alert('Design published successfully!');
        } catch (error) {
            console.error('Publishing failed:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || !themeComponents) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 min-h-screen">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Igniting Design Studio</p>
                </div>
            </div>
        );
    }

    // Merge store data with temp config for preview
    const previewStore = {
        ...store,
        ...tempConfig,
        themeConfig: tempConfig,
        id: store?.id || '',
        name: tempConfig.name || store?.name || '',
        subdomain: store?.subdomain || '',
        logo: tempConfig.logo || store?.logo,
        heroImage: tempConfig.heroImage || store?.heroImage,
    } as any;

    if (!store) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-white p-10 text-center">
                <h1 className="text-xl font-black text-slate-900 mb-4">Store Data Missing</h1>
                <button onClick={() => router.push('/dashboard/seller/themes')} className="text-primary font-bold underline">Back to Themes Studio</button>
            </div>
        );
    }

    const handleConfigChange = (newConfig: Partial<ThemeConfig>) => {
        setTempConfig(prev => ({ ...prev, ...newConfig }));
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
            {/* Premium Studio Control Bar */}
            <div className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 z-[110] shadow-sm">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="p-2.5 hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100 active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="h-8 w-px bg-slate-100"></div>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Design Studio</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Live Preview</span>
                        </div>
                        <h1 className="text-xs font-black uppercase tracking-widest text-slate-900">{theme?.name || themeName} <span className="text-slate-400 ml-1">v2.0</span></h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 hidden lg:flex">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Auto-Saving Enabled</span>
                    </div>

                    <button
                        onClick={() => window.open(`http://${store?.subdomain}.localhost:3000`, '_blank')}
                        className="h-11 px-6 bg-white border border-slate-100 text-slate-600 hover:text-slate-900 rounded-2xl transition-all shadow-sm active:scale-95 flex items-center gap-2.5 group"
                    >
                        <Eye className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest">View Live</span>
                    </button>

                    <button
                        onClick={handlePublish}
                        disabled={isSaving}
                        className="h-11 px-8 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-black transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            <>
                                <Zap className="w-4 h-4 text-orange-400 fill-orange-400" />
                                Publish Design
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative flex bg-slate-50/50">
                {/* 1. Main Preview Container */}
                <div className="flex-1 overflow-y-auto no-scrollbar relative">
                    <div className="max-w-[1400px] mx-auto p-6 md:p-12 pb-32">
                        <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative">
                            {/* Browser Decoration */}
                            <div className="h-12 bg-slate-50/50 border-b border-slate-50 flex items-center px-6 gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                                </div>
                                <div className="mx-auto flex items-center gap-2 bg-white px-10 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                                    <div className="w-3 h-3 rounded-md bg-slate-100 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 border-b border-r border-slate-400 rotate-45 mb-1.5 ml-1.5 transform scale-50"></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 tracking-wide">
                                        {store?.subdomain}.opnmart.com
                                    </span>
                                </div>
                            </div>

                            <Layout
                                store={previewStore}
                                isPreview={true}
                                onConfigChange={handleConfigChange}
                                onNavigate={setPreviewPath}
                                virtualPath={previewPath}
                            >
                                <div className="min-h-[800px]">
                                    {previewPath === 'index' && StorefrontPage && (
                                        <StorefrontPage
                                            store={previewStore}
                                            products={products}
                                            subdomain={previewStore.subdomain}
                                            isPreview={true}
                                            onConfigChange={handleConfigChange}
                                        />
                                    )}
                                    {previewPath === 'shop' && (
                                        <div className="p-8">
                                            <h2 className="text-2xl font-black mb-8 uppercase tracking-tight">Full Collection</h2>
                                            {ProductGrid && (
                                                <ProductGrid
                                                    products={products.map((p: any) => ({
                                                        ...p,
                                                        image: p.image || p.images?.[0] || 'https://via.placeholder.com/400'
                                                    }))}
                                                    subdomain={store?.subdomain || ''}
                                                    storeId={store?.id || ''}
                                                    store={previewStore}
                                                    isPreview={true}
                                                    onConfigChange={handleConfigChange}
                                                />
                                            )}
                                        </div>
                                    )}
                                    {previewPath === 'about' && (
                                        <div className="p-8 max-w-2xl mx-auto space-y-6">
                                            <h2 className="text-4xl font-black uppercase tracking-tight">Our Story</h2>
                                            <p className="text-slate-500 leading-relaxed font-medium">
                                                Welcome to {previewStore.name}. We believe in providing the best quality products to our customers.
                                                Our journey started with a simple idea: to make premium items accessible to everyone.
                                            </p>
                                            <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">About Us Media Placeholder</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Layout>
                        </div>
                    </div>
                </div>

                {/* 2. Theme Settings Sidebar */}
                <AnimatePresence>
                    {showEditor && (
                        <motion.div
                            initial={{ x: 350 }}
                            animate={{ x: 0 }}
                            exit={{ x: 350 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="h-full"
                        >
                            <ThemeEditor
                                config={tempConfig}
                                onChange={handleConfigChange}
                                onSave={handlePublish}
                                onClose={() => setShowEditor(false)}
                                isSaving={isSaving}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sidebar Toggle Button */}
                <button
                    onClick={() => setShowEditor(!showEditor)}
                    className={`absolute bottom-8 right-8 z-[110] p-4 rounded-full shadow-2xl transition-all active:scale-90 ${showEditor ? 'bg-slate-900 translate-x-12 opacity-0' : 'bg-indigo-600'
                        }`}
                >
                    <PanelRight className="w-6 h-6 text-white" />
                </button>
            </div>
        </div>
    );
}
