'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { User, Mail, Save, Loader2, ShieldCheck, Camera, Phone, MapPin, CreditCard, Plus } from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomerProfilePage() {
    const { subdomain } = useParams<{ subdomain: string }>();
    const [profile, setProfile] = useState<any>({
        name: '',
        id: '',
        email: '',
        phone: '', // Ensure not null
        image: '',
        shippingAddress: {
            firstName: '',
            lastName: '', // Ensure strict initialization
            address: '',
            city: '',
            postalCode: '',
            country: ''
        },
        savedCards: []
    });
    const [initialName, setInitialName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await api.get('/users/profile');
                setProfile({
                    ...res.data,
                    phone: res.data.phone || '', // Ensure phone is never null
                    // Ensure nested objects exist to avoid undefined errors
                    shippingAddress: res.data.shippingAddress || {
                        firstName: '',
                        lastName: '',
                        address: '',
                        city: '',
                        postalCode: '',
                        country: ''
                    },
                    savedCards: res.data.savedCards || []
                });
                if (res.data.name) {
                    setInitialName(res.data.name);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('name', profile.name);
        formData.append('email', profile.email);
        formData.append('phone', profile.phone);
        // Important: Serialize Objects
        formData.append('shippingAddress', JSON.stringify(profile.shippingAddress));
        // We aren't editing cards here directly, but if we were, we'd send them too.
        // formData.append('savedCards', JSON.stringify(profile.savedCards)); 

        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        try {
            const res = await api.patch('/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Update local state with returned data (especially image URL)
            // Ideally backend returns full updated object
            setProfile((prev: any) => ({
                ...prev,
                image: res.data.image || prev.image,
                name: res.data.name || prev.name,
                shippingAddress: res.data.shippingAddress || prev.shippingAddress
            }));

            if (res.data.name) setInitialName(res.data.name);
            setPreviewUrl(null);
            setSelectedFile(null);

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
    const [changingPassword, setChangingPassword] = useState(false);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setChangingPassword(true);
        setMessage(null);
        try {
            await api.patch('/users/change-password', passwordData);
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password' });
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-40 bg-white rounded-[2.5rem] border border-slate-100"></div>
                <div className="h-80 bg-white rounded-[2.5rem] border border-slate-100"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="shrink-0">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Profile Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 uppercase text-[10px] font-bold tracking-widest">
                    Manage your account information and preferences
                </p>
            </div>

            <div className="space-y-8">
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl text-xs font-bold text-center ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                            }`}
                    >
                        {message.text}
                    </motion.div>
                )}

                {/* Avatar & ID Section */}
                <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-8 transition-colors duration-300">
                    <div className="relative group shrink-0">
                        <div className="w-24 h-24 bg-slate-900 dark:bg-white rounded-[2rem] flex items-center justify-center text-white dark:text-black font-black text-3xl shadow-xl shadow-slate-200 dark:shadow-none overflow-hidden relative">
                            {previewUrl || profile.image ? (
                                <img src={previewUrl || profile.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                profile.name ? profile.name.trim().split(/\s+/).map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '??'
                            )}

                            {/* Upload Overlay */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                type="button"
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <Camera className="w-8 h-8 text-white" />
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{profile.name || 'Set your name'}</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                ID:
                            </div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white tracking-widest uppercase">
                                {profile.id ? `CUST-${profile.id.slice(-6)}` : 'UNKNOWN'}
                            </p>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Customer Account</p>
                    </div>
                </div>

                {/* Main Profile Form (Personal + Shipping) */}
                <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information */}
                    <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 transition-colors duration-300">
                        <div className="flex items-center gap-3 mb-2">
                            <User className="w-5 h-5 text-slate-900 dark:text-white" />
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Personal Information</h3>
                        </div>

                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-slate-900 transition-colors">
                                        <User strokeWidth={2.5} />
                                    </div>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className={`w-full h-16 pl-14 pr-8 bg-slate-50 dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-slate-200 dark:focus:border-slate-700 focus:ring-4 focus:ring-slate-100/50 dark:focus:ring-slate-800/50 transition-all text-slate-900 dark:text-white ${initialName ? 'opacity-60 cursor-not-allowed' : ''}`}
                                        placeholder="Enter your name"
                                        disabled={!!initialName}
                                        title={initialName ? "Name cannot be changed once set" : ""}
                                    />
                                </div>
                                {initialName && <p className="text-[10px] text-slate-400 ml-4">Name cannot be changed once set.</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-slate-900 transition-colors">
                                        <Mail strokeWidth={2.5} />
                                    </div>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="w-full h-16 pl-14 pr-8 bg-slate-50 dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-slate-200 dark:focus:border-slate-700 focus:ring-4 focus:ring-slate-100/50 dark:focus:ring-slate-800/50 transition-all text-slate-900 dark:text-white"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Phone Number</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-slate-900 transition-colors">
                                        <Phone strokeWidth={2.5} />
                                    </div>
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="w-full h-16 pl-14 pr-8 bg-slate-50 dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-slate-200 dark:focus:border-slate-700 focus:ring-4 focus:ring-slate-100/50 dark:focus:ring-slate-800/50 transition-all text-slate-900 dark:text-white"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address Section */}
                    <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 transition-colors duration-300">
                        <div className="flex items-center gap-3 mb-2">
                            <MapPin className="w-5 h-5 text-slate-900 dark:text-white" />
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Shipping Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Street Address</label>
                                <input
                                    type="text"
                                    value={profile.shippingAddress.address}
                                    onChange={(e) => setProfile({ ...profile, shippingAddress: { ...profile.shippingAddress, address: e.target.value } })}
                                    className="w-full h-16 px-8 bg-slate-50 dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-slate-200 dark:focus:border-slate-700 focus:ring-4 focus:ring-slate-100/50 dark:focus:ring-slate-800/50 transition-all text-slate-900 dark:text-white"
                                    placeholder="123 Aba Road"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">City</label>
                                <input
                                    type="text"
                                    value={profile.shippingAddress.city}
                                    onChange={(e) => setProfile({ ...profile, shippingAddress: { ...profile.shippingAddress, city: e.target.value } })}
                                    className="w-full h-16 px-8 bg-slate-50 dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-slate-200 dark:focus:border-slate-700 focus:ring-4 focus:ring-slate-100/50 dark:focus:ring-slate-800/50 transition-all text-slate-900 dark:text-white"
                                    placeholder="Port Harcourt"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Postal Code</label>
                                <input
                                    type="text"
                                    value={profile.shippingAddress.postalCode}
                                    onChange={(e) => setProfile({ ...profile, shippingAddress: { ...profile.shippingAddress, postalCode: e.target.value } })}
                                    className="w-full h-16 px-8 bg-slate-50 dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-slate-200 dark:focus:border-slate-700 focus:ring-4 focus:ring-slate-100/50 dark:focus:ring-slate-800/50 transition-all text-slate-900 dark:text-white"
                                    placeholder="500272"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">State/Country</label>
                                <input
                                    type="text"
                                    value={profile.shippingAddress.country}
                                    onChange={(e) => setProfile({ ...profile, shippingAddress: { ...profile.shippingAddress, country: e.target.value } })}
                                    className="w-full h-16 px-8 bg-slate-50 dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-slate-200 dark:focus:border-slate-700 focus:ring-4 focus:ring-100/50 dark:focus:ring-slate-800/50 transition-all text-slate-900 dark:text-white"
                                    placeholder="Rivers State, Nigeria"
                                />
                            </div>
                        </div>
                    </div>
                </form>

                {/* Saved Cards Section */}
                <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-slate-900 dark:text-white" />
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Saved Cards</h3>
                        </div>
                    </div>

                    {profile.savedCards && profile.savedCards.length > 0 ? (
                        <div className="grid gap-4">
                            {profile.savedCards.map((card: any, index: number) => (
                                <div key={index} className="bg-slate-900 rounded-[1.5rem] p-6 text-white relative overflow-hidden group">
                                    {/* Card Visual Background */}
                                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                                        <CreditCard className="w-40 h-40" />
                                    </div>

                                    <div className="relative z-10 flex justify-between items-start mb-8">
                                        <div className="w-12 h-8 bg-white/20 rounded-md backdrop-blur-sm" />
                                        <span className="font-mono text-lg tracking-widest opacity-80 uppercase">{card.brand}</span>
                                    </div>

                                    <div className="relative z-10 mb-6">
                                        <p className="font-mono text-2xl tracking-[0.2em] flex items-center gap-4">
                                            <span>••••</span>
                                            <span>••••</span>
                                            <span>••••</span>
                                            <span>{card.last4}</span>
                                        </p>
                                    </div>

                                    <div className="relative z-10 flex justify-between items-end">
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 mb-1">Card Holder</p>
                                            <p className="font-bold tracking-widest uppercase text-sm">{profile.name || 'VALUED CUSTOMER'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 mb-1">Expires</p>
                                            <p className="font-bold tracking-widest text-sm">{card.expMonth > 9 ? card.expMonth : `0${card.expMonth}`}/{card.expYear.toString().slice(-2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] p-8 text-center border border-dashed border-slate-200 dark:border-slate-800">
                            <CreditCard className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                            <p className="text-sm font-black text-slate-900 dark:text-white">No saved cards</p>
                            <p className="text-xs text-slate-400 mt-1">Cards used at checkout will appear here.</p>
                        </div>
                    )}
                </div>

                {/* Password Section */}
                <form onSubmit={handlePasswordSubmit} className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 flex flex-col transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="w-5 h-5 text-slate-900 dark:text-white" />
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Security & Password</h3>
                    </div>

                    <div className="grid gap-6 flex-grow">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Current Password</label>
                            <input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className="w-full h-16 px-8 bg-slate-50 dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-slate-200 dark:focus:border-slate-700 focus:ring-4 focus:ring-slate-100/50 dark:focus:ring-slate-800/50 transition-all text-slate-900 dark:text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">New Password</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="w-full h-16 px-8 bg-slate-50 dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-slate-200 dark:focus:border-slate-700 focus:ring-4 focus:ring-slate-100/50 dark:focus:ring-slate-800/50 transition-all text-slate-900 dark:text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={changingPassword}
                        className="w-full h-14 bg-white dark:bg-slate-950 border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-auto"
                    >
                        {changingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-5 h-5" /> Change Password</>}
                    </button>
                </form>

                <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] justify-center pt-4">
                    <ShieldCheck className="w-4 h-4" />
                    Everything is encrypted and secure
                </div>
                <div className="flex justify-start pt-8">
                    <button
                        type="submit"
                        form="profile-form"
                        disabled={saving}
                        className="w-full md:w-auto md:min-w-[200px] h-14 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-50 px-8"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Profile Info</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
