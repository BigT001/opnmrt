'use client';

import React from 'react';
import { PageProps } from '../types';
import { AppifyProductGrid } from './ProductGrid';
import { Search } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

export const AppifyShopPage: React.FC<PageProps> = ({ store, products, subdomain }) => {
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

    return (
        <div className="bg-[#0a0a0a] min-h-screen">
            {/* The Slanted/Curved Content Layer */}
            <div className="bg-[#f8f9fb] rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.15)] min-h-screen pb-32">
                <div className="pt-8">
                    {filteredProducts.length > 0 ? (
                        <AppifyProductGrid
                            products={filteredProducts}
                            subdomain={subdomain}
                            storeId={store.id}
                            store={store}
                            hideHeader={true}
                        />
                    ) : (
                        <div className="px-8 py-24 text-center flex flex-col items-center gap-4">
                            <div className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center text-gray-200">
                                <Search className="w-12 h-12" />
                            </div>
                            <h3 className="text-xl font-black text-[#1a1a2e] uppercase italic tracking-tighter">No results found</h3>
                            <p className="text-[13px] font-bold text-gray-400 max-w-[240px] leading-relaxed">
                                We couldn't find any products in <span className="text-[#0a0a0a]">"{activeCategory}"</span>
                                {query && <> matching <span className="text-[#0a0a0a]">"{query}"</span></>}
                            </p>
                            <button
                                onClick={() => router.push(`/store/${subdomain}/shop`)}
                                className="mt-4 bg-[#0a0a0a] text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 active:scale-95 transition-all"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
