'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Check, ArrowUpRight } from 'lucide-react';
import { ProductGridProps, ProductData } from '../types';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '../EditableContent';

// ─── Product Card ─────────────────────────────────────────────────────────────

const ProductCardComponent = ({ product, subdomain, storeId, index = 0 }: { product: ProductData; subdomain: string; storeId: string; index?: number }) => {
    const { addItem } = useCartStore();
    const { toggleItem, isInWishlist } = useWishlistStore();
    const [mounted, setMounted] = React.useState(false);
    const [isAdded, setIsAdded] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => { setMounted(true); }, []);
    const isFavorite = mounted ? isInWishlist(product.id) : false;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        addItem({ ...product, image: product.image || product.images?.[0], storeId });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2200);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        toggleItem(product);
    };

    // Alternate card heights for a masonry-feel editorial grid
    const isTall = index % 3 === 1;

    return (
        <div
            className="group relative w-full overflow-hidden rounded-[28px] md:rounded-[36px] cursor-pointer transition-all duration-700 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/15"
            style={{ aspectRatio: isTall ? '3/4.5' : '3/4' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Full-bleed image */}
            <Link href={`/store/${subdomain}/products/${product.slug || product.id}`} className="absolute inset-0">
                <img
                    src={product.image || product.images?.[0] || 'https://via.placeholder.com/400x520'}
                    alt={product.name}
                    className="h-full w-full object-cover object-top transition-transform duration-[3s] ease-out group-hover:scale-110"
                />
            </Link>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Top: wishlist only (no category badge) */}
            <div className="absolute top-4 right-4 z-10">
                <motion.button
                    onClick={handleWishlist}
                    whileTap={{ scale: 0.85 }}
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg border backdrop-blur-xl ${isFavorite
                        ? 'bg-red-500 border-red-500/30 text-white shadow-red-500/30'
                        : 'bg-white/15 border-white/20 text-white hover:bg-red-500 hover:border-red-500'
                        }`}
                >
                    <Heart className={`h-3.5 w-3.5 transition-all ${isFavorite ? 'fill-current scale-110' : ''}`} />
                </motion.button>
            </div>

            {/* Hover: quick view sidebar */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-10 mt-6">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                >
                    <Link
                        href={`/store/${subdomain}/products/${product.slug || product.id}`}
                        className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-[#0a0a0a] transition-all shadow-lg"
                    >
                        <Eye className="w-3.5 h-3.5" />
                    </Link>
                </motion.div>
            </div>

            {/* Bottom info panel */}
            <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4 pt-3 space-y-3">
                <Link href={`/store/${subdomain}/products/${product.slug || product.id}`} className="block space-y-1">
                    <h3 className="text-[14px] md:text-[15px] font-black text-white tracking-tight leading-tight line-clamp-1 drop-shadow-sm">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="text-[15px] font-black text-white tracking-tighter">{formatPrice(product.price)}</span>
                        <span className="text-[11px] font-bold text-white/40 line-through tracking-wider">{formatPrice(product.price * 1.4)}</span>
                        <span className="ml-auto text-[9px] font-black text-orange-400 uppercase tracking-widest">
                            -{Math.round((1 - 1 / 1.4) * 100)}%
                        </span>
                    </div>
                </Link>

                <AnimatePresence mode="wait">
                    {isAdded ? (
                        <motion.div
                            key="added"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full h-12 rounded-2xl bg-green-500 flex items-center justify-center gap-3 text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-lg shadow-green-500/20"
                        >
                            <Check className="w-4 h-4" /> Added!
                        </motion.div>
                    ) : (
                        <motion.button
                            key="add"
                            initial={false}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            onClick={handleAdd}
                            whileTap={{ scale: 0.96 }}
                            className="w-full h-12 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 text-white text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 shadow-lg group/btn"
                        >
                            <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                            Add to Cart
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export const ProductCard = React.memo(ProductCardComponent);

// ─── Grid ─────────────────────────────────────────────────────────────────────

export function AppifyProductGrid({ products, subdomain, storeId, hideHeader, store, isPreview, onConfigChange }: ProductGridProps & { store?: any; isPreview?: boolean; onConfigChange?: (cfg: any) => void }) {
    const handleSave = (key: string, value: string) => {
        onConfigChange?.({ [key]: value });
    };

    return (
        <div id="products-grid" className={`px-5 py-2 pb-24 ${hideHeader ? 'pt-0' : ''}`}>
            {!hideHeader && (
                <div className="flex items-center justify-between mb-8 px-1">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em]">
                            <EditableText
                                value={store?.themeConfig?.featuredBadge || 'New Drop'}
                                onSave={(val) => handleSave('featuredBadge', val)}
                                isPreview={isPreview}
                                label="Section Badge"
                            />
                        </p>
                        <h3 className="text-[24px] font-black text-[#0a0a0a] uppercase italic tracking-tighter leading-none">
                            <EditableText
                                value={store?.themeConfig?.featuredTitle || 'Trending'}
                                onSave={(val) => handleSave('featuredTitle', val)}
                                isPreview={isPreview}
                                label="Section Title"
                            />
                        </h3>
                    </div>
                    <Link
                        href={`/store/${subdomain}/shop`}
                        className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#0a0a0a] transition-colors"
                    >
                        See All
                        <div className="w-7 h-7 rounded-full border border-gray-200 group-hover:border-gray-900 group-hover:bg-gray-900 group-hover:text-white flex items-center justify-center transition-all">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                    </Link>
                </div>
            )}

            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <ProductCard product={product} subdomain={subdomain} storeId={storeId} index={index} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
