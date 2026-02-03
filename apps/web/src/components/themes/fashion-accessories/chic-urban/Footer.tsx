'use client';

import React, { useState, useEffect } from 'react';
import { FooterProps } from '../../types';
import { Zap, Activity, Shield, Cpu } from 'lucide-react';

export function ChicUrbanFooter({ storeName }: FooterProps) {
    const [mounted, setMounted] = useState(false);
    const [terminalId, setTerminalId] = useState('');

    useEffect(() => {
        setMounted(true);
        setTerminalId(Math.random().toString(36).substring(7).toUpperCase());
    }, []);

    return (
        <footer className="bg-black text-white pt-24 pb-12 border-t-[12px] border-[#CCFF00] overflow-hidden">
            <div className="max-w-[1800px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-20 border-b border-white/10">
                    {/* Brand Identity */}
                    <div className="space-y-8 lg:col-span-2">
                        <div className="space-y-4">
                            <h3 className="text-8xl font-black uppercase italic tracking-tighter leading-none text-[#CCFF00]">
                                {storeName}
                            </h3>
                            <p className="text-2xl font-black uppercase italic tracking-tighter max-w-md">
                                High_Performance_Urban_Gear // Redefining the Concrete Jungle Ecosystem.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white text-black p-4 flex items-center justify-center border-2 border-white hover:bg-[#CCFF00] hover:border-[#CCFF00] transition-colors cursor-pointer">
                                <Zap className="w-8 h-8 fill-current" />
                            </div>
                            <div className="border-2 border-white p-4 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">
                                <Activity className="w-8 h-8" />
                            </div>
                        </div>
                    </div>

                    {/* Technical Links */}
                    <div className="space-y-6">
                        <h4 className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#CCFF00]">System_Nodes</h4>
                        <ul className="space-y-4 text-xl font-black uppercase italic tracking-tighter">
                            <li><a href="#" className="hover:text-[#CCFF00] transition-colors">[Archive_01]</a></li>
                            <li><a href="#" className="hover:text-[#CCFF00] transition-colors">[Connect_Link]</a></li>
                            <li><a href="#" className="hover:text-[#CCFF00] transition-colors">[Logistics_v2]</a></li>
                            <li><a href="#" className="hover:text-[#CCFF00] transition-colors">[Terms_of_Use]</a></li>
                        </ul>
                    </div>

                    {/* Operational Metadata */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h4 className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#CCFF00]">Status: Online</h4>
                            <div className="space-y-2 font-mono text-[10px] uppercase font-bold text-white/40">
                                <p className="flex justify-between"><span>Core_Engine:</span> <span>v6.2.0_STABLE</span></p>
                                <p className="flex justify-between"><span>Encryption:</span> <span>256bit_AES_SSL</span></p>
                                <p className="flex justify-between"><span>Server_Loc:</span> <span>Global_Edge_Nodes</span></p>
                                <p className="flex justify-between"><span>Uptime:</span> <span>99.98%_OPERATIONAL</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-4 border border-white/10">
                            <Shield className="w-6 h-6 text-[#CCFF00]" />
                            <div className="font-mono text-[9px] font-black uppercase tracking-widest leading-tight">
                                Secured by OPNMRT OS<br />
                                <span className="text-white/40">Protected Environment</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Footer Row */}
                <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <Cpu className="w-6 h-6 text-white/20" />
                        <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                            © {mounted ? new Date().getFullYear() : ''} {storeName} // TERMINAL_ID: {terminalId}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#CCFF00] animate-pulse">
                            System_Status: Optimal // No_Errors_Detected
                        </p>
                    </div>
                </div>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute bottom-0 right-0 pointer-events-none opacity-5 translate-y-1/2">
                <span className="text-[20rem] font-black italic tracking-tighter uppercase leading-none">
                    CHIC_URBAN
                </span>
            </div>
        </footer>
    );
}

