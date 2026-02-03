'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const { user, store, setUser, setStore, setLoading, isLoading } = useAuthStore();

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
        <div className="h-screen bg-slate-50 flex overflow-hidden font-sans">
            {/* Sidebar */}
            <aside
                className={`bg-white border-r border-slate-100 flex flex-col shrink-0 transition-all duration-300 ease-in-out relative group/sidebar ${isCollapsed ? 'w-24' : 'w-72'}`}
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

                        {/* Navigation Wrapper */}
                        <div className="space-y-3">
                            <div>
                                {!isCollapsed && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">General</p>}
                                <nav className="space-y-0.5">
                                    <SidebarLink href="/dashboard/seller" icon="📊" label="Dashboard" active={pathname === '/dashboard/seller'} isCollapsed={isCollapsed} />
                                    <SidebarLink href="/dashboard/seller/orders" icon="📦" label="Orders" active={pathname === '/dashboard/seller/orders'} isCollapsed={isCollapsed} />
                                    <SidebarLink href="/dashboard/seller/products" icon="🏷️" label="Products" active={pathname === '/dashboard/seller/products'} isCollapsed={isCollapsed} />
                                    <SidebarLink href="/dashboard/seller/inventory" icon="📦" label="Inventory" active={pathname === '/dashboard/seller/inventory'} isCollapsed={isCollapsed} />
                                    <SidebarLink href="/dashboard/seller/messages" icon="💬" label="Messages" active={pathname === '/dashboard/seller/messages'} isCollapsed={isCollapsed} />
                                    <SidebarLink href="/dashboard/seller/customers" icon="👥" label="Customers" active={pathname === '/dashboard/seller/customers'} isCollapsed={isCollapsed} />
                                </nav>
                            </div>

                            {/* AI Section (Infused) */}
                            <div>
                                {!isCollapsed && <p className="text-[9px] font-bold text-primary/80 uppercase tracking-widest px-2 mb-1 flex items-center">
                                    AI Engine <span className="ml-2 px-1 bg-primary/10 text-primary rounded-[4px] text-[7px]">ACTIVE</span>
                                </p>}
                                <nav className="space-y-0.5">
                                    <SidebarLink href="/dashboard/seller/analytics" icon="✨" label="AI Insights" active={pathname === '/dashboard/seller/analytics'} isCollapsed={isCollapsed} />
                                </nav>
                            </div>

                            {/* Customization Section */}
                            <div>
                                {!isCollapsed && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Customization</p>}
                                <nav className="space-y-0.5">
                                    <SidebarLink href="/dashboard/seller/themes" icon="🎨" label="Themes" active={pathname.startsWith('/dashboard/seller/themes')} isCollapsed={isCollapsed} />
                                </nav>
                            </div>

                            <div>
                                {!isCollapsed && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Help & Settings</p>}
                                <nav className="space-y-0.5">
                                    <SidebarLink href="/dashboard/seller/support" icon="🎧" label="Support" active={pathname === '/dashboard/seller/support'} isCollapsed={isCollapsed} />
                                    <SidebarLink href="/dashboard/seller/settings" icon="⚙️" label="Settings" active={pathname === '/dashboard/seller/settings'} isCollapsed={isCollapsed} />
                                </nav>
                            </div>
                        </div>
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
                <header className="h-20 bg-white/50 backdrop-blur-md flex items-center justify-between px-10 shrink-0 border-b border-slate-100/50">
                    <div className="flex items-center space-x-4 w-1/4">
                        <Link href="/" className="lg:hidden text-2xl font-bold text-primary mr-4">O</Link>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Good Morning,</span>
                            <span className="text-sm font-bold text-slate-900 mt-1">{user.name.split(' ')[0]}</span>
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

                    <div className="flex items-center justify-end space-x-4 w-1/4">
                        <div className="flex space-x-2">
                            <HeaderButton icon="🔍" />
                            <HeaderButton icon="🔔" badge />
                        </div>
                        <div className="h-8 w-px bg-slate-200 mx-2" />
                        <div className="flex items-center space-x-3 pl-2 group cursor-pointer">
                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-slate-600 font-bold overflow-hidden shadow-inner">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-slate-50/30 p-10 pt-6 no-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

function SidebarLink({ href, icon, label, active = false, isCollapsed = false }: { href: string; icon: string; label: string; active?: boolean; isCollapsed?: boolean }) {
    return (
        <Link
            href={href}
            title={isCollapsed ? label : undefined}
            className={`flex items-center p-2 rounded-xl transition-all group ${isCollapsed ? 'justify-center' : 'space-x-3'} ${active
                ? 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
        >
            <span className={`text-[1.1rem] shrink-0 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>{icon}</span>
            {!isCollapsed && <span className="text-[12.5px] font-bold truncate">{label}</span>}
            {!isCollapsed && active && <div className="ml-auto w-1 h-3.5 bg-primary rounded-full shrink-0" />}
        </Link>
    );
}

function HeaderButton({ icon, badge = false }: { icon: string; badge?: boolean }) {
    return (
        <button className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center relative shadow-sm border border-slate-100 hover:bg-slate-50 transition-all">
            <span className="text-lg">{icon}</span>
            {badge && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white" />
            )}
        </button>
    );
}
