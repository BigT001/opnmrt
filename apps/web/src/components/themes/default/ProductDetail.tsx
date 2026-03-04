'use client';

import React from 'react';
import { ProductDetailProps } from '../types';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, ChevronRight, ShieldCheck, Truck, RefreshCw, Star, Share2, Heart, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { EditableText } from '../EditableContent';

export function DefaultProductDetail({ product, store, subdomain, isPreview, onConfigChange }: ProductDetailProps) {
    const { addItem, setOpen } = useCartStore();
    const [quantity, setQuantity] = React.useState(1);
    const [selectedImage, setSelectedImage] = React.useState(product.image || product.images?.[0] || 'https://via.placeholder.com/800');
    const [selectedSize, setSelectedSize] = React.useState(product.sizes?.[0] || '');
    const [selectedColor, setSelectedColor] = React.useState(product.colors?.[0] || '');
    const config = store.themeConfig || {};

    const handleSave = (key: string, value: string) => {
        onConfigChange?.({ [key]: value });
    };

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
        setOpen(true);
    };

    return (
        <div className="bg-white min-h-screen text-left">
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                <nav className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-gray-400">
                    <Link href={`/store/${subdomain}`} className="hover:text-black transition-colors">
                        <EditableText value={config.pdHomeLabel || 'Home'} onSave={(v: string) => handleSave('pdHomeLabel', v)} isPreview={isPreview} label="Home Label" />
                    </Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link href={`/store/${subdomain}/shop`} className="hover:text-black transition-colors">
                        <EditableText value={config.pdShopLabel || 'Shop'} onSave={(v: string) => handleSave('pdShopLabel', v)} isPreview={isPreview} label="Shop Label" />
                    </Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-gray-900 truncate max-w-[150px] sm:max-w-none">{product.name}</span>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                    {/* Media Gallery */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="aspect-[4/5] bg-gray-50 rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-sm relative group">
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {!isOutOfStock && (product.stock || 0) <= 5 && (
                                <div className="absolute top-6 left-6 px-4 py-2 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                    <EditableText value={config.pdStockWarning || 'Limited Stock'} onSave={(v: string) => handleSave('pdStockWarning', v)} isPreview={isPreview} label="Stock Warning" />
                                </div>
                            )}
                            <button className="absolute top-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 hover:text-red-500 hover:scale-110 transition-all shadow-xl">
                                <Heart className="w-5 h-5" />
                            </button>
                        </div>

                        {allImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`w-20 sm:w-28 aspect-square rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === img ? 'border-black shadow-md scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="lg:col-span-5 flex flex-col pt-4 lg:pt-10 text-left">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-black">
                                        <EditableText value={product.category || config.pdCategoryDefault || 'Curated Essential'} onSave={(v: string) => handleSave('pdCategoryDefault', v)} isPreview={isPreview} label="Category" />
                                    </h2>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-black text-black" />)}
                                        <span className="text-[10px] font-black ml-1 text-gray-400">
                                            <EditableText value={config.pdRating || '5.0'} onSave={(v: string) => handleSave('pdRating', v)} isPreview={isPreview} label="Rating" />
                                        </span>
                                    </div>
                                </div>
                                <h1 className="text-4xl sm:text-5xl font-black text-[#111827] tracking-tighter uppercase italic leading-[0.9] text-left">
                                    {product.name}
                                </h1>
                                <div className="flex items-baseline gap-4 text-left">
                                    <span className="text-3xl font-black text-gray-900 tracking-tighter">
                                        {formatPrice(product.price)}
                                    </span>
                                    <span className={`text-[11px] font-black uppercase tracking-widest ${isOutOfStock ? 'text-red-500' : 'text-emerald-500'}`}>
                                        / <EditableText
                                            value={isOutOfStock ? (config.pdOutOfStockLabel || 'Out of Stock') : (config.pdInStockLabel || 'Express Shipping Available')}
                                            onSave={(v: string) => handleSave(isOutOfStock ? 'pdOutOfStockLabel' : 'pdInStockLabel', v)}
                                            isPreview={isPreview}
                                            label="Stock Label"
                                        />
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6 text-left">
                                {/* Size Selection */}
                                {product.sizes && product.sizes.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[11px] font-black text-gray-900 uppercase tracking-widest">
                                                <EditableText value={config.pdSizeLabel || 'Select Size'} onSave={(v: string) => handleSave('pdSizeLabel', v)} isPreview={isPreview} label="Size Header" />
                                            </p>
                                            <button className="text-[10px] font-black uppercase tracking-widest border-b border-black/20">
                                                <EditableText value={config.pdSizeGuideLabel || 'Size Guide'} onSave={(v: string) => handleSave('pdSizeGuideLabel', v)} isPreview={isPreview} label="Size Guide" />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {product.sizes.map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border ${selectedSize === size
                                                        ? 'bg-black text-white border-black shadow-lg'
                                                        : 'bg-white text-gray-400 border-gray-100 hover:border-gray-900 hover:text-black'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Color Selection */}
                                {product.colors && product.colors.length > 0 && (
                                    <div className="space-y-4">
                                        <p className="text-[11px] font-black text-gray-900 uppercase tracking-widest">
                                            <EditableText value={config.pdColorLabel || 'Select Color'} onSave={(v: string) => handleSave('pdColorLabel', v)} isPreview={isPreview} label="Color Header" />
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {product.colors.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`group relative w-10 h-10 rounded-full border-2 transition-all p-0.5 ${selectedColor === color ? 'border-primary' : 'border-transparent'
                                                        }`}
                                                >
                                                    <div className="w-full h-full rounded-full border border-gray-100" style={{ backgroundColor: color.toLowerCase() }} />
                                                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {color}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}


                                {/* Summary / Specs Card */}
                                <div className="p-6 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 space-y-4 mt-6 text-left">
                                    <DescriptionBlock text={product.description} config={config} isPreview={isPreview} handleSave={handleSave} />
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                                                <ShieldCheck className="w-4 h-4 text-black" />
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-900">
                                                <EditableText value={config.pdFeat1Label || 'Authentic Only'} onSave={(v: string) => handleSave('pdFeat1Label', v)} isPreview={isPreview} label="Title" />
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                                                <Truck className="w-4 h-4 text-black" />
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-900">
                                                <EditableText value={config.pdFeat2Label || 'Fast Shipping'} onSave={(v: string) => handleSave('pdFeat2Label', v)} isPreview={isPreview} label="Title" />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 text-left">
                                    {!isOutOfStock && (
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all text-gray-400 hover:text-black"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="w-10 text-center text-xs font-black text-gray-900">{quantity}</span>
                                                <button
                                                    onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all text-gray-400 hover:text-black"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <div className="flex-1">
                                                <button
                                                    onClick={handleAdd}
                                                    disabled={isOutOfStock}
                                                    className="w-full h-14 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-95 disabled:bg-gray-200 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                                >
                                                    <ShoppingBag className="w-4 h-4" />
                                                    <EditableText value={config.pdAddBagLabel || 'Add To Bag'} onSave={(v: string) => handleSave('pdAddBagLabel', v)} isPreview={isPreview} label="Button" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between px-4 pt-4 text-left">
                                        <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            <button className="flex items-center gap-2 hover:text-black transition-colors">
                                                <Share2 className="w-4 h-4" />
                                                <EditableText value={config.pdShareLabel || 'Share'} onSave={(v: string) => handleSave('pdShareLabel', v)} isPreview={isPreview} label="Label" />
                                            </button>
                                            <button className="flex items-center gap-2 hover:text-black transition-colors">
                                                <RefreshCw className="w-4 h-4" />
                                                <EditableText value={config.pdReturnsLabel || '7-Day Returns'} onSave={(v: string) => handleSave('pdReturnsLabel', v)} isPreview={isPreview} label="Label" />
                                            </button>
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

function DescriptionBlock({ text, config, isPreview, handleSave }: { text?: string | null; config: any; isPreview?: boolean; handleSave: (k: string, v: string) => void }) {
    const CHAR_LIMIT = 160;
    const desc = text || 'An essential masterpiece designed for distinction and lasting quality. Handcrafted with precision to meet the highest standards of luxury and durability.';
    const isLong = desc.length > CHAR_LIMIT;
    const [expanded, setExpanded] = React.useState(false);

    return (
        <div className="text-left">
            <p className="text-[11px] font-bold text-gray-500 tracking-wide leading-relaxed text-left">
                {isLong && !expanded ? desc.slice(0, CHAR_LIMIT).trimEnd() + '\u2026' : desc}
            </p>
            {isLong && (
                <button
                    onClick={() => setExpanded(v => !v)}
                    className="mt-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#000] hover:opacity-70 transition-opacity"
                >
                    <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-90' : '-rotate-90'}`} />
                    {expanded ? (
                        <EditableText value={config.pdHideLabel || 'Read Less'} onSave={(v: string) => handleSave('pdHideLabel', v)} isPreview={isPreview} label="Label" />
                    ) : (
                        <EditableText value={config.pdReadLabel || 'Read More'} onSave={(v: string) => handleSave('pdReadLabel', v)} isPreview={isPreview} label="Label" />
                    )}
                </button>
            )}
        </div>
    );
}
