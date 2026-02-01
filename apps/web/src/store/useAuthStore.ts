import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface Store {
    id: string;
    name: string;
    subdomain: string;
    logo?: string | null;
    heroImage?: string | null;
    theme?: string;
    themeConfig?: any;
}

interface AuthState {
    user: User | null;
    store: Store | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setStore: (store: Store | null) => void;
    setLoading: (isLoading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            store: null,
            isLoading: true,
            setUser: (user) => set({ user }),
            setStore: (store) => set({ store }),
            setLoading: (isLoading) => set({ isLoading }),
            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, store: null });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                store: state.store,
            }),
        }
    )
);
