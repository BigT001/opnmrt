'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { SearchModal } from '@/components/dashboard/SearchModal';
import { NotificationDropdown } from '@/components/dashboard/NotificationDropdown';
import { UserMenu } from '@/components/dashboard/UserMenu';

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const { user, store, setUser, setStore, setLoading, isLoading } = useAuthStore();
    const [unreadCount, setUnreadCount] = React.useState(0);
    const socket = useSocket(user?.id);

    // Header States
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
    const [notifications, setNotifications] = React.useState<any[]>([]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen((open) => !open);
            }
        }
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const fetchNotifications = async () => {
        if (!store?.id) return;
        try {
            const res = await api.get(`/analytics/notifications/${store.id}`);
            setNotifications(res.data);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Refresh every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [store?.id]);

    const notificationsCount = notifications.length;

    useEffect(() => {
        if (!user) return;
        const fetchUnread = async () => {
            try {
                const res = await api.get('/chat/unread-count');
                setUnreadCount(res.data.count);
            } catch (err) {
                console.error('Failed to fetch unread count:', err);
            }
        };
        fetchUnread();
    }, [user]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message: any) => {
            if (message.recipientId === user?.id && pathname !== '/dashboard/seller/messages') {
                setUnreadCount(prev => prev + 1);
            }
        };

        socket.on('newMessage', handleNewMessage);
        return () => { socket.off('newMessage', handleNewMessage); };
    }, [socket, user?.id, pathname]);

    useEffect(() => {
        // Reset count if on messages page
        if (pathname === '/dashboard/seller/messages') {
            setUnreadCount(0);
        }
    }, [pathname]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await api.get('auth/me');
                setUser(response.data.user);
                setStore(response.data.store);
            } catch (err) {
                console.error('Auth check failed:', err);
                localStorage.removeItem('token');
                setUser(null);
                setStore(null);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        const token = localStorage.getItem('token');

        // If no token, redirect to login
        if (!token) {
            setLoading(false);
            router.push('/login');
            return;
        }

        // If we have persisted user data, use it and skip the API call
        if (user && store) {
            setLoading(false);
            return;
        }

        // Otherwise, fetch user data
        fetchUser();
    }, [router, setUser, setStore, setLoading]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setStore(null);
        router.push('/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-primary animate-pulse">
                Verifying Session...
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="h-screen bg-slate-50 flex overflow-hidden font-sans relative">
            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-white z-[110] lg:hidden shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center space-x-3 text-slate-900">
                                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0">
                                        <span className="text-white text-md font-bold font-mono">O</span>
                                    </div>
                                    <span className="text-md font-bold tracking-tight">OPNMRT</span>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    <span className="text-xl">✕</span>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
                                <SidebarNav pathname={pathname} unreadCount={unreadCount} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Sidebar (Desktop) */}
            <aside
                className={`bg-white border-r border-slate-100 hidden lg:flex flex-col shrink-0 transition-all duration-300 ease-in-out relative group/sidebar ${isCollapsed ? 'w-24' : 'w-72'}`}
            >
                {/* Independent Scroll for Sidebar */}
                <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
                    <div className="p-5 pb-2">
                        <div className={`flex items-center space-x-3 text-slate-900 mb-4 overflow-hidden ${isCollapsed ? 'justify-center pr-0' : ''}`}>
                            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0">
                                <span className="text-white text-lg font-bold font-mono">O</span>
                            </div>
                            {!isCollapsed && <span className="text-lg font-bold tracking-tight whitespace-nowrap">OPNMRT</span>}
                        </div>

                        <SidebarNav pathname={pathname} unreadCount={unreadCount} isCollapsed={isCollapsed} />
                    </div>

                    {/* Upgrade Card / AI Assistant Card */}
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="p-5 mt-auto"
                            >
                                <div className="bg-primary/5 rounded-[2rem] p-5 border border-primary/20 relative overflow-hidden group shadow-sm">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="relative z-10 text-center">
                                        <div className="w-10 h-10 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3 text-xl ring-1 ring-slate-100">
                                            🛍️
                                        </div>
                                        <h4 className="font-bold text-slate-900 text-xs mb-1">Upgrade your plan</h4>
                                        <p className="text-[10px] text-slate-500 mb-3 px-1 leading-tight">Unlock advanced AI insights and custom domains.</p>
                                        <button className="w-full bg-primary text-white py-2.5 rounded-xl text-[10px] font-bold hover:brightness-110 transition-all shadow-lg shadow-emerald-900/10">
                                            Upgrade now →
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isCollapsed && (
                        <div className="mt-auto p-4 flex flex-col items-center space-y-4">
                            <button className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-lg shadow-lg">🤖</button>
                            <button className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white text-lg shadow-lg">✨</button>
                        </div>
                    )}
                </div>

                {/* Sidebar Toggle Button (Floating Hook) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-10 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm z-50 hover:bg-slate-50 transition-colors"
                >
                    <svg
                        className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
            </aside>

            {/* Main Content Area - Independent Scroll */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 bg-white/50 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 shrink-0 border-b border-slate-100/50 relative z-[500]">
                    <div className="flex items-center space-x-4 lg:w-1/4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-600"
                        >
                            <span className="text-xl">☰</span>
                        </button>
                        <div className="hidden lg:flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Good Morning,</span>
                            <span className="text-sm font-bold text-slate-900 mt-1">{user?.name?.split(' ')[0] || 'User'}</span>
                        </div>
                    </div>

                    {/* Centered Store Name */}
                    <div className="flex flex-col items-center justify-center flex-1">
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">
                            {store?.name || 'My Store'}
                        </h1>
                        <div className="flex flex-col items-center mt-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {store?.subdomain ? `${store.subdomain}.opnmart.com` : 'Store Dashboard'}
                            </span>
                            {/* Debug info */}
                            <span className="text-[8px] font-mono text-slate-300">
                                Subdomain: {store?.subdomain}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4 lg:w-1/4">
                        <div className="flex space-x-2 relative">
                            <HeaderButton icon="🔍" onClick={() => setIsSearchOpen(true)} />
                            <div className="relative">
                                <HeaderButton
                                    icon="🔔"
                                    badge={notificationsCount > 0}
                                    onClick={() => {
                                        setIsNotificationsOpen(!isNotificationsOpen);
                                        setIsUserMenuOpen(false);
                                    }}
                                />
                                <NotificationDropdown
                                    storeId={store?.id || ''}
                                    isOpen={isNotificationsOpen}
                                    onClose={() => setIsNotificationsOpen(false)}
                                />
                            </div>
                        </div>
                        <div className="h-8 w-px bg-slate-200 mx-2" />
                        <div className="relative">
                            <div
                                onClick={() => {
                                    setIsUserMenuOpen(!isUserMenuOpen);
                                    setIsNotificationsOpen(false);
                                }}
                                className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-slate-600 font-bold overflow-hidden shadow-inner cursor-pointer hover:ring-2 ring-primary/20 transition-all"
                            >
                                {store?.logo ? (
                                    <img src={store.logo} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    user.name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <UserMenu
                                user={user}
                                store={store}
                                isOpen={isUserMenuOpen}
                                onClose={() => setIsUserMenuOpen(false)}
                                onLogout={handleLogout}
                            />
                        </div>
                    </div>

                    <SearchModal
                        isOpen={isSearchOpen}
                        onClose={() => setIsSearchOpen(false)}
                        storeId={store?.id || ''}
                    />
                </header>

                <main className="flex-1 overflow-y-auto bg-slate-50/30 p-4 lg:p-10 pt-6 no-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

function SidebarNav({ pathname, unreadCount, isCollapsed = false, setIsMobileMenuOpen }: { pathname: string; unreadCount: number; isCollapsed?: boolean; setIsMobileMenuOpen?: (open: boolean) => void }) {
    const handleLinkClick = () => {
        if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
    };

    return (
        <div className="space-y-3">
            <div>
                {!isCollapsed && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">General</p>}
                <nav className="space-y-0.5">
                    <SidebarLink href="/dashboard/seller" icon="📊" label="Dashboard" active={pathname === '/dashboard/seller'} isCollapsed={isCollapsed} onClick={handleLinkClick} />
                    <SidebarLink href="/dashboard/seller/orders" icon="📦" label="Orders" active={pathname === '/dashboard/seller/orders'} isCollapsed={isCollapsed} onClick={handleLinkClick} />
                    <SidebarLink href="/dashboard/seller/products" icon="🏷️" label="Products" active={pathname === '/dashboard/seller/products'} isCollapsed={isCollapsed} onClick={handleLinkClick} />
                    <SidebarLink href="/dashboard/seller/inventory" icon="📦" label="Inventory" active={pathname === '/dashboard/seller/inventory'} isCollapsed={isCollapsed} onClick={handleLinkClick} />
                    <SidebarLink
                        href="/dashboard/seller/messages"
                        icon="💬"
                        label="Messages"
                        active={pathname === '/dashboard/seller/messages'}
                        isCollapsed={isCollapsed}
                        badge={unreadCount > 0 ? unreadCount : undefined}
                        onClick={handleLinkClick}
                    />
                    <SidebarLink href="/dashboard/seller/customers" icon="👥" label="Customers" active={pathname === '/dashboard/seller/customers'} isCollapsed={isCollapsed} onClick={handleLinkClick} />
                </nav>
            </div>

            {/* AI Section (Infused) */}
            <div>
                {!isCollapsed && <p className="text-[9px] font-bold text-primary/80 uppercase tracking-widest px-2 mb-1 flex items-center">
                    AI Engine <span className="ml-2 px-1 bg-primary/10 text-primary rounded-[4px] text-[7px]">ACTIVE</span>
                </p>}
                <nav className="space-y-0.5">
                    <SidebarLink href="/dashboard/seller/analytics" icon="📈" label="Store Analytics" active={pathname === '/dashboard/seller/analytics'} isCollapsed={isCollapsed} onClick={handleLinkClick} />
                </nav>
            </div>

            {/* Customization Section */}
            <div>
                {!isCollapsed && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Customization</p>}
                <nav className="space-y-0.5">
                    <SidebarLink href="/dashboard/seller/themes" icon="🎨" label="Themes" active={pathname.startsWith('/dashboard/seller/themes')} isCollapsed={isCollapsed} onClick={handleLinkClick} />
                </nav>
            </div>

            <div>
                {!isCollapsed && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Help & Settings</p>}
                <nav className="space-y-0.5">
                    <SidebarLink href="/dashboard/seller/payments" icon="💰" label="Payments" active={pathname === '/dashboard/seller/payments'} isCollapsed={isCollapsed} onClick={handleLinkClick} />
                    <SidebarLink href="/dashboard/seller/support" icon="🎧" label="Support" active={pathname === '/dashboard/seller/support'} isCollapsed={isCollapsed} onClick={handleLinkClick} />
                    <SidebarLink href="/dashboard/seller/settings" icon="⚙️" label="Settings" active={pathname === '/dashboard/seller/settings'} isCollapsed={isCollapsed} onClick={handleLinkClick} />
                </nav>
            </div>
        </div>
    );
}

function SidebarLink({ href, icon, label, active = false, isCollapsed = false, badge, onClick }: { href: string; icon: string; label: string; active?: boolean; isCollapsed?: boolean; badge?: number; onClick?: () => void }) {
    return (
        <Link
            href={href}
            title={isCollapsed ? label : undefined}
            onClick={onClick}
            className={`flex items-center p-2 rounded-xl transition-all group relative ${isCollapsed ? 'justify-center' : 'space-x-3'} ${active
                ? 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
        >
            <span className={`text-[1.1rem] shrink-0 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>{icon}</span>
            {!isCollapsed && <span className="text-[12.5px] font-bold truncate flex-1">{label}</span>}
            {!isCollapsed && badge && (
                <span className="bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm animate-in zoom-in duration-300">
                    {badge}
                </span>
            )}
            {isCollapsed && badge && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white" />
            )}
            {!isCollapsed && active && <div className="ml-auto w-1 h-3.5 bg-primary rounded-full shrink-0" />}
        </Link>
    );
}

function HeaderButton({ icon, badge = false, onClick }: { icon: string; badge?: boolean; onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center relative shadow-sm border border-slate-100 hover:bg-slate-50 transition-all group"
        >
            <span className="text-lg group-hover:scale-110 transition-transform">{icon}</span>
            {badge && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white" />
            )}
        </button>
    );
}
