'use client';

import { CheckoutProps } from '../../types';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Loader2, ShieldCheck, Zap, Activity, Terminal, ChevronRight } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

export function TechSpecCheckout({ }: CheckoutProps) {
    const params = useParams<{ subdomain: string }>();
    const { items, totalPrice, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        if (items.length === 0 && !isSuccess && params?.subdomain) {
            router.push(`/store/${params.subdomain}`);
        }
    }, [items.length, params?.subdomain, router, isSuccess]);

    if (!mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        setIsSubmitting(false);
        setIsSuccess(true);
        clearCart();
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 font-data">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full border border-gray-100 p-12 text-center space-y-8 bg-gray-50 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full -mr-16 -mt-16" />

                    <div className="w-20 h-20 bg-white border border-green-500 flex items-center justify-center mx-auto relative z-10">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">Deployment Authorized</h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                            Hardware acquisition protocol completed. Units assigned to your sector. Check your terminal for transmission logistics.
                        </p>
                    </div>

                    <Link
                        href={`/store/${params.subdomain}`}
                        className="flex items-center justify-center gap-3 w-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#E72E46] transition-all"
                    >
                        RETURN TO HUB
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen bg-white font-data py-24">
            <div className="max-w-[1400px] mx-auto px-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-[#E72E46]">
                            <Terminal className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Acquisition Protocol v4.0</span>
                        </div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-gray-900">Finalize Deployment</h1>
                    </div>
                    <Link href={`/store/${params.subdomain}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Abort Protocol
                    </Link>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Checkout Form */}
                    <div className="lg:col-span-8 space-y-12">
                        <form onSubmit={handleSubmit} className="space-y-12">
                            {/* Identity Verification */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-black italic">01</div>
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 italic border-b-2 border-black pb-1">Identity Verification</h2>
                                </div>
                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Network ID (Email)</label>
                                        <input required className="w-full bg-gray-50 border border-gray-100 p-4 text-xs font-bold outline-none focus:border-[#E72E46] transition-colors" type="email" placeholder="USER_ALPHA@SECTOR_01.NET" />
                                    </div>
                                </div>
                            </div>

                            {/* Deployment Sector */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-black italic">02</div>
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 italic border-b-2 border-black pb-1">Deployment Sector</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contact Name</label>
                                        <input required className="w-full bg-gray-50 border border-gray-100 p-4 text-xs font-bold outline-none focus:border-[#E72E46] transition-colors" placeholder="COMMANDER NAME" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sector Coordinates (Address)</label>
                                        <input required className="w-full bg-gray-50 border border-gray-100 p-4 text-xs font-bold outline-none focus:border-[#E72E46] transition-colors" placeholder="PHYSICAL DEPLOYMENT ZONE" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">City / Node</label>
                                        <input required className="w-full bg-gray-50 border border-gray-100 p-4 text-xs font-bold outline-none focus:border-[#E72E46] transition-colors" placeholder="NODE LOCATION" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Post Key</label>
                                        <input required className="w-full bg-gray-50 border border-gray-100 p-4 text-xs font-bold outline-none focus:border-[#E72E46] transition-colors" placeholder="000-000" />
                                    </div>
                                </div>
                            </div>

                            {/* Credits Allocation */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-black italic">03</div>
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 italic border-b-2 border-black pb-1">Credits Allocation</h2>
                                </div>
                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Credit Chip Number</label>
                                        <input required className="w-full bg-gray-50 border border-gray-100 p-4 text-xs font-bold outline-none focus:border-[#E72E46] transition-colors" placeholder="0000 0000 0000 0000" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Exp Threshold</label>
                                            <input required className="w-full bg-gray-50 border border-gray-100 p-4 text-xs font-bold outline-none focus:border-[#E72E46] transition-colors" placeholder="MM/YY" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure Key</label>
                                            <input required className="w-full bg-gray-50 border border-gray-100 p-4 text-xs font-bold outline-none focus:border-[#E72E46] transition-colors" placeholder="***" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#E72E46] text-white h-20 font-black text-xs uppercase tracking-[0.5em] hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        SYNCHRONIZING...
                                    </>
                                ) : (
                                    <>
                                        AUTHORIZE ACQUISITION {formatPrice(totalPrice())}
                                        <Zap className="w-4 h-4 group-hover:fill-current" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Unit Manifest Summary */}
                    <div className="lg:col-span-4 lg:sticky lg:top-40">
                        <div className="border border-gray-100 p-8 space-y-8 bg-gray-50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-black/5 rounded-bl-full -mr-12 -mt-12" />

                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 italic border-b border-gray-200 pb-4">Unit Manifest</h2>

                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-white border border-gray-100 p-1 flex-shrink-0">
                                            <img src={item.image || 'https://via.placeholder.com/200'} alt={item.name} className="w-full h-full object-contain grayscale" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-[9px] font-black uppercase text-gray-900 italic leading-tight">{item.name}</p>
                                            <p className="text-[10px] font-bold text-[#E72E46]">{formatPrice(item.price)} <span className="text-gray-300 ml-2">x {item.quantity}</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-gray-200">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
                                    <span>Logistics Fee</span>
                                    <span>CREDIT_FREE</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 italic">Aggregate</span>
                                    <span className="text-2xl font-black text-black tracking-tighter italic">{formatPrice(totalPrice())}</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-8">
                                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                    E2E ENCRYPTED CHECKOUT
                                </div>
                                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                    <Activity className="w-4 h-4 text-blue-500" />
                                    REAL-TIME INVENTORY LOCK
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
