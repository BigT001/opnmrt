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
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

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

    // Auto-expand sidebar by default on most pages
    useEffect(() => {
        if (pathname === '/dashboard/seller/analytics') {
            setIsCollapsed(true);
        } else {
            setIsCollapsed(false);
        }
    }, [pathname]);

    // Header States
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
    const [notifications, setNotifications] = React.useState<any[]>([]);

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
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen((open) => !open);
            }
        }
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [store?.id]);

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
        if (!token) {
            setLoading(false);
            router.push('/login');
            return;
        }
        if (user && store) {
            setLoading(false);
            return;
        }
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
            <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sycing Workspace...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="h-screen bg-white flex overflow-hidden font-sans relative">
            <AnimatePresence>
                <NotificationDropdown
                    storeId={store?.id || ''}
                    isOpen={isNotificationsOpen}
                    onClose={() => setIsNotificationsOpen(false)}
                />
            </AnimatePresence>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-white z-[210] lg:hidden shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-50 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 text-slate-900">
                                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black overflow-hidden shadow-lg shadow-emerald-100">
                                            O
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black tracking-tight leading-none uppercase">OpenMart</span>
                                            <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                                Merchant Console
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400"
                                    >
                                        <span className="text-xl">✕</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
                                <SidebarNav pathname={pathname} unreadCount={unreadCount} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                            </div>

                            <div className="mt-auto border-t border-slate-50 p-4 space-y-4 bg-slate-50/50">
                                <SubscriptionCard store={store} />
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 p-3 rounded-2xl text-rose-500 bg-rose-50 hover:bg-rose-100 transition-all font-bold text-sm"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sign Out</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
            {/* Sidebar (Desktop) */}
            <aside
                className={`bg-white border-r border-slate-100 hidden lg:flex flex-col shrink-0 transition-all duration-300 ease-in-out relative group/sidebar ${isCollapsed ? 'w-20' : 'w-48'}`}
            >
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg shadow-emerald-200">
                            O
                        </div>
                        {!isCollapsed && <span className="text-sm font-black text-slate-900 tracking-tighter uppercase whitespace-nowrap">OPNMRT</span>}
                    </div>
                </div>

                <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar py-2">
                    <div className="px-3">
                        <SidebarNav pathname={pathname} unreadCount={unreadCount} isCollapsed={isCollapsed} />
                    </div>

                    <div className="mt-auto flex flex-col">
                        {!isCollapsed && (
                            <div className="px-4 mb-3">
                                <SubscriptionCard store={store} />
                            </div>
                        )}
                        <div className="p-4 border-t border-slate-100">
                            <button
                                onClick={handleLogout}
                                className={`w-full flex items-center gap-3 p-2 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all group ${isCollapsed ? 'justify-center' : ''}`}
                            >
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:bg-rose-100 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </div>
                                {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest text-left">Sign Out</span>}
                            </button>
                        </div>
                    </div>
                </div>

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

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {pathname === '/dashboard/seller' ? (
                    <DashboardHeader
                        store={store}
                        user={user}
                        notificationsCount={notifications.length}
                        onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
                        onNotificationsClick={() => setIsNotificationsOpen(true)}
                        onSearchClick={() => setIsSearchOpen(true)}
                    />
                ) : (
                    /* Sub-page header for mobile */
                    <header className="lg:hidden h-16 bg-white/80 backdrop-blur-md border-b border-slate-50 flex items-center justify-between px-6 sticky top-0 z-[100]">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-xl text-slate-600 transition-all border border-slate-100 active:scale-95"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter">
                                {pathname.split('/').pop()?.replace(/-/g, ' ')}
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsNotificationsOpen(true)} className="w-10 h-10 bg-white border border-slate-100 flex items-center justify-center rounded-xl relative shadow-sm">
                                <span className="text-base">🔔</span>
                                {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />}
                            </button>
                        </div>
                    </header>
                )}

                <SearchModal
                    isOpen={isSearchOpen}
                    onClose={() => setIsSearchOpen(false)}
                    storeId={store?.id || ''}
                />

                <main className="flex-1 overflow-y-auto bg-slate-50/20 no-scrollbar">
                    <div className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-10">
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
        <div className="space-y-0.5">
            <nav className="space-y-0.25">
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

            <div className="my-0.5 border-t border-slate-900/5 mx-2" />

            <nav className="space-y-0.25">
                <SidebarLink
                    href="/dashboard/seller/analytics"
                    icon="📈"
                    label="Store Analytics"
                    active={pathname === '/dashboard/seller/analytics'}
                    isCollapsed={isCollapsed}
                    onClick={handleLinkClick}
                    status="ACTIVE"
                />
            </nav>

            <div className="my-0.5 border-t border-slate-900/5 mx-2" />

            <nav className="space-y-0.25">
                <SidebarLink href="/dashboard/seller/themes" icon="🎨" label="Themes" active={pathname.startsWith('/dashboard/seller/themes')} isCollapsed={isCollapsed} onClick={handleLinkClick} />
            </nav>

            <div className="my-0.5 border-t border-slate-900/5 mx-2" />

            <nav className="space-y-0.25">
                <SidebarLink href="/dashboard/seller/support" icon="🎧" label="Support" active={pathname === '/dashboard/seller/support'} isCollapsed={isCollapsed} onClick={handleLinkClick} />
                <SidebarLink href="/dashboard/seller/settings" icon="⚙️" label="Settings" active={pathname.startsWith('/dashboard/seller/settings')} isCollapsed={isCollapsed} onClick={handleLinkClick} />
            </nav>
        </div>
    );
}

function SidebarLink({ href, icon, label, active = false, isCollapsed = false, badge, status, onClick }: { href: string; icon: string; label: string; active?: boolean; isCollapsed?: boolean; badge?: number; status?: string; onClick?: () => void }) {
    return (
        <Link
            href={href}
            title={isCollapsed ? label : undefined}
            onClick={onClick}
            className={`flex items-center px-2 py-0.5 rounded-lg transition-all group relative duration-200 ${isCollapsed ? 'justify-center' : 'space-x-2.5'} ${active
                ? 'text-emerald-600'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
        >
            <span className={`text-[1.05rem] shrink-0 transition-transform ${active ? 'opacity-100 scale-110' : 'opacity-60 group-hover:opacity-100'}`}>{icon}</span>
            {!isCollapsed && <span className={`text-[11px] font-bold truncate flex-1 tracking-tight transition-all ${active ? 'font-black scale-[1.02]' : ''}`}>{label}</span>}
            {!isCollapsed && status && (
                <span className={`px-1 rounded-[4px] text-[7px] font-black mr-1 ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-primary/10 text-primary'}`}>
                    {status}
                </span>
            )}
            {!isCollapsed && badge && (
                <span className="bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                    {badge}
                </span>
            )}
            {isCollapsed && (badge || status) && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-600 rounded-full ring-2 ring-white" />
            )}
            {!isCollapsed && active && <div className="absolute left-0 w-1 h-3 bg-emerald-600 rounded-r-full" />}
        </Link>
    );
}

function SubscriptionCard({ store }: { store: any }) {
    // Logic for plan and expiry
    const isPro = store?.plan === 'pro';
    const expiryDate = store?.subscriptionExpiry ? new Date(store.subscriptionExpiry) : null;
    const daysLeft = expiryDate ? Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
    const isExpiringSoon = daysLeft !== null && daysLeft <= 7;

    if (isPro && !isExpiringSoon) {
        return (
            <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 relative overflow-hidden group shadow-sm">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-emerald-500/10 rounded-lg flex items-center justify-center text-xs shrink-0">
                        ✨
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-[9px] truncate uppercase tracking-tight">Pro Active</h4>
                        <p className="text-[7px] text-slate-400 truncate mt-0.5 font-medium">All features unlocked</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-xl p-3 border relative overflow-hidden group shadow-sm transition-all ${isExpiringSoon ? 'bg-rose-50 border-rose-200' : 'bg-primary/5 border-primary/20'}`}>
            <div className="flex items-start gap-2.5 relative z-10">
                <div className={`w-7 h-7 rounded-lg shadow-sm flex items-center justify-center text-xs shrink-0 ring-1 ${isExpiringSoon ? 'bg-white ring-rose-100' : 'bg-white ring-primary/10'}`}>
                    {isExpiringSoon ? '📅' : '🚀'}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className={`font-black text-[10px] truncate uppercase tracking-tight ${isExpiringSoon ? 'text-rose-900' : 'text-slate-900'}`}>
                        {isExpiringSoon ? 'Renew Subscription' : (isPro ? 'Pro Member' : 'Upgrade to Pro')}
                    </h4>
                    <p className={`text-[8px] leading-tight mt-0.5 font-bold ${isExpiringSoon ? 'text-rose-600' : 'text-slate-500'}`}>
                        {isExpiringSoon
                            ? `Expires in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}`
                            : 'Scale your business with AI-driven insights.'}
                    </p>
                    <button className={`mt-2 w-full py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all shadow-sm ${isExpiringSoon ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-primary text-white hover:brightness-110'}`}>
                        {isExpiringSoon ? 'Renew Now' : 'Upgrade Plan'}
                    </button>
                </div>
            </div>

            {/* Background Accent */}
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-2xl opacity-20 ${isExpiringSoon ? 'bg-rose-500' : 'bg-primary'}`} />
        </div>
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
