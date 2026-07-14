/* Shapes mirror assets/js data in the HTML prototype so the seed data ports
   verbatim. Part 2 maps the live API onto these. */

export interface Category {
  id: string;
  name: string;
  /** lucide icon name, kebab-case, exactly as the HTML's data-lucide */
  icon: string;
}

export interface Product {
  id: string;
  cat: string;
  name: string;
  desc: string;
  price: number;
  mrp: number;
  img: string;
  best: boolean;
  ordered: number;
  tags: string[];
}

export interface CartLine {
  id: string;
  qty: number;
}

/** cart is a { [productId]: qty } map, exactly as the prototype stored it */
export type Cart = Record<string, number>;

export interface UserLocation {
  address: string;
  area: string;
  lat: number;
  lng: number;
  serviceable: boolean;
  distanceKm?: number;
}

export interface Address {
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
  id: string;
  name: string;
  price: number;
  qty: number;
}

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered';

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  placedAt: string;
  etaMin: number;
  address?: Address | null;
}

export interface AuthUser {
  name: string;
  phone: string;
  email?: string;
  wallet: number;
}

export interface Bill {
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  total: number;
}
