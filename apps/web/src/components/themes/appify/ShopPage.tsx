'use client';

import React from 'react';
import { PageProps } from '../types';
import { AppifyProductGrid } from './ProductGrid';
import { Search, SlidersHorizontal, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { EditableText } from '../EditableContent';

export const AppifyShopPage: React.FC<PageProps> = ({ store, products, subdomain, isPreview, onConfigChange }) => {
    const handleSave = (key: string, value: string) => {
        onConfigChange?.({ [key]: value });
    };
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams?.get('q')?.toLowerCase() || '';
    const activeCategory = searchParams?.get('category') || 'All';

    const filteredProducts = products.filter(p => {
        const matchesQuery = !query ||
            p.name.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query);

        let matchesCategory = activeCategory === 'All';
        if (!matchesCategory) {
            const cat = activeCategory.toLowerCase();
            const productCat = (p.category || '').toLowerCase();
            const productName = p.name.toLowerCase();

            if (cat.includes('men')) {
                // Use regex or includes but be careful with 'women'
                matchesCategory = productCat.includes('men') && !productCat.includes('women');
                if (!matchesCategory) matchesCategory = productName.includes('men') && !productName.includes('women');
            } else if (cat.includes('women')) {
                matchesCategory = productCat.includes('women') || productName.includes('women');
            } else if (cat.includes('kid')) {
                matchesCategory = productCat.includes('kid') || productName.includes('kid');
            } else if (cat.includes('new')) {
                matchesCategory = true; // Fallback or logic for new items
            } else {
                matchesCategory = productCat.includes(cat) || productName.includes(cat);
            }
        }

        return matchesQuery && matchesCategory;
    });

    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' }
        }
    };

    const categories = ['All', "Men's", "Women's", 'Kids', 'New In', 'Collection'];

    const handleCategoryClick = (cat: string) => {
        const urlParams = new URLSearchParams(searchParams?.toString());
        if (cat === 'All') {
            urlParams.delete('category');
        } else {
            urlParams.set('category', cat);
        }
        router.push(`/store/${subdomain}/shop?${urlParams.toString()}`);
    };

    return (
        <div className="bg-white min-h-screen">
            {/* The Slanted/Curved Content Layer */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="bg-[#f8f9fb] rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.15)] min-h-screen pb-32"
            >
                <div className="max-w-[1600px] mx-auto pt-12 px-5 md:px-12 lg:px-20">

                    {/* Live Signal Bar */}
                    <motion.div variants={itemVariants} className="flex items-center gap-6 mb-8 py-2 border-b border-gray-100 overflow-hidden whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Inventory Live</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Global Shipping Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-500 italic">Spring drop is live</span>
                        </div>
                    </motion.div>

                    {/* Editorial Page Header */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
                    >
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: 48 }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-[2px] bg-orange-500"
                                />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 italic">Spring / Summer</span>
                            </div>
                            <h1 className="text-[32px] md:text-[64px] font-black text-[#1a1a2e] uppercase italic tracking-tighter leading-none">
                                {activeCategory === 'All' ? 'Shop' : activeCategory}
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden lg:flex flex-col items-end mr-6">
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-1">Index Volume</span>
                                <span className="text-[15px] font-black text-[#0a0a0a] tracking-tighter">№ {filteredProducts.length} Items</span>
                            </div>
                            <button className="hidden md:flex h-16 px-10 rounded-[24px] bg-white border border-gray-100 shadow-xl shadow-black/[0.02] items-center gap-4 hover:bg-[#0a0a0a] hover:text-white transition-all duration-500 group">
                                <SlidersHorizontal className="w-4 h-4 text-orange-500 group-hover:text-white transition-colors" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Filter</span>
                            </button>
                        </div>
                    </motion.div>

                    <div className="flex flex-col md:flex-row gap-20">
                        {/* Desktop Sidebar */}
                        <aside className="hidden md:block w-72 shrink-0">
                            <motion.div variants={itemVariants} className="space-y-12 sticky top-32">
                                <div>
                                    <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                                        Directory
                                        <div className="flex-1 h-[1px] bg-gray-100" />
                                    </h3>
                                    <div className="flex flex-col gap-0.5">
                                        {categories.map((cat, idx) => {
                                            const isActive = activeCategory === cat;
                                            return (
                                                <button
                                                    key={cat}
                                                    onClick={() => handleCategoryClick(cat)}
                                                    className={`group flex items-center justify-between px-6 py-5 rounded-[24px] transition-all duration-700 ${isActive
                                                        ? 'bg-white text-[#0a0a0a] shadow-2xl shadow-black/5 translate-x-3 scale-[1.02]'
                                                        : 'text-gray-400 hover:text-[#0a0a0a] hover:translate-x-2'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <span className={`text-[11px] font-black text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`}>
                                                            0{idx + 1}
                                                        </span>
                                                        <span className={`text-[12px] font-black uppercase tracking-widest ${isActive ? 'italic' : ''}`}>
                                                            {cat}
                                                        </span>
                                                    </div>
                                                    <ArrowRight className={`w-3.5 h-3.5 transition-all duration-500 ${isActive ? 'opacity-100 text-orange-500' : 'opacity-0 -translate-x-4'}`} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Editorial Promo */}
                                <div className="relative p-10 rounded-[48px] bg-white border border-gray-100 shadow-2xl shadow-black/[0.03] overflow-hidden group">
                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 blur-[80px] group-hover:bg-orange-500/20 transition-all duration-1000" />
                                    <Sparkles className="w-6 h-6 text-orange-500 mb-6" />
                                    <h4 className="text-[18px] font-black uppercase italic tracking-tighter leading-tight mb-4 relative z-10">
                                        Style<br />Consultancy
                                    </h4>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-8 relative z-10 leading-relaxed">
                                        Bespoke tailoring guidance for elite members.
                                    </p>
                                    <button className="w-full py-5 rounded-2xl bg-[#0a0a0a] text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-orange-600 transition-all shadow-xl shadow-black/10">
                                        Waitlist Now
                                    </button>
                                </div>
                            </motion.div>
                        </aside>

                        {/* Product Grid Area */}
                        <motion.div variants={itemVariants} className="flex-1">
                            {filteredProducts.length > 0 ? (
                                <div className="space-y-16">
                                    {/* Sub-grid featured row header */}
                                    <div className="flex items-center justify-between px-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#0a0a0a]">Limited Selection</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Updated Hourly</p>
                                        </div>
                                    </div>

                                    <AppifyProductGrid
                                        products={filteredProducts}
                                        subdomain={subdomain}
                                        storeId={store.id}
                                        store={store}
                                        hideHeader={true}
                                        isPreview={isPreview}
                                        onConfigChange={onConfigChange}
                                    />

                                    {/* Newsletter Section */}
                                    <div className="mt-32 p-10 md:p-12 rounded-[48px] bg-[#0a0a0a] text-white overflow-hidden relative group">
                                        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[120px]" />
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                                            <div className="max-w-md text-center md:text-left">
                                                <h3 className="text-[22px] md:text-[28px] font-black uppercase italic tracking-tighter leading-none mb-4">
                                                    The Intelligence Drop
                                                </h3>
                                                <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                                                    Get early access to collections and exclusive insights into the design process.
                                                </p>
                                            </div>
                                            <div className="w-full md:w-auto flex flex-col gap-3">
                                                <div className="flex p-1.5 rounded-[24px] bg-white/5 border border-white/10 w-full md:w-[380px]">
                                                    <input
                                                        type="email"
                                                        placeholder="ENTER EMAIL"
                                                        className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-widest px-5 flex-1 text-white placeholder:text-white/20"
                                                    />
                                                    <button className="h-12 px-6 rounded-[18px] bg-orange-500 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all">
                                                        Subscribe
                                                    </button>
                                                </div>
                                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] text-center md:text-right">No spam. Only excellence.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-40 text-center flex flex-col items-center gap-8">
                                    <div className="w-32 h-32 bg-white shadow-2xl shadow-black/[0.03] rounded-[56px] flex items-center justify-center text-gray-200">
                                        <Search className="w-16 h-16 opacity-20" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-3xl font-black text-[#1a1a2e] uppercase italic tracking-tighter">Zero Artifacts Found</h3>
                                        <p className="text-[13px] font-bold text-gray-400 max-w-[320px] mx-auto leading-relaxed uppercase tracking-widest">
                                            The requested collection parameters yielded no active items at this time.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => router.push(`/store/${subdomain}/shop`)}
                                        className="mt-4 bg-[#0a0a0a] text-white px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:scale-95 transition-all hover:bg-orange-600"
                                    >
                                        Return to Home
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
