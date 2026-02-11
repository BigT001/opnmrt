'use client';

import { ProductGridProps } from '../../types';
import { ShoppingCart, Star, Zap, Eye, Heart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function NeonStreamProductGrid({ products, storeId, subdomain, hideHeader }: ProductGridProps) {
    const { addItem } = useCartStore();

    return (
        <section className={`px-6 max-w-[1400px] mx-auto ${hideHeader ? 'py-0' : 'py-24'}`}>
            {!hideHeader && (
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-[#00F5FF] rounded-full animate-ping" />
                            <span className="text-[10px] font-black font-syne tracking-[0.4em] text-[#00F5FF] uppercase">Active_Inventory</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black font-syne tracking-tighter uppercase italic text-white leading-none">
                            CORE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] to-[#BF00FF]">HARDWARE</span>
                        </h2>
                    </div>

                    <div className="flex gap-4">
                        {['ALL', 'PC', 'MOBILE', 'AUDIO'].map((tab) => (
                            <button key={tab} className="px-6 py-2 border border-white/10 text-[10px] font-black font-syne tracking-widest text-gray-500 hover:text-white hover:border-[#00F5FF] transition-all">
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative"
                    >
                        {/* Glow Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00F5FF]/0 to-[#BF00FF]/0 group-hover:from-[#00F5FF]/5 group-hover:to-[#BF00FF]/5 transition-all duration-500 rounded-3xl" />

                        <div className="relative bg-white/[0.03] border border-white/5 group-hover:border-[#00F5FF]/30 p-6 rounded-3xl transition-all duration-500 overflow-hidden h-full flex flex-col">
                            {/* Product Visual */}
                            <div className="aspect-square relative mb-8 overflow-hidden rounded-2xl bg-black/40">
                                <Link href={`/store/${subdomain}/products/${product.slug || product.id}`}>
                                    <img
                                        src={product.image || 'https://via.placeholder.com/400'}
                                        alt={product.name}
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                    />
                                </Link>

                                {/* Quick Actions Overlay */}
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 pointer-events-none group-hover:pointer-events-auto">
                                    <Link
                                        href={`/store/${subdomain}/products/${product.slug || product.id}`}
                                        className="w-12 h-12 bg-white/10 hover:bg-[#00F5FF] hover:text-black rounded-full flex items-center justify-center text-white transition-all"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </Link>
                                    <button className="w-12 h-12 bg-white/10 hover:bg-[#BF00FF] rounded-full flex items-center justify-center text-white transition-all">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Label */}
                                <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
                                    <span className="text-[8px] font-black text-white uppercase tracking-widest">STOCK_READY</span>
                                </div>
                            </div>

                            {/* Data */}
                            <div className="space-y-4 flex-grow flex flex-col justify-between">
                                <div className="space-y-1">
                                    <Link href={`/store/${subdomain}/products/${product.slug || product.id}`}>
                                        <h3 className="text-sm font-black font-syne uppercase tracking-tight text-white group-hover:text-[#00F5FF] transition-colors italic line-clamp-2">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-2.5 h-2.5 fill-[#00F5FF] text-[#00F5FF]" />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-4">
                                    <span className="text-xl font-black font-syne italic tracking-tighter text-white">
                                        {formatPrice(product.price)}
                                    </span>
                                    <button
                                        onClick={() => addItem({
                                            id: product.id,
                                            name: product.name,
                                            price: Number(product.price),
                                            image: product.image || undefined,
                                            storeId: storeId,
                                            stock: product.stock || 0,
                                        })}
                                        className="w-10 h-10 bg-white/5 border border-white/10 hover:bg-[#00F5FF] hover:text-black rounded-xl flex items-center justify-center transition-all group/btn shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                                    >
                                        <Zap className="w-5 h-5 group-hover/btn:fill-current" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Edge Decoration */}
                        <div className="absolute top-0 right-0 w-24 h-[1px] bg-gradient-to-r from-transparent to-[#00F5FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 w-24 h-[1px] bg-gradient-to-l from-transparent to-[#BF00FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
