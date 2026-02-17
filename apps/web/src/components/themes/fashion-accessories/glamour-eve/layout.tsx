'use client';

import React from 'react';
import { StoreThemeProps } from '../../types';
import { Header2 as GlamourEveNavbar } from '../../headers';
import { GlamourEveFooter } from './Footer';
import { GlamourEveCartDrawer } from './CartDrawer';
import { CartNotification } from '@/components/storefront/CartNotification';

import { usePathname } from 'next/navigation';

export const GlamourEveLayout: React.FC<StoreThemeProps> = ({ store, children }) => {
    const pathname = usePathname();
    return (
        <div className="antialiased text-black bg-white min-h-screen flex flex-col selection:bg-[#D4AF37] selection:text-black" data-theme="glamour-eve">
            <GlamourEveNavbar storeName={store.name} logo={store.logo} subdomain={store.subdomain} storeId={store.id} />
            <GlamourEveCartDrawer storeId={store.id} />
            <CartNotification />
            <main className="flex-grow">{children}</main>
            {!(pathname?.includes('/customer') || pathname?.includes('/dashboard') || pathname?.includes('/seller') || pathname?.includes('/messages')) && (
                <GlamourEveFooter storeName={store.name} />
            )}
        </div>
    );
};

