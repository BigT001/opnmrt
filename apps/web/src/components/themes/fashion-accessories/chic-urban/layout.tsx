'use client';

import React from 'react';
import { StoreThemeProps } from '../../types';
import { ChicUrbanNavbar } from './Navbar';
import { ChicUrbanFooter } from './Footer';
import { ChicUrbanCartDrawer } from './CartDrawer';

export const ChicUrbanLayout: React.FC<StoreThemeProps> = ({ store, children }) => {
    return (
        <div className="font-sans antialiased text-black bg-white min-h-screen flex flex-col selection:bg-[#CCFF00] selection:text-black" data-theme="chic-urban">
            <style jsx global>{`
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }

                @keyframes glitch-skew {
                    0% { transform: skew(0deg); }
                    20% { transform: skew(3deg); }
                    40% { transform: skew(-3deg); }
                    60% { transform: skew(1deg); }
                    80% { transform: skew(-1deg); }
                    100% { transform: skew(0deg); }
                }

                .animate-scan {
                    animation: scanline 4s linear infinite;
                }

                .animate-glitch-skew {
                    animation: glitch-skew 0.5s infinite;
                }
            `}</style>
            <ChicUrbanNavbar storeName={store.name} logo={store.logo} />
            <ChicUrbanCartDrawer />
            <main className="flex-grow">{children}</main>
            <ChicUrbanFooter storeName={store.name} />
        </div>
    );
};

