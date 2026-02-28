'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { getThemeComponents, themeMetadata } from '@/components/themes/registry';
import { ThemeEditor } from '@/components/themes/ThemeEditor';
import { ThemeConfig } from '@/components/themes/types';
import api from '@/lib/api';
import { Loader2, ArrowLeft, Eye, Layout as LayoutIcon, Zap, PanelRight, Home, LayoutGrid, Type, Columns } from 'lucide-react';
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
    const themeName = params.themeId?.toUpperCase() || 'DEFAULT';

    const themePages = React.useMemo(() => {
        if (themeName === 'ELECTSHOP') {
            return [
                { id: 'index', name: 'Home Page', desc: 'Main Storefront', icon: Home },
                { id: 'shop', name: 'Shop / Collections', desc: 'Product Listing', icon: LayoutGrid },
                { id: 'shop/electronics', name: 'Electronics', desc: 'Category View', icon: LayoutGrid },
                { id: 'shop/smartphones', name: 'Smartphones', desc: 'Category View', icon: LayoutGrid },
                { id: 'blog', name: 'Our Blog', desc: 'Content & News', icon: Type },
                { id: 'contact', name: 'Contact Us', desc: 'Stay Connected', icon: Columns }
            ];
        }
        if (themeName === 'VANTAGE') {
            return [
                { id: 'index', name: 'Home Page', desc: 'Main Storefront', icon: Home },
                { id: 'shop', name: 'Collections', desc: 'Style Listing', icon: LayoutGrid },
                { id: 'about', name: 'Our Story', desc: 'Brand Narrative', icon: Type }
            ];
        }
        return [
            { id: 'index', name: 'Home Page', desc: 'Main Storefront', icon: Home },
            { id: 'shop', name: 'Shop / Collections', desc: 'Product Listing', icon: LayoutGrid },
            { id: 'about', name: 'About / Story', desc: 'Brand Narrative', icon: Type }
        ];
    }, [themeName]);


    const filteredProducts = React.useMemo(() => {
        if (!previewPath.startsWith('shop/')) return products;
        const category = previewPath.split('/')[1];
        if (!category) return products;

        return products.filter((p: any) =>
            p.category?.toLowerCase() === category.toLowerCase() ||
            p.type?.toLowerCase() === category.toLowerCase()
        );
    }, [products, previewPath]);

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

    const { Layout, StorefrontHero, ProductGrid, StorefrontPage, BlogPage, ContactPage, AboutPage } = themeComponents || {};

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

    const handleConfigChange = React.useCallback((newConfig: Partial<ThemeConfig>) => {
        setTempConfig(prev => ({ ...prev, ...newConfig }));
    }, []);

    const publishHandler = React.useCallback(handlePublish, [handlePublish]);

    // Merge store data with temp config for preview
    const previewStore = React.useMemo(() => ({
        ...store,
        ...tempConfig,
        themeConfig: tempConfig,
        id: store?.id || '',
        name: tempConfig.name || store?.name || '',
        subdomain: store?.subdomain || '',
        logo: tempConfig.logo || store?.logo,
        heroImage: tempConfig.heroImage || store?.heroImage,
    }), [store, tempConfig]);

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


    if (!store) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-white p-10 text-center">
                <h1 className="text-xl font-black text-slate-900 mb-4">Store Data Missing</h1>
                <button onClick={() => router.push('/dashboard/seller/themes')} className="text-primary font-bold underline">Back to Themes Studio</button>
            </div>
        );
    }


    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">

            <div className="flex-1 overflow-hidden relative flex bg-slate-50/50">
                {/* 1. Main Preview Container */}
                <div
                    className="flex-1 overflow-y-auto no-scrollbar relative preview-canvas transition-all duration-500 ease-in-out"
                    style={{
                        transform: 'translateZ(0)', // Forces fixed/absolute children to be relative to this container
                        isolation: 'isolate'
                    }}
                >
                    <div className="w-full h-full p-0">
                        <div className="bg-white min-h-screen shadow-none border-none overflow-hidden relative">

                            {Layout && (
                                <Layout
                                    store={previewStore as any}
                                    isPreview={true}
                                    onConfigChange={handleConfigChange}
                                    onNavigate={setPreviewPath}
                                    virtualPath={previewPath}
                                >
                                    <div className="min-h-[800px]">
                                        {previewPath === 'index' && StorefrontPage && (
                                            <StorefrontPage
                                                store={previewStore as any}
                                                products={products}
                                                subdomain={previewStore.subdomain}
                                                isPreview={true}
                                                onConfigChange={handleConfigChange}
                                            />
                                        )}
                                        {previewPath.startsWith('shop') && (
                                            <div className="p-8">
                                                <h2 className="text-2xl font-black mb-8 uppercase tracking-tight">
                                                    {previewPath === 'shop' ? 'Full Collection' : previewPath.split('/')[1]?.toUpperCase()}
                                                </h2>
                                                {ProductGrid && (
                                                    <ProductGrid
                                                        products={filteredProducts.map((p: any) => ({
                                                            ...p,
                                                            image: p.image || p.images?.[0] || 'https://via.placeholder.com/400'
                                                        }))}
                                                        subdomain={store?.subdomain || ''}
                                                        storeId={store?.id || ''}
                                                        store={previewStore as any}
                                                        isPreview={true}
                                                        onConfigChange={handleConfigChange}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {previewPath === 'about' && (
                                            AboutPage ? (
                                                <AboutPage
                                                    store={previewStore as any}
                                                    products={products}
                                                    subdomain={previewStore.subdomain}
                                                    isPreview={true}
                                                />
                                            ) : (
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
                                            )
                                        )}
                                        {previewPath === 'blog' && BlogPage && (
                                            <BlogPage
                                                store={previewStore as any}
                                                subdomain={previewStore.subdomain}
                                                isPreview={true}
                                            />
                                        )}
                                        {previewPath === 'contact' && ContactPage && (
                                            <ContactPage
                                                store={previewStore as any}
                                                subdomain={previewStore.subdomain}
                                                isPreview={true}
                                            />
                                        )}
                                    </div>
                                </Layout>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Theme Settings Sidebar */}
                <AnimatePresence mode="wait">
                    {showEditor && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 350, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 250 }}
                            className="h-full overflow-hidden shrink-0 border-l border-slate-100"
                        >
                            <ThemeEditor
                                config={tempConfig}
                                subdomain={store?.subdomain}
                                onChange={handleConfigChange}
                                onSave={publishHandler}
                                onClose={() => setShowEditor(false)}
                                isSaving={isSaving}
                                currentPath={previewPath}
                                onPathChange={setPreviewPath}
                                pages={themePages}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sidebar Toggle Button */}
                {!showEditor && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        onClick={() => setShowEditor(true)}
                        className="absolute bottom-8 right-8 z-[110] p-4 rounded-full bg-indigo-600 shadow-2xl transition-all active:scale-90 hover:bg-slate-900 group"
                    >
                        <PanelRight className="w-6 h-6 text-white group-hover:rotate-180 transition-transform duration-500" />
                    </motion.button>
                )}
            </div>
        </div>
    );
}
