'use client';

import React, { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Loader2, ShoppingBag, CheckCircle, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';

export default function CustomerAuthPage() {
    const { subdomain } = useParams<{ subdomain: string }>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');
    const { setUser, setStore } = useAuthStore();

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    // Reset state when switching modes
    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError(null);
        setOtpSent(false);
        setOtpVerified(false);
        setOtp('');
    };

    return (
        <div className="flex flex-col items-center pt-10 pb-10 px-6 sm:px-10 relative overflow-x-hidden min-h-screen justify-center">
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-50/50 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-50/50 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-50/30 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-md w-full bg-white rounded-[3rem] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.04)] px-7 pt-8 pb-8 sm:px-10 sm:pt-10 sm:pb-10 border border-white relative z-20"
            >
                {/* Redirect Notice */}
                <AnimatePresence mode="wait">
                    {redirect === 'checkout' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="bg-slate-900 rounded-[2rem] p-5 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20"
                        >
                            <div className="relative z-10">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-2 mb-2"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80">Secure Checkout</p>
                                </motion.div>
                                <h3 className="text-xl font-black leading-tight tracking-tight">One last step...</h3>
                                <p className="text-xs font-medium text-slate-400 mt-2 leading-relaxed">
                                    Please sign in to your secure customer account to complete your purchase and track delivery.
                                </p>
                            </div>
                            <ShoppingBag className="absolute -right-6 -bottom-6 w-28 h-28 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700 ease-out" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                        {isLogin ? 'Welcome Back' : (otpVerified ? 'Final Details' : 'Create Account')}
                    </h1>
                    <p className="text-slate-400 text-xs font-medium">
                        {isLogin ? 'Please enter your details' : (otpVerified ? 'Set your password to finish' : 'Verify your email to continue')}
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-2xl text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {/* LOGIN FORM */}
                {isLogin ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Email Address</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors z-10">
                                    <Mail strokeWidth={2.5} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full h-16 pl-14 pr-8 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-300 placeholder:font-medium relative"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Secure Password</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors z-10">
                                    <Lock strokeWidth={2.5} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full h-16 pl-14 pr-8 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-300 placeholder:font-medium relative"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-slate-900 text-white rounded-[1.5rem] text-sm font-black uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 group disabled:opacity-50 mt-4 relative overflow-hidden shadow-xl shadow-slate-900/10"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    /* REGISTRATION FLOW */
                    <div className="space-y-4">
                        {!otpVerified ? (
                            /* STEP 1: Email & OTP */
                            <form onSubmit={!otpSent ? handleSendOtp : (e) => { e.preventDefault(); handleVerifyOtp(); }} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors z-10">
                                            <User strokeWidth={2.5} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            disabled={otpSent}
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full h-16 pl-14 pr-8 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-300 placeholder:font-medium relative disabled:opacity-60"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors z-10">
                                            <Mail strokeWidth={2.5} />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            disabled={otpSent}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full h-16 pl-14 pr-8 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-300 placeholder:font-medium relative disabled:opacity-60"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Phone Number</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors z-10">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            disabled={otpSent}
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full h-16 pl-14 pr-8 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-300 placeholder:font-medium relative disabled:opacity-60"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>

                                {otpSent && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-2"
                                    >
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Verification Code</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors z-10">
                                                <ShieldCheck strokeWidth={2.5} />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                maxLength={6}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                className="w-full h-16 pl-14 pr-8 bg-white border-2 border-slate-900/10 rounded-[1.5rem] text-lg font-black text-slate-900 outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all placeholder:text-slate-300 tracking-widest relative"
                                                placeholder="000000"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => setOtpSent(false)}
                                                className="text-[10px] font-bold text-slate-400 hover:text-slate-600 underline"
                                            >
                                                Wrong email?
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || (otpSent && otp.length !== 6)}
                                    className="w-full h-16 bg-slate-900 text-white rounded-[1.5rem] text-sm font-black uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 group disabled:opacity-50 mt-4 relative overflow-hidden shadow-xl shadow-slate-900/10"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span>{otpSent ? 'Verify Code' : 'Send Code'}</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            /* STEP 2: Password & Finish */
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] ml-4 flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3" /> Email Verified
                                    </label>
                                    <div className="p-4 bg-emerald-50/50 rounded-[1.5rem] border border-emerald-100 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                            <Mail strokeWidth={2.5} className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">{formData.name}</p>
                                            <p className="text-[10px] font-medium text-slate-500">{formData.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Set Password</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors z-10">
                                            <Lock strokeWidth={2.5} />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full h-16 pl-14 pr-8 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-300 placeholder:font-medium relative"
                                            placeholder="••••••••"
                                            minLength={8}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-16 bg-slate-900 text-white rounded-[1.5rem] text-sm font-black uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 group disabled:opacity-50 mt-4 relative overflow-hidden shadow-xl shadow-slate-900/10"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span>Create Account</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                )}

                <div className="mt-8 text-center">
                    <button
                        onClick={toggleMode}
                        className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors"
                    >
                        {isLogin ? "New here? Create an account" : "Already have an account? Sign in"}
                    </button>
                </div>
            </motion.div>

            {/* Footer escape link */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="relative z-10 mt-8"
            >
                <Link
                    href={`/store/${subdomain}`}
                    className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors"
                >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Back to Store
                </Link>
            </motion.div>
        </div>
    );
}
