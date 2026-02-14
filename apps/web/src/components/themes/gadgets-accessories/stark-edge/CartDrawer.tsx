'use client';

import { CartDrawerProps } from '../../types';
import { X, Minus, Plus, Trash2, Zap, Terminal, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoreCart } from '@/store/useStoreCart';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

export function StarkEdgeCartDrawer({ storeId }: CartDrawerProps) {
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
                        className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-y-0 right-0 z-[2001] w-full max-w-xl bg-[#080808] border-l border-[#333] flex flex-col font-tactical"
                    >
                        {/* Header: Hardware Status */}
                        <div className="flex items-center justify-between p-10 border-b border-[#333]">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-[#00F0FF]">
                                    <Activity className="w-4 h-4" />
                                    <span className="font-data text-[10px] uppercase tracking-[0.4em]">Gear_List_v1.0</span>
                                </div>
                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Hardware Bag</h2>
                            </div>
                            <button
                                onClick={toggleCart}
                                className="p-4 text-white/40 hover:text-white border border-[#333] transition-all"
                                aria-label="Close cart"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Cart Items: Hardware Grid */}
                        <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 bg-[#111] border border-[#333] flex items-center justify-center relative">
                                        <Zap className="w-8 h-8 text-white/20" />
                                        <div className="absolute inset-0 border border-[#00F0FF]/10 animate-pulse" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white uppercase tracking-widest">Bag Empty</h3>
                                    <p className="text-white/40 font-data text-xs max-w-[200px] leading-relaxed uppercase">Acquire hardware to populate your mobile loadout.</p>
                                </div>
                            ) : (
                                <div className="space-y-px bg-[#333] border border-[#333]">
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex bg-[#080808] p-6 gap-6 relative group"
                                        >
                                            {item.image && (
                                                <div className="h-24 w-24 flex-shrink-0 bg-[#111] overflow-hidden border border-[#333]">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex-1 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="text-[8px] font-data text-[#00F0FF] uppercase mb-1">ID: {item.id.substring(0, 8)}</div>
                                                        <h3 className="text-lg font-bold text-white uppercase tracking-tighter leading-none group-hover:text-[#00F0FF] transition-colors">{item.name}</h3>
                                                    </div>
                                                    <p className="font-data text-lg font-bold text-white">{formatPrice(item.price * item.quantity)}</p>
                                                </div>

                                                <div className="flex items-center justify-between pt-4">
                                                    <div className="flex items-center bg-[#111] border-2 border-[#333] h-12 shadow-[0_0_20px_rgba(0,240,255,0.05)]">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1, storeId)}
                                                            className="px-5 text-white/40 hover:text-[#00F0FF] transition-all disabled:opacity-20"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-16 font-data text-base font-black text-white text-center border-x-2 border-[#333] leading-10">
                                                            {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1, storeId)}
                                                            className="px-5 text-white/40 hover:text-[#00F0FF] transition-all disabled:opacity-20"
                                                            disabled={item.quantity >= (item.stock ?? 9999)}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(item.id, storeId)}
                                                        className="h-10 px-4 bg-[#111] border border-[#333] text-red-500/60 hover:text-red-500 hover:border-red-500/50 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer: Order Protocol */}
                        {items.length > 0 && (
                            <div className="p-10 border-t border-[#333] space-y-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <div className="font-data text-[9px] text-white/30 uppercase tracking-[0.3em]">Loadout_Value</div>
                                            <div className="text-2xl font-black text-white uppercase tracking-tighter">Aggregate Total</div>
                                        </div>
                                        <div className="text-4xl font-data font-black text-[#00F0FF]">
                                            {formatPrice(subtotal)}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/20 font-data text-[9px] uppercase tracking-widest">
                                        <Terminal className="w-3 h-3" />
                                        <span>Verified_Secure_Node</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Link
                                        href={`/store/${params.subdomain}/checkout`}
                                        onClick={toggleCart}
                                        className="group relative flex w-full h-24 items-center justify-center bg-white text-black font-black uppercase tracking-[0.4em] text-sm overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-3">
                                            Secure Checkout
                                            <Activity className="w-4 h-4" />
                                        </span>
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-[#00F0FF] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                                        <div className="absolute inset-0 bg-[#00F0FF] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[0.16,1,0.3,1] -z-10" />
                                    </Link>

                                    <button
                                        onClick={toggleCart}
                                        className="w-full text-center font-data text-[9px] text-white/30 uppercase tracking-[0.4em] hover:text-white transition-colors"
                                    >
                                        [ ESC ] Continue Shopping
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


