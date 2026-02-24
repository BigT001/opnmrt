'use client';

import React from 'react';
import { ProductDetailProps } from '../types';
import { useStoreCart } from '@/store/useStoreCart';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, Star, Heart, Share2, Plus, Minus, ArrowRight, Truck, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function VantageProductDetail({ product, store, subdomain }: ProductDetailProps) {
    const { addItem, toggleCart } = useStoreCart(store.id);
    const [quantity, setQuantity] = React.useState(1);
    const [selectedImage, setSelectedImage] = React.useState(product.image || product.images?.[0] || 'https://via.placeholder.com/800');
    const [selectedSize, setSelectedSize] = React.useState(product.sizes?.[0] || '');

    const isOutOfStock = (product.stock || 0) <= 0;
    const allImages = React.useMemo(() => {
        const imgs = product.images || [];
        if (product.image && !imgs.includes(product.image)) {
            return [product.image, ...imgs];
        }
        return imgs.length > 0 ? imgs : ['https://via.placeholder.com/800'];
    }, [product]);

    const handleAdd = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image || product.images?.[0] || undefined,
            storeId: store.id,
            stock: product.stock || 0
        }, quantity);
        toggleCart();
    };

    return (
        <div className="bg-white min-h-screen pt-32 pb-20">
            <div className="max-w-[1400px] mx-auto px-6">
                {/* Back Link */}
                <Link href={`/store/${subdomain}/shop`} className="inline-flex items-center gap-2 group mb-12">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-black transition-colors">Return to Catalogue</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                    {/* Media Gallery */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="aspect-[4/5] bg-gray-50 rounded-[3rem] overflow-hidden relative group shadow-sm">
                            <motion.img
                                key={selectedImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-8 right-8 flex flex-col gap-4">
                                <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                                    <Heart className="w-6 h-6" />
                                </button>
                                <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                                    <Share2 className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {allImages.length > 1 && (
                            <div className="flex gap-6 overflow-x-auto no-scrollbar py-2">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`w-28 aspect-square rounded-[2rem] overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === img ? 'border-black scale-95 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="lg:col-span-5 pt-4">
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">{product.category || 'Premium Collection'}</span>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3 h-3 ${s <= 4 ? 'fill-black text-black' : 'text-gray-200'}`} />)}
                                        <span className="text-[10px] font-black ml-2 text-gray-400">4.8 / 5.0</span>
                                    </div>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
                                    {product.name}
                                </h1>
                                <p className="text-3xl font-bold text-black tracking-tight">{formatPrice(product.price)}</p>
                            </div>

                            <div className="space-y-8">
                                <p className="text-gray-500 font-medium leading-relaxed text-lg italic">
                                    "{product.description || 'A masterpiece of contemporary design, blending bold aesthetics with unparalleled comfort.'}"
                                </p>

                                {product.sizes && product.sizes.length > 0 && (
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Your Fit</p>
                                        <div className="flex flex-wrap gap-3">
                                            {product.sizes.map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all ${selectedSize === size ? 'bg-black text-white shadow-xl' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {!isOutOfStock && (
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center bg-gray-50 rounded-full px-6 py-4">
                                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-gray-400 hover:text-black hover:scale-125 transition-all">
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-10 text-center font-black text-lg">{quantity}</span>
                                                <button onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))} className="p-2 text-gray-400 hover:text-black hover:scale-125 transition-all">
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={handleAdd}
                                                className="flex-1 bg-black text-white py-6 rounded-full font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                                            >
                                                Add to Bag <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-8 pt-10 border-t border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                                            <Truck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest">Free Express</p>
                                            <p className="text-[10px] text-gray-400">Delivery in 2-3 days</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                                            <RotateCcw className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest">30 Day Returns</p>
                                            <p className="text-[10px] text-gray-400">Hassle free policy</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
