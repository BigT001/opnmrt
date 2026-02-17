'use client';

import React from 'react';
import { StoreThemeProps } from '../../types';
import { Header3 as PureBotanicalNavbar } from '../../headers';
import { PureBotanicalFooter } from './Footer';
import { PureBotanicalCartDrawer } from './CartDrawer';
import { CartNotification } from '@/components/storefront/CartNotification';

import { usePathname } from 'next/navigation';

export const PureBotanicalLayout: React.FC<StoreThemeProps> = ({ store, children }) => {
    const pathname = usePathname();
    const isDashboard = pathname?.includes('/customer') || pathname?.includes('/dashboard');

    return (
        <div
            className="antialiased text-[#1C2B21] bg-[#F9FAF8] min-h-screen flex flex-col selection:bg-[#7C9082]/20"
            style={{
                fontFamily: "'Lora', 'EB Garamond', serif",
                backgroundImage: `url('https://www.transparenttextures.com/patterns/natural-paper.png')`,
                backgroundAttachment: 'fixed'
            }}
            data-theme="pure-botanical"
        >
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Lora:ital,wght@0,400..700;1,400..700&family=Inter:wght@300;400;500;600&display=swap');
                
                :root {
                    --font-serif: 'Lora', serif;
                    --font-botanical: 'EB Garamond', serif;
                    --font-sans: 'Inter', sans-serif;
                }

                h1, h2, h3, h4, .font-serif {
                    font-family: var(--font-botanical);
                    font-weight: 500;
                    letter-spacing: -0.02em;
                }

                .font-sans {
                    font-family: var(--font-sans);
                }

                .soft-float {
                    animation: float 6s ease-in-out infinite;
                }

                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }

                /* Custom Scrollbar */
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: #F9FAF8;
                }
                ::-webkit-scrollbar-thumb {
                    background: #7C9082/30;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #7C9082/50;
                }
            `}</style>

            <PureBotanicalNavbar storeName={store.name} logo={store.logo} subdomain={store.subdomain} storeId={store.id} />
            <PureBotanicalCartDrawer storeId={store.id} />
            <CartNotification />
            <main className="flex-grow pt-20">{children}</main>
            {!isDashboard && (
                <PureBotanicalFooter storeName={store.name} />
            )}
        </div>
    );
};

