'use client';

import React from 'react';
import Link from 'next/link';
import { ProductGridProps, ProductData } from '../types';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export function DefaultProductGrid({ products, subdomain, storeId, hideHeader }: ProductGridProps) {
    const { addItem } = useCartStore();

    const handleAddToCart = (product: ProductData) => {
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image ?? undefined,
            storeId,
            stock: product.stock || 0,
        });
    };

    return (
        <div id="products-grid" className={`bg-white ${hideHeader ? 'py-0' : 'py-12 md:py-24'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {!hideHeader && (
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-100">
                        <div>
                            <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-3">Today's Picks</h2>
                            <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Featured Products</h3>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-6 py-3 bg-gray-50 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-gray-100 transition-all">Trending</button>
                            <button className="px-6 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-gray-200 transition-all">Latest</button>
                        </div>
                    </div>
                )}

                {products.length === 0 ? (
                    <div className="text-center py-32 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold tracking-tight uppercase text-sm">New collections are on the way.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {products.map((product) => (
                            <div key={product.id} className="group flex flex-col">
                                <Link href={`/store/${subdomain}/products/${product.slug || product.id}`} className="flex-1 flex flex-col gap-6">
                                    <div className="aspect-[4/5] w-full overflow-hidden bg-gray-50 rounded-[1.5rem] relative group-hover:shadow-2xl group-hover:shadow-gray-200 transition-all duration-500">
                                        <img
                                            src={product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/400'}
                                            alt={product.name}
                                            className="h-full w-full object-cover origin-bottom group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="p-2 bg-white rounded-full shadow-lg text-gray-900 hover:text-primary transition-colors">
                                                <Star className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-4 left-4">
                                            <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-gray-900 rounded-full shadow-sm">
                                                {formatPrice(product.price)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400">(4.0)</span>
                                        </div>
                                        <h3 className="text-lg font-black text-gray-900 group-hover:text-primary transition-colors leading-tight">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                            {product.description || "Experience perfection with this carefully selected premium product."}
                                        </p>
                                    </div>
                                </Link>

                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="mt-6 w-full py-4 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:bg-black rounded-xl flex items-center justify-center gap-2 group/btn"
                                >
                                    <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                    Add To Bag
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
