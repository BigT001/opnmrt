'use client';

import { ProductPageProps } from '../../types';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, ShoppingBag, Check, ShieldCheck, Beaker, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function VintageCharmProductDetail({ product, store, subdomain }: ProductPageProps) {
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { addItem } = useCartStore();

    useEffect(() => {
        setMounted(true);
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
        <div className="bg-[#F9F4EE] min-h-screen pt-48 pb-32">
            <div className="max-w-[1600px] mx-auto px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">

                    {/* Image Archive Display */}
                    <div className="relative group">
                        <div className="bg-white p-8 vintage-border shadow-[0_20px_60px_rgba(27,48,34,0.08)]">
                            <div className="aspect-[4/5] overflow-hidden border border-[#1B3022]/10 relative group-hover:border-[#1B3022]/30 transition-all duration-700">
                                <img
                                    src={product.image || 'https://via.placeholder.com/800'}
                                    alt={product.name}
                                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-[#1B3022]/5 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>

                        {/* Decorative Botanical Tag */}
                        <div className="absolute -top-12 -right-12 w-48 h-48 pointer-events-none opacity-20">
                            <motion.img
                                animate={{ rotate: 360 }}
                                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                src="https://www.transparenttextures.com/patterns/natural-paper.png"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Formula Details */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <span className="font-cursive text-3xl text-[#8B4513]">Archival Selection</span>
                                <div className="h-[1px] flex-grow bg-[#1B3022]/10" />
                                <span className="font-mono text-[9px] tracking-widest text-[#1B3022]/50 uppercase">Item_743_v2</span>
                            </div>

                            <h1 className="text-7xl md:text-8xl font-black text-[#1B3022] tracking-tighter uppercase italic leading-[0.9]">
                                {product.name}
                            </h1>

                            <div className="flex items-center justify-between pt-4">
                                <p className="text-4xl font-serif italic text-[#1B3022]">
                                    {formatPrice(product.price)}
                                </p>
                                <div className="flex items-center gap-3">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-2 h-2 rounded-full bg-[#1B3022]/20" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Laboratory Specification Blocks */}
                        <div className="grid grid-cols-2 gap-6 pt-10 border-t border-[#1B3022]/10">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-[#8B4513]">
                                    <Beaker className="w-4 h-4" />
                                    <h3 className="font-bold text-[10px] uppercase tracking-widest">Core_Compound</h3>
                                </div>
                                <p className="font-serif italic text-sm text-[#1B3022]/70">Centuries-old botanical wisdom blended with modern efficacy.</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-[#8B4513]">
                                    <Leaf className="w-4 h-4" />
                                    <h3 className="font-bold text-[10px] uppercase tracking-widest">Origin_Source</h3>
                                </div>
                                <p className="font-serif italic text-sm text-[#1B3022]/70">Sustainably harvested from protected heritage gardens.</p>
                            </div>
                        </div>

                        {/* Description Archival Entry */}
                        <div className="space-y-6 pt-10">
                            <h3 className="font-cursive text-3xl text-[#8B4513]">The Journal Entry</h3>
                            <div className="bg-white/50 p-8 vintage-border italic font-serif text-xl leading-relaxed text-[#1B3022]/80">
                                "{product.description || "This archived formula awaits description. Pure and potent by design."}"
                            </div>
                        </div>

                        {/* Acquisition Interface */}
                        <div className="pt-12 space-y-10">
                            <div className="flex flex-col sm:flex-row items-center gap-8">
                                <div className="flex items-center border-[20px] shadow-lg border-white bg-[#F9F4EE] scale-90 sm:scale-100">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-16 h-16 flex items-center justify-center text-[#1B3022] hover:bg-[#1B3022] hover:text-[#F9F4EE] transition-all"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="w-20 text-center font-black text-3xl italic tracking-tighter text-[#1B3022]">
                                        {quantity.toString().padStart(2, '0')}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-16 h-16 flex items-center justify-center text-[#1B3022] hover:bg-[#1B3022] hover:text-[#F9F4EE] transition-all"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={added}
                                    className="flex-grow bg-[#1B3022] text-[#F9F4EE] py-6 px-12 text-2xl font-black uppercase italic tracking-tighter hover:bg-[#8B4513] transition-all active:scale-95 disabled:opacity-50 group flex items-center justify-center gap-6"
                                >
                                    <AnimatePresence mode="wait">
                                        {added ? (
                                            <motion.div
                                                key="checked"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-4"
                                            >
                                                <Check className="w-8 h-8" />
                                                <span>Archived Successfully</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="buy"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="flex items-center gap-4"
                                            >
                                                <span>Acquire for Private Use</span>
                                                <ShoppingBag className="w-7 h-7" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-8 font-mono text-[9px] text-[#1B3022]/40 tracking-[0.2em] font-bold uppercase border-t border-[#1B3022]/10 pt-10">
                                <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-[#8B4513]" /> Purity_Guaranteed</span>
                                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#8B4513] rounded-full" /> Batch_No: {mounted ? Math.floor(Math.random() * 9000) + 1000 : '....'}</span>
                                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#8B4513] rounded-full" /> Lab_Tested_OK</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


