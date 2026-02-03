'use client';

import { CheckoutProps } from '../../types';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Loader2, ShieldCheck, Lock } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function GlamourEveCheckout({ }: CheckoutProps) {
    const params = useParams<{ subdomain: string }>();
    const { items, totalPrice, clearCart } = useCartStore();
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        setIsSubmitting(false);
        setIsSuccess(true);
        clearCart();
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-lg w-full space-y-10"
                >
                    <div className="w-24 h-24 bg-black text-[#D4AF37] rounded-full flex items-center justify-center mx-auto shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                        <CheckCircle className="w-10 h-10 stroke-[1.5px]" />
                    </div>
                    <div className="space-y-4">
                        <span className="text-[#D4AF37] uppercase tracking-[0.4em] text-[10px] font-black italic">Commande Confirmée</span>
                        <h1 className="text-5xl font-serif text-black italic">Gratitude for your Curation</h1>
                        <p className="text-black/40 text-sm font-light leading-relaxed uppercase tracking-widest text-[11px] max-w-xs mx-auto">
                            Your selection is being prepared by our artisans. A confirmation has been dispatched to your digital address.
                        </p>
                    </div>
                    <Link
                        href={`/store/${params.subdomain}`}
                        className="inline-block px-12 py-5 bg-black text-white uppercase tracking-[0.3em] text-[10px] font-black hover:bg-[#D4AF37] hover:text-black transition-all"
                    >
                        Back to Atelier
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen bg-white pt-32 pb-32">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 border-b border-black/5 pb-12">
                    <div className="space-y-4">
                        <Link href={`/store/${params.subdomain}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 hover:text-black flex items-center gap-2 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Return to Boutique
                        </Link>
                        <h1 className="text-6xl font-serif text-black italic tracking-tighter">Concierge Checkout</h1>
                    </div>
                    <div className="flex items-center gap-4 text-black/30">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-[9px] uppercase tracking-[0.2em] font-black italic">Encrypted Connection</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

                    {/* Left: Forms */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="space-y-16">

                            {/* Information Sections */}
                            <section className="space-y-10">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black text-black bg-black/5 w-8 h-8 flex items-center justify-center rounded-full">01</span>
                                        <h2 className="text-[11px] font-black text-black uppercase tracking-[0.4em]">Client Details</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/40">Email Address</label>
                                            <input type="email" required className="w-full bg-transparent border-b border-black text-sm py-4 focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-black/10" placeholder="excellence@noir.com" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 pt-10">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black text-black bg-black/5 w-8 h-8 flex items-center justify-center rounded-full">02</span>
                                        <h2 className="text-[11px] font-black text-black uppercase tracking-[0.4em]">Shipping Destination</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/40">First Name</label>
                                            <input type="text" required className="w-full bg-transparent border-b border-black text-sm py-4 focus:outline-none focus:border-[#D4AF37] transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/40">Last Name</label>
                                            <input type="text" required className="w-full bg-transparent border-b border-black text-sm py-4 focus:outline-none focus:border-[#D4AF37] transition-all" />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/40">Street Address</label>
                                            <input type="text" required className="w-full bg-transparent border-b border-black text-sm py-4 focus:outline-none focus:border-[#D4AF37] transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/40">City</label>
                                            <input type="text" required className="w-full bg-transparent border-b border-black text-sm py-4 focus:outline-none focus:border-[#D4AF37] transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/40">Postal Code</label>
                                            <input type="text" required className="w-full bg-transparent border-b border-black text-sm py-4 focus:outline-none focus:border-[#D4AF37] transition-all" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 pt-10">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black text-black bg-black/5 w-8 h-8 flex items-center justify-center rounded-full">03</span>
                                        <h2 className="text-[11px] font-black text-black uppercase tracking-[0.4em]">Vault Payment</h2>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/40">Card Details</label>
                                            <div className="relative">
                                                <input type="text" placeholder="#### #### #### ####" required className="w-full bg-transparent border-b border-black text-sm py-4 focus:outline-none focus:border-[#D4AF37] transition-all" />
                                                <Lock className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/40">Expiry</label>
                                                <input type="text" placeholder="MM / YY" required className="w-full bg-transparent border-b border-black text-sm py-4 focus:outline-none focus:border-[#D4AF37] transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/40">CVC</label>
                                                <input type="text" placeholder="###" required className="w-full bg-transparent border-b border-black text-sm py-4 focus:outline-none focus:border-[#D4AF37] transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative w-full h-24 overflow-hidden bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.2)] transition-all flex items-center justify-center overflow-hidden"
                            >
                                <AnimatePresence mode="wait">
                                    {isSubmitting ? (
                                        <motion.div
                                            key="submitting"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -20, opacity: 0 }}
                                            className="flex items-center gap-4"
                                        >
                                            <Loader2 className="animate-spin w-5 h-5 text-[#D4AF37]" />
                                            <span className="uppercase tracking-[0.4em] text-[11px] font-black">Authorizing...</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="pay"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center justify-center gap-6 group-hover:bg-[#D4AF37] group-hover:text-black absolute inset-0 transition-colors duration-500"
                                        >
                                            <span className="uppercase tracking-[0.4em] text-[11px] font-black">Verify Purchase</span>
                                            <span className="w-2 h-2 rounded-full bg-[#D4AF37] group-hover:bg-black transition-colors" />
                                            <span className="text-sm font-bold itali">{formatPrice(totalPrice())}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        </form>
                    </div>

                    {/* Right: Summary */}
                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-32 space-y-12">
                            <div className="space-y-6">
                                <h2 className="text-[11px] font-black text-black uppercase tracking-[0.4em] border-b border-black/5 pb-6">Your Curation</h2>
                                <ul className="space-y-8">
                                    {items.map((item) => (
                                        <li key={item.id} className="flex gap-6 group">
                                            {item.image && (
                                                <div className="h-24 w-20 flex-shrink-0 bg-gray-50 border border-black/5 overflow-hidden">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 space-y-2 py-1">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-sm font-serif italic text-black leading-tight underline decoration-black/10 underline-offset-4">{item.name}</h3>
                                                    <p className="font-bold text-black text-sm tracking-tighter">{formatPrice(item.price * item.quantity)}</p>
                                                </div>
                                                <p className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-black">Quantity: {item.quantity}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-10 bg-black/5 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(totalPrice())}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                                        <span>Est. Boutique Delivery</span>
                                        <span className="text-[#D4AF37]">Complimentary</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-serif italic text-black pt-6 border-t border-black/5">
                                        <span>Final Total</span>
                                        <span className="font-bold not-italic tracking-tighter">{formatPrice(totalPrice())}</span>
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <p className="text-[9px] text-center text-black/30 uppercase tracking-[0.2em] leading-loose">
                                        All transactions are final upon artisan commencement. <br />
                                        Certified authentic Noir curation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


