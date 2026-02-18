'use client';

import React from 'react';
import { FooterProps } from '../types';

export function AppifyFooter({ storeName }: FooterProps) {
    return (
        <footer className="bg-white border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-[18px] font-black text-[#1a1a2e] tracking-tight uppercase">{storeName}</h3>
                        <p className="text-[12px] text-gray-500 mt-2 max-w-xs uppercase font-bold tracking-widest">
                            Premium Shopping Experience
                        </p>
                    </div>

                    <div className="flex gap-8 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">
                        <a href="#" className="hover:text-[#1a1a2e] transition-colors">Privacy</a>
                        <a href="#" className="hover:text-[#1a1a2e] transition-colors">Terms</a>
                        <a href="#" className="hover:text-[#1a1a2e] transition-colors">Careers</a>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-50 text-center">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} {storeName} • Built with OPNMRT
                    </p>
                </div>
            </div>
        </footer>
    );
}
