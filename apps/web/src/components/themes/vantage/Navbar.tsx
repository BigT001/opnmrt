'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { ShoppingBag, Search, User, Menu, X, Home, Grid, Heart, Package, Instagram, Twitter, Facebook, MessageSquare } from 'lucide-react';
import { useStoreCart } from '@/store/useStoreCart';
import { useAuthStore } from '@/store/useAuthStore';
import { NavbarProps } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';
import { Trash2, Minus, Plus, Send, Loader2 as LoaderIcon, CheckCircle, ArrowLeft, ExternalLink, Store } from 'lucide-react';
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { EditableText, EditableColor } from '../EditableContent';

export function VantageNavbar({ storeName, logo, storeId, isPreview, primaryColor, themeConfig, onConfigChange, onNavigate }: NavbarProps & { onConfigChange?: (cfg: any) => void }) {
    const { toggleCart, totalCount: itemCount } = useStoreCart(storeId);
    const effectivePrimaryColor = primaryColor || themeConfig?.primaryColor || '#000000';
    const { user } = useAuthStore();
    const { subdomain } = useParams<{ subdomain: string }>();
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [globalSearch, setGlobalSearch] = React.useState('');
    const [isFavoritesOpen, setIsFavoritesOpen] = React.useState(false);
    const [isOrdersOpen, setIsOrdersOpen] = React.useState(false);
    const [isChatOpen, setIsChatOpen] = React.useState(false);
    const [orders, setOrders] = React.useState<any[]>([]);
    const [messages, setMessages] = React.useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = React.useState(false);
    const [loadingMessages, setLoadingMessages] = React.useState(false);
    const [newMessage, setNewMessage] = React.useState('');
    const [sendingMessage, setSendingMessage] = React.useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = React.useState<any>(null);

    const config = themeConfig || {};

    const handleConfigSave = (newCfg: any) => {
        onConfigChange?.(newCfg);
    };

    React.useEffect(() => {
        if (isOrdersOpen && user) {
            setLoadingOrders(true);
            api.get('orders/my-orders')
                .then(res => setOrders(res.data))
                .catch(err => console.error("Orders fetch error:", err))
                .finally(() => setLoadingOrders(false));
        }
    }, [isOrdersOpen, user]);

    React.useEffect(() => {
        if (isChatOpen && user) {
            setLoadingMessages(true);
            api.get(`chat/messages?storeId=${storeId}`)
                .then(res => setMessages(res.data))
                .catch(err => console.error("Chat fetch error:", err))
                .finally(() => setLoadingMessages(false));
        }
    }, [isChatOpen, user, storeId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sendingMessage || !user) return;

        setSendingMessage(true);
        try {
            const res = await api.post('chat/send', {
                content: newMessage,
                storeId: storeId,
            });
            setMessages(prev => [...prev, res.data]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setSendingMessage(false);
        }
    };

    React.useEffect(() => {
        if (isMenuOpen || isFavoritesOpen || isOrdersOpen || isChatOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen, isFavoritesOpen, isOrdersOpen, isChatOpen]);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (globalSearch.trim()) {
            router.push(`/store/${subdomain}/shop?q=${encodeURIComponent(globalSearch.trim())}`);
            setIsSearchOpen(false);
            setGlobalSearch('');
        }
    };

    const navLinks = [
        { name: config.navHome || 'Home', href: `/store/${subdomain}`, key: 'navHome' },
        { name: config.navCollections || 'Collections', href: `/store/${subdomain}/shop`, key: 'navCollections' },
        { name: config.navStory || 'Our Story', href: `/store/${subdomain}/#lookbook`, key: 'navStory' },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-[120] transition-all duration-700 ${scrolled
                    ? 'py-3 bg-white/80 backdrop-blur-2xl border-b border-gray-100 shadow-sm'
                    : 'py-6 lg:py-8 bg-transparent'
                    }`}
            >
                <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
                    {/* Brand */}
                    <Link
                        href={isPreview ? '#' : `/store/${subdomain}`}
                        onClick={(e) => {
                            if (isPreview && onNavigate) {
                                e.preventDefault();
                                onNavigate('index');
                            }
                        }}
                        className="group relative z-10 shrink-0"
                    >
                        {logo ? (
                            <div className="flex items-center gap-4">
                                <img
                                    src={logo}
                                    alt={storeName}
                                    className="h-8 lg:h-12 w-auto object-contain transition-transform group-hover:scale-105"
                                />
                                <span className="text-xl lg:text-2xl font-black tracking-tighter text-black uppercase block">
                                    <EditableText
                                        value={storeName || 'VANTAGE'}
                                        onSave={(val: string) => handleConfigSave({ name: val })}
                                        isPreview={isPreview}
                                        label="Store Name"
                                    />
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-col leading-none">
                                <span className="text-xl lg:text-2xl font-black tracking-tighter text-black lg:text-gray-900 uppercase">
                                    <EditableText
                                        value={storeName || 'VANTAGE'}
                                        onSave={(val: string) => handleConfigSave({ name: val })}
                                        isPreview={isPreview}
                                        label="Store Name"
                                    />
                                </span>
                                <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500" style={{ backgroundColor: effectivePrimaryColor }} />
                            </div>
                        )}
                    </Link>

                    {/* Desktop Navigation - Center Aligned */}
                    <div className="hidden lg:flex items-center gap-12">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={isPreview ? '#' : link.href}
                                onClick={(e) => {
                                    if (isPreview && onNavigate) {
                                        e.preventDefault();
                                        if (link.key === 'navHome') onNavigate('index');
                                        else if (link.href.includes('/shop')) onNavigate('shop');
                                        else if (link.href.includes('#lookbook') || link.href.includes('/story')) onNavigate('about');
                                    }
                                }}
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all relative group"
                            >
                                <EditableText
                                    value={link.name}
                                    onSave={(val: string) => link.key && handleConfigSave({ [link.key]: val })}
                                    isPreview={isPreview}
                                    label={link.name}
                                />
                                <span className={`absolute -bottom-1 left-0 w-0 h-[2px] transition-all group-hover:w-full ${pathname === link.href ? 'w-full' : ''}`} style={{ backgroundColor: effectivePrimaryColor }} />
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 lg:gap-6">
                        {/* Brand Color Picker in Preview */}
                        {isPreview && (
                            <div className="mr-2">
                                <EditableColor
                                    value={effectivePrimaryColor}
                                    onSave={(color: string) => handleConfigSave({ primaryColor: color })}
                                    isPreview={isPreview}
                                    label="Brand Color"
                                />
                            </div>
                        )}

                        {/* Search Bar - Expanding Masterpiece */}
                        <div className="relative flex items-center">
                            <AnimatePresence>
                                {isSearchOpen && (
                                    <motion.form
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: typeof window !== 'undefined' && window.innerWidth < 640 ? 150 : 240, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        onSubmit={handleSearch}
                                        className="absolute right-full mr-2"
                                    >
                                        <input
                                            autoFocus
                                            type="text"
                                            value={globalSearch}
                                            onChange={(e) => setGlobalSearch(e.target.value)}
                                            placeholder={(config.navSearchPlaceholder || "SEARCH THE STORE...").toUpperCase()}
                                            className="w-full bg-gray-50/50 backdrop-blur-md border-none rounded-full px-6 py-2.5 text-[9px] font-black uppercase tracking-widest focus:ring-0"
                                        />
                                    </motion.form>
                                )}
                            </AnimatePresence>
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="p-2 text-black lg:text-gray-900 group transition-all active:scale-90"
                            >
                                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                            </button>
                        </div>

                        <button
                            onClick={toggleCart}
                            className="relative p-2 text-black lg:text-gray-900 group transition-all"
                        >
                            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 text-white text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-white" style={{ backgroundColor: effectivePrimaryColor }}>
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        <Link
                            href={user ? `/store/${subdomain}/customer/profile` : `/store/${subdomain}/customer/login`}
                            className="hidden lg:flex text-white px-10 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-black/10"
                            style={{ backgroundColor: effectivePrimaryColor }}
                        >
                            <EditableText
                                value={user ? (config.navAccountLabel || 'My Account') : (config.navSignInLabel || 'Sign In')}
                                onSave={(val: string) => handleConfigSave({ [user ? 'navAccountLabel' : 'navSignInLabel']: val })}
                                isPreview={isPreview}
                                label="Account Button"
                            />
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-black"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay - Fully Opaque & High Z-Index */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white z-[999] lg:hidden flex flex-col pt-12 pb-10 px-8 overflow-y-auto no-scrollbar"
                        style={{ backgroundColor: '#ffffff' }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-12">
                            <Link
                                href={isPreview ? '#' : `/store/${subdomain}`}
                                onClick={(e) => {
                                    setIsMenuOpen(false);
                                    if (isPreview && onNavigate) {
                                        e.preventDefault();
                                        onNavigate('index');
                                    }
                                }}
                                className="flex items-center gap-3"
                            >
                                {logo && <img src={logo} alt={storeName} className="h-10 w-auto object-contain" />}
                                <span className="text-2xl font-black tracking-tighter uppercase text-black">{storeName || 'VANTAGE'}</span>
                            </Link>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-full active:scale-90 transition-all"
                            >
                                <X className="w-6 h-6 text-black" />
                            </button>
                        </div>

                        {/* Main Navigation - Filtered for Mobile */}
                        <div className="space-y-6">
                            {navLinks.filter(l => l.name !== 'Home' && l.name !== 'Collections').map((link, idx) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                                >
                                    <Link
                                        href={isPreview ? '#' : link.href}
                                        onClick={(e) => {
                                            setIsMenuOpen(false);
                                            if (isPreview && onNavigate) {
                                                e.preventDefault();
                                                if (link.key === 'navHome') onNavigate('index');
                                                else if (link.href.includes('/shop')) onNavigate('shop');
                                                else if (link.href.includes('#lookbook') || link.href.includes('/story')) onNavigate('about');
                                            }
                                        }}
                                        className="group flex flex-col"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 group-hover:text-black transition-colors">0{idx + (link.name === 'Home' ? 1 : 3)}</span>
                                        <span className="text-5xl font-black uppercase tracking-tighter text-black mt-1 leading-none">
                                            {link.name}
                                        </span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Secondary Section: Discovery - Vertical Layout for 'Complete Expression' */}
                        <div className="mt-12 pt-12 border-t border-gray-100 flex flex-col gap-10">
                            <div className="space-y-3 text-left">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                                    <EditableText
                                        value={config.navMenuHelpTitle || "Need Help?"}
                                        onSave={val => handleConfigSave({ navMenuHelpTitle: val })}
                                        isPreview={isPreview}
                                        label="Help Section Title"
                                    />
                                </p>
                                <p className="text-sm font-black text-black uppercase tracking-tight">
                                    <EditableText
                                        value={config.navMenuHelpEmail || "support@vantage.shop"}
                                        onSave={val => handleConfigSave({ navMenuHelpEmail: val })}
                                        isPreview={isPreview}
                                        label="Help Email"
                                    />
                                </p>
                            </div>
                            <div className="space-y-3 text-left">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                                    <EditableText
                                        value={config.navMenuAddressTitle || "Address"}
                                        onSave={val => handleConfigSave({ navMenuAddressTitle: val })}
                                        isPreview={isPreview}
                                        label="Address Section Title"
                                    />
                                </p>
                                <p className="text-sm font-black text-black uppercase tracking-tight leading-snug">
                                    <EditableText
                                        value={config.navMenuAddressContent || "Oxford St, London \n W1D 1BS, UK"}
                                        onSave={val => handleConfigSave({ navMenuAddressContent: val })}
                                        isPreview={isPreview}
                                        multiline
                                        label="Address Content"
                                    />
                                </p>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-auto pt-10 space-y-8">
                            <Link
                                href={user ? `/store/${subdomain}/customer/profile` : `/store/${subdomain}/customer/login`}
                                onClick={() => setIsMenuOpen(false)}
                                className="block w-full py-6 bg-black text-white text-center rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-black/20 transform active:scale-95 transition-all"
                            >
                                <EditableText
                                    value={user ? (config.navMenuAccountDashboard || 'My Account Dashboard') : (config.navMenuMemberSignIn || 'Member Sign In')}
                                    onSave={val => handleConfigSave({ [user ? 'navMenuAccountDashboard' : 'navMenuMemberSignIn']: val })}
                                    isPreview={isPreview}
                                    label="Mobile Menu Account Button"
                                />
                            </Link>

                            <div className="flex items-center justify-between">
                                <div className="flex gap-6">
                                    {[
                                        { icon: <Instagram className="w-5 h-5 text-[#E4405F]" />, label: 'IG', color: 'hover:bg-[#E4405F]/10 hover:border-[#E4405F]/30' },
                                        { icon: <Twitter className="w-5 h-5 text-[#1DA1F2]" />, label: 'TW', color: 'hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/30' },
                                        { icon: <Facebook className="w-5 h-5 text-[#1877F2]" />, label: 'FB', color: 'hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30' }
                                    ].map((social) => (
                                        <Link
                                            key={social.label}
                                            href="#"
                                            className={`w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center transition-all shadow-sm bg-white ${social.color}`}
                                        >
                                            {social.icon}
                                        </Link>
                                    ))}
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <EditableText
                                        value={config.navMenuCopyright || `©${new Date().getFullYear()} ${storeName.toUpperCase()}`}
                                        onSave={val => handleConfigSave({ navMenuCopyright: val })}
                                        isPreview={isPreview}
                                        label="Mobile Menu Copyright"
                                    />
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
                <div className="bg-white/90 backdrop-blur-2xl border-t border-gray-100 px-2 py-2 flex items-center justify-around shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
                    <MobileNavLink href={`/store/${subdomain}`} icon={<Home className="w-5 h-5" />} active={pathname === `/store/${subdomain}`} label="Home" />
                    <MobileNavLink
                        onClick={() => setIsFavoritesOpen(true)}
                        icon={<Heart className="w-5 h-5" />}
                        active={pathname === `/store/${subdomain}/favorites` || isFavoritesOpen}
                        label="Favorites"
                    />

                    <div className="flex flex-col items-center gap-1 -mt-4">
                        <Link
                            href={`/store/${subdomain}/shop`}
                            className="relative w-14 h-14 bg-black rounded-full flex items-center justify-center text-white shadow-xl shadow-black/20 hover:scale-110 active:scale-95 transition-all border-4 border-white"
                        >
                            <Grid className="w-6 h-6" />
                        </Link>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${pathname.includes('/shop') ? 'text-black' : 'text-gray-400 opacity-40'}`}>
                            Collections
                        </span>
                    </div>

                    <MobileNavLink
                        onClick={() => setIsOrdersOpen(true)}
                        icon={<Package className="w-5 h-5" />}
                        active={isOrdersOpen}
                        label="Orders"
                    />
                    <MobileNavLink
                        onClick={() => setIsChatOpen(true)}
                        icon={<MessageSquare className="w-5 h-5" />}
                        active={isChatOpen}
                        label="Chat"
                    />
                </div>
            </div>

            {/* ═══ MOBILE BOTTOM DRAWERS ═══ */}
            <VantageBottomSheet
                isOpen={isFavoritesOpen}
                onClose={() => setIsFavoritesOpen(false)}
                title={config.navWishlistTitle || "Your Wishlist"}
                subtitle={config.navWishlistSubtitle || "Items you've liked"}
                storeId={storeId || ''}
            >
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <Heart className="w-12 h-12 text-gray-100" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Save your favorite styles <br /> to see them here.</p>
                </div>
            </VantageBottomSheet>

            <VantageBottomSheet
                isOpen={isOrdersOpen}
                onClose={() => {
                    setIsOrdersOpen(false);
                    setSelectedOrderDetails(null);
                }}
                title={selectedOrderDetails ? "Order Detail" : "Management"}
                subtitle={selectedOrderDetails ? `Viewing Order #${selectedOrderDetails.id.slice(-6).toUpperCase()}` : "Your Order Archive"}
                storeId={storeId || ''}
                onBack={selectedOrderDetails ? () => setSelectedOrderDetails(null) : undefined}
            >
                {!user ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <Package className="w-12 h-12 text-gray-100" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Identify yourself to <br /> access your archives.</p>
                        <Link
                            href={`/store/${subdomain}/customer/login`}
                            onClick={() => setIsOrdersOpen(false)}
                            className="bg-black text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest"
                        >
                            Log In Here
                        </Link>
                    </div>
                ) : loadingOrders ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <LoaderIcon className="w-8 h-8 animate-spin text-gray-200" />
                    </div>
                ) : selectedOrderDetails ? (
                    <div className="space-y-8 animate-in slide-in-from-right duration-300">
                        <div className="space-y-4">
                            <div className="p-6 rounded-[2rem] bg-gray-50 border border-gray-100 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Total Amount</p>
                                    <p className="text-xl font-black text-black mt-1">{formatPrice(Number(selectedOrderDetails.totalAmount))}</p>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${selectedOrderDetails.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                                    {selectedOrderDetails.status}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 pl-4">Basket Content</p>
                                {selectedOrderDetails.items?.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 p-4 rounded-[1.5rem] bg-white border border-gray-50 shadow-sm">
                                        <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                                            <img src={item.product?.image || item.product?.images?.[0]} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col justify-center min-w-0 flex-1">
                                            <h4 className="text-[12px] font-black uppercase truncate text-black">{item.product?.name || 'Item'}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 mt-0.5">Qty: {item.quantity} × {formatPrice(Number(item.price))}</p>
                                        </div>
                                        <div className="flex items-center justify-end font-black text-xs text-black">
                                            {formatPrice(Number(item.price) * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-6 rounded-[2rem] border border-neutral-100 bg-neutral-50/50">
                                <div className="space-y-3 text-[10px] font-black uppercase tracking-widest">
                                    <div className="flex justify-between">
                                        <span className="text-neutral-400">Order Placed</span>
                                        <span className="text-neutral-900">{new Date(selectedOrderDetails.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-400">Transaction ID</span>
                                        <span className="text-neutral-900 font-mono">#{selectedOrderDetails.id.toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <button
                                key={order.id}
                                onClick={() => setSelectedOrderDetails(order)}
                                className="w-full p-6 p-6 rounded-[2rem] border border-gray-50 bg-gray-50/30 flex items-center justify-between group active:scale-95 transition-all text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                        <Package className="w-6 h-6 text-black" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">#{order.id.slice(-6).toUpperCase()}</p>
                                        <h4 className="text-[13px] font-black uppercase tracking-tighter text-black mt-0.5">
                                            {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </h4>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-black">{formatPrice(Number(order.totalAmount))}</p>
                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border mt-1 inline-block ${order.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <Package className="w-12 h-12 text-gray-100" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No recent orders found. <br /> Start your style journey today.</p>
                    </div>
                )}
            </VantageBottomSheet>

            <VantageBottomSheet
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                title="Messages"
                subtitle="SECURE COMMUNICATION CHANNEL"
                storeId={storeId || ''}
            >
                {!user ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <MessageSquare className="w-12 h-12 text-gray-100" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sign in to initialize <br /> direct communication.</p>
                        <Link
                            href={`/store/${subdomain}/customer/login`}
                            onClick={() => setIsChatOpen(false)}
                            className="bg-black text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest"
                        >
                            Member Log In
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col h-full overflow-hidden">
                        {/* Messages List - Scrollable */}
                        <div className="flex-grow space-y-6 overflow-y-auto no-scrollbar pb-6 pr-1">
                            {loadingMessages ? (
                                <div className="flex justify-center py-10">
                                    <LoaderIcon className="w-6 h-6 animate-spin text-gray-200" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                        <MessageSquare className="w-10 h-10 text-gray-200" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-widest text-black">New Conversation</p>
                                        <p className="text-[10px] font-medium text-gray-400 mt-1">Start your style consultation.</p>
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isMe = msg.senderRole === 'BUYER';
                                    return (
                                        <div key={msg.id} className={`flex items-end gap-3 ${isMe ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm ${isMe ? 'bg-neutral-100 text-neutral-400' : 'bg-black text-white'}`}>
                                                {isMe ? <User className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                                            </div>
                                            <div className={`max-w-[80%] p-4 rounded-[1.5rem] text-[13px] font-medium leading-relaxed prose prose-sm ${isMe ? 'bg-black text-white rounded-br-none prose-invert' : 'bg-gray-50 text-black border border-gray-100 rounded-bl-none shadow-sm'}`}>
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        p: ({ children }) => <p className="m-0 whitespace-pre-wrap">{children}</p>,
                                                        a: ({ node, ...props }) => (
                                                            <a
                                                                {...props}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={`inline-flex items-center gap-1 underline font-bold ${isMe ? 'text-emerald-300 hover:text-white' : 'text-emerald-500 hover:text-emerald-400'}`}
                                                            >
                                                                {props.children}
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        ),
                                                        strong: ({ children }) => <strong className="font-black">{children}</strong>
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                                <div className={`text-[8px] font-black mt-2 uppercase tracking-widest opacity-30 ${isMe ? 'text-right' : 'text-left'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Input Area - Fixed at bottom */}
                        <form onSubmit={handleSendMessage} className="relative mt-auto pt-2 shrink-0 bg-white">
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="TYPE YOUR MESSAGE..."
                                    className="w-full h-20 pl-8 pr-24 bg-neutral-50 border-2 border-neutral-100 rounded-[2rem] text-sm font-bold uppercase tracking-widest focus:ring-8 focus:ring-black/5 focus:border-black transition-all placeholder:text-neutral-300 shadow-sm group-hover:shadow-md"
                                    style={{ color: '#000000' }}
                                />
                                <button
                                    type="submit"
                                    disabled={sendingMessage || !newMessage.trim()}
                                    className="absolute right-2 top-2 bottom-2 w-16 bg-black text-white rounded-[1.5rem] flex items-center justify-center active:scale-95 transition-all disabled:opacity-30 shadow-[0_8px_16px_rgba(0,0,0,0.2)]"
                                >
                                    {sendingMessage ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </div>
                            <div className="h-0 lg:hidden" /> {/* Extra spacing for home indicator moved to container padding */}
                        </form>
                    </div>
                )}
            </VantageBottomSheet>
        </>
    );
}

function VantageBottomSheet({ isOpen, onClose, title, subtitle, children, storeId, onBack }: { isOpen: boolean; onClose: () => void; title: string; subtitle: string; children: React.ReactNode; storeId: string; onBack?: () => void }) {
    const { items: wishlistItems, removeItem: removeFromWishlist } = useWishlistStore();
    const { addItem, toggleCart, updateQuantity } = useStoreCart(storeId);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 35, stiffness: 350, mass: 1 }}
                        className="fixed inset-0 bg-white z-[999] lg:hidden flex flex-col p-8 pb-12 overflow-hidden"
                    >
                        {/* Header Area */}
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <div className="flex items-center gap-6">
                                {onBack && (
                                    <button
                                        onClick={onBack}
                                        className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl active:scale-90 transition-all"
                                    >
                                        <ArrowLeft className="w-6 h-6 text-black" />
                                    </button>
                                )}
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-tighter text-black">{title}</h3>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-300 mt-1">{subtitle}</p>
                                </div>
                            </div>
                            {!onBack && (
                                <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full active:scale-90 transition-all">
                                    <X className="w-6 h-6 text-black" />
                                </button>
                            )}
                            {onBack && (
                                <button onClick={onClose} className="text-[10px] font-black uppercase tracking-widest text-neutral-300">
                                    Close
                                </button>
                            )}
                        </div>

                        <div className="flex-grow overflow-y-auto no-scrollbar">
                            {title.includes('Wishlist') ? (
                                wishlistItems.length > 0 ? (
                                    <div className="space-y-8 pb-10">
                                        {wishlistItems.map((item) => (
                                            <div key={item.id} className="flex gap-6 group">
                                                <div className="w-20 h-24 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                                                    <img src={item.image || (item.images && item.images[0])} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col justify-between py-1 flex-grow">
                                                    <div>
                                                        <h4 className="text-[11px] font-black uppercase tracking-tight text-black">{item.name}</h4>
                                                        <p className="text-xs font-bold text-gray-900 mt-1">{formatPrice(Number(item.price))}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => {
                                                                addItem({
                                                                    id: item.id,
                                                                    name: item.name,
                                                                    price: Number(item.price),
                                                                    image: item.image || (item.images && item.images[0]),
                                                                    storeId: storeId,
                                                                    stock: (item as any).stock || 0
                                                                }, 1);
                                                                onClose();
                                                                toggleCart();
                                                            }}
                                                            className="text-[9px] font-black uppercase tracking-widest text-black border-b-2 border-black pb-0.5"
                                                        >
                                                            Add To Cart
                                                        </button>
                                                        <button
                                                            onClick={() => removeFromWishlist(item.id)}
                                                            className="text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                        <Heart className="w-12 h-12 text-gray-100" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Save your favorite styles <br /> to see them here.</p>
                                    </div>
                                )
                            ) : children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function MobileNavLink({ onClick, href, icon, active, label }: { onClick?: () => void; href?: string; icon: React.ReactNode; active: boolean; label: string }) {
    const content = (
        <div className="relative flex flex-col items-center gap-1.5 group py-1.5 min-w-[50px]">
            <div className={`transition-all duration-300 ${active ? 'text-black scale-110' : 'text-gray-400 opacity-60'}`}>
                {icon}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${active ? 'opacity-100 text-black' : 'opacity-40 text-gray-400'}`}>
                {label}
            </span>
            {active && (
                <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-1 w-1 h-1 bg-black rounded-full"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                />
            )}
        </div>
    );

    if (onClick) {
        return (
            <button onClick={onClick} className="flex flex-col items-center">
                {content}
            </button>
        );
    }

    return (
        <Link href={href || '#'} className="flex flex-col items-center">
            {content}
        </Link>
    );
}
