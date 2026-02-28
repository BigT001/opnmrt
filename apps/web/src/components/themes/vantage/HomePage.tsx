'use client';

import React from 'react';
import { PageProps } from '../types';
import { VantageHero } from './StorefrontHero';
import { VantageProductGrid } from './ProductGrid';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, X } from 'lucide-react';
import { EditableText, EditableImage } from '../EditableContent';

export const VantageHomePage: React.FC<PageProps> = ({ store, products, subdomain, isPreview, onConfigChange }) => {
    const config = store.themeConfig || {};

    const handleConfigSave = (newCfg: any) => {
        onConfigChange?.(newCfg);
    };

    const isHidden = (key: string) => store.hiddenSections?.includes(key);

    const toggleSection = (key: string) => {
        const current = store.hiddenSections || [];
        const next = current.includes(key) ? current.filter(k => k !== key) : [...current, key];
        onConfigChange?.({ hiddenSections: next });
    };

    const SectionWrapper: React.FC<{ id: string; children: React.ReactNode; className?: string }> = ({ id, children, className }) => {
        if (!isPreview && isHidden(id)) return null;

        return (
            <div className={`relative group/section ${className} ${isPreview && isHidden(id) ? 'opacity-30' : ''}`}>
                {isPreview && (
                    <div className="absolute top-4 right-4 z-[50] opacity-0 group-hover/section:opacity-100 transition-opacity">
                        <button
                            onClick={() => toggleSection(id)}
                            className={`p-2 rounded-xl border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isHidden(id) ? 'bg-orange-500 text-white border-orange-400' : 'bg-white text-slate-900 border-slate-100 hover:bg-slate-50'
                                }`}
                        >
                            {isHidden(id) ? (
                                <>
                                    <Eye className="w-3 h-3" />
                                    Show Section
                                </>
                            ) : (
                                <>
                                    <X className="w-3 h-3" />
                                    Hide Section
                                </>
                            )}
                        </button>
                    </div>
                )}
                <div className={isPreview && isHidden(id) ? 'pointer-events-none grayscale' : ''}>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div className="pb-0 overflow-hidden">
            <SectionWrapper id="hero">
                <VantageHero
                    store={store}
                    isPreview={isPreview}
                    onConfigChange={onConfigChange}
                />
            </SectionWrapper>

            <SectionWrapper id="marquee">
                <div className="py-4 lg:py-8 rotate-[-1deg] scale-110 relative z-10 my-0 lg:my-10" style={{ backgroundColor: store.primaryColor || '#000' }}>
                    <div className="flex overflow-hidden whitespace-nowrap">
                        <div className="flex animate-marquee">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <span key={i} className="text-white text-3xl lg:text-5xl font-black uppercase tracking-tighter mx-10 italic">
                                    <EditableText
                                        value={config.homeMarqueeText || 'Vantage Selection • Bold Fashion • Define Your Style • Urban Aesthetics • Premium Drops •'}
                                        onSave={(val: string) => handleConfigSave({ homeMarqueeText: val })}
                                        isPreview={isPreview}
                                        label="Marquee Text"
                                    />
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </SectionWrapper>

            <SectionWrapper id="products">
                <VantageProductGrid
                    products={products}
                    subdomain={subdomain}
                    storeId={store.id}
                    store={store}
                    isPreview={isPreview}
                    onConfigChange={onConfigChange}
                    hideControls={true}
                />
            </SectionWrapper>

            {/* Lookbook / Extra Section */}
            <SectionWrapper id="lookbook">
                <section className="py-12 lg:py-24 bg-gray-50 mt-10">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
                                        <EditableText
                                            value={config.homeLookbookBadge || 'Style Vision'}
                                            onSave={(val: string) => handleConfigSave({ homeLookbookBadge: val })}
                                            isPreview={isPreview}
                                            label="Lookbook Badge"
                                        />
                                    </span>
                                    <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-[0.8]">
                                        <EditableText
                                            value={config.homeLookbookTitle || 'The \nVantage \nLook.'}
                                            onSave={(val: string) => handleConfigSave({ homeLookbookTitle: val })}
                                            isPreview={isPreview}
                                            label="Lookbook Title"
                                            multiline={true}
                                        />
                                    </h2>
                                </div>
                                <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-sm text-left">
                                    <EditableText
                                        value={config.homeLookbookDesc || '"Our collection is a dialogue between craftsmanship and the city. Each piece is designed to command attention and endure the rhythm of modern life."'}
                                        onSave={(val: string) => handleConfigSave({ homeLookbookDesc: val })}
                                        isPreview={isPreview}
                                        label="Lookbook Description"
                                        multiline={true}
                                    />
                                </p>
                                <button className="flex items-center gap-4 group text-[10px] font-black uppercase tracking-[0.4em] text-black">
                                    <EditableText
                                        value={config.homeLookbookButton || 'View Full Lookbook'}
                                        onSave={(val: string) => handleConfigSave({ homeLookbookButton: val })}
                                        isPreview={isPreview}
                                        label="Button Text"
                                    />
                                    <div className="w-10 h-10 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: store.primaryColor || '#000' }}><ArrowRight className="w-4 h-4" /></div>
                                </button>
                            </div>
                            <div className="relative">
                                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden rotate-2 shadow-2xl">
                                    <EditableImage
                                        src={config.homeLookbookImage || "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000"}
                                        onSave={(url: string) => handleConfigSave({ homeLookbookImage: url })}
                                        isPreview={isPreview}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -left-4 -bottom-6 lg:-left-12 lg:-bottom-12 w-32 h-32 lg:w-56 lg:h-56 bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 lg:p-8 shadow-2xl -rotate-6 flex flex-col justify-center">
                                    <p className="text-lg lg:text-2xl font-black italic tracking-tighter uppercase leading-none mb-2 text-black text-left">
                                        <EditableText
                                            value={config.homeLookbookOverlayText || 'Crafted \nFor \nLeaders.'}
                                            onSave={(val: string) => handleConfigSave({ homeLookbookOverlayText: val })}
                                            isPreview={isPreview}
                                            label="Overlay Text"
                                            multiline={true}
                                        />
                                    </p>
                                    <div className="h-1 w-6 lg:w-10 bg-black" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </SectionWrapper>
        </div>
    );
};
