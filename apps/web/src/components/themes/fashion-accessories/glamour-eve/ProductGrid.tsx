'use client';

import { ProductGridProps } from '../../types';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

export function GlamourEveProductGrid({ products, subdomain, storeId, hideHeader }: ProductGridProps) {
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
            <div className="max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16 py-32">
                <div className="text-center py-40 bg-black/5 border border-black/10 rounded-3xl">
                    <p className="text-black/40 uppercase tracking-[0.2em] text-[10px] font-bold">The collection is currently being curated.</p>
                </div>
            </div>
        );
    }

    return (
        <section className={`bg-white ${hideHeader ? 'py-0' : 'py-32'}`}>
            <div className="max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16">
                {!hideHeader && (
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-[#D4AF37] uppercase tracking-[0.4em] text-[10px] font-black mb-4 block">
                                Le Catalogue
                            </span>
                            <h2 className="text-5xl md:text-7xl font-serif text-black leading-tight tracking-tighter">
                                New <br /><span className="italic text-[#D4AF37]">Arrivals</span>
                            </h2>
                        </motion.div>

                        <motion.p
                            className="max-w-md text-black/50 text-sm font-light leading-relaxed uppercase tracking-wider text-[11px]"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Our latest pieces draw inspiration from architectural silhouettes and timeless elegance. Each garment is a testament to the artisan's craft.
                        </motion.p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-20">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={`group cursor-pointer ${index % 3 === 1 ? 'md:mt-24' : ''
                                }`}
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-8">
                                <Link href={`/store/${subdomain}/products/${product.slug || product.id}`}>
                                    <motion.img
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        src={product.image || 'https://via.placeholder.com/600x800'}
                                        alt={product.name}
                                        className="h-full w-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                                    />
                                </Link>

                                {/* Quick Add Overlay */}
                                <motion.div
                                    className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                                >
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="w-full bg-[#D4AF37] text-black font-black uppercase tracking-[0.2em] text-[10px] py-4 flex items-center justify-center gap-3 hover:bg-white transition-colors"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        Add to Bag
                                    </button>
                                </motion.div>

                                {/* Badge */}
                                <div className="absolute top-6 left-6 p-3 bg-white/10 backdrop-blur-md border border-white/20">
                                    <span className="text-white text-[9px] font-black uppercase tracking-[0.2em]">New</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <Link href={`/store/${subdomain}/products/${product.slug || product.id}`}>
                                        <h3 className="text-xl font-serif text-black group-hover:text-[#D4AF37] transition-colors leading-snug">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <p className="text-lg font-bold text-black tracking-tight pt-1">
                                        {formatPrice(product.price)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 pt-2">
                                    <div className="h-[1px] w-8 bg-[#D4AF37] group-hover:w-20 transition-all duration-500" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 group-hover:text-black transition-colors">
                                        View Details
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {!hideHeader && (
                    <div className="mt-32 border-t border-black/5 flex justify-center">
                        <button className="px-16 py-8 bg-black text-white uppercase tracking-[0.4em] text-[11px] font-black mt-[-1px] hover:bg-[#D4AF37] hover:text-black transition-all">
                            View Entire Collection
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}


