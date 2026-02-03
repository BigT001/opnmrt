'use client';

import { ProductDetailProps } from '../../types';
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Zap, Check, Terminal, Box, Shield, Activity, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function StarkEdgeProductDetail({ product, store, subdomain }: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(product.image || '');
    const [added, setAdded] = useState(false);
    const { addItem } = useCartStore();

    const images = product.images && product.images.length > 0
        ? product.images
        : [product.image || 'https://via.placeholder.com/600'];

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image || undefined,
            storeId: store.id,
        }, quantity);

        setAdded(true);
        setTimeout(() => setAdded(false), 3000);
    };

    return (
        <section className="bg-[#080808] min-h-screen pt-32 pb-24 px-10">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Left: Asset Technical Display (8 cols) */}
                    <div className="lg:col-span-12 xl:col-span-8 space-y-12">
                        <header className="space-y-4 border-l-4 border-[#00F0FF] pl-10">
                            <div className="flex items-center gap-4 text-[#00F0FF]">
                                <Terminal className="w-4 h-4" />
                                <span className="font-data text-[10px] uppercase tracking-[0.4em]">Device_Specification_v4.2</span>
                            </div>
                            <h1 className="text-7xl font-tactical font-black text-white uppercase tracking-tighter leading-[0.9]">
                                {product.name}
                            </h1>
                        </header>

                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Detailed Hardware Spec Wall */}
                            <div className="bg-[#111] border border-[#333] p-10 space-y-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F0FF]/5 rounded-full blur-3xl" />

                                <h3 className="font-data text-[10px] uppercase tracking-[0.3em] text-[#00F0FF] flex items-center gap-2">
                                    <Cpu className="w-3 h-3" />
                                    Hardware Specification
                                </h3>

                                <div className="space-y-6">
                                    {[
                                        { label: "Model No", val: product.id.substring(0, 12).toUpperCase() },
                                        { label: "Processor", val: "Quantum_A16_Chip" },
                                        { label: "Battery Life", val: "Up to 34h [Heavy_Load]" },
                                        { label: "Connectivity", val: "5G | Wi-Fi 6E | BT 5.3" }
                                    ].map((spec, i) => (
                                        <div key={i} className="flex justify-between items-end border-b border-[#222] pb-4">
                                            <span className="font-data text-[10px] text-white/30 uppercase">{spec.label}</span>
                                            <span className="font-data text-xs text-white font-bold">{spec.val}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-8">
                                    <div className="text-[10px] font-data text-white/30 uppercase mb-4">Device Overview</div>
                                    <p className="font-tactical text-lg text-white/70 leading-relaxed italic">
                                        "{product.description || "Precision engineered for heavy-duty operational excellence and high-fidelity output."}"
                                    </p>
                                </div>
                            </div>

                            {/* Kinetic Image Display */}
                            <div className="space-y-8">
                                <motion.div
                                    key={selectedImage}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="aspect-square bg-[#111] border border-[#333] relative group overflow-hidden"
                                >
                                    <img
                                        src={selectedImage || images[0]}
                                        alt={product.name}
                                        className="h-full w-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 pointer-events-none border-[20px] border-[#080808]" />
                                    <div className="absolute top-8 right-8 bg-[#00F0FF] text-black font-data text-[10px] px-3 py-1 font-bold">
                                        LIVE_FEED_01
                                    </div>

                                    {/* Scanning Lines */}
                                    <div className="absolute inset-x-0 h-1 bg-[#00F0FF] shadow-[0_0_15px_#00F0FF] opacity-20 animate-[sweep_4s_linear_infinite]" />
                                </motion.div>

                                <div className="grid grid-cols-4 gap-4">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            className={`aspect-square bg-[#111] border transition-all relative ${selectedImage === img ? 'border-[#00F0FF]' : 'border-[#333] grayscale opacity-40 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt="Spec" className="w-full h-full object-cover" />
                                            {selectedImage === img && <div className="absolute inset-0 bg-[#00F0FF]/10 animate-pulse" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Operational Controls (4 cols) */}
                    <div className="lg:col-span-12 xl:col-span-4 mt-20 xl:mt-0">
                        <div className="sticky top-32 space-y-12">
                            {/* Deployment HUD */}
                            <div className="bg-[#111] border border-[#333] p-10 space-y-10 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-16 h-1 w-full bg-[#00F0FF]/10" />

                                <div className="space-y-1">
                                    <div className="font-data text-[10px] text-white/30 uppercase tracking-widest">Acquisition Value</div>
                                    <div className="text-6xl font-data font-black text-[#00F0FF] tracking-tighter">
                                        {formatPrice(product.price)}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="font-data text-[10px] uppercase tracking-[0.3em] text-white/30">Select Units</label>
                                    <div className="flex h-20 border border-[#333] bg-[#080808]">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-24 flex items-center justify-center text-white/30 hover:text-[#00F0FF] hover:bg-[#111] transition-all"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="w-6 h-6" />
                                        </button>
                                        <div className="flex-1 flex items-center justify-center font-data text-3xl font-bold text-white border-x border-[#333]">
                                            {quantity < 10 ? `0${quantity}` : quantity}
                                        </div>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="w-24 flex items-center justify-center text-white/30 hover:text-[#00F0FF] hover:bg-[#111] transition-all"
                                            disabled={quantity >= product.stock}
                                        >
                                            <Plus className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0 || added}
                                    className="group relative w-full h-24 bg-white text-black font-tactical font-black uppercase text-sm tracking-[0.3em] overflow-hidden flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {added ? (
                                        <>
                                            <Check className="w-6 h-6" />
                                            <span>Acquired</span>
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-6 h-6" />
                                            <span>Acquire Hardware</span>
                                        </>
                                    )}
                                    <div className="absolute inset-0 bg-[#00F0FF] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[0.16,1,0.3,1] -z-10" />
                                </button>
                            </div>

                            {/* System Output Logs */}
                            <div className="bg-black border border-[#333] p-8 font-data space-y-4">
                                <div className="flex items-center gap-2 text-[#00F0FF]/40">
                                    <Terminal className="w-3 h-3" />
                                    <span className="text-[9px] uppercase tracking-widest font-bold">System_Log_Output</span>
                                </div>
                                <div className="space-y-2 text-[10px] text-white/40">
                                    <AnimatePresence mode="popLayout">
                                        {added ? (
                                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                                                <span className="text-[#00F0FF]">[READY]</span> ASSET_QUEUED_FOR_DEPLOYMENT...<br />
                                                <span className="text-[#00F0FF]">[INFO]</span> UNIT_COUNT: {quantity}<br />
                                                <span className="text-[#00F0FF]">[INFO]</span> TOTAL_VALUE: {formatPrice(product.price * quantity)}
                                            </motion.div>
                                        ) : (
                                            <div>
                                                [IDLE] AWAITING_OPERATIONAL_INPUT...<br />
                                                [IDLE] LINK_STABLE
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes sweep {
                    0% { top: -10%; }
                    100% { top: 110%; }
                }
            `}</style>
        </section>
    );
}


