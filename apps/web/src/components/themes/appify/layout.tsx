'use client';

import React from 'react';
import { StoreThemeProps } from '../types';
import Link from 'next/link';
import { Home, Heart, Store, ShoppingBag, User } from 'lucide-react';

import { AppifyNavbar } from './Navbar';
import { AppifyCartDrawer } from './CartDrawer';
import { AppifyWishlistDrawer } from './WishlistDrawer';
import { AppifyChatDrawer } from './ChatDrawer';
import { AppifyNotification } from './Notification';
import { AppifyFooter } from './Footer';

import { usePathname, useParams } from 'next/navigation';

import { useWishlistStore } from '@/store/useWishlistStore';

export const AppifyLayout: React.FC<StoreThemeProps> = ({ store, children, isPreview, onConfigChange, onNavigate, virtualPath }) => {
    const pathname = usePathname();
    const params = useParams<{ subdomain: string }>();
    const subdomain = store?.subdomain || params?.subdomain;
    const isProductPage = pathname?.includes('/products/');
    const isDashboard = !isPreview && (pathname?.includes('/customer') || pathname?.includes('/dashboard') || pathname?.includes('/checkout'));
    const { toggleDrawer } = useWishlistStore();

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
    };

    const primaryColor = store.primaryColor || store.themeConfig?.primaryColor || '#000000';
    const primaryColorRgb = hexToRgb(primaryColor);

    const [showNav, setShowNav] = React.useState(true);
    const lastScrollY = React.useRef(0);

    React.useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const delta = currentScrollY - lastScrollY.current;

            if (currentScrollY <= 10) {
                setShowNav(true);
            } else if (Math.abs(delta) > 10) {
                setShowNav(delta < 0);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { icon: Home, label: 'Home', path: '' },
        { icon: Heart, label: 'Favorites', path: 'favorites' },
        { icon: Store, label: 'Shop', path: 'shop', isCentral: true },
        { icon: ShoppingBag, label: 'Orders', path: 'customer/orders' },
        { icon: User, label: 'Profile', path: 'customer/profile' },
    ];

    const isActive = (path: string) => {
        const fullPath = `/store/${subdomain}${path ? '/' + path : ''}`;
        return pathname === fullPath;
    };

    return (
        <div className="antialiased text-gray-900 bg-[#f8f9fb] min-h-screen flex flex-col font-sans selection:bg-orange-200 theme-preview-scope">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;500;600;700;800&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&display=swap');
                
                .theme-preview-scope {
                    --primary-color: ${primaryColor};
                    --primary-color-rgb: ${primaryColorRgb};
                    --primary: var(--primary-color);
                    --color-primary: var(--primary-color);

                    --font-app: ${store.themeConfig?.primaryFont === 'font-serif' ? "'Crimson Pro', serif" : store.themeConfig?.primaryFont === 'font-mono' ? "'JetBrains Mono', monospace" : "'Plus Jakarta Sans', sans-serif"};
                }

                .theme-preview-scope body,
                .theme-preview-scope {
                    font-family: var(--font-app) !important;
                }

                .theme-preview-scope .bg-primary { background-color: var(--primary-color) !important; }
                .theme-preview-scope .text-primary { color: var(--primary-color) !important; }
                .theme-preview-scope .border-primary { border-color: var(--primary-color) !important; }
                .theme-preview-scope .ring-primary { --tw-ring-color: var(--primary-color) !important; }
                .theme-preview-scope .shadow-primary { --tw-shadow-color: var(--primary-color) !important; }

                /* Surgical Brand Overrides - Only affect the main brand shade while preserving variants */
                .theme-preview-scope .bg-orange-500 { background-color: var(--primary-color) !important; }
                .theme-preview-scope .bg-orange-600 { background-color: var(--primary-color) !important; }
                .theme-preview-scope .hover\:bg-orange-600:hover { background-color: var(--primary-color) !important; filter: brightness(0.9); }
                .theme-preview-scope .hover\:bg-orange-500:hover { background-color: var(--primary-color) !important; filter: brightness(0.9); }
                .theme-preview-scope .active\:bg-orange-700:active { background-color: var(--primary-color) !important; filter: brightness(0.8); }
                
                .theme-preview-scope .text-orange-500 { color: var(--primary-color) !important; }
                .theme-preview-scope .text-orange-600 { color: var(--primary-color) !important; }
                .theme-preview-scope .hover\:text-orange-600:hover { color: var(--primary-color) !important; filter: brightness(0.9); }
                
                .theme-preview-scope .border-orange-500 { border-color: var(--primary-color) !important; }
                .theme-preview-scope .border-orange-600 { border-color: var(--primary-color) !important; }
                .theme-preview-scope .from-orange-500 { --tw-gradient-from: var(--primary-color) !important; }
                .theme-preview-scope .to-orange-500 { --tw-gradient-to: var(--primary-color) !important; }
                .theme-preview-scope .shadow-orange-500\/40 { --tw-shadow-color: rgba(var(--primary-color-rgb), 0.4) !important; }
                .theme-preview-scope .shadow-orange-500 { --tw-shadow-color: rgba(var(--primary-color-rgb), 0.5) !important; }

                .theme-preview-scope .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .theme-preview-scope .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <div className={isProductPage ? 'hidden md:block' : ''}>
                <AppifyNavbar
                    storeName={store.name}
                    logo={store.logo}
                    storeId={store.id}
                    isPreview={isPreview}
                    onConfigChange={onConfigChange}
                    onNavigate={onNavigate}
                    themeConfig={store.themeConfig}
                    type={pathname === `/store/${subdomain}` ? 'home' : pathname === `/store/${subdomain}/shop` ? 'shop' : isDashboard ? 'customer' : isProductPage ? 'product' : 'shop'}
                />
            </div>

            <AppifyCartDrawer storeId={store.id} />
            <AppifyWishlistDrawer />
            <AppifyChatDrawer />
            <AppifyNotification />

            <main className={`flex-grow relative ${(pathname === `/store/${subdomain}` || pathname === `/store/${subdomain}/shop` || isDashboard || isProductPage) ? 'bg-transparent' : 'bg-[#0a0a0a]'
                }`}>
                <div className={`min-h-full relative z-10 ${(pathname === `/store/${subdomain}` || pathname === `/store/${subdomain}/shop` || isDashboard || isProductPage)
                    ? 'pt-0'
                    : 'bg-white rounded-t-[40px] shadow-2xl overflow-hidden'
                    }`}>
                    {children}
                </div>
            </main>
            {!isDashboard && (
                <AppifyFooter
                    storeName={store.name}
                    instagram={store.instagram}
                    twitter={store.twitter}
                    facebook={store.facebook}
                    tiktok={store.tiktok}
                />
            )}

            {!isDashboard && (
                <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 px-6 py-2 pb-4 sm:pb-3 flex items-center justify-between z-[100] safe-area-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.08)] md:hidden">
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        const isFavorites = item.label === 'Favorites';

                        const content = (
                            <>
                                {item.isCentral ? (
                                    <div className="absolute -top-12 flex flex-col items-center">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/40 ring-4 ring-white active:scale-95 transition-all ${active ? 'bg-orange-600' : 'bg-orange-500'
                                            }`}>
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <span className={`mt-1.5 text-[10px] font-black uppercase tracking-tighter ${active ? 'text-orange-600' : 'text-gray-400'
                                            }`}>
                                            {item.label}
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <item.icon className={`w-6 h-6 transition-colors ${active ? 'text-gray-900 fill-gray-900' : 'text-gray-400 group-hover:text-gray-600'
                                            }`} />
                                        <span className={`text-[10px] font-bold transition-colors ${active ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'
                                            }`}>
                                            {item.label}
                                        </span>
                                    </>
                                )}
                            </>
                        );

                        if (isFavorites) {
                            return (
                                <button
                                    key={item.label}
                                    onClick={toggleDrawer}
                                    className="relative flex flex-col items-center gap-1 group outline-none"
                                >
                                    {content}
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.label}
                                href={isPreview ? '#' : `/store/${subdomain}/${item.path}`}
                                onClick={(e) => {
                                    if (isPreview && onNavigate) {
                                        e.preventDefault();
                                        onNavigate(item.path || 'index');
                                    }
                                }}
                                className="relative flex flex-col items-center gap-1 group"
                            >
                                {content}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
