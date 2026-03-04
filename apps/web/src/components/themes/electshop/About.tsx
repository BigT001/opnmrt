'use client';

import React from 'react';
import { PageProps } from '../types';
import { motion } from 'framer-motion';
import { Award, Clock, Users, Zap, ChevronRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { EditableText, EditableImage } from '../EditableContent';

export function ElectshopAboutPage({ store, subdomain, isPreview, onConfigChange }: PageProps) {
    const config = store.themeConfig || {};
    const handleSave = (key: string, value: string) => {
        onConfigChange?.({ [key]: value });
    };

    const effectivePrimaryColor = config.primaryColor || store.primaryColor || '#2874f0';

    return (
        <div className="bg-white min-h-screen theme-elect-about" style={{ '--elect-primary': effectivePrimaryColor } as React.CSSProperties}>
            <style jsx>{`
                .theme-elect-about :global(.text-brand) { color: var(--elect-primary, #2874f0) !important; }
                .theme-elect-about :global(.bg-brand) { background-color: var(--elect-primary, #2874f0) !important; }
                .theme-elect-about :global(.border-brand) { border-color: var(--elect-primary, #2874f0) !important; }
            `}</style>

            {/* Simple Hero */}
            <section className="relative h-[400px] lg:h-[500px] bg-black overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
                        className="w-full h-full object-cover opacity-40 grayscale"
                        alt="Office"
                    />
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs lg:text-sm font-black text-brand uppercase tracking-[0.4em] mb-6"
                    >
                        <EditableText
                            value={config.aboutBadge || 'Learn our culture'}
                            onSave={(val: string) => handleSave('aboutBadge', val)}
                            isPreview={isPreview}
                            label="Badge"
                        />
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase italic"
                    >
                        <EditableText
                            value={config.aboutHeroTitle || 'Redefining the \n Future of Electronics'}
                            onSave={(val: string) => handleSave('aboutHeroTitle', val)}
                            isPreview={isPreview}
                            label="Hero Title"
                            multiline={true}
                        />
                    </motion.h1>
                </div>
            </section>

            {/* Story */}
            <section className="max-w-7xl mx-auto px-4 py-24 lg:py-40">
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                    <div className="lg:w-1/2 relative">
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000" alt="Tech" className="w-full h-auto aspect-[4/5] object-cover" />
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[20px] border-brand/10 rounded-[4rem] z-0 -rotate-3" />
                    </div>
                    <div className="lg:w-1/2 space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 uppercase tracking-tighter italic">
                                <EditableText
                                    value={config.aboutMissionTitle || 'Our Mission'}
                                    onSave={(val: string) => handleSave('aboutMissionTitle', val)}
                                    isPreview={isPreview}
                                    label="Mission Title"
                                />
                            </h2>
                            <p className="text-xs font-black text-brand uppercase tracking-[0.3em]">
                                <EditableText
                                    value={config.aboutMissionBadge || 'Quality Gadgets for everyone'}
                                    onSave={(val: string) => handleSave('aboutMissionBadge', val)}
                                    isPreview={isPreview}
                                    label="Mission Badge"
                                />
                            </p>
                        </div>
                        <div className="space-y-6 text-gray-500 font-medium leading-[1.8] text-sm lg:text-base">
                            <p>
                                <EditableText
                                    value={config.aboutMissionText1 || `Founded in 2024, ${store.name || 'Electshop'} was born out of a desire to make premium electronics accessible. We believe that technology should empower people to live more connected, efficient, and inspiring lives.`}
                                    onSave={(val: string) => handleSave('aboutMissionText1', val)}
                                    isPreview={isPreview}
                                    label="Mission Paragraph 1"
                                    multiline={true}
                                />
                            </p>
                            <p>
                                <EditableText
                                    value={config.aboutMissionText2 || "Every product in our catalog is hand-picked by our team of hardware geeks. We don't just sell gadgets; we test them, break them, and fall in love with them before they reach your doorstep."}
                                    onSave={(val: string) => handleSave('aboutMissionText2', val)}
                                    isPreview={isPreview}
                                    label="Mission Paragraph 2"
                                    multiline={true}
                                />
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-10 lg:pt-10">
                            <Stat label={
                                <EditableText value={config.aboutStat1Label || "Live Products"} onSave={(val: string) => handleSave('aboutStat1Label', val)} isPreview={isPreview} label="Stat 1 Label" />
                            } val={
                                <EditableText value={config.aboutStat1Val || "1.2k+"} onSave={(val: string) => handleSave('aboutStat1Val', val)} isPreview={isPreview} label="Stat 1 Value" />
                            } />
                            <Stat label={
                                <EditableText value={config.aboutStat2Label || "Happy Users"} onSave={(val: string) => handleSave('aboutStat2Label', val)} isPreview={isPreview} label="Stat 2 Label" />
                            } val={
                                <EditableText value={config.aboutStat2Val || "450k+"} onSave={(val: string) => handleSave('aboutStat2Val', val)} isPreview={isPreview} label="Stat 2 Value" />
                            } />
                            <Stat label={
                                <EditableText value={config.aboutStat3Label || "Store Rating"} onSave={(val: string) => handleSave('aboutStat3Label', val)} isPreview={isPreview} label="Stat 3 Label" />
                            } val={
                                <EditableText value={config.aboutStat3Val || "4.9/5"} onSave={(val: string) => handleSave('aboutStat3Val', val)} isPreview={isPreview} label="Stat 3 Value" />
                            } />
                            <Stat label={
                                <EditableText value={config.aboutStat4Label || "Years in Biz"} onSave={(val: string) => handleSave('aboutStat4Label', val)} isPreview={isPreview} label="Stat 4 Label" />
                            } val={
                                <EditableText value={config.aboutStat4Val || "08+"} onSave={(val: string) => handleSave('aboutStat4Val', val)} isPreview={isPreview} label="Stat 4 Value" />
                            } />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="bg-gray-50 py-24 lg:py-40">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-20 space-y-6">
                        <h2 className="text-3xl lg:text-5xl font-black text-gray-900 uppercase tracking-tighter italic">
                            <EditableText
                                value={config.aboutValuesTitle || 'Modern Values'}
                                onSave={(val: string) => handleSave('aboutValuesTitle', val)}
                                isPreview={isPreview}
                                label="Values Title"
                            />
                        </h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                            <EditableText
                                value={config.aboutValuesSubtitle || `The principles that guide every decision we make at ${store.name || 'Electshop'}.`}
                                onSave={(val: string) => handleSave('aboutValuesSubtitle', val)}
                                isPreview={isPreview}
                                label="Values Subtitle"
                                multiline={true}
                            />
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <ValueCard
                            icon={<Zap className="w-8 h-8 text-brand" />}
                            title={
                                <EditableText value={config.aboutVal1Title || "Instant Tech"} onSave={(val: string) => handleSave('aboutVal1Title', val)} isPreview={isPreview} label="Value 1 Title" />
                            }
                            desc={
                                <EditableText value={config.aboutVal1Desc || "We pride ourselves on being the first to bring cutting-edge releases to our customers."} onSave={(val: string) => handleSave('aboutVal1Desc', val)} isPreview={isPreview} label="Value 1 Desc" multiline={true} />
                            }
                        />
                        <ValueCard
                            icon={<Award className="w-8 h-8 text-brand" />}
                            title={
                                <EditableText value={config.aboutVal2Title || "Gold Standard"} onSave={(val: string) => handleSave('aboutVal2Title', val)} isPreview={isPreview} label="Value 2 Title" />
                            }
                            desc={
                                <EditableText value={config.aboutVal2Desc || "If it's in our store, you can be certain it has passed our 50-point quality check."} onSave={(val: string) => handleSave('aboutVal2Desc', val)} isPreview={isPreview} label="Value 2 Desc" multiline={true} />
                            }
                        />
                        <ValueCard
                            icon={<Users className="w-8 h-8 text-brand" />}
                            title={
                                <EditableText value={config.aboutVal3Title || "Community First"} onSave={(val: string) => handleSave('aboutVal3Title', val)} isPreview={isPreview} label="Value 3 Title" />
                            }
                            desc={
                                <EditableText value={config.aboutVal3Desc || "Our reviews are 100% verified. We listen, adapt, and grow based on your feedback."} onSave={(val: string) => handleSave('aboutVal3Desc', val)} isPreview={isPreview} label="Value 3 Desc" multiline={true} />
                            }
                        />
                        <ValueCard
                            icon={<Clock className="w-8 h-8 text-brand" />}
                            title={
                                <EditableText value={config.aboutVal4Title || "Rapid Logistics"} onSave={(val: string) => handleSave('aboutVal4Title', val)} isPreview={isPreview} label="Value 4 Title" />
                            }
                            desc={
                                <EditableText value={config.aboutVal4Desc || "We operate our own fulfillment network to ensure your tech arrives in pristine condition."} onSave={(val: string) => handleSave('aboutVal4Desc', val)} isPreview={isPreview} label="Value 4 Desc" multiline={true} />
                            }
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 lg:py-40 px-4">
                <div className="max-w-7xl mx-auto bg-gray-950 rounded-[3rem] p-12 lg:p-24 relative overflow-hidden flex flex-col items-center text-center border border-white/5 shadow-2xl">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 space-y-10">
                        <h2 className="text-4xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase italic max-w-3xl mx-auto">
                            <EditableText
                                value={config.aboutCtaTitle || 'Ready to upgrade \n your digital life?'}
                                onSave={(val: string) => handleSave('aboutCtaTitle', val)}
                                isPreview={isPreview}
                                label="CTA Title"
                                multiline={true}
                            />
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href={`/store/${subdomain}/shop`} className="px-12 py-5 bg-brand text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-brand/20 hover:scale-105 transition-all flex items-center gap-3">
                                <EditableText
                                    value={config.aboutCtaButton || 'Start Shopping'}
                                    onSave={(val: string) => handleSave('aboutCtaButton', val)}
                                    isPreview={isPreview}
                                    label="CTA Button"
                                />
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="flex items-center gap-3 text-white/70 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors">
                                <MessageCircle className="w-5 h-5 text-brand" />
                                <EditableText
                                    value={config.aboutCtaChat || 'Chat with Big T'}
                                    onSave={(val: string) => handleSave('aboutCtaChat', val)}
                                    isPreview={isPreview}
                                    label="CTA Chat Link"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function Stat({ label, val }: { label: React.ReactNode; val: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <p className="text-3xl font-black text-gray-900 italic tracking-tighter">{val}</p>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{label}</p>
        </div>
    );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode; title: React.ReactNode, desc: React.ReactNode }) {
    return (
        <div className="bg-white p-10 rounded-[2rem] border border-gray-100/50 shadow-sm hover:shadow-xl hover:border-brand/20 transition-all duration-500 group">
            <div className="w-16 h-16 rounded-2xl bg-brand/5 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic mb-4">{title}</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">{desc}</p>
        </div>
    );
}
