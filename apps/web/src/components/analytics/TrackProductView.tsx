'use client';

// In TrackProductView.tsx
import { useEffect, useRef } from 'react';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';
import { useAuthStore } from '@/store/useAuthStore';

export function TrackProductView({ storeId, productId, productName }: { storeId: string; productId: string; productName?: string }) {
    const trackedRef = useRef(false);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (storeId && productId && !trackedRef.current) {
            trackEvent(storeId, ANALYTICS_EVENTS.PRODUCT_VIEW, {
                productId,
                productName,
                userName: user?.name,
                customerName: user?.name // For backend compatibility
            });
            trackedRef.current = true;
        }
    }, [storeId, productId, productName, user]);

    return null;
}
