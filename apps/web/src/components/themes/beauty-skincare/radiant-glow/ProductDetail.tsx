'use client';

import { ProductDetailProps } from '../../types';
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, ShoppingBag, Check, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function RadiantGlowProductDetail({ product, store, subdomain }: ProductDetailProps) {
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
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <section className="max-w-[1400px] mx-auto px-10 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* Image Gallery Column - 7/12 */}
                <div className="lg:col-span-7 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="aspect-[4/5] w-full relative rounded-[60px] overflow-hidden bg-white shadow-[0_40px_100px_rgba(193,154,107,0.1)] border border-[#C19A6B]/5"
                    >
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={selectedImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                src={selectedImage || images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        </AnimatePresence>

                        {/* Light Leak Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#E2AFA2]/20 via-transparent to-transparent pointer-events-none" />

                        <button className="absolute top-8 right-8 p-4 bg-white/40 backdrop-blur-md rounded-full text-[#2D1E1E] hover:bg-white hover:text-[#C19A6B] transition-all duration-500 shadow-xl border border-white/20">
                            <Heart className="w-5 h-5" />
                        </button>
                    </motion.div>

                    {images.length > 1 && (
                        <div className="flex items-center gap-6 justify-center">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative w-24 aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all duration-500 ${selectedImage === img ? 'border-[#C19A6B] scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                                        }`}
                                >
                                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info Column - 5/12 */}
                <div className="lg:col-span-5 flex flex-col pt-12">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-10"
                    >
                        {/* Header */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-[#C19A6B]">
                                <Sparkles className="w-4 h-4 fill-current" />
                                <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-black">Luminous Collection</span>
                            </div>
                            <h1 className="text-6xl font-luminous text-[#2D1E1E] leading-tight mb-2">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-6">
                                <p className="text-3xl font-sans font-bold text-[#C19A6B]">{formatPrice(product.price)}</p>
                                <div className="h-4 w-[1px] bg-[#C19A6B]/20" />
                                <div className="flex items-center gap-1 text-[#C19A6B]/60">
                                    <span className="text-[10px] uppercase tracking-widest font-black">4.9 Skin Score</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="prose prose-sm prose-slate">
                                <p className="text-[#2D1E1E]/60 leading-loose font-sans text-sm selection:bg-[#C19A6B]/20">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-6 bg-white/40 backdrop-blur-xl p-6 rounded-[32px] border border-[#C19A6B]/10">
                            <div className="flex flex-col gap-2">
                                <ShieldCheck className="w-5 h-5 text-[#C19A6B]" />
                                <span className="text-[10px] uppercase tracking-widest font-black text-[#2D1E1E]">Tested Efficacy</span>
                                <span className="text-[9px] text-[#2D1E1E]/40 font-sans leading-none">Dermatologically Certified</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Sparkles className="w-5 h-5 text-[#C19A6B]" />
                                <span className="text-[10px] uppercase tracking-widest font-black text-[#2D1E1E]">Radiance Factor</span>
                                <span className="text-[9px] text-[#2D1E1E]/40 font-sans leading-none">Instant Glow Effect</span>
                            </div>
                        </div>

                        {/* Interaction Area */}
                        <div className="space-y-10 pt-6">
                            {/* Quantity */}
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#2D1E1E]">Ritual Dose</span>
                                <div className="flex items-center bg-white border border-[#C19A6B]/10 rounded-full p-1 shadow-sm">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#FFF9F0] text-[#2D1E1E]/40 hover:text-[#C19A6B] transition-colors"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-12 text-center font-sans text-xs font-bold text-[#2D1E1E]">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#FFF9F0] text-[#2D1E1E]/40 hover:text-[#C19A6B] transition-colors"
                                        disabled={quantity >= product.stock}
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            {/* Add to Bag */}
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || added}
                                className="group relative w-full h-20 bg-[#2D1E1E] text-white rounded-[40px] overflow-hidden transition-all duration-700 disabled:opacity-50"
                            >
                                <div className="absolute inset-0 bg-[#C19A6B] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1]" />
                                <div className="relative z-10 flex items-center justify-center gap-4">
                                    <AnimatePresence mode="wait">
                                        {added ? (
                                            <motion.div
                                                key="added"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-3"
                                            >
                                                <Check className="w-5 h-5" />
                                                <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-black">Added to Aura</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="add"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="flex items-center gap-3"
                                            >
                                                <ShoppingBag className="w-4 h-4" />
                                                <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-black">Begin the Ritual</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </button>

                            <p className="text-center font-sans text-[9px] uppercase tracking-[0.2em] text-[#2D1E1E]/40">
                                {product.stock > 0 ? (
                                    <span>Only {product.stock} light-harvested items remaining</span>
                                ) : (
                                    <span className="text-[#E2AFA2]">Aura currently unavailable</span>
                                )}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}


