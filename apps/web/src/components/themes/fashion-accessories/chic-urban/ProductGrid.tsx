'use client';

import React from 'react';
import { ProductGridProps } from '../../types';
import { ShoppingBag, Eye, Zap } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';

export function ChicUrbanProductGrid({ products, subdomain }: ProductGridProps) {
    const { addItem } = useCartStore();

    return (
        <div className="bg-white py-24">
            <div className="max-w-[1800px] mx-auto px-6">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 border-b-4 border-black pb-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="bg-black text-[#CCFF00] px-3 py-1 text-[10px] font-black uppercase tracking-widest font-mono">Archive_v2.0</span>
                            <span className="w-2 h-2 bg-black rotate-45" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Status: Operational</span>
                        </div>
                        <h2 className="text-8xl font-black uppercase italic tracking-tighter text-black leading-none">
                            The Drop
                        </h2>
                    </div>
                    <div className="flex items-center gap-6 font-mono text-[11px] font-black uppercase text-black italic">
                        <span>Items: [{products.length}]</span>
                        <Zap className="w-5 h-5 text-[#CCFF00] fill-black" />
                        <span>Filter: Select_All</span>
                    </div>
                </div>

                {/* Asymmetric Brutalist Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: (index % 4) * 0.1 }}
                            viewport={{ once: true }}
                            className={`group relative border-2 border-black p-4 transition-all duration-300 hover:bg-[#CCFF00] ${index % 5 === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                                }`}
                        >
                            {/* Product Image Container */}
                            <div className="relative aspect-[3/4] overflow-hidden border-2 border-black bg-gray-100">
                                <Link href={`/store/${subdomain}/products/${product.slug || product.id}`}>
                                    <img
                                        src={product.image || 'https://via.placeholder.com/400'}
                                        alt={product.name}
                                        className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    />
                                </Link>

                                {/* Glitch Overlays */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none mix-blend-difference bg-[#CCFF00]" />

                                {/* Status Tags */}
                                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                                    <span className="bg-black text-white text-[8px] font-black uppercase px-2 py-0.5 tracking-tighter">
                                        Verified Issue
                                    </span>
                                    {index % 3 === 0 && (
                                        <span className="bg-[#CCFF00] text-black text-[8px] font-black uppercase px-2 py-0.5 tracking-tighter animate-pulse">
                                            Limited Release
                                        </span>
                                    )}
                                </div>

                                {/* Tactical Quick Actions */}
                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => addItem({
                                                id: product.id,
                                                name: product.name,
                                                price: Number(product.price),
                                                image: product.image || undefined,
                                                storeId: subdomain // Using subdomain as temporary storeId fallback
                                            })}
                                            className="flex-1 bg-black text-white py-3 flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-colors"
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase font-mono">Initiate Acquire</span>
                                        </button>
                                        <Link
                                            href={`/store/${subdomain}/products/${product.slug || product.id}`}
                                            className="bg-white text-black p-3 hover:bg-black hover:text-white transition-colors border-2 border-black"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="mt-6 flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none group-hover:text-black transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-[10px] font-mono font-bold text-black/40 uppercase group-hover:text-black/60">
                                        Serial: CHC_{product.id.substring(0, 8)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-black italic tracking-tighter">
                                        {formatPrice(product.price)}
                                    </p>
                                    <p className="text-[10px] font-mono text-[#CCFF00] bg-black px-2 mt-1 inline-block">
                                        VAT_INCLUDED
                                    </p>
                                </div>
                            </div>

                            {/* Decorative Grid Lines */}
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-black opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-black opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}


