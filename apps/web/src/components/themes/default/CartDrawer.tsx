'use client';

import React from 'react';
import { useCartStore } from '@/store/useCartStore';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export function DefaultCartDrawer() {
    const { isOpen, toggleCart, items, updateQuantity, removeItem } = useCartStore();

    if (!isOpen) return null;

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="fixed inset-0 z-[200] overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleCart} />
            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-gray-900" />
                            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Your Cart</h2>
                        </div>
                        <button onClick={toggleCart} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto px-6 py-6 space-y-6">
                        {items.length === 0 ? (
                            <div className="text-center py-20">
                                <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-400">Your cart is empty.</p>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-6">
                                    <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow space-y-2">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-sm font-bold text-gray-900 leading-tight">{item.name}</h3>
                                            <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-sm font-black text-gray-900">{formatPrice(item.price)}</p>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-1 hover:bg-gray-100 rounded">
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-100 rounded">
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="px-6 py-6 border-t border-gray-100 space-y-4 bg-gray-50/50">
                        <div className="flex justify-between items-center text-lg font-black text-gray-900">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                        <button
                            disabled={items.length === 0}
                            className="w-full py-4 bg-gray-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-black transition-all disabled:bg-gray-200"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
