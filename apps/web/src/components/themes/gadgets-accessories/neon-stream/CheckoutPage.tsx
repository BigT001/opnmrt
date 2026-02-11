'use client';

import { CheckoutProps } from '../../types';
import { useStoreCart } from '@/store/useStoreCart';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Loader2, Zap, ShieldCheck, Activity, Terminal, ChevronRight, AlertCircle, Lock } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import api from '@/lib/api';
import { useCheckoutProfile } from '@/hooks/useCheckoutProfile';

const PaystackPayment = dynamic(() => import('../../PaystackPayment'), { ssr: false });

export function NeonStreamCheckout({ store }: CheckoutProps) {
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
            setError('Verification synchronization failed. Cluster timeout.');
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
            setError('Transmission bridge not configured.');
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
            setError(err.response?.data?.message || 'Stream initiation failure.');
            setIsSubmitting(false);
        }
    };

    if (!mounted) return null;

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

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="flex flex-col items-center gap-8">
                    <Loader2 className="w-12 h-12 animate-spin text-[#00F5FF]" />
                    <span className="text-[10px] font-black font-syne uppercase tracking-[0.5em] text-gray-500 italic animate-pulse">Synchronizing_Stream_Buffer...</span>
                </div>
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
                    <div className="lg:col-span-8 space-y-12">
                        <PaystackPayment config={config} onSuccess={onPaystackSuccess} onClose={onPaystackClose}>
                            {(initializePayment) => (
                                <form onSubmit={(e) => handleProcessOrder(e, initializePayment)} className="space-y-12">
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-[#00F5FF] text-black flex items-center justify-center text-xs font-black font-syne italic rounded-lg">01</div>
                                            <h2 className="text-xs font-black font-syne uppercase tracking-[0.3em] text-white italic border-b-2 border-[#00F5FF] pb-1">Identity_Node</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Neural_ID (Email)</label>
                                                <input
                                                    required
                                                    className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold text-white outline-none focus:border-[#00F5FF] transition-all rounded-xl placeholder:text-gray-700"
                                                    type="email"
                                                    placeholder="USER_NODE@NETWORK.NET"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Comms_Link (Phone)</label>
                                                <input
                                                    required
                                                    className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold text-white outline-none focus:border-[#00F5FF] transition-all rounded-xl placeholder:text-gray-700"
                                                    type="tel"
                                                    placeholder="000-000-000"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-[#BF00FF] text-white flex items-center justify-center text-xs font-black font-syne italic rounded-lg">02</div>
                                            <h2 className="text-xs font-black font-syne uppercase tracking-[0.3em] text-white italic border-b-2 border-[#BF00FF] pb-1">Node_Coordinates</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Full_Name</label>
                                                <input
                                                    required
                                                    className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold text-white outline-none focus:border-[#BF00FF] transition-all rounded-xl placeholder:text-gray-700"
                                                    placeholder="ARCHITECT NAME"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Physical_Node_Address</label>
                                                <input
                                                    required
                                                    className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold text-white outline-none focus:border-[#BF00FF] transition-all rounded-xl placeholder:text-gray-700"
                                                    placeholder="STREET / BUILDING / SECTOR"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Node_Cluster (City)</label>
                                                <input
                                                    required
                                                    className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold text-white outline-none focus:border-[#BF00FF] transition-all rounded-xl placeholder:text-gray-700"
                                                    placeholder="CLUSTER_01"
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Postal_Key</label>
                                                <input
                                                    required
                                                    className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold text-white outline-none focus:border-[#BF00FF] transition-all rounded-xl placeholder:text-gray-700"
                                                    placeholder="000-000"
                                                    value={formData.postalKey}
                                                    onChange={(e) => setFormData({ ...formData, postalKey: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Credit Transmission Node */}
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-[#00F5FF] text-black flex items-center justify-center text-xs font-black font-syne italic rounded-lg">03</div>
                                            <h2 className="text-xs font-black font-syne uppercase tracking-[0.3em] text-white italic border-b-2 border-[#00F5FF] pb-1">Transmission_Node</h2>
                                        </div>
                                        <div className="p-10 border border-white/10 bg-white/[0.02] rounded-[32px] flex items-center justify-between group hover:border-[#00F5FF]/30 transition-all">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <Lock className="w-4 h-4 text-[#00F5FF]" />
                                                    <h3 className="text-xs font-black font-syne uppercase tracking-[0.2em] text-white">Paystack_Gateway</h3>
                                                </div>
                                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest max-w-[200px]">
                                                    Encrypted credit stream via standardized neural bridge.
                                                </p>
                                            </div>
                                            <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center">
                                                <Zap className="w-6 h-6 text-[#00F5FF] group-hover:fill-current transition-all" />
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="p-6 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-4"
                                        >
                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                            <p className="text-[10px] font-black font-syne uppercase tracking-widest text-red-500">{error}</p>
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[#00F5FF] text-black h-24 rounded-2xl font-black font-syne text-xs uppercase tracking-[0.5em] hover:shadow-[0_0_40px_rgba(0,245,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                        <AnimatePresence mode="wait">
                                            {isSubmitting ? (
                                                <motion.div
                                                    key="submitting"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="flex items-center gap-3"
                                                >
                                                    <Loader2 className="animate-spin h-5 w-5" />
                                                    SYNCHRONIZING_STREAM...
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="pay"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex items-center gap-3"
                                                >
                                                    AUTHORIZE_REQUISITION {formatPrice(subtotal)}
                                                    <Zap className="w-4 h-4 group-hover:fill-current" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                </form>
                            )}
                        </PaystackPayment>
                    </div>

                    <div className="lg:col-span-4 lg:sticky lg:top-40">
                        <div className="border border-white/5 p-8 space-y-8 bg-white/[0.02] rounded-[32px] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#BF00FF]/5 rounded-bl-full -mr-12 -mt-12 blur-xl" />

                            <h2 className="text-xs font-black font-syne uppercase tracking-[0.3em] text-white italic border-b border-white/5 pb-4">Unit_Manifest_Summary</h2>

                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-16 h-16 bg-black/40 border border-white/5 p-2 rounded-xl flex-shrink-0 overflow-hidden">
                                            <img src={item.image || 'https://via.placeholder.com/200'} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-[9px] font-black uppercase text-white italic leading-tight group-hover:text-[#00F5FF] transition-colors line-clamp-2">{item.name}</p>
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
                                    <span className="text-2xl font-black font-syne text-white tracking-tighter italic">{formatPrice(subtotal)}</span>
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
