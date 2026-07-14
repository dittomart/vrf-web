import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE } from '@/utils/storageKeys';

interface WishlistState {
  ids: string[];
  toggle: (id: string) => boolean; // returns true when the item is now saved
  remove: (id: string) => void;
  has: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const has = get().ids.includes(id);
        set((s) => ({ ids: has ? s.ids.filter((x) => x !== id) : [...s.ids, id] }));
        return !has;
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      has: (id) => get().ids.includes(id),
    }),
    { name: STORAGE.wishlist, version: 2 }
  )
);
