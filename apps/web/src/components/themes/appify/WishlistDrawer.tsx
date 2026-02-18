'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { X, Heart, Trash2, ArrowRight, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function AppifyWishlistDrawer() {
    const { isOpen, toggleDrawer, items, removeItem } = useWishlistStore();
    const { addItem } = useCartStore();
    const { subdomain } = useParams<{ subdomain: string }>();

    const moveToCart = (item: any) => {
        addItem({ ...item, quantity: 1 });
        removeItem(item.id);
        // Maybe highlight totalCount in cart
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        onClick={toggleDrawer}
                    />

                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute inset-0 bg-white flex flex-col overflow-hidden"
                    >
                        {/* Pull Indicator - optional for full screen, but keeps style */}
                        <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full" />
                        </div>

                        <div className="px-8 py-6 flex items-center justify-between shrink-0">
                            <h2 className="text-[24px] font-black text-[#1a1a2e] uppercase italic tracking-tighter">My Favorites</h2>
                            <button onClick={toggleDrawer} className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 active:scale-95 transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Items Area */}
                        <div className="flex-grow overflow-y-auto px-8 py-4 space-y-6 custom-scrollbar pb-10">
                            {items.length === 0 ? (
                                <div className="text-center py-20 flex flex-col items-center gap-6">
                                    <div className="w-20 h-20 bg-gray-50 rounded-[35px] flex items-center justify-center text-gray-200">
                                        <Heart className="w-10 h-10 fill-current" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[12px] font-black text-[#1a1a2e] uppercase tracking-widest">Wishlist is empty</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Save your favorites here</p>
                                    </div>
                                    <button
                                        onClick={toggleDrawer}
                                        className="bg-[#0a0a0a] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/10 transition-all active:scale-95"
                                    >
                                        Browse Products
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-5 items-center group">
                                        <div className="relative w-24 h-24 bg-[#f4f6f8] rounded-[28px] overflow-hidden shrink-0 border border-gray-50">
                                            <img src={item.image || ''} alt={item.name} className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="absolute top-1 right-1 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="flex-grow space-y-2">
                                            <div className="space-y-0.5">
                                                <h3 className="text-[14px] font-black text-[#1a1a2e] leading-tight line-clamp-1">{item.name}</h3>
                                                <p className="text-[15px] font-black text-orange-500">{formatPrice(Number(item.price) || 0)}</p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => moveToCart(item)}
                                                    className="flex-grow h-10 bg-[#0a0a0a] text-white rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 active:scale-95 transition-all shadow-md"
                                                >
                                                    <ShoppingCart className="w-3.5 h-3.5" />
                                                    Add to Bag
                                                </button>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer Link to Full Page */}
                        <div className="shrink-0 bg-white border-t border-gray-100 px-8 py-6 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                            <button
                                onClick={() => {
                                    toggleDrawer();
                                    // Could navigate if needed, but user wanted a drawer
                                }}
                                className={`w-full h-14 bg-gray-50 text-[#1a1a2e] rounded-2xl flex items-center justify-center gap-3 font-black text-[12px] uppercase tracking-[0.2em] hover:bg-gray-100 active:scale-[0.98] transition-all ${items.length === 0 ? 'hidden' : ''}`}
                            >
                                Continue Shopping
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
