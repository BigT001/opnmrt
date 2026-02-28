'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2, AlertCircle, Loader2, Search,
    CreditCard, RefreshCw, Info, ShieldCheck,
    Instagram, Twitter, Facebook, Music, Palette,
    Image as ImageIcon, UploadCloud, Copy, Check, Tag, Plus, X
} from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('store-profile');
    const { user, store, setStore } = useAuthStore();
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        ownerName: '',
        officialEmail: '',
        whatsappNumber: '',
        address: '',
        instagram: '',
        twitter: '',
        facebook: '',
        tiktok: '',
        primaryColor: '#10b981',
        logo: '',
        // BigT AI Capabilities
        aiMessaging: false,
        aiInventory: false,
        aiStrategy: false,
        aiFinancials: false,
    });
    const [categories, setCategories] = useState<string[]>([]);
    const [categoryInput, setCategoryInput] = useState('');

    const logoInputRef = React.useRef<HTMLInputElement>(null);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);



    useEffect(() => {
        if (store) {
            setFormData({
                name: store.name || '',
                ownerName: store.ownerName || user?.name || '',
                officialEmail: store.officialEmail || user?.email || '',
                whatsappNumber: store.whatsappNumber || user?.phone || '',
                address: store.address || '',
                instagram: (store as any).instagram || '',
                twitter: (store as any).twitter || '',
                facebook: (store as any).facebook || '',
                tiktok: (store as any).tiktok || '',
                primaryColor: (store as any).primaryColor || '#10b981',
                logo: store.logo || '',
                aiMessaging: (store as any).aiMessaging || false,
                aiInventory: (store as any).aiInventory || false,
                aiStrategy: (store as any).aiStrategy || false,
                aiFinancials: (store as any).aiFinancials || false,
            });
            // Load saved categories
            try {
                const saved = (store as any).categories;
                setCategories(Array.isArray(saved) ? saved : (saved ? JSON.parse(saved) : []));
            } catch { setCategories([]); }
        }
    }, [store, user]);

    const addCategory = () => {
        const val = categoryInput.trim();
        if (val && !categories.includes(val)) {
            setCategories(prev => [...prev, val]);
        }
        setCategoryInput('');
    };

    const removeCategory = (cat: string) => {
        setCategories(prev => prev.filter(c => c !== cat));
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingLogo(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await api.post('/stores/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, logo: res.data.url }));
            setMessage({ type: 'success', text: 'Logo uploaded! Don\'t forget to save changes.' });
        } catch (err) {
            console.error('Logo upload failed:', err);
            setMessage({ type: 'error', text: 'Failed to upload logo' });
        } finally {
            setIsUploadingLogo(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };



    const handleSave = async () => {
        if (!store?.id) return;
        setSaving(true);
        setMessage(null);

        try {
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                submitData.append(key, String(value));
            });
            // Save categories as JSON string
            submitData.append('categories', JSON.stringify(categories));


            submitData.set('whatsappNumber', formData.whatsappNumber);

            const response = await api.patch(`/stores/${store.id}`, submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setStore(response.data);
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update settings' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    const tabs = [
        { id: 'general', label: 'General' },
        { id: 'store-profile', label: 'Store Profile' },
        { id: 'ai-assistant', label: 'AI Assistant' },
        { id: 'domains', label: 'Domains' },
        { id: 'payments', label: 'Payments' },
    ];

    const isGeneralIncomplete = !formData.name;
    const isProfileIncomplete = !formData.officialEmail || !formData.whatsappNumber;
    const isPaymentsIncomplete = !store?.paystackPublicKey || !store?.paystackSecretKey;

    const isIncomplete = (id: string) => {
        if (id === 'general') return isGeneralIncomplete;
        if (id === 'store-profile') return isProfileIncomplete;
        if (id === 'payments') return isPaymentsIncomplete;
        return false;
    };

    const isPaymentsTab = activeTab === 'payments';

    return (
        <div className="space-y-10 max-w-5xl">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
                </div>
                {message && (
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                        {message.text}
                    </div>
                )}
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
                {/* Side Navigation */}
                <div className="col-span-1 space-y-2 lg:sticky lg:top-8">
                    {tabs.map((tab) => (
                        <SettingNav
                            key={tab.id}
                            label={tab.label}
                            active={activeTab === tab.id}
                            incomplete={isIncomplete(tab.id)}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                    <div className="pt-4 border-t border-slate-200 mt-4">
                        <button className="text-[10px] font-black uppercase tracking-widest text-rose-600 hover:text-rose-700 px-4">Delete Store</button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="lg:col-span-3 space-y-8">

                    {activeTab === 'general' && (
                        <div className="space-y-8">
                            <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Seller Information</h3>
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[9px] font-black uppercase tracking-widest">Personal Details</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <InputGroup label="Seller Full Name" name="ownerName" value={formData.ownerName} onChange={handleInputChange} placeholder="John Doe" />
                                    <InputGroup label="Phone Number" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange} placeholder="+234..." />
                                    <InputGroup label="Email Address" name="officialEmail" value={formData.officialEmail} onChange={handleInputChange} placeholder="hello@yourbrand.com" />
                                    <InputGroup label="Store Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Store Lane, City, Nigeria" />
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'store-profile' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Store Identity */}
                            <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white overflow-hidden">
                                        {formData.logo ? (
                                            <img src={formData.logo} alt="Store Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <Building2 size={24} />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900">Store Identity</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Basic information about your storefront.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <InputGroup label="Store Name" name="name" value={formData.name} onChange={handleInputChange} />
                                    <InputGroup label="Subdomain" value={store?.subdomain || ''} disabled />
                                </div>
                            </section>

                            {/* Brand Logo + Brand Identity — side by side */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Brand Logo */}
                                <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                                            <ImageIcon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-slate-900">Brand Logo</h3>
                                            <p className="text-[10px] text-slate-500">Upload your store's primary logo.</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-5">
                                        <div className="relative">
                                            <div className="w-28 h-28 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                                                {formData.logo ? (
                                                    <img src={formData.logo} alt="Store Logo" className="w-full h-full object-contain p-3" />
                                                ) : (
                                                    <ImageIcon className="w-8 h-8 text-slate-300" />
                                                )}
                                                {isUploadingLogo && (
                                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                                        <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-full space-y-2">
                                            <p className="text-[9px] text-slate-400 font-medium text-center">PNG or SVG · Transparent BG · 512×512px</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => logoInputRef.current?.click()}
                                                    disabled={isUploadingLogo}
                                                    className="flex-1 h-10 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
                                                >
                                                    <UploadCloud size={14} />
                                                    {formData.logo ? 'Change' : 'Upload'}
                                                </button>
                                                {formData.logo && (
                                                    <button
                                                        onClick={() => setFormData(prev => ({ ...prev, logo: '' }))}
                                                        className="h-10 px-4 bg-white border border-slate-200 text-rose-500 rounded-xl text-[9px] font-black uppercase hover:bg-rose-50 transition-all"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                            <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                                        </div>
                                    </div>
                                </section>

                                {/* Brand Identity */}
                                <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                                            <Palette size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-slate-900">Brand Identity</h3>
                                            <p className="text-[10px] text-slate-500">Define your store's visual appearance.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3">Primary Brand Color</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    name="primaryColor"
                                                    value={formData.primaryColor}
                                                    onChange={handleInputChange}
                                                    className="w-14 h-14 rounded-2xl border-4 border-white shadow-xl cursor-pointer overflow-hidden p-0"
                                                />
                                                <input
                                                    type="text"
                                                    name="primaryColor"
                                                    value={formData.primaryColor}
                                                    onChange={handleInputChange}
                                                    className="flex-1 h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-mono font-bold text-slate-900 uppercase"
                                                    placeholder="#000000"
                                                />
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3">
                                            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-slate-500 leading-relaxed">Applied to buttons, links, and accents across your storefront automatically.</p>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Social Media + Categories — side by side */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Social Presence */}
                                <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                                            <Instagram size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-slate-900">Social Media</h3>
                                            <p className="text-[10px] text-slate-500">Link your accounts to your storefront.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { icon: <Instagram size={16} />, name: 'instagram', placeholder: 'Instagram URL' },
                                            { icon: <Twitter size={16} />, name: 'twitter', placeholder: 'Twitter / X URL' },
                                            { icon: <Facebook size={16} />, name: 'facebook', placeholder: 'Facebook URL' },
                                            { icon: <Music size={16} />, name: 'tiktok', placeholder: 'TikTok URL' },
                                        ].map(({ icon, name, placeholder }) => (
                                            <div key={name} className="relative">
                                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
                                                <input
                                                    type="text"
                                                    name={name}
                                                    placeholder={placeholder}
                                                    value={(formData as any)[name]}
                                                    onChange={handleInputChange}
                                                    className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Store Categories */}
                                <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                            <Tag size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-slate-900">Store Categories</h3>
                                            <p className="text-[10px] text-slate-500">Shown on your storefront nav &amp; product uploads.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Input */}
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="e.g. Shoes, Electronics..."
                                                value={categoryInput}
                                                onChange={e => setCategoryInput(e.target.value)}
                                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCategory(); } }}
                                                className="flex-1 h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 transition-all placeholder:text-slate-400"
                                            />
                                            <button
                                                type="button"
                                                onClick={addCategory}
                                                className="h-11 w-11 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-all shadow-sm"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        {/* Category tags */}
                                        {categories.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                                                {categories.map(cat => (
                                                    <span
                                                        key={cat}
                                                        className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full"
                                                    >
                                                        {cat}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeCategory(cat)}
                                                            className="w-4 h-4 rounded-full bg-white/20 hover:bg-rose-500 transition-colors flex items-center justify-center"
                                                        >
                                                            <X size={9} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-100 rounded-2xl">
                                                <Tag className="w-6 h-6 text-slate-200 mb-2" />
                                                <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">No categories yet</p>
                                                <p className="text-[9px] text-slate-300 mt-1">Type above and press Enter or +</p>
                                            </div>
                                        )}

                                        {categories.length > 0 && (
                                            <p className="text-[9px] text-slate-400 font-medium">{categories.length} categor{categories.length === 1 ? 'y' : 'ies'} · visible on storefront nav &amp; product form</p>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </div>
                    )}





                    {activeTab === 'ai-assistant' && (
                        <div className="space-y-8">
                            <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                            BigT AI Assistant
                                            <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Active</span>
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">Configure how BigT manages your commerce operations.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <AiCapabilityToggle
                                        title="Auto-Pilot Messaging"
                                        description="Allow BigT to automatically respond to customer inquiries based on your store context and policies."
                                        enabled={formData.aiMessaging}
                                        onToggle={() => setFormData(f => ({ ...f, aiMessaging: !f.aiMessaging }))}
                                        icon="💬"
                                    />
                                    <AiCapabilityToggle
                                        title="Inventory & Stock Monitoring"
                                        description="Enable proactive stock tracking, low inventory alerts, and automated restock recommendations."
                                        enabled={formData.aiInventory}
                                        onToggle={() => setFormData(f => ({ ...f, aiInventory: !f.aiInventory }))}
                                        icon="📦"
                                    />
                                    <AiCapabilityToggle
                                        title="Sales & Growth Strategy"
                                        description="Receive AI-driven marketing campaigns, product bundle ideas, and psychological pricing suggestions."
                                        enabled={formData.aiStrategy}
                                        onToggle={() => setFormData(f => ({ ...f, aiStrategy: !f.aiStrategy }))}
                                        icon="📈"
                                    />
                                    <AiCapabilityToggle
                                        title="Financial & Performance Insights"
                                        description="Deep analysis of revenue patterns, profit margins, and seasonal sales forecasting."
                                        enabled={formData.aiFinancials}
                                        onToggle={() => setFormData(f => ({ ...f, aiFinancials: !f.aiFinancials }))}
                                        icon="💰"
                                    />
                                </div>
                            </section>

                            <section className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="max-w-md">
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Pro Intelligence</p>
                                        <h3 className="text-2xl font-black tracking-tight mb-2">Maximize your ROI with BigT</h3>
                                        <p className="text-sm text-slate-400 font-medium leading-relaxed">Pro users get exclusive access to real-time competitor benchmarking and 24/7 proactive customer outreach.</p>
                                    </div>
                                    <button className="h-14 px-8 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-indigo-600/20">Upgrade Now</button>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'domains' && (
                        <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 py-20 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-black text-slate-900">Custom Domains Coming Soon</h3>
                            <p className="text-xs text-slate-500 mt-1 max-w-sm">We're working hard to bring you domain management. This section will be available in the next update.</p>
                        </section>
                    )}

                    {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                        PAYMENTS TAB — Full Subaccount Architecture
                    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                    {activeTab === 'payments' && (
                        <PaymentsSection store={store} user={user} />
                    )}

                    {!isPaymentsTab && (
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                onClick={() => {
                                    setMessage(null);
                                    if (store) {
                                        setFormData({
                                            name: store.name || '',
                                            ownerName: store.ownerName || '',
                                            officialEmail: store.officialEmail || '',
                                            whatsappNumber: store.whatsappNumber || '',
                                            address: store.address || '',
                                            instagram: (store as any).instagram || '',
                                            twitter: (store as any).twitter || '',
                                            facebook: (store as any).facebook || '',
                                            tiktok: (store as any).tiktok || '',
                                            primaryColor: (store as any).primaryColor || '#10b981',
                                            logo: store.logo || '',
                                            aiMessaging: (store as any).aiMessaging || false,
                                            aiInventory: (store as any).aiInventory || false,
                                            aiStrategy: (store as any).aiStrategy || false,
                                            aiFinancials: (store as any).aiFinancials || false,
                                        });
                                    }
                                }}
                            >
                                Discard
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className={`px-10 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-slate-200 flex items-center space-x-2 ${saving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black'}`}
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
                    )}
                </div>
            </div>
        </div>
    );
}

// ════════════════════════════════════════════════════════════════════
// PAYMENTS SECTION — Subaccount Setup + Transaction Dashboard
// ════════════════════════════════════════════════════════════════════
function PaymentsSection({ store, user }: { store: any; user: any }) {
    const { setStore } = useAuthStore();
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [formData, setFormData] = useState({
        paystackPublicKey: store?.paystackPublicKey || '',
        paystackSecretKey: store?.paystackSecretKey || '',
        paystackWebhookSecret: store?.paystackWebhookSecret || '',
    });

    useEffect(() => {
        if (store) {
            setFormData({
                paystackPublicKey: store.paystackPublicKey || '',
                paystackSecretKey: store.paystackSecretKey || '',
                paystackWebhookSecret: store.paystackWebhookSecret || '',
            });
        }
    }, [store]);

    const isConnected = store?.paystackPublicKey && store?.paystackSecretKey;

    const handleSave = async () => {
        setSubmitting(true);
        setMessage(null);
        try {
            const res = await api.patch(`/stores/${store.id}`, formData);
            setStore(res.data);
            setMessage({ type: 'success', text: 'Paystack keys updated successfully!' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update Paystack keys' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* ── Status Banner ── */}
            <div className={`rounded-[2rem] p-6 flex items-center gap-5 ${isConnected
                ? 'bg-emerald-50 border border-emerald-100'
                : 'bg-amber-50 border border-amber-100'
                }`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isConnected ? 'bg-emerald-500' : 'bg-amber-400'} text-white`}>
                    {isConnected ? <ShieldCheck className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                    <h3 className={`font-black text-sm ${isConnected ? 'text-emerald-800' : 'text-amber-800'}`}>
                        {isConnected ? 'Paystack Account Connected' : 'Direct Paystack Integration Required'}
                    </h3>
                    <p className={`text-xs mt-0.5 font-medium ${isConnected ? 'text-emerald-600' : 'text-amber-700'}`}>
                        {isConnected
                            ? 'Your store is currently using your own Paystack account for processing payments.'
                            : 'Connect your own Paystack account by providing your API keys from the Paystack Dashboard.'}
                    </p>
                </div>
            </div>

            {/* ── Paystack Notice ── */}
            <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-900 leading-relaxed font-medium">
                    By using your own Paystack account, funds go directly to your Paystack balance.
                    Ensure your <strong className="text-slate-900">Webhook URL</strong> in Paystack is set to your store's webhook endpoint to receive payment confirmations.
                </p>
            </div>

            {/* ── Paystack Keys Setup ── */}
            <section className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-slate-100 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-slate-900">API Credentials</h3>
                        <p className="text-[11px] text-slate-900 font-medium">Connect your store using your Paystack Live keys</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <InputGroup
                        label="Paystack Public Key"
                        placeholder="pk_live_..."
                        value={formData.paystackPublicKey}
                        onChange={(e) => setFormData({ ...formData, paystackPublicKey: e.target.value })}
                    />
                    <InputGroup
                        label="Paystack Secret Key"
                        placeholder="sk_live_..."
                        value={formData.paystackSecretKey}
                        onChange={(e) => setFormData({ ...formData, paystackSecretKey: e.target.value })}
                    />
                    <InputGroup
                        label="Paystack Webhook Secret"
                        placeholder="Optional"
                        value={formData.paystackWebhookSecret}
                        onChange={(e) => setFormData({ ...formData, paystackWebhookSecret: e.target.value })}
                    />

                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Your Unique Webhook URL</h4>
                            <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase">Required for Paystack</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">Copy this URL and paste it into "Webhook URL" in your Paystack Dashboard settings.</p>
                        <div className="flex gap-2">
                            <code className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-mono text-indigo-600 break-all">
                                {`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/payments/webhook/${store?.id}`}
                            </code>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/payments/webhook/${store?.id}`);
                                    setMessage({ type: 'success', text: 'Webhook URL copied!' });
                                }}
                                className="aspect-square w-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={submitting || !formData.paystackPublicKey || !formData.paystackSecretKey}
                        className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Updating...</>
                        ) : (
                            <><ShieldCheck className="w-5 h-5" /> Save Paystack Credentials</>
                        )}
                    </button>
                </div>
            </section>
        </div>
    );
}

// ─── Reused Components ──────────────────────────────────────────────
function SettingNav({ label, active = false, onClick, incomplete = false }: { label: string; active?: boolean; onClick: () => void; incomplete?: boolean }) {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative flex items-center justify-between ${active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-800 hover:bg-slate-50 hover:text-slate-900'}`}>
            <span>{label}</span>
            {incomplete && (
                <span className={`px-1.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-tighter ${active ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                    Incomplete
                </span>
            )}
        </button>
    );
}

function AiCapabilityToggle({ title, description, enabled, onToggle, icon }: { title: string; description: string; enabled: boolean; onToggle: () => void; icon: string }) {
    return (
        <div className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between gap-6 ${enabled ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl shrink-0">
                    {icon}
                </div>
                <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1">{title}</h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-sm">{description}</p>
                </div>
            </div>
            <button
                onClick={onToggle}
                className={`w-14 h-8 rounded-full relative transition-colors duration-300 shrink-0 ${enabled ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-200'}`}
            >
                <motion.div
                    animate={{ x: enabled ? 28 : 4 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
                />
            </button>
        </div>
    );
}

function InputGroup({ label, placeholder, value, defaultValue, disabled = false, name, onChange }: {
    label: string; placeholder?: string; value?: string; defaultValue?: string; disabled?: boolean; name?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}) {
    return (
        <div>
            <label className="block text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3">{label}</label>
            <input
                type="text"
                name={name}
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue}
                disabled={disabled}
                onChange={onChange}
                className={`w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-900 outline-none transition-all placeholder:text-slate-500 ${disabled ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-primary/20'}`}
            />
        </div>
    );
}
