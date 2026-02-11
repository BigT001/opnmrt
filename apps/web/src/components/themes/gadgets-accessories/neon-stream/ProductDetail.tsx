'use client';

import { ProductDetailProps } from '../../types';
import { useCartStore } from '@/store/useCartStore';
import { useState } from 'react';
import { Zap, Star, Shield, Truck, Heart, Activity, Cpu, Battery, Globe, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

export function NeonStreamProductDetail({ product, store, subdomain }: ProductDetailProps) {
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
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-[1400px] mx-auto font-inter">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

                {/* Visual Unit */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="aspect-square bg-white/[0.02] border border-white/5 rounded-[40px] p-12 flex items-center justify-center relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00F5FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <img
                            src={product.image || 'https://via.placeholder.com/800'}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000 relative z-10"
                        />

                        {/* Live Proof Label */}
                        <div className="absolute top-8 left-8 flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full">
                            <span className="w-2 h-2 bg-[#00F5FF] rounded-full animate-ping" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white italic">LIVE_STOCK // {product.stock || 0} UNITS LEFT</span>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-4 gap-4">
                        {[product.image, ...(product.images || [])].slice(0, 4).map((img, i) => (
                            <div key={i} className="aspect-square bg-white/[0.02] border border-white/5 rounded-2xl p-4 cursor-pointer hover:border-[#00F5FF]/50 transition-all group">
                                <img src={img || 'https://via.placeholder.com/200'} alt="" className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Configuration Unit */}
                <div className="flex flex-col">
                    <div className="space-y-6 flex-grow">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black font-syne tracking-[0.4em] text-[#BF00FF] uppercase italic">System_Protocol_v8.4</span>
                            <div className="h-[1px] flex-grow bg-white/10" />
                        </div>

                        <motion.h1
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl md:text-7xl font-black font-syne tracking-tighter uppercase italic text-white leading-[0.85]"
                        >
                            {product.name}
                        </motion.h1>

                        <div className="flex items-center gap-8 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-[#00F5FF] text-[#00F5FF]" />
                                    ))}
                                </div>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mt-1">128 LOGS</span>
                            </div>
                            <div className="h-4 w-[1px] bg-white/10" />
                            <span className="text-2xl font-black font-syne italic text-[#00F5FF] tracking-tighter">{formatPrice(product.price)}</span>
                        </div>

                        <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                            {product.description || "Unleash extreme processing efficiency with our flagship hardware unit. Engineered for ultra-low latency streams and high-fidelity output. The ultimate upgrade for any advanced ecosystem."}
                        </p>

                        {/* Hardware Matrix */}
                        <div className="grid grid-cols-2 gap-6 pt-8 pb-12">
                            {[
                                { icon: Cpu, label: "CORE", val: "SYNAPSE_X" },
                                { icon: Activity, label: "FREQ", val: "5.4GHZ" },
                                { icon: Battery, label: "LOAD", val: "OPTIMIZED" },
                                { icon: Globe, label: "NODE", val: "GLOBAL" },
                            ].map((spec, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-500 group-hover:text-[#00F5FF] group-hover:border-[#00F5FF]/50 transition-all">
                                        <spec.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{spec.label}</p>
                                        <p className="text-[10px] font-black text-white uppercase tracking-tighter italic">{spec.val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Acquisition Flow */}
                    <div className="mt-12 space-y-8 p-10 bg-white/[0.03] border border-white/5 rounded-[32px] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F5FF]/5 rounded-bl-full -mr-16 -mt-16 blur-xl" />

                        <div className="flex items-center justify-between relative z-10">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Aggregate_Price</p>
                                <p className="text-4xl font-black font-syne italic text-white tracking-tighter">{formatPrice(product.price * quantity)}</p>
                            </div>

                            <div className="flex items-center border border-white/10 bg-black/40 rounded-xl overflow-hidden h-12">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full hover:bg-white/5 transition-colors text-gray-400">-</button>
                                <span className="px-6 text-xs font-black text-white border-x border-white/10 h-full flex items-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                                    className="w-12 h-full hover:bg-white/5 transition-colors text-gray-400"
                                    disabled={quantity >= (product.stock || 0)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4 relative z-10">
                            <button
                                onClick={handleAddToCart}
                                disabled={added || (product.stock || 0) <= 0}
                                className="flex-1 bg-[#00F5FF] text-black h-16 rounded-2xl font-black font-syne text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all active:scale-95 group disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                            >
                                {product.stock <= 0 ? (
                                    <>
                                        OFFLINE_MANIFEST
                                    </>
                                ) : added ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        SYNCED_TO_STREAM
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5 group-hover:fill-current transition-all" />
                                        INITIALIZE_REQUISITION
                                    </>
                                )}
                            </button>
                            <button className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:border-[#BF00FF]/50 hover:text-[#BF00FF] transition-all">
                                <Heart className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest pt-4 relative z-10">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-[#00F5FF]" />
                                2YR_SYSTEM_WARRANTY
                            </div>
                            <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-[#BF00FF]" />
                                GLOBAL_DEPLOYMENT
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
