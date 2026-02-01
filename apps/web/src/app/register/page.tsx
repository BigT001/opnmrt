'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '@opnmart/shared';
import { z } from 'zod';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';

// Extend base schema for seller-specific fields
// Extend base schema for seller-specific fields
const ExtendedRegisterSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.literal('SELLER'),
    subdomain: z.string().min(3, 'Subdomain must be at least 3 characters'),
    storeName: z.string().min(2, 'Store name must be at least 2 characters'),
});

type FormData = z.infer<typeof ExtendedRegisterSchema>;

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    const router = useRouter();
    const { setUser, setStore } = useAuthStore();

    const { register, handleSubmit, trigger, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(ExtendedRegisterSchema),
        defaultValues: {
            role: 'SELLER',
        }
    });

    const nextStep = async () => {
        const result = await trigger(['name', 'email', 'password']);
        if (result) setStep(2);
    };

    const prevStep = () => setStep(1);

    const onSubmit = async (data: FormData) => {
        try {
            setError(null);
            // Ensure role is SELLER explicitly
            const payload = { ...data, role: 'SELLER' };
            const response = await api.post('auth/register', payload);

            if (response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                setUser(response.data.user);
                setStore(response.data.store);
                // Redirect to seller dashboard after successful store creation
                router.push('/dashboard/seller');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create your store. Please try again.');
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
            {/* Left Side: Illustration/Branding */}
            <div className="hidden lg:flex flex-col justify-center bg-secondary p-12 text-white overflow-hidden relative">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-3xl opacity-10" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-3xl opacity-10" />

                <div className="relative z-10 max-w-md">
                    <Link href="/" className="text-3xl font-bold tracking-tighter mb-12 block text-primary">OPNMRT</Link>
                    <h1 className="text-5xl font-extrabold leading-tight mb-6">
                        The ultimate engine for modern commerce.
                    </h1>
                    <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                        Join 2,000+ businesses using OPNMRT to manage independent storefronts with AI-powered agility.
                    </p>
                    <ul className="space-y-4 text-slate-300">
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-white">✓</span>
                            Independent domain & subdomain management
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-white">✓</span>
                            AI insights for pricing & inventory
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-white">✓</span>
                            Direct payments via Paystack
                        </li>
                    </ul>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex items-center justify-center p-8 lg:p-24 relative overflow-y-auto">
                <div className="max-w-md w-full">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Create your store</h2>
                        <p className="text-slate-500">Step {step} of 2 &bull; {step === 1 ? 'Personal details' : 'Store configuration'}</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                        <input
                                            {...register('name')}
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transiton-all"
                                        />
                                        {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email address</label>
                                        <input
                                            {...register('email')}
                                            type="email"
                                            placeholder="name@company.com"
                                            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transiton-all"
                                        />
                                        {errors.email && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                                        <input
                                            {...register('password')}
                                            type="password"
                                            placeholder="Min. 8 characters"
                                            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transiton-all"
                                        />
                                        {errors.password && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password.message}</p>}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="w-full h-12 bg-primary hover:brightness-110 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/10 transition-all flex items-center justify-center gap-2"
                                    >
                                        Next Configuration
                                        <span>→</span>
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    {error && (
                                        <div className="p-4 bg-rose-50 rounded-xl text-rose-600 text-sm font-medium border border-rose-100">
                                            {error}
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Store Name</label>
                                        <input
                                            {...register('storeName')}
                                            type="text"
                                            placeholder="Modern Gear Co."
                                            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transiton-all"
                                        />
                                        {errors.storeName && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.storeName.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Store Subdomain</label>
                                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:bg-white">
                                            <input
                                                {...register('subdomain')}
                                                type="text"
                                                placeholder="modern-gear"
                                                className="flex-1 h-12 px-4 bg-transparent outline-none"
                                            />
                                            <span className="px-4 text-slate-400 font-medium text-sm">.opnmart.com</span>
                                        </div>
                                        {errors.subdomain && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.subdomain.message}</p>}
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex-1 h-12 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-[2] h-12 bg-primary hover:brightness-110 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/10 transition-all disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Finalizing Setup...' : 'Launch Store'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
                    </p>
                </div>

                {/* Visual indicator of the platform name for mobile */}
                <div className="absolute top-8 left-8 lg:hidden">
                    <Link href="/" className="text-2xl font-bold text-primary">OPNMRT</Link>
                </div>
            </div>
        </div>
    );
}
