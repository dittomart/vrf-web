import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE } from '@/utils/storageKeys';
import { computeUnitPrice, defaultCustomizations, lineIdOf } from '@/utils/productPricing';
import type { CartLine, Customization, Product } from '@/types';

interface CartState {
  lines: CartLine[];
  /** add a dish with an explicit set of choices (the PDP path) */
  addLine: (line: CartLine) => void;
  /** add a dish with its cheapest variant preselected (every ADD button) */
  add: (product: Product, qty?: number) => void;
  setQty: (lineId: string, qty: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],

      addLine: (line) =>
        set((s) => {
          // clone rather than mutate: a reorder line comes straight out of a
          // React Query cache object, and merging in place would corrupt it
          const incoming: CartLine = {
            ...line,
            customizations: line.customizations.map((c) => ({ ...c })),
            qty: Math.max(1, Math.floor(Number(line.qty)) || 1),
          };
          const at = s.lines.findIndex((l) => l.lineId === incoming.lineId);
          if (at === -1) return { lines: [...s.lines, incoming] };

          const lines = s.lines.slice();
          lines[at] = { ...lines[at], qty: lines[at].qty + incoming.qty };
          return { lines };
        }),

      add: (product, qty = 1) =>
        set((s) => {
          const chosen = defaultCustomizations(product);
          const lineId = lineIdOf(product.id, chosen);
          const at = s.lines.findIndex((l) => l.lineId === lineId);
          const n = Math.max(1, Math.floor(Number(qty)) || 1);

          if (at !== -1) {
            const lines = s.lines.slice();
            lines[at] = { ...lines[at], qty: lines[at].qty + n };
            return { lines };
          }

          const line: CartLine = {
            lineId,
            productId: product.id,
            restaurantId: product.restaurantId,
            name: product.name,
            image: product.img,
            basePrice: product.price,
            unitPrice: computeUnitPrice(product, chosen),
            qty: n,
            customizations: chosen,
          };
          return { lines: [...s.lines, line] };
        }),

      setQty: (lineId, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.lineId !== lineId)
              : s.lines.map((l) => (l.lineId === lineId ? { ...l, qty: Math.floor(qty) } : l)),
        })),

      remove: (lineId) => set((s) => ({ lines: s.lines.filter((l) => l.lineId !== lineId) })),

      clear: () => set({ lines: [] }),
    }),
    { name: STORAGE.cart, version: 3 }
  )
);

/* ---- selectors: derive, never store ---- */

export function useCartCount(): number {
  return useCartStore((s) => s.lines.reduce((a, l) => a + l.qty, 0));
}

/** The bare item total. Delivery, tax and the free-delivery threshold are the
    backend's call — see useOrderTotals. */
export function useCartSubtotal(): number {
  return useCartStore((s) => s.lines.reduce((a, l) => a + l.unitPrice * l.qty, 0));
}

/** How many of this dish are in the cart, across every variant of it — what a
    product card's stepper shows. */
export function useProductQty(productId: string): number {
  return useCartStore((s) =>
    s.lines.filter((l) => l.productId === productId).reduce((a, l) => a + l.qty, 0)
  );
}

/** The line a product card's stepper drives: a card has no variant picker, so
    it only ever owns the line it created (the default-variant one). */
export function defaultLineIdFor(productId: string, chosen: Customization[]): string {
  return lineIdOf(productId, chosen);
}
