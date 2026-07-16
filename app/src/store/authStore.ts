import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE } from '@/utils/storageKeys';
import { useCartStore } from '@/store/cartStore';
import type { AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  /** the JWT from /login-with-otp — every authed call carries it */
  authToken: string | null;
  loggedIn: boolean;
  setSession: (user: AuthUser, token: string | null) => void;
  setWallet: (balance: number) => void;
  /** `keepCart` is for the expired-token path only: the same person is still at
      the keyboard, so their basket survives the silent re-auth. A logout the
      customer actually asked for always empties it. */
  logout: (opts?: { keepCart?: boolean }) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      authToken: null,
      loggedIn: false,
      setSession: (user, token) => set({ user, authToken: token, loggedIn: true }),
      /* /get-wallet-transactions is the live balance; the copy taken at login
         drifts the moment an order is paid out of the wallet. */
      setWallet: (balance) => set((s) => (s.user ? { user: { ...s.user, wallet: balance } } : s)),
      /* Wipe every namespace that belongs to THIS user — cart included. A basket
         is one person's shopping: leaving it behind would show the next person
         to sign in on this device someone else's items.

         The one exception is `keepCart`, passed by the 401 interceptor: an
         expired token is not the customer leaving, it's the same person needing
         a fresh session, so their basket must survive it. */
      logout: (opts) => {
        [STORAGE.orders, STORAGE.wishlist, STORAGE.favs, STORAGE.bill, STORAGE.lastOrder].forEach(
          (k) => localStorage.removeItem(k)
        );
        /* The cart is emptied through its own store, not by deleting its storage
           key: the key only backs the state, and a live store would keep serving
           the old lines (and re-persist them) until a reload. */
        if (!opts?.keepCart) useCartStore.getState().clear();
        set({ user: null, authToken: null, loggedIn: false });
      },
    }),
    { name: STORAGE.auth, version: 3 }
  )
);
