'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings, ShieldCheck, Truck, MapPin,
    Upload, Info, AlertTriangle, Loader2, Save, Globe, X, Bike, Package, CheckCircle2,
    User, Briefcase, FileCheck, Landmark, FileText, ImageIcon, Camera, Building2
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { NIGERIAN_STATES, GHANA_REGIONS, KENYA_COUNTIES, SOUTH_AFRICA_PROVINCES } from '@/lib/nigeria-data';

export default function DispatchSettingsPage() {
    const { user, setUser } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingDoc, setUploadingDoc] = useState<'utility' | 'cac' | 'logo' | null>(null);

    const utilityFileRef = useRef<HTMLInputElement>(null);
    const cacFileRef = useRef<HTMLInputElement>(null);
    const logoFileRef = useRef<HTMLInputElement>(null);

    // Core state mapped from DB
    const [profile, setProfile] = useState<any>({
        companyName: '',
        phone: '',
        address: '',
        state: '',
        lga: '',
        country: 'Nigeria',
        vehicleTypes: ['BIKE'],
        isInterstate: false,
        coverageAreas: [],
        baseRates: [],
        isVerified: false,
        utilityBill: '',
        cacDocument: '',
        cacNumber: '',
        logo: '',
        // Local user details for display
        officerName: '',
        officerEmail: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('auth/me');
                if (res.data.user) {
                    const u = res.data.user;
                    const dp = u.dispatchProfile || {};

                    // Normalize vehicle types to ensure it's always an array
                    let vTypes = dp.vehicleTypes;
                    if (typeof vTypes === 'string') {
                        try { vTypes = JSON.parse(vTypes); } catch (e) { vTypes = [vTypes]; }
                    }
                    if (!Array.isArray(vTypes)) vTypes = ['BIKE'];

                    setProfile({
                        ...dp,
                        officerName: u.name || '',
                        officerEmail: u.email || '',
                        companyName: dp.companyName || '',
                        phone: dp.phone || u.phone || '',
                        address: dp.address || '',
                        state: dp.state || '',
                        lga: dp.lga || '',
                        country: dp.country || 'Nigeria',
                        vehicleTypes: vTypes,
                        coverageAreas: Array.isArray(dp.coverageAreas) ? dp.coverageAreas : [],
                        baseRates: Array.isArray(dp.baseRates) ? dp.baseRates : [],
                        isVerified: !!dp.isVerified,
                        utilityBill: dp.utilityBill || '',
                        cacDocument: dp.cacDocument || '',
                        cacNumber: dp.cacNumber || '',
                        logo: dp.logo || ''
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch profile', error);
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const selectedCountry = profile.country;
    const selectedState = profile.state;

    const getStateOptions = () => {
        if (selectedCountry === 'Nigeria') return NIGERIAN_STATES;
        if (selectedCountry === 'Ghana') return GHANA_REGIONS;
        if (selectedCountry === 'Kenya') return KENYA_COUNTIES;
        if (selectedCountry === 'South Africa') return SOUTH_AFRICA_PROVINCES;
        return [];
    };

    const availableStates = getStateOptions();
    const availableLgas = availableStates.find((s: any) => s.name === selectedState)?.lgas || [];

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            const response = await api.patch('dispatch/profile', {
                companyName: profile.companyName,
                phone: profile.phone,
                address: profile.address,
                state: profile.state,
                lga: profile.lga,
                country: profile.country,
                vehicleTypes: profile.vehicleTypes,
                isInterstate: profile.isInterstate,
                coverageAreas: profile.coverageAreas,
                baseRates: profile.baseRates,
                utilityBill: profile.utilityBill,
                cacDocument: profile.cacDocument,
                cacNumber: profile.cacNumber,
                logo: profile.logo
            });

            // Re-sync local auth state if needed
            if (user) {
                setUser({
                    ...user,
                    dispatchProfile: response.data
                });
            }

            toast.success('Hub Profile persists successfully!');
        } catch (error) {
            toast.error('Failed to update hub data');
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'utility' | 'cac' | 'logo') => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploadingDoc(type);
            const formData = new FormData();
            formData.append('file', file);

            const res = await api.post('dispatch/upload-doc', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (type === 'utility') {
                setProfile({ ...profile, utilityBill: res.data.url });
                toast.success('Utility bill uploaded successfully');
            } else if (type === 'cac') {
                setProfile({ ...profile, cacDocument: res.data.url });
                toast.success('CAC document uploaded successfully');
            } else {
                const newLogo = res.data.url;

                // Update local profile first
                const updatedProfile = { ...profile, logo: newLogo };
                setProfile(updatedProfile);

                // Now just use a full sync to be 100% sure and avoid partial update issues
                await api.patch('dispatch/profile', updatedProfile);

                // Re-sync local auth and force-refresh user data to be 100% sure
                if (user) {
                    const authRes = await api.get('auth/me');
                    if (authRes.data.user) {
                        setUser(authRes.data.user);
                    }
                }

                toast.success('Hub branding synchronized successfully');
            }
        } catch (error) {
            toast.error('Failed to upload document');
        } finally {
            setUploadingDoc(null);
        }
    };

    const addServiceRate = () => {
        const newRate = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'Bike',
            rate: 1500,
            location: 'Default Zone'
        };
        setProfile({
            ...profile,
            baseRates: [...profile.baseRates, newRate]
        });
    };

    const removeServiceRate = (id: string) => {
        setProfile({
            ...profile,
            baseRates: profile.baseRates.filter((s: any) => s.id !== id)
        });
    };

    const updateServiceRate = (id: string, field: string, value: any) => {
        setProfile({
            ...profile,
            baseRates: profile.baseRates.map((s: any) =>
                s.id === id ? { ...s, [field]: value } : s
            )
        });
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Syncing Hub Data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1800px] mx-auto space-y-10 pb-20 px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Hub Profile</h1>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">
                        Manage your delivery types, pricing, and coverage
                    </p>
                </div>

                {profile.isVerified ? (
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest self-start md:self-auto">
                        <ShieldCheck size={14} />
                        Elite Verified Partner
                    </div>
                ) : (
                    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest self-start md:self-auto">
                        <AlertTriangle size={14} />
                        Pending Verification
                    </div>
                )}
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">

                    {/* SECTION 1: OFFICER IDENTITY */}
                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 md:p-8 space-y-8 shadow-2xl">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-6">
                            <User className="text-emerald-500" size={20} />
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Officer Identity</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Full Legal Name"
                                value={profile.officerName}
                                disabled={true}
                                placeholder="Syncing..."
                            />
                            <InputField
                                label="Verified Email"
                                value={profile.officerEmail}
                                disabled={true}
                                placeholder="Syncing..."
                            />
                        </div>
                    </div>

                    {/* SECTION 2: BASE HUB IDENTITY (LOCKED) */}
                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 md:p-8 space-y-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-700 relative group overflow-hidden">
                                {profile.logo ? (
                                    <img src={profile.logo} className="w-full h-full object-cover" />
                                ) : (
                                    <Building2 size={24} />
                                )}
                                <div
                                    onClick={() => logoFileRef.current?.click()}
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                >
                                    {uploadingDoc === 'logo' ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <Camera size={18} className="text-white" />}
                                </div>
                                <input type="file" ref={logoFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
                            </div>
                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-2">Hub Logo</p>
                        </div>

                        <div className="flex items-center gap-3 border-b border-slate-800 pb-6">
                            <Briefcase className="text-emerald-500" size={20} />
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Base Hub Identity</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60 pointer-events-none grayscale-[0.5]">
                            <InputField
                                label="Company / Business Name"
                                value={profile.companyName}
                                disabled={true}
                            />
                            <InputField
                                label="Contact Phone Line"
                                value={profile.phone}
                                disabled={true}
                            />
                            <InputField
                                label="Base Nation"
                                value={profile.country}
                                disabled={true}
                            />
                            <InputField
                                label="Office Address"
                                value={profile.address}
                                disabled={true}
                            />
                            <InputField
                                label="Base State"
                                value={profile.state}
                                disabled={true}
                            />
                            <InputField
                                label="Base LGA"
                                value={profile.lga}
                                disabled={true}
                            />
                        </div>

                        <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 flex items-start gap-3">
                            <Info size={16} className="text-amber-500 mt-1 shrink-0" />
                            <p className="text-[9px] font-bold text-amber-500/80 uppercase leading-relaxed tracking-wider">
                                Hub Identification is locked to prevent spoofing. To update your legal business name or base location, please email <span className="text-amber-400 underline cursor-pointer">dispatch-ops@opnmart.com</span> with your certificate.
                            </p>
                        </div>
                    </div>

                    {/* SECTION 3: LOGISTICS RATES & ZONES */}
                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 md:p-8 space-y-8 shadow-2xl">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-6">
                            <Landmark className="text-emerald-500" size={20} />
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Logistics Rates & Zones</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[11px] font-black text-white uppercase tracking-widest">Service Pricing Matrix</p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter italic">Set your delivery rates for different vehicle classes and zones</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addServiceRate}
                                    className="text-[9px] font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-widest flex items-center gap-2 border border-emerald-500/20 px-4 py-2 rounded-xl bg-emerald-500/5 transition-all hover:bg-emerald-500/10 shadow-lg shadow-emerald-500/5"
                                >
                                    + New Rate Point
                                </button>
                            </div>

                            <div className="space-y-4">
                                {profile.baseRates.map((rate: any) => (
                                    <div key={rate.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 relative group transition-all hover:border-emerald-500/20 shadow-inner">
                                        <button
                                            type="button"
                                            onClick={() => removeServiceRate(rate.id)}
                                            className="absolute -top-2 -right-2 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl shadow-rose-500/20 hover:scale-110 z-10"
                                        >
                                            <X size={14} strokeWidth={3} />
                                        </button>

                                        <div className="space-y-2">
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Service Mode</p>
                                            <select
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
                                                value={rate.type}
                                                onChange={(e) => updateServiceRate(rate.id, 'type', e.target.value)}
                                            >
                                                <option value="Bike">🏍️ Bike</option>
                                                <option value="Car">🚗 Car</option>
                                                <option value="Van">🚐 Van</option>
                                                <option value="Truck">🚛 Truck</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Zone / Area</p>
                                            <select
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
                                                value={rate.location}
                                                onChange={(e) => updateServiceRate(rate.id, 'location', e.target.value)}
                                            >
                                                <option value="Default Zone">Default Zone</option>
                                                {availableLgas.map((lga: string) => (
                                                    <option key={lga} value={lga}>{lga}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Fee (₦)</p>
                                            <input
                                                type="number"
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-xs font-black text-emerald-500 outline-none focus:border-emerald-500/50"
                                                value={rate.rate}
                                                onChange={(e) => updateServiceRate(rate.id, 'rate', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* SECTION 5: SECURITY & COMPLIANCE */}
                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 md:p-8 space-y-8 shadow-2xl">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-6">
                            <FileCheck className="text-emerald-500" size={20} />
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Security & Compliance</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none ml-1">Utility Verification (NEPA Bill)</p>
                                <div
                                    onClick={() => utilityFileRef.current?.click()}
                                    className="border-2 border-dashed border-slate-800 rounded-3xl p-6 text-center space-y-3 hover:border-emerald-500/30 transition-all cursor-pointer group bg-slate-950/20 relative"
                                >
                                    <input
                                        type="file"
                                        ref={utilityFileRef}
                                        className="hidden"
                                        accept="image/*,.pdf"
                                        onChange={(e) => handleFileUpload(e, 'utility')}
                                    />
                                    {uploadingDoc === 'utility' ? (
                                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto" />
                                    ) : profile.utilityBill ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none">Bill Stored Successfully</p>
                                            <p className="text-[8px] text-slate-600 uppercase font-black tracking-tighter truncate max-w-[150px]">{profile.utilityBill.split('/').pop()}</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 bg-emerald-500/5 rounded-xl flex items-center justify-center mx-auto text-slate-600 group-hover:text-emerald-500 transition-colors">
                                                <ImageIcon size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Upload Bill Image</p>
                                                <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-1 block leading-none">Max 5MB</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <p className="text-[8px] font-bold text-slate-600 uppercase italic ml-1 leading-normal">Used to verify your physical operational hub.</p>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none ml-1">CAC Registration Number</p>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="RC-1234567"
                                        value={profile.cacNumber}
                                        onChange={(e) => setProfile({ ...profile, cacNumber: e.target.value })}
                                        className="w-full h-[116px] bg-slate-950 border border-slate-800 rounded-3xl px-6 text-center text-xl font-black text-white outline-none focus:border-emerald-500/50 placeholder:text-slate-800 transition-all"
                                    />
                                    <div className="absolute right-4 top-4 text-slate-600 group-hover:text-emerald-500 transition-colors">
                                        <ShieldCheck size={20} />
                                    </div>
                                </div>
                                <p className="text-[8px] font-bold text-slate-600 uppercase italic ml-1 leading-normal">Your official Corporate Affairs Commission identity.</p>
                            </div>

                            <div className="col-span-full space-y-4 pt-2">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none ml-1">CAC Registration Certificate</p>
                                <div
                                    onClick={() => cacFileRef.current?.click()}
                                    className="border-2 border-dashed border-slate-800 rounded-[2rem] p-10 text-center space-y-4 hover:border-emerald-500/30 transition-all cursor-pointer group bg-slate-950/20 shadow-inner"
                                >
                                    <input
                                        type="file"
                                        ref={cacFileRef}
                                        className="hidden"
                                        accept="image/*,.pdf"
                                        onChange={(e) => handleFileUpload(e, 'cac')}
                                    />
                                    {uploadingDoc === 'cac' ? (
                                        <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto" />
                                    ) : profile.cacDocument ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/10">
                                                <FileText size={32} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Certificate Secured</p>
                                                <p className="text-[9px] text-slate-500 uppercase font-black truncate max-w-xs mx-auto">{profile.cacDocument.split('/').pop()}</p>
                                            </div>
                                            <button className="text-[9px] font-black text-slate-600 hover:text-white uppercase tracking-widest transition-colors">Replace Document</button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-14 h-14 bg-emerald-500/5 rounded-2xl flex items-center justify-center mx-auto text-slate-600 group-hover:text-emerald-500 transition-colors group-hover:scale-110 duration-300">
                                                <Upload size={24} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-white uppercase tracking-widest">Upload Compliance PDF/JPG</p>
                                                <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-2 block italic">Legal requirement for enterprise verification</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50 group overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save size={20} className="group-hover:rotate-12 transition-transform" /> Persist Hub Updates</>}
                    </button>

                    <p className="text-[9px] font-bold text-slate-600 text-center uppercase tracking-widest pb-10">
                        Safety First: Your compliance data is encrypted and used only for internal verification.
                    </p>
                </div>

                {/* SIDEBAR */}
                <div className="space-y-6 order-1 lg:order-2 lg:sticky lg:top-8 h-fit">
                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 text-center space-y-6 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16" />

                        <div className="w-24 h-24 bg-slate-950 border border-slate-800 rounded-[2rem] mx-auto flex items-center justify-center text-4xl shadow-inner uppercase font-black text-emerald-500 relative overflow-hidden group">
                            {profile.logo ? (
                                <img src={profile.logo} className="w-full h-full object-cover" />
                            ) : (
                                profile.companyName?.charAt(0) || 'L'
                            )}
                            <div
                                onClick={() => logoFileRef.current?.click()}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white"
                            >
                                <Camera size={20} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center z-10">
                                <CheckCircle2 size={12} className={profile.isVerified ? 'text-emerald-500' : 'text-slate-700'} />
                            </div>
                        </div>

                        <div>
                            <p className="text-xl font-black text-white uppercase tracking-tighter truncate px-2 leading-none mb-3">{profile.companyName || 'Hub Profile'}</p>
                            <div className="flex items-center justify-center gap-2">
                                <p className="text-[9px] font-black text-slate-500 bg-slate-950 px-3 py-1.5 rounded-full uppercase tracking-widest border border-slate-800">ID: HUB-{user?.id?.slice(-6).toUpperCase()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Hub Health</p>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="space-y-4">
                            <StatusItem
                                label="Operational State"
                                value={profile.baseRates?.length > 0 ? "Active & Routing" : "Setup Required"}
                                color={profile.baseRates?.length > 0 ? "text-emerald-400" : "text-amber-400"}
                            />
                            <StatusItem
                                label="Pricing Nodes"
                                value={`${(profile.baseRates || []).length} Active Zones`}
                                color={(profile.baseRates || []).length > 0 ? "text-blue-400" : "text-slate-500"}
                            />
                            <StatusItem
                                label="Security Tier"
                                value={profile.isVerified ? 'Trust-Elite' : 'Pending-Audit'}
                                color={profile.isVerified ? 'text-emerald-500' : 'text-amber-500'}
                            />
                        </div>

                        <div className="pt-4 mt-6 border-t border-slate-800">
                            <div className="flex items-start gap-3 p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                                <Info size={16} className={profile.isVerified ? "text-emerald-500 mt-1 shrink-0" : "text-amber-500 mt-1 shrink-0"} />
                                <p className="text-[9px] font-medium text-slate-500 uppercase leading-relaxed tracking-tighter">
                                    {profile.isVerified
                                        ? "Your hub has achieved Trust-Elite status. You are fully cleared to receive high-value logistics requests natively on the platform."
                                        : "Upload your Utility Bill and CAC Certificate below. Our compliance team will review them within 48 hours for elite verification."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

function InputField({ label, value, onChange, placeholder, disabled = false }: any) {
    return (
        <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</p>
            <input
                type="text"
                value={value}
                disabled={disabled}
                onChange={(e) => onChange && onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full bg-slate-950 border border-slate-800 transition-all rounded-xl px-5 py-4 text-xs font-bold text-white placeholder:text-slate-800 outline-none ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : 'focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 focus:bg-slate-900'}`}
            />
        </div>
    );
}

function StatusItem({ label, value, color }: any) {
    return (
        <div className="flex justify-between items-center bg-slate-950/40 px-5 py-4 rounded-2xl border border-slate-800/60 hover:border-slate-800 transition-colors">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{value}</span>
        </div>
    );
}
