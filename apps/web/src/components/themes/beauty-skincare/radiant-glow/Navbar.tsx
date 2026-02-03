'use client';

import { NavbarProps } from '../../types';
import { ShoppingBag, Sparkles, Search, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function RadiantGlowNavbar({ storeName, logo }: NavbarProps) {
    const { items, toggleCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const params = useParams<{ subdomain: string }>();

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
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ease-in-out ${scrolled
                    ? 'h-16 bg-[#FFF9F0]/70 backdrop-blur-xl border-b border-[#C19A6B]/20 shadow-[0_4px_30px_rgba(193,154,107,0.1)]'
                    : 'h-24 bg-transparent'
                }`}
        >
            <div className="max-w-[1400px] mx-auto h-full px-8 flex items-center justify-between relative">

                {/* Left: Search & Profile */}
                <div className="flex items-center gap-2">
                    <button className="p-2.5 text-[#2D1E1E]/40 hover:text-[#C19A6B] transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 text-[#2D1E1E]/40 hover:text-[#C19A6B] transition-colors">
                        <User className="w-5 h-5" />
                    </button>
                </div>

                {/* Center: Brand Identity */}
                <Link
                    href={`/store/${params.subdomain}`}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 group"
                >
                    <motion.div
                        animate={{
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.1, 0.9, 1]
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="text-[#C19A6B]"
                    >
                        <Sparkles className="w-6 h-6 fill-current opacity-80" />
                    </motion.div>

                    {logo ? (
                        <img
                            src={logo}
                            alt={storeName}
                            className="h-7 w-auto object-contain transition-transform group-hover:scale-105 duration-500"
                        />
                    ) : (
                        <span className="text-2xl font-luminous text-[#2D1E1E] uppercase tracking-[0.2em] group-hover:text-[#C19A6B] transition-colors duration-500">
                            {storeName}
                        </span>
                    )}
                </Link>

                {/* Right: Cart Interaction */}
                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-8">
                        {['Shop', 'Glow Guide', 'Rituals'].map((item) => (
                            <Link
                                key={item}
                                href="#"
                                className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#2D1E1E]/60 hover:text-[#2D1E1E] transition-colors relative group"
                            >
                                {item}
                                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#C19A6B] transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    <button
                        onClick={toggleCart}
                        className="group relative p-3 bg-white border border-[#C19A6B]/10 rounded-full hover:bg-[#C19A6B] hover:text-white transition-all duration-700 shadow-lg shadow-[#C19A6B]/5"
                    >
                        <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                        <AnimatePresence mode="popLayout">
                            {itemCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    key={itemCount}
                                    className={`absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-black border-2 transition-colors duration-700 ${scrolled ? 'bg-[#2D1E1E] text-[#FFF9F0] border-[#FFF9F0]' : 'bg-[#C19A6B] text-white border-white'
                                        }`}
                                >
                                    {itemCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            {/* Bottom Glow Line */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C19A6B]/30 to-transparent" />
        </nav>
    );
}

