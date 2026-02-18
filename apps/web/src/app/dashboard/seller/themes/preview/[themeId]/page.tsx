'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { getThemeComponents, themeMetadata } from '@/components/themes/registry';
import { ThemeEditor } from '@/components/themes/ThemeEditor';
import { ThemeConfig } from '@/components/themes/types';
import api from '@/lib/api';
import { Loader2, ArrowLeft, Eye, Layout as LayoutIcon, PanelRight } from 'lucide-react';

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

    const theme = themeMetadata.find(t => t.id === params.themeId);
    const themeName = params.themeId || 'MINIMAL_LUXE';
    const components = getThemeComponents(themeName);
    const { Layout, StorefrontHero, ProductGrid } = components;

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

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Igniting Design Studio</p>
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
            {/* Control Bar */}
            <div className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-[110] shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-900"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="h-6 w-px bg-slate-100 mx-2"></div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Design Studio</span>
                        <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{theme?.name || themeName}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowEditor(!showEditor)}
                        className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ${showEditor ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                    >
                        <PanelRight className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Editor</span>
                    </button>

                    <button
                        onClick={() => window.open(`http://${store?.subdomain}.localhost:3000`, '_blank')}
                        className="p-2.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-900 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">View Live</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Preview Container */}
                <div className="flex-1 overflow-hidden flex flex-col items-center justify-center p-8 bg-slate-50 relative">
                    <div className="w-full h-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 relative group">
                        {/* Device Frame Top */}
                        <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                            </div>
                            <div className="mx-auto bg-white/50 px-8 py-1 rounded-lg text-[9px] font-bold text-slate-400 tracking-wider">
                                {store?.subdomain}.opnmart.com
                            </div>
                        </div>

                        <div className="absolute inset-0 top-10 overflow-y-auto no-scrollbar">
                            <Layout
                                store={previewStore}
                                isPreview={true}
                                onConfigChange={handleConfigChange}
                                onNavigate={setPreviewPath}
                            >
                                <div className="pb-32">
                                    {previewPath === 'index' && (
                                        <>
                                            <StorefrontHero store={previewStore} />
                                            {ProductGrid && (
                                                <ProductGrid
                                                    products={products.map((p: any) => ({
                                                        ...p,
                                                        image: p.image || p.images?.[0] || 'https://via.placeholder.com/400'
                                                    }))}
                                                    subdomain={store?.subdomain || ''}
                                                    storeId={store?.id || ''}
                                                    store={previewStore}
                                                />
                                            )}
                                        </>
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

                {/* Right Customization Sidebar */}
                {showEditor && (
                    <ThemeEditor
                        config={tempConfig}
                        onChange={setTempConfig}
                        onSave={handlePublish}
                        isSaving={isSaving}
                    />
                )}
            </div>
        </div>
    );
}
