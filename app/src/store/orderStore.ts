import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE } from '@/utils/storageKeys';
import type { Address, Bill, Order } from '@/types';

interface OrderState {
  orders: Order[];
  lastOrderId: string | null;
  bill: Bill | null;
  addresses: Address[];
  selectedAddressId: string | null;
  placeOrder: (order: Order) => void;
  setBill: (bill: Bill | null) => void;
  addAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  selectAddress: (id: string) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      lastOrderId: null,
      bill: null,
      addresses: [],
      selectedAddressId: null,
      placeOrder: (order) =>
        set((s) => ({ orders: [order, ...s.orders], lastOrderId: order.id })),
      setBill: (bill) => set({ bill }),
      addAddress: (address) =>
        set((s) => ({
          addresses: [...s.addresses, address],
          // first address saved becomes the selected one automatically
          selectedAddressId: s.selectedAddressId ?? address.id,
        })),
      removeAddress: (id) =>
        set((s) => ({
          addresses: s.addresses.filter((a) => a.id !== id),
          selectedAddressId: s.selectedAddressId === id ? null : s.selectedAddressId,
        })),
      selectAddress: (id) => set({ selectedAddressId: id }),
    }),
    { name: STORAGE.orders, version: 2 }
  )
);
