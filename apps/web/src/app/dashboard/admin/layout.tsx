'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const { user, setUser, setLoading, isLoading } = useAuthStore();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await api.get('auth/me');
                const userData = response.data.user;

                if (userData.role !== 'ADMIN') {
                    router.push('/dashboard/seller');
                    return;
                }

                setUser(userData);
            } catch (err) {
                console.error('Auth check failed:', err);
                localStorage.removeItem('token');
                setUser(null);
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

        if (user && user.role === 'ADMIN') {
            setLoading(false);
            return;
        }

        fetchUser();
    }, [router, setUser, setLoading]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 font-bold text-white animate-pulse">
                Verifying Admin Session...
            </div>
        );
    }

    if (!user || user.role !== 'ADMIN') return null;

    return (
        <div className="h-screen bg-slate-950 flex overflow-hidden font-sans text-slate-200">
            {/* Sidebar */}
            <aside
                className={`bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 transition-all duration-300 ease-in-out relative group/sidebar ${isCollapsed ? 'w-24' : 'w-72'}`}
            >
                <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
                    <div className="p-5 pb-2">
                        <div className={`flex items-center space-x-3 text-white mb-8 overflow-hidden ${isCollapsed ? 'justify-center pr-0' : ''}`}>
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/20 shrink-0">
                                <span className="text-white text-xl font-black italic">A</span>
                            </div>
                            {!isCollapsed && (
                                <div className="flex flex-col">
                                    <span className="text-lg font-black tracking-tighter leading-none">OPNMRT</span>
                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Admin Central</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                {!isCollapsed && <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Management</p>}
                                <nav className="space-y-1">
                                    <SidebarLink href="/dashboard/admin" icon="🏢" label="Overview" active={pathname === '/dashboard/admin'} isCollapsed={isCollapsed} />
                                    <SidebarLink href="/dashboard/admin/sellers" icon="👨‍💼" label="Manage Sellers" active={pathname === '/dashboard/admin/sellers'} isCollapsed={isCollapsed} />
                                    <SidebarLink href="/dashboard/admin/buyers" icon="👥" label="Manage Buyers" active={pathname === '/dashboard/admin/buyers'} isCollapsed={isCollapsed} />
                                    <SidebarLink href="/dashboard/admin/orders" icon="📦" label="Global Orders" active={pathname === '/dashboard/admin/orders'} isCollapsed={isCollapsed} />
                                </nav>
                            </div>

                            <div>
                                {!isCollapsed && <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Finance</p>}
                                <nav className="space-y-1">
                                    <SidebarLink href="/dashboard/admin/payments" icon="💳" label="Payments & Tiers" active={pathname === '/dashboard/admin/payments'} isCollapsed={isCollapsed} />
                                </nav>
                            </div>

                            <div>
                                {!isCollapsed && <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">System</p>}
                                <nav className="space-y-1">
                                    <SidebarLink href="/dashboard/admin/settings" icon="⚙️" label="Platform Settings" active={pathname === '/dashboard/admin/settings'} isCollapsed={isCollapsed} />
                                </nav>
                            </div>
                        </div>
                    </div>

                    {!isCollapsed && (
                        <div className="p-5 mt-auto space-y-4">
                            <div className="bg-indigo-600/10 rounded-2xl p-4 border border-indigo-500/20">
                                <p className="text-[10px] font-bold text-indigo-400 uppercase mb-2">System Status</p>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-xs font-semibold text-slate-300">All Systems Nominal</span>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 p-3 rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20"
                            >
                                <span className="text-lg">🚪</span>
                                <span className="text-[13px] font-bold uppercase tracking-widest">Sign Out</span>
                            </button>
                        </div>
                    )}

                    {isCollapsed && (
                        <div className="p-4 mt-auto flex flex-col items-center">
                            <button
                                onClick={handleLogout}
                                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20"
                                title="Sign Out"
                            >
                                <span className="text-lg">🚪</span>
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-10 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center shadow-lg z-50 hover:bg-slate-700 transition-colors"
                >
                    <svg
                        className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <main className="flex-1 overflow-y-auto bg-slate-950 p-10 no-scrollbar text-slate-300">
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
            className={`flex items-center p-3 rounded-xl transition-all group ${isCollapsed ? 'justify-center' : 'space-x-3'} ${active
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20'
                : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
        >
            <span className={`text-lg shrink-0 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>{icon}</span>
            {!isCollapsed && <span className="text-[13px] font-bold truncate tracking-tight">{label}</span>}
            {!isCollapsed && active && (
                <div className="ml-auto w-1 h-3.5 bg-white/40 rounded-full shrink-0" />
            )}
        </Link>
    );
}
