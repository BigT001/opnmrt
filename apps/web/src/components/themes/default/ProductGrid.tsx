'use client';

import React from 'react';
import Link from 'next/link';
import { ProductGridProps, ProductData } from '../types';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export function DefaultProductGrid({ products, subdomain, storeId, hideHeader, hideControls }: ProductGridProps & { hideControls?: boolean }) {
    const { addItem } = useCartStore();

    const handleAddToCart = (product: ProductData) => {
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image || product.images?.[0] || undefined,
            storeId,
            stock: product.stock || 0,
        });
    };

    return (
        <div id="products-grid" className={`bg-[#fdfdfd] ${hideHeader ? 'py-0' : 'pt-12 md:pt-20 pb-0'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
                {!hideHeader && (
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div className="space-y-4 max-w-2xl">
                            <div className="w-12 h-1 bg-black" />
                            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">The Selection</h2>
                            <h3 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.9]">
                                Signature <br />Collections
                            </h3>
                        </div>
                        <div className="flex flex-col gap-4 text-right">
                            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Showing {products.length} Products</p>
                            {!hideControls && (
                                <div className="flex gap-3 justify-end">
                                    <button className="px-8 py-3 bg-white border border-gray-100 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-gray-50 transition-all shadow-sm">Filter</button>
                                    <button className="px-8 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl shadow-gray-200 hover:bg-black transition-all">All Items</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {products.length === 0 ? (
                    <div className="text-center py-40 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                        <p className="text-gray-300 font-black tracking-[0.2em] uppercase text-xs">Curating the next drop...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-10 gap-y-12 sm:gap-y-20">
                        {products.map((product) => (
                            <div key={product.id} className="group flex flex-col">
                                <Link href={`/store/${subdomain}/products/${product.slug || product.id}`} className="flex-1 flex flex-col gap-4 sm:gap-8">
                                    <div className="aspect-[3/4] w-full overflow-hidden bg-white rounded-2xl sm:rounded-[2.5rem] relative shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700">
                                        <img
                                            src={product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/800'}
                                            alt={product.name}
                                            className="h-full w-full object-cover origin-center group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute top-4 sm:top-8 right-4 sm:right-8 flex flex-col gap-3 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                            <div className="w-10 h-10 sm:w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-gray-900 hover:text-orange-500 transition-colors cursor-pointer">
                                                <Star className="w-4 h-4 sm:w-5 h-5" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 px-4 sm:px-8 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                            <div className="w-full py-3 sm:py-4 bg-white/95 backdrop-blur-xl text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-center text-gray-900 rounded-xl sm:rounded-2xl shadow-2xl">
                                                Quick View
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 sm:space-y-6 px-1 sm:px-2">
                                        <div className="space-y-1 sm:space-y-2">
                                            <h3 className="text-sm sm:text-lg md:text-xl font-black text-gray-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors duration-300 line-clamp-1">
                                                {product.name}
                                            </h3>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                                <span className="text-sm sm:text-lg font-black text-gray-900 tracking-tighter">
                                                    {formatPrice(product.price)}
                                                </span>
                                                <div className="hidden sm:block h-[2px] w-4 bg-gray-200" />
                                                <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] ${product.stock <= 5 ? 'text-orange-500' : 'text-gray-300'}`}>
                                                    {product.stock} In Stock
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </Link>

                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="mt-4 sm:mt-8 w-full group/btn relative"
                                >
                                    <div className="relative py-3 sm:py-4 bg-gray-900 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white overflow-hidden flex items-center justify-center gap-2 sm:gap-3 shadow-xl shadow-gray-200 transition-all duration-500 hover:bg-black hover:shadow-2xl hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                                        <ShoppingCart className="w-3.5 h-3.5 sm:w-4 h-4 relative z-10" />
                                        <span className="relative z-10">Add To Bag</span>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
