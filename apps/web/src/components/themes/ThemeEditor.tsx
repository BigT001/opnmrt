'use client';

import React from 'react';
import { ThemeConfig } from './types';
import {
    Layout,
    Type,
    Palette,
    Image as ImageIcon,
    ChevronRight,
    Save,
    RefreshCcw,
    Zap,
    Columns,
    MousePointer2,
    TypeIcon,
    PanelRight,
    LayoutGrid,
    GlassWater,
    Pocket,
    Framer,
    Cpu,
    Crown,
    CircleDashed
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeEditorProps {
    config: ThemeConfig;
    onChange: (newConfig: ThemeConfig) => void;
    onSave: () => void;
    isSaving: boolean;
}

export function ThemeEditor({ config, onChange, onSave, isSaving }: ThemeEditorProps) {
    const [isHeadersExpanded, setIsHeadersExpanded] = React.useState(false);

    const handleChange = (key: keyof ThemeConfig, value: string) => {
        onChange({ ...config, [key]: value });
    };

    return (
        <div className="w-[350px] bg-white border-l border-slate-100 flex flex-col h-full shadow-2xl relative z-[100]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Open Mart Studio</h2>
                        <p className="text-[10px] font-bold text-slate-400">DESIGN ENGINE V1</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Layout className="w-4 h-4 text-primary" />
                            <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-800">Header Selection</h3>
                        </div>
                        <button
                            onClick={() => setIsHeadersExpanded(!isHeadersExpanded)}
                            className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                        >
                            {isHeadersExpanded ? 'Show Less' : 'Show All'}
                            <div className={`transition-transform duration-300 ${isHeadersExpanded ? 'rotate-180' : ''}`}>
                                <ChevronRight className="w-3 h-3 rotate-90" />
                            </div>
                        </button>
                    </div>

                    <motion.div
                        initial={false}
                        animate={{ height: isHeadersExpanded ? 'auto' : '82px' }}
                        className="grid grid-cols-2 gap-2 overflow-hidden relative pb-2"
                    >
                        {[
                            { id: 1, name: 'Classical', desc: 'Menu Center', icon: <Columns className="w-3 h-3" /> },
                            { id: 2, name: 'Modern', desc: 'Logo Center', icon: <Type className="w-3 h-3" /> },
                            { id: 3, name: 'Minimalist', desc: 'Space Out', icon: <Layout className="w-3 h-3" /> },
                            { id: 4, name: 'Focus', desc: 'Search Bar', icon: <RefreshCcw className="w-3 h-3" /> },
                            { id: 5, name: 'Glass', desc: 'Floating', icon: <GlassWater className="w-3 h-3" /> },
                            { id: 6, name: 'Brutal', desc: 'Hard Edge', icon: <Pocket className="w-3 h-3" /> },
                            { id: 7, name: 'Elegant', desc: 'Serif Mix', icon: <Framer className="w-3 h-3" /> },
                            { id: 8, name: 'Cyber', desc: 'Neon Tech', icon: <Cpu className="w-3 h-3" /> },
                            { id: 9, name: 'Luxury', desc: 'Grand Centric', icon: <Crown className="w-3 h-3" /> },
                            { id: 10, name: 'Pure', desc: 'Bubble Pop', icon: <CircleDashed className="w-3 h-3" /> }
                        ].map((variant) => (
                            <button
                                key={variant.id}
                                onClick={() => handleChange('headerVariant', `Header${variant.id}`)}
                                className={`p-3 rounded-xl border text-left transition-all h-[70px] relative ${config.headerVariant === `Header${variant.id}`
                                    ? 'border-primary bg-primary/5 text-primary shadow-sm'
                                    : 'border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    {variant.icon}
                                    <span className="text-[10px] font-black uppercase tracking-widest">{variant.name}</span>
                                </div>
                                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter leading-tight">{variant.desc}</div>
                            </button>
                        ))}

                        {!isHeadersExpanded && (
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                        )}
                    </motion.div>
                </section>

                {/* Hero Layout Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Columns className="w-4 h-4 text-primary" />
                        <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-800">Hero Layout</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {[1, 2].map((i) => (
                            <button
                                key={i}
                                onClick={() => handleChange('heroVariant', `Hero${i}`)}
                                className={`p-3 rounded-xl border text-[10px] font-bold transition-all ${config.heroVariant === `Hero${i}`
                                    ? 'border-primary bg-primary/5 text-primary shadow-sm'
                                    : 'border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'}`}
                            >
                                Variant {i}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Product Card Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <MousePointer2 className="w-4 h-4 text-primary" />
                        <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-800">Product Card</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {[1, 2].map((i) => (
                            <button
                                key={i}
                                onClick={() => handleChange('productCardVariant', `Card${i}`)}
                                className={`p-3 rounded-xl border text-[10px] font-bold transition-all ${config.productCardVariant === `Card${i}`
                                    ? 'border-primary bg-primary/5 text-primary shadow-sm'
                                    : 'border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'}`}
                            >
                                Variant {i}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Store Identity Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-primary" />
                        <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-800">Store Identity</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Store Name</label>
                            <input
                                type="text"
                                value={config.name || ''}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-[11px] font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="Edit store name..."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Logo URL</label>
                            <input
                                type="text"
                                value={config.logo || ''}
                                onChange={(e) => handleChange('logo', e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-[11px] font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="Paste logo URL..."
                            />
                        </div>
                    </div>
                </section>

                {/* Hero Content Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <TypeIcon className="w-4 h-4 text-primary" />
                        <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-800">Hero Content</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Title</label>
                            <input
                                type="text"
                                value={config.heroTitle || ''}
                                onChange={(e) => handleChange('heroTitle', e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-[11px] font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="Enter hero title..."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Subtitle</label>
                            <textarea
                                value={config.heroSubtitle || ''}
                                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-[11px] font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all h-20 resize-none"
                                placeholder="Enter hero subtitle..."
                            />
                        </div>
                    </div>
                </section>

                {/* Visual Style Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-primary" />
                        <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-800">Visual Style</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Brand Color</label>
                            <input
                                type="color"
                                value={config.primaryColor || '#000000'}
                                onChange={(e) => handleChange('primaryColor', e.target.value)}
                                className="w-full h-10 p-1 bg-white border border-slate-100 rounded-xl cursor-pointer"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Border Radius</label>
                            <select
                                value={config.borderRadius || 'rounded-xl'}
                                onChange={(e) => handleChange('borderRadius', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border-none rounded-xl text-[11px] font-bold text-slate-900 focus:ring-0"
                            >
                                <option value="rounded-none">Sharp</option>
                                <option value="rounded-lg">Mild</option>
                                <option value="rounded-xl">Standard</option>
                                <option value="rounded-[2.5rem]">Curvy</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Typography Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Type className="w-4 h-4 text-primary" />
                        <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-800">Typography</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Primary Font</label>
                            <select
                                value={config.primaryFont || 'font-sans'}
                                onChange={(e) => handleChange('primaryFont', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border-none rounded-xl text-[11px] font-bold text-slate-900"
                            >
                                <option value="font-sans">Modern Sans</option>
                                <option value="font-serif">Classic Serif</option>
                                <option value="font-mono">Technical Mono</option>
                            </select>
                        </div>
                    </div>
                </section>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="w-full py-4 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <RefreshCcw className="w-4 h-4 animate-spin" />
                            Publishing Changes...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Publish Design
                        </>
                    )}
                </button>
            </div>
        </div >
    );
}
