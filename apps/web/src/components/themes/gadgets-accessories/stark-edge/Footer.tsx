import React from 'react';
import { FooterProps } from '../../types';
import { Terminal, Cpu, ShieldCheck, Globe } from 'lucide-react';

export function StarkEdgeFooter({ storeName }: FooterProps) {
    return (
        <footer className="bg-[#080808] border-t border-[#333] pt-32 pb-16 font-tactical">
            <div className="max-w-[1400px] mx-auto px-10">
                <div className="grid lg:grid-cols-12 gap-16 mb-24">

                    {/* Brand Core */}
                    <div className="lg:col-span-6 space-y-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[#00F0FF]">
                                <Globe className="w-4 h-4" />
                                <span className="font-data text-[10px] uppercase tracking-[0.4em]">Global_Network_Entry</span>
                            </div>
                            <h2 className="text-8xl font-black text-white uppercase tracking-tighter leading-none italic">
                                {storeName}
                            </h2>
                        </div>

                        <div className="max-w-md space-y-6">
                            <p className="text-white/40 font-tactical text-lg leading-relaxed">
                                Defining the architectural standard for high-performance hardware and critical digital infrastructure.
                            </p>
                            <div className="flex gap-4">
                                {[Terminal, Cpu, ShieldCheck].map((Icon, idx) => (
                                    <div key={idx} className="w-12 h-12 border border-[#333] flex items-center justify-center text-white/20 hover:text-[#00F0FF] hover:border-[#00F0FF]/30 transition-all">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Architectures */}
                    <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-12">
                        {[
                            { title: "Directives", links: ["Hardware", "Software", "Cloud", "Support"] },
                            { title: "Governance", links: ["Privacy", "Standard", "Uptime", "Legal"] },
                            { title: "Terminal", links: ["Console", "Status", "API", "Docs"] }
                        ].map((col, idx) => (
                            <div key={idx} className="space-y-6">
                                <h3 className="font-data text-[10px] text-[#00F0FF] uppercase tracking-[0.3em] font-bold underline decoration-2 underline-offset-8 decoration-[#00F0FF]/20">
                                    {col.title}
                                </h3>
                                <ul className="space-y-3">
                                    {col.links.map((link, lidx) => (
                                        <li key={lidx}>
                                            <a href="#" className="font-tactical text-[11px] text-white/40 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group">
                                                <span className="w-0 h-[1px] bg-[#00F0FF] transition-all group-hover:w-3" />
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Status Bar */}
                <div className="border-t border-[#333] pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-8 font-data text-[8px] text-white/20 uppercase tracking-[0.4em]">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
                            <span>Hardware Node Optimal</span>
                        </div>
                        <span>Uptime: 99.9%</span>
                        <span>Node: Edge_01</span>
                    </div>

                    <div className="font-data text-[9px] text-white/40 uppercase tracking-widest bg-[#111] px-6 py-2 border border-[#333]">
                        &copy; {new Date().getFullYear()} {storeName} // PROPRIETARY_ENCRYPTION_ACTIVE
                    </div>
                </div>
            </div>
        </footer>
    );
}
