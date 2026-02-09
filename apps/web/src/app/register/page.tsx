'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { LandingBackground } from '@/components/landing/LandingBackground';
import { Loader2, ShieldCheck, Smartphone, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

const ExtendedRegisterSchema = z.object({
    name: z.string().refine(val => val.trim().split(/\s+/).length >= 2, "Please enter your full name (first and last)"),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Valid phone number required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.literal('SELLER'),
    subdomain: z.string().min(3, 'Subdomain must be at least 3 characters'),
    storeName: z.string().min(2, 'Store name must be at least 2 characters'),
});

type FormData = z.infer<typeof ExtendedRegisterSchema>;

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState(1); // 1: Details, 2: Verification, 3: Store
    const [otp, setOtp] = useState('');
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const router = useRouter();
    const { setUser, setStore } = useAuthStore();

    const { register, handleSubmit, trigger, getValues, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(ExtendedRegisterSchema),
        defaultValues: {
            role: 'SELLER',
        }
    });

    const goToVerification = async () => {
        const result = await trigger(['name', 'email', 'phone', 'password']);
        if (result) {
            setStep(2);
            sendOtp();
        }
    };

    const sendOtp = async () => {
        setSendingOtp(true);
        try {
            const { email, phone } = getValues();
            await api.post('/auth/send-otp', { email, phone });
            setOtpSent(true);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send verification code.');
        } finally {
            setSendingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) return;
        setVerifyingOtp(true);
        try {
            const { email, phone } = getValues();
            await api.post('/auth/verify-otp', { email, otp, phone });
            setStep(3);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid or expired code.');
        } finally {
            setVerifyingOtp(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            setError(null);
            // Remove phone if it's undefined to avoid unique constraint issues
            const payload: any = { ...data, role: 'SELLER' };
            if (!payload.phone) {
                delete payload.phone;
            }
            const response = await api.post('auth/register', payload);

            if (response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                setUser(response.data.user);
                setStore(response.data.store);
                router.push('/dashboard/seller');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create your store. Please try again.');
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#030712] relative overflow-hidden">
            <LandingBackground />

            {/* Left Side: Illustration/Branding */}
            <div className="hidden lg:flex flex-col justify-center bg-slate-950 p-12 text-white overflow-hidden relative border-r border-white/5">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />

                <div className="relative z-10 max-w-md">
                    <Link href="/" className="flex items-center space-x-2 mb-12">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <span className="text-[#030712] font-black italic text-xl">O</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white uppercase italic">OPNMRT</span>
                    </Link>

                    <h1 className="text-5xl font-black leading-[0.9] text-white mb-8 tracking-tighter">
                        The ultimate engine for <span className="text-emerald-500 italic">modern commerce.</span>
                    </h1>
                    <p className="text-xl text-slate-400 mb-12 font-medium leading-relaxed">
                        Join thousands of visionary merchants scaling independent brands with AI-powered agility.
                    </p>

                    <div className="space-y-6">
                        <FeaturePoint title="Merchant Supremacy" desc="Full control over your domain, customers, and data." />
                        <FeaturePoint title="Algorithmic Growth" desc="Predictive inventory and automated sales optimization." />
                        <FeaturePoint title="Global Activation" desc="Instant store launch with integrated worldwide payments." />
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex items-center justify-center p-8 lg:p-24 relative overflow-y-auto no-scrollbar">
                <div className="max-w-md w-full">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-4xl font-black text-white mb-3 tracking-tighter">
                            {step === 1 ? 'Founder Details' : step === 2 ? 'Security Shield' : 'Live Activation'}
                        </h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                            Step {step} of 3 &bull; {step === 1 ? 'Merchant Identity' : step === 2 ? 'Contact Verification' : 'Store Configuration'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <Input
                                        label="Full Name"
                                        register={register('name')}
                                        error={errors.name?.message}
                                        placeholder="John Surname"
                                    />
                                    <Input
                                        label="Email Address"
                                        register={register('email')}
                                        error={errors.email?.message}
                                        type="email"
                                        placeholder="john@example.com"
                                    />
                                    <Input
                                        label="Phone Number"
                                        register={register('phone')}
                                        error={errors.phone?.message}
                                        type="tel"
                                        placeholder="+234 800 000 0000"
                                    />
                                    <Input
                                        label="Vault Password"
                                        register={register('password')}
                                        error={errors.password?.message}
                                        type="password"
                                        placeholder="Min. 8 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={goToVerification}
                                        className="w-full h-14 bg-emerald-500 hover:brightness-110 text-[#030712] font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                                    >
                                        Send Security Code
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl text-center space-y-4">
                                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto text-emerald-500">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-white font-black text-sm uppercase tracking-tight">Identity Verification</h3>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                                                We've sent a 6-digit code to <span className="text-emerald-500">{getValues().email}</span> and your phone.
                                            </p>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-rose-500/10 rounded-xl text-rose-400 text-sm font-bold border border-rose-500/20 text-center">
                                            {error}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 text-center">Enter Secret Code</label>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="••••••"
                                            className="w-full h-20 text-center text-4xl font-black bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white tracking-[0.5em] transition-all outline-none placeholder:text-slate-800"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        disabled={otp.length !== 6 || verifyingOtp}
                                        className="w-full h-14 bg-emerald-500 hover:brightness-110 text-[#030712] font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all disabled:opacity-50 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                                    >
                                        {verifyingOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authorize Identity'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={sendOtp}
                                        disabled={sendingOtp}
                                        className="w-full text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                                    >
                                        {sendingOtp ? 'Resending...' : "Didn't receive? Resend Code"}
                                    </button>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3 mb-6">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Identity Securely Verified</span>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-rose-500/10 rounded-xl text-rose-400 text-sm font-bold border border-rose-500/20">
                                            {error}
                                        </div>
                                    )}
                                    <Input
                                        label="Store Entity Name"
                                        register={register('storeName')}
                                        error={errors.storeName?.message}
                                        placeholder="Modern Gear Co."
                                    />
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Store Address</label>
                                        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:border-emerald-500/50 transition-all">
                                            <input
                                                {...register('subdomain')}
                                                type="text"
                                                placeholder="modern-gear"
                                                className="flex-1 h-14 px-5 bg-transparent outline-none text-white font-bold"
                                            />
                                            <span className="px-5 text-slate-500 font-black text-[10px] uppercase tracking-widest bg-slate-800/50 h-14 flex items-center">.opnmart.com</span>
                                        </div>
                                        {errors.subdomain && <p className="text-[10px] text-rose-500 mt-2 font-bold uppercase ml-1">{errors.subdomain.message}</p>}
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex-1 h-14 bg-slate-900 border border-slate-800 text-slate-400 font-bold rounded-2xl hover:bg-slate-800 hover:text-white transition-all uppercase tracking-widest text-xs"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-[2] h-14 bg-emerald-500 hover:brightness-110 text-[#030712] font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all disabled:opacity-50 uppercase tracking-widest text-sm"
                                        >
                                            {isSubmitting ? 'Igniting Engine...' : 'Launch Station'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <p className="mt-10 text-center text-sm font-bold text-slate-500 uppercase tracking-widest">
                        Resident merchant? <Link href="/login" className="text-emerald-500 hover:brightness-110 transition-colors ml-1">Login Control</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

function FeaturePoint({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="flex items-start space-x-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            <div>
                <h3 className="text-sm font-black text-white uppercase tracking-tight">{title}</h3>
                <p className="text-xs text-slate-500 font-bold italic">{desc}</p>
            </div>
        </div>
    );
}

function Input({ label, register, error, type = 'text', placeholder }: any) {
    return (
        <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">{label}</label>
            <input
                {...register}
                type={type}
                placeholder={placeholder}
                className="w-full h-14 px-5 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white font-bold transition-all outline-none placeholder:text-slate-700"
            />
            {error && <p className="text-[10px] text-rose-500 mt-2 font-bold uppercase ml-1">{error}</p>}
        </div>
    );
}
