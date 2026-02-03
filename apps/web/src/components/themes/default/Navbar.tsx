'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShoppingBag, Search, User, Menu } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { NavbarProps } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export function DefaultNavbar({ storeName, logo }: NavbarProps) {
    const { toggleCart, items } = useCartStore();
    const { subdomain } = useParams<{ subdomain: string }>();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            {/* Indisputable Visual Marker: High-Contrast Top Bar */}
            <div className="bg-indigo-600 py-2.5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-[11px] font-black text-white uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                        Standard Edition Active
                    </span>
                    <div className="hidden sm:flex gap-6">
                        <Link href="#" className="hover:text-yellow-400 transition-colors">Track Order</Link>
                        <Link href="#" className="hover:text-yellow-400 transition-colors">Help Center</Link>
                    </div>
                </div>
            </div>

            {/* Main Nav: Boxed Content Style */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <Link href={`/store/${subdomain}`} className="flex items-center gap-2 group">
                        {logo ? (
                            <img src={logo} alt={storeName} className="h-10 w-auto object-contain" />
                        ) : (
                            <div className="flex flex-col">
                                <span className="font-black text-2xl tracking-tighter text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {storeName}
                                </span>
                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest -mt-1">Official Store</span>
                            </div>
                        )}
                    </Link>

                    <div className="hidden lg:flex items-center gap-8 text-[12px] font-bold text-gray-500 uppercase tracking-widest">
                        <Link href="#" className="hover:text-indigo-600 transition-colors py-2 border-b-2 border-transparent hover:border-indigo-600">Inventory</Link>
                        <Link href="#" className="hover:text-indigo-600 transition-colors py-2 border-b-2 border-transparent hover:border-indigo-600">Best Sellers</Link>
                        <Link href="#" className="hover:text-indigo-600 transition-colors py-2 border-b-2 border-transparent hover:border-indigo-600">Sale</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 group focus-within:border-indigo-600 transition-all">
                        <Search className="w-4 h-4 text-gray-400 group-focus-within:text-indigo-600" />
                        <input
                            type="text"
                            placeholder="Find products..."
                            className="bg-transparent border-none focus:ring-0 text-sm font-medium w-48 placeholder:text-gray-300"
                        />
                    </div>

                    <div className="flex items-center gap-2 border-l border-gray-100 ml-4 pl-4">
                        <button className="hidden sm:block p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                            <User className="w-5 h-5" />
                        </button>
                        <button
                            onClick={toggleCart}
                            className="relative p-2.5 bg-gray-900 text-white hover:bg-black rounded-xl shadow-lg shadow-gray-200 transition-all active:scale-95"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2.5 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4">
                            <div className="flex flex-col gap-4 text-[12px] font-bold text-gray-500 uppercase tracking-widest">
                                <Link href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-indigo-600 transition-colors py-2">Inventory</Link>
                                <Link href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-indigo-600 transition-colors py-2">Best Sellers</Link>
                                <Link href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-indigo-600 transition-colors py-2">Sale</Link>
                                <div className="pt-4 border-t border-gray-50 flex flex-col gap-4">
                                    <Link href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-indigo-600 transition-colors py-2">Track Order</Link>
                                    <Link href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-indigo-600 transition-colors py-2">Help Center</Link>
                                </div>
                            </div>
                            <div className="relative pt-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:border-indigo-600 focus:ring-0"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
