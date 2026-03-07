'use client';

import { useState, useEffect } from 'react';
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
import { Loader2, ShieldCheck, ArrowRight, Bike, MapPin, TrendingUp, Package, CheckCircle2, Globe, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { NIGERIAN_STATES, GHANA_REGIONS, KENYA_COUNTIES, SOUTH_AFRICA_PROVINCES } from '@/lib/nigeria-data';

const RiderRegisterSchema = z.object({
    name: z.string().refine(val => val.trim().split(/\s+/).length >= 2, "Please enter your full name (first and last)"),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(8, 'Phone number too short'),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain a capital letter')
        .regex(/[0-9]/, 'Must contain a number')
        .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
    confirmPassword: z.string(),
    country: z.string().min(1, 'Please select your country'),
    companyName: z.string().min(2, 'Company name or Business Name required'),
    vehicleTypes: z.array(z.string()).min(1, 'Select at least one vehicle type'),
    address: z.string().min(5, 'Specific address required'),
    state: z.string().min(1, 'Please select your region'),
    lga: z.string().min(1, 'Please select your local area'),
    isInterstate: z.boolean(),
    interstateCoverage: z.array(z.string()).optional(),
    role: z.literal('DISPATCH'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
}).refine((data) => {
    const len = data.phone.replace(/\D/g, '').length;
    if (data.country === 'Nigeria') return len >= 10 && len <= 11;
    return len >= 9 && len <= 12;
}, {
    message: "Invalid phone number length",
    path: ["phone"],
});

type FormData = z.infer<typeof RiderRegisterSchema>;

export default function RiderRegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState(1); // 1: Info, 2: Verification, 3: Fleet Setup
    const [otp, setOtp] = useState('');
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);

    const router = useRouter();
    const { setUser } = useAuthStore();

    const { register, handleSubmit, trigger, getValues, watch, setValue, formState: { errors, isSubmitting, isValid } } = useForm<FormData>({
        resolver: zodResolver(RiderRegisterSchema),
        defaultValues: {
            role: 'DISPATCH',
            vehicleTypes: ['BIKE'],
            country: 'Nigeria',
            isInterstate: false,
            interstateCoverage: []
        }
    });

    // Debugging validation errors
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.log("Validation Errors:", errors);
            // Optionally toast the first error to alert the user if something is hidden
            const firstError = Object.values(errors)[0] as any;
            if (firstError?.message) {
                // We only toast if we are on step 3 and the error is not one of the visible ones
                const visibleFields = ['companyName', 'address', 'state', 'lga', 'vehicleTypes'];
                const errorField = Object.keys(errors)[0];
                if (step === 3 && !visibleFields.includes(errorField)) {
                    toast.error(`Error in ${errorField}: ${firstError.message}`);
                }
            }
        }
    }, [errors, step]);

    const selectedCountry = watch('country');
    const selectedState = watch('state');
    const selectedVehicles = watch('vehicleTypes') || [];
    const isInterstate = watch('isInterstate');
    const interstateCoverage = watch('interstateCoverage') || [];

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

    const sendOtp = async () => {
        const isValid = await trigger(['name', 'email', 'phone', 'password', 'confirmPassword', 'country']);
        if (!isValid) return;

        setSendingOtp(true);
        try {
            const { email, phone } = getValues();
            await api.post('auth/send-otp', { email, phone });
            setStep(2);
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
            await api.post('auth/verify-otp', { email, otp, phone });
            setStep(3);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid or expired code.');
        } finally {
            setVerifyingOtp(false);
        }
    };

    const toggleVehicle = (type: string) => {
        const current = [...selectedVehicles];
        if (current.includes(type)) {
            if (current.length > 1) {
                setValue('vehicleTypes', current.filter(t => t !== type));
            }
        } else {
            setValue('vehicleTypes', [...current, type]);
        }
    };

    const toggleInterstateState = (stateName: string) => {
        const current = [...interstateCoverage];
        if (current.includes(stateName)) {
            setValue('interstateCoverage', current.filter(s => s !== stateName));
        } else {
            setValue('interstateCoverage', [...current, stateName]);
        }
    };

    const onSubmit = async (data: FormData) => {
        console.log("Submitting rider data:", data);
        try {
            setError(null);
            const response = await api.post('auth/register', data);

            if (response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                setUser(response.data.user);
                toast.success('Registration complete! Welcome to the hub.');
                router.push('/dashboard/dispatch');
            }
        } catch (err: any) {
            console.error("Submission error:", err);
            setError(err.response?.data?.message || 'Registration failed. Please check your details.');
            toast.error(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="h-screen grid grid-cols-1 lg:grid-cols-2 bg-background relative transition-colors duration-500 overflow-hidden">
            <LandingBackground />

            {/* Left Side: Branding & Hub Hero */}
            <div className="hidden lg:flex flex-col justify-center bg-[#030712] p-16 text-white overflow-hidden relative border-r border-white/5 h-full">
                {/* Background Hero Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/logistics_hub_hero.png"
                        alt="Logistics Hub"
                        className="w-full h-full object-cover opacity-40 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/40" />
                    {/* Brand Glows */}
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />
                </div>

                <div className="relative z-10">
                    <Link href="/" className="mb-24 block active:scale-95 transition-transform">
                        <Logo size="lg" />
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-md"
                    >
                        <h1 className="text-6xl md:text-8xl font-black leading-[0.8] text-white mb-8 tracking-tighter uppercase italic">
                            Hub <br />
                            <span className="text-emerald-500 emerald-text-glow">Activation.</span>
                        </h1>
                        <p className="text-xl text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-4">
                            Connect. Deliver. Scale.
                        </p>
                        <div className="w-12 h-1 bg-emerald-500 rounded-full mb-12 shadow-lg shadow-emerald-500/20" />
                    </motion.div>

                    <div className="flex items-center gap-4 text-emerald-500/80 font-black text-[10px] uppercase tracking-[0.4em] mt-20">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#030712] bg-slate-800" />
                            ))}
                        </div>
                        <span>Joined the network today</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex items-center justify-center p-4 lg:p-8 relative overflow-y-auto no-scrollbar h-full">
                <div className="max-w-md w-full py-20 lg:py-0">
                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-3xl font-black text-foreground mb-1 tracking-tighter uppercase italic">
                            {step === 1 ? 'Partner Identity' : step === 2 ? 'Security Shield' : 'Hub Activation'}
                        </h2>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-[9px]">
                            Step {step} of 3 &bull; {step === 1 ? 'Officer Details' : step === 2 ? 'Verification' : 'Fleet & Coverage'}
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
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
                                            <p className="text-[10px] text-emerald-500/80 font-black leading-normal uppercase tracking-widest italic">
                                                Company Owner Identity
                                            </p>
                                        </div>
                                    </div>

                                    <Input
                                        label="Corporate Officer Name"
                                        register={register('name')}
                                        error={errors.name?.message}
                                        placeholder="Samuel Stanley"
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Official Email"
                                            register={register('email')}
                                            error={errors.email?.message}
                                            type="email"
                                            placeholder="logistics@company.com"
                                        />
                                        <Select
                                            label="Base Nation"
                                            name="country"
                                            watch={watch}
                                            setValue={setValue}
                                            error={errors.country?.message}
                                            placeholder="Select Country"
                                            options={countries}
                                        />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 ml-1">Phone Number</label>
                                        <div className="flex gap-2">
                                            <div className="w-20 h-14 flex items-center justify-center bg-muted/30 border border-border rounded-2xl text-foreground font-black text-xs">
                                                {selectedCountry === 'Nigeria' ? '+234' :
                                                    selectedCountry === 'Ghana' ? '+233' :
                                                        selectedCountry === 'Kenya' ? '+254' :
                                                            selectedCountry === 'South Africa' ? '+27' : '+...'}
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    {...register('phone')}
                                                    type="tel"
                                                    onInput={(e: any) => e.target.value = e.target.value.replace(/\D/g, '')}
                                                    placeholder="803 000 0000"
                                                    className="w-full h-14 px-5 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-foreground font-bold transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                        {errors.phone && <p className="text-[10px] text-rose-500 mt-2 font-bold uppercase ml-1">{errors.phone.message}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Hub Password"
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

                                    <button
                                        type="button"
                                        onClick={sendOtp}
                                        disabled={sendingOtp}
                                        className="w-full h-14 bg-emerald-500 hover:brightness-110 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                                    >
                                        {sendingOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue to Verification'}
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
                                    <div className="bg-card/50 border border-border p-6 rounded-3xl text-center space-y-4">
                                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto text-emerald-500">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-foreground font-black text-sm uppercase tracking-tight">Security Shield</h3>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed">
                                                Verification code sent to <span className="text-emerald-500">{getValues().email}</span>.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="••••••"
                                            className="w-full h-20 text-center text-4xl font-black bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-foreground tracking-[0.5em] transition-all outline-none placeholder:text-muted-foreground/10"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        disabled={otp.length !== 6 || verifyingOtp}
                                        className="w-full h-14 bg-emerald-500 hover:brightness-110 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all uppercase tracking-widest text-sm"
                                    >
                                        {verifyingOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authorize & Configure'}
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
                                    <Input
                                        label="Company Name"
                                        register={register('companyName')}
                                        error={errors.companyName?.message}
                                        placeholder="Fast Lane Logistics Ltd"
                                    />

                                    <Input
                                        label="Office Address"
                                        register={register('address')}
                                        error={errors.address?.message}
                                        placeholder="Plot 12, Logistics Plaza, Ikeja"
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <Select
                                            label={selectedCountry === 'Kenya' ? "County" : selectedCountry === 'South Africa' ? "Province" : "State / Region"}
                                            name="state"
                                            watch={watch}
                                            setValue={setValue}
                                            error={errors.state?.message}
                                            placeholder="Select Region"
                                            options={availableStates.map(s => ({ label: s.name, value: s.name }))}
                                        />
                                        <Select
                                            label={selectedCountry === 'Nigeria' ? "Local Government" : selectedCountry === 'Kenya' ? "Sub-County" : "Municipality / City"}
                                            name="lga"
                                            watch={watch}
                                            setValue={setValue}
                                            error={errors.lga?.message}
                                            placeholder={selectedState ? "Select Area" : "Select region first"}
                                            options={availableLgas.map(lga => ({ label: lga, value: lga }))}
                                            disabled={!selectedState}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 ml-1">Delivery Type</label>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                            <VehicleOption
                                                selected={selectedVehicles.includes('BIKE')}
                                                onClick={() => toggleVehicle('BIKE')}
                                                label="Bike"
                                                icon={<Bike size={16} />}
                                            />
                                            <VehicleOption
                                                selected={selectedVehicles.includes('CAR')}
                                                onClick={() => toggleVehicle('CAR')}
                                                label="Car"
                                                icon={<CheckCircle2 size={16} />}
                                            />
                                            <VehicleOption
                                                selected={selectedVehicles.includes('VAN')}
                                                onClick={() => toggleVehicle('VAN')}
                                                label="Van"
                                                icon={<Package size={16} />}
                                            />
                                            <VehicleOption
                                                selected={selectedVehicles.includes('BICYCLE')}
                                                onClick={() => toggleVehicle('BICYCLE')}
                                                label="Cycle"
                                                icon={<Bike size={16} />}
                                            />
                                        </div>
                                        {errors.vehicleTypes && <p className="text-[10px] text-rose-500 mt-1 font-bold uppercase ml-1">{errors.vehicleTypes.message}</p>}
                                    </div>

                                    {/* Inter-state Section */}
                                    <div className="space-y-4 pt-2 border-t border-border/50">
                                        <div className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-2xl">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                                    <Globe size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-foreground uppercase tracking-widest">Inter-state Delivery</p>
                                                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">Deliver outside your base state</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const current = watch('isInterstate');
                                                    setValue('isInterstate', !current);
                                                    if (current) setValue('interstateCoverage', []);
                                                }}
                                                className={`w-12 h-6 rounded-full transition-all relative ${isInterstate ? 'bg-emerald-500' : 'bg-muted'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isInterstate ? 'left-7' : 'left-1'}`} />
                                            </button>
                                        </div>

                                        <AnimatePresence>
                                            {isInterstate && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="space-y-3 overflow-hidden"
                                                >
                                                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 ml-1">Select Covered States</label>
                                                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1 no-scrollbar">
                                                        {availableStates.map(s => (
                                                            <button
                                                                key={s.name}
                                                                type="button"
                                                                onClick={() => toggleInterstateState(s.name)}
                                                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${interstateCoverage.includes(s.name) ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-muted/50 border-border text-muted-foreground hover:border-emerald-500/30'}`}
                                                            >
                                                                {s.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-rose-500/10 rounded-xl text-rose-400 text-sm font-bold border border-rose-500/20">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-14 bg-emerald-500 hover:brightness-110 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all uppercase tracking-widest text-sm flex items-center justify-center"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Registration'}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <div className="mt-8 pt-4 border-t border-border/50 text-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                            Already joined? <Link href="/login/rider" className="text-emerald-500 hover:brightness-110 transition-colors ml-1">Terminal Login</Link>
                        </p>

                        {/* Quick Action to force submit if needed during debug */}
                        {!isValid && step === 3 && Object.keys(errors).length > 0 && (
                            <div className="p-2 bg-amber-500/5 rounded-lg">
                                <p className="text-[8px] font-bold text-amber-500 uppercase">Hidden validation errors detected. Check console.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeaturePoint({ icon, title, desc }: { icon: any; title: string; desc: string }) {
    return (
        <div className="flex items-start space-x-4">
            <div className="p-2.5 bg-muted rounded-xl border border-border">
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-black text-foreground uppercase tracking-tight">{title}</h3>
                <p className="text-xs text-muted-foreground font-bold italic">{desc}</p>
            </div>
        </div>
    );
}

function Input({ label, register, error, type = 'text', placeholder }: any) {
    return (
        <div>
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 ml-1">{label}</label>
            <input
                {...register}
                type={type}
                placeholder={placeholder}
                className="w-full h-14 px-5 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-foreground font-bold transition-all outline-none placeholder:text-muted-foreground/30"
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
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 ml-1">{label}</label>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full h-14 px-5 bg-muted/30 border ${isOpen ? 'border-emerald-500/50 ring-2 ring-emerald-500/20' : 'border-border'} rounded-2xl flex items-center justify-between cursor-pointer transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-border/80'}`}
            >
                <span className={`font-bold text-xs ${selectedValue ? 'text-foreground' : 'text-muted-foreground/40'}`}>
                    {selectedLabel}
                </span>
                <div className={`w-2 h-2 border-r-2 border-b-2 border-muted-foreground transform transition-transform ${isOpen ? '-rotate-135 mt-1' : 'rotate-45 -mt-1'}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 5 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-50 w-full mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto no-scrollbar"
                        >
                            {options.map((opt: any) => (
                                <div
                                    key={opt.value}
                                    onClick={() => {
                                        setValue(name, opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`px-5 py-3 text-xs font-bold cursor-pointer transition-colors ${selectedValue === opt.value ? 'bg-emerald-500 text-white' : 'text-foreground hover:bg-emerald-500/10'}`}
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

function VehicleOption({ selected, onClick, label, icon }: any) {
    return (
        <div
            onClick={onClick}
            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${selected ? 'bg-emerald-500/10 border-emerald-500 text-foreground' : 'bg-muted border-border text-muted-foreground hover:border-emerald-500/20'}`}
        >
            <div className={selected ? 'text-emerald-500' : ''}>{icon}</div>
            <span className="text-[8px] font-black uppercase tracking-widest leading-none text-center">{label}</span>
        </div>
    );
}
