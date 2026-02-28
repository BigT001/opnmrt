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
}

const SectionHeader = ({ id, icon: Icon, title, active, onClick }: { id: string, icon: any, title: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-1 group"
    >
        <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${active ? 'text-primary' : 'text-slate-400'}`} />
            <h3 className={`text-[11px] font-black uppercase tracking-wider transition-colors ${active ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-700'}`}>{title}</h3>
        </div>
        <ChevronRight className={`w-3 h-3 text-slate-300 transition-transform duration-300 ${active ? 'rotate-90' : ''}`} />
    </button>
);

export function ThemeEditor({ config, onChange, onSave, onClose, isSaving, subdomain, currentPath = 'index', onPathChange, pages }: ThemeEditorProps) {
    const [isUploading, setIsUploading] = React.useState(false);
    const defaultPages = [
        { id: 'index', name: 'Home Page', desc: 'Main Storefront', icon: Home },
        { id: 'shop', name: 'Shop / Collections', desc: 'Product Listing', icon: LayoutGrid },
        { id: 'about', name: 'About / Story', desc: 'Brand Narrative', icon: Type }
    ];
    const displayPages = pages || defaultPages;

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

    const updateArray = (key: 'primaryNav' | 'categories', index: number, value: any, action: 'edit' | 'add' | 'remove') => {
        const currentArr = Array.isArray(config[key]) ? [...(config[key] as any[])] : (key === 'primaryNav' ? [
            { name: config.navHome || 'Home', href: `/store/${subdomain}`, key: 'navHome' },
            { name: config.navBlog || 'Blog', href: `/store/${subdomain}/blog`, key: 'navBlog' },
            { name: config.navContact || 'Contact', href: `/store/${subdomain}/contact`, key: 'navContact' },
        ] : [
            'All Categories',
            'Electronics',
            'Smartphones'
        ]);

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

    return (
        <div className="w-[350px] bg-white border-l border-slate-100 flex flex-col h-full shadow-2xl relative z-[100]">
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800&family=Crimson+Pro:wght@800&family=JetBrains+Mono:wght@800&family=Outfit:wght@900&display=swap');
                .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
                .font-serif { font-family: 'Crimson Pro', serif; }
                .font-mono { font-family: 'JetBrains Mono', monospace; }
                .font-display { font-family: 'Outfit', sans-serif; }
            `}</style>
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

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10 pt-8">
                {/* Store Navigation Section */}
                <section className="space-y-4">
                    <SectionHeader id="navigation" icon={Layout} title="Store Navigation" active={openSection === 'navigation'} onClick={() => toggleSection('navigation')} />

                    <AnimatePresence>
                        {openSection === 'navigation' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-3"
                            >
                                {displayPages.map((page) => (
                                    <button
                                        key={page.id}
                                        onClick={() => onPathChange?.(page.id)}
                                        className={`w-full p-4 rounded-3xl border text-left transition-all relative group/page ${currentPath === page.id
                                            ? 'border-indigo-600 bg-indigo-50/30 shadow-md translate-y-[-2px]'
                                            : 'border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center transition-transform group-hover/page:scale-110 shadow-sm`}>
                                                    <page.icon className={`w-5 h-5 ${currentPath === page.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                                                </div>
                                                <div>
                                                    <span className={`text-[11px] font-black uppercase tracking-widest block ${currentPath === page.id ? 'text-slate-900' : 'text-slate-500'}`}>{page.name}</span>
                                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{page.desc}</div>
                                                </div>
                                            </div>
                                            {currentPath === page.id && (
                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-100 text-indigo-600 rounded-lg text-[7px] font-black uppercase tracking-tighter">
                                                    <Eye className="w-2.5 h-2.5" />
                                                    <span>Active</span>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}

                                <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3 items-start">
                                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                    <p className="text-[8px] font-bold text-amber-700 uppercase tracking-wider leading-relaxed">
                                        Pro Tip: You can also click links directly in the preview to switch pages!
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* Navigation & Menus Section */}
                <section className="space-y-4">
                    <SectionHeader id="menus" icon={MenuIcon} title="Navigation & Menus" active={openSection === 'menus'} onClick={() => toggleSection('menus')} />

                    <AnimatePresence>
                        {openSection === 'menus' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-6 pb-2"
                            >
                                {/* Categories Manager */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">Browse Categories</label>
                                        <button
                                            onClick={() => updateArray('categories', 0, 'New Category', 'add')}
                                            className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {(config.categories || ['All Categories', 'Electronics', 'Smartphones']).map((cat: string, idx: number) => (
                                            <div key={idx} className="flex gap-2 group/item">
                                                <input
                                                    value={cat}
                                                    onChange={(e) => updateArray('categories', idx, e.target.value, 'edit')}
                                                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-700 outline-none focus:border-indigo-600/30 focus:bg-white transition-all"
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
                                </div>

                                {/* Primary Nav Manager */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">Primary Navbar Links</label>
                                        <button
                                            onClick={() => updateArray('primaryNav', 0, { name: 'New Link', href: '#' }, 'add')}
                                            className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {(config.primaryNav || [
                                            { name: 'Home', href: `/store/${subdomain}` },
                                            { name: 'Shop', href: `/store/${subdomain}/shop` }
                                        ]).map((link: any, idx: number) => (
                                            <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 group/item relative">
                                                <input
                                                    placeholder="Label (e.g. Laptops)"
                                                    value={link.name}
                                                    onChange={(e) => updateArray('primaryNav', idx, { ...link, name: e.target.value }, 'edit')}
                                                    className="w-full bg-white border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-900 outline-none focus:border-indigo-600/30 transition-all"
                                                />
                                                <div className="bg-white border border-slate-100 rounded-xl px-3 py-2 flex items-center gap-2">
                                                    <Settings className="w-3 h-3 text-slate-300 shrink-0" />
                                                    <input
                                                        placeholder="Path (e.g. /store/myshop/shop)"
                                                        value={link.href}
                                                        onChange={(e) => updateArray('primaryNav', idx, { ...link, href: e.target.value }, 'edit')}
                                                        className="flex-1 bg-transparent text-[9px] font-bold text-slate-500 outline-none"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => updateArray('primaryNav', idx, null, 'remove')}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-white shadow-md border border-slate-100 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover/item:opacity-100 scale-75 group-hover/item:scale-100"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* Visual Identity Section */}
                <section className="space-y-4">
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
                                            <div className="w-1 h-1 rounded-full bg-indigo-400" />
                                            <div className="w-1 h-1 rounded-full bg-indigo-200" />
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
                                        className="w-full aspect-[2/1] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-indigo-600/30 hover:bg-indigo-50/30 transition-all overflow-hidden relative"
                                    >
                                        {isUploading ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <RefreshCcw className="w-6 h-6 text-indigo-600 animate-spin" />
                                                <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Processing...</span>
                                            </div>
                                        ) : config.logo ? (
                                            <>
                                                <img src={config.logo} className="w-full h-full object-contain p-6 drop-shadow-sm" alt="Store Logo" />
                                                <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[2px]">
                                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl">
                                                        <RefreshCcw className="w-4 h-4 text-indigo-600" />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 bg-white rounded-3xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-500">
                                                    <ImageIcon className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
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
                <section className="space-y-4">
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
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
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
                                                    className={`w-8 h-8 rounded-xl border-2 transition-all relative group ${config.primaryColor === color ? 'border-indigo-600 scale-110 shadow-lg' : 'border-white hover:scale-105 shadow-sm'}`}
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
                <section className="space-y-4">
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
                                        className={`w-full p-4 rounded-3xl border text-left transition-all relative group/font ${config.primaryFont === font.id
                                            ? 'border-indigo-600 bg-indigo-50/30'
                                            : 'border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'}`}
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
                                                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200">
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
                <section className="space-y-4">
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
                                        <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">{config.borderRadius || '2.5rem'}</span>
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
                                                className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center group transition-all ${config.borderRadius === radius.id ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 hover:border-slate-200 text-slate-400'}`}
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

                                <div className="p-5 rounded-[2.5rem] bg-indigo-600 text-white space-y-3 shadow-xl shadow-indigo-200 relative overflow-hidden">
                                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                                    <h5 className="text-[10px] font-black uppercase tracking-widest leading-none">Aura Design Engine</h5>
                                    <p className="text-[8px] font-bold text-white/70 uppercase tracking-widest leading-relaxed">Let AI optimize your layout density and visual hierarchy.</p>
                                    <button className="w-full py-2.5 bg-white text-indigo-600 rounded-xl text-[8px] font-black uppercase tracking-widest transition-transform active:scale-95 shadow-lg">
                                        Fast Optimize
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </div>

            <div className="p-6 border-t border-slate-100 bg-white flex gap-3">
                <button
                    onClick={() => window.open(`http://${subdomain}.localhost:3000`, '_blank')}
                    className="flex-1 h-14 bg-white border border-slate-100 text-slate-600 hover:text-slate-900 rounded-2xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 group"
                >
                    <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest">View</span>
                </button>

                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="group flex-[2] h-14 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <RefreshCcw className="w-3.5 h-3.5 animate-spin text-primary" />
                            <span>...</span>
                        </>
                    ) : (
                        <>
                            <Zap className="w-3.5 h-3.5 text-orange-400 fill-orange-400 group-hover:scale-110 transition-transform" />
                            <span>Publish</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
