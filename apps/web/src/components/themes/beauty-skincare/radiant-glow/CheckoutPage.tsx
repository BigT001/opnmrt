'use client';

import { CheckoutProps } from '../../types';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, ShieldCheck, Loader2, Check, ArrowRight, Star, ShoppingBag } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function RadiantGlowCheckout({ }: CheckoutProps) {
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
        await new Promise(resolve => setTimeout(resolve, 2500));
        setIsSubmitting(false);
        setIsSuccess(true);
        clearCart();
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#FFF9F0] flex flex-col items-center justify-center p-8 overflow-hidden relative">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C19A6B]/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#E2AFA2]/10 rounded-full blur-[100px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 bg-white/40 backdrop-blur-3xl p-16 rounded-[60px] border border-[#C19A6B]/10 text-center max-w-xl w-full shadow-[0_40px_100px_rgba(193,154,107,0.1)]"
                >
                    <div className="w-24 h-24 bg-[#2D1E1E] text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <Check className="w-10 h-10" />
                        </motion.div>
                    </div>

                    <div className="space-y-4 mb-12">
                        <div className="flex items-center justify-center gap-2 text-[#C19A6B]">
                            <Sparkles className="w-4 h-4 fill-current" />
                            <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-black text-[#C19A6B]">Ritual Confirmed</span>
                        </div>
                        <h1 className="text-5xl font-luminous text-[#2D1E1E]">Your light is <span className="italic">traveling.</span></h1>
                        <p className="font-sans text-sm text-[#2D1E1E]/60 leading-relaxed max-w-xs mx-auto">
                            The essence of your selection has been captured. A confirmation of your aura has been sent via digital post.
                        </p>
                    </div>

                    <Link
                        href={`/store/${params.subdomain}`}
                        className="group relative inline-flex w-full h-16 items-center justify-center bg-[#2D1E1E] text-white rounded-full overflow-hidden transition-all duration-700"
                    >
                        <div className="absolute inset-0 bg-[#C19A6B] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1]" />
                        <span className="relative z-10 font-sans text-[9px] uppercase tracking-[0.4em] font-black">Return to Collection</span>
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen bg-[#FFF9F0] py-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#C19A6B]/5 via-transparent to-transparent pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-10 relative z-10">
                <header className="flex flex-col items-center gap-8 mb-20 text-center">
                    <Link
                        href={`/store/${params.subdomain}`}
                        className="group flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.3em] font-black text-[#2D1E1E]/40 hover:text-[#C19A6B] transition-all"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Return to Rituals
                    </Link>

                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3 text-[#C19A6B]">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="font-sans text-[8px] uppercase tracking-[0.5em] font-black">Secure Lightbox</span>
                            <Star className="w-3 h-3 fill-current" />
                        </div>
                        <h1 className="text-6xl font-luminous text-[#2D1E1E]">Checkout <span className="italic">Gateway</span></h1>
                    </div>
                </header>

                <div className="lg:grid lg:grid-cols-12 lg:gap-16">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-12 xl:col-span-8 space-y-12">
                        <form onSubmit={handleSubmit} className="space-y-12">
                            {/* Personal Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/40 backdrop-blur-xl p-12 rounded-[50px] border border-[#C19A6B]/10 space-y-10 shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full border border-[#C19A6B]/20 flex items-center justify-center font-sans text-[10px] font-black text-[#C19A6B]">01</div>
                                    <h2 className="text-3xl font-luminous text-[#2D1E1E]">Personal Information</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="font-sans text-[10px] uppercase tracking-widest text-[#2D1E1E]/40 font-black pl-2">Email Identity</label>
                                        <input required type="email" placeholder="aura@example.com" className="w-full h-16 bg-white border border-[#C19A6B]/10 rounded-3xl px-8 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C19A6B]/20 transition-all shadow-sm" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="font-sans text-[10px] uppercase tracking-widest text-[#2D1E1E]/40 font-black pl-2">Full Name</label>
                                        <input required type="text" placeholder="Luminous Soul" className="w-full h-16 bg-white border border-[#C19A6B]/10 rounded-3xl px-8 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C19A6B]/20 transition-all shadow-sm" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Shipping Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/40 backdrop-blur-xl p-12 rounded-[50px] border border-[#C19A6B]/10 space-y-10 shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full border border-[#C19A6B]/20 flex items-center justify-center font-sans text-[10px] font-black text-[#C19A6B]">02</div>
                                    <h2 className="text-3xl font-luminous text-[#2D1E1E]">Destination of Delivery</h2>
                                </div>

                                <div className="space-y-10">
                                    <div className="space-y-3">
                                        <label className="font-sans text-[10px] uppercase tracking-widest text-[#2D1E1E]/40 font-black pl-2">Street Residence</label>
                                        <input required type="text" placeholder="123 Radiant Blvd" className="w-full h-16 bg-white border border-[#C19A6B]/10 rounded-3xl px-8 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C19A6B]/20 transition-all shadow-sm" />
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                                        <div className="space-y-3 md:col-span-2">
                                            <label className="font-sans text-[10px] uppercase tracking-widest text-[#2D1E1E]/40 font-black pl-2">City Oasis</label>
                                            <input required type="text" placeholder="Glow City" className="w-full h-16 bg-white border border-[#C19A6B]/10 rounded-3xl px-8 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C19A6B]/20 transition-all shadow-sm" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="font-sans text-[10px] uppercase tracking-widest text-[#2D1E1E]/40 font-black pl-2">Postal Code</label>
                                            <input required type="text" placeholder="10001" className="w-full h-16 bg-white border border-[#C19A6B]/10 rounded-3xl px-8 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C19A6B]/20 transition-all shadow-sm" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Payment */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-[#2D1E1E] p-12 rounded-[50px] space-y-10 shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C19A6B]/20 rounded-full blur-[80px] pointer-events-none" />

                                <div className="relative z-10 flex items-center gap-4 text-white">
                                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center font-sans text-[10px] font-black">03</div>
                                    <h2 className="text-3xl font-luminous italic">Exchange of Energy</h2>
                                </div>

                                <div className="relative z-10 space-y-10">
                                    <div className="space-y-3">
                                        <label className="font-sans text-[10px] uppercase tracking-widest text-white/40 font-black pl-2">Card Signature</label>
                                        <input required type="text" placeholder="0000 0000 0000 0000" className="w-full h-16 bg-white/10 border border-white/20 rounded-3xl px-8 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#C19A6B]/40 transition-all" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="font-sans text-[10px] uppercase tracking-widest text-white/40 font-black pl-2">Expiration</label>
                                            <input required type="text" placeholder="MM / YY" className="w-full h-16 bg-white/10 border border-white/20 rounded-3xl px-8 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#C19A6B]/40 transition-all" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="font-sans text-[10px] uppercase tracking-widest text-white/40 font-black pl-2">Security Code</label>
                                            <input required type="text" placeholder="123" className="w-full h-16 bg-white/10 border border-white/20 rounded-3xl px-8 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#C19A6B]/40 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative w-full h-24 bg-[#C19A6B] text-white rounded-[45px] overflow-hidden flex items-center justify-center gap-6 shadow-[0_20px_50px_rgba(193,154,107,0.3)] transition-all duration-700 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin w-6 h-6" />
                                        <span className="font-sans text-[11px] uppercase tracking-[0.5em] font-black">Transferring Aura...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="font-sans text-[11px] uppercase tracking-[0.5em] font-black">Authorize {formatPrice(totalPrice())}</span>
                                        <ArrowRight className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-2" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Floating Summary */}
                    <div className="lg:hidden xl:block xl:col-span-4 mt-16 xl:mt-0">
                        <div className="sticky top-32 space-y-10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white/60 backdrop-blur-3xl p-10 rounded-[50px] border border-[#C19A6B]/20 shadow-xl"
                            >
                                <h2 className="text-2xl font-luminous text-[#2D1E1E] mb-10 pb-6 border-b border-[#C19A6B]/10 flex items-center gap-3">
                                    <ShoppingBag className="w-5 h-5 text-[#C19A6B]" />
                                    Aura Summary
                                </h2>

                                <ul className="space-y-8 max-h-[40vh] overflow-y-auto pr-4 scrollbar-hide">
                                    {items.map((item) => (
                                        <li key={item.id} className="flex gap-6 items-center">
                                            {item.image && (
                                                <div className="h-20 w-16 bg-white rounded-2xl overflow-hidden shadow-sm border border-[#C19A6B]/5">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover grayscale-[0.3]"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 space-y-1">
                                                <h3 className="font-sans text-[11px] font-bold text-[#2D1E1E] line-clamp-1">{item.name}</h3>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-[#2D1E1E]/40 uppercase tracking-widest font-black">Qty {item.quantity}</span>
                                                    <span className="text-xs font-bold text-[#C19A6B]">{formatPrice(item.price * item.quantity)}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-10 pt-10 border-t border-[#C19A6B]/20 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-black text-[#2D1E1E]/40">Accumulated</span>
                                        <span className="font-sans text-sm font-black text-[#2D1E1E]">{formatPrice(totalPrice())}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-black text-[#2D1E1E]/40">Passage</span>
                                        <span className="font-sans text-[10px] font-black text-[#C19A6B]">Complimentary</span>
                                    </div>
                                    <div className="pt-6 border-t border-[#C19A6B]/5 flex justify-between items-end">
                                        <span className="text-2xl font-luminous text-[#2D1E1E]">Total Energy</span>
                                        <span className="text-3xl font-sans font-black text-[#C19A6B]">{formatPrice(totalPrice())}</span>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="flex flex-col items-center gap-4 px-10">
                                <ShieldCheck className="w-8 h-8 text-[#C19A6B] opacity-40" />
                                <p className="text-center font-sans text-[8px] uppercase tracking-widest text-[#2D1E1E]/40 leading-relaxed font-black">
                                    Encrypted by Luminous Protocol.<br />Your data reflects in private auras.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


