'use client';

import { CheckoutProps } from '../../types';
import { useStoreCart } from '@/store/useStoreCart';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Loader2, ShieldCheck, Zap, Activity, Terminal, ChevronRight, AlertCircle, Lock } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import api from '@/lib/api';
import { useCheckoutProfile } from '@/hooks/useCheckoutProfile';

const PaystackPayment = dynamic(() => import('../../PaystackPayment'), { ssr: false });

export function TechSpecCheckout({ store }: CheckoutProps) {
    const params = useParams<{ subdomain: string }>();
    const { storeItems: items, subtotal, clearStoreCart } = useStoreCart(store.id);
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const activeOrderId = useRef<string | null>(null);

    const { formData, setFormData, syncProfile, isLoaded } = useCheckoutProfile({
        email: '',
        phone: '',
        fullName: '',
        address: '',
        city: '',
        postalCode: ''
    });

    useEffect(() => {
        setMounted(true);
        if (items.length === 0 && !isSuccess && params?.subdomain) {
            router.push(`/store/${params.subdomain}`);
        }
    }, [items.length, params?.subdomain, router, isSuccess]);

    const config = {
        reference: (new Date()).getTime().toString(),
        email: formData.email,
        amount: Math.round(subtotal * 100),
        publicKey: store.paystackPublicKey || '',
    };

    const onPaystackSuccess = async (reference: any) => {
        if (!activeOrderId.current) return;
        try {
            await api.post('/payments/verify', {
                storeId: store.id,
                reference: reference.reference,
                orderId: activeOrderId.current
            });
            setIsSuccess(true);
            clearStoreCart(store.id);
        } catch (err: any) {
            setError('VERIFICATION TIMEOUT. PROTOCOL SYNC FAILED.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const onPaystackClose = () => {
        setIsSubmitting(false);
    };

    const handleProcessOrder = async (e: React.FormEvent, initializePayment: () => void) => {
        e.preventDefault();

        if (!store.paystackPublicKey) {
            setError('GATEWAY CONFIGURATION MISSING.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Centralized profile sync
            await syncProfile();

            const orderRes = await api.post('/orders', {
                storeId: store.id,
                totalAmount: subtotal,
                items: items.map(p => ({
                    productId: p.id,
                    quantity: p.quantity,
                    price: p.price
                }))
            });

            activeOrderId.current = orderRes.data.id;
            initializePayment();

        } catch (err: any) {
            setError(err.response?.data?.message || 'ALLOCATION PROTOCOL ERROR.');
            setIsSubmitting(false);
        }
    };

    if (!mounted) return null;

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

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-8">
                    <Loader2 className="w-12 h-12 animate-spin text-[#E72E46]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 italic">Synchronizing Protocol...</span>
                </div>
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
                    <div className="lg:col-span-8 space-y-12">
                        <PaystackPayment config={config} onSuccess={onPaystackSuccess} onClose={onPaystackClose}>
                            {(initializePayment) => (
                                <form onSubmit={(e) => handleProcessOrder(e, initializePayment)} className="space-y-12">
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-black italic">01</div>
                                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 italic border-b-2 border-black pb-1">Identity Verification</h2>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Network ID (Email)</label>
                                                <input
                                                    required
                                                    className="w-full bg-gray-50 border border-gray-100 p-4 text-xs font-bold outline-none focus:border-[#E72E46] transition-colors text-slate-900"
                                                    type="email"
                                                    placeholder="USER_ALPHA@SECTOR_01.NET"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Comms Link (Phone)</label>
                                                <input
                                                    required
                                                    className="w-full bg-gray-50 border border-gray-100 p-4 text-xs font-bold outline-none focus:border-[#E72E46] transition-colors text-slate-900"
                                                    type="tel"
                                                    placeholder="+1-000-000"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-black italic">02</div>
                                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 italic border-b-2 border-black pb-1">Deployment Sector</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contact Name</label>
                                                <input
                                                    required
                                                    className="w-full bg-gray-50 border border-gray-100 p-4 text-xs font-bold outline-none focus:border-[#E72E46] transition-colors text-slate-900"
                                                    placeholder="COMMANDER NAME"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sector Coordinates (Address)</label>
                                                <input
                                                    required
                                                    className="w-full bg-gray-50 border border-gray-100 p-4 text-xs font-bold outline-none focus:border-[#E72E46] transition-colors text-slate-900"
                                                    placeholder="PHYSICAL DEPLOYMENT ZONE"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">City / Node</label>
                                                <input
                                                    required
                                                    className="w-full bg-gray-50 border border-gray-100 p-4 text-xs font-bold outline-none focus:border-[#E72E46] transition-colors text-slate-900"
                                                    placeholder="NODE LOCATION"
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Post Key</label>
                                                <input
                                                    required
                                                    className="w-full bg-gray-50 border border-gray-100 p-4 text-xs font-bold outline-none focus:border-[#E72E46] transition-colors text-slate-900"
                                                    placeholder="000-000"
                                                    value={formData.postalCode}
                                                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Secured Allocation Protocol (Paystack) */}
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-black italic">03</div>
                                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 italic border-b-2 border-black pb-1">Allocation Protocol</h2>
                                        </div>
                                        <div className="p-10 border-2 border-dashed border-gray-100 bg-gray-50 flex items-center justify-between group hover:border-black/20 transition-all">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <Lock className="w-5 h-5 text-gray-400" />
                                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 italic">Paystack Gateway Node</h3>
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest max-w-[280px] leading-relaxed">
                                                    SECURE INITIALIZATION VIA ENCRYPTED CREDIT CHANNEL. PROTOCOL E2E_V4.
                                                </p>
                                            </div>
                                            <div className="w-16 h-16 bg-white border border-gray-100 flex items-center justify-center">
                                                <ShieldCheck className="w-8 h-8 text-black group-hover:scale-110 transition-transform" />
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="p-6 border-l-4 border-red-500 bg-red-50 flex items-center gap-4 font-mono"
                                        >
                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-red-700">{error}</p>
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[#E72E46] text-white h-24 font-black text-xs uppercase tracking-[0.5em] hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group relative overflow-hidden"
                                    >
                                        <AnimatePresence mode="wait">
                                            {isSubmitting ? (
                                                <motion.div
                                                    key="submitting"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="flex items-center gap-4"
                                                >
                                                    <Loader2 className="animate-spin h-5 w-5" />
                                                    SYNCHRONIZING...
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="pay"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex items-center gap-4"
                                                >
                                                    AUTHORIZE ACQUISITION {formatPrice(subtotal)}
                                                    <Zap className="w-4 h-4 group-hover:fill-current" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                    </button>
                                </form>
                            )}
                        </PaystackPayment>
                    </div>

                    <div className="lg:col-span-4 lg:sticky lg:top-40">
                        <div className="border border-gray-100 p-8 space-y-8 bg-gray-50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-black/5 rounded-bl-full -mr-12 -mt-12" />

                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 italic border-b border-gray-200 pb-4">Unit Manifest</h2>

                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-16 h-16 bg-white border border-gray-100 p-1 flex-shrink-0">
                                            <img src={item.image || 'https://via.placeholder.com/200'} alt={item.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-[9px] font-black uppercase text-gray-900 italic leading-tight line-clamp-2">{item.name}</p>
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
                                    <span className="text-2xl font-black text-black tracking-tighter italic">{formatPrice(subtotal)}</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-8 border-t border-dashed border-gray-200">
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
