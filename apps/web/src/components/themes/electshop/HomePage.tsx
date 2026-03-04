'use client';

import React from 'react';
import { PageProps } from '../types';
import { ElectshopHero } from './StorefrontHero';
import {
    Truck,
    RotateCcw,
    ShieldCheck,
    Tag,
    Headset,
    ChevronRight,
    Star,
    ShoppingCart,
    SlidersHorizontal,
    ChevronDown,
    Eye,
    Heart,
    X
} from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useStoreCart } from '@/store/useStoreCart';
import { motion } from 'framer-motion';
import { ElectshopProductCard } from './ProductCard';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { EditableText, EditableImage } from '../EditableContent';

export function ElectshopHomePage({ store, products, subdomain, isPreview, onConfigChange }: PageProps) {
    const { addItem, setDirectCheckoutItem } = useStoreCart(store.id);
    const router = useRouter();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = React.useState('Digital Devices');

    const config = store.themeConfig || {};
    const effectivePrimaryColor = config.primaryColor || store.primaryColor || '#2874f0';

    const handleConfigSave = (newCfg: any) => {
        onConfigChange?.(newCfg);
    };

    const isHidden = (key: string) => store.hiddenSections?.includes(key);

    const toggleSection = (key: string) => {
        const current = store.hiddenSections || [];
        const next = current.includes(key) ? current.filter(k => k !== key) : [...current, key];
        onConfigChange?.({ hiddenSections: next });
    };

    const SectionWrapper: React.FC<{ id: string; children: React.ReactNode; className?: string }> = ({ id, children, className }) => {
        if (!isPreview && isHidden(id)) return null;

        return (
            <div className={`relative group/section ${className} ${isPreview && isHidden(id) ? 'opacity-30' : ''}`}>
                {isPreview && (
                    <div className="absolute top-4 right-4 z-[50] opacity-0 group-hover/section:opacity-100 transition-opacity">
                        <button
                            onClick={() => toggleSection(id)}
                            className={`p-2 rounded-xl border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isHidden(id) ? 'bg-orange-500 text-white border-orange-400' : 'bg-white text-slate-900 border-slate-100 hover:bg-slate-50'
                                }`}
                        >
                            {isHidden(id) ? (
                                <>
                                    <Eye className="w-3 h-3" />
                                    Show Section
                                </>
                            ) : (
                                <>
                                    <X className="w-3 h-3" />
                                    Hide Section
                                </>
                            )}
                        </button>
                    </div>
                )}
                <div className={isPreview && isHidden(id) ? 'pointer-events-none grayscale' : ''}>
                    {children}
                </div>
            </div>
        );
    };

    const handleBuyNow = (product: any) => {
        if (!product) return;
        setDirectCheckoutItem({
            ...product,
            quantity: 1,
            image: product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/600x800'
        });

        if (!user) {
            toast.error('Please login to continue checkout');
            router.push(`/store/${subdomain}/customer/login?redirect=checkout`);
        } else {
            router.push(`/store/${subdomain}/checkout`);
        }
    };

    // Filter products for the active tab (simulated if no categories)
    const filteredProducts = activeTab === 'Digital Devices'
        ? products.slice(0, 8)
        : activeTab === 'Smart Watches'
            ? products.slice(2, 10)
            : products.slice(4, 12);

    return (
        <div className="space-y-16 pb-20 theme-elect-home" style={{ '--elect-primary': effectivePrimaryColor } as React.CSSProperties}>
            <style jsx>{`
                .theme-elect-home :global(.text-brand) { color: var(--elect-primary, #2874f0) !important; }
                .theme-elect-home :global(.bg-brand) { background-color: var(--elect-primary, #2874f0) !important; }
                .theme-elect-home :global(.border-brand) { border-color: var(--elect-primary, #2874f0) !important; }
                .theme-elect-home :global(.hover-bg-brand:hover) { background-color: var(--elect-primary, #2874f0) !important; }
                .theme-elect-home :global(.hover-text-brand:hover) { color: var(--elect-primary, #2874f0) !important; }
                .theme-elect-home :global(.group-hover-text-brand) { transition: color 0.3s; }
                .theme-elect-home .group:hover :global(.group-hover-text-brand) { color: var(--elect-primary, #2874f0) !important; }
                .theme-elect-home .group:hover :global(.group-hover-border-brand) { border-color: var(--elect-primary, #2874f0) !important; }
            `}</style>

            {/* Hero Section */}
            <SectionWrapper id="hero">
                <ElectshopHero store={store} isPreview={isPreview} onConfigChange={onConfigChange} />
            </SectionWrapper>

            {/* Service Bar */}
            <SectionWrapper id="services">
                <section className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
                    <div className="bg-white rounded-3xl shadow-2xl shadow-black/5 border border-gray-100 p-6 lg:p-10 grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 divide-x-0 lg:divide-x divide-gray-100">
                        <ServiceItem
                            icon={<Truck className="w-6 h-6 text-brand" />}
                            title={
                                <EditableText
                                    value={config.homeService1Title || "Free Shipping"}
                                    onSave={(val: string) => handleConfigSave({ homeService1Title: val })}
                                    isPreview={isPreview}
                                    label="Service Title 1"
                                />
                            }
                            desc={
                                <EditableText
                                    value={config.homeService1Desc || "For all Orders Over $500"}
                                    onSave={(val: string) => handleConfigSave({ homeService1Desc: val })}
                                    isPreview={isPreview}
                                    label="Service Desc 1"
                                />
                            }
                        />
                        <ServiceItem
                            icon={<RotateCcw className="w-6 h-6 text-brand" />}
                            title={
                                <EditableText
                                    value={config.homeService2Title || "10 Days Returns"}
                                    onSave={(val: string) => handleConfigSave({ homeService2Title: val })}
                                    isPreview={isPreview}
                                    label="Service Title 2"
                                />
                            }
                            desc={
                                <EditableText
                                    value={config.homeService2Desc || "For an Exchange Product"}
                                    onSave={(val: string) => handleConfigSave({ homeService2Desc: val })}
                                    isPreview={isPreview}
                                    label="Service Desc 2"
                                />
                            }
                        />
                        <ServiceItem
                            icon={<ShieldCheck className="w-6 h-6 text-brand" />}
                            title={
                                <EditableText
                                    value={config.homeService3Title || "Secured Payment"}
                                    onSave={(val: string) => handleConfigSave({ homeService3Title: val })}
                                    isPreview={isPreview}
                                    label="Service Title 3"
                                />
                            }
                            desc={
                                <EditableText
                                    value={config.homeService3Desc || "Payment Cards Accepted"}
                                    onSave={(val: string) => handleConfigSave({ homeService3Desc: val })}
                                    isPreview={isPreview}
                                    label="Service Desc 3"
                                />
                            }
                        />
                        <ServiceItem
                            icon={<Tag className="w-6 h-6 text-brand" />}
                            title={
                                <EditableText
                                    value={config.homeService4Title || "Best Price"}
                                    onSave={(val: string) => handleConfigSave({ homeService4Title: val })}
                                    isPreview={isPreview}
                                    label="Service Title 4"
                                />
                            }
                            desc={
                                <EditableText
                                    value={config.homeService4Desc || "Find it cheaper anywhere?"}
                                    onSave={(val: string) => handleConfigSave({ homeService4Desc: val })}
                                    isPreview={isPreview}
                                    label="Service Desc 4"
                                />
                            }
                        />
                        <ServiceItem
                            icon={<Headset className="w-6 h-6 text-brand" />}
                            title={
                                <EditableText
                                    value={config.homeService5Title || "Support 24/7"}
                                    onSave={(val: string) => handleConfigSave({ homeService5Title: val })}
                                    isPreview={isPreview}
                                    label="Service Title 5"
                                />
                            }
                            desc={
                                <EditableText
                                    value={config.homeService5Desc || "Find us anytime you need"}
                                    onSave={(val: string) => handleConfigSave({ homeService5Desc: val })}
                                    isPreview={isPreview}
                                    label="Service Desc 5"
                                />
                            }
                        />
                    </div>
                </section>
            </SectionWrapper>


            {/* Latest Products */}
            <SectionWrapper id="latest">
                <section className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-8 text-left">
                        <h2 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight">
                            <EditableText
                                value={config.homeLatestHeader || "Latest Arrivals"}
                                onSave={(val: string) => handleConfigSave({ homeLatestHeader: val })}
                                isPreview={isPreview}
                                label="Section Header"
                            />
                        </h2>
                        <Link href={`/store/${subdomain}/shop`} className="text-xs font-bold uppercase tracking-widest text-brand flex items-center gap-1 hover:underline">
                            <EditableText
                                value={config.homeLatestLink || "Explore Shop"}
                                onSave={(val: string) => handleConfigSave({ homeLatestLink: val })}
                                isPreview={isPreview}
                                label="Link Text"
                            />
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                        {products.slice(0, 10).map((product) => (
                            <ElectshopProductCard
                                key={product.id}
                                product={product}
                                subdomain={subdomain}
                                storeId={store.id}
                                isPreview={isPreview}
                                onConfigChange={onConfigChange}
                                store={store}
                            />
                        ))}
                    </div>
                </section>
            </SectionWrapper>

            {/* Double Promo Banners */}
            <SectionWrapper id="promo-banners">
                <section className="max-w-7xl mx-auto px-4 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PromoBanner
                        title={
                            <EditableText
                                value={config.homePromo1Title || "Meta Horizon"}
                                onSave={(val: string) => handleConfigSave({ homePromo1Title: val })}
                                isPreview={isPreview}
                                label="Promo Title 1"
                            />
                        }
                        subtitle={
                            <EditableText
                                value={config.homePromo1Subtitle || "Virtual Reality"}
                                onSave={(val: string) => handleConfigSave({ homePromo1Subtitle: val })}
                                isPreview={isPreview}
                                label="Promo Subtitle 1"
                            />
                        }
                        price={
                            <EditableText
                                value={config.homePromo1Price || "$99.00"}
                                onSave={(val: string) => handleConfigSave({ homePromo1Price: val })}
                                isPreview={isPreview}
                                label="Promo Price 1"
                            />
                        }
                        image={config.homePromo1Image || "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=800"}
                        onSaveImage={(url: string) => handleConfigSave({ homePromo1Image: url })}
                        bgColor="bg-[#f0f4f8]"
                        onBuyNow={() => handleBuyNow(products[0])}
                        brandColor={effectivePrimaryColor}
                        isPreview={isPreview}
                    />
                    <PromoBanner
                        title={
                            <EditableText
                                value={config.homePromo2Title || "MacBook Studio"}
                                onSave={(val: string) => handleConfigSave({ homePromo2Title: val })}
                                isPreview={isPreview}
                                label="Promo Title 2"
                            />
                        }
                        subtitle={
                            <EditableText
                                value={config.homePromo2Subtitle || "Performance Pro"}
                                onSave={(val: string) => handleConfigSave({ homePromo2Subtitle: val })}
                                isPreview={isPreview}
                                label="Promo Subtitle 2"
                            />
                        }
                        price={
                            <EditableText
                                value={config.homePromo2Price || "$129.00"}
                                onSave={(val: string) => handleConfigSave({ homePromo2Price: val })}
                                isPreview={isPreview}
                                label="Promo Price 2"
                            />
                        }
                        image={config.homePromo2Image || "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800"}
                        onSaveImage={(url: string) => handleConfigSave({ homePromo2Image: url })}
                        bgColor="bg-[#f8f9fa]"
                        onBuyNow={() => handleBuyNow(products[1])}
                        brandColor={effectivePrimaryColor}
                        isPreview={isPreview}
                    />
                </section>
            </SectionWrapper>

            {/* Interactive Best Sellers Section */}
            <SectionWrapper id="best-sellers">
                <section className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Featured Dynamic Banner */}
                        <div className="lg:w-1/4">
                            <div className="bg-gradient-to-br from-gray-950 to-blue-950 rounded-[2.5rem] p-8 flex flex-col h-full shadow-2xl relative overflow-hidden group border border-white/5">
                                <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full opacity-20" style={{ backgroundColor: effectivePrimaryColor }} />
                                <div className="relative z-10 text-left">
                                    <span className="inline-block px-3 py-1 text-white text-[8px] font-black uppercase tracking-widest rounded-full mb-4" style={{ backgroundColor: effectivePrimaryColor }}>
                                        <EditableText
                                            value={config.homeFeaturedBadge || "Limited Edition"}
                                            onSave={(val: string) => handleConfigSave({ homeFeaturedBadge: val })}
                                            isPreview={isPreview}
                                            label="Featured Badge"
                                        />
                                    </span>
                                    <h3 className="text-3xl font-black text-white leading-tight uppercase italic tracking-tighter mb-4">
                                        <EditableText
                                            value={config.homeFeaturedTitle || "Galaxy Book3 \n Ultra Pro"}
                                            onSave={(val: string) => handleConfigSave({ homeFeaturedTitle: val })}
                                            isPreview={isPreview}
                                            label="Featured Title"
                                            multiline={true}
                                        />
                                    </h3>
                                    <p className="text-2xl font-black italic" style={{ color: effectivePrimaryColor }}>
                                        <EditableText
                                            value={config.homeFeaturedPrice || "$199.00"}
                                            onSave={(val: string) => handleConfigSave({ homeFeaturedPrice: val })}
                                            isPreview={isPreview}
                                            label="Featured Price"
                                        />
                                    </p>
                                </div>

                                <div className="flex-1 flex items-center justify-center py-10 relative">
                                    <EditableImage
                                        src={config.homeFeaturedImage || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400"}
                                        onSave={(url: string) => handleConfigSave({ homeFeaturedImage: url })}
                                        isPreview={isPreview}
                                        className="max-w-full mix-blend-screen hover:scale-110 transition-transform duration-700"
                                    />
                                </div>

                                <button
                                    onClick={() => handleBuyNow(products[2])}
                                    className="w-full py-4 bg-white text-gray-950 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all shadow-xl hover:-translate-y-1 active:scale-95 group"
                                >
                                    <ShoppingCart className="w-4 h-4 text-brand" />
                                    <EditableText
                                        value={config.homeFeaturedButton || "Secure Now"}
                                        onSave={(val: string) => handleConfigSave({ homeFeaturedButton: val })}
                                        isPreview={isPreview}
                                        label="Button Text"
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Product Tabs & Grid */}
                        <div className="lg:w-3/4">
                            <div className="flex items-center justify-between mb-8 border-b border-gray-200 text-left">
                                <h2 className="text-xl font-black text-gray-900 pb-4 border-b-2 border-brand">
                                    <EditableText
                                        value={config.homePopularHeader || "Popular Selects"}
                                        onSave={(val: string) => handleConfigSave({ homePopularHeader: val })}
                                        isPreview={isPreview}
                                        label="Popular Header"
                                    />
                                </h2>
                                <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    {['Digital Devices', 'Smart Watches', 'Smartphones'].map((tab, idx) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`pb-4 border-b-2 transition-all ${activeTab === tab ? 'text-brand border-brand' : 'border-transparent hover:text-gray-900'}`}
                                        >
                                            <EditableText
                                                value={config[`homeTab${idx + 1}`] || tab}
                                                onSave={(val: string) => handleConfigSave({ [`homeTab${idx + 1}`]: val })}
                                                isPreview={isPreview}
                                                label={`Tab ${idx + 1}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                                {(filteredProducts.length > 0 ? filteredProducts : products.slice(0, 8)).map((product) => (
                                    <ElectshopProductCard
                                        key={product.id}
                                        product={product}
                                        subdomain={subdomain}
                                        storeId={store.id}
                                        isPreview={isPreview}
                                        onConfigChange={onConfigChange}
                                        store={store}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </SectionWrapper>

            {/* Promo Banner Grid */}
            <SectionWrapper id="promo-grid">
                <section className="max-w-7xl mx-auto px-4 mt-20 mb-12 lg:mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <BannerItem
                            title={
                                <EditableText
                                    value={config.homeBanner1Title || "Vision Pro X"}
                                    onSave={(val: string) => handleConfigSave({ homeBanner1Title: val })}
                                    isPreview={isPreview}
                                    label="Banner Title 1"
                                />
                            }
                            price={
                                <EditableText
                                    value={config.homeBanner1Price || "$499.00"}
                                    onSave={(val: string) => handleConfigSave({ homeBanner1Price: val })}
                                    isPreview={isPreview}
                                    label="Banner Price 1"
                                />
                            }
                            image={config.homeBanner1Image || "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&q=80&w=600"}
                            onSaveImage={(url: string) => handleConfigSave({ homeBanner1Image: url })}
                            bg="bg-[#f0f9ff]"
                            onShop={() => handleBuyNow(products[0])}
                            isPreview={isPreview}
                        />
                        <BannerItem
                            title={
                                <EditableText
                                    value={config.homeBanner2Title || "Series 9 Watch"}
                                    onSave={(val: string) => handleConfigSave({ homeBanner2Title: val })}
                                    isPreview={isPreview}
                                    label="Banner Title 2"
                                />
                            }
                            price={
                                <EditableText
                                    value={config.homeBanner2Price || "$399.00"}
                                    onSave={(val: string) => handleConfigSave({ homeBanner2Price: val })}
                                    isPreview={isPreview}
                                    label="Banner Price 2"
                                />
                            }
                            image={config.homeBanner2Image || "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600"}
                            onSaveImage={(url: string) => handleConfigSave({ homeBanner2Image: url })}
                            bg="bg-[#fff9f0]"
                            onShop={() => handleBuyNow(products[1])}
                            isPreview={isPreview}
                        />
                        <BannerItem
                            title={
                                <EditableText
                                    value={config.homeBanner3Title || "Studio Max"}
                                    onSave={(val: string) => handleConfigSave({ homeBanner3Title: val })}
                                    isPreview={isPreview}
                                    label="Banner Title 3"
                                />
                            }
                            price={
                                <EditableText
                                    value={config.homeBanner3Price || "$549.00"}
                                    onSave={(val: string) => handleConfigSave({ homeBanner3Price: val })}
                                    isPreview={isPreview}
                                    label="Banner Price 3"
                                />
                            }
                            image={config.homeBanner3Image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600"}
                            onSaveImage={(url: string) => handleConfigSave({ homeBanner3Image: url })}
                            bg="bg-[#fdf2f8]"
                            onShop={() => handleBuyNow(products[2])}
                            isPreview={isPreview}
                        />
                    </div>
                </section>
            </SectionWrapper>
        </div>
    );
}

function BannerItem({ title, price, image, bg, onShop, isPreview, onSaveImage }: any) {
    return (
        <div className={`${bg} rounded-[2rem] p-8 flex flex-col justify-center border border-gray-100/30 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden relative h-[220px]`}>
            <div className="relative z-10 space-y-3 w-1/2">
                <h3 className="text-lg font-black text-gray-900 leading-tight uppercase italic tracking-tighter">{title}</h3>
                <p className="text-brand font-black italic tracking-tighter text-sm flex items-center gap-1">
                    <EditableText
                        value={isPreview ? 'From ' : ''}
                        onSave={() => { }} // Just for visual in editor
                        isPreview={isPreview}
                        label="From Prefix"
                    />
                    {!isPreview && 'From '}
                    {price}
                </p>
                <button
                    onClick={onShop}
                    className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 group-hover:border-brand group-hover:text-brand transition-all"
                >
                    <EditableText
                        value={isPreview ? 'Shop Now' : ''}
                        onSave={() => { }}
                        isPreview={isPreview}
                        label="Shop Now Label"
                    />
                    {!isPreview && 'Shop Now'}
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-3/5 h-[80%]">
                <EditableImage
                    src={image}
                    onSave={onSaveImage}
                    isPreview={isPreview}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                />
            </div>
        </div>
    );
}

function ServiceItem({ icon, title, desc }: { icon: React.ReactNode; title: React.ReactNode, desc: React.ReactNode }) {
    return (
        <div className="flex items-center gap-4 px-4 py-2">
            <div className="shrink-0">{icon}</div>
            <div className="text-left">
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-tighter leading-none mb-1">{title}</h4>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none">{desc}</p>
            </div>
        </div>
    );
}

function PromoBanner({ title, subtitle, price, image, bgColor, onBuyNow, brandColor, isPreview, onSaveImage }: any) {
    return (
        <div className={`${bgColor} rounded-[2rem] p-8 lg:p-12 flex items-center justify-between group hover:shadow-xl transition-all duration-500 border border-gray-100/50 overflow-hidden relative min-h-[280px]`}>
            <div className="space-y-4 relative z-10 w-1/2 text-left">
                {subtitle && <span className="text-[10px] lg:text-[12px] font-black uppercase tracking-[0.3em] text-gray-400">{subtitle}</span>}
                <h3 className="text-3xl lg:text-4xl font-black text-gray-900 leading-[0.95] uppercase italic tracking-tighter">{title}</h3>
                <div className="flex items-center gap-4 pt-4">
                    <span className="text-xl lg:text-3xl font-black italic tracking-tighter flex items-center gap-1" style={{ color: brandColor }}>
                        <EditableText
                            value={isPreview ? 'Only ' : ''}
                            onSave={() => { }}
                            isPreview={isPreview}
                            label="Only Prefix"
                        />
                        {!isPreview && 'Only '}
                        {price}
                    </span>
                    <button
                        onClick={onBuyNow}
                        className="w-12 h-12 bg-white text-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-brand hover:text-white transition-all transform hover:scale-110"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
            <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-[70%] h-[120%]">
                <EditableImage
                    src={image}
                    onSave={onSaveImage}
                    isPreview={isPreview}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
            </div>
        </div>
    );
}

function TimeBlock({ label, val }: { label: string; val: string }) {
    return (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 min-w-[70px] text-center shadow-sm">
            <p className="text-2xl font-black text-gray-900 italic tracking-tighter mb-1">{val}</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        </div>
    );
}

function TimeBlockMini({ label, val }: { label: string; val: string }) {
    return (
        <div className="bg-gray-50 border border-gray-100 rounded-lg py-1 px-2 flex items-center gap-1.5 min-w-[35px]">
            <span className="text-[10px] font-black text-gray-950 leading-none">{val}</span>
            <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest leading-none">{label}</span>
        </div>
    );
}

function CategoryItem({ title, icon, count }: { title: string; icon: string; count: string }) {
    return (
        <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-xl hover:border-brand/20 transition-all duration-300 group cursor-pointer">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
            <h5 className="text-[11px] font-black text-gray-800 uppercase tracking-widest mb-1 group-hover-text-brand transition-colors">{title}</h5>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">{count}</p>
        </div>
    );
}
