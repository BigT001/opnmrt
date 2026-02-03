'use client';

import { NavbarProps } from '../../types';
import { ShoppingBag, Search, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function MinimalLuxeNavbar({ storeName, logo }: NavbarProps) {
    const { items, toggleCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const { subdomain } = useParams<{ subdomain: string }>();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!mounted) return null;

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav
            className={`sticky top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled || isMenuOpen
                ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100 h-20 shadow-sm'
                : 'bg-white h-24 md:h-28'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
                {/* Mobile: Hamburger (Left) */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden p-2 text-gray-900"
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
                </button>

                {/* Logo (Left/Center) */}
                <Link href={`/store/${subdomain}`} className="flex items-center group absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
                    {logo ? (
                        <img
                            src={logo}
                            alt={storeName}
                            className="h-7 md:h-9 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <span className="text-xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase whitespace-nowrap">
                            {storeName}<span className="text-primary italic font-light serif text-2xl md:text-4xl">.</span>
                        </span>
                    )}
                </Link>

                {/* Navigation Menu (Center) - Refined spacing and typography */}
                <div className="hidden lg:flex items-center space-x-12">
                    <NavLink href={`/store/${subdomain}`} label="Home" active />
                    <NavLink href={`/store/${subdomain}/shop`} label="Shop" dropdown />
                    <NavLink href={`/store/${subdomain}/collection`} label="New arrivals" />
                    <NavLink href={`/store/${subdomain}/about`} label="Brand story" />
                </div>

                {/* Icons (Right) - Simplified and refined */}
                <div className="flex items-center space-x-1 md:space-x-2">
                    <IconButton icon={<Search className="w-5 h-5 stroke-[1.5]" />} className="hidden sm:flex" />
                    <IconButton icon={<User className="w-5 h-5 stroke-[1.5]" />} className="hidden sm:flex" />

                    <button
                        onClick={toggleCart}
                        className="group relative p-2 md:p-3 text-gray-900"
                        aria-label="Shopping cart"
                    >
                        <ShoppingBag className="w-5 h-5 stroke-[1.5] transition-transform duration-300 group-hover:-translate-y-1" />
                        <span className="absolute top-1 md:top-2 right-1 md:right-2 bg-gray-900 text-white text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center">
                            {itemCount}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-gray-50 overflow-hidden"
                    >
                        <div className="px-6 py-10 flex flex-col gap-8">
                            {[
                                { label: 'Home', href: `/store/${subdomain}` },
                                { label: 'Shop', href: `/store/${subdomain}/shop` },
                                { label: 'New arrivals', href: `/store/${subdomain}/collection` },
                                { label: 'Brand story', href: `/store/${subdomain}/about` }
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
                                        className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-900"
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

function NavLink({ href, label, dropdown = false, active = false }: { href: string; label: string; dropdown?: boolean; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`text-[11px] font-black uppercase tracking-[0.2em] flex items-center transition-all duration-300 relative group ${active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'
                }`}
        >
            {label}
            {dropdown && <ChevronDown className="ml-1 w-3 h-3 text-gray-300 group-hover:text-gray-900 transition-colors" />}

            {/* Hover Unterline */}
            <span className={`absolute -bottom-1 left-0 h-[2px] bg-gray-900 transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
        </Link>
    );
}

function IconButton({ icon, className = "" }: { icon: React.ReactNode; className?: string }) {
    return (
        <button className={`p-2 text-gray-900 hover:text-primary transition-colors ${className}`}>
            {icon}
        </button>
    );
}

