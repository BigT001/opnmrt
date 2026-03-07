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
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useCheckoutProfile } from '@/hooks/useCheckoutProfile';

import { useCheckoutPayment } from '@/hooks/useCheckoutPayment';

// const BackendPaystack = dynamic(() => import('../PaystackPayment'), { ssr: false });

export function AppifyCheckout({ store, subdomain }: CheckoutProps) {
    const { storeItems: items, subtotal, clearStoreCart } = useStoreCart(store.id);
    const { processCheckout, isSubmitting: payLoading, error: payError } = useCheckoutPayment();
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

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
    const primaryColor = store?.primaryColor || '#1a1a2e';
    const accentColor = `${primaryColor}10`; // Soft background alpha


    const handleProcessOrder = async () => {
        if (!formData.email || !formData.phone || !formData.address) {
            toast.error('Please fill in all required shipping details.');
            return;
        }

        try {
            await syncProfile();
            await processCheckout({
                storeId: store.id,
                items,
                amount: total,
                email: formData.email,
                onSuccess: (ref) => {
                    setIsSuccess(true);
                    clearStoreCart(store.id);
                }
            });
        } catch (err: any) {
            console.error('Checkout error:', err);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl" style={{ backgroundColor: accentColor }}>
                        <CheckCircle className="w-12 h-12" style={{ color: primaryColor }} />
                    </div>
                    <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase italic mb-4">Confirmed!</h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[11px] mb-10 leading-relaxed">
                        Your order has been placed.<br />We'll notify you once it's on the way.
                    </p>
                    <Link
                        href={`/store/${subdomain}`}
                        className="inline-block w-full py-5 text-white font-black uppercase tracking-[0.2em] text-[12px] rounded-2xl shadow-2xl active:scale-95 transition-all"
                        style={{ backgroundColor: primaryColor }}
                    >
                        Return Home
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-muted min-h-screen pb-32">
            {/* Header - Minimized height for compact precision */}
            <div className="px-5 py-4 flex items-center justify-between bg-background/80 backdrop-blur-xl border-b border-border sticky top-0 z-50">
                <Link href={`/store/${subdomain}`} className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-border active:scale-90 transition-all shrink-0">
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                </Link>
                <h1 className="text-[13px] font-black uppercase tracking-[0.2em] text-foreground text-center flex-grow -mr-10">Checkout</h1>
                <div className="w-10" />
            </div>

            <div className="px-5 py-6 space-y-6 max-w-lg mx-auto">
                {/* Summary Card */}
                <div className="bg-background rounded-[40px] p-8 shadow-sm border border-border space-y-6">
                    <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" /> Order Summary
                    </h3>
                    <div className="space-y-6">
                        {items.map((item: any) => (
                            <div key={item.id} className="flex items-center gap-5">
                                <div className="w-20 h-20 bg-muted rounded-full overflow-hidden shrink-0 border border-border">
                                    <img src={item.image || (item as any).images?.[0] || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h4 className="text-[15px] font-black text-foreground tracking-tight truncate">{item.name}</h4>
                                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                                </div>
                                <span className="text-[16px] font-black text-foreground tracking-tighter">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-background rounded-[40px] p-8 shadow-sm border border-border space-y-8">
                    <h3 className="text-[12px] font-black text-muted-foreground uppercase tracking-[0.2em]">Shipping Details</h3>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-3">Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="customer@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full h-15 px-7 bg-muted/30 border border-border rounded-[22px] text-[14px] font-bold outline-none focus:bg-background focus:ring-4 focus:ring-foreground/5 transition-all text-foreground"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-3">First Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Samuel"
                                    value={formData.firstName || ''}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full h-15 px-7 bg-muted/30 border border-border rounded-[22px] text-[14px] font-bold outline-none focus:bg-background focus:ring-4 focus:ring-foreground/5 transition-all text-foreground"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-3">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Stanley"
                                    value={formData.lastName || ''}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full h-15 px-7 bg-muted/30 border border-border rounded-[22px] text-[14px] font-bold outline-none focus:bg-background focus:ring-4 focus:ring-foreground/5 transition-all text-foreground"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-3">Phone Number</label>
                            <input
                                type="tel"
                                required
                                placeholder="0800 000 0000"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full h-15 px-7 bg-muted/30 border border-border rounded-[22px] text-[14px] font-bold outline-none focus:bg-background focus:ring-4 focus:ring-foreground/5 transition-all text-foreground"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-3">Shipping Address</label>
                            <textarea
                                required
                                placeholder="Full Delivery Address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full h-32 px-7 py-5 bg-muted/30 border border-border rounded-[22px] text-[14px] font-bold outline-none focus:bg-background focus:ring-4 focus:ring-foreground/5 transition-all resize-none text-foreground"
                            />
                        </div>
                    </div>
                </div>

                {/* Totals & Payment */}
                <div className="rounded-[40px] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden"
                    style={{ backgroundColor: primaryColor, boxShadow: `0 20px 50px ${primaryColor}40` }}>
                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center opacity-70">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Purchase Subtotal</span>
                            <span className="text-[15px] font-black">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center opacity-70">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Shipping Fee</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Calculated • Free</span>
                        </div>
                        <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                            <span className="text-[14px] font-black uppercase tracking-[0.2em]">Total Amount</span>
                            <span className="text-[28px] font-black tracking-tighter">{formatPrice(total)}</span>
                        </div>
                    </div>

                    {payError && (
                        <div className="p-4 bg-white/10 border border-white/20 rounded-2xl flex items-center gap-3 text-white relative z-10">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-[10px] font-black uppercase tracking-widest">{payError}</p>
                        </div>
                    )}

                    <button
                        onClick={handleProcessOrder}
                        disabled={payLoading}
                        className="w-full h-18 bg-white font-bold rounded-[24px] flex items-center justify-center gap-3 text-[14px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 relative z-10"
                        style={{ color: primaryColor }}
                    >
                        <AnimatePresence mode="wait">
                            {payLoading ? (
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
