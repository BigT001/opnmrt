'use client';

import React from 'react';
import Link from 'next/link';
import { PageProps } from '../types';
import { AppifyNavbar } from './Navbar';
import { AppifyFooter } from './Footer';
import { ArrowRight, Star, ShieldCheck, Zap } from 'lucide-react';
import { ProductCard } from './ProductGrid';

export const AppifyHomePage: React.FC<PageProps> = ({ store, products, subdomain }) => {
    const [scrollY, setScrollY] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isScrolled = scrollY > 50;
    const navbarHeight = isScrolled ? 56 : 132;

    return (
        <div className="relative min-h-screen">
            {/* 1. Stagnant Hero Layer - Fixed in background */}
            <div
                className="fixed inset-x-0 h-[60vh] md:h-[75vh] -z-10 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{ top: `${navbarHeight}px` }}
            >
                <img
                    src={store.heroImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop'}
                    className="w-full h-full object-cover"
                    alt={store.name}
                />
                {/* Immersive Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/40 via-transparent to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-4 leading-tight tracking-[0.1em] uppercase italic">
                        Defined by Style.
                    </h1>
                    <p className="text-white/60 text-[10px] md:text-[12px] font-bold uppercase tracking-[0.5em]">
                        {store.name}
                    </p>
                </div>
            </div>

            {/* 2. Scrollable Layer - Slides OVER the fixed hero */}
            <main className="relative z-10">
                {/* Transparent window to see the hero */}
                <div className="h-[45vh] md:h-[60vh] pointer-events-none" />

                {/* The Sliding Content Section */}
                <div className="bg-white rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.2)] pb-4">
                    {/* The Brand Essence */}
                    <section className="px-6 pt-10 pb-4">
                        <div className="flex items-center justify-between gap-4 p-4 bg-[#f8f9fb] rounded-[32px]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 shrink-0">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-[12px] font-black text-[#0a0a0a] uppercase tracking-tight">Express</h4>
                                    <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Delivery</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-gray-200" />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 shrink-0">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-[12px] font-black text-[#0a0a0a] uppercase tracking-tight">Pure</h4>
                                    <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Quality</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Featured Products Grid */}
                    <section className="px-5 pb-0">
                        <div className="flex items-center justify-between mb-8 px-1">
                            <h3 className="text-xl font-black text-[#0a0a0a] uppercase italic tracking-tighter">New Arrivals</h3>
                            <Link
                                href={`/store/${subdomain}/shop`}
                                className="bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-transform active:scale-95"
                            >
                                See All
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-10 mb-8 px-1">
                            {products.slice(0, 6).map((p) => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    subdomain={subdomain}
                                    storeId={store.id}
                                />
                            ))}
                        </div>

                        {/* Shop Discovery Card - The "Beautiful Card" connector */}
                        <div className="px-1 pb-4 mt-6">
                            <Link
                                href={`/store/${subdomain}/shop`}
                                className="relative block w-full aspect-[1/1] sm:aspect-[16/9] rounded-[40px] overflow-hidden group shadow-2xl shadow-black/10 transition-all active:scale-[0.98] border border-gray-100"
                            >
                                <img
                                    src={store.heroImage || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?q=80&w=2070&auto=format&fit=crop'}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt="Shop"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent opacity-90" />

                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 mb-6 group-hover:bg-orange-500 group-hover:border-orange-400 transition-all duration-500">
                                        <Zap className="w-8 h-8 text-white" />
                                    </div>
                                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-3">Discovery</p>
                                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-tight mb-6">
                                        Explore the<br />Full Collection
                                    </h4>
                                    <div className="flex items-center gap-3 px-6 py-3 bg-white text-[#0a0a0a] rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                                        Go to Shop
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>

                                {/* Decorative corner accent */}
                                <div className="absolute top-0 right-0 p-6">
                                    <div className="w-12 h-12 border-t-2 border-r-2 border-white/20 rounded-tr-3xl" />
                                </div>
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};
