'use client';

import { NavbarProps } from '../../types';
import { ShoppingBag, Search, User, Heart, ChevronDown, Menu, Phone, Headphones, Smartphone, Laptop, Camera, Tv, Globe } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';

import { ThemeToggle } from '@/components/ThemeToggle';
import { useParams } from 'next/navigation';

export function TechSpecNavbar({ storeName, logo }: NavbarProps) {
    const { items, toggleCart, totalPrice } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { subdomain } = useParams<{ subdomain: string }>();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!mounted) return null;

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex flex-col transition-colors duration-300">
            {/* Top Bar: Promotions & Utilities */}
            <div className="bg-[#f5f5f5] dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 py-2 px-10 hidden md:flex items-center justify-between text-[11px] font-data text-gray-500 dark:text-zinc-400 tracking-tight">
                <div className="flex items-center gap-6">
                    <p className="flex items-center gap-2">
                        <span className="text-[#E72E46] font-bold italic">PROMO:</span>
                        Get up to <span className="text-black dark:text-white font-bold">35% OFF</span> cashback on first hardware acquisition.
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <ThemeToggle />
                    <button className="hover:text-black dark:hover:text-white transition-colors">TRACK YOUR ORDER</button>
                    <div className="h-3 w-[1px] bg-gray-300 dark:bg-zinc-700" />
                    <button className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors uppercase">
                        ENGLISH <ChevronDown className="w-3 h-3" />
                    </button>
                    <div className="h-3 w-[1px] bg-gray-300 dark:bg-zinc-700" />
                    <button className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors uppercase">
                        USD <ChevronDown className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Main Header: Search & Account */}
            <div className={`bg-white dark:bg-black border-b border-gray-100 dark:border-zinc-900 px-10 transition-all duration-300 ${scrolled ? 'py-4 shadow-md' : 'py-6'}`}>
                <div className="max-w-[1400px] mx-auto flex items-center gap-12">
                    {/* Logo */}
                    <Link href={`/store/${subdomain}`} className="flex-shrink-0">
                        {logo ? (
                            <img src={logo} alt={storeName} className="h-10 w-auto object-contain dark:invert" />
                        ) : (
                            <div className="flex items-center gap-1">
                                <span className="text-3xl font-black text-black dark:text-white tracking-tighter uppercase italic flex items-center">
                                    <span className="text-[#E72E46] border-2 border-[#E72E46] px-1 mr-1">D</span>
                                    IGITAL
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-2">ELECTRONICS</span>
                            </div>
                        )}
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden lg:flex flex-1 max-w-2xl relative">
                        <div className="flex w-full h-12 border-2 border-[#E72E46] rounded-sm overflow-hidden group">
                            <input
                                type="text"
                                placeholder="Enter keywords to search..."
                                className="flex-1 px-4 text-sm font-data outline-none bg-transparent dark:text-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="bg-white dark:bg-zinc-900 border-l dark:border-zinc-800 h-full flex items-center px-4 text-xs font-bold text-gray-500 dark:text-zinc-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 uppercase tracking-wider">
                                All Categories <ChevronDown className="ml-2 w-3 h-3" />
                            </div>
                            <button className="bg-[#E72E46] text-white px-6 flex items-center justify-center hover:bg-[#c9243a] transition-colors">
                                <Search className="w-4 h-4" />
                                <span className="ml-2 text-xs font-black uppercase tracking-widest hidden xl:block">Search</span>
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-8 ml-auto font-data text-[11px] font-bold uppercase tracking-widest">
                        <Link href={`/store/${subdomain}/customer/login`} className="hidden xl:flex items-center gap-3 text-gray-400 hover:text-black dark:hover:text-white transition-colors group">
                            <div className="w-10 h-10 border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-300 group-hover:bg-[#E72E46] group-hover:text-white transition-all">
                                <User className="w-5 h-5" />
                            </div>
                            <p className="text-left hidden 2xl:block">
                                <span className="block text-[9px] text-gray-300 dark:text-zinc-500 font-normal">Login / Register</span>
                                ACCOUNT
                            </p>
                        </Link>

                        <button className="relative hidden md:flex items-center gap-3 text-gray-400 hover:text-black dark:hover:text-white transition-colors group">
                            <div className="w-10 h-10 border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-300 group-hover:bg-[#E72E46] group-hover:text-white transition-all relative">
                                <Heart className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E72E46] text-white text-[9px] flex items-center justify-center font-black italic">0</span>
                            </div>
                            <span className="hidden 2xl:block">WISHLIST</span>
                        </button>

                        <button
                            onClick={toggleCart}
                            className="flex items-center gap-4 text-gray-400 hover:text-black dark:hover:text-white transition-colors group"
                        >
                            <div className="w-10 h-10 border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-300 group-hover:bg-[#E72E46] group-hover:text-white transition-all relative">
                                <ShoppingBag className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E72E46] text-white text-[9px] flex items-center justify-center font-black italic">
                                    {itemCount}
                                </span>
                            </div>
                            <p className="text-left">
                                <span className="block text-[9px] text-gray-300 dark:text-zinc-500 font-normal">My Cart</span>
                                <span className="text-[#E72E46] font-black">{formatPrice(totalPrice())}</span>
                            </p>
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Strip */}
            <div className="bg-white dark:bg-black border-b border-gray-300 dark:border-zinc-900 px-10 hidden md:block">
                <div className="max-w-[1400px] mx-auto flex items-center">
                    {/* Categories Dropdown */}
                    <button className="bg-[#E72E46] text-white h-14 px-8 flex items-center gap-4 font-black text-xs uppercase tracking-widest hover:bg-[#c9243a] transition-colors relative group">
                        <Menu className="w-5 h-5" />
                        Shop By Categories
                    </button>

                    {/* Nav Links */}
                    <nav className="flex items-center h-14 px-10 gap-10">
                        {[
                            { label: "Home", href: `/store/${subdomain}` },
                            { label: "Shop", href: `/store/${subdomain}/shop` },
                            { label: "About", href: `/store/${subdomain}/about` },
                            { label: "Contact Us", href: "#" }
                        ].map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.href}
                                className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-all hover:text-[#E72E46] dark:hover:text-[#E72E46] h-full border-b-2 border-transparent hover:border-[#E72E46] px-1 dark:text-zinc-300 text-gray-700`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="ml-auto hidden xl:flex items-center gap-2 text-[11px] font-black text-[#E72E46] italic animate-pulse tracking-widest uppercase">
                        <Headphones className="w-4 h-4" />
                        Support 24/7: +1 (800) TECH-SPEC
                    </div>
                </div>
            </div>
        </header>
    );
}

