'use client';

import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    category?: string;
    stock?: number;
}

interface ProductCardProps {
    product: Product;
    storeId: string;
    subdomain: string;
}

export function ProductCard({ product, storeId, subdomain }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);

    const [productUrl, setProductUrl] = useState(`/store/${subdomain}/products/${product.id}`);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            // Check if we are on a subdomain (e.g., samstar.localhost or samstar.opnmart.com)
            const isSubdomain = hostname.includes(subdomain) && (hostname.includes('localhost') || hostname.includes('opnmart.com'));

            if (isSubdomain) {
                // If on subdomain, use direct path
                setProductUrl(`/products/${product.id}`);
            }
        }
    }, [subdomain, product.id]);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to product details if clicked
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            storeId,
            stock: product.stock || 0,
        });
    };

    return (
        <Link
            href={productUrl}
            className="group relative flex flex-col overflow-hidden rounded-xl bg-white border border-gray-100 hover:shadow-xl transition-all duration-300"
        >
            <div className="aspect-square w-full overflow-hidden bg-gray-100 relative">
                {product.images[0] && (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                )}

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/50 to-transparent">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-white text-black font-semibold py-2 rounded-lg shadow-lg flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                    </button>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-4 space-y-2">
                {product.category && (
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{product.category}</span>
                )}
                <h3 className="text-gray-900 font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                    {product.name}
                </h3>

                <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">${Number(product.price).toFixed(2)}</span>
                </div>
            </div>
        </Link>
    );
}
