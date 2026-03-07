'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Loader2, ShoppingBag, CheckCircle, ShieldCheck, Store, Star, Box, Heart, Bell } from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';

export default function CustomerAuthPage() {
    const { subdomain } = useParams<{ subdomain: string }>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');
    const { setUser, setStore } = useAuthStore();
    const { items: localItems, setItems } = useCartStore();

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Store Info
    const [storeName, setStoreName] = useState('');
    const [storeLogo, setStoreLogo] = useState('');
    const [theme, setTheme] = useState('');

    // Registration State
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otp, setOtp] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    useEffect(() => {
        if (subdomain) {
            api.get(`stores/resolve?subdomain=${subdomain}`)
                .then(res => {
                    const storeData = res.data;
                    setStoreName(storeData.name || 'Store');
                    setStoreLogo(storeData.logo || '');
                    setTheme(storeData.theme || '');
                })
                .catch(() => setStoreName('Store'));
        }
    }, [subdomain]);

    const isVantage = theme === 'VANTAGE';

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate Full Name
        if (formData.name.trim().split(/\s+/).length < 2) {
            setError("Please enter your full name (First and Last name)");
            setLoading(false);
            return;
        }

        try {
            await api.post('auth/send-otp', { email: formData.email, subdomain });
            setOtpSent(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send verification code.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) return;
        setLoading(true);
        setError(null);
        try {
            await api.post('auth/verify-otp', { email: formData.email, otp, subdomain });
            setOtpVerified(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid code.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!isLogin && !otpVerified) {
                setError('Please verify your email first.');
                setLoading(false);
                return;
            }

            const endpoint = isLogin ? 'auth/login' : 'auth/register';
            const payload = isLogin
                ? { email: formData.email, password: formData.password, subdomain }
                : { ...formData, role: 'BUYER', subdomain };

            const response = await api.post(endpoint, payload);

            if (response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                setUser(response.data.user);
                setStore(response.data.store);

                // Sync Cart
                api.post('users/cart/sync', { items: localItems })
                    .then(cartRes => setItems(cartRes.data))
                    .catch(e => console.error("Failed to sync cart:", e));


                if (redirect === 'checkout') {
                    router.push(`/store/${subdomain}/checkout`);
                } else {
                    router.push(`/store/${subdomain}/customer/orders`);
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError(null);
        setOtpSent(false);
        setOtpVerified(false);
        setOtp('');
    };

    return (
        <div className="min-h-[75vh] flex items-center justify-center p-6 bg-white transition-all duration-500">
            <div className="w-full max-w-sm">
                {/* Simplified Branding */}
                <div className="flex flex-col items-center mb-12">
                    {storeLogo ? (
                        <div className="w-16 h-16 rounded-2xl overflow-hidden mb-4 border border-neutral-100 flex items-center justify-center">
                            <img src={storeLogo} alt={storeName} className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-xl bg-neutral-50 flex items-center justify-center mb-4">
                            <Store className="w-6 h-6 text-neutral-300" />
                        </div>
                    )}
                    <h1 className="text-2xl font-black uppercase tracking-tighter italic">
                        {storeName || 'SAMSTAR'}
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300 mt-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {isLogin ? (
                        <motion.form
                            key="login"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full h-14 px-1 bg-white border-b border-neutral-200 focus:border-black rounded-none text-sm font-bold text-neutral-900 focus:ring-0 transition-all placeholder:text-neutral-200"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full h-14 px-1 bg-white border-b border-neutral-200 focus:border-black rounded-none text-sm font-bold text-neutral-900 focus:ring-0 transition-all placeholder:text-neutral-200"
                                    placeholder="********"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="register"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {!otpVerified ? (
                                <form onSubmit={!otpSent ? handleSendOtp : (e) => { e.preventDefault(); handleVerifyOtp(); }} className="space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            disabled={otpSent}
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full h-14 px-1 bg-white border-b border-neutral-200 focus:border-black rounded-none text-sm font-bold text-neutral-900 focus:ring-0 transition-all disabled:opacity-50"
                                            placeholder="Samuel Stanley"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            disabled={otpSent}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full h-14 px-1 bg-white border-b border-neutral-200 focus:border-black rounded-none text-sm font-bold text-neutral-900 focus:ring-0 transition-all disabled:opacity-50"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    {otpSent && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-black ml-1">Verification Code</label>
                                            <input
                                                type="text"
                                                required
                                                maxLength={6}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                className="w-full h-14 bg-neutral-50 px-4 border-b-2 border-black rounded-none text-xl font-black text-neutral-900 focus:ring-0 transition-all tracking-[0.5em]"
                                                placeholder="000000"
                                            />
                                        </motion.div>
                                    )}

                                    {!otpSent && (
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full h-14 px-1 bg-white border-b border-neutral-200 focus:border-black rounded-none text-sm font-bold text-neutral-900 focus:ring-0 transition-all"
                                                placeholder="+123 456 7890"
                                            />
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || (otpSent && otp.length !== 6)}
                                        className="w-full h-14 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 shadow-lg shadow-black/5"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{otpSent ? 'Verify Code' : 'Continue'} <ArrowRight className="w-4 h-4" /></>}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="p-4 rounded-xl bg-neutral-50 flex items-center gap-3 border border-neutral-100">
                                        <CheckCircle className="w-5 h-5 text-black" />
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-black">Email Verified</p>
                                            <p className="text-[10px] text-neutral-400 font-bold">{formData.email}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1">Set Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full h-14 px-1 bg-white border-b border-neutral-200 focus:border-black rounded-none text-sm font-bold text-neutral-900 focus:ring-0 transition-all"
                                            placeholder="********"
                                            minLength={8}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-14 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Complete Setup <ArrowRight className="w-4 h-4" /></>}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-12 text-center">
                    <button
                        onClick={toggleMode}
                        className="text-[9px] font-black transition-all uppercase tracking-[0.3em] text-neutral-300 hover:text-black border-b border-transparent hover:border-black pb-1"
                    >
                        {isLogin ? "Create An Account" : "Back To Login"}
                    </button>
                </div>
            </div>
        </div>
    );
}
