'use client';

import React from 'react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useStoreCart } from '@/store/useStoreCart';
import { Heart, X, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

export function ElectshopWishlistDrawer({ storeId }: { storeId: string }) {
    const { items, isOpen, toggleDrawer, removeItem } = useWishlistStore();
    const { addItem } = useStoreCart(storeId);
    const { subdomain } = useParams<{ subdomain: string }>();

    const handleMoveToCart = (item: any) => {
        addItem({ ...item, image: item.image || undefined }, 1);
        removeItem(item.id);
        toast.success(`${item.name} moved to cart!`);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleDrawer}
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
                                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Wishlist</h2>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{items.length} Items Saved</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleDrawer}
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
                                        <Heart className="w-12 h-12 text-gray-200" />
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Wishlist is empty</h3>
                                    <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">You haven't saved any items yet.</p>
                                    <button
                                        onClick={toggleDrawer}
                                        className="mt-8 px-8 py-4 bg-brand text-white rounded-xl font-bold uppercase tracking-widest text-[10px]"
                                    >
                                        Explore Products
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-6 group">
                                        <div className="w-24 h-24 bg-[#f8f9fa] rounded-2xl border border-gray-100 p-2 shrink-0 overflow-hidden relative">
                                            <img src={item.image || undefined} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
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
                                            <button
                                                onClick={() => handleMoveToCart(item)}
                                                className="w-full py-2 bg-brand/5 text-brand rounded-lg font-bold uppercase tracking-widest text-[9px] hover:bg-brand hover:text-white transition-all flex items-center justify-center gap-2"
                                            >
                                                <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-8 bg-gray-50 border-t border-gray-100">
                                <Link
                                    href={`/store/${subdomain}/shop`}
                                    onClick={toggleDrawer}
                                    className="w-full h-16 bg-brand text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-brand/20 hover:brightness-95 transition-all flex items-center justify-center gap-3 group"
                                >
                                    Continue Shopping <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
