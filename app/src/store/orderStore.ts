import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE } from '@/utils/storageKeys';
import type { Bill, Order } from '@/types';

interface OrderState {
  /** the bill the cart last computed — read by /payment so the amount shown is
      the amount owed even when the user deep-links past the cart */
  bill: Bill | null;
  /** unique_order_id of the order just placed — /confirmation and /tracking
      resolve it against the server, this is only the handoff */
  lastOrderId: string | null;
  /** a snapshot of that order, so the confirmation screen paints instantly
      instead of waiting on /brand/{slug}/get-orders to invalidate */
  lastOrder: Order | null;
  /** the saved address the user picked for this checkout (backend address id) */
  selectedAddressId: string | null;

  setBill: (bill: Bill | null) => void;
  setLastOrder: (order: Order) => void;
  selectAddress: (id: string | null) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      bill: null,
      lastOrderId: null,
      lastOrder: null,
      selectedAddressId: null,

      setBill: (bill) => set({ bill }),
      setLastOrder: (order) => set({ lastOrder: order, lastOrderId: order.id }),
      selectAddress: (selectedAddressId) => set({ selectedAddressId }),
    }),
    { name: STORAGE.orders, version: 3 }
  )
);
