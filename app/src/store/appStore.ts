import { create } from 'zustand';

export interface ToastPayload {
  id: number;
  msg: string;
  /** lucide icon name, kebab-case — matches the prototype's toast(msg, icon) */
  icon: string;
}

interface AppState {
  toasts: ToastPayload[];
  toast: (msg: string, icon?: string) => void;
  dismissToast: (id: number) => void;
}

let seq = 0;

export const useAppStore = create<AppState>()((set) => ({
  toasts: [],
  toast: (msg, icon = 'check-circle') => {
    const id = ++seq;
    set((s) => ({ toasts: [...s.toasts, { id, msg, icon }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 2200);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Fire a toast from anywhere, including outside React. */
export const toast = (msg: string, icon?: string) => useAppStore.getState().toast(msg, icon);
