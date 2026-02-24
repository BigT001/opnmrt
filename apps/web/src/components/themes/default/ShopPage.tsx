'use client';

import React from 'react';
import { PageProps } from '../types';
import { DefaultProductGrid } from './ProductGrid';
import { Search, SlidersHorizontal, ArrowRight, Grid3X3, List } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export const DefaultShopPage: React.FC<PageProps> = ({ store, products, subdomain, isPreview, onConfigChange }) => {
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
            matchesCategory = productCat.includes(cat) || productName.includes(cat);
        }

        return matchesQuery && matchesCategory;
    });

    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

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
        <div className="bg-[#fcfcfc] min-h-screen">
            {/* Minimal Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-10"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-[2px] bg-black" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Inventory</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                                {activeCategory === 'All' ? 'Shop All' : activeCategory}
                            </h1>
                        </div>

                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row gap-16">
                    {/* Minimal Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="sticky top-32 space-y-12">
                            <div>
                                <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.4em] mb-8 pb-4 border-b border-gray-100">Categories</h3>
                                <div className="flex flex-row overflow-x-auto no-scrollbar md:flex-col gap-2 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat as string}
                                            onClick={() => handleCategoryClick(cat as string)}
                                            className={`px-6 py-3 md:py-4 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all text-left flex items-center justify-between group whitespace-nowrap min-w-fit ${activeCategory === cat
                                                ? 'bg-black text-white shadow-xl shadow-black/10'
                                                : 'bg-white text-gray-400 hover:bg-gray-50 hover:text-black border border-gray-100 md:border-none'
                                                }`}
                                        >
                                            {cat === 'Shoop' || cat === 'Shop' ? 'Shop All' : cat}
                                            <div className="hidden md:flex">
                                                {activeCategory === cat && <ArrowRight className="w-3.5 h-3.5" />}
                                                {activeCategory !== cat && <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-black transition-colors" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 rounded-[32px] bg-gray-900 text-white space-y-6">
                                <h4 className="text-[14px] font-black uppercase italic tracking-tighter">Need Help?</h4>
                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-relaxed">
                                    Our support team is available 24/7 to assist with your selection.
                                </p>
                                <button className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-colors">
                                    Contact Us
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-12">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
                                Showing {filteredProducts.length} Results
                            </span>
                            <div className="flex items-center gap-4">
                                <button className="p-3 bg-white border border-gray-100 rounded-xl text-black hover:bg-gray-50 transition-colors">
                                    <Grid3X3 className="w-4 h-4" />
                                </button>
                                <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-300 hover:bg-gray-50 transition-colors">
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <DefaultProductGrid
                            products={filteredProducts}
                            subdomain={subdomain}
                            storeId={store.id}
                            store={store}
                            hideHeader={true}
                            isPreview={isPreview}
                            onConfigChange={onConfigChange}
                        />

                        {filteredProducts.length === 0 && (
                            <div className="py-20 text-center space-y-6">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                                    <Search className="w-8 h-8 text-gray-200" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-gray-900 uppercase">No Items Found</h3>
                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Try adjusting your filters or search query.</p>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};
