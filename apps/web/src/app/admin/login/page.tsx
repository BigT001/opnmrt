'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@opnmrt/shared';
import type { LoginInput } from '@opnmrt/shared';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { LandingBackground } from '@/components/landing/LandingBackground';
import { Logo } from '@/components/ui/Logo';

export default function AdminLoginPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
    });

    const { setUser, setStore } = useAuthStore();

    const onSubmit = async (data: LoginInput) => {
        try {
            setError(null);
            const response = await api.post('auth/login', data);

            if (response.data && response.data.accessToken) {
                const { role } = response.data.user;
                if (role !== 'ADMIN') {
                    setError('Access Denied: You are not an administrator.');
                    return;
                }

                localStorage.setItem('token', response.data.accessToken);
                setUser(response.data.user);
                setStore(response.data.store);
                router.push('/dashboard/admin');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#030712] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <LandingBackground />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="text-center mb-12">
                    <Link href="/" className="mb-12 flex justify-center">
                        <Logo size="lg" />
                    </Link>
                    <h2 className="text-4xl font-black text-rose-500 tracking-tighter uppercase">OPNMRT Admin</h2>
                    <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        System Administrator Access Only
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/80 backdrop-blur-3xl py-12 px-8 shadow-2xl rounded-[3rem] border border-rose-500/20 sm:px-12"
                >
                    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                        {error && (
                            <div className="p-5 bg-rose-500/10 rounded-2xl text-rose-400 text-sm font-bold border border-rose-500/20 italic">
                                "{error}"
                            </div>
                        )}

                        <div className="space-y-6">
                            <Input
                                label="Admin Key (Email)"
                                register={register('email')}
                                error={errors.email?.message}
                                placeholder="opnmrtadmin@opnmrt.com"
                            />

                            <div className="relative">
                                <Input
                                    label="Security Code (Password)"
                                    register={register('password')}
                                    error={errors.password?.message}
                                    type="password"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 bg-rose-600 hover:brightness-110 text-white font-black rounded-2xl shadow-xl shadow-rose-500/20 transition-all disabled:opacity-50 uppercase tracking-widest text-sm flex items-center justify-center space-x-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                    <span>Authorizing...</span>
                                </>
                            ) : (
                                <span>Authenticate Admin</span>
                            )}
                        </button>
                    </form>
                </motion.div>

                <div className="mt-12 text-center">
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">
                        Secured by OPNMRT Neural Shield &bull; 2026
                    </p>
                </div>
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
                className="w-full h-14 bg-slate-950/50 backdrop-blur-xl border border-white/10 rounded-2xl px-5 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition-all"
            />
            {error && <p className="mt-3 text-[10px] font-bold text-rose-500 uppercase tracking-wider ml-1">{error}</p>}
        </div>
    );
}
