'use client';

import { useCartStore } from './useCartStore';
import { useMemo } from 'react';

/**
 * A tenant-aware hook to access cart state filtered by storeId.
 * Prevents "leaking" cart items from one store into another in the same browser session.
 */
export function useStoreCart(storeId?: string) {
    const store = useCartStore();

    // The core items for the current store
    const storeItems = useMemo(() => {
        if (!storeId) return [];
        return store.items.filter((item) => item.storeId === storeId);
    }, [store.items, storeId]);

    // Derived statistics - ensure we always have numbers
    const totalCount = useMemo(() => {
        return storeItems.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
    }, [storeItems]);

    const subtotal = useMemo(() => {
        return storeItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
    }, [storeItems]);

    return {
        ...store, // Provides addItem, removeItem, toggleCart, etc.
        storeItems,
        totalCount,
        subtotal,
    };
}
