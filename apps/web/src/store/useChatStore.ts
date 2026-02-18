import { create } from 'zustand';

interface ChatState {
    isOpen: boolean;
    unreadCount: number;
    toggleDrawer: () => void;
    setOpen: (open: boolean) => void;
    incrementUnread: () => void;
    resetUnread: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
    isOpen: false,
    unreadCount: 0,
    toggleDrawer: () => set((state) => {
        const newOpen = !state.isOpen;
        return {
            isOpen: newOpen,
            unreadCount: newOpen ? 0 : state.unreadCount
        };
    }),
    setOpen: (open) => set({
        isOpen: open,
        unreadCount: open ? 0 : undefined // We'll handle this in resetUnread mostly
    }),
    incrementUnread: () => set((state) => ({
        unreadCount: state.isOpen ? 0 : state.unreadCount + 1
    })),
    resetUnread: () => set({ unreadCount: 0 }),
}));
