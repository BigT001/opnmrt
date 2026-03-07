'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { LandingBackground } from '@/components/landing/LandingBackground';
import { Logo } from '@/components/ui/Logo';
import { Loader2, ShieldCheck, Mail, Lock, ArrowRight, Bike } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof LoginSchema>;

export default function RiderLoginPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { setUser } = useAuthStore();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            setError(null);
            const response = await api.post('auth/login', data);

            if (response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                setUser(response.data.user);

                if (response.data.user.role !== 'DISPATCH' && response.data.user.role !== 'ADMIN') {
                    setError('This portal is reserved for Dispatch Riders.');
                    localStorage.removeItem('token');
                    return;
                }

                toast.success('Control Center Authorized.');
                router.push('/dashboard/dispatch');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
        }
    };

    return (
        <div className="h-screen bg-background relative transition-colors duration-500 overflow-hidden flex items-center justify-center p-4">
            <LandingBackground />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="bg-card/80 backdrop-blur-3xl border border-border p-10 rounded-[3rem] shadow-2xl">
                    <div className="flex justify-center mb-10">
                        <Logo />
                    </div>

                    <div className="mb-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
                            <Bike className="w-3 h-3 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Hub Access</span>
                        </div>
                        <h2 className="text-3xl font-black text-foreground mb-2 tracking-tighter uppercase italic">Control Access</h2>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-[9px]">Enter your dispatcher credentials</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-rose-500/10 rounded-2xl text-rose-400 text-[11px] font-black border border-rose-500/20 text-center uppercase tracking-widest"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 ml-4">Identifier</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-emerald-500">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        {...register('email')}
                                        type="email"
                                        placeholder="partner@example.com"
                                        className="w-full h-16 pl-14 pr-6 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-foreground font-bold transition-all outline-none placeholder:text-muted-foreground/50"
                                    />
                                </div>
                                {errors.email && <p className="text-[10px] text-rose-500 mt-2 font-black uppercase ml-4 tracking-widest">{errors.email.message}</p>}
                            </div>

                            <div className="relative">
                                <div className="flex justify-between items-center mb-3 px-4">
                                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Secret Key</label>
                                    <Link href="/auth/forgot" className="text-[9px] font-black text-muted-foreground/50 hover:text-foreground uppercase tracking-widest transition-colors">Recover</Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-emerald-500">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        {...register('password')}
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full h-16 pl-14 pr-6 bg-muted/30 border border-border rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-foreground font-bold transition-all outline-none placeholder:text-muted-foreground/50"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm mt-8 active:scale-95 disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                    Authorize
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center space-y-4">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                            New to the fleet?
                            <Link href="/register/rider" className="text-emerald-500 hover:brightness-110 transition-colors ml-2">Activate Hub</Link>
                        </p>
                        <div className="flex items-center justify-center gap-6 pt-6 border-t border-border">
                            <Link href="/login" className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] hover:text-foreground transition-colors flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3" />
                                Merchant Access
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
