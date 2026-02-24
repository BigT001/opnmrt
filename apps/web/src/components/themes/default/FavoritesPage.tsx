'use client';

import React from 'react';
import { PageProps } from '../types';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';

export const DefaultFavoritesPage: React.FC<PageProps> = ({ store, subdomain }) => {
    const { items: wishlistItems } = useWishlistStore();
    const { addItem } = useCartStore();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const wishlistProducts = mounted ? wishlistItems : [];

    if (!mounted) {
        return <div className="min-h-screen bg-white" />;
    }

    return (
        <div className="bg-white min-h-screen pb-32">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 pt-20 pb-12 sm:px-6 lg:px-8">
                <div className="space-y-4">
                    <div className="w-12 h-1 bg-black" />
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter">My Favorites</h1>
                    <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em]">
                        {wishlistProducts.length} Saved Selections
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {wishlistProducts.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-10 gap-y-12 sm:gap-y-20">
                        {wishlistProducts.map((p) => (
                            <div key={p.id} className="group relative flex flex-col gap-8">
                                <Link href={`/store/${subdomain}/products/${p.id}`} className="block aspect-[3/4] rounded-2xl sm:rounded-[2.5rem] overflow-hidden bg-gray-50 shadow-sm group-hover:shadow-xl transition-all duration-700">
                                    <img
                                        src={p.image || 'https://via.placeholder.com/800'}
                                        alt={p.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                </Link>

                                <div className="space-y-4 sm:space-y-6">
                                    <div className="space-y-1 sm:space-y-2">
                                        <h3 className="text-sm sm:text-lg md:text-xl font-black text-gray-900 tracking-tight uppercase group-hover:text-primary transition-colors line-clamp-1">
                                            {p.name}
                                        </h3>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                            <span className="text-sm sm:text-lg font-black text-gray-900 tracking-tighter">
                                                {formatPrice(p.price)}
                                            </span>
                                            <div className="hidden sm:block h-[2px] w-4 bg-gray-200" />
                                            <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] ${p.stock <= 5 ? 'text-orange-500' : 'text-gray-300'}`}>
                                                {p.stock} In Stock
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => addItem({
                                            id: p.id,
                                            name: p.name,
                                            price: p.price,
                                            image: p.image || undefined,
                                            storeId: store.id,
                                            stock: p.stock
                                        })}
                                        className="mt-4 sm:mt-0 w-full group/btn relative"
                                    >
                                        <div className="relative py-3 sm:py-4 bg-gray-900 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white overflow-hidden flex items-center justify-center gap-2 sm:gap-3 shadow-xl shadow-gray-200 transition-all duration-500 hover:bg-black hover:shadow-2xl hover:-translate-y-1">
                                            <div className="absolute inset-0 bg-primary translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                                            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" />
                                            <span className="relative z-10">Add to Cart</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center space-y-8 bg-gray-50 rounded-[3rem] border border-gray-100">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto text-gray-200">
                            <Heart className="w-10 h-10" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl font-black text-gray-900 uppercase">Empty Wishlist</h3>
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                                You haven't saved any items yet. Explore our shop to find something special.
                            </p>
                        </div>
                        <Link
                            href={`/store/${subdomain}/shop`}
                            className="inline-flex items-center gap-4 bg-black text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all"
                        >
                            Return to Shop
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
