'use client';

import React from 'react';
import Link from 'next/link';
import { FooterProps } from '../types';

// Brand-colored social icons using SVG for accurate brand colors
function InstagramIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
            <defs>
                <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
                    <stop offset="0%" stopColor="#ffd879" />
                    <stop offset="20%" stopColor="#f9a133" />
                    <stop offset="40%" stopColor="#ee4950" />
                    <stop offset="65%" stopColor="#c9357e" />
                    <stop offset="100%" stopColor="#6a28b3" />
                </radialGradient>
            </defs>
            <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
            <path d="M12 7.5A4.5 4.5 0 1 0 12 16.5 4.5 4.5 0 0 0 12 7.5zm0 7.4A2.9 2.9 0 1 1 12 9.1a2.9 2.9 0 0 1 0 5.8zm5.6-7.6a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0z" fill="#fff" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
            <rect width="24" height="24" rx="6" fill="#000" />
            <path d="M13.14 11.12 18.4 5h-1.25l-4.57 5.12L8.78 5H5l5.52 7.82L5 19h1.25l4.83-5.42L14.78 19H18.6l-5.46-7.88zm-1.71 1.92-.56-.78-4.44-6.17H8.2l3.58 4.98.56.78 4.65 6.46h-1.77l-3.79-5.27z" fill="#fff" />
        </svg>
    );
}

function LinkedinIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
            <rect width="24" height="24" rx="6" fill="#0A66C2" />
            <path d="M7.5 9.5H5v9h2.5v-9zm-1.25-4a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9zm10.5 3.8c-1.3 0-2.2.6-2.75 1.3V9.5H11.5v9H14v-5c0-1.1.6-2 1.7-2 1.05 0 1.55.85 1.55 2v5H19.75v-5.2c0-2.9-1.6-4-3-4z" fill="#fff" />
        </svg>
    );
}

function TiktokIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
            <rect width="24" height="24" rx="6" fill="#010101" />
            <path d="M17.5 6.5a4.1 4.1 0 0 1-2.5-.85v7.6a4.5 4.5 0 1 1-4.5-4.5c.17 0 .34.01.5.03v2.52a2 2 0 1 0 1.5 1.95V5h2.5a4.1 4.1 0 0 0 2.5 1.5z" fill="#fff" />
        </svg>
    );
}

import { EditableText } from '../EditableContent';

export function DefaultFooter({
    storeName,
    subdomain,
    instagram,
    twitter,
    facebook,
    tiktok,
    isPreview,
    onConfigChange,
    themeConfig
}: FooterProps) {
    const base = subdomain ? `/store/${subdomain}` : '#';
    const year = new Date().getFullYear();
    const config = themeConfig || {};

    const handleSave = (key: string, value: string) => {
        onConfigChange?.({ [key]: value });
    };

    const navLinks = [
        { label: config.footerShopText || 'Shop', href: `${base}/shop`, key: 'footerShopText' },
        { label: config.footerAboutText || 'About', href: `${base}/about`, key: 'footerAboutText' },
        { label: config.footerPrivacyText || 'Privacy', href: `${base}/privacy`, key: 'footerPrivacyText' },
        { label: config.footerTermsText || 'Terms', href: `${base}/terms`, key: 'footerTermsText' },
    ];

    const socials = [
        { label: 'Instagram', name: 'instagram', handle: instagram, icon: <InstagramIcon /> },
        { label: 'X (Twitter)', name: 'twitter', handle: twitter, icon: <XIcon /> },
        { label: 'Facebook', name: 'facebook', handle: facebook, icon: <LinkedinIcon /> },
        { label: 'TikTok', name: 'tiktok', handle: tiktok, icon: <TiktokIcon /> },
    ].filter(s => s.handle);

    return (
        <footer className="bg-[#f9f9f9] border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

                    {/* Left — Brand + Socials */}
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <h3 className="text-lg font-black text-gray-900 tracking-tighter uppercase italic whitespace-nowrap">
                            {storeName}
                        </h3>
                        <div className="flex items-center gap-3 sm:border-l sm:border-gray-200 sm:pl-6">
                            {socials.map(({ label, name, handle, icon }) => (
                                <a
                                    key={label}
                                    href={handle ? (handle.startsWith('http') ? handle : `https://${name}.com/${handle.replace('@', '')}`) : '#'}
                                    aria-label={label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:-translate-y-1 hover:scale-110 transition-all duration-200"
                                >
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right — Nav links */}
                    <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                        {navLinks.map(({ label, href, key }) => (
                            <div
                                key={key}
                                className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] hover:text-gray-900 transition-colors"
                            >
                                <EditableText
                                    value={label}
                                    onSave={val => handleSave(key, val)}
                                    isPreview={isPreview}
                                    label={`${label} Label`}
                                />
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Bottom bar */}
                <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.25em]">
                        <EditableText
                            value={config.footerCopyrightText || `© ${year} ${storeName} · All Rights Reserved`}
                            onSave={val => handleSave('footerCopyrightText', val)}
                            isPreview={isPreview}
                            label="Copyright Text"
                        />
                    </p>
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.25em]">
                        <EditableText
                            value={config.footerPoweredByText || "Powered by OPNMRT"}
                            onSave={val => handleSave('footerPoweredByText', val)}
                            isPreview={isPreview}
                            label="Powered By Text"
                        />
                    </p>
                </div>
            </div>
        </footer>
    );
}
