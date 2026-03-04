'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye, Star, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useStoreCart } from '@/store/useStoreCart';
import { useWishlistStore } from '@/store/useWishlistStore';
import toast from 'react-hot-toast';
import { EditableText } from '../EditableContent';

interface ElectshopProductCardProps {
    product: any;
    subdomain: string;
    storeId: string;
    isPreview?: boolean;
    onConfigChange?: (cfg: any) => void;
    store?: any;
}

export function ElectshopProductCard({ product, subdomain, storeId, isPreview, onConfigChange, store }: ElectshopProductCardProps) {
    const config = store?.themeConfig || {};
    const handleSave = (key: string, value: string) => {
        onConfigChange?.({ [key]: value });
    };

    const { addItem } = useStoreCart(storeId);
    const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

    const isInWishlist = wishlistItems.some(item => String(item.id) === String(product.id));

    // Fix image fetching with fallbacks
    const productImage = product.image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800';

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({ ...product, image: productImage }, 1);
        toast.success(`${product.name} added to cart!`);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isInWishlist) {
            removeFromWishlist(product.id);
            toast.success('Removed from wishlist');
        } else {
            addToWishlist({ ...product, image: productImage });
            toast.success('Added to wishlist');
        }
    };

    return (
        <div className="theme-elect-card group relative flex flex-col bg-white rounded-[2.25rem] lg:rounded-[2.5rem] border border-gray-100/50 p-1.5 transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)] hover:-translate-y-2 overflow-hidden h-full">
            <style jsx>{`
                .theme-elect-card :global(.text-brand) { color: var(--elect-primary, #2874f0) !important; }
                .theme-elect-card :global(.bg-brand) { background-color: var(--elect-primary, #2874f0) !important; }
                .theme-elect-card :global(.hover-bg-brand:hover) { background-color: var(--elect-primary, #2874f0) !important; }
                .theme-elect-card :global(.group-hover-text-brand) { transition: color 0.3s; }
                .theme-elect-card:hover :global(.group-hover-text-brand) { color: var(--elect-primary, #2874f0) !important; }
            `}</style>

            {/* Edge-to-Edge Image Container */}
            <div className="relative aspect-[1/1.1] bg-[#f8f9fa] rounded-[1.8rem] lg:rounded-[2.1rem] overflow-hidden shrink-0">
                <Link href={`/store/${subdomain}/products/${product.slug || product.id}`} className="block w-full h-full">
                    <img
                        src={productImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ease-out"
                    />
                    {/* Subtle Overlay for better text legibility of badges if needed */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>

                {/* Stock Info Badge - Floating Overlay */}
                <div className="absolute top-4 left-4 z-10">
                    {product.stock > 0 ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/40">
                            <span className={`w-1.5 h-1.5 rounded-full ${product.stock <= 5 ? 'bg-orange-500' : 'bg-emerald-500 animate-pulse'}`} />
                            <span className="text-[8px] lg:text-[10px] font-black text-gray-950 uppercase tracking-widest leading-none">
                                {product.stock}
                            </span>
                        </div>
                    ) : (
                        <span className="px-2.5 py-1.5 bg-gray-950/80 backdrop-blur-md text-white text-[8px] lg:text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                            <EditableText
                                value={config.soldOutLabel || 'Sold Out'}
                                onSave={(val) => handleSave('soldOutLabel', val)}
                                isPreview={isPreview}
                                label="Sold Out Label"
                            />
                        </span>
                    )}
                </div>

                {/* Wishlist Button - Transparent Glass */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-4 right-4 w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center shadow-xl transition-all transform active:scale-90 z-10 ${isInWishlist ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/40 backdrop-blur-md text-gray-950 hover:bg-white hover:text-red-500'}`}
                >
                    <Heart className={`w-4.5 h-4.5 lg:w-5.5 lg:h-5.5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>

                {/* Desktop Action Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:flex items-center justify-center gap-3 z-20">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="w-14 h-14 bg-brand text-white rounded-[1.5rem] shadow-2xl flex items-center justify-center translate-y-6 group-hover:translate-y-0 transition-all duration-500 delay-75 disabled:opacity-50 hover:bg-black"
                    >
                        <ShoppingCart className="w-6 h-6" />
                    </button>
                    <Link
                        href={`/store/${subdomain}/products/${product.slug || product.id}`}
                        className="w-14 h-14 bg-white text-gray-950 rounded-[1.5rem] shadow-2xl flex items-center justify-center translate-y-6 group-hover:translate-y-0 transition-all duration-500 delay-150 hover:bg-gray-50"
                    >
                        <Eye className="w-6 h-6" />
                    </Link>
                </div>
            </div>

            {/* Content Area - Tightened Spacing */}
            <div className="flex-1 flex flex-col p-4 lg:p-5">
                <Link href={`/store/${subdomain}/products/${product.slug || product.id}`} className="mb-1.5 lg:mb-2 block">
                    <h4 className="text-[14px] lg:text-[17px] font-black text-gray-950 leading-[1.1] uppercase tracking-tighter line-clamp-1 group-hover-text-brand transition-colors">
                        {product.name}
                    </h4>
                </Link>

                <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3 lg:mb-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-0.5 mb-1 text-yellow-500">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} className="w-2.5 h-2.5 lg:w-3 h-3 fill-current" />
                                ))}
                            </div>
                            <span className="text-xl lg:text-[26px] font-black text-brand tracking-tighter italic leading-none">{formatPrice(product.price)}</span>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="hidden lg:flex w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl items-center justify-center hover-bg-brand hover:text-white transition-all duration-300 shadow-sm"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Mobile Integration - Prominent Touch Target */}
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="lg:hidden w-full h-12 bg-brand text-white rounded-[1.2rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-brand/10 disabled:opacity-50"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <EditableText
                            value={config.addToCartLabel || 'Add To Cart'}
                            onSave={(val) => handleSave('addToCartLabel', val)}
                            isPreview={isPreview}
                            label="Cart Button"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
