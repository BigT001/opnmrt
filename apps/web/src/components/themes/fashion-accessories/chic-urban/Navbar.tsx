'use client';

import { NavbarProps } from '../../types';
import { ShoppingBag, Menu, Search, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export function ChicUrbanNavbar({ storeName, logo }: NavbarProps) {
    const { items, toggleCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!mounted) return null;

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            {/* Ticker Layer */}
            <div className="bg-[#CCFF00] border-b-2 border-black py-1 overflow-hidden">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="flex whitespace-nowrap gap-12 items-center"
                >
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase text-black italic">Experimental Drop v2.0 // Limited Release</span>
                            <span className="w-1.5 h-1.5 bg-black rotate-45" />
                            <span className="text-[10px] font-black uppercase text-black italic">Verified Authentic Gear // Established 2024</span>
                            <span className="w-1.5 h-1.5 bg-black rotate-45" />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Main Nav Layer */}
            <nav className={`bg-black border-b-2 border-black transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
                <div className="max-w-[1800px] mx-auto px-6 flex items-center justify-between">
                    {/* Left: Tactical Menu */}
                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="bg-white p-2 border-2 border-white hover:bg-[#CCFF00] hover:border-[#CCFF00] transition-colors"
                        >
                            {isMenuOpen ? <X className="w-5 h-5 text-black" /> : <Menu className="w-5 h-5 text-black" />}
                        </button>
                        <div className="hidden lg:flex gap-6">
                            {['Catalogue', 'Archive', 'Drops'].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    className="text-[11px] font-black uppercase tracking-tighter text-white hover:text-[#CCFF00] transition-colors font-mono"
                                >
                                    [{item}]
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Center: Brutalist Branding */}
                    <Link href="/" className="absolute left-1/2 -translate-x-1/2 group">
                        {logo ? (
                            <img src={logo} alt={storeName} className="h-10 w-auto invert brightness-0" />
                        ) : (
                            <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic group-hover:bg-[#CCFF00] group-hover:text-black px-4 transition-all duration-300">
                                {storeName}
                            </h1>
                        )}
                    </Link>

                    {/* Right: Interface Controls */}
                    <div className="flex items-center gap-4">
                        <button className="hidden md:flex bg-white/10 p-2 text-white hover:bg-white hover:text-black transition-all border border-transparent hover:border-black">
                            <Search className="w-5 h-5" />
                        </button>
                        <button
                            onClick={toggleCart}
                            className="relative bg-white p-2 border-2 border-white hover:bg-[#CCFF00] hover:border-[#CCFF00] transition-colors group"
                        >
                            <ShoppingBag className="w-5 h-5 text-black" />
                            <AnimatePresence>
                                {itemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-3 -right-3 bg-black text-[#CCFF00] text-[10px] font-black h-6 w-6 flex items-center justify-center border-2 border-[#CCFF00]"
                                    >
                                        {itemCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile/Side Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        className="fixed inset-0 top-[105px] bg-[#CCFF00] text-black z-40 p-10 lg:w-[400px]"
                    >
                        <div className="flex flex-col gap-8">
                            {['Shop All', 'New Arrivals', 'Hardware', 'About System'].map((item, i) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        href="#"
                                        className="text-5xl font-black uppercase italic tracking-tighter hover:tracking-normal transition-all duration-300 hover:text-white"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item}
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="mt-20 pt-10 border-t-4 border-black font-mono text-[10px] uppercase font-bold">
                                <p>Operational Status: Stable</p>
                                <p>Current Location: Urban Grid 01</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

