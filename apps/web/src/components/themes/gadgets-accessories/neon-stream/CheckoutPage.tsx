'use client';

import { CheckoutProps } from '../../types';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Loader2, Zap, ShieldCheck, Activity, Terminal, ChevronRight } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

export function NeonStreamCheckout({ }: CheckoutProps) {
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
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-10 font-inter">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full border border-white/5 p-12 text-center space-y-8 bg-white/[0.02] rounded-[40px] relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F5FF]/10 rounded-bl-full -mr-16 -mt-16 blur-2xl" />

                    <div className="w-20 h-20 bg-black/40 border border-[#00F5FF]/50 flex items-center justify-center mx-auto rounded-3xl relative z-10">
                        <CheckCircle className="w-10 h-10 text-[#00F5FF]" />
                    </div>

                    <div className="space-y-4 relative z-10">
                        <h1 className="text-2xl font-black font-syne uppercase italic tracking-tighter text-white">Transmission_Complete</h1>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] leading-relaxed">
                            Hardware stream synchronization successful. Your units have been assigned to the specified node coordinates. Check your neural feed for tracking data.
                        </p>
                    </div>

                    <Link
                        href={`/store/${params.subdomain}`}
                        className="flex items-center justify-center gap-3 w-full bg-[#00F5FF] text-black py-4 rounded-xl text-[10px] font-black font-syne uppercase tracking-[0.4em] hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all relative z-10"
                    >
                        RETURN_TO_HUB
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen bg-[#050505] font-inter py-24 px-6">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-[#BF00FF]">
                            <Terminal className="w-4 h-4" />
                            <span className="text-[10px] font-black font-syne tracking-[0.4em] uppercase">Security_Protocol_Active</span>
                        </div>
                        <h1 className="text-4xl font-black font-syne uppercase italic tracking-tighter text-white">Finalize_Acquisition</h1>
                    </div>
                    <Link href={`/store/${params.subdomain}`} className="text-[10px] font-black font-syne uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        ABORT_STREAM
                    </Link>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Checkout Form */}
                    <div className="lg:col-span-8 space-y-12">
                        <form onSubmit={handleSubmit} className="space-y-12">
                            {/* Identity Node */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-[#00F5FF] text-black flex items-center justify-center text-xs font-black font-syne italic rounded-lg">01</div>
                                    <h2 className="text-xs font-black font-syne uppercase tracking-[0.3em] text-white italic border-b-2 border-[#00F5FF] pb-1">Identity_Node</h2>
                                </div>
                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Neural_ID (Email)</label>
                                        <input required className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold text-white outline-none focus:border-[#00F5FF] transition-all rounded-xl" type="email" placeholder="USER_NODE@NETWORK.NET" />
                                    </div>
                                </div>
                            </div>

                            {/* Node Coordinates */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-[#BF00FF] text-white flex items-center justify-center text-xs font-black font-syne italic rounded-lg">02</div>
                                    <h2 className="text-xs font-black font-syne uppercase tracking-[0.3em] text-white italic border-b-2 border-[#BF00FF] pb-1">Node_Coordinates</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Full_Name</label>
                                        <input required className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold text-white outline-none focus:border-[#BF00FF] transition-all rounded-xl" placeholder="ARCHITECT NAME" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Physical_Node_Address</label>
                                        <input required className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold text-white outline-none focus:border-[#BF00FF] transition-all rounded-xl" placeholder="STREET / BUILDING / SECTOR" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Node_Cluster (City)</label>
                                        <input required className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold text-white outline-none focus:border-[#BF00FF] transition-all rounded-xl" placeholder="CLUSTER_01" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Postal_Key</label>
                                        <input required className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold text-white outline-none focus:border-[#BF00FF] transition-all rounded-xl" placeholder="000-000" />
                                    </div>
                                </div>
                            </div>

                            {/* Credit Transmission */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-[#00F5FF] text-black flex items-center justify-center text-xs font-black font-syne italic rounded-lg">03</div>
                                    <h2 className="text-xs font-black font-syne uppercase tracking-[0.3em] text-white italic border-b-2 border-[#00F5FF] pb-1">Credit_Transmission</h2>
                                </div>
                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Credit_Chip_Number</label>
                                        <input required className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold text-white outline-none focus:border-[#00F5FF] transition-all rounded-xl" placeholder="0000 0000 0000 0000" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Sync_Threshold</label>
                                            <input required className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold text-white outline-none focus:border-[#00F5FF] transition-all rounded-xl" placeholder="MM/YY" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Secure_Key</label>
                                            <input required className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold text-white outline-none focus:border-[#00F5FF] transition-all rounded-xl" placeholder="***" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#00F5FF] text-black h-20 rounded-2xl font-black font-syne text-xs uppercase tracking-[0.5em] hover:shadow-[0_0_40px_rgba(0,245,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        SYNCHRONIZING_STREAM...
                                    </>
                                ) : (
                                    <>
                                        AUTHORIZE_REQUISITION {formatPrice(totalPrice())}
                                        <Zap className="w-4 h-4 group-hover:fill-current" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Unit Summary Node */}
                    <div className="lg:col-span-4 lg:sticky lg:top-40">
                        <div className="border border-white/5 p-8 space-y-8 bg-white/[0.02] rounded-[32px] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#BF00FF]/5 rounded-bl-full -mr-12 -mt-12 blur-xl" />

                            <h2 className="text-xs font-black font-syne uppercase tracking-[0.3em] text-white italic border-b border-white/5 pb-4">Unit_Manifest_Summary</h2>

                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-16 h-16 bg-black/40 border border-white/5 p-2 rounded-xl flex-shrink-0">
                                            <img src={item.image || 'https://via.placeholder.com/200'} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-[9px] font-black uppercase text-white italic leading-tight group-hover:text-[#00F5FF] transition-colors">{item.name}</p>
                                            <p className="text-[10px] font-bold text-[#00F5FF]">{formatPrice(item.price)} <span className="text-gray-600 ml-2">x {item.quantity}</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-white/5">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 italic">
                                    <span>Logistics_Fee</span>
                                    <span className="text-[#00F5FF]">STREAM_EXEMPT</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-xs font-black font-syne uppercase tracking-[0.3em] text-white italic">Aggregate_Total</span>
                                    <span className="text-2xl font-black font-syne text-white tracking-tighter italic">{formatPrice(totalPrice())}</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-8">
                                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-gray-500">
                                    <ShieldCheck className="w-4 h-4 text-[#00F5FF]" />
                                    ENCRYPTED_TUNNEL
                                </div>
                                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-gray-500">
                                    <Activity className="w-4 h-4 text-[#BF00FF]" />
                                    REAL_TIME_INVENTORY_SYNC
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
