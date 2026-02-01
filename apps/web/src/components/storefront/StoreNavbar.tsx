'use client';

import Link from 'next/link';
import { ShoppingBag, Menu } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';

interface StoreNavbarProps {
    storeName: string;
    logo?: string;
}

export function StoreNavbar({ storeName, logo }: StoreNavbarProps) {
    const { totalItems, toggleCart } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo / Store Name */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="." className="font-bold text-xl tracking-tight text-gray-900 flex items-center gap-2">
                            {logo ? (
                                <img src={logo} alt={storeName} className="h-8 w-auto object-contain" />
                            ) : (
                                <span>{storeName}</span>
                            )}
                        </Link>
                    </div>

                    {/* Desktop Navigation (Placeholder) */}
                    <div className="hidden md:flex space-x-8">
                        <Link href="." className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                            Home
                        </Link>
                        <Link href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                            Products
                        </Link>
                        <Link href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                            About
                        </Link>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleCart}
                            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                            aria-label="Open cart"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {mounted && totalItems() > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-black rounded-full min-w-[1.25rem]">
                                    {totalItems()}
                                </span>
                            )}
                        </button>

                        <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
