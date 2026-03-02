'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, MapPin, ExternalLink, ChevronDown, Menu, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
    store: any;
    user: any;
    notificationsCount: number;
    onMobileMenuToggle: () => void;
    onNotificationsClick: () => void;
    onSearchClick: () => void;
}

export function DashboardHeader({
    store,
    user,
    notificationsCount,
    onMobileMenuToggle,
    onNotificationsClick,
    onSearchClick
}: DashboardHeaderProps) {
    return (
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 sticky top-0 z-[100] backdrop-blur-xl bg-white/80">
            {/* Left Section: Sidebar Trigger & Separator */}
            <div className="flex items-center gap-6 h-full min-w-[120px]">
                <button
                    onClick={onMobileMenuToggle}
                    className="lg:hidden p-2 hover:bg-slate-50 rounded-xl text-slate-600 transition-all"
                >
                    <Menu size={20} />
                </button>

                {/* Vertical Separator that 'cuts into' the header */}
                <div className="hidden lg:block w-[1px] h-full bg-slate-100 -ml-6" />

                {/* Branch/Location Indicator */}
                <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <MapPin size={12} className="text-emerald-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Main Store</span>
                </div>
            </div>

            {/* Middle Section: Centered Search Input Area */}
            <div className="flex-1 flex justify-center px-4 max-w-2xl mx-auto">
                <div
                    onClick={onSearchClick}
                    className="w-full max-w-md bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 flex items-center gap-3 cursor-pointer group hover:bg-white hover:border-emerald-500/30 transition-all shadow-sm group"
                >
                    <Search size={16} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest select-none flex-1">
                        Find Products, Orders...
                    </span>
                    <div className="hidden sm:flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                        <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-black text-slate-500 shadow-sm">⌘</kbd>
                        <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-black text-slate-500 shadow-sm">K</kbd>
                    </div>
                </div>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-2 min-w-[300px] justify-end">
                <div className="hidden xl:flex items-center gap-2 mr-4">
                    <Link
                        href={store?.subdomain ? `https://${store.subdomain}.opnmrt.com` : '#'}
                        target="_blank"
                        className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-700/10 active:scale-95"
                    >
                        Visit Store
                    </Link>
                </div>

                <div className="h-6 w-[1px] bg-slate-100 ml-2 mr-4 hidden xl:block" />

                <button
                    onClick={onNotificationsClick}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all relative"
                >
                    <Bell size={18} />
                    {notificationsCount > 0 && (
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                    )}
                </button>

                <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden sm:block" />

                <Link
                    href={store?.subdomain ? `https://${store.subdomain}.opnmrt.com` : '#'}
                    target="_blank"
                    className="flex items-center gap-3 pl-2 group cursor-pointer hover:bg-slate-50 p-1.5 rounded-xl transition-all"
                >
                    <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs overflow-hidden shadow-md ring-2 ring-white transition-transform group-hover:scale-105">
                        {store?.logo ? (
                            <img src={store.logo} alt="" className="w-full h-full object-cover" />
                        ) : (
                            (store?.name?.[0] || user?.name?.[0] || 'S').toUpperCase()
                        )}
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-[11px] font-black text-slate-900 leading-none mb-0.5 group-hover:text-emerald-600 transition-colors flex items-center gap-1">
                            {store?.name || user?.name}
                            <ChevronDown size={10} className="text-slate-300" />
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Business Account</p>
                    </div>
                </Link>
            </div>
        </header>
    );
}
