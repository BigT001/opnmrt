'use client';

import React from 'react';
import { PageProps } from '../types';
import { DefaultHero } from './StorefrontHero';
import { DefaultProductGrid } from './ProductGrid';

export const DefaultStorefrontPage: React.FC<PageProps> = ({ store, products, subdomain }) => {
    return (
        <div className="pb-20">
            <DefaultHero store={store} />
            <DefaultProductGrid
                products={products}
                subdomain={subdomain}
                storeId={store.id}
            />
        </div>
    );
};
