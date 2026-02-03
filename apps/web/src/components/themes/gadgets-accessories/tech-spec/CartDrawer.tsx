'use client';

import { CartDrawerProps } from '../../types';
import { X, Minus, Plus, Trash2, ShoppingBag, Terminal, Activity, ChevronRight, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

export function TechSpecCartDrawer({ }: CartDrawerProps) {
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
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-white shadow-2xl flex flex-col font-data"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-3">
                                <Terminal className="w-5 h-5 text-[#E72E46]" />
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 italic">Hardware Manifest</h2>
                            </div>
                            <button
                                onClick={toggleCart}
                                className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#E72E46] hover:text-white transition-all group"
                                aria-label="Close manifest"
                            >
                                <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center rounded-sm">
                                        <ShieldAlert className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest italic">Inventory Empty</h3>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">No hardware units detected in active queue.</p>
                                    </div>
                                    <button
                                        onClick={toggleCart}
                                        className="text-[#E72E46] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#E72E46] hover:text-white px-6 py-3 border border-[#E72E46] transition-all"
                                    >
                                        INITIALIZE SHOPPING
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
                                            <div className="h-24 w-24 bg-gray-50 border border-gray-100 rounded-sm p-2 flex-shrink-0 relative">
                                                <img
                                                    src={item.image || 'https://via.placeholder.com/400'}
                                                    alt={item.name}
                                                    className="h-full w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                                                />
                                                <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#E72E46] text-white text-[9px] font-black flex items-center justify-center italic">
                                                    #{idx + 1}
                                                </div>
                                            </div>

                                            <div className="flex flex-1 flex-col justify-between py-1">
                                                <div className="space-y-1">
                                                    <h3 className="text-[10px] font-black uppercase tracking-tight text-gray-900 leading-tight italic">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-[#E72E46] font-black text-xs italic tracking-tighter">
                                                        {formatPrice(item.price)} <span className="text-gray-300 text-[9px] font-bold not-italic ml-2">@ Unit</span>
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center border border-gray-100 h-8">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-8 h-full hover:bg-gray-50 text-gray-400 font-bold"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-4 text-[10px] font-black text-gray-900 border-x border-gray-100 h-full flex items-center uppercase">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-full hover:bg-gray-50 text-gray-400 font-bold"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-[9px] font-black uppercase text-gray-300 hover:text-[#E72E46] transition-colors flex items-center gap-1"
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
                            <div className="p-8 space-y-6 bg-gray-50 border-t border-gray-100">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-gray-400 italic">
                                        <p>Subtotal Logistics</p>
                                        <p className="text-gray-900 text-sm not-italic">{formatPrice(totalPrice())}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-gray-400 italic">
                                        <p>Network Fee</p>
                                        <p className="text-green-500">EXEMPT</p>
                                    </div>
                                    <div className="h-[1px] bg-gray-200" />
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#E72E46] italic">Total Aggregate</p>
                                        <p className="text-2xl font-black text-black tracking-tighter italic">{formatPrice(totalPrice())}</p>
                                    </div>
                                </div>

                                <Link
                                    href={`/store/${params.subdomain}/checkout`}
                                    onClick={toggleCart}
                                    className="flex w-full items-center justify-center bg-black text-white h-16 font-black text-xs uppercase tracking-[0.4em] hover:bg-[#E72E46] transition-all group"
                                >
                                    PROCEED TO ACQUISITION
                                    <ChevronRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
                                </Link>

                                <div className="flex items-center justify-center gap-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                    <Activity className="w-3 h-3 text-green-500" />
                                    Secure Transmission Buffer Active
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
