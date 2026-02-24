'use client';

import React from 'react';
import { ProductPageProps } from '../types';
import { VantageProductDetail } from './ProductDetail';

export const VantageProductPage: React.FC<ProductPageProps> = ({ store, product, subdomain }) => {
    return (
        <div className="pb-20">
            <VantageProductDetail
                product={product}
                store={store}
                subdomain={subdomain}
            />
        </div>
    );
};
