'use client';

import React from 'react';
import { PageProps } from '../types';
import { VantageProductGrid } from './ProductGrid';
import { Search, ChevronDown, Filter, LayoutGrid, List, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

export function VantageShopPage({ products, subdomain, store, isPreview }: PageProps) {
    const searchParams = useSearchParams();
    const [selectedCategory, setSelectedCategory] = React.useState('All');
    const [searchQuery, setSearchQuery] = React.useState(searchParams.get('q') || '');
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false);

    React.useEffect(() => {
        const query = searchParams.get('q');
        if (query) setSearchQuery(query);
    }, [searchParams]);

    // Derived categories
    const categories = ['All', ...Array.from(new Set(products.map(p => p.category || 'Essential')))];

    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory === 'All' || (p.category || 'Essential') === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-white min-h-screen pt-24 lg:pt-32 pb-0">
            <div className="max-w-[1400px] mx-auto px-2 lg:px-6">
                {/* ═══ SHOP HEADER ═══ */}
                <div className="mb-12 lg:mb-16">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 md:gap-10">
                        <div className="space-y-4">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Product Archive</span>
                            <h1 className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-[0.8] italic">
                                Lookbook <br /><span className="text-gray-300">Catalogue.</span>
                            </h1>
                        </div>
                        <div className="bg-gray-50 rounded-[2rem] p-4 flex items-center gap-6 hidden lg:flex">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Season</span>
                                <span className="text-xs font-black uppercase">Late MMXXIV</span>
                            </div>
                            <div className="w-px h-8 bg-gray-200" />
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Availability</span>
                                <span className="text-xs font-black uppercase">Global Drop</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ SHOP LAYOUT: SIDEBAR ON DESKTOP ═══ */}
                <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-20 items-start">

                    {/* ═══ DESKTOP SIDEBAR ═══ */}
                    <aside className="hidden lg:block sticky top-32 space-y-12">
                        <div className="space-y-8">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Collections</span>
                                <div className="h-1 w-8 bg-black" />
                            </div>

                            <nav className="flex flex-col items-start gap-4">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`group text-left transition-all duration-300 w-full`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`h-1 transition-all duration-500 rounded-full ${selectedCategory === cat ? 'w-6 bg-black' : 'w-0 bg-gray-200 group-hover:w-4'}`} />
                                            <span className={`text-xs font-black uppercase tracking-widest leading-none ${selectedCategory === cat ? 'text-black' : 'text-gray-400 group-hover:text-black'}`}>
                                                {cat}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* ═══ MAIN CONTENT ═══ */}
                    <div className="space-y-8 lg:space-y-12">
                        {/* Mobile Controls (Toolbar) */}
                        <div className="lg:hidden flex items-center justify-between py-4 border-b border-gray-100 mb-2">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Category</span>
                                <span className="text-xs font-black uppercase text-black">{selectedCategory}</span>
                            </div>
                            <button
                                onClick={() => setIsFilterDrawerOpen(true)}
                                className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/10 active:scale-95 transition-all"
                            >
                                <Filter className="w-3 h-3" />
                                Collections
                            </button>
                        </div>

                        {/* The Product Grid */}
                        <VantageProductGrid
                            products={filteredProducts}
                            subdomain={subdomain}
                            storeId={store.id}
                            store={store}
                            hideHeader={true}
                        />

                    </div>
                </div>
            </div>

            {/* ═══ MOBILE CATEGORY DRAWER (1/4 Width) ═══ */}
            <AnimatePresence>
                {isFilterDrawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFilterDrawerOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[75%] max-w-[320px] bg-white z-[201] lg:hidden shadow-2xl flex flex-col p-8"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Select</span>
                                    <h3 className="text-xl font-black uppercase tracking-tighter text-black">Collections</h3>
                                </div>
                                <button onClick={() => setIsFilterDrawerOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
                                    <X className="w-5 h-5 text-black" />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-6">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setIsFilterDrawerOpen(false);
                                        }}
                                        className="flex items-center justify-between group"
                                    >
                                        <span className={`text-sm font-black uppercase tracking-widest ${selectedCategory === cat ? 'text-black' : 'text-gray-300'}`}>
                                            {cat}
                                        </span>
                                        {selectedCategory === cat && (
                                            <div className="w-2 h-2 bg-black rounded-full" />
                                        )}
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-auto">
                                <div className="p-6 bg-gray-50 rounded-[2rem] space-y-4">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Need specific style?</p>
                                    <p className="text-xs font-bold text-black uppercase tracking-tight">Use global search in the header above.</p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
