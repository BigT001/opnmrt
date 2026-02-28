'use client';

import React from 'react';
import { ProductGridProps } from '../types';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import { useStoreCart } from '@/store/useStoreCart';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useWishlistStore } from '@/store/useWishlistStore';
import { EditableText } from '../EditableContent';

export function VantageProductGrid({ products, subdomain, storeId, hideHeader, hideControls, store, isPreview, onConfigChange }: ProductGridProps & { isPreview?: boolean; onConfigChange?: (cfg: any) => void }) {
    const { addItem, toggleCart } = useStoreCart(storeId);
    const { toggleItem, isInWishlist } = useWishlistStore();
    const [mounted, setMounted] = React.useState(false);
    const primaryColor = store?.primaryColor || '#000000';
    const config = store?.themeConfig || {};

    const handleSave = (key: string, value: string) => {
        onConfigChange?.({ [key]: value });
    };

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleToggleLike = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(product);
    };

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image || (product.images && product.images[0]),
            storeId: storeId,
            stock: product.stock || 0
        }, 1);
        toggleCart();
    };

    return (
        <section className="pt-6 lg:pt-24 pb-0 lg:pb-0 bg-white relative overflow-hidden">
            {/* ═══ LAYERED HEADER: SENIOR EDITORIAL STYLE ═══ */}
            {!hideHeader && (
                <div className="max-w-[1400px] mx-auto px-6 mb-16 lg:mb-24 text-center lg:text-left">
                    <div className="inline-block relative">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-[10px] font-black text-neutral-900/10 uppercase tracking-[0.6em] absolute -top-12 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 w-max"
                        >
                            <EditableText
                                value={config.catalogueBadge || 'The Catalogue'}
                                onSave={(val: string) => handleSave('catalogueBadge', val)}
                                isPreview={isPreview}
                                label="Catalogue Badge"
                            />
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-black text-neutral-900 tracking-tighter uppercase leading-[0.8]"
                        >
                            <EditableText
                                value={config.catalogueTitle || 'Curated Selections.'}
                                onSave={(val: string) => handleSave('catalogueTitle', val)}
                                isPreview={isPreview}
                                label="Catalogue Title"
                            />
                        </motion.h2>
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: 80 }}
                            className="h-1.5 mt-6 mx-auto lg:ml-0 rounded-full"
                            style={{ backgroundColor: primaryColor === '#000000' ? '#fef08a' : primaryColor }}
                        />
                    </div>
                </div>
            )}

            {/* ═══ LUXURY PRODUCT GRID ═══ */}
            <div className="max-w-[1400px] mx-auto px-2 lg:px-6 grid grid-cols-2 lg:grid-cols-4 gap-x-2 md:gap-x-10 gap-y-10 md:gap-y-20">
                {products.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.8 }}
                        className="group/card relative"
                    >
                        <Link href={`/store/${subdomain}/products/${product.slug || product.id}`} className="block">
                            {/* Image Container: Ultra-Clean rounded corners */}
                            <div className="aspect-[3/4] bg-neutral-50 rounded-[3rem] overflow-hidden relative shadow-none transition-all duration-700">
                                <img
                                    src={product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/600x800'}
                                    alt={product.name}
                                    className="w-full h-full object-cover grayscale-[0.2] group-hover/card:grayscale-0 group-hover/card:scale-110 transition-all duration-1000"
                                />

                                {/* Luxury Price Tag - Glassmorphism */}
                                <div className="absolute top-4 right-4 px-4 py-2 bg-white/70 backdrop-blur-md rounded-full text-[11px] font-black tracking-tight text-black border border-white/40 shadow-sm z-10">
                                    {formatPrice(product.price)}
                                </div>

                                {/* Like Button - Minimalist Accessory */}
                                <button
                                    onClick={(e) => handleToggleLike(e, product)}
                                    className="absolute top-4 left-4 p-2 transition-all active:scale-90 group/like z-10"
                                >
                                    <Heart
                                        className={`w-6 h-6 transition-all duration-300 drop-shadow-md ${mounted && isInWishlist(product.id) ? 'fill-red-500 text-red-500 scale-125' : 'text-white group-hover/like:text-red-500'}`}
                                    />
                                </button>

                                {/* Floating Action: Desktop Quick Add */}
                                <div className="absolute bottom-6 inset-x-6 translate-y-8 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 hidden lg:block">
                                    <button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        className="w-full text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-transform"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        Quick Add
                                        <div className="w-4 h-[1px] bg-white/20" />
                                        <ShoppingBag className="w-3 h-3" />
                                    </button>
                                </div>

                                {/* Mobile Interaction: Subtle Gradient Fade */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden" />
                            </div>

                            {/* Info: Centered & Intentional */}
                            <div className="mt-8 flex flex-col items-center text-center space-y-2">
                                <h3 className="text-[13px] font-black text-neutral-900 uppercase tracking-tighter leading-tight group-hover/card:text-neutral-500 transition-colors">
                                    {product.name}
                                </h3>
                                <div className="h-0.5 w-0 group-hover/card:w-8 transition-all duration-500" style={{ backgroundColor: primaryColor }} />
                            </div>

                            {/* Mobile Quick Add - High Visibility for Conversion */}
                            <div className="mt-6 lg:hidden">
                                <button
                                    onClick={(e) => handleAddToCart(e, product)}
                                    className="w-full text-white py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-transform"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    Add To Cart <ShoppingBag className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
