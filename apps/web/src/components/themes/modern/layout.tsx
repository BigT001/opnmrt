import React from 'react';
import { StoreThemeProps } from '../types';
import { StoreNavbar } from '@/components/storefront/StoreNavbar';
import { CartDrawer } from '@/components/storefront/CartDrawer';

export const ModernLayout: React.FC<StoreThemeProps> = ({ store, children }) => {
    return (
        <div className="font-sans antialiased text-slate-900 bg-slate-50/50 min-h-screen flex flex-col" data-theme="modern">
            <StoreNavbar storeName={store.name} logo={store.logo} />
            <CartDrawer />
            <main className="flex-grow">{children}</main>
            <footer className="py-12 border-t mt-auto bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-400 text-sm font-medium">
                        &copy; {new Date().getFullYear()} {store.name}. Powered by OPNMRT.
                    </p>
                </div>
            </footer>
        </div>
    );
};
