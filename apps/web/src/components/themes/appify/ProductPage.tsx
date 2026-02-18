'use client';

import React from 'react';
import { ProductPageProps } from '../types';
import { AppifyProductDetail } from './ProductDetail';

export const AppifyProductPage: React.FC<ProductPageProps> = ({ store, product, subdomain }) => {
    return (
        <div className="bg-white">
            <AppifyProductDetail
                product={product}
                store={store}
                subdomain={subdomain}
            />
        </div>
    );
};
