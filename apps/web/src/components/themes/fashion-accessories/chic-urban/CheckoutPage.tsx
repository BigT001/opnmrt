'use client';

import React, { useState, useEffect } from 'react';
import { CheckoutProps } from '../../types';
import { useStoreCart } from '@/store/useStoreCart';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Loader2, Zap, Shield, Terminal, Activity } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

export function ChicUrbanCheckout({ store }: CheckoutProps) {
    const params = useParams<{ subdomain: string }>();
    const { storeItems: items, subtotal, clearStoreCart } = useStoreCart(store.id);
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        setTransactionId(Math.random().toString(36).substring(2).toUpperCase());
        if (items.length === 0 && !isSuccess && params?.subdomain) {
            router.push(`/store/${params.subdomain}`);
        }
    }, [items.length, params?.subdomain, router, isSuccess]);

    if (!mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2500));
        setIsSubmitting(false);
        setIsSuccess(true);
        clearStoreCart(store.id);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 border-[20px] border-[#CCFF00]">
                <div className="text-center max-w-xl w-full space-y-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-32 h-32 bg-[#CCFF00] text-black rotate-45 flex items-center justify-center mx-auto"
                    >
                        <CheckCircle className="w-16 h-16 -rotate-45" />
                    </motion.div>

                    <div className="space-y-4">
                        <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none">
                            Order_Confirmed
                        </h1>
                        <p className="font-mono text-sm text-[#CCFF00] uppercase tracking-widest leading-loose">
                            Transaction_ID: {transactionId}<br />
                            Status: Securely_Processed // Shipment_Queue_Entry_OK
                        </p>
                    </div>

                    <Link
                        href={`/store/${params.subdomain}`}
                        className="inline-block bg-[#CCFF00] text-black font-black uppercase italic tracking-tighter px-12 py-6 text-2xl hover:bg-white transition-colors border-4 border-[#CCFF00]"
                    >
                        Return_to_Nexus
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-[1400px] mx-auto px-6">
                {/* Tactical Terminal Header */}
                <div className="mb-16 border-b-8 border-black pb-10 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="space-y-4 text-black">
                        <div className="flex items-center gap-4 font-mono text-[10px] font-black uppercase tracking-widest">
                            <Terminal className="w-4 h-4" />
                            <span>System: Checkout_v4.2</span>
                            <span className="text-black/20">//</span>
                            <span>Encrypted Session</span>
                        </div>
                        <h1 className="text-8xl font-black uppercase italic tracking-tighter leading-none">
                            Transaction
                        </h1>
                    </div>
                    <Link href={`/store/${params.subdomain}`} className="bg-black text-white p-4 font-black uppercase italic tracking-tighter flex items-center gap-3 hover:bg-[#CCFF00] hover:text-black transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Abort_Process</span>
                    </Link>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-16">
                    {/* Transaction Form */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="space-y-12">
                            {/* Contact Module */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <span className="bg-black text-white px-3 py-1 font-mono text-[10px] uppercase font-black">Node_01</span>
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Identity_Data</h2>
                                </div>
                                <div className="border-4 border-black p-8 space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block font-mono text-[10px] font-black uppercase text-black/40 mb-2">Primary_Email_Address</label>
                                        <input type="email" id="email" required className="w-full bg-gray-50 border-2 border-black p-4 font-bold text-lg focus:bg-[#CCFF00]/10 outline-none transition-colors" placeholder="USER@DOMAIN.COM" />
                                    </div>
                                </div>
                            </div>

                            {/* Logistics Module */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <span className="bg-black text-white px-3 py-1 font-mono text-[10px] uppercase font-black">Node_02</span>
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Delivery_Coordinates</h2>
                                </div>
                                <div className="border-4 border-black p-8 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block font-mono text-[10px] font-black uppercase text-black/40 mb-2">First_Name</label>
                                            <input type="text" required className="w-full bg-gray-50 border-2 border-black p-4 font-bold outline-none focus:bg-[#CCFF00]/10 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block font-mono text-[10px] font-black uppercase text-black/40 mb-2">Last_Name</label>
                                            <input type="text" required className="w-full bg-gray-50 border-2 border-black p-4 font-bold outline-none focus:bg-[#CCFF00]/10 transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block font-mono text-[10px] font-black uppercase text-black/40 mb-2">Full_Street_Address</label>
                                        <input type="text" required className="w-full bg-gray-50 border-2 border-black p-4 font-bold outline-none focus:bg-[#CCFF00]/10 transition-colors" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block font-mono text-[10px] font-black uppercase text-black/40 mb-2">Urban_Center (City)</label>
                                            <input type="text" required className="w-full bg-gray-50 border-2 border-black p-4 font-bold outline-none focus:bg-[#CCFF00]/10 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block font-mono text-[10px] font-black uppercase text-black/40 mb-2">Postal_Zone</label>
                                            <input type="text" required className="w-full bg-gray-50 border-2 border-black p-4 font-bold outline-none focus:bg-[#CCFF00]/10 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Secure Payment Module */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <span className="bg-black text-white px-3 py-1 font-mono text-[10px] uppercase font-black">Node_03</span>
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Credit_Allocation</h2>
                                </div>
                                <div className="border-4 border-black p-8 bg-black text-white space-y-6">
                                    <div>
                                        <label className="block font-mono text-[10px] font-black uppercase text-white/40 mb-2">Hardware_Card_ID</label>
                                        <input type="text" placeholder="0000 0000 0000 0000" required className="w-full bg-white/10 border-2 border-white/20 p-4 font-bold text-lg focus:border-[#CCFF00] outline-none transition-colors" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block font-mono text-[10px] font-black uppercase text-white/40 mb-2">Expiry_Vector</label>
                                            <input type="text" placeholder="MM / YY" required className="w-full bg-white/10 border-2 border-white/20 p-4 font-bold outline-none focus:border-[#CCFF00] transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block font-mono text-[10px] font-black uppercase text-white/40 mb-2">Validation_Code</label>
                                            <input type="text" placeholder="123" required className="w-full bg-white/10 border-2 border-white/20 p-4 font-bold outline-none focus:border-[#CCFF00] transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-black text-[#CCFF00] py-8 text-4xl font-black uppercase italic tracking-tighter hover:bg-[#CCFF00] hover:text-black transition-all active:scale-95 disabled:opacity-50 group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                <span className="relative z-10 flex items-center justify-center gap-6">
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin w-8 h-8" />
                                            <span>Processing_Data</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Authorize_Order // {formatPrice(subtotal)}</span>
                                            <Zap className="w-8 h-8 fill-current" />
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>
                    </div>

                    {/* Order Inventory Summary */}
                    <div className="lg:col-span-5 mt-20 lg:mt-0">
                        <div className="bg-[#F5F5F5] border-4 border-black p-8 lg:sticky lg:top-24 space-y-10">
                            <div className="flex items-center justify-between border-b-2 border-black pb-6">
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Manifest_v1.0</h2>
                                <span className="font-mono text-[10px] font-black bg-black text-white px-2">LIVE_DATA</span>
                            </div>

                            <div className="space-y-6 overflow-hidden">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="h-20 w-20 flex-shrink-0 border-2 border-black overflow-hidden bg-white">
                                            <img
                                                src={item.image || 'https://via.placeholder.com/100'}
                                                alt={item.name}
                                                className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-black uppercase italic text-sm leading-tight">{item.name}</h3>
                                                <p className="font-black text-sm italic">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                            <p className="font-mono text-[9px] font-bold text-black/40 uppercase">QTY: [{item.quantity.toString().padStart(2, '0')}]</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t-4 border-black pt-8 space-y-4">
                                <div className="flex justify-between font-mono text-[10px] font-black uppercase text-black/40">
                                    <span>Cumulative_Total</span>
                                    <span className="text-black">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between font-mono text-[10px] font-black uppercase text-black/40">
                                    <span>Logistics_Fee</span>
                                    <span className="text-black">FREE_TIER</span>
                                </div>
                                <div className="flex justify-between items-end pt-4 border-t-2 border-black/10">
                                    <span className="text-2xl font-black uppercase italic tracking-tighter underline decoration-[#CCFF00] decoration-4 underline-offset-8">Final_Allocation</span>
                                    <span className="text-5xl font-black italic tracking-tighter text-black">{formatPrice(subtotal)}</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-10">
                                <div className="flex items-center gap-3 text-black/40">
                                    <Shield className="w-5 h-5" />
                                    <span className="font-mono text-[9px] font-black uppercase tracking-widest text-black">Encrypted_Transaction_Protocol_v4</span>
                                </div>
                                <div className="flex items-center gap-3 text-black/40">
                                    <Activity className="w-5 h-5 text-[#CCFF00] fill-black" />
                                    <span className="font-mono text-[9px] font-black uppercase tracking-widest">Network_Latency: 14ms // Optimal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


