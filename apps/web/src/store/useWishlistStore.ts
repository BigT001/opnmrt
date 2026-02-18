import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductData } from '@/components/themes/types';

interface WishlistItem extends ProductData {
    // Add any extra fields if needed
}

interface WishlistState {
    items: WishlistItem[];
    isOpen: boolean;
    toggleDrawer: () => void;
    addItem: (item: ProductData) => void;
    removeItem: (id: string | number) => void;
    toggleItem: (item: ProductData) => void;
    isInWishlist: (id: string | number) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
            addItem: (item) => {
                const { items } = get();
                if (!items.find((i) => String(i.id) === String(item.id))) {
                    set({ items: [...items, item] });
                }
            },
            removeItem: (id) => {
                const { items } = get();
                set({ items: items.filter((i) => String(i.id) !== String(id)) });
            },
            toggleItem: (item) => {
                const { items } = get();
                const strId = String(item.id);
                const exists = items.find((i) => String(i.id) === strId);
                if (exists) {
                    set({ items: items.filter((i) => String(i.id) !== strId) });
                } else {
                    set({ items: [...items, item] });
                }
            },
            isInWishlist: (id) => {
                const { items } = get();
                return items.some((i) => String(i.id) === String(id));
            },
        }),
        {
            name: 'wishlist-storage-v2', // New version to avoid conflicts with old ID storage
        }
    )
);
