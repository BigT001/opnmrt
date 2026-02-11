'use client';

import { NavbarProps } from '../../types';
import { ShoppingBag, Leaf, Search, Menu, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { ThemeToggle } from '@/components/ThemeToggle';

export function PureBotanicalNavbar({ storeName, logo }: NavbarProps) {
    const { items, toggleCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { subdomain } = useParams<{ subdomain: string }>();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!mounted) return null;

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav
            className={`fixed top-4 inset-x-4 h-20 z-50 transition-all duration-700 ease-out border-b border-white/0 rounded-[32px] ${scrolled || isMenuOpen
                ? 'bg-[#F9FAF8]/60 dark:bg-black/60 backdrop-blur-xl border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(124,144,130,0.1)] top-6 mx-auto max-w-5xl'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-[1800px] mx-auto h-full px-6 md:px-8 flex items-center justify-between relative">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2.5 text-[#1C2B21] dark:text-white hover:bg-[#7C9082]/10 rounded-full transition-all"
                >
                    <Menu className="w-6 h-6 opacity-60" />
                </button>

                {/* Navigation Links - Left (Desktop) */}
                <div className="hidden md:flex items-center gap-10">
                    {[
                        { label: 'Home', href: `/store/${subdomain}` },
                        { label: 'Shop', href: `/store/${subdomain}/shop` },
                        { label: 'About', href: `/store/${subdomain}/about` }
                    ].map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#1C2B21]/60 dark:text-white/60 hover:text-[#1C2B21] dark:hover:text-white transition-colors relative group"
                        >
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#7C9082] transition-all duration-500 group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* Centered Brand */}
                <Link
                    href={`/store/${subdomain}`}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group"
                >
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="text-[#7C9082] mb-1 scale-75 md:scale-100"
                    >
                        <Leaf className="w-6 h-6 fill-current opacity-80" />
                    </motion.div>
                    {logo ? (
                        <img
                            src={logo}
                            alt={storeName}
                            className="h-4 md:h-6 w-auto object-contain brightness-0 dark:invert opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                    ) : (
                        <span className="text-xl md:text-3xl font-serif text-[#1C2B21] dark:text-white tracking-tight group-hover:text-[#7C9082] transition-colors whitespace-nowrap">
                            {storeName}
                        </span>
                    )}
                </Link>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="hidden sm:flex items-center gap-2">
                        <ThemeToggle />
                        <button className="p-2.5 text-[#1C2B21] dark:text-white hover:bg-[#7C9082]/10 rounded-full transition-all">
                            <Search className="w-5 h-5 opacity-60" />
                        </button>
                        <Link href={`/store/${subdomain}/customer/login`} className="p-2.5 text-[#1C2B21] dark:text-white hover:bg-[#7C9082]/10 rounded-full transition-all">
                            <User className="w-5 h-5 opacity-60" />
                        </Link>
                    </div>
                    <button
                        onClick={toggleCart}
                        className="group relative flex items-center gap-3 p-2 md:p-2.5 bg-[#1C2B21] dark:bg-white text-white dark:text-black rounded-full hover:bg-[#7C9082] transition-all duration-500 overflow-hidden shadow-lg shadow-[#1C2B21]/10"
                    >
                        <div className="relative z-10">
                            <ShoppingBag className="w-5 h-5" />
                        </div>

                        <AnimatePresence mode="popLayout">
                            {itemCount > 0 && (
                                <motion.span
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    key={itemCount}
                                    className="font-sans text-[11px] font-bold tracking-widest relative z-10 pr-1"
                                >
                                    {itemCount}
                                </motion.span>
                            )}
                        </AnimatePresence>

                        {/* Animated Background Overlay */}
                        <div className="absolute inset-0 bg-white/10 dark:bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-[calc(100%+1rem)] left-0 right-0 p-8 bg-[#F9FAF8]/95 dark:bg-black/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[32px] shadow-[0_32px_64px_rgba(124,144,130,0.2)] flex flex-col gap-6"
                    >
                        {[
                            { label: 'Home', href: `/store/${subdomain}` },
                            { label: 'Shop', href: `/store/${subdomain}/shop` },
                            { label: 'About', href: `/store/${subdomain}/about` },
                            { label: 'Login', href: `/store/${subdomain}/customer/login` }
                        ].map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-3xl font-serif text-[#1C2B21] dark:text-white hover:text-[#7C9082] transition-colors"
                                >
                                    {item.label}
                                </Link>
                            </motion.div>
                        ))}
                        <div className="pt-4 border-t border-black/5 dark:border-white/10">
                            <ThemeToggle />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
