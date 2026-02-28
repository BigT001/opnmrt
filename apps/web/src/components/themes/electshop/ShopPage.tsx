'use client';

import React from 'react';
import { PageProps } from '../types';
import { ElectshopProductGrid } from './ProductGrid';

export function ElectshopShopPage({ store, products, subdomain, isPreview }: PageProps) {
    return (
        <div className="bg-[#f8f9fa] min-h-screen">
            <div className="max-w-7xl mx-auto py-12">
                <ElectshopProductGrid
                    products={products}
                    subdomain={subdomain}
                    storeId={store.id}
                    store={store}
                    isPreview={isPreview}
                />
            </div>
        </div>
    );
}
