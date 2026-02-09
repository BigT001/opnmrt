'use client';

import { CartDrawerProps } from '../../types';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoreCart } from '@/store/useStoreCart';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

export function MinimalLuxeCartDrawer({ storeId }: CartDrawerProps) {
    const { storeItems: items, isOpen, toggleCart, removeItem, updateQuantity, subtotal } = useStoreCart(storeId);
    const [mounted, setMounted] = useState(false);
    const params = useParams<{ subdomain: string }>();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

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
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col rounded-l-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-8 border-b border-gray-100">
                            <div className="space-y-1">
                                <h2 className="text-[14px] font-black text-gray-900 uppercase tracking-[0.3em]">Curation</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{items.length} Artifacts</p>
                            </div>
                            <button
                                onClick={toggleCart}
                                className="p-3 text-gray-400 hover:text-gray-900 transition-colors"
                                aria-label="Close cart"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 bg-gray-50 flex items-center justify-center">
                                        <ShoppingBag className="w-8 h-8 text-gray-200" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.4em]">Empty Gallery</h3>
                                        <p className="text-[11px] text-gray-400 font-medium leading-relaxed max-w-[180px]">Your collection is currently waiting for a selection.</p>
                                    </div>
                                    <button onClick={toggleCart} className="text-[10px] font-black text-gray-900 uppercase tracking-widest border-b border-gray-900 pb-1 hover:opacity-50 transition-opacity">
                                        Browse Store
                                    </button>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-50">
                                    {items.map((item) => (
                                        <motion.li
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex py-8 group"
                                        >
                                            {item.image && (
                                                <div className="h-28 w-24 flex-shrink-0 overflow-hidden bg-gray-50 border border-gray-100">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700"
                                                    />
                                                </div>
                                            )}

                                            <div className="ml-6 flex flex-1 flex-col justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-tight leading-tight line-clamp-2">{item.name}</h3>
                                                        <p className="text-sm font-black text-gray-900 tracking-tightest">{formatPrice(item.price * item.quantity)}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4">
                                                    <div className="flex items-center gap-1 border border-gray-200 p-1 bg-white h-10 shadow-sm">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all disabled:opacity-30"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-10 text-center text-[12px] font-black text-gray-900">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-[9px] font-black text-rose-400 uppercase tracking-widest hover:text-rose-600 transition-colors py-1"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-8 space-y-8 bg-white border-t border-gray-100">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        <span>Subtotal</span>
                                        <span className="text-sm font-black text-gray-900 tracking-tightest">{formatPrice(subtotal)}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-medium tracking-tight leading-relaxed uppercase">
                                        Fulfillment and duties calculated at final checkout.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <Link
                                        href={`/store/${params.subdomain}/checkout`}
                                        onClick={toggleCart}
                                        className="flex w-full items-center justify-center py-5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:bg-black active:scale-95 shadow-2xl shadow-gray-900/10"
                                    >
                                        Proceed to Checkout
                                    </Link>

                                    <button
                                        type="button"
                                        className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors py-2"
                                        onClick={toggleCart}
                                    >
                                        Continue Curation
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

