'use client';

import React from 'react';
import { StoreThemeProps } from '../types';
import { DefaultNavbar } from './Navbar';
import { DefaultFooter } from './Footer';

export const DefaultLayout: React.FC<StoreThemeProps> = ({ store, children }) => {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <DefaultNavbar storeName={store.name} logo={store.logo} />
            <main className="flex-grow">{children}</main>
            <DefaultFooter storeName={store.name} />
        </div>
    );
};
