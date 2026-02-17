import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Helper for backend sync
const syncToBackend = async (items: any[]) => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        // Dynamic import to avoid cycles or unnecessary loads
        const api = (await import('@/lib/api')).default;
        await api.post('/users/cart/sync', { items, merge: false });
    } catch (e) {
        console.error("Cart auto-sync failed:", e);
    }
};

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
    storeId: string;
    stock: number; // Mandatory for enforcement
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    notification: string | null;
    error: string | null; // Added for stock errors
    addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    removeItem: (id: string, storeId?: string) => void;
    updateQuantity: (id: string, quantity: number, storeId?: string) => void;
    clearCart: () => void;
    clearStoreCart: (storeId: string) => void;
    toggleCart: () => void;
    setOpen: (open: boolean) => void;
    totalItems: (storeId?: string) => number;
    totalPrice: (storeId?: string) => number;
    clearNotification: () => void;
    setItems: (items: CartItem[]) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            notification: null,
            error: null,

            addItem: (item, quantity = 1) => {
                const currentItems = get().items;
                const existingItem = currentItems.find(
                    (i) => i.id === item.id && i.storeId === item.storeId
                );

                // Track analytics
                import('@/lib/analytics').then(async ({ trackEvent, ANALYTICS_EVENTS }) => {
                    const { useAuthStore } = await import('./useAuthStore');
                    const user = useAuthStore.getState().user;
                    trackEvent(item.storeId, ANALYTICS_EVENTS.ADD_TO_CART, {
                        productId: item.id,
                        productName: item.name,
                        quantity,
                        userName: user?.name,
                        customerName: user?.name // For backend consistency
                    });
                });

                if (existingItem) {
                    const newQuantity = existingItem.quantity + quantity;
                    const availableStock = item.stock ?? 9999;
                    if (newQuantity > availableStock) {
                        set({
                            error: `Cannot add more. Only ${availableStock} in stock.`,
                            notification: null
                        });
                        setTimeout(() => set({ error: null }), 3000);
                        return;
                    }
                    set({
                        items: currentItems.map((i) =>
                            (i.id === item.id && i.storeId === item.storeId)
                                ? { ...i, quantity: newQuantity }
                                : i
                        ),
                        notification: 'Successfully added to cart',
                        error: null
                    });
                    syncToBackend(get().items);
                } else {
                    const availableStock = item.stock ?? 9999;
                    if (quantity > availableStock) {
                        set({
                            error: `Only ${availableStock} available.`,
                            notification: null
                        });
                        setTimeout(() => set({ error: null }), 3000);
                        return;
                    }
                    set({
                        items: [...currentItems, { ...item, quantity }],
                        notification: 'Successfully added to cart',
                        error: null
                    });
                    syncToBackend(get().items);
                }

                setTimeout(() => set({ notification: null }), 3000);
            },

            removeItem: (id, storeId) => {
                set({
                    items: get().items.filter((i) => {
                        if (storeId) {
                            return !(i.id === id && i.storeId === storeId);
                        }
                        return i.id !== id;
                    })
                });
                syncToBackend(get().items);
            },

            updateQuantity: (id, quantity, storeId) => {
                if (quantity < 1) {
                    get().removeItem(id, storeId);
                    return;
                }

                const item = get().items.find(i =>
                    storeId ? (i.id === id && i.storeId === storeId) : i.id === id
                );

                if (item && quantity > (item.stock ?? 9999)) {
                    set({ error: `Limited by available stock (${item.stock})` });
                    setTimeout(() => set({ error: null }), 3000);
                    return;
                }

                set({
                    items: get().items.map((i) => {
                        const isMatch = storeId
                            ? (i.id === id && i.storeId === storeId)
                            : i.id === id;

                        return isMatch ? { ...i, quantity } : i;
                    }),
                    error: null
                });
                syncToBackend(get().items);
            },

            clearCart: () => {
                set({ items: [] });
                syncToBackend([]);
            },

            clearStoreCart: (storeId: string) => {
                set({ items: get().items.filter((i) => i.storeId !== storeId) });
            },

            toggleCart: () => set({ isOpen: !get().isOpen }),

            setOpen: (open) => set({ isOpen: open }),

            clearNotification: () => set({ notification: null, error: null }),

            totalItems: (storeId) => {
                const items = storeId ? get().items.filter(i => i.storeId === storeId) : get().items;
                return items.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
            },

            totalPrice: (storeId) => {
                const items = storeId ? get().items.filter(i => i.storeId === storeId) : get().items;
                return items.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
            },

            setItems: (items) => set({ items }),
        }),
        {
            name: 'opnmart-cart-v3', // Bumped version to ensure fresh start with stock fixes
            storage: createJSONStorage(() => localStorage),
        }
    )
);
