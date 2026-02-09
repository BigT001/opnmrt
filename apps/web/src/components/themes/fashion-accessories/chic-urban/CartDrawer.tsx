'use client';

import { CartDrawerProps } from '../../types';
import { X, Minus, Plus, Trash2, ShoppingBag, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoreCart } from '@/store/useStoreCart';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

export function ChicUrbanCartDrawer({ storeId }: CartDrawerProps) {
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
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%', skewX: 5 }}
                        animate={{ x: 0, skewX: 0 }}
                        exit={{ x: '100%', skewX: 5 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white border-l-8 border-black flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                    >
                        {/* Tactical Header */}
                        <div className="flex items-center justify-between p-8 border-b-4 border-black bg-black text-[#CCFF00]">
                            <div className="space-y-1">
                                <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                                    Inventory_System
                                </h2>
                                <p className="font-mono text-[10px] uppercase font-bold text-white/40">
                                    Accessing_Core_Terminal... OK
                                </p>
                            </div>
                            <button
                                onClick={toggleCart}
                                className="bg-white p-3 border-2 border-white hover:bg-[#CCFF00] hover:border-[#CCFF00] transition-colors"
                            >
                                <X className="w-6 h-6 text-black" />
                            </button>
                        </div>

                        {/* Cart Items (Digital Receipt Style) */}
                        <div className="flex-1 overflow-y-auto p-8 bg-[#F5F5F5] space-y-8">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-24 h-24 bg-black rotate-45 flex items-center justify-center">
                                        <ShoppingBag className="w-10 h-10 text-[#CCFF00] -rotate-45" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black uppercase italic tracking-tighter">System_Empty</h3>
                                        <p className="font-mono text-xs text-black/40 uppercase">No hardware detected in active session.</p>
                                    </div>
                                    <button
                                        onClick={toggleCart}
                                        className="bg-black text-[#CCFF00] px-10 py-4 font-black uppercase italic tracking-tighter hover:bg-[#CCFF00] hover:text-black transition-all"
                                    >
                                        Initiate_Shop
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="group relative bg-white border-2 border-black p-4 flex gap-6 hover:shadow-[8px_8px_0_rgba(0,0,0,1)] transition-all"
                                        >
                                            <div className="h-28 w-28 flex-shrink-0 border-2 border-black overflow-hidden bg-gray-100">
                                                <img
                                                    src={item.image || 'https://via.placeholder.com/200'}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                />
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none mb-1">
                                                            {item.name}
                                                        </h3>
                                                        <p className="font-mono text-[9px] font-bold text-black/40 uppercase">
                                                            Serial: ITM_{item.id.substring(0, 8)}
                                                        </p>
                                                    </div>
                                                    <p className="text-xl font-black italic tracking-tighter">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between pt-4">
                                                    <div className="flex items-center border-4 border-black bg-white shadow-[4px_4px_0_rgba(0,0,0,1)]">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-3 hover:bg-black hover:text-[#CCFF00] transition-colors disabled:opacity-30"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-5 h-5" />
                                                        </button>
                                                        <span className="w-16 text-center font-black text-xl italic tracking-tighter border-x-4 border-black">
                                                            {item.quantity.toString().padStart(2, '0')}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-3 hover:bg-black hover:text-[#CCFF00] transition-colors"
                                                        >
                                                            <Plus className="w-5 h-5" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-black/40 hover:text-black p-2 transition-colors flex items-center gap-2 font-mono text-[10px] font-black uppercase"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        [Detach]
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Transaction Footer */}
                        {items.length > 0 && (
                            <div className="border-t-8 border-black p-10 space-y-8 bg-white">
                                <div className="space-y-4 font-black">
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-[10px] text-black/40 uppercase">Sub_Total_Value</span>
                                            <span className="text-2xl uppercase italic tracking-tighter">Verified Summary</span>
                                        </div>
                                        <span className="text-4xl italic tracking-tighter">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-mono text-black uppercase border-y-2 border-black/10 py-2">
                                        <span>Estimated Duty: $0.00</span>
                                        <span>Shipping: Free_Tier</span>
                                    </div>
                                </div>

                                <Link
                                    href={`/store/${params.subdomain}/checkout`}
                                    onClick={toggleCart}
                                    className="group relative flex w-full items-center justify-center bg-black py-6 overflow-hidden active:scale-95 transition-transform"
                                >
                                    <div className="absolute inset-0 bg-[#CCFF00] -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                    <span className="relative z-10 text-white group-hover:text-black text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                                        Commit Transaction <Zap className="w-6 h-6 fill-current" />
                                    </span>
                                </Link>

                                <div className="flex items-center gap-4 text-black/20 font-mono text-[8px] uppercase tracking-[0.2em] font-black">
                                    <Activity className="w-4 h-4" />
                                    <span>System_v4.2 // Encrypted Connection // Verified Shop Environment</span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}


