'use client';

import { CheckoutProps } from '../../types';
import { useStoreCart } from '@/store/useStoreCart';
import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { useCheckoutProfile } from '@/hooks/useCheckoutProfile';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Loader2, ShieldCheck, Lock, AlertCircle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const PaystackPayment = dynamic(() => import('../../PaystackPayment'), { ssr: false });

export function GlamourEveCheckout({ store }: CheckoutProps) {
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

    useEffect(() => {
        setMounted(true);
        if (items.length === 0 && !isSuccess && params?.subdomain) {
            router.push(`/store/${params.subdomain}`);
        }
    }, [items.length, params?.subdomain, router, isSuccess]);

    const config = {
        reference: (new Date()).getTime().toString(),
        email: formData.email,
        amount: Math.round(subtotal * 100), // Paystack amount is in kobo
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

    const onPaystackClose = async () => {
        setIsSubmitting(false);

        // Track abandonment for analytics
        if (activeOrderId.current) {
            try {
                await api.patch(`/orders/${activeOrderId.current}/abandon`, {
                    reason: 'payment_modal_closed'
                });
                console.log('📊 Abandonment tracked');
            } catch (err) {
                console.error('Failed to track abandonment:', err);
            }
        }
    };

    if (!mounted) return null;

    const handleProcessOrder = async (e: React.FormEvent, initializePayment: () => void) => {
        e.preventDefault();

        if (!store.paystackPublicKey) {
            setError('This store has not configured payments yet.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Centralized profile sync
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
            console.error('Checkout error:', err);

            // Parse error to provide user-friendly messages
            let errorMessage = 'Failed to process your order. Please try again.';
            let errorTitle = 'Checkout Error';

            if (err.response?.status === 409) {
                // Conflict error - likely phone or email already in use
                const serverMessage = err.response?.data?.message || '';

                if (serverMessage.includes('phone')) {
                    errorTitle = 'Phone Number Already Registered';
                    errorMessage = `The phone number "${formData.phone}" is already associated with another account. Please either:\n\n• Log in to your existing account\n• Use a different phone number\n• Contact support if you believe this is an error`;
                } else if (serverMessage.includes('email')) {
                    errorTitle = 'Email Already Registered';
                    errorMessage = `The email "${formData.email}" is already associated with another account. Please either:\n\n• Log in to your existing account\n• Use a different email address\n• Contact support if you believe this is an error`;
                } else {
                    errorMessage = serverMessage || 'This information is already registered to another account. Please check your details or log in.';
                }
            } else if (err.response?.status === 401) {
                errorTitle = 'Authentication Required';
                errorMessage = 'Your session has expired. Please refresh the page and try again.';
            } else if (err.response?.status === 400) {
                errorTitle = 'Invalid Information';
                errorMessage = err.response?.data?.message || 'Please check that all required fields are filled correctly.';
            } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
                errorTitle = 'Connection Timeout';
                errorMessage = 'The request took too long. Please check your internet connection and try again.';
            } else if (!navigator.onLine) {
                errorTitle = 'No Internet Connection';
                errorMessage = 'Please check your internet connection and try again.';
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }

            setError(`${errorTitle}|||${errorMessage}`);
            setIsSubmitting(false);
        }
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

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-8">
                    <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40 italic">Syncing Boutique Profile...</span>
                </div>
            </div>
        );
    }

    if (items.length === 0) return null;

    // Parse error message (format: "Title|||Message")
    const [errorTitle, errorMessage] = error ? error.split('|||') : ['', ''];

    return (
        <>
            {/* Error Modal Overlay */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        onClick={() => setError(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white max-w-md w-full p-10 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="space-y-8">
                                {/* Icon */}
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                                    <AlertCircle className="w-8 h-8 text-red-600" />
                                </div>

                                {/* Title */}
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-serif italic text-black">
                                        {errorTitle || 'Checkout Error'}
                                    </h3>
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-black">
                                        Action Required
                                    </p>
                                </div>

                                {/* Message */}
                                <div className="bg-black/5 p-6 space-y-4">
                                    <p className="text-sm text-black/70 leading-relaxed whitespace-pre-line">
                                        {errorMessage || 'An unexpected error occurred. Please try again.'}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => setError(null)}
                                        className="w-full py-4 bg-black text-white uppercase tracking-[0.3em] text-[10px] font-black hover:bg-[#D4AF37] hover:text-black transition-all"
                                    >
                                        I Understand
                                    </button>
                                    {errorMessage?.includes('Log in') && (
                                        <Link
                                            href="/login"
                                            className="w-full py-4 border border-black text-black text-center uppercase tracking-[0.3em] text-[10px] font-black hover:bg-black hover:text-white transition-all"
                                        >
                                            Go to Login
                                        </Link>
                                    )}
                                </div>

                                {/* Support Link */}
                                <p className="text-center text-[9px] text-black/30 uppercase tracking-[0.2em]">
                                    Need help? Contact our concierge team
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                            <PaystackPayment config={config} onSuccess={onPaystackSuccess} onClose={onPaystackClose}>
                                {(initializePayment) => (
                                    <form onSubmit={(e) => handleProcessOrder(e, initializePayment)} className="space-y-16">

                                        {/* Information Sections */}
                                        <section className="space-y-10">
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[10px] font-black text-black bg-black/5 w-8 h-8 flex items-center justify-center rounded-full">01</span>
                                                    <h2 className="text-[11px] font-black text-black uppercase tracking-[0.4em]">Client Details</h2>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/40">Email Address</label>
                                                        <input
                                                            type="email"
                                                            required
                                                            value={formData.email}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            className="w-full bg-transparent border-b border-black text-sm py-4 focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-black/10 text-black"
                                                            placeholder="excellence@noir.com"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/40">Phone Number</label>
                                                        <input
                                                            type="tel"
                                                            required
                                                            value={formData.phone}
                                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                            className="w-full bg-transparent border-b border-black text-sm py-4 focus:outline-none focus:border-[#D4AF37] transition-all text-black"
                                                        />
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
                                                        <input
                                                            type="text"
                                                            required
                                                            value={formData.firstName}
                                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                            className="w-full bg-transparent border-b border-black text-sm py-4 focus:outline-none focus:border-[#D4AF37] transition-all text-black"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/40">Last Name</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={formData.lastName}
                                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                            className="w-full bg-transparent border-b border-black text-sm py-4 focus:outline-none focus:border-[#D4AF37] transition-all text-black"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2 space-y-2">
                                                        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/40">Street Address</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={formData.address}
                                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                            className="w-full bg-transparent border-b border-black text-sm py-4 focus:outline-none focus:border-[#D4AF37] transition-all text-black"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/40">City</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={formData.city}
                                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                            className="w-full bg-transparent border-b border-black text-sm py-4 focus:outline-none focus:border-[#D4AF37] transition-all text-black"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/40">Postal Code</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={formData.postalCode}
                                                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                                            className="w-full bg-transparent border-b border-black text-sm py-4 focus:outline-none focus:border-[#D4AF37] transition-all text-black"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-8 pt-10">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[10px] font-black text-black bg-black/5 w-8 h-8 flex items-center justify-center rounded-full">03</span>
                                                    <h2 className="text-[11px] font-black text-black uppercase tracking-[0.4em]">Vault Payment</h2>
                                                </div>
                                                <div className="p-10 border border-black/10 rounded-3xl bg-black/[0.02] flex items-center justify-between">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center">
                                                            <Lock className="w-6 h-6 text-[#D4AF37]" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xs font-black uppercase tracking-widest text-black">Paystack Checkout</h3>
                                                            <p className="text-[10px] font-bold text-black/40 uppercase tracking-[0.2em] mt-1">Cards, Bank Transfer, USSD, Apple Pay</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Active</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        {error && (
                                            <div className="flex items-center gap-4 p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600">
                                                <AlertCircle className="w-5 h-5 shrink-0" />
                                                <p className="text-xs font-black uppercase tracking-[0.2em]">{error}</p>
                                            </div>
                                        )}

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
                                                        <span className="uppercase tracking-[0.4em] text-[11px] font-black">Finalize Purchase</span>
                                                        <span className="w-2 h-2 rounded-full bg-[#D4AF37] group-hover:bg-black transition-colors" />
                                                        <span className="text-sm font-bold tracking-tight">{formatPrice(subtotal)}</span>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </button>
                                    </form>
                                )}
                            </PaystackPayment>
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
                                            <span>{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                                            <span>Est. Boutique Delivery</span>
                                            <span className="text-[#D4AF37]">Complimentary</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-serif italic text-black pt-6 border-t border-black/5">
                                            <span>Final Total</span>
                                            <span className="font-bold not-italic tracking-tighter">{formatPrice(subtotal)}</span>
                                        </div>
                                    </div>
                                    <div className="pt-6">
                                        <p className="text-[9px] text-center text-black/30 uppercase tracking-[0.2em] leading-loose">
                                            All transactions are final upon artisan commencement. <br />
                                            Direct Checkout via Paystack Secure Tunnel.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


