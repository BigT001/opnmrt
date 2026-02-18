'use client';

import React, { useState } from 'react';
import { CheckoutProps } from '../types';
import { useStoreCart } from '@/store/useStoreCart';
import { formatPrice } from '@/lib/utils';
import { ChevronLeft, Lock, CreditCard, ShoppingBag, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useCheckoutProfile } from '@/hooks/useCheckoutProfile';

const PaystackPayment = dynamic(() => import('../PaystackPayment'), { ssr: false });

export function AppifyCheckout({ store, subdomain }: CheckoutProps) {
    const { storeItems: items, subtotal, clearStoreCart } = useStoreCart(store.id);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const activeOrderId = React.useRef<string | null>(null);

    const { formData, setFormData, syncProfile, isLoaded } = useCheckoutProfile({
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
    });

    const shipping = 0;
    const total = subtotal + shipping;

    const paystackConfig = {
        reference: (new Date()).getTime().toString(),
        email: formData.email,
        amount: Math.round(total * 100),
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
            setError('Payment verification failed. Please contact support.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const onPaystackClose = () => {
        setIsSubmitting(false);
    };

    const handleProcessOrder = async (initializePayment: () => void) => {
        if (!store.paystackPublicKey) {
            setError('Payment gateway is not configured.');
            return;
        }

        if (!formData.email || !formData.phone || !formData.address) {
            setError('Please fill in all required shipping details.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await syncProfile();
            const orderRes = await api.post('/orders', {
                storeId: store.id,
                totalAmount: total,
                items: items.map((p: any) => ({
                    productId: p.id,
                    quantity: p.quantity,
                    price: p.price
                }))
            });

            activeOrderId.current = orderRes.data.id;
            initializePayment();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Order failed. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10">
                        <CheckCircle className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl font-black text-[#1a1a2e] tracking-tighter uppercase italic mb-4">Confirmed!</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] mb-10 leading-relaxed">
                        Your order has been placed.<br />We'll notify you once it's on the way.
                    </p>
                    <Link
                        href={`/store/${subdomain}`}
                        className="inline-block w-full py-5 bg-[#0a0a0a] text-white font-black uppercase tracking-[0.2em] text-[12px] rounded-2xl shadow-2xl active:scale-95 transition-all"
                    >
                        Return Home
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-[#f8f9fb] min-h-screen pb-32">
            {/* Header - Minimized height for compact precision */}
            <div className="px-5 py-4 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
                <Link href={`/store/${subdomain}`} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 active:scale-90 transition-all shrink-0">
                    <ArrowLeft className="w-5 h-5 text-gray-900" />
                </Link>
                <h1 className="text-[13px] font-black uppercase tracking-[0.2em] text-gray-900 text-center flex-grow -mr-10">Checkout</h1>
                <div className="w-10" />
            </div>

            <div className="px-5 py-6 space-y-6 max-w-lg mx-auto">
                {/* Summary Card */}
                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" /> Order Summary
                    </h3>
                    <div className="space-y-6">
                        {items.map((item: any) => (
                            <div key={item.id} className="flex items-center gap-5">
                                <div className="w-20 h-20 bg-gray-50 rounded-full overflow-hidden shrink-0 border border-gray-100">
                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h4 className="text-[15px] font-black text-[#1a1a2e] tracking-tight truncate">{item.name}</h4>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                                </div>
                                <span className="text-[16px] font-black text-[#1a1a2e] tracking-tighter">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 space-y-8">
                    <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em]">Shipping Details</h3>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-3">Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="customer@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full h-15 px-7 bg-gray-50 border border-gray-100 rounded-[22px] text-[14px] font-bold outline-none focus:bg-white focus:border-orange-500 transition-all text-slate-900"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-3">First Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full h-15 px-7 bg-gray-50 border border-gray-100 rounded-[22px] text-[14px] font-bold outline-none focus:bg-white focus:border-orange-500 transition-all text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-3">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full h-15 px-7 bg-gray-50 border border-gray-100 rounded-[22px] text-[14px] font-bold outline-none focus:bg-white focus:border-orange-500 transition-all text-slate-900"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-3">Phone Number</label>
                            <input
                                type="tel"
                                required
                                placeholder="0800 000 0000"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full h-15 px-7 bg-gray-50 border border-gray-100 rounded-[22px] text-[14px] font-bold outline-none focus:bg-white focus:border-orange-500 transition-all text-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-3">Shipping Address</label>
                            <textarea
                                required
                                placeholder="Full Delivery Address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full h-32 px-7 py-5 bg-gray-50 border border-gray-100 rounded-[22px] text-[14px] font-bold outline-none focus:bg-white focus:border-orange-500 transition-all resize-none text-slate-900"
                            />
                        </div>
                    </div>
                </div>

                {/* Totals & Payment */}
                <div className="bg-[#1a1a2e] rounded-[40px] p-8 text-white space-y-6 shadow-2xl shadow-[#1a1a2e]/30 relative overflow-hidden">
                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center opacity-50">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Purchase Subtotal</span>
                            <span className="text-[15px] font-black">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center opacity-50">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Shipping Fee</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Calculated • Free</span>
                        </div>
                        <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                            <span className="text-[14px] font-black uppercase tracking-[0.2em]">Total Amount</span>
                            <span className="text-[28px] font-black tracking-tighter text-orange-400">{formatPrice(total)}</span>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 relative z-10">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                        </div>
                    )}

                    <PaystackPayment config={paystackConfig} onSuccess={onPaystackSuccess} onClose={onPaystackClose}>
                        {(initializePayment) => (
                            <button
                                onClick={() => handleProcessOrder(initializePayment)}
                                disabled={isSubmitting}
                                className="w-full h-18 bg-orange-500 hover:bg-orange-600 font-bold text-white rounded-[24px] flex items-center justify-center gap-3 text-[14px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-500/30 active:scale-[0.98] disabled:opacity-50 relative z-10"
                            >
                                <AnimatePresence mode="wait">
                                    {isSubmitting ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center gap-3"
                                        >
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Processing...</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="static"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center gap-3"
                                        >
                                            <CreditCard className="w-5 h-5" />
                                            <span>Secure Checkout</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        )}
                    </PaystackPayment>

                    <p className="text-[9px] text-white/20 text-center uppercase font-black tracking-[0.3em] flex items-center justify-center gap-2 relative z-10">
                        <Lock className="w-3 h-3" /> Secure Paystack Gateway
                    </p>

                    {/* Atmospheric background elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-16" />
                </div>
            </div>
        </div>
    );
}
