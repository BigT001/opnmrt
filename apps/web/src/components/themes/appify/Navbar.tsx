'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Search, MessagesSquare, ShoppingBag, SlidersHorizontal, User, Zap, ChevronLeft } from 'lucide-react';
import { NavbarProps } from '../types';
import { useAuthStore } from '@/store/useAuthStore';
import { useStoreCart } from '@/store/useStoreCart';
import { useChatStore } from '@/store/useChatStore';
import { motion, AnimatePresence } from 'framer-motion';

export function AppifyNavbar({ storeName, logo, storeId, isPreview, onNavigate, type = 'shop' }: NavbarProps & { type?: 'home' | 'shop' | 'product' | 'customer' }) {
    const { user } = useAuthStore();
    const { toggleCart, totalCount: itemCount } = useStoreCart(storeId);
    const { toggleDrawer: toggleChat, unreadCount } = useChatStore();
    const params = useParams<{ subdomain: string }>();
    const searchParams = useSearchParams();
    const subdomain = params?.subdomain;
    const router = useRouter();

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

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const renderIcons = (light = false) => (
        <div className="flex items-center gap-2 relative">
            <button
                onClick={toggleChat}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors relative border ${light ? 'bg-gray-50 border-gray-100 text-orange-500 hover:bg-gray-100' : 'bg-white/5 border-white/5 text-orange-500 hover:bg-white/10'
                    }`}
            >
                <MessagesSquare className="w-5.5 h-5.5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-black rounded-lg h-5 min-w-5 px-1 flex items-center justify-center border-2 border-[#0a0a0a] shadow-lg animate-bounce">
                        {unreadCount}
                    </span>
                )}
            </button>
            <button
                onClick={toggleCart}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors relative border ${light ? 'bg-gray-50 border-gray-100 text-orange-500 hover:bg-gray-100' : 'bg-white/5 border-white/5 text-orange-500 hover:bg-white/10'
                    }`}
            >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-black rounded-lg h-5 w-5 flex items-center justify-center border-2 border-[#0a0a0a] shadow-lg">
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
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-5 pt-1">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-5 py-2.5 rounded-full text-[12px] font-black tracking-tight whitespace-nowrap transition-all flex-shrink-0 active:scale-95 ${activeCategory === cat
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                        : 'bg-white/10 text-white/50 hover:bg-white/15 hover:text-white/80'
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );



    if (type === 'customer') {
        return null; // Global header is hidden for customer pages to provide total immersion as requested
    }

    return (
        <div className="bg-[#0a0a0a] text-white sticky top-0 z-[100]">
            <div className={`px-5 transition-all duration-300 ${isScrolled ? 'pt-3 pb-3 shadow-2xl bg-[#0a0a0a]/95 backdrop-blur-md' : 'pt-5 pb-1 bg-[#0a0a0a]'
                }`}>
                {/* Row 1: Brand/User + Icons - Stationary Anchor */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {type === 'home' ? (
                            <Link href={`/store/${subdomain}`} className="flex items-center gap-3 group">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/10 shadow-lg group-active:scale-95 transition-all">
                                    {logo ? (
                                        <img src={logo} alt={storeName} className="w-full h-full object-cover" />
                                    ) : (
                                        <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-[17px] font-black text-white tracking-tighter leading-none">{storeName}</p>
                                </div>
                            </Link>
                        ) : (
                            <>
                                {user ? (
                                    <>
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden ring-2 ring-white/10 shrink-0 shadow-lg shadow-orange-500/20">
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
                                            <p className="text-[10px] font-bold text-white/40 leading-tight uppercase tracking-[0.15em]">{greeting()}</p>
                                            <p className="text-[15px] font-black text-white tracking-tight leading-none mt-1.5 whitespace-nowrap">{user.name}</p>
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        href={`/store/${subdomain}/customer/login`}
                                        className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10"
                                    >
                                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/50">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="text-[11px] font-extrabold text-white/70 uppercase tracking-widest leading-none">Sign In</span>
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
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products"
                                        className="w-full h-full pl-11 pr-12 bg-white/10 border border-white/5 rounded-2xl text-[13px] text-white placeholder:text-white/30 outline-none focus:bg-white/15 focus:border-white/20 transition-all"
                                    />
                                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
                                        <SlidersHorizontal className="w-3.5 h-3.5 text-white/50" />
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
    );
}
