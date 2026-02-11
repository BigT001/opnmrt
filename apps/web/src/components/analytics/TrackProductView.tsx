'use client';

import { useEffect } from 'react';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';

export function TrackProductView({ storeId, productId }: { storeId: string; productId: string }) {
    useEffect(() => {
        if (storeId && productId) {
            trackEvent(storeId, ANALYTICS_EVENTS.PRODUCT_VIEW, { productId });
        }
    }, [storeId, productId]);

    return null;
}
