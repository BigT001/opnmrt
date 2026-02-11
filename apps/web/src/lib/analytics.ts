import api from './api';

export const trackEvent = async (storeId: string, eventType: string, payload?: any) => {
    try {
        // Fire and forget to not block UI
        api.post('/analytics/track', {
            storeId,
            eventType,
            payload
        }).catch(err => {
            // Silently fail in analytics
            console.warn('Analytics tracking failed', err);
        });
    } catch (err) {
        // Do nothing
    }
};

export const ANALYTICS_EVENTS = {
    PRODUCT_VIEW: 'PRODUCT_VIEW',
    ADD_TO_CART: 'ADD_TO_CART',
    CHECKOUT_START: 'CHECKOUT_START',
    SESSION_START: 'SESSION_START'
};
