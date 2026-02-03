'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const { store, setStore } = useAuthStore();
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        officialEmail: '',
        biography: '',
        heroTitle: '',
        heroSubtitle: '',
        primaryColor: '#10b981',
        theme: 'MINIMAL_LUXE',
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [heroPreview, setHeroPreview] = useState<string | null>(null);

    const logoInputRef = useRef<HTMLInputElement>(null);
    const heroInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (store) {
            setFormData({
                name: store.name || '',
                officialEmail: (store as any).officialEmail || '',
                biography: (store as any).biography || '',
                heroTitle: (store as any).heroTitle || '',
                heroSubtitle: (store as any).heroSubtitle || '',
                primaryColor: (store as any).primaryColor || '#10b981',
                theme: (store as any).theme || 'MINIMAL_LUXE',
            });
            setLogoPreview((store as any).logo || null);
            setHeroPreview((store as any).heroImage || null);
        }
    }, [store]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'hero') => {
        const file = e.target.files?.[0];
        if (file) {
            if (type === 'logo') {
                setLogoFile(file);
                setLogoPreview(URL.createObjectURL(file));
            } else {
                setHeroFile(file);
                setHeroPreview(URL.createObjectURL(file));
            }
        }
    };

    const handleSave = async () => {
        if (!store?.id) return;
        setSaving(true);
        setMessage(null);

        try {
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                submitData.append(key, value);
            });

            if (logoFile) submitData.append('logo', logoFile);
            if (heroFile) submitData.append('heroImage', heroFile);

            const response = await api.patch(`/stores/${store.id}`, submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setStore(response.data);
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        } catch (error: any) {
            console.error('Update failed:', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update settings' });
        } finally {
            setSaving(false);
            // Auto hide message after 5 seconds
            setTimeout(() => setMessage(null), 5000);
        }
    };

    const tabs = [
        { id: 'general', label: 'General' },
        { id: 'store-profile', label: 'Store Profile' },
        { id: 'appearance', label: 'Store Appearance' },
        { id: 'domains', label: 'Domains' },
        { id: 'payments', label: 'Payments' },
        { id: 'ai', label: 'AI Copilot' },
    ];

    return (
        <div className="space-y-10 max-w-5xl">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
                    <p className="text-slate-500 mt-1">Configure your store, domains, and business preferences</p>
                </div>
                {message && (
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                        {message.text}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Side Navigation */}
                <div className="col-span-1 space-y-2">
                    {tabs.map((tab) => (
                        <SettingNav
                            key={tab.id}
                            label={tab.label}
                            active={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                    <div className="pt-4 border-t border-slate-100 mt-4">
                        <button className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 px-4">Delete Store</button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="lg:col-span-3 space-y-8">
                    {activeTab === 'general' && (
                        <>
                            <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <InputGroup
                                        label="Store Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                    <InputGroup label="Subdomain" value={store?.subdomain || ''} disabled />
                                </div>
                            </section>

                            <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">Enable AI Optimization</h3>
                                    <p className="text-xs text-slate-500 mt-1 max-w-sm">Allow OPNMRT AI to automatically adjust product SEO and suggestions.</p>
                                </div>
                                <div className="w-14 h-8 bg-primary rounded-full relative cursor-pointer shadow-inner">
                                    <div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </section>
                        </>
                    )}

                    {activeTab === 'store-profile' && (
                        <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Store Contact & Bio</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InputGroup
                                    label="Official Email"
                                    name="officialEmail"
                                    value={formData.officialEmail}
                                    onChange={handleInputChange}
                                    placeholder="hello@samstar.com"
                                />
                                <InputGroup label="Customer Support Phone" placeholder="+1..." disabled />
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Store Biography</label>
                                    <textarea
                                        name="biography"
                                        value={formData.biography}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 h-32"
                                        placeholder="Tell your customers about your brand..."
                                    ></textarea>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'appearance' && (
                        <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Brand Identity</h3>
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Store Logo</label>
                                        <input
                                            type="file"
                                            ref={logoInputRef}
                                            onChange={(e) => handleFileChange(e, 'logo')}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <div
                                            onClick={() => logoInputRef.current?.click()}
                                            className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden group"
                                        >
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain group-hover:opacity-50 transition-opacity" />
                                            ) : (
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Primary Brand Color</label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="color"
                                                name="primaryColor"
                                                value={formData.primaryColor}
                                                onChange={handleInputChange}
                                                className="w-12 h-12 rounded-xl cursor-pointer border-none p-0 bg-transparent"
                                            />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formData.primaryColor}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Hero Section Image</label>
                                    <input
                                        type="file"
                                        ref={heroInputRef}
                                        onChange={(e) => handleFileChange(e, 'hero')}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <div
                                        onClick={() => heroInputRef.current?.click()}
                                        className="w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden group"
                                    >
                                        {heroPreview ? (
                                            <img src={heroPreview} alt="Hero" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload Hero banner</span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <InputGroup
                                        label="Hero Title"
                                        name="heroTitle"
                                        value={formData.heroTitle}
                                        onChange={handleInputChange}
                                        placeholder="Your Store Headline"
                                    />
                                    <InputGroup
                                        label="Hero Subtitle"
                                        name="heroSubtitle"
                                        value={formData.heroSubtitle}
                                        onChange={handleInputChange}
                                        placeholder="A brief catchphrase"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Store Theme</label>

                                    <div className="space-y-12">
                                        {[
                                            { id: 'FASHION_ACCESSORIES', name: 'Fashion & Accessories' },
                                            { id: 'BEAUTY_SKINCARE', name: 'Beauty & Skincare' },
                                            { id: 'GADGETS_ACCESSORIES', name: 'Gadgets & Accessories' }
                                        ].map((category) => (
                                            <div key={category.id} className="space-y-4">
                                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter flex items-center gap-2">
                                                    <span className="w-8 h-px bg-slate-200"></span>
                                                    {category.name}
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {[
                                                        { id: 'MINIMAL_LUXE', name: 'Minimal Luxe', category: 'FASHION_ACCESSORIES', preview: 'bg-slate-50 flex items-center justify-center' },
                                                        { id: 'GLAMOUR_EVE', name: 'Glamour Eve', category: 'FASHION_ACCESSORIES', preview: 'bg-indigo-50 border border-indigo-100' },
                                                        { id: 'CHIC_URBAN', name: 'Chic Urban', category: 'FASHION_ACCESSORIES', preview: 'bg-zinc-900 border border-zinc-800' },

                                                        { id: 'VINTAGE_CHARM', name: 'Vintage Charm', category: 'BEAUTY_SKINCARE', preview: 'bg-[#fdfbf7] border border-stone-200' },
                                                        { id: 'PURE_BOTANICAL', name: 'Pure Botanical', category: 'BEAUTY_SKINCARE', preview: 'bg-emerald-50 border border-emerald-100' },
                                                        { id: 'RADIANT_GLOW', name: 'Radiant Glow', category: 'BEAUTY_SKINCARE', preview: 'bg-rose-50 border border-rose-100' },

                                                        { id: 'STARK_EDGE', name: 'Stark Edge', category: 'GADGETS_ACCESSORIES', preview: 'bg-white border-2 border-black' },
                                                        { id: 'TECH_SPEC', name: 'Tech Spec', category: 'GADGETS_ACCESSORIES', preview: 'bg-slate-900 border border-slate-700' },
                                                        { id: 'NEON_STREAM', name: 'Neon Stream', category: 'GADGETS_ACCESSORIES', preview: 'bg-black border border-cyan-500/30' },
                                                    ].filter(t => t.category === category.id).map((theme) => (
                                                        <div
                                                            key={theme.id}
                                                            onClick={() => setFormData(prev => ({ ...prev, theme: theme.id }))}
                                                            className={`group cursor-pointer rounded-3xl border-2 p-5 flex flex-col items-center gap-3 transition-all ${formData.theme === theme.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                                                        >
                                                            <div className={`w-full h-32 rounded-2xl shadow-sm overflow-hidden transition-transform group-hover:scale-[1.02] ${theme.preview}`}>
                                                                {theme.id === 'MINIMAL_LUXE' && <div className="w-12 h-2 bg-slate-200 rounded-full mt-14 mx-auto"></div>}
                                                                {theme.id === 'VINTAGE_CHARM' && <div className="w-full h-full p-3 flex flex-col gap-2"><div className="w-full h-px bg-stone-200 mt-2"></div><div className="mx-auto w-12 h-1 bg-stone-300"></div></div>}
                                                                {theme.id === 'STARK_EDGE' && <div className="w-full h-full flex flex-col"><div className="w-full h-6 bg-black"></div></div>}
                                                            </div>
                                                            <div className="text-center">
                                                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 block mb-1">{theme.name}</span>
                                                                {theme.id !== 'MINIMAL_LUXE' && theme.id !== 'VINTAGE_CHARM' && theme.id !== 'STARK_EDGE' && (
                                                                    <span className="text-[9px] font-medium text-slate-400">Design Coming Soon</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-10 font-medium italic">Selecting a theme will instantly update your storefront appearance across all pages.</p>
                                </div>
                            </div>
                        </section>
                    )}

                    {['domains', 'payments', 'ai'].includes(activeTab) && (
                        <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 py-20 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-black text-slate-900">Advanced Settings Coming Soon</h3>
                            <p className="text-xs text-slate-500 mt-1 max-w-sm">We're working hard to bring you more customization options. This section will be available in the next update.</p>
                        </section>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button
                            className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                            onClick={() => {
                                setMessage(null);
                                // Reset form to store values
                                if (store) {
                                    setFormData({
                                        name: store.name || '',
                                        officialEmail: (store as any).officialEmail || '',
                                        biography: (store as any).biography || '',
                                        heroTitle: (store as any).heroTitle || '',
                                        heroSubtitle: (store as any).heroSubtitle || '',
                                        primaryColor: (store as any).primaryColor || '#10b981',
                                        theme: (store as any).theme || 'MINIMAL_LUXE',
                                    });
                                    setLogoPreview((store as any).logo || null);
                                    setHeroPreview((store as any).heroImage || null);
                                }
                            }}
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`px-10 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-slate-200 flex items-center space-x-2 ${saving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black'
                                }`}
                        >
                            {saving && (
                                <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingNav({ label, active = false, onClick }: { label: string; active?: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}>
            {label}
        </button>
    );
}

function InputGroup({
    label,
    placeholder,
    value,
    defaultValue,
    disabled = false,
    name,
    onChange
}: {
    label: string;
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    disabled?: boolean;
    name?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
    return (
        <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{label}</label>
            <input
                type="text"
                name={name}
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue}
                disabled={disabled}
                onChange={onChange}
                className={`w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium outline-none transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-primary/20'}`}
            />
        </div>
    );
}
