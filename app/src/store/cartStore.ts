import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE } from '@/utils/storageKeys';
import { PRODUCTS } from '@/api/_seed';
import type { Cart } from '@/types';

interface CartState {
  cart: Cart;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: {},
      add: (id, qty = 1) =>
        set((s) => {
          const next = { ...s.cart, [id]: (s.cart[id] || 0) + qty };
          if (next[id] <= 0) delete next[id];
          return { cart: next };
        }),
      setQty: (id, qty) =>
        set((s) => {
          const next = { ...s.cart };
          if (qty <= 0) delete next[id];
          else next[id] = qty;
          return { cart: next };
        }),
      remove: (id) =>
        set((s) => {
          const next = { ...s.cart };
          delete next[id];
          return { cart: next };
        }),
      clear: () => set({ cart: {} }),
    }),
    { name: STORAGE.cart, version: 2 }
  )
);

/* ---- selectors: derive, never store ---- */
export function cartCount(cart: Cart): number {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

export function cartSubtotal(cart: Cart): number {
  return Object.entries(cart).reduce((s, [id, q]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return s + (p ? p.price * q : 0);
  }, 0);
}

export function useCartCount(): number {
  return cartCount(useCartStore((s) => s.cart));
}

export function useCartSubtotal(): number {
  return cartSubtotal(useCartStore((s) => s.cart));
}
