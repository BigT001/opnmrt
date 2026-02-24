'use client';

import React from 'react';
import { FooterProps } from '../types';
import { EditableText } from '../EditableContent';

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const TiktokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.88a8.28 8.28 0 0 0 4.76 1.5V6.93a4.84 4.84 0 0 1-1-.24z" />
    </svg>
);

export function AppifyFooter({ storeName, isPreview, onConfigChange }: FooterProps) {
    const handleSave = (key: string, value: string) => {
        onConfigChange?.({ [key]: value });
    };

    return (
        <footer className="bg-[#0a0a0a] text-white">
            <div className="max-w-[1400px] mx-auto px-8 md:px-16 pt-8 pb-28 md:pb-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-5">
                    {/* Brand & Powered By */}
                    <div className="flex items-center gap-6">
                        <h3 className="text-[14px] font-black text-white tracking-tight uppercase">
                            {storeName}
                        </h3>
                        <div className="h-4 w-px bg-white/10" />
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">
                            <EditableText
                                value="Powered by OpenMart"
                                onSave={(val) => { }} // Usually fixed but let user change if they want? 
                                isPreview={isPreview}
                                label="Credits"
                            />
                        </p>
                    </div>

                    {/* Social Media Icons */}
                    <div className="flex items-center gap-3">
                        <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                            <InstagramIcon />
                        </a>
                        <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                            <TwitterIcon />
                        </a>
                        <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                            <FacebookIcon />
                        </a>
                        <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                            <TiktokIcon />
                        </a>
                    </div>

                    {/* Links & Copyright */}
                    <div className="flex items-center gap-6">
                        <div className="flex gap-5 text-[10px] font-bold text-white/30 uppercase tracking-[0.1em]">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                        </div>
                        <div className="h-4 w-px bg-white/10" />
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.1em]">
                            &copy; {new Date().getFullYear()} {storeName}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
