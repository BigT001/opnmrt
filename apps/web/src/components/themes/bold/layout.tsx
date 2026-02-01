import React from 'react';
import { StoreThemeProps } from '../types';
import { StoreNavbar } from '@/components/storefront/StoreNavbar';
import { CartDrawer } from '@/components/storefront/CartDrawer';

export const BoldLayout: React.FC<StoreThemeProps> = ({ store, children }) => {
    return (
        <div className="font-sans font-bold text-black bg-white min-h-screen flex flex-col" data-theme="bold">
            <div className="border-b-4 border-black">
                <StoreNavbar storeName={store.name} logo={store.logo} />
            </div>
            <CartDrawer />
            <main className="flex-grow">{children}</main>
            <footer className="py-12 border-t-4 border-black mt-auto bg-black text-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-white text-lg font-black uppercase tracking-widest">
                        {store.name} &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </div>
    );
};
