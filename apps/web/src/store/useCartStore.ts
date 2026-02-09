import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
    storeId: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    notification: string | null;
    addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    clearStoreCart: (storeId: string) => void;
    toggleCart: () => void;
    setOpen: (open: boolean) => void;
    totalItems: (storeId?: string) => number;
    totalPrice: (storeId?: string) => number;
    clearNotification: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            notification: null,

            addItem: (item, quantity = 1) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((i) => i.id === item.id);

                if (existingItem) {
                    set({
                        items: currentItems.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
                        ),
                        notification: 'Successfully added to cart',
                    });
                } else {
                    set({
                        items: [...currentItems, { ...item, quantity }],
                        notification: 'Successfully added to cart',
                    });
                }

                // Auto-clear notification after 3 seconds
                setTimeout(() => {
                    set({ notification: null });
                }, 3000);
            },

            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
            },

            updateQuantity: (id, quantity) => {
                if (quantity < 1) {
                    get().removeItem(id);
                    return;
                }
                set({
                    items: get().items.map((i) =>
                        i.id === id ? { ...i, quantity } : i
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            clearStoreCart: (storeId: string) => {
                set({ items: get().items.filter((i) => i.storeId !== storeId) });
            },

            toggleCart: () => set({ isOpen: !get().isOpen }),

            setOpen: (open) => set({ isOpen: open }),

            clearNotification: () => set({ notification: null }),

            totalItems: (storeId) => {
                const items = storeId ? get().items.filter(i => i.storeId === storeId) : get().items;
                return items.reduce((acc, item) => acc + item.quantity, 0);
            },

            totalPrice: (storeId) => {
                const items = storeId ? get().items.filter(i => i.storeId === storeId) : get().items;
                return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'opnmart-cart',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
