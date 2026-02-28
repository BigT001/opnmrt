'use client';

import React from 'react';
import { PageProps } from '../types';
import { useWishlistStore } from '@/store/useWishlistStore';
import { ElectshopProductGrid } from './ProductGrid';
import { Heart } from 'lucide-react';

export function ElectshopFavoritesPage({ store, subdomain, isPreview }: PageProps) {
    const { items: wishlistItems } = useWishlistStore();

    return (
        <div className="bg-[#f8f9fa] min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4">
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
                        <Heart className="w-12 h-12 text-red-500 fill-red-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Your Wishlist</h1>
                        <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">
                            {wishlistItems.length} Products Saved for later
                        </p>
                    </div>
                </div>

                {wishlistItems.length > 0 ? (
                    <ElectshopProductGrid
                        products={wishlistItems as any}
                        subdomain={subdomain}
                        storeId={store.id}
                        store={store}
                        isPreview={isPreview}
                        hideHeader
                    />
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-gray-500 font-medium">Your wishlist is currently empty.</p>
                        <button className="mt-8 px-10 py-4 bg-brand text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand/20">
                            Explore Products
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
