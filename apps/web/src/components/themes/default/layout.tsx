'use client';

import React from 'react';
import { StoreThemeProps } from '../types';
import { ClassicalHeader } from '../headers/ClassicalHeader';
import { DefaultFooter } from './Footer';
import { DefaultCartDrawer } from './CartDrawer';
import { CartNotification } from '@/components/storefront/CartNotification';

import { usePathname } from 'next/navigation';

export const DefaultLayout: React.FC<StoreThemeProps> = ({ store, children, isPreview, onConfigChange, onNavigate }) => {
    const pathname = usePathname();
    const config = store.themeConfig || {};
    const shouldHideFooter = !isPreview && (pathname?.includes('/customer') || pathname?.includes('/dashboard') || pathname?.includes('/seller') || pathname?.includes('/messages'));

    const HeaderVariant = ClassicalHeader;

    return (
        <div className="min-h-screen bg-white dark:bg-[#0d0d0d] flex flex-col font-sans theme-standard-scope transition-colors duration-300">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;500;600;700;800;900&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800;900&display=swap');

                .theme-standard-scope {
                    --primary-color: ${store.primaryColor || config.primaryColor || '#4f46e5'};
                    --primary: var(--primary-color);
                    --color-primary: var(--primary-color);
                    
                    /* Map indigo and slate variables to brand color for standard themes */
                    --color-indigo-50: var(--primary-color);
                    --color-indigo-100: var(--primary-color);
                    --color-indigo-200: var(--primary-color);
                    --color-indigo-300: var(--primary-color);
                    --color-indigo-400: var(--primary-color);
                    --color-indigo-500: var(--primary-color);
                    --color-indigo-600: var(--primary-color);
                    --color-indigo-700: var(--primary-color);
                    --color-indigo-800: var(--primary-color);
                    --color-indigo-900: var(--primary-color);
                    --color-indigo-950: var(--primary-color);
                    
                    --font-app: ${config.primaryFont === 'font-serif' ? "'Crimson Pro', serif" : config.primaryFont === 'font-mono' ? "'JetBrains Mono', monospace" : "'Inter', sans-serif"};
                }

                .theme-standard-scope {
                    font-family: var(--font-app) !important;
                }

                /* Ensure !important overrides for components that might bypass variables */
                .theme-standard-scope .bg-primary, 
                .theme-standard-scope .bg-indigo-600 { background-color: var(--primary-color) !important; }
                
                .theme-standard-scope .text-primary,
                .theme-standard-scope .text-indigo-600 { color: var(--primary-color) !important; }
                
                .theme-standard-scope .border-primary,
                .theme-standard-scope .border-indigo-600 { border-color: var(--primary-color) !important; }

                /* ============================================
                   STOREFRONT DARK MODE — applies when .dark 
                   is set on <html> by next-themes
                   ============================================ */
                .dark .theme-standard-scope,
                .dark .theme-standard-scope * {
                    color-scheme: dark;
                }

                /* Main backgrounds */
                .dark .theme-standard-scope .bg-white { background-color: #0d0d0d !important; }
                .dark .theme-standard-scope .bg-gray-50 { background-color: #141414 !important; }
                .dark .theme-standard-scope .bg-gray-50\\/50 { background-color: rgba(20,20,20,0.5) !important; }
                .dark .theme-standard-scope .bg-gray-50\\/30 { background-color: rgba(20,20,20,0.3) !important; }
                .dark .theme-standard-scope .bg-gray-100 { background-color: #1a1a1a !important; }
                .dark .theme-standard-scope .bg-gray-200 { background-color: #222222 !important; }

                /* Cards and sections */
                .dark .theme-standard-scope .rounded-\\[2\\.5rem\\] { background-color: #181818; }
                .dark .theme-standard-scope .bg-\\[\\#f5f5f5\\] { background-color: #181818 !important; }

                /* Text color overrides */
                .dark .theme-standard-scope .text-gray-900 { color: #f0f0f0 !important; }
                .dark .theme-standard-scope .text-\\[\\#111827\\] { color: #f0f0f0 !important; }
                .dark .theme-standard-scope .text-gray-800 { color: #e0e0e0 !important; }
                .dark .theme-standard-scope .text-gray-700 { color: #d0d0d0 !important; }
                .dark .theme-standard-scope .text-gray-600 { color: #a0a0a0 !important; }
                .dark .theme-standard-scope .text-gray-500 { color: #888888 !important; }
                .dark .theme-standard-scope .text-gray-400 { color: #666666 !important; }

                /* Borders */
                .dark .theme-standard-scope .border-gray-100 { border-color: #222222 !important; }
                .dark .theme-standard-scope .border-gray-200 { border-color: #2a2a2a !important; }
                .dark .theme-standard-scope .border-gray-50 { border-color: #1a1a1a !important; }

                /* Inputs */
                .dark .theme-standard-scope input,
                .dark .theme-standard-scope textarea,
                .dark .theme-standard-scope select {
                    background-color: #1a1a1a !important;
                    color: #f0f0f0 !important;
                    border-color: #2a2a2a !important;
                }

                /* Product cards — image background */
                .dark .theme-standard-scope .aspect-square.bg-gray-50,
                .dark .theme-standard-scope .aspect-\\[3\\/4\\].bg-gray-50,
                .dark .theme-standard-scope .aspect-\\[4\\/5\\].bg-gray-50 {
                    background-color: #1a1a1a !important;
                }

                /* Header override (already in nav element but for global scope) */
                .dark .header-container { 
                    background-color: #0d0d0d !important;
                    border-color: #1e1e1e !important;
                }
                .dark .header-menu-link { color: #888888; }
                .dark .header-menu-link:hover, .dark .header-menu-link.active { color: var(--primary-color); }

                /* Buttons that need inversion */
                .dark .theme-standard-scope .bg-slate-100 { background-color: #1e1e1e !important; }
                .dark .theme-standard-scope .text-slate-700 { color: #aaaaaa !important; }
                .dark .theme-standard-scope .hover\\:bg-slate-200:hover { background-color: #2a2a2a !important; }
                
                /* Category pills */
                .dark .theme-standard-scope button.bg-white { background-color: #1a1a1a !important; }
            `}</style>
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
            {!shouldHideFooter && (
                <DefaultFooter
                    storeName={store.name}
                    subdomain={store.subdomain}
                    instagram={store.instagram}
                    twitter={store.twitter}
                    facebook={store.facebook}
                    tiktok={store.tiktok}
                />
            )}
        </div>
    );
};
