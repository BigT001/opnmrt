'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Minus, Plus, ShoppingBag } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock?: number;
}

interface AddToCartButtonProps {
    product: Product;
    storeId: string;
}

export function AddToCartButton({ product, storeId }: AddToCartButtonProps) {
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);
    const setOpen = useCartStore((state) => state.setOpen);

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.images[0],
            storeId,
            stock: product.stock || 0,
        }, quantity);
        setOpen(true);
    };

    const isOutOfStock = (product.stock || 0) <= 0;

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium whitespace-nowrap">Quantity ({product.stock || 0} in stock)</span>
                <div className="flex items-center border border-gray-300 rounded-md bg-white">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={isOutOfStock}
                        className="p-2 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-30"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold text-gray-900">{isOutOfStock ? 0 : quantity}</span>
                    <button
                        onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                        disabled={isOutOfStock || quantity >= (product.stock || 0)}
                        className="p-2 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-30"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full bg-black text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-gray-900 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
            >
                <ShoppingBag className="w-5 h-5" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    );
}
