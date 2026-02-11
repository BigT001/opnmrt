'use client';

import React from 'react';
import { usePaystackPayment } from 'react-paystack';

interface PaystackPaymentProps {
    config: {
        reference: string;
        email: string;
        amount: number;
        publicKey: string;
    };
    onSuccess: (reference: any) => void;
    onClose: () => void;
    children: (initialize: () => void) => React.ReactNode;
}

export default function PaystackPayment({ config, onSuccess, onClose, children }: PaystackPaymentProps) {
    const initializePayment = usePaystackPayment(config);

    const handlePay = () => {
        initializePayment({ onSuccess, onClose });
    };

    return <>{children(handlePay)}</>;
}
