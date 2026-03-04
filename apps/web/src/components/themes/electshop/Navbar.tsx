'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingCart, Heart, User, Menu, ChevronDown, Phone, MapPin, X, MessageCircle } from 'lucide-react';
import { useStoreCart } from '@/store/useStoreCart';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { NavbarProps } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { useWishlistStore } from '@/store/useWishlistStore';
import toast from 'react-hot-toast';
import { EditableText, EditableColor } from '../EditableContent';

export function ElectshopNavbar({ storeName, logo, storeId, isPreview, primaryColor, themeConfig, onConfigChange, onNavigate }: NavbarProps & { onConfigChange?: (cfg: any) => void }) {
    const { toggleCart, totalCount: itemCount, subtotal } = useStoreCart(storeId);
    const { items: wishlistItems, toggleDrawer: toggleWishlist } = useWishlistStore();
    const { toggleDrawer: toggleChat, unreadCount } = useChatStore();
    const { user } = useAuthStore();
    const { subdomain } = useParams<{ subdomain: string }>();
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    const effectivePrimaryColor = primaryColor || '#2874f0';
    const config = themeConfig || {};

    const handleConfigSave = (newCfg: any) => {
        onConfigChange?.(newCfg);
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const categories = config.categories || [
        'All Categories',
        'Electronics',
        'Smartphones',
        'Laptops',
        'Wearables',
        'Audio',
        'Cameras',
        'Gaming',
        'Home Appliances'
    ];

    const navLinks = config.primaryNav || [
        { name: config.navHome || 'Home', href: `/store/${subdomain}`, key: 'navHome' },
        { name: 'Electronics', href: `/store/${subdomain}/shop?category=electronics`, isCategory: true },
        { name: 'Smartphones', href: `/store/${subdomain}/shop?category=smartphones`, isCategory: true },
        { name: 'Laptops', href: `/store/${subdomain}/shop?category=laptops`, isCategory: true },
        { name: 'Smart Watches', href: `/store/${subdomain}/shop?category=wearables`, isCategory: true },
        { name: config.navBlog || 'Blog', href: `/store/${subdomain}/blog`, key: 'navBlog' },
        { name: config.navContact || 'Contact', href: `/store/${subdomain}/contact`, key: 'navContact' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/store/${subdomain}/shop?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="w-full z-50 flex flex-col">
            {/* Middle Bar - Logo & Search */}
            <div className="bg-white py-4 lg:py-6 sticky top-0 lg:static z-50 border-b border-gray-100 lg:border-none">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 lg:gap-8">
                    {/* Logo */}
                    <Link
                        href={isPreview ? '#' : `/store/${subdomain}`}
                        onClick={(e) => {
                            if (isPreview && onNavigate) {
                                e.preventDefault();
                                onNavigate('index');
                            }
                        }}
                        className="shrink-0 flex items-center gap-3"
                    >
                        {logo && (
                            <img src={logo} alt={storeName} className="h-8 lg:h-10 w-auto object-contain" />
                        )}
                        <span
                            className="text-xl lg:text-2xl font-black tracking-tighter italic uppercase"
                            style={{ color: effectivePrimaryColor }}
                        >
                            <EditableText
                                value={storeName || 'Electshop'}
                                onSave={(val: string) => handleConfigSave({ name: val })}
                                isPreview={isPreview}
                                label="Store Name"
                            />
                        </span>
                    </Link>
                    {/* Search Bar - Desktop */}
                    <div className="hidden lg:flex flex-1 max-w-2xl relative">
                        <div
                            className="flex w-full items-center bg-brand/5 rounded-md overflow-hidden border border-gray-100 transition-all focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/5"
                        >
                            <form onSubmit={handleSearch} className="flex-1 flex items-center">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={config.navSearchPlaceholder || "Search for products, brands and more"}
                                    className="w-full bg-transparent px-4 py-2.5 text-xs font-semibold outline-none text-gray-950 placeholder:text-gray-400"
                                />
                                <button
                                    className="px-6 py-2.5 text-white transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-brand/20"
                                    style={{ backgroundColor: effectivePrimaryColor }}
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 lg:gap-8">
                        {/* User */}
                        <Link
                            href={user ? `/store/${subdomain}/customer/profile` : `/store/${subdomain}/customer/login`}
                            className="flex items-center gap-2 group"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand/10 transition-colors">
                                <User className="w-5 h-5 text-gray-600 group-hover:text-brand transition-colors" />
                            </div>
                            <div className="hidden xl:block text-left leading-none">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    <EditableText
                                        value={config.navAccountSubtitle || 'Login / Register'}
                                        onSave={(val: string) => handleConfigSave({ navAccountSubtitle: val })}
                                        isPreview={isPreview}
                                        label="Account Subtitle"
                                    />
                                </p>
                                <p className="text-xs font-bold text-gray-900 mt-1">
                                    <EditableText
                                        value={user ? user.name : (config.navAccountTitle || 'My Account')}
                                        onSave={(val: string) => handleConfigSave({ navAccountTitle: val })}
                                        isPreview={isPreview}
                                        label="Account Title"
                                    />
                                </p>
                            </div>
                        </Link>

                        {/* Wishlist */}
                        <button
                            onClick={toggleWishlist}
                            className="relative hidden sm:flex items-center gap-2 group"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                                <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                    {wishlistItems.length}
                                </span>
                            </div>
                        </button>

                        {/* Brand Color in Preview */}
                        {isPreview && (
                            <EditableColor
                                value={effectivePrimaryColor}
                                onSave={(color: string) => handleConfigSave({ primaryColor: color })}
                                isPreview={isPreview}
                                label="Brand Color"
                            />
                        )}

                        {/* Chat */}
                        <button
                            onClick={() => {
                                if (!user) {
                                    toast.error('Please login to start a live chat');
                                    return;
                                }
                                toggleChat();
                            }}
                            className="relative hidden sm:flex items-center gap-2 group"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand/10 transition-colors">
                                <MessageCircle className="w-5 h-5 text-gray-600 group-hover:text-brand transition-colors" />
                                {unreadCount > 0 && (
                                    <span
                                        className="absolute -top-1 -right-1 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white"
                                        style={{ backgroundColor: effectivePrimaryColor }}
                                    >
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                        </button>

                        {/* Cart */}
                        <button onClick={toggleCart} className="flex items-center gap-3 group">
                            <div className="relative w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand/10 transition-all">
                                <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-brand transition-colors" />
                                <span
                                    className="absolute -top-1 -right-1 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white"
                                    style={{ backgroundColor: effectivePrimaryColor }}
                                >
                                    {itemCount}
                                </span>
                            </div>
                            <div className="hidden xl:block text-left leading-none">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    <EditableText
                                        value={config.navCartLabel || 'My Cart'}
                                        onSave={(val: string) => handleConfigSave({ navCartLabel: val })}
                                        isPreview={isPreview}
                                        label="Cart Label"
                                    />
                                </p>
                                <p className="text-xs font-black mt-1" style={{ color: effectivePrimaryColor }}>{formatPrice(subtotal)}</p>
                            </div>
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2">
                            <Menu className="w-6 h-6 text-gray-800" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Bar - Navigation */}
            <div className="hidden lg:block shadow-sm" style={{ backgroundColor: effectivePrimaryColor }}>
                <div className="max-w-7xl mx-auto px-4 flex items-center h-14">
                    {/* Browse Categories Toggle */}
                    <div className="relative h-full">
                        <button
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className="h-full px-8 bg-black/10 hover:bg-black/20 text-white flex items-center gap-3 transition-colors min-w-[240px]"
                        >
                            <Menu className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-widest">
                                <EditableText
                                    value={config.navBrowseLabel || 'Browse All Category'}
                                    onSave={(val: string) => handleConfigSave({ navBrowseLabel: val })}
                                    isPreview={isPreview}
                                    label="Browse Label"
                                />
                            </span>
                            <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isCategoryOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsCategoryOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 w-full bg-white shadow-2xl border border-gray-100 py-4 z-50 overflow-hidden"
                                    >
                                        {categories.slice(1).map((cat: string) => (
                                            <Link
                                                key={cat}
                                                href={`/store/${subdomain}/shop?category=${cat.toLowerCase()}`}
                                                onClick={() => setIsCategoryOpen(false)}
                                                className="block px-8 py-3 text-[11px] font-bold text-gray-600 uppercase tracking-widest hover:bg-gray-50 transition-colors"
                                                style={{ borderLeftColor: effectivePrimaryColor }}
                                            >
                                                {cat}
                                            </Link>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Nav Links */}
                    <div className="flex items-center gap-1 h-full flex-1">
                        {navLinks.map((link: { name: string; href: string; key?: string; isCategory?: boolean }) => (
                            <Link
                                key={link.name}
                                href={isPreview ? '#' : link.href}
                                onClick={(e) => {
                                    if (isPreview && onNavigate) {
                                        e.preventDefault();
                                        if (link.key === 'navHome') onNavigate('index');
                                        else if (link.href.includes('/shop')) onNavigate('shop');
                                        else if (link.href.includes('/blog')) onNavigate('blog');
                                        else if (link.href.includes('/contact')) onNavigate('contact');
                                    }
                                }}
                                className={`h-full px-6 flex items-center text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:bg-black/5 ${pathname === link.href ? 'bg-black/10' : ''}`}
                            >
                                <EditableText
                                    value={link.name}
                                    onSave={(val: string) => link.key && handleConfigSave({ [link.key]: val })}
                                    isPreview={isPreview}
                                    label={link.name}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Search - Only on Mobile Middle Bar Replacement or addition */}
            <div className="bg-white px-4 pb-4 lg:hidden border-b border-gray-100">
                <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-lg pr-1">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={(config.navSearchPlaceholder || "Search products...").toUpperCase()}
                        className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
                    />
                    <button
                        className="p-2.5 text-white rounded-lg"
                        style={{ backgroundColor: effectivePrimaryColor }}
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </form>
            </div>

            {/* Mobile Slide Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 z-[100]"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-80 bg-white z-[101] flex flex-col shadow-2xl"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <span className="text-xl font-black italic uppercase" style={{ color: effectivePrimaryColor }}>{storeName || 'ELECTSHOP'}</span>
                                <button onClick={() => setIsMenuOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
                            </div>
                            <div className="flex-grow overflow-y-auto py-6">
                                <div className="px-6 mb-8">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
                                        <EditableText
                                            value={config.navMobileDiscoveryLabel || 'Discovery'}
                                            onSave={(val: string) => handleConfigSave({ navMobileDiscoveryLabel: val })}
                                            isPreview={isPreview}
                                            label="Mobile Discovery Label"
                                        />
                                    </p>
                                    <nav className="space-y-4">
                                        {navLinks.map((link: { name: string; href: string; key?: string }) => (
                                            <Link
                                                key={link.name}
                                                href={isPreview ? '#' : link.href}
                                                onClick={(e) => {
                                                    setIsMenuOpen(false);
                                                    if (isPreview && onNavigate) {
                                                        e.preventDefault();
                                                        if (link.key === 'navHome') onNavigate('index');
                                                        else if (link.href.includes('/shop')) onNavigate('shop');
                                                        else if (link.href.includes('/blog')) onNavigate('blog');
                                                        else if (link.href.includes('/contact')) onNavigate('contact');
                                                    }
                                                }}
                                                className="block text-lg font-bold text-gray-900 transition-colors"
                                                style={{ color: pathname === link.href ? effectivePrimaryColor : undefined }}
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                                <div className="px-6 mb-8">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
                                        <EditableText
                                            value={config.navMobileHotCategoriesLabel || 'Hot Categories'}
                                            onSave={(val: string) => handleConfigSave({ navMobileHotCategoriesLabel: val })}
                                            isPreview={isPreview}
                                            label="Mobile Categories Label"
                                        />
                                    </p>
                                    <nav className="space-y-4">
                                        {categories.slice(1).map((cat: string) => (
                                            <Link
                                                key={cat}
                                                href={`/store/${subdomain}/shop?category=${cat.toLowerCase()}`}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="block text-sm font-bold text-gray-600 transition-colors"
                                            >
                                                {cat}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                            <div className="p-8 border-t border-gray-100">
                                <Link
                                    href={user ? `/store/${subdomain}/customer/profile` : `/store/${subdomain}/customer/login`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block w-full py-4 text-white text-center rounded-xl font-bold uppercase tracking-widest text-xs"
                                    style={{ backgroundColor: effectivePrimaryColor }}
                                >
                                    <EditableText
                                        value={user ? (config.navMyDashboardLabel || 'My Dashboard') : (config.navMemberPortalLabel || 'Member Portal')}
                                        onSave={(val: string) => handleConfigSave({ [user ? 'navMyDashboardLabel' : 'navMemberPortalLabel']: val })}
                                        isPreview={isPreview}
                                        label="Mobile Menu Account Button"
                                    />
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
