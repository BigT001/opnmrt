'use client';

import { CheckoutProps } from '../../types';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Loader2, Scroll, Check } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

export function VintageCharmCheckout({ }: CheckoutProps) {
    const params = useParams<{ subdomain: string }>();
    const { items, totalPrice, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        setOrderId(`ARC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
        if (items.length === 0 && !isSuccess && params?.subdomain) {
            router.push(`/store/${params.subdomain}`);
        }
    }, [items.length, params?.subdomain, router, isSuccess]);

    if (!mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2500));
        setIsSubmitting(false);
        setIsSuccess(true);
        clearCart();
    };

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

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen bg-[#F9F4EE] py-32">
            <div className="max-w-[1400px] mx-auto px-10">
                {/* Header: Sealing the Transaction */}
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
                    {/* Checkout Form: Laboratory Intake */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="space-y-12">
                            {/* Section: Correspondent Details */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl font-black text-[#1B3022] tracking-tighter uppercase italic">I. Correspondent</h2>
                                    <div className="h-[1px] flex-grow bg-[#1B3022]/10" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#1B3022]/50 font-black">Official Email</label>
                                        <input type="email" required className="w-full bg-white vintage-border p-5 font-serif italic focus:outline-none focus:border-[#8B4513] transition-colors text-lg" placeholder="archivist@heritage.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#1B3022]/50 font-black">Full Name</label>
                                        <input type="text" required className="w-full bg-white vintage-border p-5 font-serif italic focus:outline-none focus:border-[#8B4513] transition-colors text-lg" placeholder="Archival Recipient Name" />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Delivery Destination */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl font-black text-[#1B3022] tracking-tighter uppercase italic">II. Destination</h2>
                                    <div className="h-[1px] flex-grow bg-[#1B3022]/10" />
                                </div>
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#1B3022]/50 font-black">Archive Address</label>
                                        <input type="text" required className="w-full bg-white vintage-border p-5 font-serif italic focus:outline-none focus:border-[#8B4513] transition-colors text-lg" placeholder="Street, Laboratory, or Estate" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="font-mono text-[10px] uppercase tracking-widest text-[#1B3022]/50 font-black">City / District</label>
                                            <input type="text" required className="w-full bg-white vintage-border p-5 font-serif italic focus:outline-none focus:border-[#8B4513] transition-colors text-lg" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="font-mono text-[10px] uppercase tracking-widest text-[#1B3022]/50 font-black">Postal_Code</label>
                                            <input type="text" required className="w-full bg-white vintage-border p-5 font-serif italic focus:outline-none focus:border-[#8B4513] transition-colors text-lg" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Allocation Method */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl font-black text-[#1B3022] tracking-tighter uppercase italic">III. Allocation</h2>
                                    <div className="h-[1px] flex-grow bg-[#1B3022]/10" />
                                </div>
                                <div className="bg-white p-8 vintage-border space-y-8">
                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase tracking-widest text-[#1B3022]/50 font-black">Security Card Number</label>
                                        <input type="text" required className="w-full bg-[#F9F4EE]/50 vintage-border p-5 font-mono tracking-widest focus:outline-none focus:border-[#8B4513] transition-colors text-lg" placeholder="0000 0000 0000 0000" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="font-mono text-[10px] uppercase tracking-widest text-[#1B3022]/50 font-black">Expiry_Date</label>
                                            <input type="text" required className="w-full bg-[#F9F4EE]/50 vintage-border p-5 font-mono tracking-widest focus:outline-none focus:border-[#8B4513] transition-colors" placeholder="MM / YY" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="font-mono text-[10px] uppercase tracking-widest text-[#1B3022]/50 font-black">Sec_V</label>
                                            <input type="text" required className="w-full bg-[#F9F4EE]/50 vintage-border p-5 font-mono tracking-widest focus:outline-none focus:border-[#8B4513] transition-colors" placeholder="***" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#1B3022] text-[#F9F4EE] py-8 px-12 text-3xl font-black uppercase italic tracking-tighter hover:bg-[#8B4513] transition-all disabled:opacity-50 flex items-center justify-center gap-6 shadow-2xl"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin w-8 h-8" />
                                        <span>Affixing Seal...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Verify & Acquire Allocation</span>
                                        <ShieldCheck className="w-8 h-8" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary: Manifest Check */}
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
                                    <dd className="text-[#1B3022]">{formatPrice(totalPrice())}</dd>
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
                                    <dd className="text-6xl font-black italic tracking-tighter text-[#1B3022]">{formatPrice(totalPrice())}</dd>
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


