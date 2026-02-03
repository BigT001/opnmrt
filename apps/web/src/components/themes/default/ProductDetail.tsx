'use client';

import React from 'react';
import { ProductDetailProps } from '../types';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

export function DefaultProductDetail({ product, store, subdomain }: ProductDetailProps) {
    const { addItem } = useCartStore();

    return (
        <div className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-sm">
                        <img
                            src={product.image || 'https://via.placeholder.com/600'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col justify-center space-y-6">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
                            {product.name}
                        </h1>
                        <p className="text-3xl font-bold text-gray-900">
                            {formatPrice(product.price)}
                        </p>
                        <div className="prose prose-sm text-gray-500 max-w-none">
                            <p>{product.description || "Experience premium quality with this curated item."}</p>
                        </div>
                        <button
                            onClick={() => addItem({ ...product, price: Number(product.price), image: product.image || '', storeId: store.id })}
                            className="w-full py-5 bg-gray-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 hover:bg-black"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
