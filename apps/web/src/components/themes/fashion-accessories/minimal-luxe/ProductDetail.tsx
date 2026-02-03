'use client';

import { ProductDetailProps } from '../../types';
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Minus, Plus, ShoppingBag, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

export function MinimalLuxeProductDetail({ product, store, subdomain }: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(product.image || '');
    const [added, setAdded] = useState(false);
    const { addItem } = useCartStore();

    const images = product.images && product.images.length > 0
        ? product.images
        : [product.image || 'https://via.placeholder.com/600'];

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.image || undefined,
                storeId: store.id,
            });
        }
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    {/* Image Gallery - Left Side */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="aspect-[4/5] w-full overflow-hidden bg-[#F9F9F9] relative group shadow-2xl shadow-slate-200/50"
                        >
                            <img
                                src={selectedImage || images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                            />
                            {/* Accent line */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-900 overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                />
                            </div>
                        </motion.div>

                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`aspect-square overflow-hidden transition-all duration-500 ${selectedImage === img
                                            ? 'ring-2 ring-gray-900 ring-offset-4'
                                            : 'opacity-50 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info - Right Side */}
                    <div className="flex flex-col pt-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Collections / Minimal</span>
                                    <div className="h-px bg-gray-100 flex-1"></div>
                                </div>
                                <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9] lg:text-7xl">
                                    {product.name}
                                </h1>
                                <p className="text-3xl font-black text-gray-900 tracking-tightest">
                                    {formatPrice(product.price)}
                                </p>
                            </div>

                            <div className="h-px bg-gray-100 w-full"></div>

                            {product.description && (
                                <div className="space-y-4">
                                    <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.4em]">The Detail</h2>
                                    <p className="text-gray-500 font-medium leading-relaxed text-sm max-w-lg">
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-full">
                                        <Truck className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Free Express</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-full">
                                        <ShieldCheck className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">2Y Warranty</span>
                                </div>
                            </div>

                            <div className="space-y-10 pt-4">
                                {/* Quantity Selection */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em] block">
                                        Quantity
                                    </label>
                                    <div className="flex items-center space-x-8">
                                        <div className="flex items-center border border-gray-100 bg-gray-50/50 p-1">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-12 h-12 flex items-center justify-center hover:bg-white transition-colors"
                                                disabled={quantity <= 1}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-12 text-center text-sm font-black text-gray-900">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                className="w-12 h-12 flex items-center justify-center hover:bg-white transition-colors"
                                                disabled={quantity >= product.stock}
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            {product.stock > 0 ? (
                                                <span className="text-emerald-500">{product.stock} units available</span>
                                            ) : (
                                                <span className="text-rose-500">Out of Stock</span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Purchase Action */}
                                <div className="pt-4 flex gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0 || added}
                                        className="flex-1 group relative overflow-hidden bg-gray-900 text-white py-6 px-8 transition-all active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-gray-900/10"
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-4">
                                            {added ? (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">In Collection</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingBag className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Add to Collection</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 w-0 bg-primary transition-all duration-700 ease-out group-hover:w-full opacity-10" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

