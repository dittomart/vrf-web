import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE } from '@/utils/storageKeys';
import type { AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  loggedIn: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loggedIn: false,
      login: (user) => set({ user, loggedIn: true }),
      /* full logout — wipe every user-specific namespace, as the
         prototype's logoutUser() did */
      logout: () => {
        [STORAGE.cart, STORAGE.orders, STORAGE.wishlist, STORAGE.favs, STORAGE.addresses, STORAGE.bill, STORAGE.lastOrder]
          .forEach((k) => localStorage.removeItem(k));
        set({ user: null, loggedIn: false });
      },
    }),
    { name: STORAGE.auth, version: 2 }
  )
);
