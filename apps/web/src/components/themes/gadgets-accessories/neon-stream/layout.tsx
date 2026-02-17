'use client';

import React from 'react';
import { StoreThemeProps } from '../../types';
import { Header4 as NeonStreamNavbar } from '../../headers';
import { NeonStreamFooter } from './Footer';
import { NeonStreamCartDrawer } from './CartDrawer';
import { CartNotification } from '@/components/storefront/CartNotification';

import { usePathname } from 'next/navigation';

export const NeonStreamLayout: React.FC<StoreThemeProps> = ({ store, children }) => {
    const pathname = usePathname();
    return (
        <div className="font-sans antialiased text-white bg-[#050505] min-h-screen flex flex-col selection:bg-[#00F5FF] selection:text-black" data-theme="neon-stream">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
                
                :root {
                    --neon-cyan: #00F5FF;
                    --neon-purple: #BF00FF;
                    --font-syne: 'Syne', sans-serif;
                    --font-inter: 'Inter', sans-serif;
                }

                .font-syne { font-family: var(--font-syne); }
                .font-inter { font-family: var(--font-inter); }

                /* Custom Scrollbar */
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: #0a0a0a;
                }
                ::-webkit-scrollbar-thumb {
                    background: #1a1a1a;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: var(--neon-cyan);
                    box-shadow: 0 0 10px var(--neon-cyan);
                }

                @keyframes flow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .neon-flow {
                    background: linear-gradient(-45deg, #050505, #0a0a0a, #0d0d0d, #050505);
                    background-size: 400% 400%;
                    animation: flow 15s ease infinite;
                }
            `}</style>

            <NeonStreamNavbar storeName={store.name} logo={store.logo} subdomain={store.subdomain} storeId={store.id} />
            <NeonStreamCartDrawer storeId={store.id} />
            <CartNotification />
            <main className="flex-grow neon-flow">{children}</main>
            {!pathname?.includes('/customer') && !pathname?.includes('/dashboard') && (
                <NeonStreamFooter storeName={store.name} />
            )}
        </div>
    );
};

