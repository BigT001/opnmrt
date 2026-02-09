'use client';

import React from 'react';
import { StoreThemeProps } from '../../types';
import { Header4 as StarkEdgeNavbar } from '../../headers';
import { StarkEdgeFooter } from './Footer';
import { StarkEdgeCartDrawer } from './CartDrawer';
import { CartNotification } from '@/components/storefront/CartNotification';

export const StarkEdgeLayout: React.FC<StoreThemeProps> = ({ store, children }) => {
    return (
        <div
            className="font-sans text-white bg-[#080808] min-h-screen flex flex-col relative overflow-x-hidden selection:bg-[#00F0FF] selection:text-black"
            data-theme="stark-edge"
        >
            {/* Tactical Grid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
                
                :root {
                    --font-space: 'Space Grotesk', sans-serif;
                    --font-mono: 'JetBrains Mono', monospace;
                }

                .font-tactical { font-family: var(--font-space); }
                .font-data { font-family: var(--font-mono); }

                /* Custom Scrollbar for Stark Edge */
                ::-webkit-scrollbar {
                    width: 4px;
                }
                ::-webkit-scrollbar-track {
                    background: #080808;
                }
                ::-webkit-scrollbar-thumb {
                    background: #1A1A1A;
                    border: 1px solid #333;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #00F0FF;
                }
            `}</style>

            <div className="relative z-10 flex flex-col min-h-screen">
                <StarkEdgeNavbar storeName={store.name} logo={store.logo} subdomain={store.subdomain} storeId={store.id} />
                <StarkEdgeCartDrawer storeId={store.id} />
                <CartNotification />
                <main className="flex-grow">{children}</main>
                <StarkEdgeFooter storeName={store.name} />
            </div>

            {/* Scanning Line Overlay */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02] bg-gradient-to-b from-transparent via-[#00F0FF] to-transparent h-1 w-full animate-scan" style={{ animation: 'scan 8s linear infinite' }} />

            <style jsx>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100vh); }
                }
            `}</style>
        </div>
    );
};
