'use client';

import { CheckoutProps } from '../../types';
import { useStoreCart } from '@/store/useStoreCart';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Loader2, ShieldCheck, Lock, CreditCard } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

export function MinimalLuxeCheckout({ store }: CheckoutProps) {
    const params = useParams<{ subdomain: string }>();
    const { storeItems: items, subtotal, clearStoreCart, toggleCart } = useStoreCart(store.id);
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        if (items.length === 0 && !isSuccess && params?.subdomain) {
            router.push(`/store/${params.subdomain}`);
        }
    }, [items.length, params?.subdomain, router, isSuccess]);

    if (!mounted) return null;

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate premium processing delay
        await new Promise(resolve => setTimeout(resolve, 2500));
        setIsSubmitting(false);
        setIsSuccess(true);
        clearStoreCart(store.id);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-10"
                >
                    <div className="relative inline-block">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 12, stiffness: 200 }}
                            className="w-24 h-24 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto"
                        >
                            <CheckCircle className="w-10 h-10" />
                        </motion.div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 rounded-full border border-gray-900/20"
                        />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Selection Confirmed</h1>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Your curation has been secured. A digital receipt and collection details have been dispatched to your email.
                        </p>
                    </div>

                    <div className="pt-6">
                        <Link
                            href={`/store/${params.subdomain}`}
                            className="inline-block w-full bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.4em] py-5 transition-all hover:bg-black active:scale-95 shadow-2xl shadow-gray-900/20"
                        >
                            Return to Selection
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen bg-[#FDFDFD] py-16 lg:py-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <header className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                    <div className="space-y-4">
                        <Link href={`/store/${params.subdomain}`} className="text-[10px] font-black text-gray-400 hover:text-gray-900 flex items-center gap-2 uppercase tracking-[0.4em] transition-colors">
                            <ArrowLeft className="w-3 h-3" />
                            Return
                        </Link>
                        <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tightest uppercase leading-none">
                            Checkout
                        </h1>
                    </div>

                    {/* Minimal Progress */}
                    <div className="flex gap-12 items-center h-fit pt-2">
                        <div className="flex flex-col gap-2">
                            <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest">Detail</span>
                            <div className="h-1 w-12 bg-gray-900"></div>
                        </div>
                        <div className="flex flex-col gap-2 opacity-20">
                            <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest">Courier</span>
                            <div className="h-px w-12 bg-gray-900"></div>
                        </div>
                        <div className="flex flex-col gap-2 opacity-20">
                            <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest">Payment</span>
                            <div className="h-px w-12 bg-gray-900"></div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
                    {/* Information Column */}
                    <div className="lg:col-span-7 space-y-16">
                        <form onSubmit={handlePayment} className="space-y-16">
                            {/* Contact Section */}
                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.4em]">Contact</span>
                                    <div className="h-px bg-gray-100 flex-1"></div>
                                </div>
                                <div className="space-y-4">
                                    <input
                                        type="email"
                                        placeholder="EMAIL ADDRESS"
                                        required
                                        className="w-full bg-transparent border-b border-gray-200 py-4 text-sm font-medium tracking-tight focus:outline-none focus:border-gray-900 transition-colors uppercase placeholder:text-gray-300"
                                    />
                                </div>
                            </section>

                            {/* Shipping Section */}
                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.4em]">Destination</span>
                                    <div className="h-px bg-gray-100 flex-1"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                                    <div className="col-span-1">
                                        <input type="text" placeholder="GIVEN NAME" required className="w-full bg-transparent border-b border-gray-200 py-4 text-sm font-medium tracking-tight focus:outline-none focus:border-gray-900 transition-colors uppercase placeholder:text-gray-300" />
                                    </div>
                                    <div className="col-span-1">
                                        <input type="text" placeholder="FAMILY NAME" required className="w-full bg-transparent border-b border-gray-200 py-4 text-sm font-medium tracking-tight focus:outline-none focus:border-gray-900 transition-colors uppercase placeholder:text-gray-300" />
                                    </div>
                                    <div className="col-span-2">
                                        <input type="text" placeholder="SHIPPING ADDRESS" required className="w-full bg-transparent border-b border-gray-200 py-4 text-sm font-medium tracking-tight focus:outline-none focus:border-gray-900 transition-colors uppercase placeholder:text-gray-300" />
                                    </div>
                                    <div className="col-span-1">
                                        <input type="text" placeholder="CITY" required className="w-full bg-transparent border-b border-gray-200 py-4 text-sm font-medium tracking-tight focus:outline-none focus:border-gray-900 transition-colors uppercase placeholder:text-gray-300" />
                                    </div>
                                    <div className="col-span-1">
                                        <input type="text" placeholder="POSTAL CODE" required className="w-full bg-transparent border-b border-gray-200 py-4 text-sm font-medium tracking-tight focus:outline-none focus:border-gray-900 transition-colors uppercase placeholder:text-gray-300" />
                                    </div>
                                </div>
                            </section>

                            {/* Secure Payment */}
                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.4em]">Payment</span>
                                    <div className="h-px bg-gray-100 flex-1"></div>
                                </div>
                                <div className="bg-gray-50/50 border border-gray-100 p-8 space-y-10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <CreditCard className="w-24 h-24" />
                                    </div>

                                    <div className="space-y-4 relative z-10">
                                        <input type="text" placeholder="CARD DATA" required className="w-full bg-transparent border-b border-gray-200 py-4 text-sm font-medium tracking-tight focus:outline-none focus:border-gray-900 transition-colors uppercase placeholder:text-gray-300" />
                                        <div className="grid grid-cols-2 gap-8">
                                            <input type="text" placeholder="VALID THRU" required className="w-full bg-transparent border-b border-gray-200 py-4 text-sm font-medium tracking-tight focus:outline-none focus:border-gray-900 transition-colors uppercase placeholder:text-gray-300" />
                                            <input type="text" placeholder="CVC" required className="w-full bg-transparent border-b border-gray-200 py-4 text-sm font-medium tracking-tight focus:outline-none focus:border-gray-900 transition-colors uppercase placeholder:text-gray-300" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest relative z-10">
                                        <Lock className="w-3 h-3" />
                                        Encrypted Transaction
                                    </div>
                                </div>
                            </section>

                            <div className="pt-8">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gray-900 text-white py-6 text-[10px] font-black uppercase tracking-[0.5em] transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-gray-900/10 flex items-center justify-center gap-4"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin h-4 w-4" />
                                            Authorizing...
                                        </>
                                    ) : (
                                        `Finalize Selection - ${formatPrice(subtotal)}`
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary Column */}
                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-12 space-y-10">
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.4em]">Curation</span>
                                    <div className="h-px bg-gray-100 flex-1"></div>
                                </div>
                                <ul className="divide-y divide-gray-100">
                                    {items.map((item) => (
                                        <li key={item.id} className="flex py-8 gap-6 group">
                                            {item.image && (
                                                <div className="h-24 w-20 flex-shrink-0 overflow-hidden bg-gray-50 border border-gray-100">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex flex-1 flex-col justify-between">
                                                <div className="space-y-1">
                                                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-tight leading-tight line-clamp-2">{item.name}</h3>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qty {item.quantity}</p>
                                                </div>
                                                <p className="text-sm font-black text-gray-900 tracking-tightest">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-gray-900">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtotal</span>
                                    <span className="text-sm font-black text-gray-900 tracking-tightest">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Courier</span>
                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Complimentary</span>
                                </div>
                                <div className="h-px bg-gray-100 w-full"></div>
                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Total</span>
                                    <span className="text-2xl font-black text-gray-900 tracking-tightest">{formatPrice(subtotal)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-6 bg-gray-50/50 border border-gray-100">
                                <ShieldCheck className="w-5 h-5 text-gray-400" />
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                                    Buyer Protection enabled for this transaction. Secure fulfillment guaranteed.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

