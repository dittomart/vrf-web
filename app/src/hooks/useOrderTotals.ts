import { useQuery } from '@tanstack/react-query';
import { client, num } from '@/api/client';
import { useGetAddresses } from '@/api/mutations/useAddresses';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { useCartSubtotal } from '@/store/cartStore';
import { useLocationStore } from '@/store/locationStore';
import { useOrderStore } from '@/store/orderStore';

export interface OrderTotals {
  subtotal: number;
  deliveryFee: number;
  /** false while the fee is unknown — a guest cannot be quoted one, because
      /get-deliverable-amount requires an account. The UI must say so rather than
      show ₹0, which reads as "free delivery". */
  deliveryFeeKnown: boolean;
  /** km, straight from the backend — never re-derived on the client */
  distanceKm: number | null;
  taxPercent: number;
  tax: number;
  total: number;
  minOrder: number;
  belowMin: boolean;
  isLoading: boolean;
}

interface DeliverableResp {
  success?: boolean;
  data?: {
    distance_km?: number | string;
    delivery_fee?: number | string;
    base_delivery_charge?: number | string;
  };
  distance_km?: number | string;
  delivery_fee?: number | string;
}

/** The fee lives under one of several keys depending on the deploy, and may sit
    at the top level or inside `data`. First finite hit wins. */
function pick(resp: DeliverableResp | undefined, keys: string[]): number | null {
  if (!resp) return null;
  const layers: Array<Record<string, unknown>> = [
    resp as unknown as Record<string, unknown>,
    (resp.data ?? {}) as Record<string, unknown>,
  ];
  for (const key of keys) {
    for (const layer of layers) {
      const v = layer[key];
      if (v == null) continue;
      const n = num(v, NaN);
      if (Number.isFinite(n)) return n;
    }
  }
  return null;
}

/** THE single source of truth for money. The cart and the payment screen both
    read from here, through the same React Query cache, so the two totals cannot
    disagree — and the `distanceKm` shown is byte-for-byte the `dis` value
    /place-order is given, which is what the backend recomputes the delivery
    charge from. */
export function useOrderTotals(): OrderTotals {
  const subtotal = useCartSubtotal();
  const store = useAppStore((s) => s.storeLocation);
  const user = useAuthStore((s) => s.user);
  const userLoc = useLocationStore((s) => s.location);
  const selectedAddressId = useOrderStore((s) => s.selectedAddressId);
  const { data: addresses } = useGetAddresses();

  /* Which coordinates the fee is quoted against, in order of authority. A saved
     address wins outright once the customer has one: falling back to the
     home-screen GPS pin here would quote a fee for one place while /place-order
     ships the coordinates of another. */
  const picked =
    addresses?.find((a) => a.id === selectedAddressId) ??
    addresses?.find((a) => a.id === String(user?.defaultAddressId ?? '')) ??
    addresses?.[0];

  const latitude = picked ? picked.latitude : userLoc?.lat;
  const longitude = picked ? picked.longitude : userLoc?.lng;

  const coordsUsable =
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    // (0,0) is what a half-saved address row leaves behind — never quote on it
    !(latitude === 0 && longitude === 0);

  const restaurantId = store?.restaurantId;
  const token = useAuthStore((s) => s.authToken);

  const { data, isLoading } = useQuery<DeliverableResp>({
    // the endpoint sits behind jwt.auth — asking as a guest only ever 401s
    queryKey: ['deliverable-amount', restaurantId, latitude, longitude],
    enabled: !!token && !!restaurantId && coordsUsable && subtotal > 0,
    staleTime: 60_000,
    queryFn: async () => {
      const { data } = await client.post<DeliverableResp>('/get-deliverable-amount', {
        restaurant_id: restaurantId,
        latitude,
        longitude,
      });
      return data;
    },
  });

  const liveFee = pick(data, ['delivery_fee', 'deliverable_amount', 'delivery_charge', 'base_delivery_charge']);
  const distance = pick(data, ['distance_km', 'distance']);

  /* The store's free-delivery threshold, applied the same way the backend applies
     it when the order is placed: only when a threshold is actually configured. */
  const freeAbove = store?.freeDeliveryAbove ?? 0;
  const freeByThreshold = freeAbove > 0 && subtotal >= freeAbove;

  const deliveryFeeKnown = subtotal <= 0 || freeByThreshold || liveFee != null;
  const deliveryFee = subtotal <= 0 || freeByThreshold ? 0 : (liveFee ?? 0);

  // the store's own tax setting — never a hardcoded rate
  const taxPercent = store?.taxEnabled ? store.taxPercent : 0;
  const tax = taxPercent > 0 ? Math.round((subtotal * taxPercent) / 100) : 0;

  const minOrder = store?.minOrder ?? 0;

  return {
    subtotal,
    deliveryFee,
    deliveryFeeKnown,
    distanceKm: distance,
    taxPercent,
    tax,
    total: Math.max(0, subtotal + deliveryFee + tax),
    minOrder,
    belowMin: minOrder > 0 && subtotal > 0 && subtotal < minOrder,
    isLoading,
  };
}
