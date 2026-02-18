'use client';

import React from 'react';
import { PageProps } from '../types';
import { AppifyHero } from './StorefrontHero';
import { AppifyProductGrid } from './ProductGrid';

export const AppifyStorefrontPage: React.FC<PageProps> = ({ store, products, subdomain }) => {
    return (
        <div className="pb-32 bg-[#f8f9fb]">
            <AppifyHero store={store} />
            <AppifyProductGrid
                products={products}
                subdomain={subdomain}
                storeId={store.id}
                store={store}
            />
        </div>
    );
};
