'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CheckoutProps } from '../types';
import { useStoreCart } from '@/store/useStoreCart';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Loader2, Shield, CreditCard, ShoppingBag, AlertCircle, Lock, ArrowRight, ChevronRight, ShieldCheck, Truck, LockIcon, ArrowRightIcon, ShoppingCart, ArrowLeftIcon, CreditCardIcon, Mail, Phone, MapPin, UserIcon, CheckCircle2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import api from '@/lib/api';
import { useCheckoutProfile } from '@/hooks/useCheckoutProfile';

const PaystackPayment = dynamic(() => import('../PaystackPayment'), { ssr: false });

export function VantageCheckout({ store, subdomain }: CheckoutProps) {
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

    const activeSubdomain = subdomain || store.subdomain || params?.subdomain;

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
            setError('Payment verification failed. Please contact support.');
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
            setError('Payment gateway is not configured for this store.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
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
            setError(err.response?.data?.message || 'Failed to initialize order. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (!mounted) return null;

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Order Success!</h1>
                    <p className="text-gray-500 mb-10 font-medium text-lg leading-relaxed italic">
                        "Your bold selection is being processed. Prepare for distinction."
                    </p>
                    <Link
                        href={`/store/${activeSubdomain}`}
                        className="inline-flex items-center gap-4 py-5 px-10 bg-black text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                        Back to Shop <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-black" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Syncing Profile</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex items-center justify-between mb-20 pb-10 border-b border-gray-100">
                    <Link href={`/store/${activeSubdomain}`} className="flex items-center gap-2 group">
                        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">Return to Shop</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <ShoppingCart className="w-5 h-5" />
                        <span className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Checkout Page</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    <div className="lg:col-span-7">
                        <PaystackPayment config={config} onSuccess={onPaystackSuccess} onClose={onPaystackClose}>
                            {(initializePayment) => (
                                <form onSubmit={(e) => handleProcessOrder(e, initializePayment)} className="space-y-16">
                                    <section>
                                        <div className="flex flex-col gap-2 mb-10">
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Section 01</span>
                                            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Contact & Shipping</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full h-16 px-8 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 text-sm"
                                                    placeholder="Email Address"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full h-16 px-8 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 text-sm"
                                                    placeholder="First Name"
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full h-16 px-8 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 text-sm"
                                                    placeholder="Last Name"
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full h-16 px-8 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 text-sm"
                                                    placeholder="Complete Address"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <input
                                                    type="tel"
                                                    required
                                                    className="w-full h-16 px-8 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 text-sm"
                                                    placeholder="Phone Number"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex flex-col gap-2 mb-10">
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Section 02</span>
                                            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Secure Payment</h2>
                                        </div>
                                        <div className="p-10 border-2 border-black bg-white rounded-[2.5rem] flex items-center justify-between group">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center">
                                                    <LockIcon className="w-8 h-8 text-black" />
                                                </div>
                                                <div>
                                                    <span className="font-black text-lg uppercase tracking-tight block">Paystack Gateway</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Encrypted Secure Link</span>
                                                </div>
                                            </div>
                                            <CreditCardIcon className="w-8 h-8 text-black" />
                                        </div>
                                    </section>

                                    {error && (
                                        <div className="p-6 bg-red-50 text-red-600 rounded-2xl flex items-center gap-4">
                                            <AlertCircle className="w-6 h-6 shrink-0" />
                                            <p className="text-xs font-black uppercase tracking-widest">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-8 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-4 shadow-2xl group"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-3">
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                <span>Processing Securely...</span>
                                            </div>
                                        ) : (
                                            <>
                                                Initialize Transaction • {formatPrice(subtotal)} <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </PaystackPayment>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-gray-50 rounded-[3rem] p-10 lg:sticky lg:top-32">
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-10">Order Bag</h2>
                            <div className="space-y-8 mb-10 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-6 group">
                                        <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden shrink-0 shadow-sm">
                                            <img src={item.image || (item as any).images?.[0] || 'https://via.placeholder.com/200'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-grow flex flex-col justify-center">
                                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight leading-none mb-2">{item.name}</h3>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-bold text-gray-400">UNIT {item.quantity}</p>
                                                <p className="text-lg font-bold text-black">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-gray-200">
                                <div className="flex justify-between items-center px-4">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Bag Subtotal</span>
                                    <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-2xl font-black text-gray-900 pt-6 px-4">
                                    <span className="uppercase tracking-tighter">Grand Total</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                            </div>

                            <div className="mt-12 flex items-center gap-4 p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
                                <ShieldCheck className="w-8 h-8 text-black" />
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-900 tracking-widest leading-none mb-1">Guaranteed Safety</p>
                                    <p className="text-[10px] text-gray-400 font-medium italic">Payment secured by global standards</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
