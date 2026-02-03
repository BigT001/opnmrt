'use client';

import React from 'react';
import { FooterProps } from '../types';

export function DefaultFooter({ storeName }: FooterProps) {
    return (
        <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
                </p>
                <div className="mt-4 flex justify-center gap-6 text-gray-400 text-xs">
                    <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
                    <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-gray-900 transition-colors">Shipping</a>
                </div>
            </div>
        </footer>
    );
}
