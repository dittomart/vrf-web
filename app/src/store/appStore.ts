import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE } from '@/utils/storageKeys';
import type { Brand, StoreLocation } from '@/types';

export interface ToastPayload {
  id: number;
  msg: string;
  /** lucide icon name, kebab-case — matches the prototype's toast(msg, icon) */
  icon: string;
}

interface AppState {
  brand: Brand | null;
  storeLocation: StoreLocation | null;
  setBrand: (b: Brand) => void;
  setStoreLocation: (s: StoreLocation) => void;

  toasts: ToastPayload[];
  toast: (msg: string, icon?: string) => void;
  dismissToast: (id: number) => void;
}

let seq = 0;

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      brand: null,
      storeLocation: null,
      setBrand: (brand) => set({ brand }),
      setStoreLocation: (storeLocation) => set({ storeLocation }),

      toasts: [],
      toast: (msg, icon = 'check-circle') => {
        const id = ++seq;
        set((s) => ({ toasts: [...s.toasts, { id, msg, icon }] }));
        setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 2200);
      },
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: STORAGE.app,
      version: 1,
      /* storeLocation is deliberately NOT persisted: its open/closed bits
         (is_active, schedule_override) drive the whole app, and last night's
         snapshot would keep a force-closed kitchen looking open until
         /brand-locations resolves. It is refetched every session. */
      partialize: (s) => ({ brand: s.brand }),
    }
  )
);

/** Fire a toast from anywhere, including outside React. */
export const toast = (msg: string, icon?: string) => useAppStore.getState().toast(msg, icon);
