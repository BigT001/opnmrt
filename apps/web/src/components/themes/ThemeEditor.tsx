'use client';

import React from 'react';
import { ThemeConfig } from './types';
import api from '@/lib/api';
import { APP_BASE_DOMAIN } from '@/lib/config';
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
    Cpu,
    Crown,
    CircleDashed,
    Eye,
    Home,
    Plus,
    Trash2,
    Menu as MenuIcon,
    Settings,
    ArrowUpCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeEditorProps {
    config: ThemeConfig;
    onChange: (newConfig: ThemeConfig) => void;
    onSave: () => void;
    onClose?: () => void;
    isSaving: boolean;
    subdomain?: string;
    currentPath?: string;
    onPathChange?: (path: string) => void;
    pages?: Array<{ id: string, name: string, desc: string, icon: any }>;
    /** Built-in categories for the active theme. Empty array = theme has no category nav. */
    defaultCategories?: string[];
    isMobile?: boolean;
}

const SectionHeader = ({ id, icon: Icon, title, active, onClick }: { id: string, icon: any, title: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-1 group"
    >
        <div className="flex items-center gap-2">
            <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
            <h3 className={`text-[10px] font-black uppercase tracking-[0.15em] transition-colors ${active ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>{title}</h3>
        </div>
        <ChevronRight className={`w-3 h-3 text-slate-300 transition-transform duration-200 ${active ? 'rotate-90 text-emerald-500' : ''}`} />
    </button>
);

export function ThemeEditor({ config, onChange, onSave, onClose, isSaving, subdomain, currentPath = 'index', onPathChange, pages = [], defaultCategories = [], isMobile }: ThemeEditorProps) {
    const [isUploading, setIsUploading] = React.useState(false);

    // Pages come entirely from the registry via props — no internal fallback.
    const displayPages = pages;

    // Categories: prefer any user-edited version saved in config, otherwise use
    // the theme's built-in defaults. Never invent phantom data.
    const resolvedCategories: string[] = React.useMemo(() => {
        if (config.categories && Array.isArray(config.categories) && config.categories.length > 0) {
            return config.categories as string[];
        }
        return defaultCategories;
    }, [config.categories, defaultCategories]);

    const hasCategories = resolvedCategories.length > 0;
    // hasCategoryFeature: true only if the theme registry said this theme has categories
    const hasCategoryFeature = defaultCategories.length > 0;

    const [openSection, setOpenSection] = React.useState<string | null>('navigation');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [recentColors, setRecentColors] = React.useState<string[]>([]);

    React.useEffect(() => {
        const saved = localStorage.getItem('aura-recent-colors');
        if (saved) {
            try {
                setRecentColors(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse recent colors');
            }
        }
    }, []);

    const addToRecent = (color: string) => {
        if (!color || color.length < 4) return;
        setRecentColors(prev => {
            const filtered = prev.filter(c => c.toLowerCase() !== color.toLowerCase());
            const updated = [color, ...filtered].slice(0, 8);
            localStorage.setItem('aura-recent-colors', JSON.stringify(updated));
            return updated;
        });
    };

    const handleChange = (key: keyof ThemeConfig, value: string) => {
        if (config[key] === value) return;
        onChange({ ...config, [key]: value });
        if (key === 'primaryColor') {
            addToRecent(value);
        }
    };

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const updateArray = (key: 'categories', index: number, value: any, action: 'edit' | 'add' | 'remove') => {
        const currentArr = Array.isArray(config[key]) ? [...(config[key] as any[])] : [
            'All Categories',
            'Electronics',
            'Smartphones'
        ];

        if (action === 'edit') {
            currentArr[index] = value;
        } else if (action === 'add') {
            currentArr.push(value);
        } else if (action === 'remove') {
            currentArr.splice(index, 1);
        }

        onChange({ ...config, [key]: currentArr });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('stores/upload', formData, {
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

    return (
        <div className="w-full md:w-[350px] bg-white md:border-l border-slate-100 flex flex-col h-full shadow-2xl relative z-[100]">
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800&family=Crimson+Pro:wght@800&family=JetBrains+Mono:wght@800&family=Outfit:wght@900&display=swap');
                .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
                .font-serif { font-family: 'Crimson Pro', serif; }
                .font-mono { font-family: 'JetBrains Mono', monospace; }
                .font-display { font-family: 'Outfit', sans-serif; }
            `}</style>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm shadow-emerald-200">
                        <Zap className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.15em] leading-none mb-0.5">Brand Studio</h2>
                        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">OPNMRT Engine</p>
                    </div>
                </div>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-700 transition-all"
                        title="Collapse Sidebar"
                    >
                        <PanelRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-6 space-y-6">
                {/* Store Navigation Section */}
                <section className="space-y-2">
                    <SectionHeader id="navigation" icon={Layout} title="Store Navigation" active={openSection === 'navigation'} onClick={() => toggleSection('navigation')} />

                    <AnimatePresence>
                        {openSection === 'navigation' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-1 border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-50">
                                    {displayPages.map((page) => {
                                        const isActive = currentPath === page.id;
                                        return (
                                            <button
                                                key={page.id}
                                                onClick={() => onPathChange?.(page.id)}
                                                className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors ${isActive
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2.5 w-full">
                                                    <page.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-500' : 'text-slate-300'}`} />
                                                    <div className="flex-1">
                                                        {(page as any).configKey ? (
                                                            <input
                                                                value={config[(page as any).configKey] || page.name}
                                                                onChange={(e) => handleChange((page as any).configKey, e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                title="Edit navigation menu label"
                                                                className={`bg-transparent outline-none w-full text-[10px] font-black uppercase tracking-wider block leading-none placeholder:text-slate-300 ${isActive ? 'text-emerald-800' : 'text-slate-700 focus:text-emerald-600 focus:bg-emerald-50/50 rounded-sm'}`}
                                                            />
                                                        ) : (
                                                            <span className={`text-[10px] font-black uppercase tracking-wider block leading-none ${isActive ? 'text-emerald-800' : 'text-slate-700'}`}>
                                                                {page.name}
                                                            </span>
                                                        )}
                                                        <span className="text-[8px] font-medium text-slate-400 uppercase tracking-widest mt-0.5 block">{page.desc}</span>
                                                    </div>
                                                </div>
                                                {isActive && (
                                                    <div className="flex items-center gap-1 shrink-0 ml-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        <span className="text-[7px] font-black text-emerald-600 uppercase tracking-wider">Live</span>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="mt-2 text-[8px] font-medium text-slate-400 px-1">
                                    💡 Click links in the preview to switch pages too.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* Categories Section */}
                <section className="space-y-2">
                    <SectionHeader id="menus" icon={MenuIcon} title="Categories" active={openSection === 'menus'} onClick={() => toggleSection('menus')} />

                    <AnimatePresence>
                        {openSection === 'menus' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-6 pb-2"
                            >
                                {/* ── Categories ─────────────────────────────── */}
                                {hasCategoryFeature ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider leading-none">Browse Categories</label>
                                            <button
                                                onClick={() => updateArray('categories', 0, 'New Category', 'add')}
                                                className="p-1 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-500 hover:text-white transition-all"
                                                title="Add category"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>

                                        {hasCategories ? (
                                            <div className="space-y-2">
                                                {resolvedCategories.map((cat: string, idx: number) => (
                                                    <div key={idx} className="flex gap-2 group/item">
                                                        <input
                                                            value={cat}
                                                            onChange={(e) => updateArray('categories', idx, e.target.value, 'edit')}
                                                            className="flex-1 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-[10px] font-medium text-slate-700 outline-none focus:border-emerald-400/50 focus:bg-white transition-all"
                                                        />
                                                        <button
                                                            onClick={() => updateArray('categories', idx, null, 'remove')}
                                                            className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover/item:opacity-100"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-6 flex flex-col items-center gap-2 text-center">
                                                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                                                    <MenuIcon className="w-4 h-4 text-slate-300" />
                                                </div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">No categories yet</p>
                                                <button
                                                    onClick={() => updateArray('categories', 0, 'New Category', 'add')}
                                                    className="mt-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-black uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all"
                                                >
                                                    + Add Category
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* This theme has no category navigation — show neutral info state */
                                    <div className="py-6 flex flex-col items-center gap-2 text-center px-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                                            <MenuIcon className="w-4 h-4 text-slate-200" />
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                            This theme does not use<br />a category menu
                                        </p>
                                    </div>
                                )}

                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* Visual Identity Section */}
                <section className="space-y-2">
                    <SectionHeader id="identity" icon={Crown} title="Visual Identity" active={openSection === 'identity'} onClick={() => toggleSection('identity')} />

                    <AnimatePresence>
                        {openSection === 'identity' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-6 pb-2"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">Brand Mark</label>
                                        <div className="flex gap-1">
                                            <div className="w-1 h-1 rounded-full bg-emerald-400" />
                                            <div className="w-1 h-1 rounded-full bg-emerald-200" />
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full aspect-[2/1] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-emerald-400/40 hover:bg-emerald-50/20 transition-all overflow-hidden relative"
                                    >
                                        {isUploading ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <RefreshCcw className="w-5 h-5 text-emerald-500 animate-spin" />
                                                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Processing...</span>
                                            </div>
                                        ) : config.logo ? (
                                            <>
                                                <img src={config.logo} className="w-full h-full object-contain p-6 drop-shadow-sm" alt="Store Logo" />
                                                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[2px]">
                                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                        <RefreshCcw className="w-3.5 h-3.5 text-emerald-600" />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-all duration-300">
                                                    <ImageIcon className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                                                </div>
                                                <div className="text-center">
                                                    <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest block mb-0.5">Upload Mark</span>
                                                    <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">PNG, SVG or WEBP</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Remote Asset URL</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={config.logo || ''}
                                            onChange={(e) => handleChange('logo', e.target.value)}
                                            className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600/10 transition-all outline-none"
                                            placeholder="https://brand.com/logo.png"
                                        />
                                        <Pocket className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* Brand Colors Section */}
                <section className="space-y-2">
                    <SectionHeader id="colors" icon={Palette} title="Brand Colors" active={openSection === 'colors'} onClick={() => toggleSection('colors')} />

                    <AnimatePresence>
                        {openSection === 'colors' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-8 pb-4"
                            >
                                {/* Live Preview Card */}
                                <div className="p-5 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4 relative overflow-hidden group/preview">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-16 -mt-16 blur-2xl transition-transform group-hover/preview:scale-110" style={{ backgroundColor: config.primaryColor + '10' }} />

                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: config.primaryColor }} />
                                            <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Aura Preview</span>
                                        </div>
                                        <div className="px-2.5 py-1 bg-white rounded-full border border-slate-100 shadow-sm">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{config.primaryColor}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 relative z-10">
                                        <div className="h-10 rounded-2xl flex items-center justify-center text-[9px] font-black uppercase tracking-widest shadow-lg shadow-black/5 transition-transform active:scale-95 cursor-default" style={{ backgroundColor: config.primaryColor, color: '#fff' }}>
                                            Primary
                                        </div>
                                        <div className="h-10 rounded-2xl border-2 flex items-center justify-center text-[9px] font-black uppercase tracking-widest transition-all hover:bg-white active:scale-95 cursor-default" style={{ borderColor: config.primaryColor, color: config.primaryColor }}>
                                            Secondary
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 relative z-10">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: config.primaryColor, opacity: 1 - (i * 0.25) }} />
                                        ))}
                                    </div>
                                </div>

                                {/* Recently Used Tray */}
                                {recentColors.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between px-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                                <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-widest">Recently Used</h4>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setRecentColors([]);
                                                    localStorage.removeItem('aura-recent-colors');
                                                }}
                                                className="text-[8px] font-bold text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2.5">
                                            {recentColors.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => handleChange('primaryColor', color)}
                                                    className={`w-8 h-8 rounded-lg border-2 transition-all relative group ${config.primaryColor === color ? 'border-emerald-500 scale-110 shadow-md' : 'border-white hover:scale-105 shadow-sm'}`}
                                                    style={{ backgroundColor: color }}
                                                >
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-xl transition-all" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {[
                                    {
                                        title: 'Modern & Vibrant',
                                        desc: 'High-energy for bold brands',
                                        colors: [
                                            { name: 'Indigo', hex: '#6366f1' },
                                            { name: 'Rose', hex: '#f43f5e' },
                                            { name: 'Violet', hex: '#8b5cf6' },
                                            { name: 'Sky', hex: '#0ea5e9' },
                                            { name: 'Emerald', hex: '#10b981' },
                                            { name: 'Amber', hex: '#f59e0b' },
                                            { name: 'Orange', hex: '#f97316' },
                                            { name: 'Pink', hex: '#ec4899' },
                                        ]
                                    },
                                    {
                                        title: 'Luxury & Minimal',
                                        desc: 'Sophisticated & premium',
                                        colors: [
                                            { name: 'Midnight', hex: '#0f172a' },
                                            { name: 'Slate', hex: '#475569' },
                                            { name: 'Gold', hex: '#b45309' },
                                            { name: 'Bronze', hex: '#7c2d12' },
                                            { name: 'Silver', hex: '#94a3b8' },
                                            { name: 'Coal', hex: '#1a1a1a' },
                                            { name: 'Ivory', hex: '#f8fafc' },
                                            { name: 'Sand', hex: '#d6d3d1' },
                                        ]
                                    },
                                    {
                                        title: 'Nature & Earth',
                                        desc: 'Organic & grounded',
                                        colors: [
                                            { name: 'Forest', hex: '#14532d' },
                                            { name: 'Sage', hex: '#4d7c0f' },
                                            { name: 'Ocean', hex: '#1e40af' },
                                            { name: 'Clay', hex: '#a16207' },
                                            { name: 'Moss', hex: '#3f6212' },
                                            { name: 'Teal', hex: '#0f766e' },
                                            { name: 'Earth', hex: '#78350f' },
                                            { name: 'Stone', hex: '#57534e' },
                                        ]
                                    },
                                    {
                                        title: 'Soft & Pastel',
                                        desc: 'Gentle & airy touch',
                                        colors: [
                                            { name: 'Sky', hex: '#bae6fd' },
                                            { name: 'Lavender', hex: '#ddd6fe' },
                                            { name: 'Mint', hex: '#d1fae5' },
                                            { name: 'Peach', hex: '#ffedd5' },
                                            { name: 'Rose', hex: '#ffe4e6' },
                                            { name: 'Lemon', hex: '#fef9c3' },
                                            { name: 'Lilac', hex: '#f3e8ff' },
                                            { name: 'Cloud', hex: '#f1f5f9' },
                                        ]
                                    }
                                ].map((group) => (
                                    <div key={group.title} className="space-y-4">
                                        <div className="px-1 flex items-center justify-between">
                                            <div>
                                                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">{group.title}</h4>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">{group.desc}</p>
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                                        </div>
                                        <div className="grid grid-cols-4 gap-3">
                                            {group.colors.map((color) => (
                                                <button
                                                    key={color.hex}
                                                    onClick={() => handleChange('primaryColor', color.hex)}
                                                    className={`group relative aspect-square rounded-[1.25rem] flex items-center justify-center transition-all ${config.primaryColor === color.hex ? 'ring-4 ring-slate-100 scale-110 z-10 shadow-xl' : 'hover:scale-105 active:scale-95 shadow-sm hover:shadow-md'}`}
                                                    style={{ backgroundColor: color.hex, borderColor: 'rgba(0,0,0,0.05)', borderWidth: 1 }}
                                                    title={color.name}
                                                >
                                                    <div className="absolute inset-0 rounded-[1.25rem] bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                                                    {config.primaryColor === color.hex && (
                                                        <motion.div
                                                            initial={{ scale: 0, rotate: -45 }}
                                                            animate={{ scale: 1, rotate: 0 }}
                                                            className="w-6 h-6 bg-white rounded-full flex items-center justify-center border shadow-lg"
                                                        >
                                                            <Zap className="w-3 h-3 text-slate-900 fill-slate-900" />
                                                        </motion.div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <div className="space-y-3 pt-2">
                                    <div className="px-1">
                                        <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Custom Identity</h4>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">Define your unique brand hex</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="relative group">
                                            <input
                                                type="color"
                                                value={config.primaryColor || '#000000'}
                                                onChange={(e) => handleChange('primaryColor', e.target.value)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                            />
                                            <div
                                                className="w-14 h-14 rounded-[1.25rem] border-2 border-slate-100 flex items-center justify-center transition-all bg-white relative overflow-hidden group-hover:border-primary/30"
                                            >
                                                <div
                                                    className="w-8 h-8 rounded-full shadow-inner"
                                                    style={{ backgroundColor: config.primaryColor }}
                                                />
                                                <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={config.primaryColor?.toUpperCase() || ''}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val.startsWith('#') && val.length <= 7) {
                                                            handleChange('primaryColor', val);
                                                        } else if (!val.startsWith('#') && val.length <= 6) {
                                                            handleChange('primaryColor', `#${val}`);
                                                        }
                                                    }}
                                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-black text-slate-800 focus:ring-2 focus:ring-primary/10 transition-all outline-none tracking-widest"
                                                    placeholder="#000000"
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* Typography Section */}
                <section className="space-y-2">
                    <SectionHeader id="typography" icon={TypeIcon} title="Typography" active={openSection === 'typography'} onClick={() => toggleSection('typography')} />

                    <AnimatePresence>
                        {openSection === 'typography' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-3"
                            >
                                {[
                                    { id: 'font-sans', name: 'Inter Tight', desc: 'Modern, Clean & Precise', sample: 'Abc' },
                                    { id: 'font-serif', name: 'Playfair Display', desc: 'Elegant & High-End', sample: 'Abc' },
                                    { id: 'font-mono', name: 'JetBrains Mono', desc: 'Tech-Forward & Structured', sample: 'Abc' },
                                    { id: 'font-display', name: 'Outfit Black', desc: 'Bold & High-Impact', sample: 'Abc' },
                                    { id: 'font-neutral', name: 'System Default', desc: 'Native & Familiar', sample: 'Abc' }
                                ].map((font) => (
                                    <button
                                        key={font.id}
                                        onClick={() => handleChange('primaryFont', font.id)}
                                        className={`w-full px-3 py-3 rounded-xl border text-left transition-all ${config.primaryFont === font.id
                                            ? 'border-emerald-400 bg-emerald-50/50'
                                            : 'border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-lg font-black transition-transform group-hover/font:scale-110 ${font.id}`}>
                                                    {font.sample}
                                                </div>
                                                <div>
                                                    <span className={`text-[12px] font-black uppercase tracking-widest block ${font.id}`}>{font.name}</span>
                                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{font.desc}</div>
                                                </div>
                                            </div>
                                            {config.primaryFont === font.id && (
                                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                                                    <Zap className="w-3 h-3 text-white fill-white" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* Surface & Shape Section */}
                <section className="space-y-2">
                    <SectionHeader id="surface" icon={LayoutGrid} title="Surface & Shape" active={openSection === 'surface'} onClick={() => toggleSection('surface')} />

                    <AnimatePresence>
                        {openSection === 'surface' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-6 pb-2"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">Corner Radius</label>
                                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">{config.borderRadius || '2.5rem'}</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            { id: '0px', name: 'Sharp' },
                                            { id: '0.75rem', name: 'Soft' },
                                            { id: '1.5rem', name: 'Round' },
                                            { id: '2.5rem', name: 'Organic' }
                                        ].map((radius) => (
                                            <button
                                                key={radius.id}
                                                onClick={() => handleChange('borderRadius', radius.id)}
                                                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center group transition-all ${config.borderRadius === radius.id ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 hover:border-slate-200 text-slate-400'}`}
                                            >
                                                <div
                                                    className="w-6 h-6 border-2 border-current mb-1.5"
                                                    style={{ borderTopLeftRadius: radius.id }}
                                                />
                                                <span className="text-[7px] font-black uppercase tracking-widest group-hover:text-slate-900">{radius.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-emerald-600 text-white space-y-2 shadow-lg shadow-emerald-200/50 relative overflow-hidden">
                                    <div className="absolute -right-4 -top-4 w-14 h-14 bg-white/10 rounded-full blur-xl" />
                                    <h5 className="text-[9px] font-black uppercase tracking-widest leading-none">Aura Design Engine</h5>
                                    <p className="text-[8px] font-medium text-white/70 uppercase tracking-widest leading-relaxed">Let AI optimize your layout and visual hierarchy.</p>
                                    <button className="w-full py-2 bg-white text-emerald-700 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all active:scale-95 hover:bg-emerald-50">
                                        Fast Optimize
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </div>

            <div className="px-5 py-4 border-t border-slate-100 bg-white flex gap-2">
                <button
                    onClick={() => {
                        if (isMobile) return onClose?.();
                        const protocol = window.location.protocol;
                        window.open(`${protocol}//${subdomain}.${APP_BASE_DOMAIN}`, '_blank');
                    }}
                    className="flex-1 h-11 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 rounded-xl transition-all flex items-center justify-center gap-2 group"
                >
                    <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{isMobile ? 'Preview' : 'View'}</span>
                </button>

                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="group flex-[2] h-11 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Zap className="w-3.5 h-3.5 fill-white group-hover:scale-110 transition-transform" />
                            <span>Publish</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
