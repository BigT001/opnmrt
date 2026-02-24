'use client';

import React from 'react';
import { ThemeConfig } from './types';
import api from '@/lib/api';
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
    onClose?: () => void;
    isSaving: boolean;
}

export function ThemeEditor({ config, onChange, onSave, onClose, isSaving }: ThemeEditorProps) {
    const [isUploading, setIsUploading] = React.useState(false);
    const [openSection, setOpenSection] = React.useState<string | null>('colors');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleChange = (key: keyof ThemeConfig, value: string) => {
        onChange({ ...config, [key]: value });
    };

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/stores/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            handleChange('logo', res.data.url);
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Failed to upload logo.');
        } finally {
            setIsUploading(false);
        }
    };

    const colorPalettes = [
        { name: 'Midnight', primary: '#0f172a' },
        { name: 'Emerald', primary: '#10b981' },
        { name: 'Sunshine', primary: '#f59e0b' },
        { name: 'Rose', primary: '#f43f5e' },
        { name: 'Indigo', primary: '#6366f1' },
        { name: 'Sunset', primary: '#f97316' },
        { name: 'Luxury', primary: '#b45309' },
        { name: 'Clean', primary: '#000000' },
    ];

    const SectionHeader = ({ id, icon: Icon, title }: { id: string, icon: any, title: string }) => (
        <button
            onClick={() => toggleSection(id)}
            className="w-full flex items-center justify-between p-1 group"
        >
            <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${openSection === id ? 'text-primary' : 'text-slate-400'}`} />
                <h3 className={`text-[11px] font-black uppercase tracking-wider transition-colors ${openSection === id ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-700'}`}>{title}</h3>
            </div>
            <ChevronRight className={`w-3 h-3 text-slate-300 transition-transform duration-300 ${openSection === id ? 'rotate-90' : ''}`} />
        </button>
    );

    return (
        <div className="w-[350px] bg-white border-l border-slate-100 flex flex-col h-full shadow-2xl relative z-[100]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Brand Studio</h2>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">OpenMart Engine</p>
                    </div>
                </div>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
                        title="Collapse Sidebar"
                    >
                        <PanelRight className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
                {/* Visual Identity Section */}
                <section className="space-y-4">
                    <SectionHeader id="identity" icon={Crown} title="Visual Identity" />

                    <AnimatePresence>
                        {openSection === 'identity' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Store Logo</label>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden relative"
                                    >
                                        {isUploading ? (
                                            <RefreshCcw className="w-6 h-6 text-primary animate-spin" />
                                        ) : config.logo ? (
                                            <>
                                                <img src={config.logo} className="w-full h-full object-contain p-4" alt="Store Logo" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <RefreshCcw className="w-5 h-5 text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon className="w-6 h-6 text-slate-300 group-hover:scale-110 transition-transform" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Click to upload logo</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Logo URL (Optional)</label>
                                    <input
                                        type="text"
                                        value={config.logo || ''}
                                        onChange={(e) => handleChange('logo', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-[11px] font-bold text-slate-900 focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                                        placeholder="Paste direct URL..."
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* Brand Colors Section */}
                <section className="space-y-4">
                    <SectionHeader id="colors" icon={Palette} title="Brand Colors" />

                    <AnimatePresence>
                        {openSection === 'colors' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-6"
                            >
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Quick Palettes</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {colorPalettes.map((palette) => (
                                            <button
                                                key={palette.name}
                                                onClick={() => handleChange('primaryColor', palette.primary)}
                                                className={`aspect-square rounded-xl border-2 transition-all flex items-center justify-center group ${config.primaryColor === palette.primary ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-slate-100 hover:border-slate-300'}`}
                                                style={{ backgroundColor: palette.primary }}
                                                title={palette.name}
                                            >
                                                {config.primaryColor === palette.primary && (
                                                    <Zap className="w-3 h-3 text-white mix-blend-difference" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Custom Hex</label>
                                        <div className="relative h-12 w-full">
                                            <input
                                                type="color"
                                                value={config.primaryColor || '#000000'}
                                                onChange={(e) => handleChange('primaryColor', e.target.value)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div
                                                className="w-full h-full rounded-2xl border border-slate-100 flex items-center justify-center transition-transform active:scale-95"
                                                style={{ backgroundColor: config.primaryColor }}
                                            >
                                                <span className="text-[10px] font-black uppercase text-white drop-shadow-sm mix-blend-difference">Pick</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 flex flex-col justify-end">
                                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[11px] font-black text-slate-800 tracking-tighter italic leading-none truncate">{config.primaryColor}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* Typography Section */}
                <section className="space-y-4">
                    <SectionHeader id="typography" icon={TypeIcon} title="Typography" />

                    <AnimatePresence>
                        {openSection === 'typography' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-3"
                            >
                                {[
                                    { id: 'font-sans', name: 'Premium Sans', desc: 'Modern & High-Energy' },
                                    { id: 'font-serif', name: 'Classic Serif', desc: 'Elegant & Established' },
                                    { id: 'font-mono', name: 'Technical Mono', desc: 'Tech & Futurity' }
                                ].map((font) => (
                                    <button
                                        key={font.id}
                                        onClick={() => handleChange('primaryFont', font.id)}
                                        className={`w-full p-4 rounded-2xl border text-left transition-all relative ${config.primaryFont === font.id
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm'
                                            : 'border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-[12px] font-black uppercase tracking-widest ${font.id}`}>{font.name}</span>
                                            {config.primaryFont === font.id && <Zap className="w-3 h-3 text-primary animate-pulse" />}
                                        </div>
                                        <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{font.desc}</div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </div>

            <div className="p-6 border-t border-slate-100 bg-white">
                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="group w-full py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.25em] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <RefreshCcw className="w-4 h-4 animate-spin text-primary" />
                            Synchronizing...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Finalize & Publish
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
