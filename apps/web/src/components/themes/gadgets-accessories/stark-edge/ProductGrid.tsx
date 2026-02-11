'use client';

import { ProductGridProps } from '../../types';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { Zap, Plus, ArrowUpRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

export function StarkEdgeProductGrid({ products, subdomain, storeId, hideHeader }: ProductGridProps) {
    const { addItem } = useCartStore();

    const handleAddToCart = (product: any) => {
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            storeId,
            stock: product.stock || 0,
        }, 1);
    };

    if (products.length === 0) {
        return (
            <div className="max-w-[1400px] mx-auto px-10 py-32">
                <div className="border border-[#333] p-20 text-center space-y-4">
                    <Zap className="w-10 h-10 text-[#00F0FF] mx-auto opacity-20" />
                    <p className="font-data text-xs uppercase tracking-[0.3em] text-white/40">No Assets Detected in Vector Space</p>
                </div>
            </div>
        );
    }

    return (
        <section className={`max-w-[1400px] mx-auto px-10 ${hideHeader ? 'py-0' : 'py-32'}`}>
            {!hideHeader && (
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-l-4 border-[#00F0FF] pl-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[#00F0FF]">
                            <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-pulse" />
                            <span className="font-data text-[10px] uppercase tracking-[0.4em] font-bold">Scanning Inventory</span>
                        </div>
                        <h2 className="text-6xl font-tactical font-black text-white uppercase tracking-tighter">Current Assets</h2>
                    </div>
                    <div className="font-data text-[10px] text-white/40 uppercase tracking-widest bg-[#111] px-4 py-2 border border-[#333]">
                        Location: Global_Edge_Node_01
                    </div>
                </header>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#333] border border-[#333]">
                {products.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group relative bg-[#080808] overflow-hidden"
                    >
                        {/* Hover Border Tracing (Simulated via overlay) */}
                        <div className="absolute inset-x-0 top-0 h-[2px] bg-[#00F0FF] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20" />
                        <div className="absolute inset-y-0 right-0 w-[2px] bg-[#00F0FF] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top z-20" />

                        <Link href={`/store/${subdomain}/products/${product.slug || product.id}`} className="block relative aspect-[4/5] overflow-hidden">
                            <img
                                src={product.image || 'https://via.placeholder.com/400'}
                                alt={product.name}
                                className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-60 group-hover:opacity-100"
                            />

                            {/* Scanning Line Sweep */}
                            <div className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute top-0 w-full h-1 bg-[#00F0FF] shadow-[0_0_15px_#00F0FF] animate-[sweep_2s_linear_infinite]" />
                            </div>

                            {/* Tactical Model ID */}
                            <div className="absolute bottom-4 left-4 z-20 font-data text-[8px] text-[#00F0FF] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-black/80 px-2 py-1 border border-[#00F0FF]/20">
                                <span className="w-1 h-1 bg-[#00F0FF] rounded-full animate-pulse" />
                                MODEL_SERIES: {product.id.substring(0, 8).toUpperCase()}
                            </div>
                        </Link>

                        <div className="p-8 space-y-6 relative">
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-2">
                                        {['5G Ready', 'Ultra-Spec'].map((tag) => (
                                            <span key={tag} className="font-data text-[7px] text-[#00F0FF]/60 uppercase tracking-widest border border-[#00F0FF]/20 px-1.5 py-0.5">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <ArrowUpRight className="w-3 h-3 text-[#00F0FF] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </div>
                                <Link href={`/store/${subdomain}/products/${product.slug || product.id}`}>
                                    <h3 className="text-xl font-tactical font-black text-white hover:text-[#00F0FF] transition-colors leading-tight">
                                        {product.name}
                                    </h3>
                                </Link>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-[#333]">
                                <div className="space-y-1">
                                    <div className="text-[8px] font-data text-white/20 uppercase">Hardware Value</div>
                                    <p className="text-2xl font-data font-bold text-[#00F0FF]">
                                        {formatPrice(product.price)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="p-4 bg-white text-black hover:bg-[#00F0FF] transition-all transform active:scale-90"
                                    aria-label="Acquire Hardware"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <style jsx>{`
                @keyframes sweep {
                    0% { top: -10%; }
                    100% { top: 110%; }
                }
            `}</style>
        </section>
    );
}


