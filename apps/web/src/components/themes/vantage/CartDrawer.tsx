'use client';

import React from 'react';
import { useStoreCart } from '@/store/useStoreCart';
import { ShoppingBag, X, Minus, Plus, Trash2, ArrowRight, ShieldCheck, ChevronLeft } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export function VantageCartDrawer({ storeId }: { storeId: string }) {
    const { storeItems: items, subtotal, isOpen, toggleCart, updateQuantity, removeItem } = useStoreCart(storeId);
    const { subdomain } = useParams<{ subdomain: string }>();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                    />

                    {/* Cart Modal Container */}
                    <motion.div
                        initial={typeof window !== 'undefined' && window.innerWidth < 1024 ? { y: '100%', x: 0 } : { x: '100%', y: 0 }}
                        animate={{ x: 0, y: 0 }}
                        exit={typeof window !== 'undefined' && window.innerWidth < 1024 ? { y: '100%', x: 0 } : { x: '100%', y: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                        className="fixed right-0 bottom-0 top-0 lg:top-0 w-full lg:max-w-md bg-white z-[201] shadow-2xl flex flex-col rounded-t-[3rem] lg:rounded-t-none"
                    >
                        {/* Header */}
                        <div className="p-8 lg:p-10 border-b border-gray-50 flex items-center justify-between bg-white relative">
                            <button
                                onClick={toggleCart}
                                className="flex items-center gap-2 group p-2 -ml-4"
                            >
                                <ChevronLeft className="w-6 h-6 text-black group-hover:-translate-x-1 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Return</span>
                            </button>

                            <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2">
                                <h2 className="text-xl font-black uppercase tracking-tighter leading-none text-black">Your Bag</h2>
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">{items.length} Styles</span>
                            </div>

                            <button
                                onClick={toggleCart}
                                className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-full active:scale-90 transition-all"
                            >
                                <X className="w-6 h-6 text-black" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar space-y-10">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                                    <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center">
                                        <ShoppingBag className="w-10 h-10 text-gray-200" />
                                    </div>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Your bag is as light as air. <br /> Let's fill it with magic.</p>
                                    <button onClick={toggleCart} className="text-black font-black uppercase text-[10px] tracking-[0.3em] border-b-2 border-black pb-1">Start Exploring</button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="group relative flex gap-6">
                                        <div className="w-24 h-32 bg-gray-50 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                                            <img src={item.image || 'https://via.placeholder.com/200'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-grow flex flex-col justify-between py-1">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-black uppercase tracking-tight leading-none text-gray-900 group-hover:text-gray-500 transition-colors">{item.name}</h3>
                                                <p className="text-lg font-bold text-gray-900">{formatPrice(item.price)}</p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center bg-gray-50/80 backdrop-blur-md rounded-full p-1 border border-gray-100 scale-90 -ml-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1, storeId)}
                                                        className="p-2 text-gray-400 hover:text-black transition-colors active:scale-95"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <div className="w-10 flex items-center justify-center">
                                                        <span className="text-sm font-black text-black">{item.quantity}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1, storeId)}
                                                        className="p-2 text-gray-400 hover:text-black transition-colors active:scale-95"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <button onClick={() => removeItem(storeId, item.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors transform hover:rotate-12">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-8 border-t border-gray-100 bg-gray-50/50 space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-2xl font-black uppercase tracking-tighter">Total Price</span>
                                        <span className="text-3xl font-black text-gray-900 tracking-tighter">{formatPrice(subtotal)}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Link
                                        href={`/store/${subdomain}/checkout`}
                                        onClick={toggleCart}
                                        className="w-full bg-black text-white py-6 rounded-3xl font-black uppercase text-[10px] tracking-[0.4em] shadow-2xl shadow-black/20 hover:bg-gray-900 active:scale-95 transition-all flex items-center justify-center gap-4 group"
                                    >
                                        Proceed to Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <div className="flex items-center justify-center gap-3 text-gray-400 py-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Secure Encryption Active</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
