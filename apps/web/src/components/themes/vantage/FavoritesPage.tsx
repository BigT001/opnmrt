'use client';

import React from 'react';
import { PageProps } from '../types';
import { VantageProductGrid } from './ProductGrid';
import { Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const VantageFavoritesPage: React.FC<PageProps> = ({ store, products, subdomain }) => {
    // For demo purposes, we'll just show the first few products as "favorites"
    const favoriteProducts = products.slice(0, 3);

    return (
        <div className="pt-32 pb-20 bg-white min-h-screen">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="mb-20">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white shadow-2xl">
                            <Heart className="w-8 h-8 fill-current" />
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-gray-900 uppercase leading-[0.8]">
                            Wish <br /><span className="text-gray-300">Stack.</span>
                        </h1>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Your curated style selection.</p>
                </div>

                {favoriteProducts.length === 0 ? (
                    <div className="text-center py-40 border-2 border-dashed border-gray-100 rounded-[3rem] bg-gray-50/50">
                        <p className="text-gray-400 font-bold uppercase tracking-[0.3em] mb-10">Your Wish Stack is empty</p>
                        <Link
                            href={`/store/${subdomain}/shop`}
                            className="bg-black text-white px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-4 shadow-xl"
                        >
                            Explore Catalogue <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <VantageProductGrid
                        products={favoriteProducts}
                        subdomain={subdomain}
                        storeId={store.id}
                        store={store}
                        hideHeader={true}
                    />
                )}
            </div>
        </div>
    );
};
