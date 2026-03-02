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
import { Logo } from '@/components/ui/Logo';
import { Loader2, ShieldCheck, Smartphone, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { NIGERIAN_STATES, GHANA_REGIONS, KENYA_COUNTIES, SOUTH_AFRICA_PROVINCES } from '@/lib/nigeria-data';

const ExtendedRegisterSchema = z.object({
    name: z.string().refine(val => val.trim().split(/\s+/).length >= 2, "Please enter your full name (first and last)"),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Valid phone number required'),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain a capital letter')
        .regex(/[0-9]/, 'Must contain a number')
        .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
    confirmPassword: z.string(),
    country: z.string().min(1, 'Please select your country'),
    role: z.literal('SELLER'),
    subdomain: z.string().min(3, 'Subdomain must be at least 3 characters'),
    storeName: z.string().min(2, 'Store name must be at least 2 characters'),
    biography: z.string().optional(),
    address: z.string().optional(),
    state: z.string().optional(),
    lga: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
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

    const { register, handleSubmit, trigger, getValues, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(ExtendedRegisterSchema),
        defaultValues: {
            role: 'SELLER',
        }
    });

    const selectedState = watch('state');
    const selectedCountry = watch('country');
    const password = watch('password') || '';

    const countries = [
        { label: 'Nigeria', value: 'Nigeria' },
        { label: 'Ghana', value: 'Ghana' },
        { label: 'Kenya', value: 'Kenya' },
        { label: 'South Africa', value: 'South Africa' },
    ];

    const getStateOptions = () => {
        if (selectedCountry === 'Nigeria') return NIGERIAN_STATES;
        if (selectedCountry === 'Ghana') return GHANA_REGIONS;
        if (selectedCountry === 'Kenya') return KENYA_COUNTIES;
        if (selectedCountry === 'South Africa') return SOUTH_AFRICA_PROVINCES;
        return [];
    };

    const availableStates = getStateOptions();
    const availableLgas = availableStates.find(s => s.name === selectedState)?.lgas || [];

    const getPasswordScore = (pass: string) => {
        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return score;
    };

    const passwordScore = getPasswordScore(password);

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
        <div className="h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#030712] relative overflow-hidden">
            <LandingBackground />

            {/* Left Side: Illustration/Branding */}
            <div className="hidden lg:flex flex-col justify-center bg-slate-950 p-12 text-white overflow-hidden relative border-r border-white/5 h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />

                <div className="relative z-10 max-w-md">
                    <Link href="/" className="mb-12 block">
                        <Logo size="lg" />
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
            <div className="flex items-center justify-center p-4 lg:p-8 relative overflow-y-auto no-scrollbar h-full">
                <div className="max-w-md w-full">
                    <div className="mb-6 text-center lg:text-left">
                        <h2 className="text-3xl font-black text-white mb-1 tracking-tighter">
                            {step === 1 ? 'Founder Details' : step === 2 ? 'Security Shield' : 'Live Activation'}
                        </h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">
                            Step {step} of 3 &bull; {step === 1 ? 'Merchant Identity' : step === 2 ? 'Contact Verification' : 'Store Configuration'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 mb-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                            <p className="text-[10px] text-emerald-100/70 font-medium leading-normal italic">
                                                Please use your <strong className="text-white">Legal Full Name</strong> as it appears on your NIN or BVN.
                                            </p>
                                        </div>
                                    </div>
                                    <Input
                                        label="Legal Full Name"
                                        register={register('name')}
                                        error={errors.name?.message}
                                        placeholder="Samuel Stanley"
                                    />
                                    <Input
                                        label="Email Address"
                                        register={register('email')}
                                        error={errors.email?.message}
                                        type="email"
                                        placeholder="samuel@example.com"
                                    />
                                    <Select
                                        label="Operating Country"
                                        name="country"
                                        watch={watch}
                                        setValue={setValue}
                                        error={errors.country?.message}
                                        placeholder="Select your business region"
                                        options={countries}
                                    />
                                    <div className="relative">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Phone Number</label>
                                        <div className="flex gap-2">
                                            <div className="w-20 h-14 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-2xl text-white font-black text-sm">
                                                {selectedCountry === 'Nigeria' ? '+234' :
                                                    selectedCountry === 'Ghana' ? '+233' :
                                                        selectedCountry === 'Kenya' ? '+254' :
                                                            selectedCountry === 'South Africa' ? '+27' : '+...'}
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    {...register('phone')}
                                                    type="tel"
                                                    placeholder="800 000 0000"
                                                    className="w-full h-14 px-5 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white font-bold transition-all outline-none placeholder:text-slate-700"
                                                />
                                            </div>
                                        </div>
                                        {errors.phone && <p className="text-[10px] text-rose-500 mt-2 font-bold uppercase ml-1">{errors.phone.message}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Vault Password"
                                            register={register('password')}
                                            error={errors.password?.message}
                                            type="password"
                                            placeholder="••••••••"
                                        />
                                        <Input
                                            label="Confirm Vault"
                                            register={register('confirmPassword')}
                                            error={errors.confirmPassword?.message}
                                            type="password"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    {password.length > 0 && (
                                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Strength Indicator</p>
                                                <p className={`text-[9px] font-black uppercase tracking-widest ${passwordScore === 4 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                    {passwordScore <= 1 ? 'Weak' : passwordScore <= 2 ? 'Medium' : passwordScore <= 3 ? 'Strong' : 'Fortress'}
                                                </p>
                                            </div>
                                            <div className="flex gap-1 h-1">
                                                {[1, 2, 3, 4].map((i) => (
                                                    <div
                                                        key={i}
                                                        className={`flex-1 rounded-full transition-all duration-500 ${passwordScore >= i ? (passwordScore === 4 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-slate-800'}`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-2 gap-y-1 gap-x-3 px-1">
                                                <StrengthReq met={password.length >= 8} label="8+ Chars" />
                                                <StrengthReq met={/[A-Z]/.test(password)} label="ABC (Upper)" />
                                                <StrengthReq met={/[0-9]/.test(password)} label="123 (Number)" />
                                                <StrengthReq met={/[^A-Za-z0-9]/.test(password)} label="!@# (Special)" />
                                            </div>
                                        </div>
                                    )}

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
                                    className="space-y-3"
                                >
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-3 mb-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Identity Securely Verified</span>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-rose-500/10 rounded-xl text-rose-400 text-sm font-bold border border-rose-500/20">
                                            {error}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3">
                                        <Input
                                            label="Store Name"
                                            register={register('storeName')}
                                            error={errors.storeName?.message}
                                            placeholder="samstorez Inc"
                                        />
                                        <Input
                                            label="Store Address"
                                            register={register('address')}
                                            error={errors.address?.message}
                                            placeholder="Physical Address"
                                        />
                                    </div>

                                    <TextArea
                                        label="Bio"
                                        register={register('biography')}
                                        error={errors.biography?.message}
                                        placeholder="Enter store bio (optional)"
                                        rows={2}
                                    />

                                    <div className="grid grid-cols-2 gap-3">
                                        <Select
                                            label={selectedCountry === 'Kenya' ? "County" : selectedCountry === 'South Africa' ? "Province" : "State / Region"}
                                            name="state"
                                            watch={watch}
                                            setValue={setValue}
                                            error={errors.state?.message}
                                            placeholder={selectedCountry === 'Kenya' ? "Select county" : selectedCountry === 'South Africa' ? "Select province" : "Select region"}
                                            options={availableStates.map(s => ({
                                                label: s.name,
                                                value: s.name
                                            }))}
                                        />
                                        <Select
                                            label={selectedCountry === 'Nigeria' ? "Local Government" : selectedCountry === 'Kenya' ? "Sub-County" : selectedCountry === 'South Africa' ? "Municipality" : "City / Hub"}
                                            name="lga"
                                            watch={watch}
                                            setValue={setValue}
                                            error={errors.lga?.message}
                                            placeholder={selectedState ? "Select Location" : "Select region first"}
                                            options={availableLgas.map(lga => ({
                                                label: lga,
                                                value: lga
                                            }))}
                                            disabled={!selectedState}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Website Address</label>
                                        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:border-emerald-500/50 transition-all">
                                            <input
                                                {...register('subdomain')}
                                                type="text"
                                                placeholder="samstorez"
                                                className="flex-1 h-12 px-4 bg-transparent outline-none text-white font-bold text-sm"
                                            />
                                            <span className="px-4 text-slate-500 font-black text-[9px] uppercase tracking-widest bg-slate-800/50 h-12 flex items-center">.opnmart.com</span>
                                        </div>
                                        {errors.subdomain && <p className="text-[10px] text-rose-500 mt-1 font-bold uppercase ml-1">{errors.subdomain.message}</p>}
                                    </div>

                                    <div className="flex gap-4 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex-1 h-12 bg-slate-900 border border-slate-800 text-slate-400 font-bold rounded-2xl hover:bg-slate-800 hover:text-white transition-all uppercase tracking-widest text-[10px]"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-[2] h-12 bg-emerald-500 hover:brightness-110 text-[#030712] font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
                                        >
                                            {isSubmitting ? 'Igniting Engine...' : 'Launch Station'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <p className="mt-6 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
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

function StrengthReq({ met, label }: { met: boolean; label: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-1 h-1 rounded-full ${met ? 'bg-emerald-500' : 'bg-slate-700'}`} />
            <p className={`text-[8px] font-bold uppercase tracking-tighter ${met ? 'text-emerald-100/70' : 'text-slate-600'}`}>{label}</p>
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

function TextArea({ label, register, error, placeholder, rows = 3 }: any) {
    return (
        <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">{label}</label>
            <textarea
                {...register}
                placeholder={placeholder}
                rows={rows}
                className="w-full p-5 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white font-bold transition-all outline-none placeholder:text-slate-700 resize-none"
            />
            {error && <p className="text-[10px] text-rose-500 mt-2 font-bold uppercase ml-1">{error}</p>}
        </div>
    );
}

function Select({ label, name, error, options, placeholder, disabled, setValue, watch }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedValue = watch(name);
    const selectedLabel = options.find((opt: any) => opt.value === selectedValue)?.label || placeholder;

    return (
        <div className="relative">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">{label}</label>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full h-14 px-5 bg-slate-900 border ${isOpen ? 'border-emerald-500/50 ring-2 ring-emerald-500/20' : 'border-slate-800'} rounded-2xl flex items-center justify-between cursor-pointer transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-700'}`}
            >
                <span className={`font-bold ${selectedValue ? 'text-white' : 'text-slate-500'}`}>
                    {selectedLabel}
                </span>
                <div className={`w-2 h-2 border-r-2 border-b-2 border-slate-500 transform transition-transform ${isOpen ? '-rotate-135 mt-1' : 'rotate-45 -mt-1'}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 5 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto no-scrollbar"
                        >
                            {options.map((opt: any) => (
                                <div
                                    key={opt.value}
                                    onClick={() => {
                                        setValue(name, opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`px-5 py-3 text-sm font-bold cursor-pointer transition-colors ${selectedValue === opt.value ? 'bg-emerald-500 text-[#030712]' : 'text-white hover:bg-emerald-500/10'}`}
                                >
                                    {opt.label}
                                </div>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            {error && <p className="text-[10px] text-rose-500 mt-2 font-bold uppercase ml-1">{error}</p>}
        </div>
    );
}
