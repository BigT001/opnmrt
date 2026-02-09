'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStoreCart } from '@/store/useStoreCart';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export function DefaultCartDrawer({ storeId }: { storeId?: string }) {
    const { isOpen, toggleCart, updateQuantity, removeItem, storeItems: items, subtotal: total } = useStoreCart(storeId);
    const { subdomain } = useParams<{ subdomain: string }>();

    if (!isOpen) return null;

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
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center gap-1 border border-gray-200 rounded-full p-1 bg-gray-50 h-8">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-900 shadow-sm disabled:opacity-30"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-xs font-black min-w-[24px] text-center text-gray-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-900 shadow-sm"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
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
                        <Link
                            href={`/store/${subdomain}/checkout`}
                            onClick={toggleCart}
                            className={`w-full py-4 bg-gray-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-black transition-all text-center flex items-center justify-center ${items.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
