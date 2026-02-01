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

                // Redirect based on role
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
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <Link href="/" className="text-3xl font-bold tracking-tighter text-primary">OPNMRT</Link>
                    <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Sign in to your account</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Or{' '}
                        <Link href="/register" className="font-bold text-primary hover:brightness-110 transition-colors">
                            create a new store in minutes
                        </Link>
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-white py-10 px-4 shadow-xl shadow-slate-200 rounded-2xl sm:px-10 border border-slate-100"
                >
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {error && (
                            <div className="p-4 bg-rose-50 rounded-xl text-rose-600 text-sm font-medium border border-rose-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-slate-700">Email address</label>
                            <div className="mt-1">
                                <input
                                    {...register('email')}
                                    type="email"
                                    className="block w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                                />
                                {errors.email && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700">Password</label>
                            <div className="mt-1">
                                <input
                                    {...register('password')}
                                    type="password"
                                    className="block w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                                />
                                {errors.password && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password.message}</p>}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 font-medium">Remember me</label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-bold text-primary hover:brightness-110 transition-colors">Forgot your password?</a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 bg-primary hover:brightness-110 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/10 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? 'Verifying...' : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
