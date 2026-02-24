'use client';

import React from 'react';
import { PageProps } from '../types';
import { DefaultHero } from './StorefrontHero';
import { DefaultProductGrid } from './ProductGrid';

export const DefaultStorefrontPage: React.FC<PageProps> = ({ store, products, subdomain, isPreview, onConfigChange }) => {
    return (
        <div className="pb-0">
            <DefaultHero
                store={store}
                isPreview={isPreview}
                onConfigChange={onConfigChange}
            />
            <DefaultProductGrid
                products={products}
                subdomain={subdomain}
                storeId={store.id}
                store={store}
                isPreview={isPreview}
                onConfigChange={onConfigChange}
                hideControls={true}
            />
        </div>
    );
};
