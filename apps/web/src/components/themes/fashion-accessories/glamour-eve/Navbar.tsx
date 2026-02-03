'use client';

import { NavbarProps } from '../../types';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export function GlamourEveNavbar({ storeName, logo }: NavbarProps) {
    const { items, toggleCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!mounted) return null;

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'bg-black/95 backdrop-blur-md py-4'
                    : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16">
                <div className="flex items-center justify-between">
                    {/* Left: Search/Menu (Desktop) */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <button className="flex items-center space-x-2 text-white/70 hover:text-[#D4AF37] transition-colors uppercase tracking-[0.2em] text-[10px] font-bold">
                            <Menu className="w-4 h-4" />
                            <span>Menu</span>
                        </button>
                        <button className="text-white/70 hover:text-[#D4AF37] transition-colors">
                            <Search className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Logo (Center) */}
                    <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center">
                        {logo ? (
                            <img
                                src={logo}
                                alt={storeName}
                                className={`h-8 md:h-10 w-auto object-contain transition-all duration-500 ${scrolled ? 'scale-90' : 'scale-100'
                                    }`}
                            />
                        ) : (
                            <span className="text-2xl md:text-3xl font-serif text-white tracking-[0.1em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-[#D4AF37] to-white bg-[length:200%_auto] animate-shimmer">
                                {storeName}
                            </span>
                        )}
                    </Link>

                    {/* Right: Cart/Account */}
                    <div className="flex items-center space-x-6 sm:space-x-8">
                        <Link href="/login" className="hidden sm:block text-white/70 hover:text-[#D4AF37] transition-colors uppercase tracking-[0.2em] text-[10px] font-bold">
                            Account
                        </Link>
                        <button
                            onClick={toggleCart}
                            className="group relative flex items-center space-x-2 text-white hover:text-[#D4AF37] transition-all"
                            aria-label="Shopping cart"
                        >
                            <span className="hidden sm:inline uppercase tracking-[0.2em] text-[10px] font-bold">
                                Bag
                            </span>
                            <div className="relative">
                                <ShoppingBag className="w-5 h-5 stroke-[1.5px]" />
                                <AnimatePresence>
                                    {itemCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center"
                                        >
                                            {itemCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Border/Accent */}
            <motion.div
                className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
            />
        </motion.nav>
    );
}

