'use client';

import React, { useState } from 'react';
import { CheckoutProps } from '../types';
import { useStoreCart } from '@/store/useStoreCart';
import { ShoppingCart, ShieldCheck, Truck, ArrowLeft, ChevronRight, Lock, CreditCard } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export function ElectshopCheckout({ store, subdomain }: CheckoutProps) {
    const { items: cartItems, subtotal: cartSubtotal, clearCart, directCheckoutItem, setDirectCheckoutItem } = useStoreCart(store.id);
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);

    // Prioritize direct checkout item if it exists
    const items = directCheckoutItem ? [directCheckoutItem] : cartItems;
    const subtotal = directCheckoutItem ? directCheckoutItem.price * directCheckoutItem.quantity : cartSubtotal;
    const [formData, setFormData] = useState({
        email: user?.email || '',
        name: user?.name || '',
        phone: user?.phone || '',
        address: '',
        city: '',
        country: 'Nigeria',
        zipCode: ''
    });

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
        setLoading(true);
        try {
            const orderRes = await api.post('/orders', {
                storeId: store.id,
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                total: subtotal,
                customerInfo: formData
            });

            const paymentRes = await api.post('/payments/initialize', {
                orderId: orderRes.data.id,
                amount: subtotal,
                email: formData.email
            });


            if (directCheckoutItem) {
                setDirectCheckoutItem(null);
            }
            window.location.href = paymentRes.data.authorization_url;
        } catch (error) {
            console.error(error);
            toast.error('Failed to initialize order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-[#f8f9fa] min-h-screen py-12 lg:py-20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-4 mb-12">
                    <Link href={`/store/${subdomain}`} className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:shadow-md transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Checkout</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Checkout Form */}
                    <div className="lg:w-2/3 space-y-8">
                        {/* Summary for Mobile */}
                        <div className="lg:hidden bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm mb-8">
                            <div className="flex items-center justify-between mb-4 text-left">
                                <span className="text-sm font-black uppercase tracking-widest text-gray-400">Total Due</span>
                                <span className="text-2xl font-black text-brand italic">{formatPrice(subtotal)}</span>
                            </div>
                        </div>

                        <form onSubmit={handleProcessOrder} className="space-y-8">
                            <div className="bg-white rounded-[2rem] p-8 lg:p-12 border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                                        <Lock className="w-5 h-5 text-brand" />
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Customer Information</h3>
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

                            <div className="bg-white rounded-[2rem] p-8 lg:p-12 border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                                        <Truck className="w-5 h-5 text-brand" />
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Shipping Details</h3>
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

                            <button
                                type="submit"
                                disabled={loading || items.length === 0}
                                className="w-full h-16 bg-[#2874f0] text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-[#2874f0]/30 hover:bg-[#1a5fbb] transition-all flex items-center justify-center gap-4 disabled:opacity-50 group"
                            >
                                {loading ? 'Processing...' : (
                                    <>Initialize Secure Payment <CreditCard className="w-5 h-5 group-hover:rotate-12 transition-transform" /></>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden sticky top-32">
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Order Summary</h3>
                                <div className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black text-gray-400">{items.length} Items</div>
                            </div>
                            <div className="p-8 space-y-6 max-h-[400px] overflow-y-auto">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-[#f8f9fa] rounded-xl border border-gray-100 p-1 shrink-0">
                                            <img src={item.image} className="w-full h-full object-contain mix-blend-multiply" alt={item.name} />
                                        </div>
                                        <div className="flex-1 min-w-0 py-1">
                                            <h4 className="text-[11px] font-black text-gray-800 uppercase tracking-tight line-clamp-1">{item.name}</h4>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-[10px] font-bold text-gray-400">Qty: {item.quantity}</p>
                                                <p className="text-sm font-black text-[#2874f0] italic">{formatPrice(item.price)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-8 bg-gray-50 space-y-4">
                                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-emerald-500 italic">Free</span>
                                </div>
                                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                    <span className="text-lg font-black text-black italic uppercase tracking-tighter">Total</span>
                                    <span className="text-2xl font-black text-[#2874f0] italic">{formatPrice(subtotal)}</span>
                                </div>
                            </div>
                            <div className="p-8 pt-0 bg-gray-50 flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">Secure Payment processed <br /> through Paystack Integration</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function InputField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-14 px-6 bg-[#f8f9fa] border border-gray-100 rounded-xl text-xs font-bold font-mono outline-none focus:border-[#2874f0] focus:ring-4 focus:ring-[#2874f0]/5 transition-all"
            />
        </div>
    );
}
