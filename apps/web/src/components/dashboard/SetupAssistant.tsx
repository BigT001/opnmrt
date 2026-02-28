'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, ArrowRight, CheckCircle2, Circle, Sparkles, Layout, CreditCard, ShoppingBag, User } from 'lucide-react';
import api from '@/lib/api';

interface OnboardingStats {
    hasProducts: boolean;
    hasLogo: boolean;
    hasPayments: boolean;
    hasBio: boolean;
    dismissed: boolean;
}

export function SetupAssistant({ stats, storeId, onDismiss }: { stats: OnboardingStats; storeId: string; onDismiss: () => void }) {
    const steps = [
        { id: 'products', label: 'Add Products', done: stats.hasProducts, href: '/dashboard/seller/products/new', icon: <ShoppingBag className="w-4 h-4" />, desc: 'List your first items' },
        { id: 'logo', label: 'Brand Identity', done: stats.hasLogo, href: '/dashboard/seller/settings', icon: <Layout className="w-4 h-4" />, desc: 'Logo & Accent colors' },
        { id: 'payments', label: 'Setup Payments', done: stats.hasPayments, href: '/dashboard/seller/settings', icon: <CreditCard className="w-4 h-4" />, desc: 'Connect Paystack' },
        { id: 'bio', label: 'Store Profile', done: stats.hasBio, href: '/dashboard/seller/settings', icon: <User className="w-4 h-4" />, desc: 'Business bio & Socials' },
    ];

    const completed = steps.filter(s => s.done).length;
    const progress = Math.round((completed / steps.length) * 100);
    const isFullyComplete = completed === steps.length;

    const handleDismiss = async () => {
        try {
            await api.patch(`/stores/${storeId}`, { onboardingDismissed: true });
            onDismiss();
        } catch (err) {
            console.error('Failed to dismiss onboarding', err);
            onDismiss(); // Fallback to local hide
        }
    };

    if (stats.dismissed && !isFullyComplete) return null;

    return (
        <AnimatePresence>
            {!stats.dismissed && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="fixed bottom-8 right-8 z-[1000] w-[380px] bg-white/80 backdrop-blur-2xl border border-slate-200/50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Store Assistant</p>
                                <h3 className="text-xl font-black tracking-tight">Build Your Empire</h3>
                            </div>
                            <button onClick={handleDismiss} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white/60 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="mt-6 flex items-center gap-4">
                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                />
                            </div>
                            <span className="text-[11px] font-black text-emerald-400">{progress}%</span>
                        </div>
                    </div>

                    {/* Steps Container */}
                    <div className="p-6 space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
                        {steps.map((step, idx) => (
                            <Link
                                key={step.id}
                                href={step.href}
                                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${step.done
                                    ? 'bg-emerald-50/30 border-emerald-100/50'
                                    : 'bg-white border-slate-100 hover:border-primary/20 hover:shadow-lg hover:shadow-slate-200/20 group'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${step.done
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                    {step.done ? <CheckCircle2 size={18} /> : step.icon}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`text-[11px] font-black uppercase tracking-tight ${step.done ? 'text-emerald-700' : 'text-slate-900'}`}>{step.label}</h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{step.desc}</p>
                                </div>
                                {!step.done && <ArrowRight size={14} className="text-slate-300 group-hover:text-primary transition-transform group-hover:translate-x-1" />}
                            </Link>
                        ))}
                    </div>

                    {/* Footer Tip */}
                    <div className="p-6 pt-0">
                        <div className="bg-slate-50 rounded-2xl p-4 flex items-start gap-3">
                            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                {isFullyComplete
                                    ? "Congratulations! Your store is fully optimized and ready for scaling. Focus on AI strategy to grow."
                                    : "Pro Tip: Stores with a professional logo and bio see 40% higher customer trust scores."}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
