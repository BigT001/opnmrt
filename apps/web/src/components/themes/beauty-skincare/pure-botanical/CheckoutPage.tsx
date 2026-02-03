'use client';

import { CheckoutProps } from '../../types';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Leaf, ShieldCheck, Loader2, Sparkles, Check, MoveRight } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function PureBotanicalCheckout({ }: CheckoutProps) {
    const params = useParams<{ subdomain: string }>();
    const { items, totalPrice, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        setOrderId(`BOT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
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
            <div className="min-h-screen bg-[#F9FAF8] flex flex-col items-center justify-center p-10 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-5 pointer-events-none">
                    <Leaf className="w-full h-full fill-[#7C9082] rotate-45" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-16 rounded-[48px] shadow-2xl shadow-[#7C9082]/10 text-center max-w-2xl w-full space-y-10 relative z-10"
                >
                    <div className="w-24 h-24 bg-[#7C9082]/10 text-[#7C9082] rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-12 h-12" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3 text-[#7C9082]">
                            <Sparkles className="w-4 h-4" />
                            <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold">Ritual Confirmed</span>
                        </div>
                        <h1 className="text-5xl font-serif text-[#1C2B21] tracking-tight">Your botanicals are <span className="italic">preparing</span>.</h1>
                    </div>

                    <p className="font-serif text-xl text-[#1C2B21]/60 leading-relaxed max-w-md mx-auto">
                        We have successfully gathered your selection. A confirmation of this ritual has been whispered to your inbox.
                    </p>

                    <div className="pt-10 border-t border-[#7C9082]/10 flex flex-col items-center gap-6">
                        <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-black text-[#1C2B21]/30">Allocation ID: {orderId}</span>
                        <Link
                            href={`/store/${params.subdomain}`}
                            className="group relative flex items-center gap-6 px-12 py-5 bg-[#1C2B21] text-white rounded-full overflow-hidden transition-all duration-500 hover:pr-10"
                        >
                            <span className="font-sans text-xs font-bold uppercase tracking-[0.3em] relative z-10">Return to Sanctuary</span>
                            <div className="relative z-10 p-1 rounded-full bg-white/10">
                                <MoveRight className="w-4 h-4" />
                            </div>
                            <div className="absolute inset-0 bg-[#7C9082] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1]" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen bg-[#F9FAF8] py-32">
            <div className="max-w-[1400px] mx-auto px-10">

                {/* Header: Focused Navigation */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
                    <Link href={`/store/${params.subdomain}`} className="group flex items-center gap-4 text-[#1C2B21]/40 hover:text-[#1C2B21] transition-colors">
                        <div className="w-10 h-10 rounded-full border border-[#7C9082]/20 flex items-center justify-center group-hover:bg-white transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold">Back to sanctuary</span>
                    </Link>

                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-4xl font-serif text-[#1C2B21]">Checkout Ritual</h2>
                        <div className="flex items-center gap-3 text-[#7C9082]">
                            <Leaf className="w-3 h-3" />
                            <span className="font-sans text-[9px] uppercase tracking-[0.4em] font-bold">Encrypted & Organic</span>
                        </div>
                    </div>

                    <div className="hidden md:block w-32" />
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-24 items-start">

                    {/* Information Form: Clean & Therapeutic */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="space-y-12">

                            {/* Section: Identity */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 text-[#7C9082]/60">
                                    <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold">01. Identity</span>
                                    <div className="h-[1px] flex-1 bg-[#7C9082]/10" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="font-sans text-[10px] uppercase tracking-widest text-[#1C2B21]/40 ml-4 font-black">First Name</label>
                                        <input required className="w-full bg-white border border-[#7C9082]/10 rounded-[24px] px-8 py-4 focus:ring-2 focus:ring-[#7C9082]/20 focus:border-[#7C9082] transition-all outline-none font-serif text-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-sans text-[10px] uppercase tracking-widest text-[#1C2B21]/40 ml-4 font-black">Last Name</label>
                                        <input required className="w-full bg-white border border-[#7C9082]/10 rounded-[24px] px-8 py-4 focus:ring-2 focus:ring-[#7C9082]/20 focus:border-[#7C9082] transition-all outline-none font-serif text-lg" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="font-sans text-[10px] uppercase tracking-widest text-[#1C2B21]/40 ml-4 font-black">Electronic Mail</label>
                                        <input type="email" required className="w-full bg-white border border-[#7C9082]/10 rounded-[24px] px-8 py-4 focus:ring-2 focus:ring-[#7C9082]/20 focus:border-[#7C9082] transition-all outline-none font-serif text-lg" />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Sourcing (Delivery) */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 text-[#7C9082]/60">
                                    <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold">02. Sourcing</span>
                                    <div className="h-[1px] flex-1 bg-[#7C9082]/10" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="font-sans text-[10px] uppercase tracking-widest text-[#1C2B21]/40 ml-4 font-black">Sanctuary Address</label>
                                        <input required className="w-full bg-white border border-[#7C9082]/10 rounded-[24px] px-8 py-4 focus:ring-2 focus:ring-[#7C9082]/20 focus:border-[#7C9082] transition-all outline-none font-serif text-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-sans text-[10px] uppercase tracking-widest text-[#1C2B21]/40 ml-4 font-black">City</label>
                                        <input required className="w-full bg-white border border-[#7C9082]/10 rounded-[24px] px-8 py-4 focus:ring-2 focus:ring-[#7C9082]/20 focus:border-[#7C9082] transition-all outline-none font-serif text-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-sans text-[10px] uppercase tracking-widest text-[#1C2B21]/40 ml-4 font-black">Postal Code</label>
                                        <input required className="w-full bg-white border border-[#7C9082]/10 rounded-[24px] px-8 py-4 focus:ring-2 focus:ring-[#7C9082]/20 focus:border-[#7C9082] transition-all outline-none font-serif text-lg" />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full group relative h-24 bg-[#1C2B21] text-white rounded-[32px] overflow-hidden shadow-2xl shadow-[#1C2B21]/20 transition-all duration-700 disabled:opacity-50"
                            >
                                <div className="relative z-10 flex items-center justify-center gap-6">
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin w-6 h-6" />
                                            <span className="font-sans text-sm font-bold uppercase tracking-[0.4em]">Submitting Ritual...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-sans text-sm font-bold uppercase tracking-[0.4em]">Finalize Resonance ({formatPrice(totalPrice())})</span>
                                            <ShieldCheck className="w-6 h-6" />
                                        </>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-[#7C9082] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1]" />
                            </button>
                        </form>
                    </div>

                    {/* Order Summary: Minimalist Review */}
                    <div className="lg:col-span-5 space-y-12">
                        <div className="bg-white p-12 rounded-[48px] border border-[#7C9082]/10 space-y-10 lg:sticky lg:top-32 shadow-sm">
                            <h3 className="font-serif text-2xl text-[#1C2B21]">Selection Review</h3>

                            <ul className="space-y-8 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                {items.map((item) => (
                                    <li key={item.id} className="flex gap-6 group">
                                        <div className="w-20 h-24 bg-[#F2EBE9] rounded-2xl overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" />
                                        </div>
                                        <div className="flex-1 space-y-1 justify-center flex flex-col">
                                            <h4 className="font-serif text-lg text-[#1C2B21] line-clamp-1">{item.name}</h4>
                                            <div className="flex items-center justify-between">
                                                <span className="font-sans text-[10px] uppercase tracking-widest text-[#1C2B21]/30">Qty {item.quantity}</span>
                                                <span className="font-sans text-sm font-bold text-[#1C2B21]">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <dl className="space-y-4 pt-10 border-t border-[#7C9082]/10">
                                <div className="flex justify-between items-center">
                                    <dt className="font-sans text-[10px] uppercase tracking-[0.3em] font-black text-[#1C2B21]/40">Subtotal</dt>
                                    <dd className="font-sans text-sm font-bold text-[#1C2B21]">{formatPrice(totalPrice())}</dd>
                                </div>
                                <div className="flex justify-between items-center">
                                    <dt className="font-sans text-[10px] uppercase tracking-[0.3em] font-black text-[#1C2B21]/40">Shipping</dt>
                                    <dd className="font-serif italic text-[#7C9082]">Complimentary</dd>
                                </div>
                                <div className="flex justify-between items-end pt-6 border-t border-[#7C9082]/10 mt-6">
                                    <dt className="text-3xl font-serif text-[#1C2B21]">Total</dt>
                                    <dd className="text-3xl font-serif text-[#1C2B21]">{formatPrice(totalPrice())}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


