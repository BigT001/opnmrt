'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Search, MessagesSquare, ShoppingBag, SlidersHorizontal, User, Zap, ChevronLeft, Heart } from 'lucide-react';
import { NavbarProps } from '../types';
import { EditableText, EditableColor, EditableImage } from '../EditableContent';
import { useAuthStore } from '@/store/useAuthStore';
import { useStoreCart } from '@/store/useStoreCart';
import { useChatStore } from '@/store/useChatStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { motion, AnimatePresence } from 'framer-motion';

export function AppifyNavbar({ storeName, logo, storeId, isPreview, onConfigChange, onNavigate, greeting: customGreeting, type = 'shop', primaryColor, themeConfig }: NavbarProps & { type?: 'home' | 'shop' | 'product' | 'customer' }) {
    const { user } = useAuthStore();
    const { toggleCart, totalCount: itemCount } = useStoreCart(storeId);
    const { toggleDrawer: toggleChat, unreadCount } = useChatStore();
    const { toggleDrawer: toggleWishlist } = useWishlistStore();
    const params = useParams<{ subdomain: string }>();
    const searchParams = useSearchParams();
    const subdomain = params?.subdomain;
    const router = useRouter();

    const handleConfigSave = (newConfig: any) => {
        onConfigChange?.(newConfig);
    };

    const activeCategory = searchParams?.get('category') || 'All';
    const categories = ['All', "Men's", "Women's", 'Kids', 'New In', 'Collection'];

    const handleCategoryClick = (cat: string) => {
        const urlParams = new URLSearchParams(searchParams?.toString());
        if (cat === 'All') {
            urlParams.delete('category');
        } else {
            urlParams.set('category', cat);
        }
        router.push(`/store/${subdomain}/shop?${urlParams.toString()}`);
    };

    const [scrollY, setScrollY] = React.useState(0);
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            const current = window.scrollY;
            if (current > 80 && !isScrolled) setIsScrolled(true);
            else if (current < 20 && isScrolled) setIsScrolled(false);
            setScrollY(current);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isScrolled]);

    const getGreeting = () => {
        if (customGreeting) return customGreeting;
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const renderIcons = (light = true, hideChat = false) => (
        <div className="flex items-center gap-2 relative">
            {!hideChat && (
                <button
                    onClick={toggleChat}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors relative border ${light ? 'bg-gray-50 border-gray-100 text-gray-900 hover:bg-gray-100' : 'bg-white/5 border-white/5 text-orange-500 hover:bg-white/10'
                        }`}
                >
                    <MessagesSquare className="w-5.5 h-5.5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] font-black rounded-lg h-5 min-w-5 px-1 flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
                            {unreadCount}
                        </span>
                    )}
                </button>
            )}
            <button
                onClick={toggleWishlist}
                className={`hidden md:flex w-10 h-10 rounded-2xl items-center justify-center transition-colors relative border ${light ? 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100' : 'bg-white/5 border-white/5 text-red-400 hover:bg-white/10'
                    }`}
            >
                <Heart className="w-5 h-5" />
            </button>
            <button
                onClick={toggleCart}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors relative border ${light ? 'bg-gray-50 border-gray-100 text-gray-900 hover:bg-gray-100' : 'bg-white/5 border-white/5 text-orange-500 hover:bg-white/10'
                    }`}
            >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] font-black rounded-lg h-5 w-5 flex items-center justify-center border-2 border-white shadow-lg">
                        {itemCount}
                    </span>
                )}
            </button>
        </div>
    );

    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/store/${subdomain}/shop?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    if (type === 'product') {
        return (
            <div className="bg-white/80 backdrop-blur-md px-5 py-4 flex items-center justify-between sticky top-0 z-[100] border-b border-gray-50 transition-all duration-300">
                <Link
                    href={`/store/${subdomain}`}
                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 shadow-sm active:scale-90 transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-[14px] font-black tracking-tighter uppercase italic text-gray-900">Details</h1>
                {renderIcons(true)}
            </div>
        );
    }

    const renderCategoryRow = () => (
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-5 px-5 pb-6 pt-2">
            {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                    <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`relative px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 flex-shrink-0 active:scale-95 ${isActive
                            ? 'text-white'
                            : 'text-gray-500 hover:text-gray-900 bg-gray-100 border border-gray-200'
                            }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeCategory"
                                className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl shadow-lg shadow-orange-500/30"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">{cat}</span>
                    </button>
                );
            })}
        </div>
    );



    if (type === 'customer') {
        return null; // Global header is hidden for customer pages to provide total immersion as requested
    }

    return (
        <div className="bg-white text-gray-900 sticky top-0 z-[100] border-b border-gray-100">
            <div className={`px-5 md:px-8 transition-all duration-300 ${isScrolled ? 'py-3 shadow-xl bg-white/95 backdrop-blur-md' : 'py-5 bg-white'}`}>
                {/* 1. Desktop Executive Header - High-Density Precision */}
                <div className="hidden md:flex flex-col gap-6 max-w-[1600px] mx-auto">
                    <div className="flex items-center justify-between gap-10">
                        {/* Brand & Core Nav */}
                        <div className="flex items-center gap-12">
                            <Link
                                href={isPreview ? '#' : `/store/${subdomain}`}
                                onClick={(e) => {
                                    if (isPreview && onNavigate) {
                                        e.preventDefault();
                                        onNavigate('index');
                                    }
                                }}
                                className="flex items-center gap-3 active:scale-95 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm shrink-0 group-hover:border-gray-900 transition-colors">
                                    <EditableImage
                                        src={logo}
                                        onSave={(url) => handleConfigSave({ logo: url })}
                                        isPreview={isPreview}
                                        className="w-full h-full"
                                    />
                                </div>
                                <p className="text-[17px] font-black text-gray-900 tracking-tighter leading-none whitespace-nowrap">
                                    <EditableText
                                        value={storeName || 'APPIFY'}
                                        onSave={(val) => handleConfigSave({ name: val })}
                                        isPreview={isPreview}
                                        label="Store Name"
                                    />
                                </p>
                            </Link>

                            <div className="flex items-center gap-8">
                                <Link
                                    href={isPreview ? '#' : `/store/${subdomain}`}
                                    onClick={(e) => {
                                        if (isPreview && onNavigate) {
                                            e.preventDefault();
                                            onNavigate('index');
                                        }
                                    }}
                                    className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-gray-900 px-3 py-1.5 rounded-full ${type === 'home' ? 'text-gray-900 bg-gray-50' : 'text-gray-400 hover:bg-gray-50'}`}
                                >
                                    <EditableText
                                        value={themeConfig?.navHome || 'Home'}
                                        onSave={(val) => handleConfigSave({ navHome: val })}
                                        isPreview={isPreview}
                                        label="Home Label"
                                    />
                                </Link>
                                <Link
                                    href={isPreview ? '#' : `/store/${subdomain}/shop`}
                                    onClick={(e) => {
                                        if (isPreview && onNavigate) {
                                            e.preventDefault();
                                            onNavigate('shop');
                                        }
                                    }}
                                    className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-gray-900 px-3 py-1.5 rounded-full ${type === 'shop' ? 'text-gray-900 bg-gray-50' : 'text-gray-400 hover:bg-gray-50'}`}
                                >
                                    <EditableText
                                        value={themeConfig?.navShop || 'Shop'}
                                        onSave={(val) => handleConfigSave({ navShop: val })}
                                        isPreview={isPreview}
                                        label="Shop Label"
                                    />
                                </Link>
                            </div>
                        </div>

                        {/* Integrated Intelligence Search */}
                        <div className="flex-1 max-w-lg">
                            <form onSubmit={handleSearch} className="relative h-11 shrink-0">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products"
                                    className="w-full h-full pl-11 pr-12 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all font-bold"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 border border-gray-100 transition-all shadow-sm">
                                    <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                            </form>
                        </div>

                        {/* Anchors & Utility */}
                        <div className="flex items-center gap-4">
                            {isPreview && (
                                <div className="mr-2">
                                    <EditableColor
                                        value={primaryColor || '#f97316'}
                                        onSave={(color) => handleConfigSave({ primaryColor: color })}
                                        isPreview={isPreview}
                                        label="Brand Color"
                                    />
                                </div>
                            )}
                            {renderIcons()}
                            {user ? (
                                <Link
                                    href={isPreview ? '#' : `/store/${subdomain}/customer/orders`}
                                    onClick={(e) => {
                                        if (isPreview && onNavigate) {
                                            e.preventDefault();
                                            onNavigate('customer/orders');
                                        }
                                    }}
                                    className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100 ml-2 shadow-sm"
                                >
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-1 ring-white/20">
                                        {user.name?.[0] || 'U'}
                                    </div>
                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none">
                                        <EditableText
                                            value={themeConfig?.navAccount || 'My Account'}
                                            onSave={(val) => handleConfigSave({ navAccount: val })}
                                            isPreview={isPreview}
                                            label="Account Label"
                                        />
                                    </span>
                                </Link>
                            ) : (
                                <Link
                                    href={isPreview ? '#' : `/store/${subdomain}/customer/login`}
                                    onClick={(e) => {
                                        if (isPreview && onNavigate) {
                                            e.preventDefault();
                                            onNavigate('customer/login');
                                        }
                                    }}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 rounded-2xl hover:bg-black transition-all border border-black ml-2 shadow-xl"
                                >
                                    <User className="w-4 h-4 text-white" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
                                        <EditableText
                                            value={themeConfig?.navSignIn || 'Sign In'}
                                            onSave={(val) => handleConfigSave({ navSignIn: val })}
                                            isPreview={isPreview}
                                            label="Sign In Label"
                                        />
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Secondary Desktop Discovery Layer - Collection Context - Hidden on MD+ because we have the sidebar now */}
                    {type === 'shop' && !isScrolled && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="hidden pt-2 border-t border-white/5"
                        >
                            {renderCategoryRow()}
                        </motion.div>
                    )}
                </div>

                {/* 2. Mobile Immersive Header - Strictly Preserved */}
                <div className="md:hidden">
                    {/* Row 1: Brand/User + Icons - Stationary Anchor */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {type === 'home' ? (
                                <Link
                                    href={isPreview ? '#' : `/store/${subdomain}`}
                                    onClick={(e) => {
                                        if (isPreview && onNavigate) {
                                            e.preventDefault();
                                            onNavigate('index');
                                        }
                                    }}
                                    className="flex items-center gap-3 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm group-active:scale-95 transition-all">
                                        <EditableImage
                                            src={logo}
                                            onSave={(url) => handleConfigSave({ logo: url })}
                                            isPreview={isPreview}
                                            className="w-full h-full"
                                            label="Logo"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-[17px] font-black text-gray-900 tracking-tighter leading-none">
                                            <EditableText
                                                value={storeName || 'APPIFY'}
                                                onSave={(val) => handleConfigSave({ name: val })}
                                                isPreview={isPreview}
                                                label="Store Name"
                                            />
                                        </p>
                                    </div>
                                </Link>
                            ) : (
                                <>
                                    {user ? (
                                        <>
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold text-sm overflow-hidden ring-2 ring-gray-50 shrink-0 shadow-lg">
                                                {user.image ? (
                                                    <img
                                                        src={user.image.startsWith('http')
                                                            ? user.image
                                                            : `${(process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/?$/, '')}/${user.image.replace(/^\//, '')}`}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="uppercase">{user.name?.[0]}</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-[10px] font-bold text-gray-400 leading-tight uppercase tracking-[0.15em]">
                                                    <EditableText
                                                        value={getGreeting()}
                                                        onSave={(val) => handleConfigSave({ greeting: val })}
                                                        isPreview={isPreview}
                                                        label="Greeting"
                                                    />
                                                </p>
                                                <p className="text-[15px] font-black text-gray-900 tracking-tight leading-none mt-1.5 whitespace-nowrap">{user.name}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <Link
                                            href={isPreview ? '#' : `/store/${subdomain}/customer/login`}
                                            onClick={(e) => {
                                                if (isPreview && onNavigate) {
                                                    e.preventDefault();
                                                    onNavigate('customer/login');
                                                }
                                            }}
                                            className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
                                        >
                                            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <span className="text-[11px] font-extrabold text-gray-700 uppercase tracking-widest leading-none">Sign In</span>
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                        {renderIcons()}
                    </div>

                    {/* Collapsable Section: Search + Categories with Framer Motion */}
                    <AnimatePresence initial={false}>
                        {!isScrolled && (
                            <motion.div
                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                animate={{ height: 'auto', opacity: 1, marginTop: 20 }}
                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                className="overflow-hidden"
                            >
                                <div className="flex flex-col gap-5 pb-3">
                                    {/* Row 2: Search Bar */}
                                    <form onSubmit={handleSearch} className="relative h-11 shrink-0">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search products"
                                            className="w-full h-full pl-11 pr-12 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-gray-200 transition-all"
                                        />
                                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
                                            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                                        </button>
                                    </form>

                                    {/* Row 3: Category Pills - Only on Shop Page */}
                                    {type === 'shop' && (
                                        <div className="shrink-0 mt-2">
                                            {renderCategoryRow()}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
