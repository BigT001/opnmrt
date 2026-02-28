'use client';

import React from 'react';
import { CartDrawerProps } from '../types';
import { useStoreCart } from '@/store/useStoreCart';
import { ShoppingCart, X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export function ElectshopCartDrawer({ storeId }: CartDrawerProps) {
    const { items, subtotal, isOpen, toggleCart, updateQuantity, removeItem } = useStoreCart(storeId || '');
    const { subdomain } = useParams<{ subdomain: string }>();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black/60 z-[1001] backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[1002] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center">
                                    <ShoppingCart className="w-6 h-6 text-brand" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Your Cart</h2>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{items.length} Items Selected</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleCart}
                                className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                        <ShoppingCart className="w-12 h-12 text-gray-200" />
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Cart is empty</h3>
                                    <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Start adding items to your shopping cart.</p>
                                    <button
                                        onClick={toggleCart}
                                        className="mt-8 px-8 py-4 bg-brand text-white rounded-xl font-bold uppercase tracking-widest text-[10px]"
                                    >
                                        Back to Store
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-6 group">
                                        <div className="w-24 h-24 bg-[#f8f9fa] rounded-2xl border border-gray-100 p-2 shrink-0 overflow-hidden relative">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight line-clamp-2 pr-4">{item.name}</h4>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-sm font-black text-brand mb-4 italic">{formatPrice(item.price)}</p>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black hover:bg-white rounded transition-all"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black hover:bg-white rounded transition-all"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-8 bg-gray-50 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Subtotal</p>
                                        <p className="text-3xl font-black text-black italic tracking-tighter">{formatPrice(subtotal)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Shipping</p>
                                        <p className="text-xs font-black text-gray-900 italic uppercase">Calculated at next step</p>
                                    </div>
                                </div>
                                <Link
                                    href={`/store/${subdomain}/checkout`}
                                    onClick={toggleCart}
                                    className="w-full h-16 bg-brand text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-brand/20 hover:brightness-95 transition-all flex items-center justify-center gap-3 group"
                                >
                                    Proceed to Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <p className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-6">
                                    Secure 256-bit SSL encrypted checkout
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
