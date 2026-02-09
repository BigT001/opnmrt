'use client';

import React, { useState, useEffect } from 'react';
import { CheckoutProps } from '../types';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Loader2, Shield, CreditCard, Truck, ShoppingBag } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

export function DefaultCheckout({ store, subdomain }: CheckoutProps) {
    const params = useParams<{ subdomain: string }>();
    const { items, totalPrice, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        setOrderNumber(Math.floor(100000 + Math.random() * 900000).toString());
        if (items.length === 0 && !isSuccess && subdomain) {
            router.push(`/store/${subdomain}`);
        }
    }, [items.length, subdomain, router, isSuccess]);

    if (!mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsSuccess(true);
        clearCart();
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg w-full bg-white rounded-3xl p-12 text-center shadow-xl border border-gray-100"
                >
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tight">Order Confirmed!</h1>
                    <p className="text-gray-500 mb-8 font-medium">
                        Your order <span className="text-gray-900 font-bold">#{orderNumber}</span> has been placed successfully.
                        We'll send you an email confirmation shortly.
                    </p>
                    <Link
                        href={`/store/${subdomain}`}
                        className="inline-block w-full py-4 bg-gray-900 text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-black transition-all shadow-lg"
                    >
                        Back to Shopping
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0) return null;

    const total = totalPrice();

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
                <div className="flex items-center justify-between mb-12">
                    <Link href={`/store/${subdomain}`} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Back to Store</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-gray-900" />
                        <span className="text-lg font-black text-gray-900 uppercase tracking-tight">Checkout</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Information Form */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="space-y-12">
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-xs font-black">1</div>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Contact Information</h2>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                                            placeholder="you@example.com"
                                        />
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
                                        <input type="text" required className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Last Name</label>
                                        <input type="text" required className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Address</label>
                                        <input type="text" required className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">City</label>
                                        <input type="text" required className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Postal Code</label>
                                        <input type="text" required className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold" />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-xs font-black">3</div>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Payment Method</h2>
                                </div>
                                <div className="p-8 border-2 border-emerald-500 bg-emerald-50/10 rounded-2xl space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-5 h-5 text-emerald-600" />
                                            <span className="font-black text-sm uppercase tracking-tight">Credit or Debit Card</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-8 h-5 bg-gray-200 rounded" />
                                            <div className="w-8 h-5 bg-gray-200 rounded" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Card Number</label>
                                            <input type="text" placeholder="0000 0000 0000 0000" required className="w-full h-14 px-5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Expiry Date</label>
                                                <input type="text" placeholder="MM / YY" required className="w-full h-14 px-5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">CVC</label>
                                                <input type="text" placeholder="123" required className="w-full h-14 px-5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-6 bg-gray-900 text-white text-sm font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Signing Transaction...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Confirm Order • {formatPrice(total)}</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-gray-50 rounded-3xl p-8 sticky top-32 border border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Order Summary</h2>
                            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-20 h-20 bg-white border border-gray-100 rounded-xl overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-sm font-bold text-gray-900 leading-tight">{item.name}</h3>
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
                                    <span className="font-bold text-gray-900">{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Shipping</span>
                                    <span className="font-emerald-600 font-bold text-[10px] uppercase">Free</span>
                                </div>
                                <div className="flex justify-between text-xl font-black text-gray-900 pt-3 border-t border-gray-200">
                                    <span className="uppercase tracking-tight">Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-3 text-gray-400">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">TLS 1.3 Secure Encryption</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-400">
                                    <Truck className="w-4 h-4" />
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
