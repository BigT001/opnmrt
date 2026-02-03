'use client';

import React from 'react';
import { ProductPageProps } from '../types';
import { DefaultProductDetail } from './ProductDetail';

export const DefaultProductPage: React.FC<ProductPageProps> = ({ store, product, subdomain }) => {
    return (
        <div className="pb-20">
            <DefaultProductDetail
                product={product}
                store={store}
                subdomain={subdomain}
            />
        </div>
    );
};
