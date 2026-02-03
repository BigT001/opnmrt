'use client';

import { FooterProps } from '../../types';
import { Sparkles, Instagram, Twitter, Facebook, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function RadiantGlowFooter({ storeName }: FooterProps) {
    return (
        <footer className="relative pt-32 pb-16 overflow-hidden bg-[#FFF9F0]">
            {/* Sunset Radial Glows */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-t from-[#C19A6B]/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -bottom-24 left-0 w-96 h-96 bg-[#E2AFA2]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 right-0 w-96 h-96 bg-[#C19A6B]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-[1400px] mx-auto px-10">
                <div className="flex flex-col items-center text-center mb-24 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <Sparkles className="w-8 h-8 text-[#C19A6B] fill-current opacity-40" />
                        <h2 className="text-7xl md:text-8xl font-luminous italic text-[#2D1E1E] leading-none">
                            Stay in the <span className="shimmer-text">light.</span>
                        </h2>
                        <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-[#2D1E1E]/40 font-black max-w-sm leading-relaxed">
                            A curation of luminosity for the modern soul. Join our radiant circle.
                        </p>

                        <div className="flex items-center gap-10 pt-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="text-[#2D1E1E]/20 hover:text-[#C19A6B] transition-colors duration-500">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 border-t border-[#C19A6B]/10 pt-16">
                    {/* Brand Manifesto */}
                    <div className="md:col-span-2 space-y-6">
                        <h3 className="text-3xl font-luminous text-[#2D1E1E] uppercase tracking-wider">{storeName}</h3>
                        <p className="font-sans text-sm text-[#2D1E1E]/60 max-w-md leading-relaxed">
                            We believe that true beauty is light itself—a radiance that originates from within and is captured through the lens of sophisticated botanical science.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-6">
                        <h4 className="font-sans text-[10px] uppercase tracking-[0.3em] font-black text-[#C19A6B]">Experience</h4>
                        <ul className="space-y-4">
                            {['Collections', 'Dermal Rituals', 'Sustainability', 'The Light Journal'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="font-sans text-[11px] font-bold text-[#2D1E1E]/60 hover:text-[#2D1E1E] transition-colors flex items-center gap-2 group">
                                        {link}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-6">
                        <h4 className="font-sans text-[10px] uppercase tracking-[0.3em] font-black text-[#C19A6B]">Inquiries</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 font-sans text-[11px] font-bold text-[#2D1E1E]/60">
                                <Mail className="w-4 h-4 text-[#C19A6B]/40" />
                                aura@{storeName.toLowerCase().replace(/\s/g, '')}.com
                            </li>
                            <li className="flex items-center gap-3 font-sans text-[11px] font-bold text-[#2D1E1E]/60">
                                <MapPin className="w-4 h-4 text-[#C19A6B]/40" />
                                Luminous Plaza, 7th Floor
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-32 pt-10 border-t border-[#C19A6B]/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#2D1E1E]/30 font-black">
                        © {new Date().getFullYear()} {storeName} — All rights reserved to the light.
                    </p>
                    <div className="flex items-center gap-8">
                        {['Terms', 'Privacy', 'Cookie Ritual'].map((item) => (
                            <a key={item} href="#" className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#2D1E1E]/30 hover:text-[#C19A6B] transition-colors">
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

