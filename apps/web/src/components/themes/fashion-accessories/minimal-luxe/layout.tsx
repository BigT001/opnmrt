import React from 'react';
import { StoreThemeProps } from '../../types';
import { MinimalLuxeNavbar } from './Navbar';
import { MinimalLuxeFooter } from './Footer';
import { MinimalLuxeCartDrawer } from './CartDrawer';
import { MinimalLuxeTopBar } from './TopBar';

export const MinimalLuxeLayout: React.FC<StoreThemeProps> = ({ store, children }) => {
    return (
        <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col" data-theme="minimal-luxe">
            <MinimalLuxeTopBar />
            <MinimalLuxeNavbar storeName={store.name} logo={store.logo} />
            <MinimalLuxeCartDrawer />
            <main className="flex-grow">{children}</main>
            <MinimalLuxeFooter storeName={store.name} />
        </div>
    );
};

