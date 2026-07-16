import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { assetUrl, client, num } from '@/api/client';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import type { Customization, Order, OrderItem, OrderStatus } from '@/types';

interface ApiOrderAddon {
  id?: number;
  addon_id?: number;
  addon_name?: string | null;
  addon_price?: number | string | null;
  addon_category_name?: string | null;
}

interface ApiOrderItem {
  id: number;
  item_id?: number;
  name?: string | null;
  quantity?: number | string | null;
  price?: number | string | null;
  image?: string | null;
  order_item_addons?: ApiOrderAddon[] | null;
}

interface ApiOrderRow {
  id: number;
  unique_order_id?: string | null;
  orderstatus_id?: number | string | null;
  total?: number | string | null;
  sub_total?: number | string | null;
  tax_amount?: number | string | null;
  tax?: number | string | null;
  delivery_charge?: number | string | null;
  payment_mode?: string | null;
  address?: string | null;
  created_at?: string | null;
  orderitems?: ApiOrderItem[] | null;
}

interface ApiOrdersPage {
  current_page?: number;
  next_page_url?: string | null;
  data?: ApiOrderRow[];
}

/** The backend's orderstatus_id → UI status, per getOrderStatusName() in the
    backend's helpers.php (the authoritative map):
      1 Placed · 2 Accepted · 3 Delivery Assigned · 4 Picked Up · 5 Delivered
      6 Cancelled · 7 Ready to Pickup · 8 Awaiting Payment · 9 Payment Failed
      10 Scheduled · 11 Confirmed Scheduled · 12 Shipped (manual delivery) */
export function statusOf(id: number): OrderStatus {
  switch (id) {
    case 8:
      return 'awaiting-payment';
    case 2:
    case 10:
    case 11:
      return 'confirmed';
    case 3:
      // "Delivery Assigned" — the kitchen is preparing while a rider is booked
      return 'preparing';
    case 7:
      return 'ready';
    case 4:
    case 12:
      return 'out-for-delivery';
    case 5:
      return 'delivered';
    case 9:
      return 'payment-failed';
    case 6:
      return 'cancelled';
    default:
      return 'placed';
  }
}

/** No more polling once the order can't change: delivered, cancelled, or the
    payment failed for good. */
export function isTerminalStatus(id: number): boolean {
  return id === 5 || id === 6 || id === 9;
}

function mapOrderItem(it: ApiOrderItem): OrderItem {
  const base = num(it.price);
  const addons = it.order_item_addons ?? [];

  /* A variant-priced dish stores price 0 on the order row and puts the real
     money on its addons. Reordering off `price` alone would drop a ₹0 line into
     the cart for a dish the menu sells at ₹90. */
  const addonTotal = addons.reduce((s, a) => s + num(a.addon_price), 0);

  const customizations: Customization[] = addons.map((a) => ({
    groupId: 0,
    groupName: String(a.addon_category_name ?? ''),
    addonId: num(a.addon_id ?? a.id),
    addonName: String(a.addon_name ?? ''),
    price: num(a.addon_price),
  }));

  return {
    id: String(it.item_id ?? it.id),
    name: String(it.name ?? ''),
    price: base + addonTotal,
    // a bad row can ship quantity 0 or "2" — both would render as "0×"
    qty: Math.max(1, Math.floor(num(it.quantity, 1))),
    image: assetUrl(it.image),
    customizations,
  };
}

function mapOrder(row: ApiOrderRow, etaMin: number): Order {
  const statusId = num(row.orderstatus_id, 1);
  return {
    id: String(row.unique_order_id ?? row.id),
    orderId: num(row.id),
    items: (row.orderitems ?? []).map(mapOrderItem),
    subtotal: num(row.sub_total),
    deliveryCharge: num(row.delivery_charge),
    tax: num(row.tax_amount ?? row.tax),
    total: num(row.total),
    paymentMethod: String(row.payment_mode ?? ''),
    status: statusOf(statusId),
    statusId,
    placedAt: String(row.created_at ?? ''),
    etaMin,
    address: null,
  };
}

/** POST /brand/{brand_unique_id}/get-orders?page=N */
export function useGetOrdersInfinite() {
  const brandId = useAppStore((s) => s.brand?.uniqueId);
  const etaMin = useAppStore((s) => s.storeLocation?.deliveryTime ?? 35);
  const token = useAuthStore((s) => s.authToken);

  return useInfiniteQuery({
    queryKey: ['orders', brandId, token],
    enabled: !!brandId && !!token,
    staleTime: 30_000,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const { data } = await client.post<ApiOrdersPage | ApiOrderRow[]>(
        `/brand/${brandId}/get-orders?page=${pageParam}`,
        {}
      );
      // some deploys answer with a bare array instead of a paginator
      const page: ApiOrdersPage = Array.isArray(data)
        ? { current_page: 1, next_page_url: null, data }
        : (data ?? {});

      return {
        orders: (page.data ?? []).map((r) => mapOrder(r, etaMin)),
        currentPage: num(page.current_page, Number(pageParam)),
        hasNext: !!page.next_page_url,
      };
    },
    getNextPageParam: (last) => (last.hasNext ? last.currentPage + 1 : undefined),
  });
}

/** Every order the customer has, flattened. */
export function useGetOrders() {
  const q = useGetOrdersInfinite();
  const orders = q.data?.pages.flatMap((p) => p.orders) ?? [];
  return { ...q, orders };
}

/** One order, by its unique_order_id. There is no endpoint for this, so it is
    resolved out of the order list the customer already has. */
export function useGetOrder(uniqueOrderId: string | undefined) {
  const { orders, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetOrders();
  const order = orders.find((o) => o.id === uniqueOrderId) ?? null;

  // a deep link into an older order lands on a page we have not pulled yet
  if (!order && hasNextPage && !isFetchingNextPage && !isLoading) void fetchNextPage();

  return { order, isLoading: isLoading || (!order && (hasNextPage ?? false)) };
}

interface ApiTrackResp {
  running_order?: {
    id?: number;
    unique_order_id?: string;
    orderstatus_id?: number | string;
    tracking_url?: string | null;
    third_party_tracking_url?: string | null;
    pickupanddrop_details?: { tracking_url?: string | null } | null;
  } | null;
  delivery_details?: {
    name?: string | null;
    phone?: string | null;
    photo?: string | null;
    rating?: number | string | null;
    tracking_url?: string | null;
  } | null;
}

export interface TrackState {
  statusId: number;
  status: OrderStatus;
  trackingUrl: string | null;
  rider: { name: string; phone: string; photo: string; rating: number } | null;
}

/** POST /update-user-info — the fork's live-tracking endpoint, misleading name
    and all. Polls every 15s and stops dead once the order is delivered or
    cancelled, so a finished order does not keep hitting the server forever. */
export function useTrackOrder(uniqueOrderId: string | undefined) {
  const token = useAuthStore((s) => s.authToken);

  return useQuery<TrackState | null>({
    queryKey: ['track-order', uniqueOrderId],
    enabled: !!uniqueOrderId && !!token,
    staleTime: 0,
    refetchIntervalInBackground: false,
    refetchInterval: (q) => {
      const s = q.state.data;
      if (s && isTerminalStatus(s.statusId)) return false;
      return 15_000;
    },
    queryFn: async () => {
      const { data } = await client.post<ApiTrackResp>('/update-user-info', {
        unique_order_id: uniqueOrderId,
      });

      const ro = data?.running_order;
      if (!ro) return null;

      const dd = data?.delivery_details;
      const statusId = num(ro.orderstatus_id, 1);

      return {
        statusId,
        status: statusOf(statusId),
        trackingUrl:
          ro.tracking_url ||
          ro.third_party_tracking_url ||
          ro.pickupanddrop_details?.tracking_url ||
          dd?.tracking_url ||
          null,
        rider: dd?.name
          ? {
              name: String(dd.name),
              phone: String(dd.phone ?? ''),
              photo: assetUrl(dd.photo ?? ''),
              rating: num(dd.rating),
            }
          : null,
      };
    },
  });
}

interface ApiWallet {
  success?: boolean;
  balance?: number | string;
  transactions?: Array<{
    id: number;
    amount?: number | string;
    type?: string;
    description?: string | null;
    created_at?: string | null;
  }> | null;
}

export interface WalletTx {
  id: number;
  /** rupees */
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  createdAt: string;
}

/** POST /get-wallet-transactions — `balance` is in RUPEES, but the transaction
    rows are in PAISE. */
export function useGetWallet() {
  const token = useAuthStore((s) => s.authToken);

  return useQuery<{ balance: number; transactions: WalletTx[] }>({
    queryKey: ['wallet', token],
    enabled: !!token,
    staleTime: 60_000,
    queryFn: async () => {
      const { data } = await client.post<ApiWallet>('/get-wallet-transactions', {});
      const rows = Array.isArray(data?.transactions) ? data.transactions : [];

      return {
        balance: num(data?.balance),
        transactions: rows.map((t) => ({
          id: num(t.id),
          amount: num(t.amount) / 100,
          type: /withdraw|debit/i.test(String(t.type ?? '')) ? 'debit' : 'credit',
          description: String(t.description ?? ''),
          createdAt: String(t.created_at ?? ''),
        })),
      };
    },
  });
}
