import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE } from '@/utils/storageKeys';
import type { UserLocation } from '@/types';

interface LocationState {
  location: UserLocation | null;
  setLocation: (loc: UserLocation) => void;
  clear: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      location: null,
      setLocation: (location) => set({ location }),
      clear: () => set({ location: null }),
    }),
    /* v3: the kitchen moved from Coimbatore to Perungalathur, Chennai — a pin
       saved against the old service area is no longer deliverable, so the
       persisted location is dropped and the user is asked again. */
    { name: STORAGE.location, version: 3 }
  )
);

/** The prototype's requireLocation() gate: a location is only usable when it
    is serviceable AND carries real coordinates. */
export function hasServiceableLocation(loc: UserLocation | null): boolean {
  return !!loc && loc.serviceable && loc.lat != null && loc.lng != null;
}
