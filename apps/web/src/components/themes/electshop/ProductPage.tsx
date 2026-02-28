'use client';

import React from 'react';
import { ProductPageProps } from '../types';
import { ElectshopProductDetail } from './ProductDetail';

export function ElectshopProductPage({ store, product, subdomain }: ProductPageProps) {
    return (
        <div className="bg-white">
            <ElectshopProductDetail product={product} store={store} subdomain={subdomain} />
        </div>
    );
}
