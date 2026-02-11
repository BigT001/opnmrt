'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, User, MessageCircle, LogOut, ChevronRight, Loader2, Menu, X } from 'lucide-react';
import api from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { AnimatePresence, motion } from 'framer-motion';

export default function CustomerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { subdomain } = useParams<{ subdomain: string }>();
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const socket = useSocket(user?.id);

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const isAuthPage = pathname.includes('/customer/login');

        if (!token && !isAuthPage) {
            router.push(`/store/${subdomain}/customer/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

        async function fetchUser() {
            try {
                const res = await api.get('/auth/me');
                setUser(res.data.user);

                // Fetch unread count
                const unreadRes = await api.get('/chat/unread-count');
                setUnreadCount(unreadRes.data.count);
            } catch (error: any) {
                console.error("Failed to fetch user:", error);
                if (error.response?.status === 401 && !isAuthPage) {
                    localStorage.removeItem('token');
                    router.push(`/store/${subdomain}/customer/login?redirect=${encodeURIComponent(pathname)}`);
                }
            } finally {
                setLoading(false);
            }
        }

        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [pathname, subdomain, router]);

    useEffect(() => {
        if (!socket) return;

        socket.on('newMessage', (message: any) => {
            if (message.senderRole === 'SELLER' && !pathname.includes('/customer/messages')) {
                setUnreadCount(prev => prev + 1);
            }
        });

        return () => {
            socket.off('newMessage');
        };
    }, [socket, pathname]);

    // Reset unread count when entering messages page
    useEffect(() => {
        if (pathname.includes('/customer/messages')) {
            setUnreadCount(0);
        }
    }, [pathname]);

    const navItems = [
        { icon: ShoppingBag, label: 'My Orders', href: `/store/${subdomain}/customer/orders` },
        { icon: MessageCircle, label: 'Messages', href: `/store/${subdomain}/customer/messages`, badge: unreadCount },
        { icon: User, label: 'Profile Settings', href: `/store/${subdomain}/customer/profile` },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push(`/store/${subdomain}`);
    };

    const isAuthPage = pathname.includes('/customer/login');

    if (loading && !isAuthPage) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
            </div>
        );
    }

    if (isAuthPage) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
                <main className="flex-grow flex items-center justify-center p-6">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-16 lg:pt-20">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 z-50 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xs uppercase overflow-hidden">
                        {user?.image ? (
                            <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.[0] || 'U'
                        )}
                    </div>
                    <span className="font-black text-slate-900 text-sm uppercase tracking-tight">Dashboard</span>
                </div>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="w-10 h-10 flex items-center justify-center text-slate-900 bg-slate-50 rounded-xl"
                >
                    {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10 py-6 lg:py-10 flex-grow relative">
                {/* Sidebar - Desktop */}
                <aside className="hidden lg:block lg:col-span-1 space-y-6 xl:pl-8">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm sticky top-28">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                                {user?.image ? (
                                    <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user?.name ? user.name.trim().split(/\s+/).map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '??'
                                )}
                            </div>
                            <div>
                                <h2 className="font-black text-slate-900 leading-tight">{user?.name || 'Customer'}</h2>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                                    ID: {user?.id ? `CUST-${user.id.slice(-6).toUpperCase()}` : `${subdomain.toUpperCase()}-USR`}
                                </p>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${isActive
                                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 relative">
                                            <item.icon className="w-5 h-5" />
                                            <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                                            {item.badge ? (
                                                <span className="absolute -top-1 -left-1 w-4 h-4 bg-emerald-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                                                    {item.badge}
                                                </span>
                                            ) : null}
                                        </div>
                                        <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-8 pt-8 border-t border-slate-50">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 p-4 w-full text-rose-500 hover:bg-rose-50 rounded-2xl transition-all text-left"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMenuOpen(false)}
                                className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z[60] pointer-events-auto"
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="lg:hidden fixed top-0 right-0 bottom-0 w-80 bg-white z-[70] shadow-2xl flex flex-col p-8"
                            >
                                <div className="flex justify-between items-center mb-10">
                                    <h2 className="text-xl font-black text-slate-900 uppercase">Account</h2>
                                    <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl">
                                        <X className="w-5 h-5 text-slate-900" />
                                    </button>
                                </div>

                                <nav className="space-y-4">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={`flex items-center justify-between p-5 rounded-3xl transition-all ${isActive
                                                    ? 'bg-slate-900 text-white shadow-xl'
                                                    : 'text-slate-500 bg-slate-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4 relative">
                                                    <item.icon className="w-6 h-6" />
                                                    <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
                                                    {item.badge ? (
                                                        <span className="absolute -top-1 -left-1 w-5 h-5 bg-emerald-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                                                            {item.badge}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </nav>

                                <div className="mt-auto">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-4 p-6 w-full text-rose-500 bg-rose-50 rounded-3xl font-black uppercase tracking-widest text-sm"
                                    >
                                        <LogOut className="w-6 h-6" />
                                        Logout
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <main className="lg:col-span-3">
                    {children}
                </main>
            </div>
        </div>
    );
}
