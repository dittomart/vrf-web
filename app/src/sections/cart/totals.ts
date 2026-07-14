import { VRF } from '@/api/_seed';

export interface CartTotals {
  sub: number;
  del: number;
  tax: number;
  total: number;
}

/* cart.html's calc(), with the coupon leg removed:
     del   = sub >= VRF.freeDeliveryAbove ? 0 : (sub > 0 ? VRF.deliveryCharge : 0)
     tax   = round(sub * 0.05)
     total = sub + del + tax                                                  */
export function calcTotals(sub: number): CartTotals {
  const del = sub >= VRF.freeDeliveryAbove ? 0 : sub > 0 ? VRF.deliveryCharge : 0;
  const tax = Math.round(sub * 0.05);
  return { sub, del, tax, total: sub + del + tax };
}
