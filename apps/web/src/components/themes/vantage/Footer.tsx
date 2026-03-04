'use client';

import React from 'react';
import { FooterProps } from '../types';
import Link from 'next/link';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import { useParams } from 'next/navigation';
import { EditableText } from '../EditableContent';

export function VantageFooter({
    storeName,
    themeConfig,
    onConfigChange,
    isPreview,
    instagram,
    twitter,
    facebook,
    tiktok
}: FooterProps) {
    const { subdomain } = useParams<{ subdomain: string }>();
    const effectivePrimaryColor = themeConfig?.primaryColor || '#000000';
    const config = themeConfig || {};

    const handleConfigSave = (newCfg: any) => {
        onConfigChange?.(newCfg);
    };

    return (
        <footer className="bg-white border-t border-gray-100 pt-10 pb-10 text-gray-900">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
                    {/* Brand */}
                    <div className="space-y-4">
                        <span className="text-2xl font-black tracking-tighter uppercase leading-none block">
                            <EditableText
                                value={storeName || 'VANTAGE'}
                                onSave={(val: string) => handleConfigSave({ name: val })}
                                isPreview={isPreview}
                                label="Footer Brand Name"
                            />
                        </span>
                        <p className="text-gray-400 font-bold text-[9px] uppercase tracking-widest max-w-[180px] leading-relaxed">
                            <EditableText
                                value={config.footerTagline || 'Redefining style through modern architectural aesthetics.'}
                                onSave={(val: string) => handleConfigSave({ footerTagline: val })}
                                isPreview={isPreview}
                                label="Footer Tagline"
                                multiline={true}
                            />
                        </p>
                        <div className="flex gap-2">
                            {[
                                { Icon: Instagram, color: '#E4405F', name: 'Instagram', handle: instagram },
                                { Icon: Twitter, color: '#1DA1F2', name: 'Twitter', handle: twitter },
                                { Icon: Facebook, color: '#1877F2', name: 'Facebook', handle: facebook },
                                { Icon: Instagram, color: '#000000', name: 'TikTok', handle: tiktok }
                            ].filter(social => social.handle).map((social, i) => (
                                <a
                                    key={i}
                                    href={social.handle ? (social.handle.startsWith('http') ? social.handle : `https://${social.name.toLowerCase()}.com/${social.handle.replace('@', '')}`) : '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 border border-gray-50 rounded-full flex items-center justify-center transition-all bg-white shadow-sm group active:scale-90"
                                    style={{ borderColor: social.color + '20' }}
                                >
                                    <social.Icon className="w-3.5 h-3.5 transition-colors" style={{ color: social.color }} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Legal / Connect */}
                    <div className="md:text-right flex flex-col md:items-end space-y-4">
                        <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300">Connect</h4>
                        <div className="flex flex-col md:items-end gap-2">
                            <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                                <EditableText
                                    value={config.footerTermsLink || 'Terms & Privacy'}
                                    onSave={val => handleConfigSave({ footerTermsLink: val })}
                                    isPreview={isPreview}
                                    label="Terms Link Label"
                                />
                            </Link>
                            <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                                <EditableText
                                    value={config.footerShippingLink || 'Shipping Policy'}
                                    onSave={val => handleConfigSave({ footerShippingLink: val })}
                                    isPreview={isPreview}
                                    label="Shipping Link Label"
                                />
                            </Link>
                            <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                                <EditableText
                                    value={config.footerContactLink || 'Contact Us'}
                                    onSave={val => handleConfigSave({ footerContactLink: val })}
                                    isPreview={isPreview}
                                    label="Contact Link Label"
                                />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">
                            <EditableText
                                value={config.footerCopyright || `© ${new Date().getFullYear()} ${storeName}. ALL RIGHTS RESERVED.`}
                                onSave={(val: string) => handleConfigSave({ footerCopyright: val })}
                                isPreview={isPreview}
                                label="Copyright Text"
                            />
                        </p>
                        <div className="hidden md:block w-px h-2 bg-gray-200" />
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black">
                            <EditableText
                                value={config.footerCredits || 'POWERED BY OPNMRT'}
                                onSave={(val: string) => handleConfigSave({ footerCredits: val })}
                                isPreview={isPreview}
                                label="Credits"
                            />
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="w-6 h-3.5 bg-gray-200 rounded-sm" />
                            <div className="w-6 h-3.5 bg-gray-200 rounded-sm" />
                            <div className="w-6 h-3.5 bg-gray-200 rounded-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
