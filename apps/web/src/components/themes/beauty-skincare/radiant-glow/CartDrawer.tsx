'use client';

import { CartDrawerProps } from '../../types';
import { X, Minus, Plus, Trash2, ShoppingBag, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoreCart } from '@/store/useStoreCart';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

export function RadiantGlowCartDrawer({ storeId }: CartDrawerProps) {
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
                        className="fixed inset-0 z-[60] bg-[#2D1E1E]/20 backdrop-blur-md"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0.5 }}
                        transition={{
                            type: 'spring',
                            damping: 30,
                            stiffness: 200,
                            mass: 0.8
                        }}
                        className="fixed inset-y-0 right-0 z-[70] w-full max-w-lg bg-[#FFF9F0]/90 backdrop-blur-2xl shadow-[-20px_0_80px_rgba(45,30,30,0.1)] flex flex-col border-l border-white/40"
                    >
                        {/* Shimmer Overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-[#E2AFA2] via-transparent to-transparent" />

                        {/* Header */}
                        <div className="relative flex items-center justify-between p-10">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-[#C19A6B]">
                                    <Sparkles className="w-3 h-3 fill-current" />
                                    <span className="font-sans text-[8px] uppercase tracking-[0.4em] font-black">Your Selection</span>
                                </div>
                                <h2 className="text-4xl font-luminous text-[#2D1E1E]">Shopping <span className="italic">Bag</span></h2>
                            </div>
                            <button
                                onClick={toggleCart}
                                className="p-4 text-[#2D1E1E]/40 hover:text-[#C19A6B] hover:bg-white rounded-full transition-all duration-500 shadow-sm border border-transparent hover:border-[#C19A6B]/10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="relative flex-1 overflow-y-auto px-10 py-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                                    <div className="w-24 h-24 bg-white/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-[#C19A6B]/10">
                                        <ShoppingBag className="w-8 h-8 text-[#C19A6B]/40" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-luminous text-[#2D1E1E]">Your bag is currently light</h3>
                                        <p className="font-sans text-[10px] uppercase tracking-widest text-[#2D1E1E]/40 leading-relaxed max-w-xs">Let us guide you to your perfect radiance ritual.</p>
                                    </div>
                                    <button
                                        onClick={toggleCart}
                                        className="font-sans text-[10px] uppercase tracking-[0.3em] font-black text-[#C19A6B] hover:text-[#2D1E1E] transition-colors"
                                    >
                                        Begin Shopping →
                                    </button>
                                </div>
                            ) : (
                                <ul className="space-y-10">
                                    {items.map((item, idx) => (
                                        <motion.li
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="group flex gap-8 items-center"
                                        >
                                            {item.image && (
                                                <div className="h-28 w-24 flex-shrink-0 overflow-hidden rounded-3xl bg-white border border-[#C19A6B]/5 shadow-lg group-hover:shadow-[#C19A6B]/10 transition-shadow duration-500">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex-1 flex flex-col justify-center gap-3">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-xl font-luminous text-[#2D1E1E] line-clamp-1 group-hover:text-[#C19A6B] transition-colors">
                                                        {item.name}
                                                    </h3>
                                                    <p className="font-sans text-xs font-bold text-[#2D1E1E]">{formatPrice(item.price * item.quantity)}</p>
                                                </div>

                                                <div className="flex items-center justify-between pt-2">
                                                    <div className="flex items-center bg-white border border-[#C19A6B]/20 rounded-full p-1 shadow-sm h-10">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FFF9F0] text-[#2D1E1E]/40 hover:text-[#C19A6B] transition-all disabled:opacity-30"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <span className="w-10 text-center font-sans text-xs font-black text-[#2D1E1E]">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FFF9F0] text-[#2D1E1E]/40 hover:text-[#C19A6B] transition-all"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-3 text-[#2D1E1E]/20 hover:text-[#E2AFA2] transition-colors"
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

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="relative p-10 space-y-8 bg-white/40 backdrop-blur-3xl border-t border-white/60">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <span className="font-sans text-[8px] uppercase tracking-widest text-[#2D1E1E]/40 font-black">Accumulated Light</span>
                                            <p className="text-3xl font-luminous text-[#2D1E1E]">Order Total</p>
                                        </div>
                                        <p className="text-3xl font-sans font-bold text-[#C19A6B]">{formatPrice(subtotal)}</p>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-sans text-[#2D1E1E]/40 uppercase tracking-widest">
                                        <ShieldCheck className="w-4 h-4 text-[#C19A6B]" />
                                        Secure Luminous Transaction
                                    </div>
                                </div>

                                <Link
                                    href={`/store/${params.subdomain}/checkout`}
                                    onClick={toggleCart}
                                    className="group relative w-full h-20 bg-[#2D1E1E] text-white rounded-[40px] overflow-hidden flex items-center justify-center gap-4 transition-all duration-700"
                                >
                                    <div className="absolute inset-0 bg-[#C19A6B] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1]" />
                                    <span className="relative z-10 font-sans text-[10px] uppercase tracking-[0.4em] font-black">Proceed to checkout</span>
                                    <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-500 group-hover:translate-x-2" />
                                </Link>

                                <button
                                    onClick={toggleCart}
                                    className="w-full text-center font-sans text-[9px] uppercase tracking-widest text-[#2D1E1E]/40 hover:text-[#2D1E1E] transition-colors"
                                >
                                    Continue Exploring Collection
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}


