'use client';

import { ProductGridProps } from '../../types';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart, Star, ArrowRight, Zap, Shield, Truck, Headphones } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function TechSpecProductGrid({ products, subdomain, storeId }: ProductGridProps) {
    const { addItem } = useCartStore();
    const [activeTab, setActiveTab] = useState('ALL');

    const handleAddToCart = (product: any) => {
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            storeId,
        });
    };

    if (products.length === 0) {
        return (
            <div className="max-w-[1400px] mx-auto px-10 py-24">
                <div className="text-center py-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-sm">
                    <p className="text-gray-400 font-data uppercase tracking-widest text-xs">No hardware units detected in this sector.</p>
                </div>
            </div>
        );
    }

    const bestSellers = products.slice(0, 4);

    return (
        <div className="max-w-[1400px] mx-auto px-10 py-24">
            <div className="flex flex-col lg:flex-row gap-12">

                {/* Sidebar (As seen in screenshot) */}
                <aside className="lg:w-80 flex-shrink-0 space-y-12">

                    {/* Bestsellers Block */}
                    <div className="border border-gray-200 rounded-sm overflow-hidden">
                        <div className="bg-[#E72E46] text-white px-6 py-4 font-black text-xs uppercase tracking-widest italic flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Bestsellers
                        </div>
                        <div className="divide-y divide-gray-100 bg-white">
                            {bestSellers.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/store/${subdomain}/products/${product.slug || product.id}`}
                                    className="p-6 flex gap-4 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="w-16 h-16 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0 border border-gray-100">
                                        <img
                                            src={product.image || 'https://via.placeholder.com/400'}
                                            alt={product.name}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[10px] font-bold text-gray-900 uppercase leading-tight line-clamp-2">
                                            {product.name}
                                        </h4>
                                        <p className="text-[#E72E46] font-black text-xs tracking-tighter">
                                            {formatPrice(product.price)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Promo Banner 1: Asus Laptop */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative h-96 rounded-sm overflow-hidden bg-black text-white p-8 flex flex-col justify-end group shadow-xl"
                    >
                        <div className="absolute inset-0 z-0">
                            <img
                                src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=2000"
                                alt="Promo 1"
                                className="w-full h-full object-cover opacity-50 grayscale group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="bg-[#E72E46] text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest w-fit">
                                50% OFF
                            </div>
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
                                ASUS LAPTOP<br />PRO SERIES
                            </h3>
                            <button className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 group-hover:text-[#E72E46] transition-colors">
                                Shop Now <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Promo Banner 2: Camera */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative h-72 rounded-sm overflow-hidden bg-white border border-gray-200 p-8 flex flex-col justify-center group shadow-sm text-center items-center"
                    >
                        <div className="absolute inset-x-0 top-0 h-1 bg-[#E72E46]" />
                        <div className="space-y-4 relative z-10 text-center">
                            <h3 className="text-xl font-black uppercase tracking-tighter leading-tight italic text-gray-900">
                                CAMERA WIFI<br /><span className="text-[#E72E46]">25% OFF</span>
                            </h3>
                            <div className="w-32 h-32 mx-auto">
                                <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80" alt="Camera" className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        </div>
                    </motion.div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 space-y-12">
                    {/* Tabs / Filters */}
                    <div className="flex flex-wrap items-center justify-between gap-6 border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">New Arrivals</h2>
                        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
                            {['ALL', 'SMARTPHONES', 'LAPTOPS', 'AUDIO', 'TELEVISIONS'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all relative ${activeTab === tab ? 'text-[#E72E46]' : 'text-gray-400 hover:text-black'}`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div layoutId="tab-underline" className="absolute -bottom-[17px] left-0 right-0 h-[3px] bg-[#E72E46]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                        {products.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                                className="group bg-white border border-gray-100 rounded-sm overflow-hidden hover:shadow-2xl transition-all duration-500"
                            >
                                <Link href={`/store/${subdomain}/products/${product.slug || product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
                                    <img
                                        src={product.image || 'https://via.placeholder.com/400'}
                                        alt={product.name}
                                        className="h-full w-full object-contain p-8 group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Quick Actions Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                        <button
                                            onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                                            className="w-12 h-12 bg-white text-black hover:bg-[#E72E46] hover:text-white transition-all flex items-center justify-center rounded-sm transform translate-y-4 group-hover:translate-y-0 duration-500"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                        </button>
                                        <button className="w-12 h-12 bg-white text-black hover:bg-black hover:text-white transition-all flex items-center justify-center rounded-sm transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75">
                                            <Star className="w-5 h-5" />
                                        </button>
                                    </div>
                                </Link>

                                <div className="p-8 space-y-4">
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-2.5 h-2.5 fill-current" />
                                        ))}
                                        <span className="text-gray-300 text-[10px] ml-2 font-data">(4.5)</span>
                                    </div>

                                    <Link href={`/store/${subdomain}/products/${product.slug || product.id}`}>
                                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-tight leading-relaxed group-hover:text-[#E72E46] transition-colors line-clamp-2 min-h-[32px]">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    <div className="flex items-end justify-between pt-2 border-t border-gray-50">
                                        <div className="space-y-1">
                                            <p className="text-xl font-black text-black tracking-tighter italic">
                                                {formatPrice(product.price)}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <div className="text-[10px] font-black text-[#E72E46] uppercase bg-[#E72E46]/10 px-2 py-0.5 rounded-sm">HOT</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 hover:text-[#E72E46] transition-colors group/btn"
                                        >
                                            ACQUIRE
                                            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Features Strip (As implied by general tech store needs) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-gray-100">
                        {[
                            { icon: Shield, title: "SECURE TRANSFER", desc: "100% encryption active" },
                            { icon: Truck, title: "FAST DEPLOYMENT", desc: "Express hardware delivery" },
                            { icon: Headphones, title: "EXPERT ASSIST", desc: "24/7 technical support" }
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-4 p-6 bg-gray-50 rounded-sm hover:bg-white hover:shadow-xl transition-all duration-500 border border-transparent hover:border-gray-100 group">
                                <div className="w-12 h-12 bg-white text-[#E72E46] flex items-center justify-center rounded-sm transition-transform group-hover:scale-110">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900">{feature.title}</h4>
                                    <p className="text-[9px] text-gray-400 uppercase font-data tracking-tight">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}


