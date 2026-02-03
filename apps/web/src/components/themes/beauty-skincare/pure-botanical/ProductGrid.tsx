'use client';

import { ProductGridProps } from '../../types';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

export function PureBotanicalProductGrid({ products, subdomain, storeId }: ProductGridProps) {
    const { addItem } = useCartStore();

    const handleAddToCart = (product: any) => {
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            storeId,
        });
    };

    if (products.length === 0) {
        return (
            <div className="max-w-[1400px] mx-auto px-10 py-32">
                <div className="text-center py-32 rounded-[40px] border-2 border-dashed border-[#7C9082]/20 bg-white/50">
                    <p className="font-serif italic text-2xl text-[#1C2B21]/40">No botanicals available in the collection yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-10 py-32 space-y-20">
            <div className="flex flex-col items-center gap-4 text-center">
                <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#7C9082] font-bold">Curated Selection</span>
                <h2 className="text-5xl md:text-6xl font-serif text-[#1C2B21] tracking-tight">Hand-picked <span className="italic text-[#7C9082]">Formations</span></h2>
                <div className="w-24 h-[1px] bg-[#7C9082]/30 mt-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative"
                    >
                        {/* Image Container */}
                        <div className="aspect-[4/5] rounded-[32px] overflow-hidden bg-[#F2EBE9]/50 relative shadow-sm group-hover:shadow-2xl group-hover:shadow-[#7C9082]/10 transition-all duration-700">
                            <Link href={`/store/${subdomain}/products/${product.slug || product.id}`} className="block h-full">
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    src={product.image || 'https://via.placeholder.com/600'}
                                    alt={product.name}
                                    className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                                />
                            </Link>

                            {/* Quick Actions Overlay */}
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center pointer-events-none">
                                <div className="flex gap-3 pointer-events-auto scale-90 group-hover:scale-100 transition-transform duration-500">
                                    <button className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#1C2B21] hover:bg-[#1C2B21] hover:text-white transition-all shadow-lg">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                    <Link
                                        href={`/store/${subdomain}/products/${product.slug || product.id}`}
                                        className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#1C2B21] hover:bg-[#1C2B21] hover:text-white transition-all shadow-lg"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>

                            {/* Organic Tag */}
                            <div className="absolute top-6 left-6 py-2 px-4 rounded-full bg-white/60 backdrop-blur-md border border-white/40 font-sans text-[10px] uppercase tracking-widest text-[#1C2B21] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                100% Pure
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="mt-8 space-y-3 text-center px-4">
                            <Link href={`/store/${subdomain}/products/${product.slug || product.id}`}>
                                <h3 className="font-serif text-xl text-[#1C2B21] group-hover:text-[#7C9082] transition-colors line-clamp-1">
                                    {product.name}
                                </h3>
                            </Link>

                            <div className="flex items-center justify-center gap-4">
                                <span className="font-sans text-sm font-bold text-[#1C2B21] tracking-widest">{formatPrice(product.price)}</span>
                                <div className="w-1 h-1 rounded-full bg-[#7C9082]/30" />
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#7C9082] hover:text-[#1C2B21] transition-colors relative group/btn"
                                >
                                    Add to Bag
                                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#1C2B21] transition-all group-hover/btn:w-full" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-center pt-20">
                <button className="px-16 py-5 rounded-full border border-[#1C2B21]/10 font-sans text-[11px] uppercase tracking-[0.3em] text-[#1C2B21] hover:bg-[#1C2B21] hover:text-white transition-all duration-700">
                    Discover More Botanicals
                </button>
            </div>
        </div>
    );
}


