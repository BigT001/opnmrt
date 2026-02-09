'use client';

import React, { useState } from 'react';
import { ProductPageProps } from '../../types';
import { ShoppingBag, ChevronLeft, ChevronRight, Zap, ShieldCheck, Activity } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function ChicUrbanProductDetail({ product, store, subdomain }: ProductPageProps) {
    const { addItem } = useCartStore();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [authCode, setAuthCode] = useState('');

    React.useEffect(() => {
        setMounted(true);
        setAuthCode(Math.random().toString(36).substring(7).toUpperCase());
    }, []);

    if (!mounted) return null;

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image || undefined,
            storeId: store.id,
        }, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="bg-white min-h-screen pt-40 pb-24">
            <div className="max-w-[1800px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Tactical Image System */}
                    <div className="relative group">
                        <div className="border-4 border-black p-4 relative overflow-hidden bg-gray-100">
                            {/* Scanning Effect Overlay */}
                            <motion.div
                                animate={{ y: ["0%", "100%", "0%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-x-0 h-[2px] bg-[#CCFF00] z-20 shadow-[0_0_15px_#CCFF00] opacity-50"
                            />

                            <img
                                src={product.image || 'https://via.placeholder.com/800'}
                                alt={product.name}
                                className="w-full aspect-square object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                            />

                            {/* Corner Technical Metadata */}
                            <div className="absolute top-8 left-8 z-30 font-mono text-[10px] space-y-1">
                                <div className="bg-black text-[#CCFF00] px-2 py-1 flex items-center gap-2">
                                    <Activity className="w-3 h-3" />
                                    <span>ZOOM_LVL: 1.0X</span>
                                </div>
                                <div className="bg-black text-white px-2 py-1">
                                    RES: 2400x2400px
                                </div>
                            </div>
                        </div>

                        {/* Image Metadata Bar */}
                        <div className="mt-4 border-2 border-black p-3 bg-black text-[#CCFF00] font-mono text-[9px] uppercase flex justify-between tracking-widest">
                            <span>Image_ID: CHC_{product.id.substring(0, 12)}</span>
                            <span>Status: Verified</span>
                        </div>
                    </div>

                    {/* Product Interface Details */}
                    <div className="space-y-10">
                        <div className="space-y-4 border-b-4 border-black pb-10">
                            <div className="flex items-center gap-4">
                                <span className="bg-[#CCFF00] text-black px-2 py-0.5 text-[10px] font-black uppercase font-mono tracking-widest">Core_Gear_Archive</span>
                                <span className="text-[10px] font-bold text-black/40">Established [2024]</span>
                            </div>
                            <h1 className="text-7xl font-black uppercase italic tracking-tighter text-black leading-none max-w-xl">
                                {product.name}
                            </h1>
                            <div className="flex items-center justify-between pt-6">
                                <p className="text-4xl font-black italic tracking-tighter text-black">
                                    {formatPrice(product.price)}
                                </p>
                                <div className="flex items-center gap-2 font-mono text-[10px] font-bold">
                                    <ShieldCheck className="w-4 h-4 text-[#CCFF00] fill-black" />
                                    <span>SECURE TRANSACTION VERIFIED</span>
                                </div>
                            </div>
                        </div>

                        {/* Specification Blocks */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="border-2 border-black p-6 space-y-2">
                                <span className="text-[10px] font-black uppercase text-black/40 font-mono">Material_Data</span>
                                <p className="font-bold text-sm uppercase">Reinforced Composite / Urban Grade</p>
                            </div>
                            <div className="border-2 border-black p-6 space-y-2">
                                <span className="text-[10px] font-black uppercase text-black/40 font-mono">Weight_Factor</span>
                                <p className="font-bold text-sm uppercase">Lightweight-System v2</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase text-black/40 font-mono tracking-widest">Description_File</h3>
                            <p className="text-xl font-medium leading-relaxed max-w-xl text-black/80 italic">
                                "{product.description || "No technical description available for this item."}"
                            </p>
                        </div>

                        {/* Transaction Interface */}
                        <div className="pt-10 space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center border-2 border-black">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-6 py-4 hover:bg-black hover:text-[#CCFF00] transition-colors disabled:opacity-30"
                                        disabled={quantity <= 1}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <span className="w-20 text-center font-black text-2xl italic tracking-tighter">
                                        {quantity.toString().padStart(2, '0')}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-6 py-4 hover:bg-black hover:text-[#CCFF00] transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex-grow">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={added}
                                        className="w-full bg-black text-[#CCFF00] py-6 flex items-center justify-center gap-4 group relative overflow-hidden active:scale-95 transition-transform disabled:opacity-50"
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
                                        />
                                        {added ? (
                                            <ShieldCheck className="w-6 h-6 relative z-10" />
                                        ) : (
                                            <ShoppingBag className="w-6 h-6 relative z-10" />
                                        )}
                                        <span className="text-xl font-black uppercase italic tracking-tighter relative z-10">
                                            {added ? "Item Deployed" : "Deploy to Cart // Initiate Order"}
                                        </span>
                                        {!added && <Zap className="w-5 h-5 text-[#CCFF00] fill-black relative z-10 animate-pulse" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4 font-mono text-[9px] text-black/40 uppercase font-black">
                                <span className="flex items-center gap-1"><span className="w-1 h-1 bg-black rotate-45" /> WORLDWIDE_SHIPMENT_OK</span>
                                <span className="flex items-center gap-1"><span className="w-1 h-1 bg-black rotate-45" /> EST_DELIVERY: 3-5_DAYS</span>
                                <span className="flex items-center gap-1"><span className="w-1 h-1 bg-black rotate-45" /> AUTH_CODE: {authCode}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


