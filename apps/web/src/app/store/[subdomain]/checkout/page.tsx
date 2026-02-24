'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getThemeComponents } from '@/components/themes/registry';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
    const params = useParams<{ subdomain: string }>();
    const [store, setStore] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [ThemeCheckout, setThemeCheckout] = useState<any>(null);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const router = useRouter();

    const trackedCheckoutRef = useRef(false);

    useEffect(() => {
        async function fetchStoreAndTheme() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stores/resolve?subdomain=${params.subdomain}`);
                if (res.ok) {
                    const text = await res.text();
                    const data = text ? JSON.parse(text) : null;
                    setStore(data);

                    if (data) {
                        const components = await getThemeComponents(data.theme);
                        setThemeCheckout(() => components.CheckoutPage);
                    }

                    // Track Checkout Start
                    if (data?.id && !trackedCheckoutRef.current) {
                        import('@/lib/analytics').then(async ({ trackEvent, ANALYTICS_EVENTS }) => {
                            const { useAuthStore } = await import('@/store/useAuthStore');
                            const user = useAuthStore.getState().user;
                            trackEvent(data.id, ANALYTICS_EVENTS.CHECKOUT_START, {
                                userName: user?.name,
                                customerName: user?.name
                            });
                            trackedCheckoutRef.current = true;
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch store for checkout:", error);
            } finally {
                setLoading(false);
            }
        }
        if (params?.subdomain) {
            fetchStoreAndTheme();
        }
    }, [params?.subdomain]);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (store && !token && !store.useWhatsAppCheckout) {
            setIsRedirecting(true);
            const timer = setTimeout(() => {
                router.push(`/store/${params.subdomain}/customer/login?redirect=checkout`);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [store, params.subdomain, router]);

    if (loading || isRedirecting || !ThemeCheckout) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <AnimatePresence mode="wait">
                    {isRedirecting ? (
                        <motion.div
                            key="redirecting"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center space-y-4"
                        >
                            <div className="relative w-16 h-16 mx-auto mb-6">
                                <motion.div
                                    className="absolute inset-0 border-4 border-slate-100 rounded-full"
                                />
                                <motion.div
                                    className="absolute inset-0 border-4 border-slate-900 rounded-full border-t-transparent"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Securing Your Session</h2>
                            <p className="text-sm font-medium text-slate-400 max-w-[250px]">To protect your data, we're taking you to our secure login portal.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    if (!store) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium font-inter">Store not found</div>;
    }

    return <ThemeCheckout store={store} subdomain={params.subdomain} />;
}
