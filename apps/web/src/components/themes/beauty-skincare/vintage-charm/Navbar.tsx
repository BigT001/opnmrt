'use client';

import { NavbarProps } from '../../types';
import { ShoppingBag, Menu, Search, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { ThemeToggle } from '@/components/ThemeToggle';
import { useParams } from 'next/navigation';

export function VintageCharmNavbar({ storeName, logo }: NavbarProps) {
    const { items, toggleCart } = useCartStore();
    const { user } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const { subdomain } = useParams<{ subdomain: string }>();

    useEffect(() => {
        setMounted(true);
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 20);
            setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
            lastScrollY = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!mounted) return null;

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            {/* Top Bar - Classic Announcement */}
            <div className="bg-[#1B3022] text-[#F9F4EE] py-2 px-6 flex justify-center items-center gap-4 text-[10px] tracking-[0.2em] font-medium uppercase border-b border-[#F9F4EE]/10">
                <span>Complimentary Apothecary Shipping on Orders Over $150</span>
                <span className="w-1 h-1 bg-[#F9F4EE]/40 rounded-full" />
                <span>Est. 1924</span>
            </div>

            <nav className={`transition-all duration-500 border-b border-[#1B3022]/10 ${scrolled ? 'bg-[#F9F4EE]/95 dark:bg-black/95 backdrop-blur-md py-4' : 'bg-[#F9F4EE]/50 dark:bg-black/50 backdrop-blur-sm py-8'
                }`}>
                <div className="max-w-[1800px] mx-auto px-10 flex items-center justify-between">
                    {/* Left: Navigation Menu */}
                    <div className="hidden lg:flex items-center gap-10">
                        {[
                            { label: 'Home', href: `/store/${subdomain}` },
                            { label: 'Shop', href: `/store/${subdomain}/shop` },
                            { label: 'About', href: `/store/${subdomain}/about` }
                        ].map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1B3022] dark:text-[#F9F4EE] hover:text-[#8B4513] dark:hover:text-amber-200 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <button className="lg:hidden text-[#1B3022] dark:text-[#F9F4EE]">
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Center: Hero Branding */}
                    <Link href={`/store/${subdomain}`} className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
                        {logo ? (
                            <img src={logo} alt={storeName} className="h-12 w-auto object-contain transition-transform group-hover:scale-105" />
                        ) : (
                            <div className="text-center">
                                <span className="block text-3xl font-black text-[#1B3022] dark:text-[#F9F4EE] tracking-tighter leading-none py-1 group-hover:italic transition-all">
                                    {storeName.toUpperCase()}
                                </span>
                                <span className="block font-cursive text-xl text-[#8B4513] dark:text-[#D4AF37] -mt-1 opacity-80">
                                    Purveyors of Heritage
                                </span>
                            </div>
                        )}
                    </Link>

                    {/* Right: Functional Controls */}
                    <div className="flex items-center gap-8">
                        <ThemeToggle />
                        <button className="hidden md:block text-[#1B3022] dark:text-[#F9F4EE] hover:text-[#8B4513] transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <Link
                            href={user ? `/store/${subdomain}/customer/orders` : `/store/${subdomain}/customer/login`}
                            className={`hidden md:block transition-colors ${user ? 'text-[#8B4513] dark:text-amber-200' : 'text-[#1B3022] dark:text-[#F9F4EE] hover:text-[#8B4513]'}`}
                        >
                            <User className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={toggleCart}
                            className="relative text-[#1B3022] dark:text-[#F9F4EE] group flex items-center gap-3"
                        >
                            <span className="hidden md:inline text-[11px] font-bold uppercase tracking-[0.2em]">Bag</span>
                            <div className="relative">
                                <ShoppingBag className="w-6 h-6 stroke-[1.5px]" />
                                <AnimatePresence>
                                    {itemCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="absolute -top-2 -right-2 bg-[#1B3022] text-[#F9F4EE] text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-[#F9F4EE]"
                                        >
                                            {itemCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}

