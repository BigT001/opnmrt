'use client';

import React from 'react';
import { StoreThemeProps } from '../../types';
import { Header1 as MinimalLuxeNavbar } from '../../headers';
import { MinimalLuxeFooter } from './Footer';
import { MinimalLuxeCartDrawer } from './CartDrawer';
import { MinimalLuxeTopBar } from './TopBar';
import { CartNotification } from '@/components/storefront/CartNotification';

import { usePathname } from 'next/navigation';

export const MinimalLuxeLayout: React.FC<StoreThemeProps> = ({ store, children }) => {
    const pathname = usePathname();

    // Debugging footer visibility
    const isDashboard = pathname?.includes('/customer') ||
        pathname?.includes('/dashboard') ||
        pathname?.includes('/seller') ||
        pathname?.includes('/messages');

    return (
        <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col" data-theme="minimal-luxe">
            <MinimalLuxeTopBar />
            <MinimalLuxeNavbar storeName={store.name} logo={store.logo} subdomain={store.subdomain} storeId={store.id} />
            <MinimalLuxeCartDrawer storeId={store.id} />
            <CartNotification />
            <main className="flex-grow">{children}</main>
            {!isDashboard && (
                <MinimalLuxeFooter storeName={store.name} />
            )}
        </div>
    );
};

