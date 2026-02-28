'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function LandingNavbar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <span className="text-white dark:text-[#030712] font-black italic text-xl">O</span>
                    </div>
                    <span className="text-xl font-black tracking-tighter text-foreground">OPNMRT</span>
                </Link>

                <div className="hidden md:flex items-center space-x-10 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    <Link href="/features" className={`${isActive('/features') ? 'text-emerald-500' : 'hover:text-emerald-500'} transition-colors`}>Intelligence</Link>
                    <Link href="/pricing" className={`${isActive('/pricing') ? 'text-emerald-400' : 'hover:text-emerald-400'} transition-colors`}>Tiers</Link>
                    <Link href="/about" className={`${isActive('/about') ? 'text-emerald-400' : 'hover:text-emerald-400'} transition-colors`}>Ecosystem</Link>
                </div>

                <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    <Link href="/login" className="text-sm font-bold uppercase tracking-widest px-6 py-2 hover:text-white transition-colors">Sign In</Link>
                    <Link href="/register" className="px-6 py-2.5 bg-emerald-500 text-[#030712] rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all active:scale-95">
                        Launch Store
                    </Link>
                </div>
            </div>
        </nav>
    );
}

function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="w-10 h-10" />;

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
            ) : (
                <Moon className="w-5 h-5 text-slate-400" />
            )}
        </button>
    );
}
