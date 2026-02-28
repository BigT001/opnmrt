'use client';

import React from 'react';
import { StoreThemeProps } from '../types';
import { Outfit } from 'next/font/google';
import dynamic from 'next/dynamic';

import { usePathname } from 'next/navigation';

const VantageNavbar = dynamic(() => import('./Navbar').then(mod => mod.VantageNavbar), { ssr: false });
const VantageCartDrawer = dynamic(() => import('./CartDrawer').then(mod => mod.VantageCartDrawer), { ssr: false });
const VantageFooter = dynamic(() => import('./Footer').then(mod => mod.VantageFooter), { ssr: false });

const outfit = Outfit({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-outfit',
});

export const VantageLayout: React.FC<StoreThemeProps> = ({ children, store, isPreview, onConfigChange, onNavigate }) => {
    const pathname = usePathname();
    const config = store.themeConfig || {};
    const primaryFont = config.primaryFont || 'font-sans';
    const shouldHideFooter = !isPreview && (pathname?.includes('/customer') || pathname?.includes('/dashboard') || pathname?.includes('/seller') || pathname?.includes('/messages'));

    return (
        <div className={`theme-vantage-scope ${outfit.variable} ${primaryFont} selection:bg-black selection:text-white bg-white min-h-screen`}>
            <style jsx global>{`
                .theme-vantage-scope {
                    --primary-color: ${store.primaryColor || config.primaryColor || '#000000'};
                    --font-outfit: ${outfit.style.fontFamily};
                    --navbar-height: 72px;
                }
                
                /* Only apply Outfit as default if no other font class is active or if specifically requested */
                ${!config.primaryFont || config.primaryFont === 'font-sans' ? `
                .theme-vantage-scope * {
                    font-family: var(--font-outfit), sans-serif !important;
                }
                ` : ''}

                /* If serif or mono are chosen, ensure they respect the theme scope */
                .theme-vantage-scope.font-serif * {
                    font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif !important;
                }
                .theme-vantage-scope.font-mono * {
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
                }

                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                .animate-marquee {
                    display: flex;
                    width: max-content;
                    animation: marquee 40s linear infinite;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #eee;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #ddd;
                }
            `}</style>

            <VantageNavbar
                storeName={store.name}
                logo={store.logo}
                storeId={store.id}
                isPreview={isPreview}
            />

            <VantageCartDrawer storeId={store.id} />

            <main className="min-h-screen pt-0 lg:pt-0 pb-0 lg:pb-0">
                {children}
            </main>

            {!shouldHideFooter && (
                <VantageFooter
                    storeName={store.name}
                    isPreview={isPreview}
                    instagram={store.instagram}
                    twitter={store.twitter}
                    facebook={store.facebook}
                    tiktok={store.tiktok}
                />
            )}
        </div>
    );
}
