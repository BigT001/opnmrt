'use client';

import React, { useState } from 'react';
import { ProductDetailProps } from '../types';
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Minus, Plus, Star, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useStoreCart } from '@/store/useStoreCart';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { EditableText } from '../EditableContent';

export function ElectshopProductDetail({ product, store, subdomain, isPreview, onConfigChange }: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useStoreCart(store.id);
    const config = store.themeConfig || {};

    const handleSave = (key: string, value: string) => {
        onConfigChange?.({ [key]: value });
    };

    // Fetch primary color from store
    const effectivePrimaryColor = config.primaryColor || store.primaryColor || '#2874f0';

    // Image handling with fallbacks
    const images = product.images?.length ? product.images : [product.image].filter(Boolean) as string[];
    const [selectedImage, setSelectedImage] = useState(images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800');

    const handleAddToCart = () => {
        addItem({ ...product, image: selectedImage }, quantity);
        toast.success(`${product.name} added to cart!`);
    };

    return (
        <section className="bg-white min-h-screen theme-preview-scope text-left">
            {/* Immersive Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] -z-10" style={{ backgroundColor: `${effectivePrimaryColor}0D` }} />

            <div className="max-w-7xl mx-auto px-4 py-8 lg:py-16">
                {/* Breadcrumb / Back Link */}
                <div className="mb-12">
                    <Link
                        href={`/store/${subdomain}/shop`}
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 transition-colors group"
                        style={{ hover: { color: effectivePrimaryColor } } as any}
                    >
                        <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        <EditableText
                            value={config.pdBackLabel || 'Back to Collection'}
                            onSave={(val: string) => handleSave('pdBackLabel', val)}
                            isPreview={isPreview}
                            label="Back Label"
                        />
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                    {/* Visuals - Interactive Gallery */}
                    <div className="lg:w-[55%] space-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="aspect-[4/5] lg:aspect-square rounded-[3rem] bg-[#f8f9fa] border border-gray-100 overflow-hidden relative group"
                        >
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-full object-contain mix-blend-multiply transition-all duration-700 group-hover:scale-105 p-8 lg:p-12"
                            />

                            {/* Zoom/Expand indicator */}
                            <div className="absolute bottom-8 right-8 w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                <Plus className="w-5 h-5 text-gray-900" />
                            </div>
                        </motion.div>

                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                {images.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`w-24 h-24 rounded-[1.5rem] border-2 shrink-0 transition-all p-2 overflow-hidden ${selectedImage === img ? 'bg-white ring-4' : 'border-gray-100 bg-gray-50 opacity-60 hover:opacity-100 hover:bg-white'}`}
                                        style={{
                                            borderColor: selectedImage === img ? effectivePrimaryColor : undefined,
                                            boxShadow: selectedImage === img ? `0 0 0 4px ${effectivePrimaryColor}1A` : undefined
                                        }}
                                    >
                                        <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-contain mix-blend-multiply" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info - Clean Multi-step Hierarchy */}
                    <div className="lg:w-[45%] flex flex-col pt-4">
                        <div className="space-y-8 mb-12">
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-3"
                                >
                                    <span className="px-3 py-1 bg-gray-900 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                                        <EditableText
                                            value={config.pdBadge || 'Official Series'}
                                            onSave={(val: string) => handleSave('pdBadge', val)}
                                            isPreview={isPreview}
                                            label="Badge"
                                        />
                                    </span>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="text-[10px] font-black text-gray-900 ml-1">
                                            <EditableText
                                                value={config.pdRating || '4.9 / 5.0'}
                                                onSave={(val: string) => handleSave('pdRating', val)}
                                                isPreview={isPreview}
                                                label="Rating"
                                            />
                                        </span>
                                    </div>
                                </motion.div>

                                <h1 className="text-5xl lg:text-[64px] font-black text-gray-950 leading-[0.95] tracking-tighter uppercase italic">
                                    {product.name}
                                </h1>
                            </div>

                            <div className="flex items-end gap-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                        <EditableText
                                            value={config.pdPriceLabel || 'Standard Price'}
                                            onSave={(val: string) => handleSave('pdPriceLabel', val)}
                                            isPreview={isPreview}
                                            label="Price Label"
                                        />
                                    </span>
                                    <p className="text-5xl font-black italic tracking-tighter" style={{ color: effectivePrimaryColor }}>{formatPrice(product.price)}</p>
                                </div>
                                <div className="flex flex-col pb-1">
                                    <span className="text-xl text-gray-300 line-through font-bold tracking-tight">{formatPrice(product.price * 1.4)}</span>
                                    <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest">
                                        <EditableText
                                            value={config.pdSaveLabel || 'Save 40% Today'}
                                            onSave={(val: string) => handleSave('pdSaveLabel', val)}
                                            isPreview={isPreview}
                                            label="Save Label"
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Pulse */}
                        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 mb-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">
                                    <EditableText
                                        value={config.pdStockLabel || 'Inventory Status'}
                                        onSave={(val: string) => handleSave('pdStockLabel', val)}
                                        isPreview={isPreview}
                                        label="Stock Label"
                                    />
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                    <span className="text-[11px] font-black uppercase tracking-widest flex items-center gap-1" style={{ color: effectivePrimaryColor }}>
                                        {product.stock}
                                        <EditableText
                                            value={config.pdStockSuffix || 'Units Available'}
                                            onSave={(val: string) => handleSave('pdStockSuffix', val)}
                                            isPreview={isPreview}
                                            label="Stock Suffix"
                                        />
                                    </span>
                                </div>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (product.stock / 20) * 100)}%` }}
                                    className="h-full"
                                    style={{ backgroundColor: product.stock < 5 ? '#f97316' : effectivePrimaryColor }}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 mb-12">
                            <div className="flex gap-4">
                                <div className="flex items-center bg-gray-100/50 rounded-2xl h-16 px-2">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition-all"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-black text-base italic">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 h-16 text-white rounded-[1.25rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 group"
                                    style={{
                                        backgroundColor: effectivePrimaryColor,
                                        boxShadow: `0 20px 30px -10px ${effectivePrimaryColor}4D`
                                    }}
                                >
                                    <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <EditableText
                                        value={config.pdAddCartLabel || 'Add To Cart'}
                                        onSave={(val: string) => handleSave('pdAddCartLabel', val)}
                                        isPreview={isPreview}
                                        label="Cart Button"
                                    />
                                </button>
                            </div>
                            <button className="w-full h-16 bg-gray-950 text-white rounded-[1.25rem] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-black transition-all flex items-center justify-center gap-2 group shadow-xl">
                                <EditableText
                                    value={config.pdBuyNowLabel || 'Purchase Instantly'}
                                    onSave={(val: string) => handleSave('pdBuyNowLabel', val)}
                                    isPreview={isPreview}
                                    label="Buy Button"
                                />
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Trust & Features */}
                        <div className="grid grid-cols-2 gap-4 py-8 border-t border-gray-100">
                            {[
                                { key: 'pdFeat1', icon: Truck, text: "Global Delivery" },
                                { key: 'pdFeat2', icon: ShieldCheck, text: "Official Warrantee" },
                                { key: 'pdFeat3', icon: RotateCcw, text: "30-Day Policy" },
                                { key: 'pdFeat4', icon: Star, text: "Premium Quality" }
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${effectivePrimaryColor}0D` }}>
                                        <feature.icon className="w-4 h-4" style={{ color: effectivePrimaryColor }} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                                        <EditableText
                                            value={config[feature.key] || feature.text}
                                            onSave={(val: string) => handleSave(feature.key, val)}
                                            isPreview={isPreview}
                                            label="Feature"
                                        />
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Detailed Spec / Description Section */}
                <div className="mt-24 pt-24 border-t border-gray-100 max-w-4xl">
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic mb-8 underline decoration-4 underline-offset-8" style={{ textDecorationColor: effectivePrimaryColor }}>
                        <EditableText
                            value={config.pdDescTitle || 'Product Narrative'}
                            onSave={(val: string) => handleSave('pdDescTitle', val)}
                            isPreview={isPreview}
                            label="Desc Title"
                        />
                    </h2>
                    <div className="prose prose-lg prose-slate max-w-none">
                        <div className="text-gray-500 leading-relaxed font-medium text-lg italic">
                            {product.description || `The high-performance ${product.name} is designed for users who demand excellence in every interaction. Featuring state-of-the-art technology and premium aesthetics, this piece redefines what is possible in modern technology.`}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
