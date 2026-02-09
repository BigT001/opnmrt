'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function LandingNavbar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/20 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <span className="text-[#030712] font-black italic text-xl">O</span>
                    </div>
                    <span className="text-xl font-black tracking-tighter text-white">OPNMRT</span>
                </Link>

                <div className="hidden md:flex items-center space-x-10 text-sm font-bold uppercase tracking-widest text-slate-400">
                    <Link href="/features" className={`${isActive('/features') ? 'text-emerald-400' : 'hover:text-emerald-400'} transition-colors`}>Intelligence</Link>
                    <Link href="/pricing" className={`${isActive('/pricing') ? 'text-emerald-400' : 'hover:text-emerald-400'} transition-colors`}>Tiers</Link>
                    <Link href="/about" className={`${isActive('/about') ? 'text-emerald-400' : 'hover:text-emerald-400'} transition-colors`}>Ecosystem</Link>
                </div>

                <div className="flex items-center space-x-4">
                    <Link href="/login" className="text-sm font-bold uppercase tracking-widest px-6 py-2 hover:text-white transition-colors">Sign In</Link>
                    <Link href="/register" className="px-6 py-2.5 bg-emerald-500 text-[#030712] rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all active:scale-95">
                        Launch Store
                    </Link>
                </div>
            </div>
        </nav>
    );
}
