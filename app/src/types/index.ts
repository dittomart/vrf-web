/* The shapes the UI renders. Everything here is produced by a mapper in
   src/api/ — no component ever sees a raw backend row. */

export interface Category {
  /** the backend item_category id, as a string */
  id: string;
  name: string;
  /** lucide icon name, kebab-case — derived from the category name */
  icon: string;
  image?: string;
}

/** One choosable addon (a portion, a topping, an extra). */
export interface AddonOption {
  id: number;
  name: string;
  price: number;
}

/** SINGLE = pick exactly one (a variant / portion). MULTIPLE = pick any. */
export interface AddonGroup {
  id: number;
  name: string;
  type: 'SINGLE' | 'MULTIPLE';
  limit: number;
  options: AddonOption[];
}

export interface Product {
  /** backend item id, as a string */
  id: string;
  /** backend item_category id, as a string */
  cat: string;
  categoryName: string;
  restaurantId: number;
  name: string;
  desc: string;
  /** the item's own price — NOT necessarily what the card shows (see getDisplayPrice) */
  price: number;
  /** old_price; 0 when the backend has none */
  mrp: number;
  /** absolute image URL, already resolved against the asset host */
  img: string;
  best: boolean;
  isRecommended: boolean;
  isNew: boolean;
  isPopular: boolean;
  isVeg: boolean;
  /** never surfaced as a real count — kept because the card layout reserves it */
  ordered: number;
  tags: string[];
  addonGroups: AddonGroup[];
}

/** The addon choices frozen onto a cart line. */
export interface Customization {
  groupId: number;
  groupName: string;
  addonId: number;
  addonName: string;
  price: number;
}

export interface CartLine {
  /** productId + a hash of the customizations — the merge key */
  lineId: string;
  productId: string;
  restaurantId: number;
  name: string;
  image: string;
  /** the raw item price the backend recomputes against */
  basePrice: number;
  /** basePrice (or the variant total) + every selected extra */
  unitPrice: number;
  qty: number;
  customizations: Customization[];
}

export interface UserLocation {
  address: string;
  area: string;
  lat: number;
  lng: number;
  serviceable: boolean;
  distanceKm?: number;
}

export interface Address {
  /** backend address id, as a string */
  id: string;
  label: string;
  receiverName: string;
  phone: string;
  houseNo: string;
  building: string;
  street: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
}

export interface OrderItem {
  /** the backend item_id, as a string — what a reorder looks up in the catalog */
  id: string;
  name: string;
  /** the unit price actually charged: item price + every addon on that row */
  price: number;
  qty: number;
  image?: string;
  customizations?: Customization[];
}

export type OrderStatus =
  | 'awaiting-payment'
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'
  | 'payment-failed';

export interface Order {
  /** unique_order_id — the id the customer and every deep link use */
  id: string;
  /** the numeric primary key, needed by /payment/payu/create-order */
  orderId: number;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  statusId: number;
  placedAt: string;
  etaMin: number;
  address?: Address | null;
}

export interface AuthUser {
  id: number;
  name: string;
  phone: string;
  email?: string;
  /** rupees */
  wallet: number;
  defaultAddressId?: number | null;
  avatar?: string | null;
}

export interface Bill {
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  total: number;
}

/** The brand row behind the storefront (/brands?domain=…). */
export interface Brand {
  id: number;
  uniqueId: string;
  name: string;
  description: string;
  logo: string;
  heroImage: string;
  domain: string;
  phone: string;
  whatsapp: string;
}

/** One store under the brand (/brand-locations/{unique_id}). */
export interface StoreLocation {
  id: number;
  restaurantId: number;
  name: string;
  slug: string;
  uniqueSlug: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  phone: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  /** km */
  deliveryRadius: number;
  deliveryCharge: number;
  minOrder: number;
  freeDeliveryAbove: number;
  /** minutes */
  deliveryTime: number;
  taxPercent: number;
  taxEnabled: boolean;
  isActive: boolean;
  isSchedulable: boolean;
  /** 1 = force open, 0 = force closed, null = follow the schedule */
  scheduleOverride: number | null;
  /** day (lowercase, 3-letter) → [openHHMM, closeHHMM]; empty when unknown */
  hours: Record<string, [string, string]>;
  image: string;
}

/** One row of /get-payment-gateways. */
export interface Gateway {
  id: number;
  /** the code sent back as `method` on /place-order — case preserved */
  code: string;
  name: string;
  description: string;
  logo: string;
}
