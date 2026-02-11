'use client';

import React from 'react';
import { ProductDetailProps } from '../types';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

export function DefaultProductDetail({ product, store, subdomain }: ProductDetailProps) {
    const { addItem, setOpen } = useCartStore();
    const [quantity, setQuantity] = React.useState(1);

    const isOutOfStock = (product.stock || 0) <= 0;

    const handleAdd = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image ?? undefined,
            storeId: store.id,
            stock: product.stock || 0
        }, quantity);
        setOpen(true);
    };

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
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
                                {product.name}
                            </h1>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {isOutOfStock ? 'Sold Out' : `${product.stock} in stock`}
                            </p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                            {formatPrice(product.price)}
                        </p>
                        <div className="prose prose-sm text-gray-500 max-w-none">
                            <p>{product.description || "Experience premium quality with this curated item."}</p>
                        </div>

                        {!isOutOfStock && (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-12">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 hover:bg-gray-50 text-gray-500 transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                                        className="px-4 hover:bg-gray-50 text-gray-500 transition-colors"
                                        disabled={quantity >= (product.stock || 0)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleAdd}
                            disabled={isOutOfStock}
                            className="w-full py-5 bg-gray-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
