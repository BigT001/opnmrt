'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export function LandingFooter() {
    return (
        <footer className="border-t border-border py-20 px-6 bg-background relative z-10 transition-colors duration-500">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
                <div className="md:col-span-2">
                    <div className="mb-8">
                        {/* Added SEO-friendly attributes to the Logo link */}
                        <Link
                            href="/"
                            aria-label="OPNMRT - Multi-Tenant AI Commerce Engine homepage"
                            title="OPNMRT - Home"
                            className="flex items-center space-x-2.5 group cursor-pointer"
                        >
                            <Logo size="md" />
                        </Link>
                    </div>
                    <p className="text-muted-foreground font-medium max-w-sm mb-10 leading-relaxed uppercase text-xs tracking-wide">
                        OPNMRT - Empowering the next generation of digital merchants with independent, sovereign stores and AI-powered intelligence. The leading commerce engine for scaling African brands globally.
                    </p>
                    {/* Added SEO-friendly attributes to the social links container */}
                    <div
                        aria-label="OPNMRT social media links"
                        title="Connect with OPNMRT"
                        className="flex space-x-6 text-muted-foreground"
                    >
                        <Link href="#" className="hover:text-emerald-500 transition-colors uppercase font-black text-[10px] tracking-widest">Twitter</Link>
                        <Link href="#" className="hover:text-emerald-500 transition-colors uppercase font-black text-[10px] tracking-widest">Discord</Link>
                        <Link href="#" className="hover:text-emerald-500 transition-colors uppercase font-black text-[10px] tracking-widest">Github</Link>
                    </div>
                </div>

                <div>
                    <h4 className="text-foreground font-black uppercase tracking-widest text-xs mb-8 underline decoration-emerald-500 decoration-2 underline-offset-4">Platform</h4>
                    <ul className="space-y-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        <li><Link href="/features" className="hover:text-emerald-500 transition-colors">Documentation</Link></li>
                        <li><Link href="#" className="hover:text-emerald-500 transition-colors">API Reference</Link></li>
                        <li><Link href="#" className="hover:text-emerald-500 transition-colors">Showcase</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-foreground font-black uppercase tracking-widest text-xs mb-8 underline decoration-emerald-500 decoration-2 underline-offset-4">Legal</h4>
                    <ul className="space-y-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        <li><Link href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</Link></li>
                        <li><Link href="#" className="hover:text-emerald-500 transition-colors">Cookie Policy</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-border flex flex-col md:row justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">
                <p>© 2026 OPNMRT ENGINE. BUILT FOR INDEPENDENCE.</p>
            </div>
        </footer>
    );
}
