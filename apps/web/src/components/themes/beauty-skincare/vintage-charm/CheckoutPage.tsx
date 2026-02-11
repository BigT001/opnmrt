'use client';

import { CheckoutProps } from '../../types';
import { useStoreCart } from '@/store/useStoreCart';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Loader2, Scroll, Check, AlertCircle, Lock } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import api from '@/lib/api';
import { useCheckoutProfile } from '@/hooks/useCheckoutProfile';

const PaystackPayment = dynamic(() => import('../../PaystackPayment'), { ssr: false });

export function VintageCharmCheckout({ store }: CheckoutProps) {
    const params = useParams<{ subdomain: string }>();
    const { storeItems: items, subtotal, clearStoreCart } = useStoreCart(store.id);
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orderId, setOrderId] = useState('');
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
        setOrderId(`ARC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
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
            setError('Verification failed. Please contact our conservatory.');
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
            setError('Conservatory gateway not configured.');
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
            setError(err.response?.data?.message || 'Failed to initiate archive order.');
            setIsSubmitting(false);
        }
    };

    if (!mounted) return null;

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#F9F4EE] flex flex-col items-center justify-center p-10">
                <div className="bg-white p-12 vintage-border shadow-[0_20px_60px_rgba(27,48,34,0.1)] text-center max-w-xl w-full space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Scroll className="w-32 h-32" />
                    </div>

                    <div className="w-24 h-24 bg-[#1B3022] text-[#F9F4EE] rounded-full flex items-center justify-center mx-auto shadow-xl">
                        <Check className="w-12 h-12" />
                    </div>

                    <div className="space-y-2">
                        <span className="font-cursive text-3xl text-[#8B4513]">Transaction Sealed</span>
                        <h1 className="text-5xl font-black text-[#1B3022] tracking-tighter uppercase italic leading-none">
                            Success Verified
                        </h1>
                    </div>

                    <p className="font-serif italic text-xl text-[#1B3022]/70 leading-relaxed">
                        Your archive acquisition has been processed. A formal confirmation dispatch has been sent to your correspondence address.
                    </p>

                    <div className="pt-6 border-t border-[#1B3022]/10">
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#1B3022]/40 block mb-4">
                            Archive_Entry: {orderId}
                        </span>
                        <Link
                            href={`/store/${params.subdomain}`}
                            className="inline-block bg-[#1B3022] text-[#F9F4EE] px-12 py-5 font-black uppercase italic tracking-tighter text-xl hover:bg-[#8B4513] transition-all"
                        >
                            Return to Collections
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9F4EE]">
                <div className="flex flex-col items-center gap-8">
                    <Loader2 className="w-12 h-12 animate-spin text-[#1B3022]" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#1B3022]/40 italic">Syncing Archival Correspondence...</span>
                </div>
            </div>
        );
    }

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen bg-[#F9F4EE] py-32">
            <div className="max-w-[1400px] mx-auto px-10">
                <div className="mb-20 space-y-6">
                    <Link href={`/store/${params.subdomain}`} className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-[#1B3022]/50 hover:text-[#1B3022] transition-colors">
                        <ArrowLeft className="w-3 h-3" />
                        Back to Archive
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <span className="font-cursive text-4xl text-[#8B4513]">Transaction Portal</span>
                            <h1 className="text-6xl md:text-7xl font-black text-[#1B3022] tracking-tighter uppercase italic leading-none">
                                Sealing the Order
                            </h1>
                        </div>
                        <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#1B3022]/40 bg-white/50 px-6 py-3 vintage-border">
                            Order_Queue: {orderId}
                        </div>
                    </div>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-20 items-start">
                    <div className="lg:col-span-7">
                        <PaystackPayment config={config} onSuccess={onPaystackSuccess} onClose={onPaystackClose}>
                            {(initializePayment) => (
                                <form onSubmit={(e) => handleProcessOrder(e, initializePayment)} className="space-y-12">
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <h2 className="text-2xl font-black text-[#1B3022] tracking-tighter uppercase italic">I. Correspondent</h2>
                                            <div className="h-[1px] flex-grow bg-[#1B3022]/10" />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="font-mono text-[10px] uppercase tracking-widest text-[#1B3022]/50 font-black">Official Email</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-white vintage-border p-5 font-serif italic focus:outline-none focus:border-[#8B4513] transition-colors text-lg text-[#1B3022]"
                                                    placeholder="archivist@heritage.com"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="font-mono text-[10px] uppercase tracking-widest text-[#1B3022]/50 font-black">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full bg-white vintage-border p-5 font-serif italic focus:outline-none focus:border-[#8B4513] transition-colors text-lg text-[#1B3022]"
                                                    placeholder="+123..."
                                                />
                                            </div>
                                            <div className="space-y-2 sm:col-span-2">
                                                <label className="font-mono text-[10px] uppercase tracking-widest text-[#1B3022]/50 font-black">Full Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                    className="w-full bg-white vintage-border p-5 font-serif italic focus:outline-none focus:border-[#8B4513] transition-colors text-lg text-[#1B3022]"
                                                    placeholder="Archival Recipient Name"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <h2 className="text-2xl font-black text-[#1B3022] tracking-tighter uppercase italic">II. Destination</h2>
                                            <div className="h-[1px] flex-grow bg-[#1B3022]/10" />
                                        </div>
                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <label className="font-mono text-[10px] uppercase tracking-widest text-[#1B3022]/50 font-black">Archive Address</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    className="w-full bg-white vintage-border p-5 font-serif italic focus:outline-none focus:border-[#8B4513] transition-colors text-lg text-[#1B3022]"
                                                    placeholder="Street, Laboratory, or Estate"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="font-mono text-[10px] uppercase tracking-widest text-[#1B3022]/50 font-black">City / District</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.city}
                                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                        className="w-full bg-white vintage-border p-5 font-serif italic focus:outline-none focus:border-[#8B4513] transition-colors text-lg text-[#1B3022]"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="font-mono text-[10px] uppercase tracking-widest text-[#1B3022]/50 font-black">Postal_Code</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.postalCode}
                                                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                                        className="w-full bg-white vintage-border p-5 font-serif italic focus:outline-none focus:border-[#8B4513] transition-colors text-lg"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <h2 className="text-2xl font-black text-[#1B3022] tracking-tighter uppercase italic">III. Allocation</h2>
                                            <div className="h-[1px] flex-grow bg-[#1B3022]/10" />
                                        </div>
                                        <div className="bg-white p-8 vintage-border">
                                            <div className="flex items-center justify-between gap-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 bg-[#1B3022] rounded-full flex items-center justify-center text-[#F9F4EE]">
                                                        <Lock className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-black text-[#1B3022] tracking-tighter uppercase italic">Paystack Conservatory</h3>
                                                        <p className="font-mono text-[10px] uppercase tracking-widest text-[#1B3022]/40 mt-1 italic">Formal Secure Encryption</p>
                                                    </div>
                                                </div>
                                                <div className="hidden md:block">
                                                    <div className="px-4 py-2 bg-[#F9F4EE] border border-[#1B3022]/10 rounded-full flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                                                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#1B3022]/40">Secured Session</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-6 bg-red-50 border border-red-200 text-red-600 flex items-center gap-4"
                                        >
                                            <AlertCircle className="w-6 h-6 shrink-0" />
                                            <p className="font-serif italic">{error}</p>
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[#1B3022] text-[#F9F4EE] py-8 px-12 text-3xl font-black uppercase italic tracking-tighter hover:bg-[#8B4513] transition-all disabled:opacity-50 flex items-center justify-center gap-6 shadow-2xl overflow-hidden relative"
                                    >
                                        <AnimatePresence mode="wait">
                                            {isSubmitting ? (
                                                <motion.div
                                                    key="submitting"
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: -20, opacity: 0 }}
                                                    className="flex items-center gap-4"
                                                >
                                                    <Loader2 className="animate-spin w-8 h-8" />
                                                    <span>Affixing Seal...</span>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="pay"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex items-center gap-4"
                                                >
                                                    <span>Verify & Acquire Allocation</span>
                                                    <ShieldCheck className="w-8 h-8" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                </form>
                            )}
                        </PaystackPayment>
                    </div>

                    <div className="lg:col-span-5 mt-20 lg:mt-0">
                        <div className="bg-white p-10 vintage-border lg:sticky lg:top-32 space-y-10">
                            <h2 className="text-3xl font-black text-[#1B3022] tracking-tighter uppercase italic border-b border-[#1B3022]/10 pb-6">Manifest Check</h2>
                            <ul className="divide-y divide-[#1B3022]/5">
                                {items.map((item) => (
                                    <li key={item.id} className="flex py-6 gap-6 group">
                                        {item.image && (
                                            <div className="w-20 h-24 shrink-0 bg-[#F9F4EE] p-1 vintage-border overflow-hidden">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover grayscale-[0.3]"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-black text-[#1B3022] tracking-tighter uppercase italic leading-none">{item.name}</h3>
                                                <span className="font-serif italic text-lg text-[#1B3022]">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                            <p className="font-mono text-[9px] uppercase tracking-widest text-[#1B3022]/40">Allocation_Qty: {item.quantity}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <dl className="space-y-4 pt-10 border-t-2 border-double border-[#1B3022]/10">
                                <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-[#1B3022]/40 font-black">
                                    <dt>Subtotal_Aggregate</dt>
                                    <dd className="text-[#1B3022]">{formatPrice(subtotal)}</dd>
                                </div>
                                <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-[#1B3022]/40 font-black">
                                    <dt>Shipping_Tariff</dt>
                                    <dd className="text-[#1B3022]">Complimentary</dd>
                                </div>
                                <div className="flex justify-between items-end pt-8 border-t border-[#1B3022]/10">
                                    <dt className="space-y-1">
                                        <span className="font-cursive text-3xl text-[#8B4513]">Grand Sum</span>
                                        <span className="block text-4xl font-black text-[#1B3022] tracking-tighter uppercase italic leading-none">Total Value</span>
                                    </dt>
                                    <dd className="text-6xl font-black italic tracking-tighter text-[#1B3022]">{formatPrice(subtotal)}</dd>
                                </div>
                            </dl>

                            <div className="pt-6 flex items-center gap-4 border-t border-[#1B3022]/10 mt-10 opacity-30">
                                <ShieldCheck className="w-12 h-12 stroke-[1px]" />
                                <p className="font-serif italic text-[10px] leading-tight">This transaction is protected by the Standard Archival Protocol. All allocations are final upon verification seal.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


