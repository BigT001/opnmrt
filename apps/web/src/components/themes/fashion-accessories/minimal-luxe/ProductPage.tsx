'use client';

import React from 'react';
import { ProductPageProps } from '../../types';
import { MinimalLuxeProductDetail } from './ProductDetail';

export const MinimalLuxeProductPage: React.FC<ProductPageProps> = ({ store, product, subdomain }) => {
    return (
        <div className="pb-20">
            <MinimalLuxeProductDetail
                product={product}
                store={store}
                subdomain={subdomain}
            />
        </div>
    );
};
