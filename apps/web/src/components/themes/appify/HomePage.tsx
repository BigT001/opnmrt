'use client';

import React from 'react';
import Link from 'next/link';
import { PageProps } from '../types';
import { AppifyNavbar } from './Navbar';
import { AppifyFooter } from './Footer';
import { ArrowRight, Star, ShieldCheck, Zap, Eye, X } from 'lucide-react';
import { ProductCard } from './ProductGrid';
import { motion } from 'framer-motion';

import { EditableText, EditableImage } from '../EditableContent';

export const AppifyHomePage: React.FC<PageProps> = ({ store, products, subdomain, isPreview, onConfigChange }) => {
    const [scrollY, setScrollY] = React.useState(0);
    const [isDesktop, setIsDesktop] = React.useState(false);

    const handleSave = (key: string, value: string) => {
        onConfigChange?.({ [key]: value });
    };

    React.useEffect(() => {
        const handleScroll = () => {
            if (isPreview) {
                // If in preview, we might be in an overflow container
                const container = document.querySelector('.no-scrollbar');
                if (container) setScrollY(container.scrollTop);
            } else {
                setScrollY(window.scrollY);
            }
        };
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        handleResize();

        const scrollTarget = isPreview ? document.querySelector('.no-scrollbar') : window;
        scrollTarget?.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            scrollTarget?.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [isPreview]);

    const isScrolled = scrollY > 50;
    const navbarHeight = isScrolled ? 56 : 132;

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

    return (
        <div className="relative min-h-screen bg-[#fafafa]">
            {/* 1. Hero Section - Robust flow for both Live and Studio */}
            {/* 1. Hero Section - Robust flow for both Live and Studio */}
            <SectionWrapper id="hero">
                <div className="relative w-full bg-[#0a0a0a] min-h-[70vh] md:min-h-[90vh] flex flex-col pt-20 md:pt-32">
                    <div className="absolute inset-0 z-0 h-full w-full">
                        <EditableImage
                            src={store.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"}
                            onSave={(url) => handleSave('heroImage', url)}
                            isPreview={isPreview}
                            className="w-full h-full object-cover opacity-90 transition-transform duration-[5s] hover:scale-110"
                            aspectRatio="none"
                            label="Hero Image"
                        />
                        {/* Immersive Gradients - Multi-layered for depth */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-black/20 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                    </div>

                    {/* Floating Brand Badge */}
                    <div className="relative z-10 px-8 md:px-32 lg:px-48 mb-12 hidden md:flex">
                        <div className="flex items-center gap-4 px-5 py-2.5 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full pointer-events-none">
                            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.9)] animate-pulse" />
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Signature Edition • {store.name}</span>
                        </div>
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center pointer-events-none">
                        <div className="pointer-events-auto max-w-6xl space-y-10">
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-4 opacity-40">
                                    <div className="h-px w-12 bg-white" />
                                    <span className="text-[11px] font-black text-white uppercase tracking-[0.5em]">Defining Elegance</span>
                                    <div className="h-px w-12 bg-white" />
                                </div>
                                <EditableText
                                    value={store.heroTitle || 'Defined by Style.'}
                                    onSave={(val) => handleSave('heroTitle', val)}
                                    isPreview={isPreview}
                                    className="text-6xl md:text-[140px] font-black text-white mb-8 leading-[0.8] tracking-[-0.05em] uppercase italic drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                                    label="Hero Title"
                                />
                            </div>
                            <div className="flex flex-col items-center gap-6">
                                <EditableText
                                    value={store.name}
                                    onSave={(val) => handleSave('name', val)}
                                    isPreview={isPreview}
                                    className="text-white/40 text-[12px] md:text-[18px] font-bold uppercase tracking-[1em] drop-shadow-md ml-[1em]"
                                    label="Store Name"
                                />
                                <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="relative z-10 pb-12 flex flex-col items-center gap-6 pointer-events-none">
                        <div className="flex flex-col items-center gap-2 group transition-all">
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.6em] mb-4">Discovery</span>
                            <div className="w-[1px] h-16 bg-gradient-to-b from-orange-500 via-orange-500/50 to-transparent" />
                        </div>
                    </div>
                </div>
            </SectionWrapper>

            {/* 2. Content Layer */}
            <main className="relative z-10 w-full -mt-[60px]">
                {/* The Sliding Content Section */}
                <div className="bg-white rounded-t-[50px] shadow-[0_-30px_60px_rgba(0,0,0,0.15)] ring-1 ring-black/5 overflow-hidden">

                    {/* The Brand Essence - MOBILE */}
                    <SectionWrapper id="brand-essence-mobile">
                        <section className="md:hidden px-5 pt-12 pb-2">
                            <div className="flex items-center justify-between gap-2 p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm">
                                <div className="flex-1 flex flex-col items-center gap-2 text-center">
                                    <Zap className="w-5 h-5 text-orange-500" />
                                    <div className="text-[10px] font-black text-[#0a0a0a] uppercase tracking-[0.2em]">Next Day</div>
                                    <div className="text-gray-400 text-[8px] font-bold uppercase tracking-widest leading-none">Global Logistix</div>
                                </div>
                                <div className="h-12 w-px bg-gray-100" />
                                <div className="flex-1 flex flex-col items-center gap-2 text-center">
                                    <ShieldCheck className="w-5 h-5 text-orange-500" />
                                    <div className="text-[10px] font-black text-[#0a0a0a] uppercase tracking-[0.2em]">Authentic</div>
                                    <div className="text-gray-400 text-[8px] font-bold uppercase tracking-widest leading-none">Verifed Style</div>
                                </div>
                                <div className="h-12 w-px bg-gray-100" />
                                <div className="flex-1 flex flex-col items-center gap-2 text-center">
                                    <div className="w-5 h-5 rounded-full border-2 border-orange-500 flex items-center justify-center text-orange-500 text-[8px] font-black">24</div>
                                    <div className="text-[10px] font-black text-[#0a0a0a] uppercase tracking-[0.2em]">Support</div>
                                    <div className="text-gray-400 text-[8px] font-bold uppercase tracking-widest leading-none">Always On</div>
                                </div>
                            </div>
                        </section>
                    </SectionWrapper>

                    {/* The Brand Essence - DESKTOP: Dramatic padding and elegant cards */}
                    <SectionWrapper id="brand-essence-desktop">
                        <section className="hidden md:block px-8 md:px-32 lg:px-64 pt-16 pb-4">
                            <div className="max-w-[1600px] mx-auto grid grid-cols-3 gap-6">
                                {/* Editorial Selection Card */}
                                <div className="relative group rounded-[32px] overflow-hidden aspect-[3/2] cursor-pointer shadow-xl hover:shadow-orange-500/10 transition-all duration-700">
                                    <EditableImage
                                        src={store.themeConfig?.essenceImage1 || "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop"}
                                        onSave={(val) => handleSave('essenceImage1', val)}
                                        isPreview={isPreview}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        label="Essence Image 1"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/20 to-transparent pointer-events-none" />
                                    <div className="absolute top-6 right-6 z-20">
                                        <div className="px-4 py-1.5 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full">
                                            <p className="text-[8px] font-black text-white uppercase tracking-[0.3em]">Selection 01</p>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-6 left-6 z-20 space-y-3">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.5em] italic">The Aesthetic</p>
                                            <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Superior<br />Textiles</h4>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                            <ArrowRight className="w-5 h-5 text-[#0a0a0a]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Precision Aesthetic Card */}
                                <div className="relative group rounded-[32px] overflow-hidden aspect-[3/2] cursor-pointer shadow-xl hover:shadow-orange-500/10 transition-all duration-700">
                                    <EditableImage
                                        src={store.themeConfig?.essenceImage2 || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop"}
                                        onSave={(val) => handleSave('essenceImage2', val)}
                                        isPreview={isPreview}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        label="Essence Image 2"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/20 to-transparent pointer-events-none" />
                                    <div className="absolute top-6 right-6 z-20">
                                        <div className="px-4 py-1.5 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full">
                                            <p className="text-[8px] font-black text-white uppercase tracking-[0.3em]">Selection 02</p>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-6 left-6 z-20 space-y-3">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.5em] italic">The Science</p>
                                            <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Precision<br />Design</h4>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                            <ArrowRight className="w-5 h-5 text-[#0a0a0a]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Archival Concepts Card */}
                                <div className="relative group rounded-[32px] overflow-hidden aspect-[3/2] cursor-pointer shadow-xl hover:shadow-orange-500/10 transition-all duration-700">
                                    <EditableImage
                                        src={store.themeConfig?.essenceImage3 || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop"}
                                        onSave={(val) => handleSave('essenceImage3', val)}
                                        isPreview={isPreview}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        label="Essence Image 3"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/20 to-transparent pointer-events-none" />
                                    <div className="absolute top-6 right-6 z-20">
                                        <div className="px-4 py-1.5 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full">
                                            <p className="text-[8px] font-black text-white uppercase tracking-[0.3em]">Selection 03</p>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-6 left-6 z-20 space-y-3">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.5em] italic">The Vision</p>
                                            <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Archival<br />Concepts</h4>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                            <ArrowRight className="w-5 h-5 text-[#0a0a0a]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </SectionWrapper>


                    {/* editorial Spotlight Section - New Premium Element */}
                    <SectionWrapper id="editorial-spotlight">
                        <section className="px-5 md:px-32 lg:px-64 py-8 md:py-16">
                            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-orange-500/10 rounded-[64px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    <div className="relative aspect-[3/4] rounded-[56px] overflow-hidden shadow-2xl">
                                        <img
                                            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop"
                                            alt="Spotlight"
                                            className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-12 left-12 right-12">
                                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-4">Vol. 01 Archive</p>
                                            <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">The Visionary<br />Collection</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-12">
                                    <div className="space-y-6">
                                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.6em]">Perspective</h3>
                                        <h2 className="text-5xl md:text-7xl font-black text-[#0a0a0a] uppercase italic tracking-tighter leading-[0.9]">
                                            Archival<br />Innovation
                                        </h2>
                                        <p className="text-lg md:text-xl font-medium text-gray-500 leading-relaxed max-w-lg">
                                            A dialogue between heritage and the future. Our design philosophy centers on the longevity of aesthetic and the integrity of form.
                                        </p>
                                    </div>
                                    <div className="hidden md:grid grid-cols-2 gap-8 py-8 border-y border-gray-100">
                                        <div>
                                            <p className="text-2xl font-black text-[#0a0a0a]">Sustainable</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Source Logic</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-[#0a0a0a]">Timeless</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Design DNA</p>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/store/${subdomain}/shop`}
                                        className="hidden md:inline-flex items-center gap-6 text-[12px] font-black uppercase tracking-[0.4em] text-[#0a0a0a] hover:text-orange-500 transition-colors"
                                    >
                                        Explore Theory
                                        <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </section>
                    </SectionWrapper>
                    <SectionWrapper id="featured-products">
                        <section className="px-5 md:px-32 lg:px-64 pb-12">
                            <div className="max-w-[1600px] mx-auto">
                                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 px-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-[2px] w-12 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
                                            <div className="text-[12px] font-black text-gray-400 uppercase tracking-[0.5em]">
                                                <EditableText
                                                    value={store.themeConfig?.featuredBadge || 'The Selection'}
                                                    onSave={(val) => handleSave('featuredBadge', val)}
                                                    isPreview={isPreview}
                                                    label="Section Badge"
                                                />
                                            </div>
                                        </div>
                                        <h3 className="text-4xl md:text-[84px] font-black text-[#0a0a0a] uppercase italic tracking-tighter leading-[0.8] drop-shadow-sm">
                                            <EditableText
                                                value={store.themeConfig?.featuredTitle || 'Trending\nProducts'}
                                                onSave={(val) => handleSave('featuredTitle', val)}
                                                isPreview={isPreview}
                                                multiline
                                                label="Section Title"
                                            />
                                        </h3>
                                    </div>
                                    <div className="flex flex-col items-center md:items-end gap-6">
                                        <p className="text-[14px] font-medium text-gray-400 max-w-sm text-center md:text-right uppercase tracking-tight">
                                            Meticulously crafted essentials designed for the discerning individual.
                                        </p>
                                        <Link
                                            href={`/store/${subdomain}/shop`}
                                            className="group flex items-center gap-5 px-10 py-5 bg-[#0a0a0a] rounded-full text-[12px] font-black uppercase tracking-[0.3em] transition-all hover:bg-orange-500 text-white active:scale-95 shadow-2xl shadow-black/10"
                                        >
                                            <EditableText
                                                value={store.themeConfig?.browseButtonText || 'View Collection'}
                                                onSave={(val) => handleSave('browseButtonText', val)}
                                                isPreview={isPreview}
                                                label="Button Text"
                                            />
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 px-2">
                                    {products.slice(0, 8).map((p, i) => (
                                        <ProductCard
                                            key={p.id}
                                            product={p}
                                            subdomain={subdomain}
                                            storeId={store.id}
                                            index={i}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Shop Discovery Card - Gigantic Immersive Banner */}
                            <div className="max-w-[1600px] mx-auto px-2 mt-24">
                                <div className="relative w-full aspect-[1/1] md:aspect-[2.5/1] rounded-[48px] overflow-hidden group shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-gray-100">
                                    <EditableImage
                                        src={store.themeConfig?.bannerImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop'}
                                        onSave={(val) => handleSave('bannerImage', val)}
                                        isPreview={isPreview}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
                                        label="Banner Image"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/40 to-transparent flex flex-col justify-center p-12 md:p-24 pointer-events-none">
                                        <div className="max-w-xl space-y-6 pointer-events-auto">
                                            <div className="text-[11px] font-black text-orange-500 uppercase tracking-[0.5em]">
                                                <EditableText
                                                    value={store.themeConfig?.bannerBadge || 'Exclusive Collection'}
                                                    onSave={(val) => handleSave('bannerBadge', val)}
                                                    isPreview={isPreview}
                                                    label="Banner Badge"
                                                />
                                            </div>
                                            <h4 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic leading-[0.9]">
                                                <EditableText
                                                    value={store.themeConfig?.bannerTitle || 'Elevate Your Daily Style.'}
                                                    onSave={(val) => handleSave('bannerTitle', val)}
                                                    isPreview={isPreview}
                                                    label="Banner Title"
                                                />
                                            </h4>
                                            <div className="pt-4 flex">
                                                <Link
                                                    href={`/store/${subdomain}/shop`}
                                                    className="flex items-center gap-4 px-10 py-5 bg-white text-[#0a0a0a] rounded-full text-[13px] font-black uppercase tracking-widest shadow-2xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 group-hover:-translate-y-1"
                                                >
                                                    <EditableText
                                                        value={store.themeConfig?.bannerButtonText || 'Shop the Selection'}
                                                        onSave={(val) => handleSave('bannerButtonText', val)}
                                                        isPreview={isPreview}
                                                        label="Button Text"
                                                    />
                                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </SectionWrapper>

                    <SectionWrapper id="footer-quotes">
                        <section className="bg-[#f8f9fb] py-24 rounded-b-[50px] mt-12 px-8 md:px-24 lg:px-48 border-t border-gray-100">
                            <div className="max-w-4xl mx-auto text-center space-y-8">
                                <div className="flex justify-center">
                                    <span className="px-6 py-2 bg-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 shadow-sm">
                                        <EditableText
                                            value={store.themeConfig?.quoteBadge || 'Since 2024'}
                                            onSave={(val) => handleSave('quoteBadge', val)}
                                            isPreview={isPreview}
                                            label="Quote Badge"
                                        />
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-[#0a0a0a] uppercase italic tracking-tighter leading-tight">
                                    <EditableText
                                        value={store.themeConfig?.quoteTitle || 'Quality standard for the modern individual.'}
                                        onSave={(val) => handleSave('quoteTitle', val)}
                                        isPreview={isPreview}
                                        label="Quote Title"
                                    />
                                </h2>
                                <div className="text-gray-400 text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
                                    <EditableText
                                        value={store.themeConfig?.quoteDescription || 'We believe that true style isn\'t just about what you wear, it\'s about the confidence and quality that defines your every move.'}
                                        onSave={(val) => handleSave('quoteDescription', val)}
                                        isPreview={isPreview}
                                        label="Quote Description"
                                    />
                                </div>
                            </div>
                        </section>
                    </SectionWrapper>
                </div>
            </main>
        </div>
    );
};
