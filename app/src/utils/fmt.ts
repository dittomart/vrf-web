import { IMG } from '@/api/_seed';
import type { Product } from '@/types';

/** ₹1,234 — the prototype's money() helper, verbatim. */
export function money(n: number): string {
  return '₹' + Number(n).toLocaleString('en-IN');
}

/** Unsplash photo URL, same params the prototype used. */
export function imgUrl(id: string, w = 400, h = 300): string {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=entropy&auto=format&q=75`;
}

/** Product photo — the per-id override map wins over the product's own img. */
export function prodImg(p: Product, w = 400, h = 300): string {
  return imgUrl(IMG[p.id] || p.img, w, h);
}

/** Discount percentage off MRP, rounded — as the product cards show it. */
export function discountPct(price: number, mrp: number): number {
  return Math.round((1 - price / mrp) * 100);
}
