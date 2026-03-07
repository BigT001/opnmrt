'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { Truck, MapPin, DollarSign, Settings, LogOut, Navigation, Clock, Users } from 'lucide-react';

export default function DispatchLayout({
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

                if (userData.role !== 'DISPATCH' && userData.role !== 'ADMIN') {
                    router.push('/login');
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

        if (user && (user.role === 'DISPATCH' || user.role === 'ADMIN')) {
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
                Loading Dispatch Station...
            </div>
        );
    }

    if (!user || (user.role !== 'DISPATCH' && user.role !== 'ADMIN')) return null;

    return (
        <div className="h-screen bg-slate-950 flex overflow-hidden font-sans text-slate-200">
            {/* Sidebar */}
            <aside
                className={`bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 transition-all duration-300 ease-in-out relative group/sidebar ${isCollapsed ? 'w-24' : 'w-72'}`}
            >
                <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
                    <div className="p-5 pb-2">
                        <div className={`flex items-center space-x-3 text-white mb-12 overflow-hidden ${isCollapsed ? 'justify-center pr-0' : 'px-2'}`}>
                            {isCollapsed ? (
                                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center overflow-hidden">
                                    {user?.dispatchProfile?.logo ? (
                                        <img src={user.dispatchProfile.logo} className="w-full h-full object-cover" />
                                    ) : (
                                        <Truck className="w-5 h-5 text-white" />
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center overflow-hidden">
                                        {user?.dispatchProfile?.logo ? (
                                            <img src={user.dispatchProfile.logo} className="w-full h-full object-cover" />
                                        ) : (
                                            <Truck className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-black text-lg tracking-tighter leading-none text-white">OPNMRT</span>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Logistics Hub</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                {!isCollapsed && <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Dispatcher Operations</p>}
                                <nav className="space-y-1">
                                    <SidebarLink href="/dashboard/dispatch" icon={<Navigation size={20} />} label="Live Radar" active={pathname === '/dashboard/dispatch'} isCollapsed={isCollapsed} color="emerald" />
                                    <SidebarLink href="/dashboard/dispatch/deliveries" icon={<MapPin size={20} />} label="Active Runs" active={pathname === '/dashboard/dispatch/deliveries'} isCollapsed={isCollapsed} color="emerald" />
                                    <SidebarLink href="/dashboard/dispatch/history" icon={<Clock size={20} />} label="Run History" active={pathname === '/dashboard/dispatch/history'} isCollapsed={isCollapsed} color="emerald" />
                                    <SidebarLink href="/dashboard/dispatch/riders" icon={<Users size={20} />} label="Manage Fleet" active={pathname === '/dashboard/dispatch/riders'} isCollapsed={isCollapsed} color="emerald" />
                                    <SidebarLink href="/dashboard/dispatch/earnings" icon={<DollarSign size={20} />} label="Earnings & Ledger" active={pathname === '/dashboard/dispatch/earnings'} isCollapsed={isCollapsed} color="emerald" />
                                </nav>
                            </div>

                            <div>
                                {!isCollapsed && <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Company Configuration</p>}
                                <nav className="space-y-1">
                                    <SidebarLink href="/dashboard/dispatch/settings" icon={<Settings size={20} />} label="Company Profile" active={pathname === '/dashboard/dispatch/settings'} isCollapsed={isCollapsed} color="emerald" />
                                </nav>
                            </div>
                        </div>
                    </div>

                    {!isCollapsed && (
                        <div className="p-5 mt-auto space-y-4">
                            <div className="bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/10">
                                <p className="text-[10px] font-bold text-emerald-500/60 uppercase mb-2 tracking-widest">Fleet Status</p>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[11px] font-black uppercase text-slate-300 tracking-tight">System Online</span>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 p-3 rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20"
                            >
                                <LogOut size={20} />
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
                                <LogOut size={20} />
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
                <main className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-10 no-scrollbar text-slate-300">
                    <div className="max-w-[1800px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

function SidebarLink({ href, icon, label, active = false, isCollapsed = false, color = "emerald" }: { href: string; icon: React.ReactNode; label: string; active?: boolean; isCollapsed?: boolean; color?: "emerald" | "emerald" }) {

    const activeClassNames = color === "emerald"
        ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20"
        : "bg-emerald-500 text-[#030712] shadow-xl shadow-emerald-500/20";

    return (
        <Link
            href={href}
            className={`flex items-center p-3.5 rounded-[1.25rem] transition-all group ${isCollapsed ? 'justify-center' : 'space-x-4'} ${active
                ? activeClassNames
                : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
        >
            <span className={`shrink-0 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                {icon}
            </span>
            {!isCollapsed && <span className="text-[13px] font-black uppercase tracking-tight">{label}</span>}
            {!isCollapsed && active && (
                <div className={`ml-auto w-1 h-4 ${color === 'emerald' ? 'bg-white/40' : 'bg-[#030712]/40'} rounded-full shrink-0`} />
            )}
        </Link>
    );
}
