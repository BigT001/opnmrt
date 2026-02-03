'use client';

import React from 'react';
import { CheckoutProps } from '../types';

export function DefaultCheckout({ store, subdomain }: CheckoutProps) {
    return (
        <div className="mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase mb-4">Checkout</h1>
            <p className="text-gray-500">Checkout implementation for the default theme is coming soon.</p>
        </div>
    );
}
