'use client';

import React from 'react';
import { ProductGridProps } from '../../types';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Truck, Clock, RefreshCcw, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';

export function MinimalLuxeProductGrid({ products, subdomain, storeId, hideHeader }: ProductGridProps) {
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

    return (
        <div className="bg-white">
            {/* Features Section */}
            {!hideHeader && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <FeatureItem
                            icon={<Truck className="w-8 h-8 text-gray-900 stroke-[1.5]" />}
                            title="Global Shipping"
                            desc="Premium door-to-door delivery on all seasonal collections"
                        />
                        <FeatureItem
                            icon={<Clock className="w-8 h-8 text-gray-900 stroke-[1.5]" />}
                            title="Full Concierge"
                            desc="Dedicated support for a seamless luxury experience"
                        />
                        <FeatureItem
                            icon={<RefreshCcw className="w-8 h-8 text-gray-900 stroke-[1.5]" />}
                            title="Safe Returns"
                            desc="Flexible 30-day exchange policy for all items"
                        />
                    </div>
                </div>
            )}

            {/* Products Section */}
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${hideHeader ? 'py-0' : 'py-32'}`}>
                {!hideHeader && (
                    <div className="text-center mb-24">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block"
                        >
                            Collections
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl font-black text-gray-900 tracking-tighter uppercase relative inline-block"
                        >
                            New Arrival
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-gray-900"></div>
                        </motion.h2>
                    </div>
                )}

                {products.length === 0 ? (
                    <div className="text-center py-32 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
                        <p className="text-gray-400 font-medium tracking-tight">Elegance is arriving soon.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-20 gap-x-8">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.8 }}
                            >
                                <div className="group flex flex-col items-center">
                                    <Link href={`/store/${subdomain}/products/${product.slug || product.id}`} className="w-full">
                                        <div className="aspect-[4/5] w-full overflow-hidden bg-[#F9F9F9] relative mb-6 group-hover:shadow-2xl transition-all duration-700">
                                            <img
                                                src={product.image || 'https://via.placeholder.com/400'}
                                                alt={product.name}
                                                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                                            />
                                            {/* Minimal Badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 bg-white text-gray-900 text-[7px] font-black uppercase tracking-[0.3em] shadow-sm">
                                                    Limited
                                                </span>
                                            </div>

                                            {/* Soft Vignette Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        </div>
                                    </Link>

                                    <div className="w-full text-center space-y-4">
                                        <div className="flex flex-col items-center space-y-1">
                                            <span className="text-[8px] font-medium text-gray-400 uppercase tracking-[0.4em]">Minimal Luxe</span>
                                            <Link href={`/store/${subdomain}/products/${product.slug || product.id}`}>
                                                <h3 className="text-[13px] font-black text-gray-900 hover:text-primary transition-colors tracking-tight uppercase px-4 leading-tight">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                        </div>

                                        <div className="flex flex-col items-center space-y-4">
                                            <p className="text-[15px] font-black text-gray-900 tracking-tighter">
                                                {formatPrice(product.price)}
                                            </p>

                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="relative px-8 py-3.5 bg-gray-900 text-white text-[8px] font-black uppercase tracking-[0.3em] overflow-hidden group/btn transition-all duration-300 hover:shadow-xl active:scale-95"
                                            >
                                                <span className="relative z-10">Add to Collection</span>
                                                <div className="absolute inset-0 w-0 bg-primary transition-all duration-500 ease-out group-hover/btn:w-full opacity-20" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center space-y-5 group"
        >
            <div className="p-6 bg-gray-50 rounded-full transition-colors duration-500 group-hover:bg-primary/5">
                {icon}
            </div>
            <div className="space-y-2">
                <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em]">{title}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed max-w-[220px] font-medium">{desc}</p>
            </div>
        </motion.div>
    );
}

