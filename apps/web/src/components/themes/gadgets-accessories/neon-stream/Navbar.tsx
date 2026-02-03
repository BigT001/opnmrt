'use client';

import { NavbarProps } from '../../types';
import { ShoppingBag, Search, Menu, Zap } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export function NeonStreamNavbar({ storeName, logo }: NavbarProps) {
    const { items, toggleCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (!mounted) return null;

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || isMenuOpen ? 'py-4 backdrop-blur-xl bg-black/60 border-b border-white/10' : 'py-6 bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Brand Selector */}
                <Link href="/" className="group flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#00F5FF] flex items-center justify-center rounded-lg shadow-[0_0_20px_rgba(0,245,255,0.4)] group-hover:scale-110 transition-transform">
                        <Zap className="w-5 h-5 md:w-6 md:h-6 text-black fill-current" />
                    </div>
                    <span className="text-xl md:text-2xl font-black font-syne tracking-tighter uppercase italic text-white group-hover:text-[#00F5FF] transition-colors">
                        {storeName}
                    </span>
                </Link>

                {/* Nav Nodes */}
                <nav className="hidden md:flex items-center gap-10">
                    {['COLLECTIONS', 'HARDWARE', 'PERIPHERALS', 'LOGS'].map((link) => (
                        <Link
                            key={link}
                            href="#"
                            className="text-[11px] font-black font-syne tracking-[0.2em] text-gray-400 hover:text-[#00F5FF] transition-all relative group"
                        >
                            {link}
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00F5FF] group-hover:w-full transition-all duration-300 shadow-[0_0_8px_#00F5FF]" />
                        </Link>
                    ))}
                </nav>

                {/* System Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors hidden sm:block">
                        <Search className="w-5 h-5" />
                    </button>
                    <button
                        onClick={toggleCart}
                        className="relative group p-2 md:p-3 bg-white/5 border border-white/10 rounded-xl hover:border-[#00F5FF]/50 transition-all"
                    >
                        <ShoppingBag className="w-5 h-5 text-white group-hover:text-[#00F5FF] transition-colors" />
                        <AnimatePresence>
                            {itemCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-[#BF00FF] text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(191,0,255,0.6)]"
                                >
                                    {itemCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-white hover:text-[#00F5FF] transition-colors"
                    >
                        {isMenuOpen ? <Zap className="w-6 h-6 text-[#00F5FF]" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="md:hidden absolute top-full left-0 right-0 mt-2 mx-6 p-8 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl flex flex-col gap-6"
                    >
                        {['COLLECTIONS', 'HARDWARE', 'PERIPHERALS', 'LOGS'].map((link, i) => (
                            <motion.div
                                key={link}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link
                                    href="#"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-2xl font-black font-syne tracking-widest text-white/40 hover:text-[#00F5FF] transition-colors"
                                >
                                    {link}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Live Indicator Strip */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00F5FF]/30 to-transparent" />
        </header>
    );
}
