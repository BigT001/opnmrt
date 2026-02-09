'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShoppingBag, Search, User, SlidersHorizontal } from 'lucide-react';
import { useStoreCart } from '@/store/useStoreCart';
import { NavbarProps } from '../types';
import './HeaderStyles.css';

export function Header3({ storeName = 'opnmart', logo, subdomain: propSubdomain, storeId }: NavbarProps) {
    const { toggleCart, totalCount: itemCount } = useStoreCart(storeId);
    const params = useParams<{ subdomain: string }>();
    const subdomain = propSubdomain || params?.subdomain;

    return (
        <nav className="header-container">
            <div className="header-content header-layout-3">
                {/* Logo Left */}
                <Link href={`/store/${subdomain}`} className="header-logo">
                    {logo ? (
                        <img src={logo} alt={storeName} className="h-10 w-auto object-contain" />
                    ) : (
                        <span>{storeName}</span>
                    )}
                </Link>

                {/* Menu Center */}
                <ul className="header-menu">
                    <li><Link href={`/store/${subdomain}`} className="header-menu-link">Home</Link></li>
                    <li><Link href={`/store/${subdomain}/shop`} className="header-menu-link">Shop</Link></li>
                    <li><Link href={`/store/${subdomain}/about`} className="header-menu-link">About</Link></li>
                </ul>

                {/* Icons Right */}
                <div className="header-icons">
                    <button className="header-icon-button">
                        <Search className="w-5 h-5" />
                    </button>
                    <button onClick={toggleCart} className="header-icon-button relative">
                        <ShoppingBag className="w-5 h-5" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </button>
                    <AuthButtons subdomain={subdomain} />
                    <button className="header-icon-button">
                        <SlidersHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
}

function AuthButtons({ subdomain }: { subdomain: string }) {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

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
