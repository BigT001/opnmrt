'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShoppingBag, Search, User, Menu, ChevronRight } from 'lucide-react';
import { useStoreCart } from '@/store/useStoreCart';
import { useAuthStore } from '@/store/useAuthStore';
import { NavbarProps } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText, EditableColor } from '../EditableContent';
import { ThemeToggle } from '@/components/ThemeToggle';

export function DefaultNavbar({ storeName, logo, storeId, isPreview, onConfigChange }: NavbarProps) {
    const { toggleCart, totalCount: itemCount } = useStoreCart(storeId);
    const { user } = useAuthStore();
    const { subdomain } = useParams<{ subdomain: string }>();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(true);

    const handleConfigSave = (newConfig: any) => {
        onConfigChange?.(newConfig);
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
        <nav className={`bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            {/* Indisputable Visual Marker: High-Contrast Top Bar */}
            <div className="bg-black py-1.5 sm:py-2.5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-[9px] sm:text-[11px] font-black text-white uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                        Standard Edition Active
                    </span>
                    <div className="hidden sm:flex gap-6">
                        <Link href={`/store/${subdomain}/customer/orders`} className="hover:text-yellow-400 transition-colors">Track Order</Link>
                        <Link href="#" className="hover:text-yellow-400 transition-colors">Help Center</Link>
                    </div>
                </div>
            </div>

            {/* Main Nav: Boxed Content Style */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
                <div className="flex items-center gap-6 lg:gap-12">
                    <Link href={`/store/${subdomain}`} className="flex items-center gap-2 group">
                        {logo ? (
                            <img src={logo} alt={storeName} className="h-8 sm:h-10 w-auto object-contain" />
                        ) : (
                            <div className="flex flex-col">
                                <span className="font-black text-xl sm:text-2xl tracking-tighter text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-gray-300 transition-colors">
                                    {storeName}
                                </span>
                                <span className="text-[7px] sm:text-[8px] font-bold text-gray-400 uppercase tracking-widest -mt-1">Official Store</span>
                            </div>
                        )}
                    </Link>

                    <div className="hidden lg:flex items-center gap-8 text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                        <Link href={`/store/${subdomain}`} className="hover:text-black dark:hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-black dark:hover:border-white">Home</Link>
                        <Link href={`/store/${subdomain}/shop`} className="hover:text-black dark:hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-black dark:hover:border-white">Shop</Link>
                        <Link href={`/store/${subdomain}/about`} className="hover:text-black dark:hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-black dark:hover:border-white">About</Link>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    {isPreview && (
                        <EditableColor
                            value="#4f46e5"
                            onSave={color => handleConfigSave({ primaryColor: color })}
                            isPreview={isPreview}
                            label="Brand Color"
                        />
                    )}
                    <div className="hidden md:flex items-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 group focus-within:border-indigo-600 transition-all">
                        <Search className="w-4 h-4 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white" />
                        <input
                            type="text"
                            placeholder="Find products..."
                            className="bg-transparent border-none focus:ring-0 text-sm font-medium w-32 lg:w-48 placeholder:text-gray-300 dark:text-white"
                        />
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 border-l border-gray-100 dark:border-gray-800 ml-2 sm:ml-4 pl-2 sm:pl-4">
                        <ThemeToggle />

                        {/* Hidden on Mobile: Account Icon */}
                        <Link
                            href={user ? `/store/${subdomain}/customer/orders` : `/store/${subdomain}/customer/login`}
                            className={`hidden lg:flex p-2.5 rounded-xl transition-all ${user ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`}
                            title={user ? 'Account' : 'Login'}
                        >
                            <User className="w-5 h-5" />
                        </Link>

                        <button
                            onClick={toggleCart}
                            className="relative p-2 sm:p-2.5 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 rounded-lg sm:rounded-xl shadow-md transition-all active:scale-95"
                        >
                            <ShoppingBag className="w-4 h-4 sm:w-5 h-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-[9px] sm:text-[10px] font-black rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center border-2 border-white dark:border-black">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-all"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 overflow-hidden shadow-2xl"
                    >
                        <div className="px-6 py-10 space-y-10">
                            <div className="flex flex-col gap-6 text-[13px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em]">
                                <Link href={`/store/${subdomain}`} onClick={() => setIsMenuOpen(false)} className="hover:translate-x-2 transition-transform flex items-center justify-between group">
                                    Home <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-gray-900 transition-colors" />
                                </Link>
                                <Link href={`/store/${subdomain}/shop`} onClick={() => setIsMenuOpen(false)} className="hover:translate-x-2 transition-transform flex items-center justify-between group">
                                    Shop <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-gray-900 transition-colors" />
                                </Link>
                                <Link href={`/store/${subdomain}/about`} onClick={() => setIsMenuOpen(false)} className="hover:translate-x-2 transition-transform flex items-center justify-between group">
                                    About <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-gray-900 transition-colors" />
                                </Link>

                                {/* Account Link in Menu - Refined with Black Theme */}
                                <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                                    <Link
                                        href={user ? `/store/${subdomain}/customer/orders` : `/store/${subdomain}/customer/login`}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="p-6 bg-gray-50 dark:bg-gray-900 rounded-[2rem] text-gray-900 dark:text-white flex items-center gap-5 group hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-500"
                                    >
                                        <div className="w-12 h-12 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-md">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-[13px] font-black">{user ? 'My Account' : 'Login / Register'}</span>
                                            <span className="text-[8px] font-bold opacity-40 lowercase tracking-widest">{user ? user.email : 'Join the community'}</span>
                                        </div>
                                    </Link>
                                </div>

                                <div className="space-y-4 pt-6 flex flex-col items-start px-2">
                                    <Link href={`/store/${subdomain}/customer/orders`} onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                                        Track Order
                                    </Link>
                                    <Link href="#" onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                                        Help Center
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
