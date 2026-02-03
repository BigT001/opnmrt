'use client';

import { FooterProps } from '../../types';
import { Leaf, Instagram, Twitter, Facebook, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function PureBotanicalFooter({ storeName }: FooterProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <footer className="relative bg-[#F9FAF8] pt-32 pb-12 overflow-hidden border-t border-[#7C9082]/10">
            {/* Background Organic Element */}
            <div className="absolute -bottom-24 -right-24 w-96 h-96 opacity-5 pointer-events-none">
                <Leaf className="w-full h-full fill-[#7C9082]" />
            </div>

            <div className="max-w-[1400px] mx-auto px-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

                    {/* Brand Philosophy */}
                    <div className="lg:col-span-5 space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-[#7C9082]">
                                <Leaf className="w-5 h-5 fill-current opacity-60" />
                                <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold">Pure Identity</span>
                            </div>
                            <h3 className="text-6xl font-serif text-[#1C2B21] tracking-tight italic">
                                {storeName}
                            </h3>
                        </div>
                        <p className="font-serif text-xl text-[#1C2B21]/60 leading-relaxed max-w-md">
                            "Cultivating equilibrium through nature's most potent formations. Every selection is a tribute to the botanical world."
                        </p>

                        <div className="flex gap-4">
                            {[Instagram, Twitter, Facebook].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="w-12 h-12 rounded-full border border-[#7C9082]/20 flex items-center justify-center text-[#1C2B21]/40 hover:bg-[#1C2B21] hover:text-white hover:border-[#1C2B21] transition-all duration-500"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                        <div className="space-y-8">
                            <h4 className="font-sans text-[10px] uppercase tracking-[0.3em] font-black text-[#1C2B21]">Curated</h4>
                            <ul className="space-y-4">
                                {['New Rituals', 'Face Alchemy', 'Body Resonance', 'Collections'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="font-serif text-lg text-[#1C2B21]/50 hover:text-[#7C9082] transition-colors flex items-center group">
                                            {item}
                                            <ArrowUpRight className="w-3 h-3 ml-2 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-8">
                            <h4 className="font-sans text-[10px] uppercase tracking-[0.3em] font-black text-[#1C2B21]">Ecosystem</h4>
                            <ul className="space-y-4">
                                {['Our Sanctuary', 'Sustainability', 'Ingredients', 'The Journal'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="font-serif text-lg text-[#1C2B21]/50 hover:text-[#7C9082] transition-colors">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-8 col-span-2 md:col-span-1">
                            <h4 className="font-sans text-[10px] uppercase tracking-[0.3em] font-black text-[#1C2B21]">Presence</h4>
                            <ul className="space-y-5">
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-[#7C9082] mt-1 shrink-0" />
                                    <span className="font-serif text-base text-[#1C2B21]/50 leading-relaxed">Botanical Lane 42, Green Haven, Earth</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-[#7C9082] shrink-0" />
                                    <a href="mailto:hello@botanical.com" className="font-serif text-base text-[#1C2B21]/50 hover:text-[#7C9082] transition-colors">rituals@botanical.com</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-32 pt-12 border-t border-[#7C9082]/10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#1C2B21]/30">
                        © {mounted ? new Date().getFullYear() : '2024'} {storeName} — A Sanctuary of Clean Beauty
                    </p>

                    <div className="flex items-center gap-8">
                        {['Privacy Ritual', 'Terms of Resonance', 'Accessibility'].map((item) => (
                            <a key={item} href="#" className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#1C2B21]/30 hover:text-[#1C2B21] transition-colors">
                                {item}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <Leaf className="w-3 h-3 text-[#7C9082]" />
                        <span className="font-sans text-[9px] uppercase tracking-[0.4em] font-bold text-[#7C9082]">OPNMRT Heritage</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

