'use client';

import React from 'react';
import { PageProps } from '../../types';
import { MinimalLuxeHero } from './StorefrontHero';
import { MinimalLuxeProductGrid } from './ProductGrid';

export const MinimalLuxeStorefrontPage: React.FC<PageProps> = ({ store, products, subdomain }) => {
    return (
        <div className="pb-20">
            <MinimalLuxeHero store={store} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                <MinimalLuxeProductGrid
                    products={products}
                    subdomain={subdomain}
                    storeId={store.id}
                />
            </div>
        </div>
    );
};
