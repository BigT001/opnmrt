'use client';

import { CartDrawerProps } from '../../types';
import { X, Minus, Plus, Trash2, ShoppingBag, Scroll, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoreCart } from '@/store/useStoreCart';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

export function VintageCharmCartDrawer({ storeId }: CartDrawerProps) {
    const { storeItems: items, isOpen, toggleCart, removeItem, updateQuantity, subtotal, totalCount: itemCount } = useStoreCart(storeId);
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
                        className="fixed inset-0 z-[60] bg-[#1B3022]/40 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%', skewX: 2 }}
                        animate={{ x: 0, skewX: 0 }}
                        exit={{ x: '100%', skewX: 2 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-[70] w-full max-w-lg bg-[#F9F4EE] shadow-[-20px_0_60px_rgba(27,48,34,0.15)] flex flex-col border-l border-[#1B3022]/10"
                    >
                        {/* Header: Archival Manifest */}
                        <div className="p-10 border-b border-[#1B3022]/10 space-y-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Scroll className="w-24 h-24" />
                            </div>
                            <div className="flex items-center justify-between relative z-10">
                                <div className="space-y-1">
                                    <span className="font-cursive text-3xl text-[#8B4513]">Your Selection</span>
                                    <h2 className="text-4xl font-black text-[#1B3022] tracking-tighter uppercase italic">
                                        The Manifest
                                    </h2>
                                </div>
                                <button
                                    onClick={toggleCart}
                                    className="w-12 h-12 flex items-center justify-center border border-[#1B3022]/10 hover:bg-[#1B3022] hover:text-[#F9F4EE] transition-all rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Cart Items: Ledger Entry */}
                        <div className="flex-1 overflow-y-auto p-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                                    <ShoppingBag className="w-16 h-16 stroke-[1px]" />
                                    <p className="font-serif italic text-xl">The manifest is currently empty.</p>
                                    <button
                                        onClick={toggleCart}
                                        className="text-[#1B3022] font-bold uppercase tracking-widest text-[10px] underline underline-offset-4"
                                    >
                                        Return to Archive
                                    </button>
                                </div>
                            ) : (
                                <ul className="space-y-10">
                                    {items.map((item) => (
                                        <motion.li
                                            key={item.id}
                                            layout
                                            className="flex gap-6 group"
                                        >
                                            <div className="h-32 w-24 flex-shrink-0 bg-white p-2 vintage-border shadow-sm group-hover:shadow-md transition-shadow">
                                                <img
                                                    src={item.image || 'https://via.placeholder.com/100'}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                                                />
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="text-xl font-black text-[#1B3022] tracking-tighter uppercase italic leading-none group-hover:text-[#8B4513] transition-colors">
                                                            {item.name}
                                                        </h3>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-stone-400 hover:text-red-800 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <p className="font-serif italic text-sm text-[#1B3022]/60">{formatPrice(item.price)} per unit</p>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center border-2 border-[#1B3022] bg-white shadow-[3px_3px_0_rgba(27,48,34,1)] h-10">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-2 hover:bg-[#1B3022] hover:text-[#F9F4EE] transition-all disabled:opacity-30"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <span className="w-10 text-center font-black text-sm text-[#1B3022] border-x-2 border-[#1B3022] leading-10">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-2 hover:bg-[#1B3022] hover:text-[#F9F4EE] transition-all"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <span className="font-serif italic text-lg text-[#1B3022]">{formatPrice(item.price * item.quantity)}</span>
                                                </div>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer: Final Allocation */}
                        {items.length > 0 && (
                            <div className="p-10 border-t border-[#1B3022]/20 bg-white space-y-8 relative">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[#1B3022]/40 font-mono text-[10px] uppercase tracking-widest font-black">
                                        <span>Items_Total</span>
                                        <span className="text-[#1B3022]">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-[#1B3022]/40 font-mono text-[10px] uppercase tracking-widest font-black">
                                        <span>Shipping_Tariff</span>
                                        <span className="text-[#1B3022]">Calculated at Seal</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-4 border-t border-[#1B3022]/10">
                                        <div className="space-y-1">
                                            <span className="font-cursive text-2xl text-[#8B4513]">Total Allocation</span>
                                            <h3 className="text-4xl font-black text-[#1B3022] tracking-tighter uppercase italic leading-none">The Sum</h3>
                                        </div>
                                        <span className="text-5xl font-black italic tracking-tighter text-[#1B3022]">{formatPrice(subtotal)}</span>
                                    </div>
                                </div>

                                <Link
                                    href={`/store/${params.subdomain}/checkout`}
                                    onClick={toggleCart}
                                    className="group relative block w-full py-6 bg-[#1B3022] text-[#F9F4EE] text-center text-2xl font-black uppercase italic tracking-tighter hover:bg-[#8B4513] transition-all overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-4">
                                        Acquire Selection
                                        <ShieldCheck className="w-6 h-6" />
                                    </span>
                                    <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}


