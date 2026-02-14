'use client';

import { useEffect, useRef } from 'react';
import { useCartStore } from '@/store/useCartStore';
import api from '@/lib/api';

export const CartSync = () => {
    const { items: localItems, setItems } = useCartStore();
    const isFirstRun = useRef(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        // On initial mount, we sync the cart
        const performInitialSync = async () => {
            try {
                // Sync local with backend (Merge mode enables Union of states)
                const syncRes = await api.post('/users/cart/sync', {
                    items: localItems,
                    merge: true
                });

                setItems(syncRes.data);
            } catch (err) {
                console.error("Cart hydration failed:", err);
            }
        };

        if (isFirstRun.current) {
            isFirstRun.current = false;
            performInitialSync();
        }
    }, []);

    return null; // Side effect component
};
