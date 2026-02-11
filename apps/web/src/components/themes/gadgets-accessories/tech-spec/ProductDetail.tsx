'use client';

import { ProductDetailProps } from '../../types';
import { useCartStore } from '@/store/useCartStore';
import { useState } from 'react';
import { ShoppingCart, Star, Shield, Zap, Truck, Check, ChevronRight, Activity, Cpu, Battery, Globe } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

export function TechSpecProductDetail({ product, store, subdomain }: ProductDetailProps) {
    const { addItem } = useCartStore();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image || undefined,
            storeId: store.id,
            stock: product.stock || 0,
        }, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="min-h-screen bg-white font-data">
            <div className="max-w-[1400px] mx-auto px-10 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">

                    {/* Hardware Visual Gallery */}
                    <div className="space-y-8 lg:sticky lg:top-40">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="aspect-square bg-gray-50 border border-gray-100 rounded-sm overflow-hidden p-12 lg:p-20 relative group"
                        >
                            <img
                                src={product.image || 'https://via.placeholder.com/600'}
                                alt={product.name}
                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000"
                            />
                            {/* Technical Overlay */}
                            <div className="absolute top-8 left-8 flex items-center gap-3 text-[10px] font-black text-[#E72E46] uppercase tracking-[0.3em] bg-white/80 backdrop-blur-md px-4 py-2 border border-black/5">
                                <Activity className="w-3 h-3 animate-pulse" />
                                Hardware Verification: Active
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-4 gap-4">
                            {[product.image, ...(product.images || [])].slice(0, 4).map((img, i) => (
                                <div key={i} className="aspect-square bg-gray-50 border border-gray-100 rounded-sm p-4 cursor-pointer hover:border-[#E72E46] transition-all group">
                                    <img
                                        src={img || 'https://via.placeholder.com/200'}
                                        alt={`Angle ${i}`}
                                        className="w-full h-full object-contain grayscale group-hover:grayscale-0"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Technical Specifications & Actions */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                                <span>Hardware Hub</span>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-[#E72E46]">{subdomain.toUpperCase()} NODE</span>
                            </div>

                            <motion.h1
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-5xl font-black uppercase italic tracking-tighter text-gray-900 leading-[0.9]"
                            >
                                {product.name}
                            </motion.h1>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-1 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">(128 VERIFIED REVIEWS)</span>
                            </div>
                        </div>

                        <div className="p-10 bg-gray-50 border border-gray-100 rounded-sm space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E72E46]/5 rounded-bl-full -mr-16 -mt-16" />

                            <div className="relative z-10 space-y-2">
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Acquisition Price</p>
                                <div className="flex items-end gap-4">
                                    <span className="text-5xl font-black text-black tracking-tighter italic">{formatPrice(product.price)}</span>
                                    <span className="text-gray-300 text-lg line-through italic font-black uppercase mb-1 font-data">{formatPrice(product.price * 1.2)}</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-600">
                                    <span>Quantity Allocation:</span>
                                    <div className="flex items-center border border-gray-200">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 hover:bg-white transition-colors" disabled={quantity <= 1}>-</button>
                                        <span className="w-12 h-10 flex items-center justify-center bg-white border-x border-gray-200">{quantity}</span>
                                        <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-10 hover:bg-white transition-colors" disabled={quantity >= product.stock}>+</button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0 || added}
                                        className="flex-1 bg-[#E72E46] text-white h-16 font-black text-xs uppercase tracking-[0.4em] hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {added ? (
                                            <>
                                                <Check className="w-5 h-5" />
                                                ALLOCATED
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-5 h-5 group-hover:animate-bounce" />
                                                Acquire Hardware
                                            </>
                                        )}
                                    </button>
                                    <button className="w-16 h-16 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors rounded-sm">
                                        <Activity className="w-6 h-6 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Hardware Spec Wall */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12">
                            {[
                                { icon: Cpu, label: "PROCESSOR", value: "CORE-X9" },
                                { icon: Battery, label: "ENDURANCE", value: "48HRS ACTIVE" },
                                { icon: Globe, label: "NETWORK", value: "5G OPTIMIZED" },
                                { icon: Shield, label: "SECURITY", value: "E2E ENCRYPTION" },
                                { icon: Zap, label: "PERFORMANCE", value: "ULTRA-SPEC" },
                                { icon: Truck, label: "ORIGIN", value: "GLOBAL STOCK" }
                            ].map((spec, i) => {
                                const Icon = spec.icon;
                                return (
                                    <div key={i} className="space-y-3">
                                        <div className="flex items-center gap-2 text-[#E72E46]">
                                            <Icon className="w-4 h-4" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">{spec.label}</span>
                                        </div>
                                        <p className="font-black text-xs uppercase italic tracking-tight text-gray-900">{spec.value}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="space-y-6 pt-12 border-t border-gray-100">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter">Hardware Overview</h3>
                            <p className="text-sm text-gray-500 leading-relaxed font-data">
                                {product.description || "Defining the architectural standard for high-performance hardware. This unit features advanced circuitry, optimized heat dissipation, and a seamless interface for critical digital infrastructure."}
                            </p>
                            <ul className="space-y-3">
                                {["Military-grade housing", "Zero-latency transmission", "Next-gen cooling architecture"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 bg-[#E72E46] rotate-45" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
