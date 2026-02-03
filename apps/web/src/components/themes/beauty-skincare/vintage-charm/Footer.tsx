'use client';

import React, { useState, useEffect } from 'react';
import { FooterProps } from '../../types';
import { ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

export function VintageCharmFooter({ storeName }: FooterProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <footer className="relative bg-[#1B3022] text-[#F9F4EE] py-24 overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

            <div className="max-w-[1800px] mx-auto px-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
                    {/* Brand Story */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="space-y-2">
                            <span className="font-cursive text-4xl text-[#8B4513] block">Certified Purveyors</span>
                            <h3 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
                                {storeName}
                            </h3>
                        </div>
                        <p className="font-serif italic text-xl text-[#F9F4EE]/60 max-w-md leading-relaxed">
                            "Preserving the art of botanical alchemy since the dawn of our establishment. Each formula is a testament to timeless heritage."
                        </p>
                        <div className="flex gap-6 items-center pt-4">
                            <div className="w-16 h-16 rounded-full border border-[#F9F4EE]/20 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <span className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-30">Official Laboratory Seal // No. 942-B</span>
                        </div>
                    </div>

                    {/* Contact Elements */}
                    <div className="space-y-8">
                        <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] text-[#8B4513]">Correspondence</h4>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 group cursor-pointer">
                                <MapPin className="w-5 h-5 text-[#8B4513] shrink-0" />
                                <span className="font-serif italic text-lg text-[#F9F4EE]/80 group-hover:text-[#F9F4EE] transition-colors">Laboratory No. 12, Heritage District</span>
                            </div>
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <Phone className="w-5 h-5 text-[#8B4513] shrink-0" />
                                <span className="font-serif italic text-lg text-[#F9F4EE]/80 group-hover:text-[#F9F4EE] transition-colors">+1 (archival) 555-0124</span>
                            </div>
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <Mail className="w-5 h-5 text-[#8B4513] shrink-0" />
                                <span className="font-serif italic text-lg text-[#F9F4EE]/80 group-hover:text-[#F9F4EE] transition-colors">archives@{storeName.toLowerCase().replace(/\s/g, '')}.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation/Legal */}
                    <div className="space-y-8">
                        <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] text-[#8B4513]">The Archive</h4>
                        <ul className="space-y-4">
                            {['Formulations', 'Heritage Journal', 'Our Alchemists', 'Acquisition Terms'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="font-serif italic text-lg text-[#F9F4EE]/80 hover:text-[#F9F4EE] transition-colors block">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Sub-Footer */}
                <div className="mt-24 pt-10 border-t border-[#F9F4EE]/10 flex flex-col md:row items-center justify-between gap-8">
                    <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#F9F4EE]/30">
                        &copy; {mounted ? new Date().getFullYear() : ''} {storeName} // Heritage Preservation Society
                    </p>
                    <div className="flex gap-10">
                        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#F9F4EE]/30">Encryption_Standard_04</span>
                        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#F9F4EE]/30">Sustainably_Sourced_OK</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
