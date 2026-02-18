'use client';

import React from 'react';
import { StoreThemeProps } from '../types';
import * as Headers from '../headers';
import { DefaultFooter } from './Footer';
import { DefaultCartDrawer } from './CartDrawer';
import { CartNotification } from '@/components/storefront/CartNotification';

import { usePathname } from 'next/navigation';

export const DefaultLayout: React.FC<StoreThemeProps> = ({ store, children, isPreview, onConfigChange, onNavigate }) => {
    const pathname = usePathname();
    const config = store.themeConfig || {};

    const HeaderVariant = (Headers as any)[config.headerVariant || 'ClassicalHeader'] || Headers.ClassicalHeader;

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <HeaderVariant
                storeName={store.name}
                logo={store.logo}
                subdomain={store.subdomain}
                storeId={store.id}
                isPreview={isPreview}
                onConfigChange={onConfigChange}
                onNavigate={onNavigate}
                navHome={config.navHome}
                navShop={config.navShop}
                navAbout={config.navAbout}
            />
            <DefaultCartDrawer storeId={store.id} />
            <CartNotification />
            <main className="flex-grow">{children}</main>
            {!(pathname?.includes('/customer') || pathname?.includes('/dashboard') || pathname?.includes('/seller') || pathname?.includes('/messages')) && (
                <DefaultFooter storeName={store.name} />
            )}
        </div>
    );
};
