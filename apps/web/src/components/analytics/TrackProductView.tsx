'use client';

import { useEffect, useRef } from 'react';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';

export function TrackProductView({ storeId, productId }: { storeId: string; productId: string }) {
    const trackedRef = useRef(false);

    useEffect(() => {
        if (storeId && productId && !trackedRef.current) {
            trackEvent(storeId, ANALYTICS_EVENTS.PRODUCT_VIEW, { productId });
            trackedRef.current = true;
        }
    }, [storeId, productId]);

    return null;
}
