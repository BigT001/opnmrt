'use client';

import { useCartStore } from './useCartStore';
import { useMemo } from 'react';

/**
 * A tenant-aware hook to access cart state filtered by storeId.
 * Prevents "leaking" cart items from one store into another in the same browser session.
 */
export function useStoreCart(storeId?: string) {
    const store = useCartStore();

    const storeItems = useMemo(() => {
        if (!storeId) return [];
        return store.items.filter((item) => item.storeId === storeId);
    }, [store.items, storeId]);

    const totalCount = useMemo(() => {
        return storeItems.reduce((acc, item) => acc + item.quantity, 0);
    }, [storeItems]);

    const subtotal = useMemo(() => {
        return storeItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, [storeItems]);

    return {
        ...store,
        storeItems,
        totalCount,
        subtotal,
    };
}
