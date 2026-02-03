'use client';

import { ProductDetailProps } from '../../types';
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, ShoppingBag, Check, Share2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function GlamourEveProductDetail({ product, store, subdomain }: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(product.image || '');
    const [added, setAdded] = useState(false);
    const { addItem } = useCartStore();

    const images = product.images && product.images.length > 0
        ? product.images
        : [product.image || 'https://via.placeholder.com/1200x1600'];

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
        <div className="bg-white pt-24 pb-32">
            <div className="max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">

                    {/* Left: Image Gallery (Span 7) */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 border border-black/5">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={selectedImage || images[0]}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    src={selectedImage || images[0]}
                                    alt={product.name}
                                    className="h-full w-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
                                />
                            </AnimatePresence>

                            <div className="absolute top-8 right-8 flex flex-col gap-4">
                                <button className="p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all rounded-full">
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button className="p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all rounded-full">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-6">
                                {images.map((img, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ y: -5 }}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative aspect-[3/4] overflow-hidden border transition-all duration-500 ${(selectedImage === img || (!selectedImage && idx === 0))
                                            ? 'border-[#D4AF37]'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                        {(selectedImage === img || (!selectedImage && idx === 0)) && (
                                            <div className="absolute inset-0 border-2 border-[#D4AF37] pointer-events-none" />
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info (Span 5 - Sticky) */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:col-span-5 lg:sticky lg:top-32 h-fit"
                    >
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <span className="text-[#D4AF37] uppercase tracking-[0.4em] text-[10px] font-black">
                                    L'Édition Limitée
                                </span>
                                <h1 className="text-4xl md:text-6xl font-serif text-black leading-tight tracking-tighter italic">
                                    {product.name}
                                </h1>
                                <div className="flex items-baseline gap-6 border-b border-black/5 pb-8">
                                    <p className="text-3xl font-black text-black tracking-tight italic">
                                        {formatPrice(product.price)}
                                    </p>
                                    <span className="text-black/30 text-sm uppercase tracking-widest">TVA Incluse</span>
                                </div>
                            </div>

                            {product.description && (
                                <div className="space-y-4">
                                    <h2 className="text-[10px] font-black text-black uppercase tracking-[0.3em]">The Narrative</h2>
                                    <p className="text-black/60 text-sm leading-relaxed font-light tracking-wide lg:max-w-md">
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-8 py-8 border-y border-black/5">
                                <div>
                                    <h3 className="text-[10px] font-black text-black uppercase tracking-[0.3em] mb-4">Availability</h3>
                                    <p className={`text-xs font-bold uppercase tracking-widest ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.stock > 0 ? `En Stock (${product.stock})` : 'Sold Out'}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black text-black uppercase tracking-[0.3em] mb-4">Quantity</h3>
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="text-black/40 hover:text-black transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm font-black w-4 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="text-black/40 hover:text-black transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <div className="space-y-6">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0 || added}
                                    className="group relative w-full h-20 overflow-hidden bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.2)] transition-all"
                                >
                                    <AnimatePresence mode="wait">
                                        {added ? (
                                            <motion.div
                                                key="added"
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -20, opacity: 0 }}
                                                className="absolute inset-0 flex items-center justify-center gap-3 bg-[#D4AF37] text-black"
                                            >
                                                <Check className="w-5 h-5 stroke-[3px]" />
                                                <span className="uppercase tracking-[0.3em] text-[11px] font-black">Added to Bag</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="add"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="absolute inset-0 flex items-center justify-center gap-4 group-hover:bg-[#D4AF37] group-hover:text-black transition-colors duration-500"
                                            >
                                                <ShoppingBag className="w-5 h-5 stroke-[1.5px]" />
                                                <span className="uppercase tracking-[0.3em] text-[11px] font-black">Reserve Piece</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>

                                <p className="text-[9px] text-center text-black/40 uppercase tracking-[0.2em] font-medium leading-relaxed">
                                    Complimentary worldwide shipping on orders above ₦1,000,000. <br />
                                    Handcrafted with precision in our atelier.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}


