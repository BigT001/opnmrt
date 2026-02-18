'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Heart, Plus, Check } from 'lucide-react';
import { ProductGridProps, ProductData } from '../types';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';

export function AppifyProductGrid({ products, subdomain, storeId, hideHeader }: ProductGridProps) {
    return (
        <div id="products-grid" className={`px-5 py-2 pb-24 ${hideHeader ? 'pt-0' : ''}`}>
            {!hideHeader && (
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[18px] font-bold text-[#1a1a2e]">Trending Product</h3>
                    <Link href={`/store/${subdomain}/shop`} className="text-[12px] font-medium text-gray-400 hover:text-[#1a1a2e]">
                        See all
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} subdomain={subdomain} storeId={storeId} />
                ))}
            </div>
        </div>
    );
}

export function ProductCard({ product, subdomain, storeId }: { product: ProductData; subdomain: string; storeId: string }) {
    const { addItem } = useCartStore();
    const { toggleItem, isInWishlist } = useWishlistStore();
    const [mounted, setMounted] = React.useState(false);
    const [isAdded, setIsAdded] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const isFavorite = mounted ? isInWishlist(product.id) : false;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({ ...product, image: product.image || undefined, storeId });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(product);
    };

    return (
        <div className="group flex flex-col gap-2">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] bg-[#f4f6f8]">
                <Link href={`/store/${subdomain}/products/${product.slug || product.id}`}>
                    <img
                        src={product.image || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />
                </Link>

                {/* Float Actions */}
                <div className="absolute right-3 top-3 flex flex-col gap-2">
                    <button
                        onClick={handleWishlist}
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition-all shadow-sm backdrop-blur-md ${isFavorite
                            ? 'bg-red-500 text-white'
                            : 'bg-white/80 text-gray-900 hover:text-red-500'
                            }`}
                    >
                        <Heart className={`h-4.5 w-4.5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2.5 px-1.5 flex-grow">
                <Link href={`/store/${subdomain}/products/${product.slug || product.id}`} className="flex flex-col gap-1">
                    <h3 className="text-[13px] font-bold text-[#1a1a2e] leading-snug line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[14px] font-black text-[#0a0a0a]">
                            {formatPrice(product.price)}
                        </span>
                        <span className="text-[11px] font-medium text-gray-400 line-through">
                            {formatPrice(product.price * 1.2)}
                        </span>
                    </div>
                </Link>

                <button
                    onClick={handleAdd}
                    className={`mt-auto w-full h-10 rounded-xl flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-sm ${isAdded
                        ? 'bg-green-500 text-white shadow-green-500/20'
                        : 'bg-[#0a0a0a] text-white hover:bg-gray-800'
                        }`}
                >
                    {isAdded ? (
                        <>
                            <Check className="h-3.5 w-3.5" />
                            Added
                        </>
                    ) : (
                        <>
                            <Plus className="h-3.5 w-3.5" />
                            Add to Cart
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
