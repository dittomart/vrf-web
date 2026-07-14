import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE } from '@/utils/storageKeys';
import type { OrderItem } from '@/types';

/** A combo the user saved from the confirmation screen, to reorder in one tap.
    Shape matches what confirmation.html unshifted into `vrf_favs`. */
export interface SavedCombo {
  name: string;
  items: OrderItem[];
  total: number;
}

interface SavedOrdersState {
  favs: SavedCombo[];
  save: (combo: SavedCombo) => void;
  clear: () => void;
}

export const useSavedOrdersStore = create<SavedOrdersState>()(
  persist(
    (set) => ({
      favs: [],
      save: (combo) => set((s) => ({ favs: [combo, ...s.favs] })),
      clear: () => set({ favs: [] }),
    }),
    { name: STORAGE.favs, version: 2 }
  )
);
