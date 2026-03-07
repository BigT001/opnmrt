'use client';

import React from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

interface BackendPaystackProps {
    email: string;
    amount: number;       // in NAIRA (not kobo)
    orderId: string;
    storeId: string;
    metadata?: Record<string, any>;
    onSuccess: (reference: string) => void;
    onClose: () => void;
    children: (initPay: () => Promise<void>, loading: boolean) => React.ReactNode;
}

/**
 * Backend-initialized Paystack payment.
 * 1. Calls our API to initialize the transaction (keeps secret key server-side).
 * 2. Loads Paystack Inline JS and opens the popup using the returned access_code.
 * 3. Calls onSuccess(reference) when payment completes.
 */
export default function BackendPaystack({
    email, amount, orderId, storeId, metadata,
    onSuccess, onClose, children,
}: BackendPaystackProps) {
    const [loading, setLoading] = React.useState(false);

    const initPay = async () => {
        setLoading(true);
        try {
            // 1. Initialize via backend
            const res = await api.post('payments/initialize', {
                email,
                amount: Math.round(amount * 100), // convert to kobo
                orderId,
                storeId,
                metadata,
            });

            const { access_code, reference } = res.data;

            // 2. Load Paystack inline handler
            await loadPaystackScript();

            const PaystackPop = (window as any).PaystackPop;
            const handler = PaystackPop.setup({
                key: res.data.publicKey, // backend returns the PUBLIC key (safe)
                email,
                amount: Math.round(amount * 100),
                ref: reference,
                access_code,
                onSuccess: (txn: any) => {
                    onSuccess(txn.reference || reference);
                },
                onCancel: () => {
                    onClose();
                },
            });

            handler.openIframe();
        } catch (err: any) {
            console.error('Payment initialization failed:', err);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return <>{children(initPay, loading)}</>;
}

function loadPaystackScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        if ((window as any).PaystackPop) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Paystack script'));
        document.head.appendChild(script);
    });
}
