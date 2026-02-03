'use client';

import { CartDrawerProps } from '../../types';
import { X, Minus, Plus, Trash2, ShoppingBag, Leaf, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

export function PureBotanicalCartDrawer({ }: CartDrawerProps) {
    const { items, isOpen, toggleCart, removeItem, updateQuantity, totalPrice } = useCartStore();
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
                        className="fixed inset-0 z-50 bg-[#1C2B21]/20 backdrop-blur-md"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                        className="fixed inset-y-8 right-8 z-50 w-full max-w-xl bg-[#F9FAF8] shadow-[0_32px_120px_rgba(28,43,33,0.15)] flex flex-col rounded-[48px] border border-white/40 overflow-hidden"
                    >
                        {/* Header: Collection Summary */}
                        <div className="p-10 border-b border-[#7C9082]/10 flex items-center justify-between relative overflow-hidden">
                            <div className="space-y-1 relative z-10">
                                <div className="flex items-center gap-3 text-[#7C9082]">
                                    <Leaf className="w-4 h-4" />
                                    <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold">Your Selection</span>
                                </div>
                                <h2 className="text-4xl font-serif text-[#1C2B21]">Botanical Bag</h2>
                            </div>

                            <button
                                onClick={toggleCart}
                                className="w-14 h-14 flex items-center justify-center bg-white rounded-full text-[#1C2B21]/40 hover:text-[#1C2B21] transition-all border border-[#7C9082]/10 relative z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Background Leaf Pattern */}
                            <div className="absolute top-0 right-0 w-48 h-48 opacity-5 -translate-y-1/2 translate-x-1/2">
                                <Leaf className="w-full h-full fill-[#7C9082]" />
                            </div>
                        </div>

                        {/* Cart Items: Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border border-[#7C9082]/10 shadow-sm relative group overflow-hidden">
                                        <ShoppingBag className="w-12 h-12 text-[#7C9082]/30 group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-[#7C9082]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-serif text-[#1C2B21]">Current bag is empty</h3>
                                        <p className="text-[#1C2B21]/40 font-serif italic text-lg max-w-xs mx-auto">Discover our latest hand-picked formations to begin your ritual.</p>
                                    </div>
                                    <button
                                        onClick={toggleCart}
                                        className="font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-[#7C9082] py-4 px-10 border border-[#7C9082]/20 rounded-full hover:bg-[#1C2B21] hover:text-white transition-all duration-500"
                                    >
                                        Browse Botanicals
                                    </button>
                                </div>
                            ) : (
                                <ul className="space-y-10">
                                    {items.map((item, idx) => (
                                        <motion.li
                                            key={item.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex gap-8 group"
                                        >
                                            {/* Item Image */}
                                            <div className="h-32 w-28 bg-[#F2EBE9] rounded-[24px] overflow-hidden flex-shrink-0 shadow-sm transition-transform duration-700 group-hover:scale-105">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                                                />
                                            </div>

                                            {/* Item Details */}
                                            <div className="flex-1 flex flex-col justify-between py-2">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="space-y-1">
                                                        <h3 className="font-serif text-xl text-[#1C2B21] group-hover:text-[#7C9082] transition-colors">{item.name}</h3>
                                                        <span className="font-sans text-[10px] uppercase tracking-widest text-[#1C2B21]/30">Quantity: {item.quantity}</span>
                                                    </div>
                                                    <span className="font-sans text-sm font-bold text-[#1C2B21]">{formatPrice(item.price * item.quantity)}</span>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center gap-6 p-1.5 bg-white rounded-full border border-[#7C9082]/10 shadow-sm">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F9FAF8] text-[#1C2B21]/30 hover:text-[#1C2B21] transition-all"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="font-sans font-bold text-xs text-[#1C2B21]">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F9FAF8] text-[#1C2B21]/30 hover:text-[#1C2B21] transition-all"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer: Order Allocation */}
                        {items.length > 0 && (
                            <div className="p-10 bg-white border-t border-[#7C9082]/10 space-y-8 relative">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-black text-[#1C2B21]/40">Subtotal</span>
                                            <p className="font-serif italic text-lg text-[#1C2B21]/60">Delivery & taxes calculated next</p>
                                        </div>
                                        <span className="text-3xl font-serif text-[#1C2B21]">{formatPrice(totalPrice())}</span>
                                    </div>
                                    <div className="h-[1px] w-full bg-[#7C9082]/10 overflow-hidden">
                                        <motion.div
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '100%' }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            className="w-1/3 h-full bg-[#7C9082]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Link
                                        href={`/store/${params.subdomain}/checkout`}
                                        onClick={toggleCart}
                                        className="group relative flex h-20 bg-[#1C2B21] text-white rounded-full items-center justify-center gap-6 overflow-hidden shadow-2xl shadow-[#1C2B21]/20 transition-all duration-700"
                                    >
                                        <span className="font-sans text-sm font-bold uppercase tracking-[0.4em] relative z-10">Proceed to Checkout</span>
                                        <div className="relative z-10 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform duration-500">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                        <div className="absolute inset-0 bg-[#7C9082] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1]" />
                                    </Link>

                                    <div className="flex items-center justify-center gap-3 text-[#7C9082] pt-4">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold">Encrypted Ritual Processing</span>
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


