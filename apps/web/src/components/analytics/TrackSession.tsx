'use client';

import { useEffect } from 'react';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';

export function TrackSession({ storeId }: { storeId: string }) {
    useEffect(() => {
        if (!storeId) return;

        const sessionKey = `opnmart_session_${storeId}`;
        const hasTracked = sessionStorage.getItem(sessionKey);

        if (!hasTracked) {
            trackEvent(storeId, ANALYTICS_EVENTS.SESSION_START);
            sessionStorage.setItem(sessionKey, 'true');
        }
    }, [storeId]);

    return null;
}
