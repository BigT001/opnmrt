'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CheckoutProps } from '../types';
import { useStoreCart } from '@/store/useStoreCart';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Loader2, Shield, CreditCard, Truck, ShoppingBag, AlertCircle, Lock } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import api from '@/lib/api';
import { useCheckoutProfile } from '@/hooks/useCheckoutProfile';

import { useCheckoutPayment } from '@/hooks/useCheckoutPayment';

// const BackendPaystack = dynamic(() => import('../PaystackPayment'), { ssr: false });

export function DefaultCheckout({ store, subdomain }: CheckoutProps) {
    const params = useParams<{ subdomain: string }>();
    const { storeItems: items, subtotal, clearStoreCart } = useStoreCart(store.id);
    const [mounted, setMounted] = useState(false);
    const { processCheckout, isSubmitting: payLoading, error: payError } = useCheckoutPayment();
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const router = useRouter();

    const { formData, setFormData, syncProfile, isLoaded } = useCheckoutProfile({
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: ''
    });

    const activeSubdomain = subdomain || store.subdomain || params?.subdomain;
    const primaryColor = store?.primaryColor || '#000000';
    const accentColor = `${primaryColor}15`;

    useEffect(() => {
        setMounted(true);
        setOrderNumber(Math.floor(100000 + Math.random() * 900000).toString());
        if (items.length === 0 && !isSuccess && params?.subdomain) {
            router.push(`/store/${params.subdomain}`);
        }
    }, [items.length, params?.subdomain, router, isSuccess]);

    const handleProcessOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await syncProfile();
            const fullName = formData.fullName || `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
            await processCheckout({
                storeId: store.id,
                items,
                amount: subtotal,
                email: formData.email,
                customerName: fullName || undefined,
                customerEmail: formData.email,
                onSuccess: (ref) => {
                    setIsSuccess(true);
                    clearStoreCart(store.id);
                }
            });
        } catch (err: any) {
            console.error('Checkout error:', err);
        }
    };

    if (!mounted) return null;

    if (isSuccess) {
        console.log('%c[UI_CHECKOUT] ✨ Rendering SUCCESS screen', 'color: #10b981; font-weight: bold;');
        return (
            <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg w-full bg-background rounded-3xl p-12 text-center shadow-xl border border-border"
                >
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner" style={{ backgroundColor: accentColor }}>
                        <CheckCircle className="w-10 h-10" style={{ color: primaryColor }} />
                    </div>
                    <h1 className="text-3xl font-black text-foreground mb-4 uppercase tracking-tight">Order Confirmed!</h1>
                    <p className="text-muted-foreground mb-8 font-medium">
                        Your order has been placed successfully.
                        We'll send you an email confirmation shortly.
                    </p>
                    <Link
                        href={`/store/${activeSubdomain}`}
                        style={{ backgroundColor: primaryColor }}
                        className="inline-block w-full py-4 text-white font-black uppercase tracking-widest text-sm rounded-xl hover:opacity-90 transition-all shadow-lg"
                    >
                        Back to Shopping
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white font-data">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Loading profile...</span>
                </div>
            </div>
        );
    }

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
                <div className="flex items-center justify-between mb-12">
                    <Link href={`/store/${activeSubdomain}`} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Back to Store</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-gray-900" />
                        <span className="text-lg font-black text-gray-900 uppercase tracking-tight">Checkout</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-7">
                        <form onSubmit={handleProcessOrder} className="space-y-12">
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-xs font-black">1</div>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Contact Information</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                required
                                                className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                                placeholder="Phone Number"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-xs font-black">2</div>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Shipping Address</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Address</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">City</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Postal Code</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                            value={formData.postalCode}
                                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-xs font-black">3</div>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Payment Method</h2>
                                </div>
                                <div className="p-8 border-2 border-emerald-500 bg-emerald-50/10 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-emerald-50/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                            <Lock className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <span className="font-black text-sm uppercase tracking-tight block">Secure Paystack Gateway</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Encrypted Payment Processing</span>
                                        </div>
                                    </div>
                                    <CreditCard className="w-6 h-6 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                                </div>
                            </section>

                            {payError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600"
                                >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-xs font-bold uppercase tracking-widest">{payError}</p>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={payLoading}
                                className="w-full py-6 bg-gray-900 text-white text-sm font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl relative overflow-hidden group"
                            >
                                <AnimatePresence mode="wait">
                                    {payLoading ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="flex items-center gap-3"
                                        >
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Initializing...</span>
                                        </motion.div>
                                    ) : (
                                        <motion.span
                                            key="text"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            Pay Now • {formatPrice(subtotal)}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-gray-50 rounded-3xl p-8 sticky top-32 border border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Order Summary</h2>
                            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-20 h-20 bg-white border border-gray-100 rounded-xl overflow-hidden shrink-0">
                                            <img src={item.image || (item as any).images?.[0] || 'https://via.placeholder.com/100'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">{item.name}</h3>
                                                <p className="text-sm font-black text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase mt-1">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-gray-200">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Subtotal</span>
                                    <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Shipping</span>
                                    <span className="text-emerald-600 font-bold text-[10px] uppercase">Free</span>
                                </div>
                                <div className="flex justify-between text-xl font-black text-gray-900 pt-3 border-t border-gray-200">
                                    <span className="uppercase tracking-tight">Total</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4 pt-6 border-t border-dashed border-gray-200">
                                <div className="flex items-center gap-3 text-gray-400">
                                    <Shield className="w-4 h-4 text-emerald-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">TLS 1.3 Secure Encryption</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-400">
                                    <Truck className="w-4 h-4 text-blue-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Global Express Shipping</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
