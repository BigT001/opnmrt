'use client';

import React from 'react';
import { PageProps } from '../types';
import { VantageHero } from './StorefrontHero';
import { VantageProductGrid } from './ProductGrid';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const VantageHomePage: React.FC<PageProps> = ({ store, products, subdomain, isPreview, onConfigChange }) => {
    return (
        <div className="pb-0 overflow-hidden">
            <VantageHero
                store={store}
                isPreview={isPreview}
                onConfigChange={onConfigChange}
            />

            <div className="py-4 lg:py-8 rotate-[-1deg] scale-110 relative z-10 my-0 lg:my-10" style={{ backgroundColor: store.primaryColor || '#000' }}>
                <div className="flex overflow-hidden whitespace-nowrap">
                    <div className="flex animate-marquee">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i} className="text-white text-3xl lg:text-5xl font-black uppercase tracking-tighter mx-10 italic">
                                Vantage Selection • Bold Fashion • Define Your Style • Urban Aesthetics • Premium Drops •
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <VantageProductGrid
                products={products}
                subdomain={subdomain}
                storeId={store.id}
                store={store}
                isPreview={isPreview}
                onConfigChange={onConfigChange}
                hideControls={true}
            />

            {/* Lookbook / Extra Section */}
            <section className="py-12 lg:py-24 bg-gray-50 mt-10">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Style Vision</span>
                                <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-[0.8]">
                                    The <br />Vantage <br />Look.
                                </h2>
                            </div>
                            <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-sm">
                                "Our collection is a dialogue between craftsmanship and the city. Each piece is designed to command attention and endure the rhythm of modern life."
                            </p>
                            <button className="flex items-center gap-4 group text-[10px] font-black uppercase tracking-[0.4em] text-black">
                                View Full Lookbook <div className="w-10 h-10 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: store.primaryColor || '#000' }}><ArrowRight className="w-4 h-4" /></div>
                            </button>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden rotate-2 shadow-2xl">
                                <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000" alt="Lookbook" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -left-4 -bottom-6 lg:-left-12 lg:-bottom-12 w-32 h-32 lg:w-56 lg:h-56 bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 lg:p-8 shadow-2xl -rotate-6 flex flex-col justify-center">
                                <p className="text-lg lg:text-2xl font-black italic tracking-tighter uppercase leading-none mb-2 text-black text-left">Crafted <br /> For <br /> Leaders.</p>
                                <div className="h-1 w-6 lg:w-10 bg-black" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
