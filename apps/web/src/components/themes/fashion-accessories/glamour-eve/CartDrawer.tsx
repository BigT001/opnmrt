'use client';

import { CartDrawerProps } from '../../types';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoreCart } from '@/store/useStoreCart';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

export function GlamourEveCartDrawer({ storeId }: CartDrawerProps) {
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
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 z-[70] w-full max-w-lg bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.1)] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-10 border-b border-black/5">
                            <div>
                                <span className="text-[#D4AF37] uppercase tracking-[0.4em] text-[9px] font-black block mb-2">Votre Sélection</span>
                                <h2 className="text-3xl font-serif text-black italic">Shopping Bag</h2>
                            </div>
                            <button
                                onClick={toggleCart}
                                className="p-4 text-black/20 hover:text-black transition-colors rounded-full hover:bg-black/5"
                                aria-label="Close cart"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                                    <div className="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="w-10 h-10 text-black/10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-serif text-black italic">Your bag is empty</h3>
                                        <p className="text-black/40 text-[10px] uppercase tracking-[0.2em] font-bold">Discover our curated masterpieces.</p>
                                    </div>
                                    <button
                                        onClick={toggleCart}
                                        className="px-10 py-5 bg-black text-white uppercase tracking-[0.3em] text-[10px] font-black hover:bg-[#D4AF37] hover:text-black transition-all"
                                    >
                                        Start Exploring
                                    </button>
                                </div>
                            ) : (
                                <ul className="space-y-12">
                                    {items.map((item) => (
                                        <motion.li
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="flex gap-8 group"
                                        >
                                            {item.image && (
                                                <div className="h-40 w-32 flex-shrink-0 overflow-hidden bg-gray-50 border border-black/5">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex flex-1 flex-col justify-between py-2">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <h3 className="text-lg font-serif italic text-black leading-tight">{item.name}</h3>
                                                        <p className="font-bold text-black tracking-tighter">{formatPrice(item.price * item.quantity)}</p>
                                                    </div>
                                                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-black italic">Collection Privée</p>
                                                </div>

                                                <div className="flex items-center justify-between pt-6">
                                                    <div className="flex items-center gap-6 border border-black/10 rounded-full px-4 h-12 bg-white">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="text-black/30 hover:text-black transition-colors disabled:opacity-20"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="text-sm font-black min-w-[30px] text-center italic">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="text-black/30 hover:text-[#D4AF37] transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400 hover:text-red-500 transition-colors flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
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
                            <div className="border-t border-black/5 p-10 space-y-8 bg-black/5">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Total Estimé</p>
                                        <p className="text-3xl font-serif text-black italic">{formatPrice(subtotal)}</p>
                                    </div>
                                    <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                                        <p className="text-[9px] text-center text-[#B8860B] uppercase tracking-[0.2em] font-black italic">
                                            Complimentary Gift Wrapping Included
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Link
                                        href={`/store/${params.subdomain}/checkout`}
                                        onClick={toggleCart}
                                        className="group relative flex w-full h-20 items-center justify-center bg-black text-white hover:bg-[#D4AF37] hover:text-black transition-all overflow-hidden"
                                    >
                                        <span className="relative z-10 uppercase tracking-[0.4em] text-[11px] font-black flex items-center gap-4">
                                            Proceed to Checkout
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                        </span>
                                    </Link>

                                    <button
                                        onClick={toggleCart}
                                        className="w-full text-[9px] uppercase tracking-[0.3em] font-black text-black/40 hover:text-black transition-colors py-2"
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


