'use client';

import React from 'react';
import { ProductGridProps } from '../types';
import { ShoppingCart, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useStoreCart } from '@/store/useStoreCart';
import { ElectshopProductCard } from './ProductCard';
import { EditableText } from '../EditableContent';

export function ElectshopProductGrid({ products, subdomain, storeId, hideHeader, isPreview, onConfigChange, store }: ProductGridProps & { isPreview?: boolean; onConfigChange?: (cfg: any) => void; store?: any }) {
    const { addItem } = useStoreCart(storeId);
    const config = store?.themeConfig || {};

    const handleSave = (key: string, value: string) => {
        onConfigChange?.({ [key]: value });
    };

    return (
        <section className="max-w-7xl mx-auto px-4 py-12">
            {!hideHeader && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">
                            <EditableText
                                value={config.gridTitle || 'All Products'}
                                onSave={(val) => handleSave('gridTitle', val)}
                                isPreview={isPreview}
                                label="Grid Title"
                            />
                        </h2>
                        <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">
                            <EditableText
                                value={config.gridSubtitle || `${products.length} Products Found`}
                                onSave={(val) => handleSave('gridSubtitle', val)}
                                isPreview={isPreview}
                                label="Grid Subtitle"
                            />
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm cursor-pointer hover:border-brand transition-colors">
                            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Filter By</span>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm cursor-pointer hover:border-brand transition-colors">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sort By:</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Featured</span>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                {products.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingCart className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">No products found</h3>
                        <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Try adjusting your filters or search query.</p>
                    </div>
                ) : (
                    products.map((product) => (
                        <ElectshopProductCard
                            key={product.id}
                            product={product}
                            subdomain={subdomain}
                            storeId={storeId}
                        />
                    ))
                )}
            </div>
        </section>
    );
}
