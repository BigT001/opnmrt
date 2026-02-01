import React from 'react';
import { StoreThemeProps } from '../types';
import { StoreNavbar } from '@/components/storefront/StoreNavbar';
import { CartDrawer } from '@/components/storefront/CartDrawer';

export const ClassicLayout: React.FC<StoreThemeProps> = ({ store, children }) => {
    return (
        <div className="font-serif text-stone-800 bg-[#fdfbf7] min-h-screen flex flex-col" data-theme="classic">
            <div className="border-b border-stone-200 bg-[#faf8f5]">
                <StoreNavbar storeName={store.name} logo={store.logo} />
            </div>
            <CartDrawer />
            <main className="flex-grow">{children}</main>
            <footer className="py-16 border-t border-stone-200 mt-auto bg-[#faf8f5]">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h4 className="font-serif text-xl mb-4 text-stone-900">{store.name}</h4>
                    <p className="text-stone-500 text-sm italic">
                        Established {new Date().getFullYear()} &bull; All rights reserved
                    </p>
                </div>
            </footer>
        </div>
    );
};
