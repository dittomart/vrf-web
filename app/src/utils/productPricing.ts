import type { AddonGroup, Customization, Product } from '@/types';

export interface DisplayPriceInfo {
  price: number;
  /** true when the price came from the cheapest variant, not the item row */
  fromVariant: boolean;
  oldPrice: number | null;
  discountPercent: number | null;
}

export function singleGroups(p: Product): AddonGroup[] {
  return p.addonGroups.filter((g) => g.type === 'SINGLE' && g.options.length > 0);
}

export function multipleGroups(p: Product): AddonGroup[] {
  return p.addonGroups.filter((g) => g.type === 'MULTIPLE' && g.options.length > 0);
}

/** The one place a card, the PDP, a rail or a reorder row resolves "the price".

    A variant-priced item (a curry sold as "1 Bowl" / "2 Bowls") carries price 0
    on the item row and the real money on its addons, so the item price alone
    would render ₹0. When the item has SINGLE groups, the cheapest reachable
    combination IS the price — that is what the customer can actually pay. */
export function getDisplayPrice(p: Product): DisplayPriceInfo {
  const singles = singleGroups(p);

  let price = p.price;
  let fromVariant = false;

  if (singles.length > 0) {
    let total = 0;
    let any = false;
    for (const g of singles) {
      const min = Math.min(...g.options.map((o) => o.price));
      if (Number.isFinite(min)) {
        total += min;
        any = true;
      }
    }
    // A total of 0 is still trusted when a group contributed it: a free variant
    // is a real, reachable price — falling back to p.price would shadow it.
    if (any && Number.isFinite(total) && total > 0) {
      price = total;
      fromVariant = true;
    } else if (any && Number.isFinite(total) && p.price === 0) {
      price = total;
      fromVariant = true;
    }
  }

  const oldPrice = p.mrp > 0 && p.mrp > price ? p.mrp : null;
  const discountPercent = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;

  return { price, fromVariant, oldPrice, discountPercent };
}

/** The cheapest option of every SINGLE group — what a one-tap ADD button buys. */
export function defaultCustomizations(p: Product): Customization[] {
  return singleGroups(p).map((g) => {
    const cheapest = g.options.reduce((a, b) => (b.price < a.price ? b : a));
    return {
      groupId: g.id,
      groupName: g.name,
      addonId: cheapest.id,
      addonName: cheapest.name,
      price: cheapest.price,
    };
  });
}

/** unit price = (variant total, when there is one, else the item price) + extras.

    Mirrors the backend's own fold: it prices a line as item price + Σ addon
    price, and a variant-priced item is exactly the case where the item price is
    0 and the variant carries the cost. */
export function computeUnitPrice(p: Product, chosen: Customization[]): number {
  const singleIds = new Set(singleGroups(p).map((g) => g.id));

  let variants = 0;
  let extras = 0;
  for (const c of chosen) {
    if (singleIds.has(c.groupId)) variants += c.price;
    else extras += c.price;
  }

  const base = variants > 0 ? variants : p.price > 0 ? p.price : getDisplayPrice(p).price;
  return base + extras;
}

/** Stable merge key: the same dish with the same choices is one cart line. */
export function lineIdOf(productId: string, chosen: Customization[]): string {
  const key = chosen
    .map((c) => `${c.groupId}:${c.addonId}`)
    .sort()
    .join('|');
  return key ? `${productId}#${key}` : productId;
}
