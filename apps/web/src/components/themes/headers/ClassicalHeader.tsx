'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { ShoppingBag, Search, User, SlidersHorizontal, ChevronDown, Menu, X, Heart } from 'lucide-react';
import { useStoreCart } from '@/store/useStoreCart';
import { NavbarProps } from '../types';


import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText, EditableImage } from '../EditableContent';

export function ClassicalHeader({
    storeName = 'OPNMRT',
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
    const pathname = usePathname();
    const subdomain = propSubdomain || params?.subdomain;
    const [isVisible, setIsVisible] = React.useState(true);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isSearchActive, setIsSearchActive] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const setSearchInputRef = React.useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/store/${subdomain}/shop?q=${encodeURIComponent(searchTerm.trim())}`);
            setIsSearchActive(false);
            setIsMenuOpen(false);
        }
    };

    React.useEffect(() => {
        if (isSearchActive && setSearchInputRef.current) {
            setSearchInputRef.current.focus();
        }
    }, [isSearchActive]);

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
                className="header-container bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300"
                style={{
                    position: isPreview ? 'absolute' : 'fixed',
                    transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
                    transition: 'transform 0.3s ease-in-out, background-color 0.3s'
                }}
            >
                <div className="header-content header-layout-1 relative">
                    <AnimatePresence>
                        {isSearchActive && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute inset-x-0 top-0 h-full bg-white z-[60] flex items-center px-4 gap-4"
                            >
                                <form onSubmit={handleSearch} className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-gray-100">
                                    <Search className="w-4 h-4 text-gray-400 mr-3" />
                                    <input
                                        ref={setSearchInputRef}
                                        type="text"
                                        placeholder="Search for items..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="flex-1 bg-transparent text-sm font-bold outline-none h-10 text-slate-900 dark:text-white"
                                    />
                                </form>
                                <button onClick={() => setIsSearchActive(false)} className="p-2 text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-black">
                                    Cancel
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="header-left">
                        <button className="mobile-menu-toggle lg:hidden mr-4" onClick={() => setIsMenuOpen(true)}>
                            <Menu className="w-5 h-5" />
                        </button>
                        <Link
                            href={`/store/${subdomain}`}
                            className="header-logo flex items-center gap-3"
                            onClick={(e) => handleNavigate(e, 'index')}
                        >
                            <div className="h-8 w-auto min-w-[32px] overflow-hidden rounded-md">
                                <EditableImage
                                    src={logo}
                                    onSave={(url) => handleEdit('logo', url)}
                                    isPreview={isPreview}
                                    className="h-full w-auto"
                                />
                            </div>
                            <span className="text-xl font-black text-gray-900 uppercase tracking-tighter cursor-default">{storeName}</span>
                        </Link>
                    </div>

                    <div className="header-center hidden lg:flex">
                        <ul className="header-menu">
                            <li>
                                <Link
                                    href={`/store/${subdomain}`}
                                    onClick={(e) => handleNavigate(e, 'index')}
                                    className={`header-menu-link ${pathname === `/store/${subdomain}` ? 'active' : ''}`}
                                >
                                    <EditableText
                                        value={navHome}
                                        onSave={(val) => handleEdit('navHome', val)}
                                        isPreview={isPreview}
                                    />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/store/${subdomain}/shop`}
                                    onClick={(e) => handleNavigate(e, 'shop')}
                                    className={`header-menu-link ${pathname === `/store/${subdomain}/shop` ? 'active' : ''}`}
                                >
                                    <EditableText
                                        value={navShop}
                                        onSave={(val) => handleEdit('navShop', val)}
                                        isPreview={isPreview}
                                    />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/store/${subdomain}/about`}
                                    onClick={(e) => handleNavigate(e, 'about')}
                                    className={`header-menu-link ${pathname === `/store/${subdomain}/about` ? 'active' : ''}`}
                                >
                                    <EditableText
                                        value={navAbout}
                                        onSave={(val) => handleEdit('navAbout', val)}
                                        isPreview={isPreview}
                                    />
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="header-right gap-2 lg:gap-6 flex items-center pr-2 sm:pr-4">
                        <button
                            onClick={() => setIsSearchActive(true)}
                            className="text-gray-400 hover:text-black transition-all hover:scale-110 p-2"
                        >
                            <Search className="w-[18px] h-[18px]" />
                        </button>

                        <div className="hidden lg:flex items-center gap-4">
                            <AuthButtons subdomain={subdomain} />
                            <Link href={`/store/${subdomain}/favorites`} onClick={(e) => handleNavigate(e, 'favorites')} className="text-gray-400 hover:text-black dark:hover:text-white transition-all hover:scale-110">
                                <Heart className="w-[18px] h-[18px]" />
                            </Link>
                        </div>

                        <button onClick={toggleCart} className="relative group text-gray-400 hover:text-black transition-all hover:scale-110 p-2">
                            <ShoppingBag className="w-[18px] h-[18px]" />
                            {itemCount > 0 && <span className="absolute top-1 right-1 bg-black text-white text-[8px] font-black rounded-full h-3.5 w-3.5 flex items-center justify-center border border-white translate-x-1/2 -translate-y-1/2">{itemCount}</span>}
                        </button>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white dark:bg-gray-950 z-[2001] shadow-2xl lg:hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                <Link href={`/store/${subdomain}`} className="flex items-center gap-2 group">
                                    <span className="font-black text-lg tracking-tighter uppercase whitespace-nowrap text-gray-900 dark:text-white">{storeName}</span>
                                </Link>
                                <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-4 mb-4">Navigations</p>
                                    <MobileNavLink href={`/store/${subdomain}`} label={navHome} onClick={(e) => handleNavigate(e, 'index')} />
                                    <MobileNavLink href={`/store/${subdomain}/shop`} label={navShop === 'Shoop' || navShop === 'Shop' ? 'Shop' : navShop} onClick={(e) => handleNavigate(e, 'shop')} />
                                    <MobileNavLink href={`/store/${subdomain}/about`} label={navAbout} onClick={(e) => handleNavigate(e, 'about')} />
                                </div>

                                <div className="mt-10 pt-10 border-t border-gray-50 space-y-1">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-4 mb-4">Account & More</p>
                                    <MobileNavLink href={`/store/${subdomain}/customer/orders`} label="My Orders" icon={<User className="w-4 h-4" />} onClick={(e) => handleNavigate(e, 'customer')} />
                                    <MobileNavLink href={`/store/${subdomain}/customer/profile`} label="Profile Settings" icon={<User className="w-4 h-4" />} onClick={(e) => handleNavigate(e, 'profile')} />
                                    <MobileNavLink href={`/store/${subdomain}/favorites`} label="Watchlist" icon={<Heart className="w-4 h-4" />} onClick={(e) => handleNavigate(e, 'favorites')} />
                                </div>
                            </div>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

function MobileNavLink({ href, label, onClick, icon }: { href: string; label: string; onClick: (e: any) => void; icon?: React.ReactNode }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center justify-between p-4 rounded-2xl group active:bg-black/5 transition-all"
        >
            <div className="flex items-center gap-3">
                {icon && <div className="text-gray-400 group-hover:text-black transition-colors">{icon}</div>}
                <span className="text-sm font-black uppercase tracking-widest text-[#111827] dark:text-white group-hover:translate-x-1 transition-transform">{label}</span>
            </div>
            <ChevronDown className="w-4 h-4 -rotate-90 text-gray-200" />
        </Link>
    );
}

function AuthButtons({ subdomain }: { subdomain: string }) {
    const { user } = useAuthStore();
    const isLoggedIn = !!user;

    if (isLoggedIn) {
        return (
            <Link href={`/store/${subdomain}/customer/orders`} className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl group text-slate-700 font-bold hover:bg-primary/10 hover:text-primary transition-all">
                <User className="w-5 h-5 group-hover:scale-110 group-hover:text-primary transition-all" />
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
