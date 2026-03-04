'use client';

import React from 'react';
import { ProductDetailProps } from '../types';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { ChevronLeft, Heart, Star, ShoppingBag, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useWishlistStore } from '@/store/useWishlistStore';
import { EditableText } from '../EditableContent';

export function AppifyProductDetail({ product, store, subdomain, isPreview, onConfigChange }: ProductDetailProps) {
    const { addItem, setOpen } = useCartStore();
    const { toggleItem, isInWishlist } = useWishlistStore();
    const [mounted, setMounted] = React.useState(false);
    const [quantity, setQuantity] = React.useState(1);
    const [selectedImage, setSelectedImage] = React.useState(0);
    const [selectedColor, setSelectedColor] = React.useState(0);
    const [selectedSize, setSelectedSize] = React.useState(product.sizes?.[0] || 'L');
    const [isExpanded, setIsExpanded] = React.useState(false);
    const config = store.themeConfig || {};

    const handleSave = (key: string, value: string) => {
        onConfigChange?.({ [key]: value });
    };

    const images = product.images?.length ? product.images : [product.image || 'https://via.placeholder.com/600'];
    const colors = product.colors?.length ? product.colors : [];
    const sizes = product.sizes?.length ? product.sizes : ['S', 'M', 'L', 'XL'];

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const isFavorite = mounted ? isInWishlist(product.id) : false;

    // Calculate rating
    const totalReviews = product.reviews?.length || 0;
    const averageRating = totalReviews > 0
        ? (product.reviews!.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews).toFixed(1)
        : "4.8"; // Fallback to a nice "pre-orders" rating if none

    const handleAdd = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image || product.images?.[0] || undefined,
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

    const description = product.description || "Premium essentials designed for longevity and style. Part of our exclusive seasonal release.";
    const isLongDescription = description.length > 280;
    const displayDescription = !isExpanded && isLongDescription ? `${description.slice(0, 280)}...` : description;

    return (
        <div className="bg-white min-h-screen text-left">
            <div className="max-w-[1400px] mx-auto px-5 md:px-16 pt-4 md:pt-12 pb-32">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-8 md:mb-12">
                    <Link href={`/store/${subdomain}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#0a0a0a] transition-colors">
                        <EditableText
                            value={config.pdHomeLabel || 'Home'}
                            onSave={(val: string) => handleSave('pdHomeLabel', val)}
                            isPreview={isPreview}
                            label="Home Label"
                        />
                    </Link>
                    <ArrowRight className="w-3 h-3 text-gray-300" />
                    <Link href={`/store/${subdomain}/shop`} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#0a0a0a] transition-colors">
                        <EditableText
                            value={config.pdShopLabel || 'Shop'}
                            onSave={(val: string) => handleSave('pdShopLabel', val)}
                            isPreview={isPreview}
                            label="Shop Label"
                        />
                    </Link>
                    <ArrowRight className="w-3 h-3 text-gray-300" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 italic">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                    {/* Left Column: Media Gallery */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <div className="aspect-[1.1] rounded-[32px] md:rounded-[48px] overflow-hidden bg-[#f4f6f8] shadow-sm border border-gray-50 flex items-center justify-center">
                            {images[selectedImage] ? (
                                <img
                                    src={images[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                            ) : (
                                <ShoppingBag className="w-16 h-16 text-gray-200" />
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${selectedImage === idx ? 'border-orange-500 scale-105 shadow-md' : 'border-transparent'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Information & Controls */}
                    <div className="flex flex-col gap-8 md:pt-4 text-left">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-[12px] md:text-[13px] font-black uppercase tracking-[0.2em] text-orange-500 italic">
                                        <EditableText
                                            value={product.category || config.pdCategoryDefault || "Official Collection"}
                                            onSave={(val: string) => handleSave('pdCategoryDefault', val)}
                                            isPreview={isPreview}
                                            label="Category"
                                        />
                                    </p>
                                    <button onClick={handleWishlist} className={`p-3 rounded-2xl transition-all ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-300 hover:text-red-400'}`}>
                                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
                                <h1 className="text-[28px] md:text-[42px] font-black text-[#1a1a2e] leading-[1.1] tracking-tighter italic uppercase text-left">
                                    {product.name}
                                </h1>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-100/50">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    <span className="text-[13px] font-black text-amber-700">
                                        <EditableText
                                            value={config.pdRating || averageRating}
                                            onSave={(val: string) => handleSave('pdRating', val)}
                                            isPreview={isPreview}
                                            label="Rating"
                                        />
                                    </span>
                                </div>
                                <span className="text-[13px] font-bold text-gray-400 underline underline-offset-4 decoration-gray-200">
                                    <EditableText
                                        value={totalReviews > 0 ? `${totalReviews} Reviews` : (config.pdReviewDefault || "New Arrival")}
                                        onSave={(val: string) => handleSave('pdReviewDefault', val)}
                                        isPreview={isPreview}
                                        label="Review Text"
                                    />
                                </span>
                            </div>

                            <div className="md:hidden flex items-baseline gap-2 mb-2">
                                <span className="text-[24px] font-black text-[#0a0a0a] italic tracking-tighter">
                                    {formatPrice(product.price)}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-[14px] font-black text-[#1a1a2e] uppercase tracking-widest text-left">
                                    <EditableText
                                        value={config.pdDetailTitle || 'Product Details'}
                                        onSave={(val: string) => handleSave('pdDetailTitle', val)}
                                        isPreview={isPreview}
                                        label="Detail Header"
                                    />
                                </h4>
                                <div className="relative">
                                    <div className="text-[14px] text-gray-500 leading-relaxed max-w-lg transition-all duration-500 text-left">
                                        {displayDescription}
                                    </div>
                                    {isLongDescription && (
                                        <button
                                            onClick={() => setIsExpanded(!isExpanded)}
                                            className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-2 hover:underline"
                                        >
                                            {isExpanded ? (
                                                <EditableText value={config.pdHideLabel || "Show Less"} onSave={(v: string) => handleSave('pdHideLabel', v)} isPreview={isPreview} label="Label" />
                                            ) : (
                                                <EditableText value={config.pdReadLabel || "Read More"} onSave={(v: string) => handleSave('pdReadLabel', v)} isPreview={isPreview} label="Label" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Value Propositions */}
                        <div className="grid grid-cols-2 gap-4 py-6 border-t border-gray-100 mt-4 text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[11px] font-black uppercase tracking-tight text-[#1a1a2e]">
                                        <EditableText value={config.pdFeat1Label || 'Fast Delivery'} onSave={(v: string) => handleSave('pdFeat1Label', v)} isPreview={isPreview} label="Title" />
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-400">
                                        <EditableText value={config.pdFeat1Desc || '2-4 Business Days'} onSave={(v: string) => handleSave('pdFeat1Desc', v)} isPreview={isPreview} label="Desc" />
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[11px] font-black uppercase tracking-tight text-[#1a1a2e]">
                                        <EditableText value={config.pdFeat2Label || 'Free Returns'} onSave={(v: string) => handleSave('pdFeat2Label', v)} isPreview={isPreview} label="Title" />
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-400">
                                        <EditableText value={config.pdFeat2Desc || 'Within 30 Days'} onSave={(v: string) => handleSave('pdFeat2Desc', v)} isPreview={isPreview} label="Desc" />
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Selection Pillar */}
                        {(colors.length > 0 || (product.sizes && product.sizes.length > 0)) && (
                            <div className="hidden md:flex flex-col gap-8 py-8 border-y border-gray-100 text-left">
                                <div className="flex items-center justify-between">
                                    {colors.length > 0 && (
                                        <div className="space-y-4">
                                            <h4 className="text-[11px] font-black text-[#1a1a2e] uppercase tracking-[0.3em] text-left">
                                                <EditableText value={config.pdColorLabel || 'Select Color'} onSave={(v: string) => handleSave('pdColorLabel', v)} isPreview={isPreview} label="Label" />
                                            </h4>
                                            <div className="flex gap-4">
                                                {colors.map((color, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setSelectedColor(idx)}
                                                        className={`w-9 h-9 rounded-full ring-offset-4 transition-all hover:scale-110 ${selectedColor === idx ? 'ring-2 ring-orange-500' : 'ring-1 ring-gray-100'}`}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {product.sizes && product.sizes.length > 0 && (
                                        <div className="space-y-4 pr-12 text-left">
                                            <h4 className="text-[11px] font-black text-[#1a1a2e] uppercase tracking-[0.3em] text-left">
                                                <EditableText value={config.pdSizeLabel || 'Size Selector'} onSave={(v: string) => handleSave('pdSizeLabel', v)} isPreview={isPreview} label="Label" />
                                            </h4>
                                            <div className="flex gap-2">
                                                {product.sizes.map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setSelectedSize(size)}
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black border transition-all ${selectedSize === size
                                                            ? 'border-orange-500 text-orange-500 bg-orange-50 shadow-sm'
                                                            : 'border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600'
                                                            }`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-8 bg-gray-50/50 p-6 rounded-[32px] border border-gray-100 text-left">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500/50 mb-1">
                                            <EditableText value={config.pdPriceLabel || 'Retail Price'} onSave={(v: string) => handleSave('pdPriceLabel', v)} isPreview={isPreview} label="Label" />
                                        </span>
                                        <span className="text-[32px] font-black text-[#1a1a2e] italic tracking-tighter leading-none">
                                            {formatPrice(product.price)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleAdd}
                                        className="flex-1 bg-[#0a0a0a] text-white h-16 rounded-[24px] flex items-center justify-center gap-4 font-black text-[14px] uppercase tracking-[0.2em] hover:bg-orange-600 active:scale-[0.98] transition-all shadow-xl shadow-black/10 relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        <EditableText value={config.pdAddBagLabel || 'Add To Bag'} onSave={(v: string) => handleSave('pdAddBagLabel', v)} isPreview={isPreview} label="Button" />
                                        <ShoppingBag className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* MOBILE EXCLUSIVE Options Grid */}
                        <div className="md:hidden flex flex-col gap-8 text-left">
                            {colors.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-[14px] font-bold text-[#1a1a2e] text-left">Color :</h4>
                                    <div className="flex gap-3">
                                        {colors.map((color, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedColor(idx)}
                                                className={`w-8 h-8 rounded-full ring-offset-2 transition-all ${selectedColor === idx ? 'ring-2 ring-gray-900 shadow-md' : ''}`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.sizes && product.sizes.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-[14px] font-bold text-[#1a1a2e] text-left">Size :</h4>
                                    <div className="flex gap-2">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold border transition-all ${selectedSize === size
                                                    ? 'border-orange-500 text-orange-500 bg-orange-50 shadow-sm'
                                                    : 'border-gray-200 text-gray-400'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Sticky Action Bar - MOBILE ONLY */}
            <div className="md:hidden fixed bottom-[72px] inset-x-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-5 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between gap-6 max-w-lg mx-auto">
                    <div className="flex flex-col text-left">
                        <span className="text-[11px] font-black uppercase tracking-widest text-orange-500/40 mb-0.5">
                            <EditableText value={config.pdMobilePriceLabel || 'Price'} onSave={(v: string) => handleSave('pdMobilePriceLabel', v)} isPreview={isPreview} label="Label" />
                        </span>
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
                        <EditableText value={config.pdAddBagLabel || 'Add To Bag'} onSave={(v: string) => handleSave('pdAddBagLabel', v)} isPreview={isPreview} label="Button" />
                        <ShoppingBag className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
