'use client';

import React from 'react';
import { PageProps } from '../types';
import { motion } from 'framer-motion';
import { EditableText, EditableImage } from '../EditableContent';
import { Mail, ArrowRight, Instagram, Twitter, Facebook } from 'lucide-react';

export const VantageAboutPage: React.FC<PageProps> = ({ store, isPreview, onConfigChange }) => {
    const config = store.themeConfig || {};
    const handleSave = (key: string, value: string) => {
        onConfigChange?.({ [key]: value });
    };

    return (
        <div className="bg-white min-h-screen pt-32 pb-40 text-left">
            <div className="max-w-[1400px] mx-auto px-6">
                {/* ═══ DRAMATIC EDITORIAL HEADER ═══ */}
                <div className="mb-24 lg:mb-40">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <span className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.6em] block mb-2">
                            <EditableText
                                value={config.aboutBadge || 'The Identity'}
                                onSave={(val: string) => handleSave('aboutBadge', val)}
                                isPreview={isPreview}
                                label="Badge"
                            />
                        </span>
                        <h1 className="text-4xl md:text-7xl font-black text-neutral-900 tracking-tighter uppercase leading-[0.8] max-w-4xl">
                            <EditableText
                                value={config.aboutHeroTitle || 'Beyond \n The Aesthetic.'}
                                onSave={(val: string) => handleSave('aboutHeroTitle', val)}
                                isPreview={isPreview}
                                label="Hero Title"
                                multiline={true}
                            />
                        </h1>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 120 }}
                            className="h-2 bg-[#fef08a] rounded-full mt-10"
                        />
                    </motion.div>
                </div>

                {/* ═══ VISION & STORY: THE VANTAGE MOVEMENT ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-20 lg:gap-40 items-start mb-40">
                    <div className="space-y-16">
                        <div className="aspect-[16/9] lg:aspect-[4/5] bg-neutral-50 rounded-[4rem] overflow-hidden shadow-2xl relative group">
                            <EditableImage
                                src={config.about_image_1 || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200'}
                                onSave={(val) => handleSave('about_image_1', val)}
                                isPreview={isPreview}
                                className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms]"
                                label="Campaign Visual"
                            />
                        </div>

                        <div className="max-w-2xl space-y-10">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">
                                    <EditableText
                                        value={config.aboutStoryBadge || 'Our Thesis'}
                                        onSave={(val: string) => handleSave('aboutStoryBadge', val)}
                                        isPreview={isPreview}
                                        label="Story Badge"
                                    />
                                </span>
                                <h2 className="text-4xl font-black uppercase tracking-tighter text-black">
                                    <EditableText
                                        value={config.aboutStoryTitle || 'Our Core Vision'}
                                        onSave={(val: string) => handleSave('aboutStoryTitle', val)}
                                        isPreview={isPreview}
                                        label="Story Title"
                                    />
                                </h2>
                            </div>
                            <div className="text-2xl md:text-3xl text-neutral-800 font-medium leading-tight italic tracking-tight">
                                <EditableText
                                    value={config.about_story || "Founded on the principles of bold expression and uncompromising quality, Vantage is more than a fashion brand. We are a movement dedicated to those who dare to stand out and redefine the status quo through their personal style."}
                                    onSave={(val) => handleSave('about_story', val)}
                                    isPreview={isPreview}
                                    multiline={true}
                                    label="Our Vision"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ═══ THE VANTAGE CODE (VALUES) ═══ */}
                    <div className="sticky top-32 space-y-16 py-12 lg:py-0">
                        <div className="space-y-10">
                            <h3 className="text-[10px] font-black text-neutral-900 uppercase tracking-[0.5em] border-b border-neutral-100 pb-6 w-full">
                                <EditableText
                                    value={config.aboutValuesHeader || 'The Vantage Code.'}
                                    onSave={(val: string) => handleSave('aboutValuesHeader', val)}
                                    isPreview={isPreview}
                                    label="Values Header"
                                />
                            </h3>

                            <div className="space-y-14">
                                {[
                                    { key: 'aboutVal1', title: 'Authenticity', desc: 'Real designs for real people. No clones, no compromises. We celebrate the unique rhythm of individuals.' },
                                    { key: 'aboutVal2', title: 'Sustainability', desc: 'High fashion shouldn’t cost the earth. We use ethically sourced materials and prioritize conscious production.' },
                                    { key: 'aboutVal3', title: 'Innovation', desc: 'Constantly pushing the boundaries of construction and aesthetic. Style that evolves with the speed of thought.' }
                                ].map((val, idx) => (
                                    <motion.div
                                        key={val.key}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group"
                                    >
                                        <div className="flex items-center gap-4 mb-3">
                                            <span className="text-[9px] font-black text-neutral-300">0{idx + 1}</span>
                                            <h4 className="text-2xl font-black uppercase tracking-tighter text-black transition-colors group-hover:text-neutral-400">
                                                <EditableText
                                                    value={config[`${val.key}Title`] || val.title}
                                                    onSave={(v: string) => handleSave(`${val.key}Title`, v)}
                                                    isPreview={isPreview}
                                                    label={`${val.title} Title`}
                                                />
                                            </h4>
                                        </div>
                                        <div className="text-sm font-medium text-neutral-400 leading-relaxed max-w-sm pl-7">
                                            <EditableText
                                                value={config[`${val.key}Desc`] || val.desc}
                                                onSave={(v: string) => handleSave(`${val.key}Desc`, v)}
                                                isPreview={isPreview}
                                                multiline={true}
                                                label={`${val.title} Description`}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Social Interaction Card */}
                        <div className="bg-neutral-900 rounded-[3rem] p-10 relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200')] bg-cover" />
                            <div className="relative z-10">
                                <h4 className="text-white text-2xl font-black uppercase tracking-tighter mb-4 italic">
                                    <EditableText
                                        value={config.aboutCtaTitle || 'Join The Elite'}
                                        onSave={(val: string) => handleSave('aboutCtaTitle', val)}
                                        isPreview={isPreview}
                                        label="CTA Title"
                                    />
                                </h4>
                                <p className="text-neutral-500 font-bold uppercase text-[9px] tracking-widest leading-relaxed mb-8">
                                    <EditableText
                                        value={config.aboutCtaSubtitle || 'Follow our daily drops \n and community highlights.'}
                                        onSave={(val: string) => handleSave('aboutCtaSubtitle', val)}
                                        isPreview={isPreview}
                                        multiline={true}
                                        label="CTA Subtitle"
                                    />
                                </p>
                                <div className="flex gap-4">
                                    {[Instagram, Twitter, Facebook].map((Icon, i) => (
                                        <button key={i} className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white transition-all">
                                            <Icon className="w-5 h-5" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Logistics */}
                <div className="pt-20 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-neutral-100">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300 italic">
                            <EditableText
                                value={config.aboutLocationLabel || 'Core Location'}
                                onSave={(val: string) => handleSave('aboutLocationLabel', val)}
                                isPreview={isPreview}
                                label="Location Label"
                            />
                        </span>
                        <div className="text-neutral-900 font-black uppercase tracking-tighter text-xl leading-none">
                            <EditableText
                                value={config.aboutLocationVal || 'Global Presence \n Digital First.'}
                                onSave={(val: string) => handleSave('aboutLocationVal', val)}
                                isPreview={isPreview}
                                multiline={true}
                                label="Location Text"
                            />
                        </div>
                    </div>
                    <div className="space-y-4 md:text-right">
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300 italic">
                            <EditableText
                                value={config.aboutContactLabel || 'Inquiries'}
                                onSave={(val: string) => handleSave('aboutContactLabel', val)}
                                isPreview={isPreview}
                                label="Contact Label"
                            />
                        </span>
                        <div className="text-neutral-900 font-black uppercase tracking-tighter text-xl leading-none">
                            <EditableText
                                value={store.officialEmail || config.aboutContactVal || 'connect@vantage.shop'}
                                onSave={(val: string) => handleSave('aboutContactVal', val)}
                                isPreview={isPreview}
                                label="Contact Email"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
