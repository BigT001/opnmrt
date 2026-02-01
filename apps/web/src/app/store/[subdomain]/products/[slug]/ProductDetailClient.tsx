'use client';

import { useState } from 'react';
import { Star, Truck, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { AddToCartButton } from '@/components/storefront/AddToCartButton';

export default function ProductDetailClient({ product, store, subdomain }: any) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);

    const hasDiscount = product.discountPrice && product.discountPrice > 0;
    const displayPrice = hasDiscount ? product.discountPrice : product.price;
    const savings = hasDiscount ? Number(product.price) - Number(product.discountPrice) : 0;

    return (
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            {/* Image Gallery */}
            <div className="mb-8 lg:mb-0">
                {/* Main Image */}
                <div className="aspect-square rounded-3xl overflow-hidden bg-white mb-4 shadow-lg border border-slate-200 relative group">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-cover object-center"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100">
                            <span className="text-slate-400 text-lg font-medium">No Image</span>
                        </div>
                    )}

                    {/* Navigation Arrows */}
                    {product.images && product.images.length > 1 && (
                        <>
                            <button
                                onClick={() => setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-white"
                            >
                                <ChevronLeft className="w-5 h-5 text-slate-700" />
                            </button>
                            <button
                                onClick={() => setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-white"
                            >
                                <ChevronRight className="w-5 h-5 text-slate-700" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnail Gallery */}
                {product.images && product.images.length > 1 && (
                    <div className="grid grid-cols-5 gap-3">
                        {product.images.map((img: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(idx)}
                                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx
                                    ? 'border-primary shadow-md scale-105'
                                    : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
                <div className="mb-6">
                    {product.category && (
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                            {product.category}
                        </span>
                    )}
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-4">{product.name}</h1>

                    <div className="flex items-center">
                        <div className="flex items-center">
                            {[0, 1, 2, 3, 4].map((rating) => (
                                <Star
                                    key={rating}
                                    className="text-amber-400 h-5 w-5 flex-shrink-0 fill-current"
                                />
                            ))}
                        </div>
                        <p className="ml-3 text-sm text-slate-500 font-medium">4.9 (128 reviews)</p>
                    </div>
                </div>

                {/* Price */}
                <div className="mb-8">
                    <div className="flex items-baseline gap-3">
                        <p className="text-4xl font-black text-slate-900">${Number(displayPrice).toFixed(2)}</p>
                        {hasDiscount && (
                            <>
                                <p className="text-2xl font-bold text-slate-400 line-through">${Number(product.price).toFixed(2)}</p>
                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-black">
                                    Save ${savings.toFixed(2)}
                                </span>
                            </>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 mt-2 font-medium">
                        Stock: <span className={`font-bold ${product.stock < 10 ? 'text-amber-600' : 'text-primary'}`}>{product.stock} available</span>
                    </p>
                </div>

                {/* Description */}
                <div className="prose prose-sm text-slate-600 mb-8 leading-relaxed">
                    <p>{product.description}</p>
                </div>

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Available Colors</label>
                        <div className="flex flex-wrap gap-4">
                            {product.colors.map((color: string) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className="group flex flex-col items-center gap-2 transition-all"
                                    title={color}
                                >
                                    <span
                                        className={`w-8 h-8 rounded-full transition-all ${selectedColor === color
                                                ? 'ring-2 ring-primary ring-offset-2 scale-110'
                                                : 'hover:scale-105'
                                            }`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                    />
                                    <span className={`text-xs font-medium capitalize ${selectedColor === color ? 'text-primary font-bold' : 'text-slate-600'
                                        }`}>
                                        {color}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Available Sizes</label>
                        <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size: string) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedSize === size
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : 'bg-white text-slate-700 border border-slate-200 hover:border-primary'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add to Cart Section */}
                <div className="mt-auto">
                    <AddToCartButton product={product} storeId={store.id} />

                    {/* Features */}
                    <div className="mt-8 border-t border-slate-200 pt-8 space-y-4">
                        <div className="flex items-center text-sm text-slate-600">
                            <Truck className="w-5 h-5 mr-3 text-primary" />
                            <span className="font-medium">Free shipping on orders over $100</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                            <ShieldCheck className="w-5 h-5 mr-3 text-primary" />
                            <span className="font-medium">2-year warranty included</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
