'use client';

import React from 'react';
import { FooterProps } from '../types';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react';
import { EditableText } from '../EditableContent';

export function ElectshopFooter({
    storeName,
    subdomain,
    primaryColor,
    themeConfig,
    onConfigChange,
    isPreview,
    instagram,
    twitter,
    facebook,
    tiktok
}: FooterProps) {
    const effectivePrimaryColor = primaryColor || themeConfig?.primaryColor || '#2874f0';
    const config = themeConfig || {};

    const handleConfigSave = (newCfg: any) => {
        onConfigChange?.(newCfg);
    };

    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand & Newsletter */}
                    <div className="space-y-8">
                        <Link href="/" className="text-2xl font-black italic uppercase tracking-tighter" style={{ color: effectivePrimaryColor }}>
                            <EditableText
                                value={storeName || 'Electshop'}
                                onSave={(val: string) => handleConfigSave({ name: val })}
                                isPreview={isPreview}
                                label="Footer Store Name"
                            />
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                            <EditableText
                                value={config.footerNewsletterDescription || 'Join our newsletter and get $20 discount for your first order. Stay updated with the latest trends in tech.'}
                                onSave={(val: string) => handleConfigSave({ footerNewsletterDescription: val })}
                                isPreview={isPreview}
                                label="Newsletter Description"
                                multiline={true}
                            />
                        </p>
                        <form className="relative group">
                            <input
                                type="email"
                                placeholder="Your Email Address"
                                className="w-full h-14 pl-6 pr-16 bg-[#f8f9fa] border border-gray-100 rounded-xl text-xs font-bold outline-none transition-all focus:border-current"
                                style={{ focusWithin: { borderColor: effectivePrimaryColor } } as any}
                            />
                            <button
                                className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center text-white rounded-lg shadow-lg transition-all"
                                style={{ backgroundColor: effectivePrimaryColor, boxShadow: `0 10px 15px -3px ${effectivePrimaryColor}33` }}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">
                            <EditableText
                                value={config.footerQuickLinksTitle || 'Quick Links'}
                                onSave={(val: string) => handleConfigSave({ footerQuickLinksTitle: val })}
                                isPreview={isPreview}
                                label="Quick Links Title"
                            />
                        </h4>
                        <ul className="space-y-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <li><Link href="#" className="transition-colors hover:text-black" style={{ '--hover-color': effectivePrimaryColor } as React.CSSProperties}>Our Story</Link></li>
                            <li><Link href="#" className="transition-colors hover:text-black">Shop All</Link></li>
                            <li><Link href="#" className="transition-colors hover:text-black">Today's Deals</Link></li>
                            <li><Link href="#" className="transition-colors hover:text-black">Track Order</Link></li>
                            <li><Link href="#" className="transition-colors hover:text-black">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">
                            <EditableText
                                value={config.footerServiceTitle || 'Customer Service'}
                                onSave={(val: string) => handleConfigSave({ footerServiceTitle: val })}
                                isPreview={isPreview}
                                label="Service Title"
                            />
                        </h4>
                        <ul className="space-y-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <li><Link href="#" className="transition-colors hover:text-black">Privacy Policy</Link></li>
                            <li><Link href="#" className="transition-colors hover:text-black">Terms & Conditions</Link></li>
                            <li><Link href="#" className="transition-colors hover:text-black">Refund Policy</Link></li>
                            <li><Link href="#" className="transition-colors hover:text-black">Shipping Guide</Link></li>
                            <li><Link href="#" className="transition-colors hover:text-black">Help Center</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">
                            <EditableText
                                value={config.footerContactTitle || 'Get In Touch'}
                                onSave={(val: string) => handleConfigSave({ footerContactTitle: val })}
                                isPreview={isPreview}
                                label="Contact Title"
                            />
                        </h4>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${effectivePrimaryColor}1A` }}>
                                    <MapPin className="w-5 h-5" style={{ color: effectivePrimaryColor }} />
                                </div>
                                <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-widest">
                                    <EditableText
                                        value={config.footerAddress || 'Oxford St, London\nW1D 1BS, United Kingdom'}
                                        onSave={(val: string) => handleConfigSave({ footerAddress: val })}
                                        isPreview={isPreview}
                                        label="Footer Address"
                                        multiline={true}
                                    />
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${effectivePrimaryColor}1A` }}>
                                    <Phone className="w-5 h-5" style={{ color: effectivePrimaryColor }} />
                                </div>
                                <p className="text-xs font-bold text-gray-900">
                                    <EditableText
                                        value={config.footerPhone || '+234 800 123 4567'}
                                        onSave={(val: string) => handleConfigSave({ footerPhone: val })}
                                        isPreview={isPreview}
                                        label="Footer Phone"
                                    />
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${effectivePrimaryColor}1A` }}>
                                    <Mail className="w-5 h-5" style={{ color: effectivePrimaryColor }} />
                                </div>
                                <p className="text-xs font-bold text-gray-900">
                                    <EditableText
                                        value={config.footerEmail || 'support@electshop.com'}
                                        onSave={(val: string) => handleConfigSave({ footerEmail: val })}
                                        isPreview={isPreview}
                                        label="Footer Email"
                                    />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        <EditableText
                            value={config.footerCopyright || `© 2024 ${storeName || 'Electshop'}. All Rights Reserved. Powered by OPNMRT.`}
                            onSave={(val: string) => handleConfigSave({ footerCopyright: val })}
                            isPreview={isPreview}
                            label="Copyright Text"
                        />
                    </p>
                    <div className="flex items-center gap-6 text-gray-300">
                        {[
                            { Icon: Facebook, color: '#1877F2', name: 'Facebook', handle: facebook },
                            { Icon: Twitter, color: '#000000', name: 'Twitter', handle: twitter },
                            { Icon: Instagram, color: '#E4405F', name: 'Instagram', handle: instagram },
                            { Icon: Instagram, color: '#000000', name: 'TikTok', handle: tiktok },
                        ].filter(social => social.handle).map((social, i) => (
                            <a
                                key={i}
                                href={social.handle ? (social.handle.startsWith('http') ? social.handle : `https://${social.name.toLowerCase()}.com/${social.handle.replace('@', '')}`) : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <social.Icon className="w-5 h-5 transition-colors" style={{ '--hover-color': social.color } as any} />
                            </a>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 opacity-30 grayscale">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 w-auto" alt="Visa" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6 w-auto" alt="Mastercard" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 w-auto" alt="Paypal" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
