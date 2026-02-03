'use client';

import { FooterProps } from '../../types';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, ShieldCheck, Activity } from 'lucide-react';
import Link from 'next/link';

export function TechSpecFooter({ storeName }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#111111] text-white pt-20 pb-10 font-data">
            <div className="max-w-[1400px] mx-auto px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-1">
                            <span className="text-3xl font-black text-white tracking-tighter uppercase italic flex items-center">
                                <span className="text-[#E72E46] border-2 border-[#E72E46] px-1 mr-1">T</span>
                                ECH
                            </span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mt-2">SPECIFIC</span>
                        </Link>
                        <p className="text-gray-500 text-xs uppercase leading-relaxed tracking-wider font-bold">
                            Deploying precise hardware solutions for the next generation of digital infrastructure.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <button key={i} className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center rounded-sm hover:bg-[#E72E46] hover:text-white transition-all text-gray-500">
                                    <Icon className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Information Links */}
                    <div className="space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white border-b-2 border-[#E72E46] pb-2 w-fit">Information</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Delivery Information', 'Privacy Policy', 'Terms & Conditions', 'Contact Us'].map((link) => (
                                <li key={link}>
                                    <Link href="#" className="text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#E72E46] transition-colors">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Channels */}
                    <div className="space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white border-b-2 border-[#E72E46] pb-2 w-fit">Support</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 text-gray-500">
                                <MapPin className="w-4 h-4 text-[#E72E46] flex-shrink-0" />
                                <span className="text-[11px] font-bold uppercase tracking-widest">Sector 7G, Silicon Valley, CA 94043</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-500">
                                <Phone className="w-4 h-4 text-[#E72E46] flex-shrink-0" />
                                <span className="text-[11px] font-bold uppercase tracking-widest">+1 (800) TECH-SPEC</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-500">
                                <Mail className="w-4 h-4 text-[#E72E46] flex-shrink-0" />
                                <span className="text-[11px] font-bold uppercase tracking-widest">ops@techspec.node</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white border-b-2 border-[#E72E46] pb-2 w-fit">Frequency Update</h4>
                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Join our broadcast list for technical updates.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="NODE_ID@CORE.NET"
                                className="bg-white/5 border border-white/10 px-4 py-3 text-[10px] font-mono outline-none focus:border-[#E72E46] flex-1 text-white"
                            />
                            <button className="bg-[#E72E46] text-white px-4 py-3 uppercase font-black text-[10px]">SUB</button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.4em] text-gray-600 italic">
                        <span>© {currentYear} {storeName} NODE. ALL RIGHTS RESERVED.</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                            <Activity className="w-3 h-3 text-green-500 animate-pulse" />
                            <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Network Optimal</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                            <ShieldCheck className="w-3 h-3 text-gray-500" />
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Encrypted Transmissions</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
