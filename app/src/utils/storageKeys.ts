/* Every localStorage key the app touches lives here — nothing else may
   hand-write a key string. */

export const STORAGE_PREFIX = 'vrf_';
export const LEGACY_STORAGE_PREFIX = 'dittomart_';

export const STORAGE = {
  theme: `${STORAGE_PREFIX}theme`,
  mode: `${STORAGE_PREFIX}mode`,
  cart: `${STORAGE_PREFIX}cart`,
  orders: `${STORAGE_PREFIX}orders`,
  wishlist: `${STORAGE_PREFIX}wishlist`,
  favs: `${STORAGE_PREFIX}favs`,
  auth: `${STORAGE_PREFIX}auth`,
  location: `${STORAGE_PREFIX}location`,
  addresses: `${STORAGE_PREFIX}addresses`,
  bill: `${STORAGE_PREFIX}bill`,
  lastOrder: `${STORAGE_PREFIX}last_order`,
  migrated: `${STORAGE_PREFIX}migrated_v1`,
} as const;

/* The static prototype stored the serviceability check under
   `dittomart_location`. Copy any legacy key into the vrf_ namespace once,
   and only when the new key is absent — never clobber fresh state. */
export function migrateLegacyStorage(): void {
  try {
    if (localStorage.getItem(STORAGE.migrated) === '1') return;

    const legacyLocation = localStorage.getItem(`${LEGACY_STORAGE_PREFIX}location`);
    if (legacyLocation && !localStorage.getItem(STORAGE.location)) {
      // The legacy value is a bare object; the store persists {state, version}.
      const parsed = JSON.parse(legacyLocation) as Record<string, unknown>;
      localStorage.setItem(
        STORAGE.location,
        JSON.stringify({ state: { location: parsed }, version: 2 })
      );
    }

    localStorage.setItem(STORAGE.migrated, '1');
  } catch {
    /* corrupt legacy JSON / private mode — nothing to migrate */
  }
}
