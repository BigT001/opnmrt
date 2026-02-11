'use client';

import { NavbarProps } from '../../types';
import { ShoppingBag, Cpu, Search, User, Zap, Menu } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { ThemeToggle } from '@/components/ThemeToggle';

export function StarkEdgeNavbar({ storeName, logo }: NavbarProps) {
    const { items, toggleCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { subdomain } = useParams<{ subdomain: string }>();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!mounted) return null;

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 font-tactical ${scrolled || isMenuOpen
                ? 'h-16 bg-[#080808]/90 dark:bg-black/95 backdrop-blur-xl border-b border-[#333]'
                : 'h-24 bg-transparent border-b border-transparent'
                }`}
        >
            <div className="max-w-[1400px] mx-auto h-full px-6 md:px-10 flex items-center justify-between relative text-white">

                {/* Left: Hardware Status & Mobile Toggle */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 text-white/40 hover:text-[#00F0FF] transition-colors"
                    >
                        {isMenuOpen ? <Zap className="w-5 h-5 text-[#00F0FF]" /> : <Menu className="w-5 h-5" />}
                    </button>
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#1A1A1A] border border-[#333]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_8px_#00F0FF]" />
                        <span className="text-[10px] font-data text-white/40 uppercase tracking-tighter">System: Online</span>
                    </div>
                </div>

                {/* Center: Brand Architecture */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4 lg:gap-12">
                    <div className="hidden lg:flex items-center gap-8">
                        <Link
                            href={`/store/${subdomain}`}
                            className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 hover:text-white transition-all relative group"
                        >
                            <span className="relative z-10">Home</span>
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#00F0FF] transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <Link
                            href={`/store/${subdomain}/shop`}
                            className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 hover:text-white transition-all relative group"
                        >
                            <span className="relative z-10">Shop</span>
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#00F0FF] transition-all duration-300 group-hover:w-full" />
                        </Link>
                    </div>

                    <Link
                        href={`/store/${subdomain}`}
                        className="flex items-center gap-3 group px-4 md:px-6 py-2 border-x border-[#333]"
                    >
                        <Cpu className="w-5 h-5 text-[#00F0FF] group-hover:rotate-90 transition-transform duration-500" />
                        {logo ? (
                            <img
                                src={logo}
                                alt={storeName}
                                className="h-4 md:h-6 w-auto object-contain brightness-0 invert"
                            />
                        ) : (
                            <span className="text-sm md:text-xl font-bold uppercase tracking-tighter text-white whitespace-nowrap">
                                {storeName}
                            </span>
                        )}
                    </Link>

                    <div className="hidden lg:flex items-center gap-8">
                        <Link
                            href={`/store/${subdomain}/about`}
                            className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 hover:text-white transition-all relative group"
                        >
                            <span className="relative z-10">About</span>
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#00F0FF] transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <button className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 hover:text-white transition-all relative group">
                            <Search className="w-4 h-4 inline-block mr-1" />
                            <span className="relative z-10">Search</span>
                        </button>
                    </div>
                </div>

                {/* Right: Asset Management */}
                <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
                    <ThemeToggle />
                    <Link href={`/store/${subdomain}/customer/login`} className="p-2 text-white/40 hover:text-[#00F0FF] transition-colors hidden sm:block">
                        <User className="w-4 h-4" />
                    </Link>

                    <button
                        onClick={toggleCart}
                        className="group relative flex items-center gap-3 h-10 px-3 md:px-4 bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-[#00F0FF] transition-all active:scale-95 overflow-hidden"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span className="hidden md:block">Gear</span>

                        <AnimatePresence mode="popLayout">
                            {itemCount > 0 && (
                                <motion.div
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    exit={{ y: -20 }}
                                    key={itemCount}
                                    className="px-1.5 py-0.5 bg-black text-[#00F0FF] font-data text-[10px]"
                                >
                                    {itemCount < 10 ? `0${itemCount}` : itemCount}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="lg:hidden fixed inset-0 top-16 bg-[#080808] z-40 flex flex-col p-10 gap-8 border-t border-[#333]"
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
                                    className="text-4xl font-bold uppercase tracking-tighter text-white/40 hover:text-[#00F0FF] transition-all"
                                >
                                    {item.label}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </nav>
    );
}
