'use client';

import { FooterProps } from '../../types';
import { Zap, Activity, Shield, Github, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

export function NeonStreamFooter({ storeName }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#050505] pt-24 pb-12 overflow-hidden border-t border-white/5 font-inter">
            {/* Ambient Background */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#BF00FF]/5 rounded-full blur-[120px] -mb-40" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16">
                    {/* Brand Node */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#00F5FF] flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(0,245,255,0.4)]">
                                <Zap className="w-5 h-5 text-black fill-current" />
                            </div>
                            <span className="text-xl font-black font-syne tracking-tighter uppercase italic text-white">{storeName}</span>
                        </Link>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                            Elite hardware stream for the digital architect. Deployed globally since 20XX.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Instagram, Github, Linkedin].map((Icon, i) => (
                                <button key={i} className="w-10 h-10 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#00F5FF] hover:border-[#00F5FF]/50 transition-all">
                                    <Icon className="w-4 h-4" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Nodes */}
                    <div>
                        <h4 className="text-[10px] font-black font-syne tracking-[0.4em] uppercase text-white mb-8 italic">Interface</h4>
                        <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-gray-500 italic">
                            {['HARDWARE', 'RESOURCES', 'MANIFEST', 'LOGS'].map(link => (
                                <li key={link}><Link href="#" className="hover:text-[#00F5FF] transition-colors">{link}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black font-syne tracking-[0.4em] uppercase text-white mb-8 italic">Transmission</h4>
                        <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-gray-500 italic">
                            {['ACQUISITION', 'LOGISTICS', 'WARRANTY', 'NODES'].map(link => (
                                <li key={link}><Link href="#" className="hover:text-[#BF00FF] transition-colors">{link}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Subscription Node */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black font-syne tracking-[0.4em] uppercase text-white italic">Neural_Feed</h4>
                        <div className="relative group">
                            <input
                                className="w-full bg-white/5 border border-white/10 p-4 pr-12 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#00F5FF] transition-all rounded-xl"
                                placeholder="NETWORK_ID@DOMAIN.NET"
                            />
                            <button className="absolute right-2 top-2 bottom-2 px-3 bg-[#00F5FF] text-black rounded-lg flex items-center justify-center hover:shadow-[0_0_10px_rgba(0,245,255,0.4)] transition-all">
                                <Activity className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* System Stats Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-6">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-[#00F5FF] rounded-full animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 italic">NETWORK_SYMMETRIC</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Shield className="w-3.5 h-3.5 text-[#BF00FF]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 italic">E2E_ENCRYPTED</span>
                        </div>
                    </div>

                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">
                        &copy; {currentYear} {storeName} // ALL_TRANSMISSIONS_RECORDED
                    </p>
                </div>
            </div>
        </footer>
    );
}
