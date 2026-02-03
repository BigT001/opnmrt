'use client';

import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getThemeComponents } from '@/components/themes/registry';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
    const params = useParams<{ subdomain: string }>();
    const [store, setStore] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchStore() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stores/resolve?subdomain=${params.subdomain}`);
                if (res.ok) {
                    const text = await res.text();
                    const data = text ? JSON.parse(text) : null;
                    setStore(data);
                }
            } catch (error) {
                console.error("Failed to fetch store for checkout:", error);
            } finally {
                setLoading(false);
            }
        }
        if (params?.subdomain) {
            fetchStore();
        }
    }, [params?.subdomain]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!store) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Store not found</div>;
    }

    const { CheckoutPage: ThemeCheckout } = getThemeComponents(store.theme);

    return <ThemeCheckout store={store} subdomain={params.subdomain} />;
}
