'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@opnmart/shared';
import type { LoginInput } from '@opnmart/shared';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { LandingBackground } from '@/components/landing/LandingBackground';

export default function LoginPage() {
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
                localStorage.setItem('token', response.data.accessToken);
                setUser(response.data.user);
                setStore(response.data.store);

                const { role } = response.data.user;
                if (role === 'SELLER') {
                    router.push('/dashboard/seller');
                } else if (role === 'ADMIN') {
                    router.push('/dashboard/admin');
                } else {
                    router.push('/');
                }
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
                    <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <span className="text-[#030712] font-black italic text-2xl">O</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">OPNMRT</span>
                    </Link>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Merchant Portal</h2>
                    <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Access your digital empire or{' '}
                        <Link href="/register" className="text-emerald-500 hover:brightness-110 transition-colors">
                            ignite a new legacy
                        </Link>
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/60 backdrop-blur-3xl py-12 px-8 shadow-2xl rounded-[3rem] border border-white/5 sm:px-12"
                >
                    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                        {error && (
                            <div className="p-5 bg-rose-500/10 rounded-2xl text-rose-400 text-sm font-bold border border-rose-500/20 italic">
                                "{error}"
                            </div>
                        )}

                        <div className="space-y-6">
                            <Input
                                label="Access Key (Email)"
                                register={register('email')}
                                error={errors.email?.message}
                                placeholder="commander@opnmart.com"
                            />

                            <div className="relative">
                                <Input
                                    label="Security Code (Password)"
                                    register={register('password')}
                                    error={errors.password?.message}
                                    type="password"
                                    placeholder="••••••••"
                                />
                                <div className="absolute top-0 right-0">
                                    <a href="#" className="text-[10px] font-black text-emerald-500/60 uppercase hover:text-emerald-500 transition-colors">Recover?</a>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <div className="relative">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="sr-only peer" />
                                    <div className="w-5 h-5 bg-slate-800 border-2 border-slate-700 rounded-lg peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all" />
                                    <div className="absolute inset-0 flex items-center justify-center text-[#030712] opacity-0 peer-checked:opacity-100 transition-opacity">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">Persistent Session</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 bg-emerald-500 hover:brightness-110 text-[#030712] font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all disabled:opacity-50 uppercase tracking-widest text-sm flex items-center justify-center space-x-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-4 border-[#030712]/10 border-t-[#030712] rounded-full animate-spin" />
                                    <span>Authorizing...</span>
                                </>
                            ) : (
                                <span>Commander Login</span>
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
                className="w-full h-14 px-5 bg-slate-950/50 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white font-bold transition-all outline-none placeholder:text-slate-800"
            />
            {error && <p className="text-[10px] text-rose-500 mt-2 font-bold uppercase ml-1">{error}</p>}
        </div>
    );
}
