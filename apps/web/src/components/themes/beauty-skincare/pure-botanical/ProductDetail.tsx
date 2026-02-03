'use client';

import { ProductDetailProps } from '../../types';
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, ShoppingBag, Check, Leaf, Shield, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PureBotanicalProductDetail({ product, store, subdomain }: ProductDetailProps) {
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
        <div className="max-w-[1400px] mx-auto px-10 py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">

                {/* Image Gallery - Therapeutic Display */}
                <div className="space-y-8 sticky top-32">
                    <div className="aspect-[4/5] w-full overflow-hidden rounded-[48px] bg-[#F2EBE9]/50 shadow-2xl shadow-[#7C9082]/5 relative group">
                        <motion.img
                            key={selectedImage}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            src={selectedImage || images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute top-8 left-8 p-3 bg-white/40 backdrop-blur-md rounded-full border border-white/40">
                            <Leaf className="w-5 h-5 text-[#7C9082]" />
                        </div>
                    </div>

                    {images.length > 1 && (
                        <div className="flex gap-6 justify-center">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-24 aspect-[4/5] rounded-[20px] overflow-hidden border-2 transition-all duration-500 ${selectedImage === img ? 'border-[#7C9082] scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                                        }`}
                                >
                                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Information - Minimalist Clarity */}
                <div className="space-y-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-[#7C9082]">
                            <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold">Nature's Essence</span>
                            <div className="h-[1px] w-12 bg-[#7C9082]/30" />
                        </div>
                        <h1 className="text-6xl md:text-7xl font-serif text-[#1C2B21] tracking-tight leading-none">
                            {product.name}
                        </h1>
                        <p className="text-4xl font-serif text-[#7C9082] italic">{formatPrice(product.price)}</p>
                    </div>

                    {product.description && (
                        <div className="space-y-6">
                            <p className="font-serif italic text-2xl text-[#1C2B21]/60 leading-relaxed">
                                "{product.description}"
                            </p>
                        </div>
                    )}

                    {/* Botanical Benefits Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 rounded-[32px] bg-white border border-[#7C9082]/10 space-y-3">
                            <div className="w-10 h-10 rounded-full bg-[#7C9082]/10 flex items-center justify-center text-[#7C9082]">
                                <Shield className="w-5 h-5" />
                            </div>
                            <h4 className="font-sans text-[10px] uppercase tracking-widest font-black text-[#1C2B21]">Purity Standard</h4>
                            <p className="font-serif text-sm text-[#1C2B21]/60">100% Organic certified, zero synthetic additives.</p>
                        </div>
                        <div className="p-6 rounded-[32px] bg-white border border-[#7C9082]/10 space-y-3">
                            <div className="w-10 h-10 rounded-full bg-[#7C9082]/10 flex items-center justify-center text-[#7C9082]">
                                <Leaf className="w-5 h-5" />
                            </div>
                            <h4 className="font-sans text-[10px] uppercase tracking-widest font-black text-[#1C2B21]">Sourcing</h4>
                            <p className="font-serif text-sm text-[#1C2B21]/60">Ethically harvested from volcanic heritage soils.</p>
                        </div>
                    </div>

                    <div className="space-y-10 pt-8 border-t border-[#7C9082]/10">
                        {/* Quantity & Stock */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-3">
                                <label className="font-sans text-[10px] uppercase tracking-[0.3em] font-black text-[#1C2B21]/40">Allocation Count</label>
                                <div className="flex items-center gap-6 p-2 bg-[#F9FAF8] rounded-full border border-[#7C9082]/10 shadow-inner">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-[#1C2B21]/40 hover:text-[#1C2B21] transition-all"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="font-sans font-bold text-lg text-[#1C2B21] w-4 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-[#1C2B21]/40 hover:text-[#1C2B21] transition-all"
                                        disabled={quantity >= product.stock}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <span className="font-sans text-[10px] uppercase tracking-widest text-[#7C9082] block">Inventory Status</span>
                                <span className={`font-serif italic text-lg ${product.stock > 0 ? 'text-[#1C2B21]' : 'text-red-400'}`}>
                                    {product.stock > 0 ? `${product.stock} units available` : 'Replenishing soon'}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || added}
                                className="flex-1 group relative h-20 bg-[#1C2B21] text-white rounded-full overflow-hidden shadow-2xl shadow-[#1C2B21]/20 transition-all duration-500"
                            >
                                <div className="relative z-10 flex items-center justify-center gap-4">
                                    <AnimatePresence mode="wait">
                                        {added ? (
                                            <motion.div
                                                key="added"
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="flex items-center gap-3"
                                            >
                                                <Check className="w-6 h-6" />
                                                <span className="font-sans text-sm font-bold uppercase tracking-[0.3em]">Added!</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="add"
                                                initial={{ y: -20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="flex items-center gap-3"
                                            >
                                                <ShoppingBag className="w-6 h-6" />
                                                <span className="font-sans text-sm font-bold uppercase tracking-[0.3em]">Gather Selection</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="absolute inset-0 bg-[#7C9082] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1]" />
                            </button>

                            <button className="w-20 h-20 rounded-full border border-[#1C2B21]/10 flex items-center justify-center text-[#1C2B21]/30 hover:text-[#7C9082] hover:border-[#7C9082] hover:bg-[#7C9082]/5 transition-all transition-all duration-500">
                                <Heart className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


