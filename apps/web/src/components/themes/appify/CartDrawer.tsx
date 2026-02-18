'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStoreCart } from '@/store/useStoreCart';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function AppifyCartDrawer({ storeId }: { storeId?: string }) {
    const { isOpen, toggleCart, updateQuantity, removeItem, storeItems: items, subtotal: total } = useStoreCart(storeId);
    const { subdomain } = useParams<{ subdomain: string }>();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={toggleCart}
                    />

                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-[40px] shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Pull Indicator */}
                        <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                        </div>

                        <div className="px-8 py-3 flex items-center justify-between shrink-0">
                            <h2 className="text-[18px] font-black text-[#1a1a2e]">Your Bag</h2>
                            <button onClick={toggleCart} className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Items Area */}
                        <div className="flex-grow overflow-y-auto px-8 py-4 space-y-5 custom-scrollbar pb-6">
                            {items.length === 0 ? (
                                <div className="text-center py-16 flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="w-8 h-8 text-gray-200" />
                                    </div>
                                    <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Bag is empty</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-20 h-20 bg-[#f4f6f8] rounded-[20px] overflow-hidden shrink-0 border border-gray-50">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow space-y-1.5">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-[13px] font-bold text-[#1a1a2e] leading-snug line-clamp-1">{item.name}</h3>
                                                <button onClick={() => removeItem(item.id, storeId)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <p className="text-[14px] font-black text-orange-500">{formatPrice(Number(item.price) || 0)}</p>

                                            <div className="flex items-center gap-4 bg-gray-50 w-fit px-2.5 py-1 rounded-lg border border-gray-100">
                                                <button
                                                    onClick={() => updateQuantity(item.id, (Number(item.quantity) || 1) - 1, storeId)}
                                                    className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-black disabled:opacity-30"
                                                    disabled={(Number(item.quantity) || 1) <= 1}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-[12px] font-black min-w-[16px] text-center text-[#1a1a2e]">
                                                    {Number(item.quantity) || 1}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, (Number(item.quantity) || 1) + 1, storeId)}
                                                    className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-black disabled:opacity-30"
                                                    disabled={(Number(item.quantity) || 1) >= (item.stock ?? 9999)}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Bottom Total & Checkout - Minimized */}
                        <div className="shrink-0 bg-white border-t border-gray-100 px-8 py-5 pb-8 sm:pb-5 space-y-3.5 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Subtotal</span>
                                <span className="text-[20px] font-black text-[#1a1a2e]">{formatPrice(total)}</span>
                            </div>
                            <Link
                                href={`/store/${subdomain}/checkout`}
                                onClick={toggleCart}
                                className={`w-full h-12 bg-[#0a0a0a] text-white rounded-xl flex items-center justify-center gap-2 font-black text-[13px] uppercase tracking-widest hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg ${items.length === 0 ? 'opacity-50 pointer-events-none grayscale' : ''}`}
                            >
                                Checkout
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
