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
            api.get(`/stores/resolve?subdomain=${subdomain}`)
                .then(res => {
                    setStoreName(res.data.name || 'Store');
                    setStoreLogo(res.data.logo || '');
                })
                .catch(() => setStoreName('Store'));
        }
    }, [subdomain]);

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
            await api.post('/auth/send-otp', { email: formData.email });
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
            await api.post('/auth/verify-otp', { email: formData.email, otp });
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
                return;
            }

            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const payload = isLogin
                ? { email: formData.email, password: formData.password, subdomain }
                : { ...formData, role: 'BUYER', subdomain };

            const response = await api.post(endpoint, payload);

            if (response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                setUser(response.data.user);
                setStore(response.data.store);

                // Sync Cart (Non-blocking or safer)
                api.post('/users/cart/sync', { items: localItems })
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
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] lg:h-[85vh] bg-white overflow-hidden">
            {/* Left Panel - Store Features */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:flex lg:w-1/2 bg-[#0f172a] text-white p-12 flex-col justify-center relative overflow-hidden"
            >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

                <div className="relative z-10 max-w-lg mx-auto">
                    {/* Brand */}
                    <div className="mb-10">
                        {storeLogo ? (
                            <img src={storeLogo} alt={storeName} className="h-12 w-auto object-contain mb-6" />
                        ) : (
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 mb-6 text-white">
                                <Store className="w-6 h-6" />
                            </div>
                        )}
                        <h1 className="text-4xl font-bold tracking-tight mb-4">
                            Welcome to {storeName || 'Our Store'}
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Sign in to access your orders, wishlist, and exclusive member-only offers.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                                <Box className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">Track Orders</h3>
                                <p className="text-sm text-slate-400">Real-time updates on your deliveries</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                                <Star className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">Exclusive Access</h3>
                                <p className="text-sm text-slate-400">Early access to new drops and sales</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                                <Bell className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">Instant Notifications</h3>
                                <p className="text-sm text-slate-400">Get notified about restocks and offers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right Panel - Auth Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
                {/* Mobile Heading */}
                <div className="lg:hidden text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">{storeName || 'Store'}</h2>
                    <p className="text-sm text-slate-500">Welcome Back</p>
                </div>

                <div className="w-full max-w-sm">
                    {/* Redirect Notice */}
                    <AnimatePresence mode="wait">
                        {redirect === 'checkout' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className="bg-blue-50/50 rounded-2xl p-4 text-blue-900 border border-blue-100 mb-6 flex items-start gap-3"
                            >
                                <ShoppingBag className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Checkout Pending</h3>
                                    <p className="text-sm text-blue-800/80">Sign in to complete your purchase.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="text-center mb-6 hidden lg:block">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {isLogin ? 'Sign In' : (otpVerified ? 'Final Step' : 'Create Account')}
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            {isLogin ? 'Enter your details to continue' : 'Join us for a better experience'}
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-xl text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    {isLogin ? (
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all placeholder:text-slate-400"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all placeholder:text-slate-400"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            {!otpVerified ? (
                                <form onSubmit={!otpSent ? handleSendOtp : (e) => { e.preventDefault(); handleVerifyOtp(); }} className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                required
                                                disabled={otpSent}
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all placeholder:text-slate-400 disabled:opacity-50"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="email"
                                                required
                                                disabled={otpSent}
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all placeholder:text-slate-400 disabled:opacity-50"
                                                placeholder="name@example.com"
                                            />
                                        </div>
                                    </div>

                                    {otpSent && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 ml-1">Code</label>
                                            <div className="relative">
                                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    required
                                                    maxLength={6}
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                    className="w-full h-12 pl-10 pr-4 bg-white border-2 border-slate-900 rounded-xl text-sm font-bold text-slate-900 focus:ring-0 transition-all tracking-widest"
                                                    placeholder="000000"
                                                />
                                            </div>
                                            <button type="button" onClick={() => setOtpSent(false)} className="text-xs text-slate-400 hover:text-slate-600 underline ml-1">
                                                Change Email
                                            </button>
                                        </motion.div>
                                    )}

                                    {!otpSent && (
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 ml-1">Phone</label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400">#</div>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all placeholder:text-slate-400"
                                                    placeholder="+1234567890"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || (otpSent && otp.length !== 6)}
                                        className="w-full h-12 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2 mt-2"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (otpSent ? 'Verify' : 'Continue')}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        <div>
                                            <p className="text-xs font-bold text-emerald-700">Email Verified</p>
                                            <p className="text-[10px] text-emerald-600">{formData.email}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Set Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="password"
                                                required
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all placeholder:text-slate-400"
                                                placeholder="••••••••"
                                                minLength={8}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2 mt-2"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <button
                            onClick={toggleMode}
                            className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-wider"
                        >
                            {isLogin ? "Create an account" : "Sign in instead"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
