import type { Product } from '@/types';

/** ₹1,234 — the prototype's money() helper, verbatim. */
export function money(n: number): string {
  return '₹' + Number(Math.round(n)).toLocaleString('en-IN');
}

/** The dish photo. Sizes came from the stock-photo CDN the prototype used; the
    real image is whatever the kitchen uploaded, so they no longer apply. */
export function prodImg(p: Product): string {
  return p.img;
}

/** Discount off the old price, rounded. 0 when there is no old price to beat. */
export function discountPct(price: number, mrp: number): number {
  if (!mrp || mrp <= price) return 0;
  return Math.round((1 - price / mrp) * 100);
}
