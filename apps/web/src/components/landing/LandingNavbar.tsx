'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon, ArrowRight, Sparkles, Zap, Shield, Bike } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';

export function LandingNavbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const isActive = (path: string) => pathname === path;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const navLinks = [
        { name: 'Intelligence', path: '/features', icon: <Sparkles className="w-5 h-5" />, badge: 'Live' },
        { name: 'Logistics Hub', path: '/riders', icon: <Bike className="w-5 h-5" />, badge: 'New' },
        { name: 'Tiers', path: '/pricing', icon: <Zap className="w-5 h-5" /> },
        { name: 'Ecosystem', path: '/about', icon: <Shield className="w-5 h-5" /> },
    ];

    const isHomePage = pathname === '/';
    const showBackground = scrolled || !isHomePage;

    return (
        <>
            {/* ─── Desktop & Mobile Top Bar ─── */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${showBackground
                    ? 'h-16 bg-background/90 backdrop-blur-xl border-b border-border shadow-lg'
                    : 'h-20 bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/">
                        <Logo size="md" />
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`group relative text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 ${isActive(link.path) ? 'text-emerald-500' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <span>{link.name}</span>
                                <span
                                    className={`absolute -bottom-2 left-0 h-0.5 bg-emerald-500 transition-all duration-300 ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                                        }`}
                                />
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeToggle />
                        <Link
                            href="/login"
                            className="text-xs font-black uppercase tracking-[0.2em] px-4 py-2 text-muted-foreground hover:text-foreground transition-all"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="group relative px-6 py-3 bg-emerald-500 text-[#030712] rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
                        >
                            <span className="relative z-10">Launch Store</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        </Link>
                    </div>

                    {/* Mobile: Theme toggle only in top bar */}
                    <div className="flex md:hidden items-center">
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            {/* ─── Mobile Bottom Pill Nav Bar ─── */}
            <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center md:hidden px-4">
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.5 }}
                    className="flex items-center gap-2 px-4 py-3 bg-background/95 backdrop-blur-2xl border border-border rounded-[2rem] shadow-2xl"
                >
                    {/* Nav items */}
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            className={`relative flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all active:scale-90 ${isActive(link.path)
                                ? 'bg-emerald-500 text-white'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                        >
                            {link.icon}
                            <span className="text-[9px] font-black uppercase tracking-widest mt-1">{link.name}</span>
                            {link.badge && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-background" />
                            )}
                        </Link>
                    ))}

                    <div className="w-px h-8 bg-border mx-1" />

                    {/* Menu button with animated hamburger */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className={`relative flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all active:scale-90 ${isMenuOpen
                            ? 'text-emerald-500'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                            }`}
                    >
                        <AnimatedHamburger isOpen={isMenuOpen} />
                        <span className="text-[9px] font-black uppercase tracking-widest mt-1">Menu</span>
                    </button>
                </motion.div>
            </div>

            {/* ─── Mobile Full-Screen Drawer (renders OUTSIDE nav stacking context) ─── */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Scrim */}
                        <motion.div
                            key="scrim"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                            style={{ zIndex: 9998 }}
                        />

                        {/* Drawer panel slides up from bottom */}
                        <motion.div
                            key="drawer"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 rounded-t-[2.5rem] overflow-hidden"
                            style={{ zIndex: 9999 }}
                        >
                            {/* Solid base */}
                            <div className="absolute inset-0 bg-[#030712]" />
                            {/* Subtle glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-40 bg-emerald-500/5 blur-[80px] rounded-full" />

                            <div className="relative z-10 pt-4 pb-10 px-6">
                                {/* Drag handle */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-10 h-1 bg-white/20 rounded-full" />
                                </div>

                                {/* Header row */}
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">OPNMRT</p>
                                        <p className="text-xl font-black tracking-tight">Commerce Engine</p>
                                    </div>
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/70 active:scale-90 transition-transform"
                                    >
                                        <AnimatedHamburger isOpen={true} />
                                    </button>
                                </div>

                                {/* Nav Links */}
                                <div className="space-y-3 mb-10">
                                    {navLinks.map((link, i) => (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, x: -16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * i }}
                                        >
                                            <Link
                                                href={link.path}
                                                className={`flex items-center justify-between px-5 py-5 rounded-2xl transition-all active:scale-[0.98] ${isActive(link.path)
                                                    ? 'bg-emerald-500 text-[#030712]'
                                                    : 'bg-white/5 border border-white/5 text-foreground'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className={`p-3 rounded-xl ${isActive(link.path) ? 'bg-[#030712]/20' : 'bg-white/5'}`}>
                                                        {link.icon}
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-black uppercase tracking-tight">{link.name}</p>
                                                        {link.badge && (
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isActive(link.path) ? 'bg-[#030712]' : 'bg-emerald-500'}`} />
                                                                <span className={`text-[9px] font-black uppercase tracking-widest ${isActive(link.path) ? 'text-[#030712]/70' : 'text-emerald-500'}`}>
                                                                    V1.0 Engine Live
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <ArrowRight className={`w-4 h-4 opacity-50 ${isActive(link.path) ? 'text-[#030712]' : ''}`} />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* CTA Buttons */}
                                <div className="space-y-3">
                                    <Link
                                        href="/register"
                                        className="flex items-center justify-center w-full py-5 bg-emerald-500 text-[#030712] rounded-2xl text-sm font-black uppercase tracking-[0.15em] shadow-xl shadow-emerald-500/30 active:scale-[0.98] transition-all group"
                                    >
                                        Launch Store
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="flex items-center justify-center w-full py-5 bg-white/5 border border-white/10 text-foreground rounded-2xl text-sm font-black uppercase tracking-[0.15em] active:scale-[0.98] transition-all"
                                    >
                                        Merchant Login
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

function AnimatedHamburger({ isOpen }: { isOpen: boolean }) {
    const topVariants = {
        open: { rotate: 45, y: 6 },
        closed: { rotate: 0, y: 0 },
    };
    const middleVariants = {
        open: { opacity: 0, scaleX: 0 },
        closed: { opacity: 1, scaleX: 1 },
    };
    const bottomVariants = {
        open: { rotate: -45, y: -6 },
        closed: { rotate: 0, y: 0 },
    };
    const state = isOpen ? 'open' : 'closed';
    return (
        <div className="flex flex-col justify-center items-center gap-[4px] w-5 h-5">
            <motion.span
                animate={state}
                variants={topVariants}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="block h-[2px] w-5 bg-current rounded-full origin-center"
            />
            <motion.span
                animate={state}
                variants={middleVariants}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="block h-[2px] w-3.5 bg-current rounded-full self-start origin-left"
            />
            <motion.span
                animate={state}
                variants={bottomVariants}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="block h-[2px] w-5 bg-current rounded-full origin-center"
            />
        </div>
    );
}

function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    if (!mounted) return <div className="w-10 h-10" />;

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all overflow-hidden"
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                    <motion.div key="sun" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.15 }}>
                        <Sun className="w-4 h-4 text-amber-400" />
                    </motion.div>
                ) : (
                    <motion.div key="moon" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.15 }}>
                        <Moon className="w-4 h-4 text-slate-400" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
