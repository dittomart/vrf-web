import { Receipt } from 'lucide-react';
import { money } from '@/utils/fmt';
import type { OrderTotals } from '@/hooks/useOrderTotals';

/* cart.html — the "Bill" card. Every number here comes from the store:
   the delivery fee is quoted by /get-deliverable-amount against the delivery
   address, and the tax line is the store's own rate — it is hidden entirely when
   the kitchen charges none, rather than showing a made-up 5%. */
export function BillCard({ totals }: { totals: OrderTotals }) {
  const {
    subtotal,
    deliveryFee,
    deliveryFeeKnown,
    distanceKm,
    taxPercent,
    tax,
    total,
    minOrder,
    belowMin,
    isLoading,
  } = totals;

  const freeAboveHint =
    deliveryFeeKnown && deliveryFee === 0 && subtotal > 0 ? 'Free delivery on this order' : '';

  return (
    <div className="ui-card ui-card-lux card-topline ui-card-pad reveal">
      <div className="sec-head mb-4">
        <span className="ichip ichip-green w-8 h-8 rounded-lg">
          <Receipt className="w-4 h-4" />
        </span>
        <p className="eyebrow eyebrow-g">Bill details</p>
      </div>

      <div className="space-y-2.5">
        <div className="krow">
          <span className="text-[var(--ink-2)] min-w-0">Item total</span>
          <span className="font-semibold shrink-0 tnum" id="b-sub">
            {money(subtotal)}
          </span>
        </div>

        <div className="krow">
          <span className="text-[var(--ink-2)] min-w-0">
            Delivery charge
            {distanceKm != null ? ` (${distanceKm.toFixed(1)} km)` : ''}
          </span>
          <span className="font-semibold shrink-0 tnum" id="b-del">
            {isLoading ? (
              <span className="text-[var(--ink-2)]">…</span>
            ) : !deliveryFeeKnown ? (
              /* the fee is quoted against the delivery address, which needs an
                 account — showing ₹0 here would read as free delivery */
              <span className="text-[var(--ink-2)] font-medium text-xs">at checkout</span>
            ) : deliveryFee === 0 ? (
              <span className="text-[var(--green)] font-semibold">FREE</span>
            ) : (
              money(deliveryFee)
            )}
          </span>
        </div>

        {tax > 0 && (
          <div className="krow">
            <span className="text-[var(--ink-2)] min-w-0">Taxes &amp; charges ({taxPercent}%)</span>
            <span className="font-semibold shrink-0 tnum" id="b-tax">
              {money(tax)}
            </span>
          </div>
        )}

        <div className="border-t border-dashed border-[var(--line)] pt-3 mt-1 krow font-bold text-base">
          <span className="min-w-0">{deliveryFeeKnown ? 'To pay' : 'Subtotal'}</span>
          <span id="b-total" className="display text-lg shrink-0 tnum">
            {money(total)}
          </span>
        </div>
      </div>

      {!deliveryFeeKnown && subtotal > 0 ? (
        <p className="text-[11px] text-[var(--ink-2)] mt-3">
          Delivery is priced against your address — log in and pick one to see the final total.
        </p>
      ) : null}

      {belowMin ? (
        <p className="text-[11px] text-[var(--brand)] font-bold mt-3">
          Add {money(minOrder - subtotal)} more to reach the {money(minOrder)} minimum order
        </p>
      ) : freeAboveHint ? (
        <p id="free-del-hint" className="text-[11px] text-[var(--brand)] font-bold mt-3">
          {freeAboveHint}
        </p>
      ) : null}
    </div>
  );
}
