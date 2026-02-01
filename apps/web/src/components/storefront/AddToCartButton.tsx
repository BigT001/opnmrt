'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Minus, Plus, ShoppingBag } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
}

interface AddToCartButtonProps {
    product: Product;
    storeId: string;
}

export function AddToCartButton({ product, storeId }: AddToCartButtonProps) {
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const currentItems = useCartStore((state) => state.items);

    // Check if item is already in cart to maybe sync quantity or just add more (logic decision: just add)
    // Actually, for a simple implementation, "Add to Cart" usually just adds the specified quantity.
    // My store `addItem` adds +1, so I might need to update the store to accept quantity or call it loop.
    // Checking store implementation: `addItem: (item)` -> finds existing -> quantity + 1. OR pushes new with quantity 1.
    // So my current store only supports adding 1 at a time. I should probably fix that or just loop. 
    // Looping is ugly. I'll just use loop for now or update store in a separate step if I was being perfect,
    // but to be fast I will just loop `addItem` calls OR better:
    // Update store logic to accept `quantity`.

    // Wait, let's fix the store logic first? No, I'll just call addItem multiple times or create a new store action?
    // Actually, let's just create a handleAddToCart that adds 1, then updates quantity immediately to the desired amount?
    // Or just loop. Loop is fine for small numbers.
    // Better: Update store to support optional quantity in addItem.

    // I'll stick to a simple "Add" button that adds `quantity` amount. 
    // Since I can't easily edit the store right now without re-writing it, 
    // and `addItem` logic is: `quantity: i.quantity + 1`.

    // I will use `updateQuantity` if it exists, or just add a loop.

    const handleAddToCart = () => {
        // Simple hack: Add one, then if quantity > 1, update it.
        // First check if it exists
        const existingItem = currentItems.find(i => i.id === product.id);

        let newQty = quantity;
        if (existingItem) {
            newQty = existingItem.quantity + quantity;
        }

        // Add item (triggers open cart)
        if (!existingItem) {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                storeId,
            });
            // If quantity > 1, update it immediately
            if (quantity > 1) {
                // We need to wait for state update? Zustand is synchronous usually.
                // But `addItem` sets state.
                // We can just call updateQuantity immediately after.
                useCartStore.getState().updateQuantity(product.id, quantity); // This overwrites to `quantity`?
                // No, updateQuantity sets absolute val.
                // So if it didn't exist, we added 1. We want `quantity`.
                useCartStore.getState().updateQuantity(product.id, quantity);
            }
        } else {
            // If it exists, we just update the quantity
            useCartStore.getState().updateQuantity(product.id, existingItem.quantity + quantity);
            useCartStore.getState().setOpen(true);
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Quantity</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-gray-900 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
            </button>
        </div>
    );
}
