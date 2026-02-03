'use client';

import { NavbarProps } from '../../types';
import { ShoppingBag, Leaf, Search, Menu } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function PureBotanicalNavbar({ storeName, logo }: NavbarProps) {
    const { items, toggleCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const params = useParams<{ subdomain: string }>();
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
                ? 'bg-[#F9FAF8]/60 backdrop-blur-xl border-white/20 shadow-[0_8px_32px_rgba(124,144,130,0.1)] top-6 mx-auto max-w-5xl'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-[1800px] mx-auto h-full px-6 md:px-8 flex items-center justify-between relative">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2.5 text-[#1C2B21] hover:bg-[#7C9082]/10 rounded-full transition-all"
                >
                    <Menu className="w-6 h-6 opacity-60" />
                </button>

                {/* Navigation Links - Left (Desktop) */}
                <div className="hidden md:flex items-center gap-10">
                    {['Shop', 'Botanicals', 'About'].map((item) => (
                        <Link
                            key={item}
                            href="#"
                            className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#1C2B21]/60 hover:text-[#1C2B21] transition-colors relative group"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#7C9082] transition-all duration-500 group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* Centered Brand */}
                <Link
                    href={`/store/${params.subdomain}`}
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
                            className="h-4 md:h-6 w-auto object-contain brightness-0 opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                    ) : (
                        <span className="text-xl md:text-3xl font-serif text-[#1C2B21] tracking-tight group-hover:text-[#7C9082] transition-colors whitespace-nowrap">
                            {storeName}
                        </span>
                    )}
                </Link>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    <button className="p-2.5 text-[#1C2B21] hover:bg-[#7C9082]/10 rounded-full transition-all hidden sm:block">
                        <Search className="w-5 h-5 opacity-60" />
                    </button>
                    <button
                        onClick={toggleCart}
                        className="group relative flex items-center gap-3 p-2 md:p-2.5 bg-[#1C2B21] text-white rounded-full hover:bg-[#7C9082] transition-all duration-500 overflow-hidden shadow-lg shadow-[#1C2B21]/10"
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
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
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
                        className="md:hidden absolute top-[calc(100%+1rem)] left-0 right-0 p-8 bg-[#F9FAF8]/95 backdrop-blur-2xl border border-white/20 rounded-[32px] shadow-[0_32px_64px_rgba(124,144,130,0.2)] flex flex-col gap-6"
                    >
                        {['Shop', 'Botanicals', 'About'].map((item, i) => (
                            <motion.div
                                key={item}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link
                                    href="#"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-3xl font-serif text-[#1C2B21] hover:text-[#7C9082] transition-colors"
                                >
                                    {item}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
