import { create } from 'zustand';

interface UIState {
    isMobileMenuOpen: boolean;
    setMobileMenuOpen: (isOpen: boolean) => void;
    toggleMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isMobileMenuOpen: false,
    setMobileMenuOpen: (isOpen: boolean) => set({ isMobileMenuOpen: isOpen }),
    toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}));
