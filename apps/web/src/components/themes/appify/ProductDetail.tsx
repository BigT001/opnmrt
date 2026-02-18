'use client';

import React from 'react';
import { ProductDetailProps } from '../types';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { ChevronLeft, Heart, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useWishlistStore } from '@/store/useWishlistStore';

export function AppifyProductDetail({ product, store, subdomain }: ProductDetailProps) {
    const { addItem, setOpen } = useCartStore();
    const { toggleItem, isInWishlist } = useWishlistStore();
    const [mounted, setMounted] = React.useState(false);
    const [quantity, setQuantity] = React.useState(1);
    const [selectedImage, setSelectedImage] = React.useState(0);
    const [selectedColor, setSelectedColor] = React.useState(0);
    const [selectedSize, setSelectedSize] = React.useState('L');

    const images = product.images?.length ? product.images : [product.image || 'https://via.placeholder.com/600'];
    const colors = ['bg-black', 'bg-blue-500'];
    const sizes = ['S', 'M', 'L', 'XL'];

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const isFavorite = mounted ? isInWishlist(product.id) : false;

    const handleAdd = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image ?? undefined,
            storeId: store.id,
            stock: product.stock || 0
        }, quantity);
        setOpen(true);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(product);
    };

    return (
        <div className="bg-white min-h-screen pb-32">
            <div className="px-5 space-y-6 pt-4">
                {/* Main Image */}
                <div className="aspect-[1.1] rounded-[32px] overflow-hidden bg-[#f4f6f8]">
                    <img
                        src={images[selectedImage]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Thumbnails */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${selectedImage === idx ? 'border-orange-500 scale-105 shadow-md' : 'border-transparent'
                                }`}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>

                {/* Info Section */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-[12px] font-medium text-orange-500">
                            Men's Running WinRunner jacket
                        </p>
                        <h2 className="text-[22px] font-bold text-[#1a1a2e] leading-tight">
                            {product.name}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-lg">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-[12px] font-bold text-amber-700">4.8</span>
                        </div>
                        <span className="text-[12px] font-medium text-gray-400">240 Reviews</span>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-[14px] font-bold text-[#1a1a2e]">Product informations</h4>
                        <p className="text-[13px] text-gray-500 leading-relaxed">
                            {product.description || "Abstract shapes and designs to the classic Win Runner as part of the Artist in Residence collection."}
                            <button className="ml-1 font-bold text-[#1a1a2e]">Read more</button>
                        </p>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <h4 className="text-[14px] font-bold text-[#1a1a2e]">Color :</h4>
                            <div className="flex gap-3">
                                {colors.map((color, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedColor(idx)}
                                        className={`w-8 h-8 rounded-full ${color} ring-offset-2 transition-all ${selectedColor === idx ? 'ring-2 ring-gray-900' : ''
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-[14px] font-bold text-[#1a1a2e]">Size :</h4>
                            <div className="flex gap-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold border transition-all ${selectedSize === size
                                            ? 'border-orange-500 text-orange-500 bg-orange-50'
                                            : 'border-gray-200 text-gray-400'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Sticky Action Bar - Positioned above the Bottom Nav */}
            <div className="fixed bottom-[72px] inset-x-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-5 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between gap-6 max-w-lg mx-auto">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-black uppercase tracking-widest text-orange-500/40 mb-0.5">Price</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-[22px] font-black text-[#1a1a2e] italic tracking-tighter">
                                {formatPrice(product.price)}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="flex-1 bg-[#0a0a0a] text-white h-15 rounded-2xl flex items-center justify-center gap-3 font-black text-[15px] uppercase tracking-widest hover:bg-black active:scale-[0.98] transition-all shadow-xl shadow-black/10 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        Add To Bag
                        <ShoppingBag className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
