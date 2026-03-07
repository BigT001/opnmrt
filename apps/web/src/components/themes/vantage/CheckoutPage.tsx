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

import { useCheckoutPayment } from '@/hooks/useCheckoutPayment';

// const BackendPaystack = dynamic(() => import('../PaystackPayment'), { ssr: false });

export function VantageCheckout({ store, subdomain }: CheckoutProps) {
    const params = useParams<{ subdomain: string }>();
    const { storeItems: items, subtotal, clearStoreCart } = useStoreCart(store.id);
    const [mounted, setMounted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();
    const { processCheckout, isSubmitting: payLoading, error: payError } = useCheckoutPayment();

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

    const isPro = store?.plan === 'PRO' || store?.plan === 'ENTERPRISE' || store?.plan === 'ASCEND' || store?.plan === 'APEX';
    const vatRate = store?.vatEnabled && isPro ? Number(store?.vatRate || 7.5) : 0;
    const vatAmount = (subtotal * vatRate) / 100;
    const grandTotal = subtotal + vatAmount;

    useEffect(() => {
        setMounted(true);
        if (items.length === 0 && !isSuccess && params?.subdomain) {
            router.push(`/store/${params.subdomain}`);
        }
    }, [items.length, params?.subdomain, router, isSuccess]);

    const primaryColor = store?.primaryColor || '#000000';
    const accentColor = `${primaryColor}15`; // 15 is ~8% opacity in hex

    const handleProcessOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await syncProfile();
            await processCheckout({
                storeId: store.id,
                items,
                amount: grandTotal,
                email: formData.email,
                onSuccess: (ref) => {
                    setIsSuccess(true);
                    clearStoreCart(store.id);
                },
                onCancel: () => {
                    // Handled internally, but can be customized
                }
            });
        } catch (err: any) {
            console.error('Checkout error:', err);
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
        <section className="bg-background min-h-screen py-16 md:py-32">
            <div className="max-w-7xl mx-auto px-6 sm:px-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-6">
                        <Link href={`/store/${activeSubdomain}`} className="w-16 h-16 rounded-[2rem] bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:scale-110 active:scale-95 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none group">
                            <ArrowLeftIcon className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">Return to Avenue</p>
                            <h1 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter italic">Checkout</h1>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-20">
                    <div className="lg:w-2/3 space-y-10">
                        {/* Summary for Mobile */}
                        <div className="lg:hidden bg-background rounded-[2.5rem] p-8 border border-border shadow-sm mb-8">
                            <div className="flex items-center justify-between mb-4 text-left">
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Total Due</span>
                                <span className="text-3xl font-black text-foreground italic">{formatPrice(grandTotal)}</span>
                            </div>
                        </div>

                        <form onSubmit={handleProcessOrder} className="space-y-12">
                            <div className="bg-background rounded-[3rem] p-10 lg:p-16 border border-border shadow-2xl shadow-slate-200/50 dark:shadow-none">
                                <div className="flex items-center gap-6 mb-12">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: accentColor }}>
                                        <UserIcon className="w-7 h-7" style={{ color: primaryColor }} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-foreground uppercase tracking-tighter italic">Customer Profile</h3>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Personal Details</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <InputField
                                        label="First Name"
                                        value={formData.firstName}
                                        onChange={(v) => setFormData({ ...formData, firstName: v })}
                                        placeholder="Samuel"
                                    />
                                    <InputField
                                        label="Last Name"
                                        value={formData.lastName}
                                        onChange={(v) => setFormData({ ...formData, lastName: v })}
                                        placeholder="Stanley"
                                    />
                                    <div className="md:col-span-2">
                                        <InputField
                                            label="Email Address"
                                            value={formData.email}
                                            onChange={(v) => setFormData({ ...formData, email: v })}
                                            placeholder="samuel@example.com"
                                            type="email"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <InputField
                                            label="Phone Number"
                                            value={formData.phone}
                                            onChange={(v) => setFormData({ ...formData, phone: v })}
                                            placeholder="+234..."
                                            type="tel"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-background rounded-[3rem] p-10 lg:p-16 border border-border shadow-2xl shadow-slate-200/50 dark:shadow-none">
                                <div className="flex items-center gap-6 mb-12">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: accentColor }}>
                                        <MapPin className="w-7 h-7" style={{ color: primaryColor }} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-foreground uppercase tracking-tighter italic">Shipping Destination</h3>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Delivery Logistics</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2">
                                        <InputField
                                            label="Shipping Address"
                                            value={formData.address}
                                            onChange={(v) => setFormData({ ...formData, address: v })}
                                            placeholder="Street address..."
                                        />
                                    </div>
                                    <InputField
                                        label="City"
                                        value={formData.city}
                                        onChange={(v) => setFormData({ ...formData, city: v })}
                                        placeholder="Enter city..."
                                    />
                                    <InputField
                                        label="Postal Code"
                                        value={formData.postalCode}
                                        onChange={(v) => setFormData({ ...formData, postalCode: v })}
                                        placeholder="100001"
                                    />
                                </div>
                            </div>

                            {payError && (
                                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center gap-4 text-red-500">
                                    <AlertCircle className="w-6 h-6 flex-shrink-0" />
                                    <p className="text-xs font-black uppercase tracking-widest">{payError}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={payLoading || items.length === 0}
                                style={{ backgroundColor: payLoading ? '#444' : primaryColor }}
                                className="w-full h-24 text-white rounded-full font-black uppercase tracking-[0.3em] text-sm shadow-2xl transition-all flex items-center justify-center gap-6 group hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                            >
                                {payLoading ? (
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                ) : (
                                    <>Finalize & Pay • {formatPrice(grandTotal)} <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-2 transition-transform" /></>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="lg:w-1/3">
                        <div className="bg-background rounded-[3rem] border border-border shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden sticky top-32">
                            <div className="p-10 border-b border-border flex items-center justify-between bg-muted/30">
                                <h3 className="text-xs font-black text-foreground uppercase tracking-[0.2em]">Bag Summary</h3>
                                <div className="px-5 py-2 bg-foreground text-background rounded-full text-[10px] font-black">{items.length} Elements</div>
                            </div>
                            <div className="p-10 space-y-8 max-h-[440px] overflow-y-auto custom-scrollbar">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-6 group">
                                        <div className="w-24 h-24 bg-muted rounded-[2rem] border border-border p-2 shrink-0 overflow-hidden relative">
                                            <img src={item.image || (item as any).images?.[0] || 'https://via.placeholder.com/200'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                                            <div className="absolute top-2 right-2 bg-foreground text-background w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black">{item.quantity}</div>
                                        </div>
                                        <div className="flex-1 min-w-0 py-2">
                                            <h4 className="text-[12px] font-black text-foreground uppercase tracking-tighter leading-tight line-clamp-2 italic mb-3">{item.name}</h4>
                                            <p className="text-lg font-black text-foreground">{formatPrice(item.price)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-10 bg-muted/10 space-y-6">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    <span>Sub-Selection</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                {vatRate > 0 && (
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        <span>VAT ({vatRate}%)</span>
                                        <span>{formatPrice(vatAmount)}</span>
                                    </div>
                                )}
                                <div className="pt-8 border-t border-border flex justify-between items-center">
                                    <span className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Grand Total</span>
                                    <span className="text-3xl font-black text-foreground italic">{formatPrice(grandTotal)}</span>
                                </div>
                            </div>
                            <div className="p-10 pt-0 bg-muted/10 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                                    <ShieldCheck className="w-6 h-6" style={{ color: primaryColor }} />
                                </div>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">Identity Protection <br /> <span className="text-foreground">Secured via Paystack</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function InputField({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string | undefined; onChange: (v: string) => void; placeholder?: string; type?: string }) {
    return (
        <div className="space-y-4">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1">{label}</label>
            <input
                type={type}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-18 px-8 bg-muted/30 border border-border rounded-2xl text-xs font-bold font-mono outline-none focus:ring-4 focus:ring-foreground/5 transition-all text-foreground placeholder:opacity-30"
            />
        </div>
    );
}
