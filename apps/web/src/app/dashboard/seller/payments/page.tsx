'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Payment settings have been moved to Settings → Payments tab
export default function PaymentsRedirectPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/dashboard/seller/settings');
    }, [router]);
    return null;
}
