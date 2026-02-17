'use client';

import React from 'react';
import { StoreThemeProps } from '../../types';
import { Header2 as VintageCharmNavbar } from '../../headers';
import { VintageCharmFooter } from './Footer';
import { VintageCharmCartDrawer } from './CartDrawer';
import { CartNotification } from '@/components/storefront/CartNotification';

import { usePathname } from 'next/navigation';

export const VintageCharmLayout: React.FC<StoreThemeProps> = ({ store, children }) => {
    const pathname = usePathname();
    const isDashboard = pathname?.includes('/customer') || pathname?.includes('/dashboard');

    return (
        <div className="font-serif text-stone-900 bg-[#F9F4EE] min-h-screen flex flex-col selection:bg-[#1B3022] selection:text-[#F9F4EE]" data-theme="vintage-charm">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Great+Vibes&display=swap');
                
                :root {
                    --font-serif: 'Playfair Display', serif;
                    --font-cursive: 'Great Vibes', cursive;
                }

                [data-theme="vintage-charm"] {
                    background-image: 
                        url("https://www.transparenttextures.com/patterns/parchment.png"),
                        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
                    background-attachment: fixed;
                }

                .vintage-border {
                    border: 1px solid #1B3022;
                    position: relative;
                }

                .vintage-border::after {
                    content: '';
                    position: absolute;
                    inset: 4px;
                    border: 1px solid rgba(27, 48, 34, 0.2);
                    pointer-events: none;
                }
            `}</style>

            <VintageCharmNavbar storeName={store.name} logo={store.logo} subdomain={store.subdomain} storeId={store.id} />
            <VintageCharmCartDrawer storeId={store.id} />
            <CartNotification />
            <main className="flex-grow">{children}</main>
            {!isDashboard && (
                <VintageCharmFooter storeName={store.name} />
            )}
        </div>
    );
};
