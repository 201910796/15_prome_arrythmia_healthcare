import { create } from 'zustand';

export const useUserStore = create((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    resetUser: () => set({ user: null }),
}));

export const useAuthStore = create((set) => ({
    accessToken: null,
    setAccessToken: (token) => set({ accessToken: token }),
    resetAccessToken: () => set({ accessToken: null }),
}));
