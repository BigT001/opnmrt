'use client';

import React from 'react';
import { StoreThemeProps } from '../types';
import { Header1 as DefaultNavbar } from '../headers';
import { DefaultFooter } from './Footer';
import { DefaultCartDrawer } from './CartDrawer';
import { CartNotification } from '@/components/storefront/CartNotification';

import { usePathname } from 'next/navigation';

export const DefaultLayout: React.FC<StoreThemeProps> = ({ store, children }) => {
    const pathname = usePathname();
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <DefaultNavbar storeName={store.name} logo={store.logo} subdomain={store.subdomain} storeId={store.id} />
            <DefaultCartDrawer storeId={store.id} />
            <CartNotification />
            <main className="flex-grow">{children}</main>
            {!(pathname?.includes('/customer') || pathname?.includes('/dashboard') || pathname?.includes('/seller') || pathname?.includes('/messages')) && (
                <DefaultFooter storeName={store.name} />
            )}
        </div>
    );
};
