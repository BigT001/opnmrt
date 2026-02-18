'use client';

import React from 'react';
import { PageProps } from '../types';
import { ProductCard } from './ProductGrid';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const AppifyFavoritesPage: React.FC<PageProps> = ({ store, products, subdomain }) => {
    const { items: wishlistItems } = useWishlistStore();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Filter products that are in the wishlist - prioritizing store items for details
    const wishlistProducts = mounted ? wishlistItems : [];

    if (!mounted) {
        return (
            <div className="pb-6 bg-[#f8f9fb] min-h-screen">
                <div className="px-6 pt-10 pb-6">
                    <h1 className="text-3xl font-black text-[#1a1a2e] uppercase italic tracking-tighter">My Favorites</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-6 bg-[#f8f9fb] min-h-screen">
            <div className="px-6 pt-10 pb-6">
                <h1 className="text-3xl font-black text-[#1a1a2e] uppercase italic tracking-tighter">My Favorites</h1>
                <p className="text-gray-400 text-[12px] font-bold uppercase tracking-widest mt-1">
                    {wishlistProducts.length} {wishlistProducts.length === 1 ? 'Item' : 'Items'} Saved
                </p>
            </div>

            <div className="px-5">
                {wishlistProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                        {wishlistProducts.map((p) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                subdomain={subdomain}
                                storeId={store.id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center flex flex-col items-center gap-6">
                        <div className="w-24 h-24 bg-white rounded-[40px] shadow-xl shadow-gray-200/50 flex items-center justify-center text-gray-100">
                            <Heart className="w-12 h-12 fill-current" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-[#1a1a2e] uppercase italic tracking-tighter">Your wishlist is empty</h3>
                            <p className="text-sm text-gray-400 max-w-[240px] mx-auto leading-relaxed font-medium">
                                Save your favorite items here to find them easily later and build your style collection.
                            </p>
                        </div>
                        <Link
                            href={`/store/${subdomain}/shop`}
                            className="mt-4 bg-[#0a0a0a] text-white px-8 py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20 flex items-center gap-3 active:scale-95 transition-all"
                        >
                            Start Shopping
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
