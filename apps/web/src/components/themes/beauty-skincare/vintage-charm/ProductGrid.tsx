'use client';

import { ProductGridProps } from '../../types';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

export function VintageCharmProductGrid({ products, subdomain, storeId, hideHeader }: ProductGridProps) {
    const { addItem } = useCartStore();

    if (products.length === 0) {
        return (
            <div className={`max-w-[1800px] mx-auto px-10 ${hideHeader ? 'py-0' : 'py-32'}`}>
                <div className="text-center py-20 border-[1px] border-[#1B3022]/10 vintage-border">
                    <p className="font-serif italic text-[#1B3022]/50">The archive is currently empty.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-[#F9F4EE] ${hideHeader ? 'py-0' : 'py-32'}`}>
            <div className="max-w-[1800px] mx-auto px-10">
                {/* Section Header */}
                {!hideHeader && (
                    <div className="text-center mb-24 space-y-4">
                        <span className="font-cursive text-3xl text-[#8B4513]">Hand-Picked</span>
                        <h2 className="text-5xl md:text-6xl font-black text-[#1B3022] tracking-tighter uppercase italic">
                            The Curated Archive
                        </h2>
                        <div className="w-24 h-[1px] bg-[#1B3022]/20 mx-auto mt-8" />
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group"
                        >
                            <div className="bg-white p-6 vintage-border shadow-[0_10px_40px_rgba(27,48,34,0.05)] group-hover:shadow-[0_20px_60px_rgba(27,48,34,0.1)] transition-all duration-500">
                                {/* Image Archive */}
                                <div className="relative aspect-[4/5] overflow-hidden border border-[#1B3022]/10 group-hover:border-[#1B3022]/30 transition-colors bg-[#F9F4EE]/50">
                                    <Link href={`/store/${subdomain}/products/${product.slug || product.id}`}>
                                        <img
                                            src={product.image || 'https://via.placeholder.com/400'}
                                            alt={product.name}
                                            className="h-full w-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                                        />
                                    </Link>

                                    {/* Product Actions Overlays */}
                                    <div className="absolute inset-0 bg-[#1B3022]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                    <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                                        <button className="bg-white p-3 shadow-lg hover:bg-[#1B3022] hover:text-white transition-colors">
                                            <Heart className="w-4 h-4" />
                                        </button>
                                        <Link
                                            href={`/store/${subdomain}/products/${product.slug || product.id}`}
                                            className="bg-white p-3 shadow-lg hover:bg-[#1B3022] hover:text-white transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Labeling */}
                                <div className="mt-8 space-y-4 text-center">
                                    <div className="space-y-1">
                                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#8B4513]/60 block">
                                            Archive_No. {index + 101} // {product.id.substring(0, 6)}
                                        </span>
                                        <Link href={`/store/${subdomain}/products/${product.slug || product.id}`}>
                                            <h3 className="text-2xl font-black text-[#1B3022] tracking-tighter uppercase italic leading-none group-hover:text-[#8B4513] transition-colors">
                                                {product.name}
                                            </h3>
                                        </Link>
                                    </div>

                                    <p className="text-xl font-serif italic text-[#1B3022]/70">
                                        {formatPrice(product.price)}
                                    </p>

                                    <div className="pt-4">
                                        <button
                                            onClick={() => addItem({
                                                id: product.id,
                                                name: product.name,
                                                price: Number(product.price),
                                                image: product.image || undefined,
                                                storeId: storeId,
                                                stock: product.stock || 0,
                                            })}
                                            className="w-full border border-[#1B3022] py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1B3022] hover:bg-[#1B3022] hover:text-[#F9F4EE] transition-all flex items-center justify-center gap-3"
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            Acquire Item
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}


