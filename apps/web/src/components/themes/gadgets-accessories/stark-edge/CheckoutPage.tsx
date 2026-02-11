'use client';

import { CheckoutProps } from '../../types';
import { useStoreCart } from '@/store/useStoreCart';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckSquare, Loader2, ShieldCheck, Terminal, Cpu, Activity, ShoppingBag, AlertCircle, Lock } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import api from '@/lib/api';
import { useCheckoutProfile } from '@/hooks/useCheckoutProfile';

const PaystackPayment = dynamic(() => import('../../PaystackPayment'), { ssr: false });

export function StarkEdgeCheckout({ store }: CheckoutProps) {
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
        firstName: '',
        lastName: '',
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
            setError('PROTOCOL VERIFICATION FAILED. NODE TIMEOUT.');
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
            setError('PAYMENT GATEWAY NOT CONFIGURED.');
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
            setError(err.response?.data?.message || 'PROTOCOL INITIATION FAILURE.');
            setIsSubmitting(false);
        }
    };

    if (!mounted) return null;

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-10 font-tactical">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#111] border border-[#333] p-16 text-center max-w-2xl w-full relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#00F0FF] shadow-[0_0_15px_#00F0FF]" />

                    <div className="w-24 h-24 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 flex items-center justify-center mx-auto mb-10 text-[0px]">
                        <ShieldCheck size={48} className="text-[#00F0FF]" />
                    </div>

                    <div className="space-y-4 mb-12 text-center">
                        <div className="flex items-center justify-center gap-2 text-[#00F0FF]">
                            <Terminal className="w-4 h-4" />
                            <span className="font-data text-[10px] uppercase tracking-[0.4em]">Acquisition_Verified</span>
                        </div>
                        <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic">Order Authorized</h1>
                        <p className="text-white/40 font-data text-xs uppercase tracking-widest leading-relaxed">
                            Your device acquisition protocol has been executed successfully. Confirmation data sent to registered terminal node.
                        </p>
                    </div>

                    <Link
                        href={`/store/${params.subdomain}`}
                        className="group relative flex w-full h-20 items-center justify-center bg-white text-black font-black uppercase tracking-[0.4em] text-xs overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            Return To Hub
                            <Activity className="w-4 h-4" />
                        </span>
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-[#00F0FF] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                        <div className="absolute inset-0 bg-[#00F0FF] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[0.16,1,0.3,1] -z-10" />
                    </Link>

                    <div className="mt-12 pt-8 border-t border-[#333] flex justify-center gap-6 text-[8px] font-data text-white/20 uppercase tracking-[0.4em]">
                        <span>SECURE_LINK: YES</span>
                        <span>NODE: EDGE_01</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#080808]">
                <div className="flex flex-col items-center gap-8 border-l-4 border-[#00F0FF] pl-10">
                    <Loader2 className="w-12 h-12 animate-spin text-[#00F0FF]" />
                    <span className="font-data text-[10px] uppercase tracking-[0.5em] text-white/40 animate-pulse">Synchronizing_Neural_Link...</span>
                </div>
            </div>
        );
    }

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen bg-[#080808] py-32 font-tactical">
            <div className="max-w-[1400px] mx-auto px-10">
                <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-l-4 border-[#00F0FF] pl-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-4 text-[#00F0FF]">
                            <Cpu className="w-5 h-5" />
                            <span className="font-data text-[10px] uppercase tracking-[0.4em]">Deployment_Protocol_v4.0</span>
                        </div>
                        <h1 className="text-7xl font-black text-white uppercase tracking-tighter leading-none">Security Access</h1>
                    </div>

                    <div className="flex gap-4">
                        {[1, 2].map((step) => (
                            <div key={step} className={`w-16 h-1 ${step === 1 ? 'bg-[#00F0FF]' : 'bg-[#333]'}`} />
                        ))}
                    </div>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-20 items-start">
                    <div className="lg:col-span-7">
                        <PaystackPayment config={config} onSuccess={onPaystackSuccess} onClose={onPaystackClose}>
                            {(initializePayment) => (
                                <form onSubmit={(e) => handleProcessOrder(e, initializePayment)} className="space-y-12">
                                    <div className="space-y-8 bg-[#111] border border-[#333] p-10 relative">
                                        <div className="absolute top-4 right-4 text-[8px] font-data text-white/20 uppercase">Auth_Level_01</div>
                                        <h2 className="text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
                                            <Terminal className="w-5 h-5 text-[#00F0FF]" />
                                            Identity Verification
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label htmlFor="email" className="block font-data text-[10px] text-white/30 uppercase tracking-widest mb-3">Transmission Endpoint (Email)</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    required
                                                    className="block w-full h-16 bg-black border border-[#333] text-white font-data text-sm p-4 focus:border-[#00F0FF] focus:outline-none transition-colors"
                                                    placeholder="user@node.edge"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className="block font-data text-[10px] text-white/30 uppercase tracking-widest mb-3">COMMS_LINK (PHONE)</label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    required
                                                    className="block w-full h-16 bg-black border border-[#333] text-white font-data text-sm p-4 focus:border-[#00F0FF] focus:outline-none transition-colors"
                                                    placeholder="+234..."
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8 bg-[#111] border border-[#333] p-10 relative">
                                        <div className="absolute top-4 right-4 text-[8px] font-data text-white/20 uppercase">Auth_Level_02</div>
                                        <h2 className="text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
                                            <Box className="w-5 h-5 text-[#00F0FF]" />
                                            Deployment Logistics
                                        </h2>
                                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="firstName" className="block font-data text-[10px] text-white/30 uppercase tracking-widest mb-3">Operator First Name</label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    required
                                                    className="block w-full h-16 bg-black border border-[#333] text-white font-data text-sm p-4 focus:border-[#00F0FF] focus:outline-none transition-colors"
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="lastName" className="block font-data text-[10px] text-white/30 uppercase tracking-widest mb-3">Operator Last Name</label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    required
                                                    className="block w-full h-16 bg-black border border-[#333] text-white font-data text-sm p-4 focus:border-[#00F0FF] focus:outline-none transition-colors"
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label htmlFor="address" className="block font-data text-[10px] text-white/30 uppercase tracking-widest mb-3">Target Coordinate (Address)</label>
                                                <input
                                                    type="text"
                                                    id="address"
                                                    required
                                                    className="block w-full h-16 bg-black border border-[#333] text-white font-data text-sm p-4 focus:border-[#00F0FF] focus:outline-none transition-colors"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="city" className="block font-data text-[10px] text-white/30 uppercase tracking-widest mb-3">Node City</label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    required
                                                    className="block w-full h-16 bg-black border border-[#333] text-white font-data text-sm p-4 focus:border-[#00F0FF] focus:outline-none transition-colors"
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="postalCode" className="block font-data text-[10px] text-white/30 uppercase tracking-widest mb-3">Sector Code (Postal)</label>
                                                <input
                                                    type="text"
                                                    id="postalCode"
                                                    required
                                                    className="block w-full h-16 bg-black border border-[#333] text-white font-data text-sm p-4 focus:border-[#00F0FF] focus:outline-none transition-colors"
                                                    value={formData.postalCode}
                                                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Secured Currency Protocol (Paystack) */}
                                    <div className="space-y-8 bg-[#111] border border-[#333] p-10 relative">
                                        <div className="absolute top-4 right-4 text-[8px] font-data text-white/20 uppercase">Auth_Level_03</div>
                                        <h2 className="text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
                                            <ShieldCheck className="w-5 h-5 text-[#00F0FF]" />
                                            Currency Protocol
                                        </h2>
                                        <div className="p-8 border border-[#333] bg-black/40 flex items-center justify-between hover:border-[#00F0FF]/40 transition-all group">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-[#111] border border-[#333] flex items-center justify-center text-[#00F0FF]">
                                                    <Lock className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-black text-white text-xs uppercase tracking-widest">Paystack Secured</p>
                                                    <p className="font-data text-[9px] text-white/40 uppercase tracking-widest max-w-[200px]">End-to-end encrypted protocol node initialization.</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-[10px] font-data text-[#00F0FF] uppercase tracking-widest font-black">Ready</span>
                                                <div className="w-12 h-0.5 bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" />
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-red-500/10 border border-red-500/50 p-6 flex items-center gap-4"
                                        >
                                            <AlertCircle className="w-6 h-6 text-red-500" />
                                            <p className="font-black text-red-500 font-data text-[10px] uppercase tracking-widest italic">{error}</p>
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="group relative w-full h-24 bg-white text-black font-black uppercase tracking-[0.5em] text-sm overflow-hidden flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        <AnimatePresence mode="wait">
                                            {isSubmitting ? (
                                                <motion.div
                                                    key="submitting"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex items-center gap-3"
                                                >
                                                    <Loader2 className="animate-spin w-6 h-6 text-[#00F0FF]" />
                                                    <span>Encrypting Protocol...</span>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="pay"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex items-center gap-3"
                                                >
                                                    <span>Initiate Protocol: {formatPrice(subtotal)}</span>
                                                    <Activity className="w-6 h-6" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <div className="absolute inset-0 bg-[#00F0FF] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[0.16,1,0.3,1] -z-10" />
                                    </button>
                                </form>
                            )}
                        </PaystackPayment>
                    </div>

                    <div className="lg:col-span-5 mt-20 lg:mt-0">
                        <div className="bg-[#111] border border-[#333] p-10 lg:sticky lg:top-32 space-y-10">
                            <div className="flex items-center justify-between border-b border-[#333] pb-6">
                                <h2 className="text-xl font-bold text-white uppercase tracking-widest">Hardware Manifest</h2>
                                <ShoppingBag className="w-5 h-5 text-[#00F0FF]/40" />
                            </div>

                            <ul className="space-y-px bg-[#333] border border-[#333] max-h-[400px] overflow-y-auto custom-scrollbar">
                                {items.map((item) => (
                                    <li key={item.id} className="flex bg-[#080808] p-4 gap-4 group">
                                        <div className="h-16 w-16 bg-[#111] border border-[#333] overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image || 'https://via.placeholder.com/200'}
                                                alt={item.name}
                                                className="h-full w-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-white uppercase text-xs tracking-tighter line-clamp-1">{item.name}</h3>
                                                <p className="font-data text-xs text-[#00F0FF]">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <p className="font-data text-[9px] text-white/20 uppercase tracking-widest">Qty: {item.quantity}</p>
                                                <div className="w-1 h-1 bg-[#00F0FF] rounded-full animate-pulse" />
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <dl className="space-y-6 pt-6 font-data uppercase tracking-widest text-[10px]">
                                <div className="flex items-center justify-between text-white/40">
                                    <dt>Subtotal</dt>
                                    <dd>{formatPrice(subtotal)}</dd>
                                </div>
                                <div className="flex items-center justify-between text-white/40">
                                    <dt>Transfer Fee</dt>
                                    <dd>0.00 [MIL_SPEC]</dd>
                                </div>
                                <div className="flex items-center justify-between pt-6 border-t border-[#333]">
                                    <dt className="text-lg font-black text-white italic">Aggregate</dt>
                                    <dd className="text-2xl font-black text-[#00F0FF]">{formatPrice(subtotal)}</dd>
                                </div>
                            </dl>

                            <div className="pt-8 flex items-center gap-2 text-[8px] font-data text-white/20 uppercase tracking-[0.4em]">
                                <ShieldCheck className="w-3 h-3 text-[#00F0FF]/40" />
                                <span>END_TO_END_ENCRYPTION_ACTIVE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Link href={`/store/${params.subdomain}`} className="fixed bottom-10 left-10 flex items-center gap-3 text-[10px] font-data text-white/40 uppercase tracking-[0.4em] hover:text-[#00F0FF] transition-all bg-black/80 backdrop-blur-md px-6 py-3 border border-[#333] group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Abort protocol
            </Link>
        </div>
    );
}

const Box = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
    </svg>
);


