'use client';

import { CartDrawerProps } from '../../types';
import { X, Minus, Plus, Trash2, ShoppingBag, Zap, Activity, ChevronRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoreCart } from '@/store/useStoreCart';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

export function NeonStreamCartDrawer({ storeId }: CartDrawerProps) {
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
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-y-0 right-0 z-[2001] w-full max-w-md bg-[#0a0a0a] border-l border-white/5 shadow-2xl flex flex-col font-inter"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-[#BF00FF] flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(191,0,255,0.4)]">
                                    <ShoppingBag className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="text-sm font-black font-syne uppercase tracking-[0.3em] text-white italic">Hardware_Manifest</h2>
                            </div>
                            <button
                                onClick={toggleCart}
                                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
                                aria-label="Close manifest"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 bg-white/5 border border-dashed border-white/10 flex items-center justify-center rounded-[32px]">
                                        <Activity className="w-8 h-8 text-gray-700" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-black font-syne text-white uppercase tracking-widest italic">Inventory_Empty</h3>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">No active hardware transacting in current stream.</p>
                                    </div>
                                    <button onClick={toggleCart} className="text-[#00F5FF] text-[10px] font-black font-syne uppercase tracking-[0.3em] hover:text-white transition-all">
                                        [ INITIALIZE_CONNECTION ]
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {items.map((item, idx) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex gap-6 group"
                                        >
                                            <div className="h-20 w-20 bg-white/5 border border-white/5 rounded-2xl p-2 flex-shrink-0 relative overflow-hidden">
                                                <img
                                                    src={item.image || 'https://via.placeholder.com/400'}
                                                    alt={item.name}
                                                    className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>

                                            <div className="flex flex-1 flex-col justify-between py-1">
                                                <div className="space-y-1">
                                                    <h3 className="text-[11px] font-black font-syne uppercase tracking-tight text-white italic leading-tight group-hover:text-[#00F5FF] transition-colors">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-[#00F5FF] font-black font-syne text-xs italic tracking-tighter">
                                                        {formatPrice(item.price)}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center bg-white/5 border border-white/20 rounded-xl h-10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1, storeId)}
                                                            className="w-10 h-full hover:text-[#00F5FF] text-gray-500 hover:bg-white/5 transition-all disabled:opacity-20"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-3.5 h-3.5 mx-auto" />
                                                        </button>
                                                        <span className="px-6 text-xs font-black font-syne text-white h-full flex items-center border-x border-white/10 italic">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1, storeId)}
                                                            className="w-10 h-full hover:text-[#00F5FF] text-gray-500 hover:bg-white/5 transition-all disabled:opacity-20"
                                                            disabled={item.quantity >= (item.stock ?? 9999)}
                                                        >
                                                            <Plus className="w-3.5 h-3.5 mx-auto" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(item.id, storeId)}
                                                        className="text-[9px] font-black uppercase text-gray-600 hover:text-red-500 transition-colors flex items-center gap-1"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        PURGE
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-8 space-y-6 bg-white/[0.02] border-t border-white/5">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black font-syne uppercase tracking-widest text-gray-500 italic">
                                        <p>Aggregate_Logistics</p>
                                        <p className="text-white text-xs not-italic">{formatPrice(subtotal)}</p>
                                    </div>
                                    <div className="h-[1px] bg-white/5" />
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs font-black font-syne uppercase tracking-[0.3em] text-[#BF00FF] italic">Total_Stream</p>
                                        <p className="text-2xl font-black font-syne text-white tracking-tighter italic">{formatPrice(subtotal)}</p>
                                    </div>
                                </div>

                                <Link
                                    href={`/store/${params.subdomain}/checkout`}
                                    onClick={toggleCart}
                                    className="flex w-full items-center justify-center bg-[#00F5FF] text-black h-16 rounded-2xl font-black font-syne text-xs uppercase tracking-[0.4em] hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all group"
                                >
                                    PROCEED_TO_DEPLOYMENT
                                    <ChevronRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <div className="flex items-center justify-center gap-4 text-[9px] font-black text-gray-500 uppercase tracking-widest italic">
                                    <ShieldCheck className="w-3.5 h-3.5 text-[#00F5FF]" />
                                    SECURE_TUNNEL_ACTIVE
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
