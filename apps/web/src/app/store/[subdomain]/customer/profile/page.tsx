'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { User, Mail, Save, Loader2, ShieldCheck, Camera } from 'lucide-react';
import api from '@/lib/api';
import { motion } from 'framer-motion';

export default function CustomerProfilePage() {
    const { subdomain } = useParams<{ subdomain: string }>();
    const [profile, setProfile] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await api.get('/users/profile');
                setProfile({
                    name: res.data.name || '',
                    email: res.data.email || '',
                });
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await api.patch('/users/profile', profile);
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
        <div className="max-w-2xl pb-20">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Profile Settings</h1>
                <p className="text-slate-500 mt-1">Manage your account information and preferences</p>
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

                {/* Avatar Section */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col items-center text-center">
                    <div className="relative group mb-6">
                        <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-slate-200">
                            {profile.name ? profile.name.trim().split(/\s+/).map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '??'}
                        </div>
                    </div>
                    <h3 className="text-lg font-black text-slate-900">{profile.name || 'Set your name'}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Customer ID: {subdomain.toUpperCase()}-USR</p>
                </div>

                {/* Info Section */}
                <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <User className="w-5 h-5 text-slate-900" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Personal Information</h3>
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
                                    className="w-full h-16 pl-14 pr-8 bg-slate-50 border border-slate-50 rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100/50 transition-all text-slate-900"
                                    placeholder="Enter your name"
                                />
                            </div>
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
                                    className="w-full h-16 pl-14 pr-8 bg-slate-50 border border-slate-50 rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100/50 transition-all text-slate-900"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full h-14 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Update Info</>}
                    </button>
                </form>

                {/* Password Section */}
                <form onSubmit={handlePasswordSubmit} className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="w-5 h-5 text-slate-900" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Security & Password</h3>
                    </div>

                    <div className="grid gap-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Current Password</label>
                            <input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className="w-full h-16 px-8 bg-slate-50 border border-slate-50 rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100/50 transition-all text-slate-900"
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
                                className="w-full h-16 px-8 bg-slate-50 border border-slate-50 rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100/50 transition-all text-slate-900"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={changingPassword}
                        className="w-full h-14 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {changingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-5 h-5" /> Change Password</>}
                    </button>
                </form>

                <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] justify-center pt-4">
                    <ShieldCheck className="w-4 h-4" />
                    Everything is encrypted and secure
                </div>
            </div>
        </div>
    );
}
