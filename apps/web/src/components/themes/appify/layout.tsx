'use client';

import React from 'react';
import { StoreThemeProps } from '../types';
import { AppifyNavbar } from './Navbar';
import { AppifyFooter } from './Footer';
import { AppifyCartDrawer } from './CartDrawer';
import { AppifyWishlistDrawer } from './WishlistDrawer';
import { AppifyChatDrawer } from './ChatDrawer';
import { AppifyNotification } from './Notification';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { Home, Heart, Store, ShoppingBag, User } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import Link from 'next/link';

export const AppifyLayout: React.FC<StoreThemeProps> = ({ store, children, isPreview, onConfigChange, onNavigate }) => {
    const pathname = usePathname();
    const { subdomain } = useParams<{ subdomain: string }>();
    const isDashboard = pathname?.includes('/customer') || pathname?.includes('/dashboard') || pathname?.includes('/checkout');
    const { toggleDrawer } = useWishlistStore();

    // Bottom Tab Logic
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

    return (
        <div className="antialiased text-gray-900 bg-[#f8f9fb] min-h-screen flex flex-col font-sans selection:bg-orange-200">
            {/* Global mobile app styles */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
                
                :root {
                    --font-app: 'Plus Jakarta Sans', sans-serif;
                }

                body {
                    font-family: var(--font-app);
                }

                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <AppifyNavbar
                storeName={store.name}
                logo={store.logo}
                subdomain={store.subdomain}
                storeId={store.id}
                isPreview={isPreview}
                onConfigChange={onConfigChange}
                onNavigate={onNavigate}
                type={
                    pathname === `/store/${subdomain}` || pathname === `/store/${subdomain}/`
                        ? 'home'
                        : pathname?.includes('/products/')
                            ? 'product'
                            : (pathname?.includes('/customer') || pathname?.includes('/dashboard') || pathname?.includes('/checkout'))
                                ? 'customer'
                                : 'shop'
                }
            />

            <AppifyCartDrawer storeId={store.id} />
            <AppifyWishlistDrawer />
            <AppifyChatDrawer />
            <AppifyNotification />

            <main className={`flex-grow relative ${(pathname === `/store/${subdomain}` || pathname === `/store/${subdomain}/shop` || isDashboard) ? 'bg-transparent' : 'bg-[#0a0a0a]'
                }`}>
                <div className={`min-h-full pb-16 relative z-10 ${(pathname === `/store/${subdomain}` || pathname === `/store/${subdomain}/shop` || isDashboard)
                    ? 'pt-0'
                    : 'bg-white rounded-t-[40px] shadow-2xl overflow-hidden'
                    }`}>
                    {children}
                </div>
            </main>

            {/* Bottom Tab Bar - Mobile App Style (Fixed / Stagnant) */}
            <div
                className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 px-6 py-2 pb-4 sm:pb-3 flex items-center justify-between z-[100] safe-area-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.08)]"
            >
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
                            href={`/store/${subdomain}/${item.path}`}
                            className="relative flex flex-col items-center gap-1 group"
                        >
                            {content}
                        </Link>
                    );
                })}
            </div>

            {!isDashboard && (
                <div className="sm:block hidden pb-20">
                    <AppifyFooter storeName={store.name} />
                </div>
            )}
        </div>
    );
};
