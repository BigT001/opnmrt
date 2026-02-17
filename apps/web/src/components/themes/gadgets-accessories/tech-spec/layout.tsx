'use client';

import React from 'react';
import { StoreThemeProps } from '../../types';
import { Header1 as TechSpecNavbar } from '../../headers';
import { TechSpecFooter } from './Footer';
import { TechSpecCartDrawer } from './CartDrawer';
import { CartNotification } from '@/components/storefront/CartNotification';

import { usePathname } from 'next/navigation';

export const TechSpecLayout: React.FC<StoreThemeProps> = ({ store, children }) => {
    const pathname = usePathname();
    const isDashboard = pathname?.includes('/customer') || pathname?.includes('/dashboard');

    return (
        <div className="font-sans antialiased text-gray-900 bg-white min-h-screen flex flex-col selection:bg-red-500 selection:text-white" data-theme="tech-spec">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
                
                :root {
                    --font-space: 'Space Grotesk', sans-serif;
                    --font-inter: 'Inter', sans-serif;
                    --font-mono: 'JetBrains Mono', monospace;
                    --tech-red: #E72E46;
                    --tech-purple: #6B21A8;
                }

                .font-tech { font-family: var(--font-space); }
                .font-data { font-family: var(--font-inter); }
                .font-mono { font-family: var(--font-mono); }

                /* Custom Scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                ::-webkit-scrollbar-thumb {
                    background: #ccc;
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: var(--tech-red);
                }
            `}</style>

            <TechSpecNavbar storeName={store.name} logo={store.logo} subdomain={store.subdomain} storeId={store.id} />
            <TechSpecCartDrawer storeId={store.id} />
            <CartNotification />
            <main className="flex-grow pt-[140px]">{children}</main>
            {!isDashboard && (
                <TechSpecFooter storeName={store.name} />
            )}
        </div>
    );
};

