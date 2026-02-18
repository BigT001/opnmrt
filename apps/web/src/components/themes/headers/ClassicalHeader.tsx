'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShoppingBag, Search, User, SlidersHorizontal, ChevronDown, Menu, X } from 'lucide-react';
import { useStoreCart } from '@/store/useStoreCart';
import { NavbarProps } from '../types';
import './HeaderStyles.css';

import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

export function ClassicalHeader({
    storeName = 'opnmart',
    logo,
    subdomain: propSubdomain,
    storeId,
    isPreview,
    onConfigChange,
    navHome = 'Home',
    navShop = 'Shop',
    navAbout = 'About',
    onNavigate
}: NavbarProps) {
    const { toggleCart, totalCount: itemCount } = useStoreCart(storeId);
    const params = useParams<{ subdomain: string }>();
    const subdomain = propSubdomain || params?.subdomain;
    const [isVisible, setIsVisible] = React.useState(true);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleEdit = (key: string, value: string) => {
        if (!isPreview) return;
        onConfigChange?.({ [key]: value });
    };

    const handleNavigate = (e: React.MouseEvent, path: string) => {
        if (isPreview) {
            e.preventDefault();
            onNavigate?.(path);
        }
        setIsMenuOpen(false);
    };

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
            {!isPreview && <div className="h-[80px]" />}
            <nav
                className="header-container bg-white dark:bg-black transition-colors duration-300"
                style={{
                    position: isPreview ? 'absolute' : 'fixed',
                    transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
                    transition: 'transform 0.3s ease-in-out, background-color 0.3s'
                }}
            >
                <div className="header-content header-layout-1">
                    <div className="header-left">
                        <button className="mobile-menu-toggle lg:hidden mr-4" onClick={() => setIsMenuOpen(true)}>
                            <Menu className="w-5 h-5" />
                        </button>
                        <Link href={`/store/${subdomain}`} className="header-logo dark:text-white" onClick={(e) => handleNavigate(e, 'index')}>
                            {logo ? (
                                <img src={logo} alt={storeName} className="h-8 w-auto object-contain" />
                            ) : (
                                <span className="text-xl font-black uppercase tracking-tighter" contentEditable={isPreview} suppressContentEditableWarning onBlur={(e) => handleEdit('name', e.currentTarget.innerText)}>{storeName}</span>
                            )}
                        </Link>
                    </div>

                    <div className="header-center hidden lg:flex">
                        <ul className="header-menu">
                            <li><Link href={`/store/${subdomain}`} className="header-menu-link" onClick={(e) => handleNavigate(e, 'index')}>{navHome}</Link></li>
                            <li><Link href={`/store/${subdomain}/shop`} className="header-menu-link" onClick={(e) => handleNavigate(e, 'shop')}>{navShop}</Link></li>
                            <li><Link href={`/store/${subdomain}/about`} className="header-menu-link" onClick={(e) => handleNavigate(e, 'about')}>{navAbout}</Link></li>
                        </ul>
                    </div>

                    <div className="header-right gap-4">
                        <button className="text-slate-400 hover:text-black transition-colors"><Search className="w-5 h-5" /></button>
                        <AuthButtons subdomain={subdomain} />
                        <button onClick={toggleCart} className="relative group text-slate-400 hover:text-black">
                            <ShoppingBag className="w-5 h-5" />
                            {itemCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">{itemCount}</span>}
                        </button>
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="mobile-menu-overlay"
                    >
                        <button className="mobile-menu-close" onClick={() => setIsMenuOpen(false)}>
                            <X className="w-6 h-6" />
                        </button>

                        <div className="mobile-menu-links">
                            <Link
                                href={`/store/${subdomain}`}
                                className="mobile-menu-link"
                                onClick={(e) => handleNavigate(e, 'index')}
                            >
                                {navHome}
                            </Link>
                            <Link
                                href={`/store/${subdomain}/shop`}
                                className="mobile-menu-link"
                                onClick={(e) => handleNavigate(e, 'shop')}
                            >
                                {navShop}
                            </Link>
                            <Link
                                href={`/store/${subdomain}/about`}
                                className="mobile-menu-link"
                                onClick={(e) => handleNavigate(e, 'about')}
                            >
                                {navAbout}
                            </Link>
                        </div>

                        <div className="mt-8">
                            <ThemeToggle />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function AuthButtons({ subdomain }: { subdomain: string }) {
    const { user } = useAuthStore();
    const isLoggedIn = !!user;

    if (isLoggedIn) {
        return (
            <Link href={`/store/${subdomain}/customer/orders`} className="header-icon-button transition-colors flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl group text-slate-900 font-bold hover:bg-slate-200">
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">My Account</span>
            </Link>
        );
    }

    return (
        <Link href={`/store/${subdomain}/customer/login`} className="bg-slate-900 text-white hover:bg-black px-6 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-slate-200">
            <User className="w-4 h-4 text-white" />
            <span className="text-[10px] font-black uppercase tracking-widest">Login</span>
        </Link>
    );
}
