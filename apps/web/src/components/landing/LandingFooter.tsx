'use client';

import React from 'react';
import Link from 'next/link';

export function LandingFooter() {
    return (
        <footer className="border-t border-white/5 py-20 px-6 bg-[#020617] relative z-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
                <div className="md:col-span-2">
                    <div className="flex items-center space-x-2 mb-8">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <span className="text-[#030712] font-black italic">O</span>
                        </div>
                        <span className="text-lg font-black tracking-tighter text-white uppercase">OPNMRT</span>
                    </div>
                    <p className="text-slate-500 font-medium max-w-sm mb-10 leading-relaxed">
                        Empowering the next generation of digital merchants with enterprise-grade multi-tenancy and AI intelligence.
                    </p>
                    <div className="flex space-x-6 text-slate-500">
                        <Link href="#" className="hover:text-emerald-400 transition-colors uppercase font-black text-[10px] tracking-widest">Twitter</Link>
                        <Link href="#" className="hover:text-emerald-400 transition-colors uppercase font-black text-[10px] tracking-widest">Discord</Link>
                        <Link href="#" className="hover:text-emerald-400 transition-colors uppercase font-black text-[10px] tracking-widest">Github</Link>
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Platform</h4>
                    <ul className="space-y-4 text-sm font-bold text-slate-500">
                        <li><Link href="/features" className="hover:text-emerald-400 transition-colors">Documentation</Link></li>
                        <li><Link href="#" className="hover:text-emerald-400 transition-colors">API Reference</Link></li>
                        <li><Link href="#" className="hover:text-emerald-400 transition-colors">Showcase</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Legal</h4>
                    <ul className="space-y-4 text-sm font-bold text-slate-500">
                        <li><Link href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                        <li><Link href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:row justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                <p>© 2026 OPNMRT CORP. ALL RIGHTS RESERVED.</p>
            </div>
        </footer>
    );
}
