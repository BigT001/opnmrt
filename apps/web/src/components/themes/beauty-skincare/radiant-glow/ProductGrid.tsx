'use client';

import { ProductGridProps } from '../../types';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Star, Eye, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

export function RadiantGlowProductGrid({ products, subdomain, storeId, hideHeader }: ProductGridProps) {
    const { addItem } = useCartStore();

    const handleAddToCart = (product: any) => {
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            storeId,
            stock: product.stock || 0,
        });
    };

    if (products.length === 0) {
        return (
            <div className={`max-w-[1400px] mx-auto px-10 ${hideHeader ? 'py-0' : 'py-32'}`}>
                <div className="text-center py-32 bg-white/40 backdrop-blur-xl rounded-[48px] border border-[#C19A6B]/10">
                    <p className="font-sans text-sm tracking-widest text-[#2D1E1E]/40 italic">The collection is currently gathering its light.</p>
                </div>
            </div>
        );
    }

    return (
        <section className={`max-w-[1400px] mx-auto px-10 ${hideHeader ? 'py-0' : 'py-32'}`}>
            {!hideHeader && (
                <div className="flex flex-col items-center gap-4 mb-20 text-center">
                    <div className="flex items-center gap-3 text-[#C19A6B]">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold">Curated Luminosity</span>
                    </div>
                    <h2 className="text-5xl font-luminous text-[#2D1E1E]">Treasures of the <span className="italic">Aura</span></h2>
                    <div className="w-12 h-[1px] bg-[#C19A6B]/30 mt-2" />
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                {products.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className="group relative"
                    >
                        {/* The Aura Card */}
                        <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden bg-white mb-6 border border-[#C19A6B]/5 shadow-[0_20px_60px_rgba(45,30,30,0.03)] transition-all duration-700 group-hover:shadow-[0_30px_80px_rgba(193,154,107,0.15)] group-hover:-translate-y-2 group-hover:border-[#C19A6B]/20">

                            {/* Product Image */}
                            <Link href={`/store/${subdomain}/products/${product.slug || product.id}`} className="block h-full">
                                <motion.img
                                    src={product.image || 'https://via.placeholder.com/600x800'}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition-all duration-1000 grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2D1E1E]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            </Link>

                            {/* Floating Badges */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                <div className="px-4 py-1.5 bg-white/60 backdrop-blur-md rounded-full border border-white/40 shadow-sm transition-transform duration-500 hover:scale-105">
                                    <span className="font-sans text-[8px] uppercase tracking-[0.2em] font-black text-[#2D1E1E]">Signature</span>
                                </div>
                            </div>

                            {/* Quick Actions (Hover) */}
                            <div className="absolute inset-x-6 bottom-6 flex items-center gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-[0.16,1,0.3,1]">
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="flex-1 h-14 bg-white text-[#2D1E1E] rounded-full flex items-center justify-center gap-3 font-sans text-[9px] uppercase tracking-[0.2em] font-black hover:bg-[#C19A6B] hover:text-white transition-all duration-500 shadow-xl"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Add to Bag
                                </button>
                                <button className="w-14 h-14 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white hover:text-[#2D1E1E] transition-all duration-500 border border-white/20">
                                    <Eye className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="px-2 space-y-2 text-center">
                            <div className="flex items-center justify-center gap-1 text-[#C19A6B]/40 hover:text-[#C19A6B] transition-colors mb-1">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-2 h-2 fill-current" />)}
                            </div>

                            <Link href={`/store/${subdomain}/products/${product.slug || product.id}`}>
                                <h3 className="text-xl font-luminous text-[#2D1E1E] transition-all duration-500 group-hover:text-[#C19A6B] line-clamp-1">
                                    {product.name}
                                </h3>
                            </Link>

                            <div className="flex flex-col items-center">
                                <span className="font-sans text-[11px] font-bold tracking-widest text-[#2D1E1E] pb-1">
                                    {formatPrice(product.price)}
                                </span>
                                <div className="h-[1px] w-0 bg-[#C19A6B] transition-all duration-700 group-hover:w-16" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {!hideHeader && (
                <div className="mt-32 flex justify-center">
                    <button className="group flex items-center gap-6 font-sans text-[10px] uppercase tracking-[0.5em] font-black text-[#C19A6B] hover:text-[#2D1E1E] transition-colors duration-500">
                        <div className="h-[1px] w-12 bg-[#C19A6B]/30 group-hover:w-20 group-hover:bg-[#2D1E1E] transition-all duration-700" />
                        Reveal Full Journey
                        <div className="h-[1px] w-12 bg-[#C19A6B]/30 group-hover:w-20 group-hover:bg-[#2D1E1E] transition-all duration-700" />
                    </button>
                </div>
            )}
        </section>
    );
}


