'use client';

import React from 'react';
import { StoreThemeProps } from '../../types';
import { Header4 as RadiantGlowNavbar } from '../../headers';
import { RadiantGlowFooter } from './Footer';
import { RadiantGlowCartDrawer } from './CartDrawer';
import { CartNotification } from '@/components/storefront/CartNotification';

export const RadiantGlowLayout: React.FC<StoreThemeProps> = ({ store, children }) => {
    return (
        <div
            className="antialiased text-[#2D1E1E] bg-[#FFF9F0] min-h-screen flex flex-col selection:bg-[#C19A6B]/20"
            style={{
                fontFamily: "'Montserrat', sans-serif"
            }}
            data-theme="radiant-glow"
        >
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Montserrat:wght@100;200;300;400;500;600;700&display=swap');
                
                :root {
                    --font-luminous: 'Cormorant Garamond', serif;
                    --font-body: 'Montserrat', sans-serif;
                }

                h1, h2, h3, h4, .font-luminous {
                    font-family: var(--font-luminous);
                    letter-spacing: -0.01em;
                }

                .font-sans {
                    font-family: var(--font-body);
                }

                .shimmer-text {
                    background: linear-gradient(
                        90deg, 
                        #2D1E1E 0%, 
                        #C19A6B 25%, 
                        #2D1E1E 50%, 
                        #C19A6B 75%, 
                        #2D1E1E 100%
                    );
                    background-size: 200% auto;
                    color: transparent;
                    -webkit-background-clip: text;
                    background-clip: text;
                    animation: shimmer 8s linear infinite;
                }

                @keyframes shimmer {
                    to { background-position: 200% center; }
                }

                .aura-glow {
                    position: fixed;
                    top: 0;
                    right: 0;
                    width: 60vw;
                    height: 60vh;
                    background: radial-gradient(circle, rgba(226, 175, 162, 0.15) 0%, rgba(255, 249, 240, 0) 70%);
                    filter: blur(80px);
                    z-index: 0;
                    pointer-events: none;
                }

                /* Custom Scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: #FFF9F0;
                }
                ::-webkit-scrollbar-thumb {
                    background: #C19A6B/30;
                    border-radius: 20px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #C19A6B/50;
                }
            `}</style>

            <div className="aura-glow" />
            <RadiantGlowNavbar storeName={store.name} logo={store.logo} subdomain={store.subdomain} storeId={store.id} />
            <RadiantGlowCartDrawer storeId={store.id} />
            <CartNotification />
            <main className="flex-grow pt-24 relative z-10">{children}</main>
            <RadiantGlowFooter storeName={store.name} />
        </div>
    );
};

