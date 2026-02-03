import { FooterProps } from '../../types';
import { Instagram, Twitter, Facebook, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function GlamourEveFooter({ storeName }: FooterProps) {
    return (
        <footer className="bg-black text-white pt-32 pb-16 border-t border-white/5">
            <div className="max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-10">

                    {/* Brand & Manifesto */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="space-y-6">
                            <h3 className="text-4xl font-serif italic tracking-tighter uppercase">{storeName}</h3>
                            <div className="h-[1px] w-20 bg-[#D4AF37]" />
                        </div>
                        <p className="text-white/40 text-sm font-light leading-relaxed max-w-sm uppercase tracking-widest text-[11px]">
                            Redefining the boundaries of modern luxury. Each piece in our collection is a testament to the pursuit of perfection and the celebration of the artisan's craft.
                        </p>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-10">
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">Maison</h4>
                            <ul className="space-y-4 text-[11px] uppercase tracking-[0.2em] font-medium text-white/60">
                                <li><Link href="#" className="hover:text-white transition-colors flex items-center gap-2">History <ArrowUpRight className="w-3 h-3" /></Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors flex items-center gap-2">Atelier <ArrowUpRight className="w-3 h-3" /></Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors flex items-center gap-2">Locations <ArrowUpRight className="w-3 h-3" /></Link></li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">Client Service</h4>
                            <ul className="space-y-4 text-[11px] uppercase tracking-[0.2em] font-medium text-white/60">
                                <li><Link href="#" className="hover:text-white transition-colors">Shipping</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Returns</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Authentication</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors px-3 py-1 border border-white/20 inline-block">Contact Concierge</Link></li>
                            </ul>
                        </div>
                        <div className="hidden md:block space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">Legal</h4>
                            <ul className="space-y-4 text-[11px] uppercase tracking-[0.2em] font-medium text-white/60">
                                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Terms of Use</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Cookies</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter/Social */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">Follow The Journey</h4>
                            <div className="flex gap-6 text-white/40">
                                <Link href="#" className="hover:text-[#D4AF37] transition-colors"><Instagram className="w-5 h-5" /></Link>
                                <Link href="#" className="hover:text-[#D4AF37] transition-colors"><Twitter className="w-5 h-5" /></Link>
                                <Link href="#" className="hover:text-[#D4AF37] transition-colors"><Facebook className="w-5 h-5" /></Link>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[9px] uppercase tracking-[0.3em] font-black text-white/30">Select Currency</p>
                            <span className="text-[11px] font-black border-b border-[#D4AF37] pb-1 uppercase tracking-widest">NGN - International</span>
                        </div>
                    </div>

                </div>

                <div className="mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.5em]">
                        © {new Date().getFullYear()} {storeName} Atelier. All Rights Reserved.
                    </p>
                    <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.5em]">
                        Crafted by <span className="text-white/40">OPNMRT</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}

