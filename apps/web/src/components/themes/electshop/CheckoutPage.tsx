'use client';

import React, { useState } from 'react';
import { CheckoutProps } from '../types';
import { useStoreCart } from '@/store/useStoreCart';
import { ShoppingCart, ShieldCheck, Truck, ArrowLeft, ChevronRight, Lock, CreditCard, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

import { useCheckoutPayment } from '@/hooks/useCheckoutPayment';

export function ElectshopCheckout({ store, subdomain }: CheckoutProps) {
    const { items: cartItems, subtotal: cartSubtotal, clearCart, directCheckoutItem, setDirectCheckoutItem, clearStoreCart } = useStoreCart(store.id);
    const { user } = useAuthStore();
    const { processCheckout, isSubmitting: loading, error: payError } = useCheckoutPayment();
    const [isSuccess, setIsSuccess] = useState(false);

    // Prioritize direct checkout item if it exists
    const items = directCheckoutItem ? [directCheckoutItem] : cartItems;
    const subtotal = directCheckoutItem ? directCheckoutItem.price * directCheckoutItem.quantity : cartSubtotal;

    const isPro = store?.plan === 'PRO' || store?.plan === 'ENTERPRISE' || store?.plan === 'ASCEND' || store?.plan === 'APEX';
    const vatRate = store?.vatEnabled && isPro ? Number(store?.vatRate || 7.5) : 0;
    const vatAmount = (subtotal * vatRate) / 100;
    const grandTotal = subtotal + vatAmount;

    const [formData, setFormData] = useState({
        email: user?.email || '',
        name: user?.name || '',
        phone: user?.phone || '',
        address: '',
        city: '',
        country: 'Nigeria',
        zipCode: ''
    });

    const primaryColor = store?.primaryColor || '#2874f0';
    const accentColor = `${primaryColor}15`;


    // Cleanup direct item when leaving checkout (unless navigating to payment)
    React.useEffect(() => {
        return () => {
            // We only clear it if we're not waiting for a redirect to payment
            // In a real app, you'd check a ref or state. 
            // For now, let's keep it until they actually buy or specifically leave.
        };
    }, []);

    const handleProcessOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await processCheckout({
                storeId: store.id,
                items,
                amount: grandTotal,
                email: formData.email,
                onSuccess: (ref) => {
                    setIsSuccess(true);
                    if (directCheckoutItem) {
                        setDirectCheckoutItem(null);
                    } else {
                        clearStoreCart(store.id);
                    }
                }
            });
        } catch (error) {
            console.error('Checkout error:', error);
        }
    };

    return (
        <section className="bg-muted min-h-screen py-12 lg:py-20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-4 mb-12">
                    <Link href={`/store/${subdomain}`} className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:shadow-md transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter italic">Checkout</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Checkout Form */}
                    <div className="lg:w-2/3 space-y-8">
                        {isSuccess ? (
                            <div className="bg-background rounded-[2rem] p-12 border border-border shadow-sm text-center">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl" style={{ backgroundColor: accentColor }}>
                                    <ShieldCheck className="w-10 h-10" style={{ color: primaryColor }} />
                                </div>
                                <h2 className="text-3xl font-black text-foreground uppercase tracking-tighter mb-4 italic">Order Confirmed</h2>
                                <p className="text-muted-foreground font-bold mb-10 text-sm tracking-widest uppercase">Thank you for your purchase. We are processing your items.</p>
                                <Link href={`/store/${subdomain}`}
                                    className="inline-block px-10 py-5 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                                    style={{ backgroundColor: primaryColor, boxShadow: `0 10px 30px ${primaryColor}40` }}>
                                    Return to Shop
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleProcessOrder} className="space-y-8">
                                <div className="bg-background rounded-[2rem] p-8 lg:p-12 border border-border shadow-sm">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                                            <Lock className="w-5 h-5" style={{ color: primaryColor }} />
                                        </div>
                                        <h3 className="text-lg font-black text-foreground uppercase tracking-widest">Customer Information</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            label="Full Name"
                                            value={formData.name}
                                            onChange={(v) => setFormData({ ...formData, name: v })}
                                            placeholder="Samuel Stanley"
                                        />
                                        <InputField
                                            label="Email Address"
                                            value={formData.email}
                                            onChange={(v) => setFormData({ ...formData, email: v })}
                                            placeholder="samuel@example.com"
                                        />
                                        <InputField
                                            label="Phone Number"
                                            value={formData.phone}
                                            onChange={(v) => setFormData({ ...formData, phone: v })}
                                            placeholder="+234..."
                                        />
                                    </div>
                                </div>

                                <div className="bg-background rounded-[2rem] p-8 lg:p-12 border border-border shadow-sm">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                                            <Truck className="w-5 h-5" style={{ color: primaryColor }} />
                                        </div>
                                        <h3 className="text-lg font-black text-foreground uppercase tracking-widest">Shipping Details</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            label="Country"
                                            value={formData.country}
                                            onChange={(v) => setFormData({ ...formData, country: v })}
                                            placeholder="Nigeria"
                                        />
                                    </div>
                                </div>

                                {payError && (
                                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest mb-4">
                                        <AlertCircle className="w-4 h-4" />
                                        {payError}
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading || items.length === 0}
                                    style={{ backgroundColor: primaryColor, boxShadow: `0 10px 40px ${primaryColor}40` }}
                                    className="w-full h-16 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-4 disabled:opacity-50 group"
                                >
                                    {loading ? 'Processing...' : (
                                        <>Initialize Secure Payment <CreditCard className="w-5 h-5 group-hover:rotate-12 transition-transform" /></>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-background rounded-[2rem] border border-border shadow-sm overflow-hidden sticky top-32">
                            <div className="p-8 border-b border-border flex items-center justify-between">
                                <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Order Summary</h3>
                                <div className="px-3 py-1 bg-muted rounded-lg text-[10px] font-black text-muted-foreground">{items.length} Items</div>
                            </div>
                            <div className="p-8 space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-muted rounded-xl border border-border p-1 shrink-0 overflow-hidden">
                                            <img src={item.image} className="w-full h-full object-cover rounded-lg" alt={item.name} />
                                        </div>
                                        <div className="flex-1 min-w-0 py-1">
                                            <h4 className="text-[11px] font-black text-foreground uppercase tracking-tight line-clamp-1">{item.name}</h4>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-[10px] font-bold text-muted-foreground">Qty: {item.quantity}</p>
                                                <p className="text-sm font-black italic" style={{ color: primaryColor }}>{formatPrice(item.price)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-8 bg-muted/30 space-y-4">
                                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                    <span>Shipping</span>
                                    <span className="text-emerald-500 italic">Free</span>
                                </div>
                                {vatRate > 0 && (
                                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                        <span>VAT ({vatRate}%)</span>
                                        <span>{formatPrice(vatAmount)}</span>
                                    </div>
                                )}
                                <div className="pt-4 border-t border-border flex justify-between items-center">
                                    <span className="text-sm font-black uppercase tracking-widest text-foreground">Total</span>
                                    <span className="text-2xl font-black italic" style={{ color: primaryColor }}>{formatPrice(grandTotal)}</span>
                                </div>
                            </div>
                            <div className="p-8 pt-0 bg-muted/30 flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-tight">Secure Payment processed <br /> through Paystack Integration</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}

function InputField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-15 px-6 bg-muted/30 border border-border rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-foreground/5 transition-all text-foreground"
            />
        </div>
    );
}
