'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShoppingBag, Search, User, SlidersHorizontal } from 'lucide-react';
import { useStoreCart } from '@/store/useStoreCart';
import { NavbarProps } from '../types';
import './HeaderStyles.css';

import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuthStore } from '@/store/useAuthStore';

export function Header4({ storeName = 'opnmart', logo, subdomain: propSubdomain, storeId }: NavbarProps) {
    const { toggleCart, totalCount: itemCount } = useStoreCart(storeId);
    const params = useParams<{ subdomain: string }>();
    const subdomain = propSubdomain || params?.subdomain;
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
            lastScrollY = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <div className="h-[80px]" />
            <nav
                className="header-container bg-white dark:bg-black transition-colors duration-300"
                style={{
                    position: 'fixed',
                    transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
                    transition: 'transform 0.3s ease-in-out, background-color 0.3s'
                }}
            >
                <div className="header-content header-layout-4">
                    {/* Logo Left */}
                    <Link href={`/store/${subdomain}`} className="header-logo dark:text-white">
                        {logo ? (
                            <img src={logo} alt={storeName} className="h-10 w-auto object-contain" />
                        ) : (
                            <span>{storeName}</span>
                        )}
                    </Link>

                    {/* Menu Left-Center */}
                    <ul className="header-menu">
                        <li><Link href={`/store/${subdomain}`} className="header-menu-link dark:text-gray-300 dark:hover:text-white">Home</Link></li>
                        <li><Link href={`/store/${subdomain}/shop`} className="header-menu-link dark:text-gray-300 dark:hover:text-white">Shop</Link></li>
                        <li><Link href={`/store/${subdomain}/about`} className="header-menu-link dark:text-gray-300 dark:hover:text-white">About</Link></li>
                    </ul>

                    {/* Search Bar Middle */}
                    <div className="header-search-container dark:bg-gray-800">
                        <Search className="header-search-icon w-4 h-4 dark:text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search product..."
                            className="header-search-input dark:text-white dark:placeholder-gray-500"
                        />
                    </div>

                    {/* Icons Right */}
                    <div className="header-icons">
                        <button onClick={toggleCart} className="header-icon-button relative dark:text-gray-300 dark:hover:text-white">
                            <ShoppingBag className="w-5 h-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                        <AuthButtons subdomain={subdomain} />
                        <ThemeToggle />
                    </div>
                </div>
            </nav>
        </>
    );
}

function AuthButtons({ subdomain }: { subdomain: string }) {
    const { user } = useAuthStore();
    const isLoggedIn = !!user;

    if (isLoggedIn) {
        return (
            <Link href={`/store/${subdomain}/customer/orders`} className="header-icon-button hover:text-blue-600 transition-colors flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl group">
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">My Account</span>
            </Link>
        );
    }

    return (
        <Link href={`/store/${subdomain}/customer/login`} className="header-button-primary bg-slate-900 text-white hover:bg-slate-800 px-6 py-2 rounded-xl flex items-center gap-2 transition-all">
            <User className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Login</span>
        </Link>
    );
}
