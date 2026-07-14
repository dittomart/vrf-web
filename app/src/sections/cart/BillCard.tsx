import { Receipt } from 'lucide-react';
import { VRF } from '@/api/_seed';
import { money } from '@/utils/fmt';
import type { CartTotals } from './totals';

/* cart.html — "Bill" card. Every row, label and hint comes from the page's
   render(): the free-delivery hint has three states (gap remaining / unlocked
   / nothing to say). */
export function BillCard({ totals }: { totals: CartTotals }) {
  const { sub, del, tax, total } = totals;
  const gap = VRF.freeDeliveryAbove - sub;
  const hint = del > 0 && gap > 0 ? `Add ${money(gap)} more for FREE delivery` : del === 0 ? "You've unlocked free delivery!" : '';

  return (
    <div className="mt-4 ui-card ui-card-lux card-topline ui-card-pad reveal">
      <div className="sec-head mb-3.5">
        <span className="ichip ichip-green w-8 h-8 rounded-lg">
          <Receipt className="w-4 h-4" />
        </span>
        <p className="eyebrow eyebrow-g">Bill details</p>
      </div>
      <div className="space-y-2.5">
        <div className="krow">
          <span className="text-[var(--ink-2)]">Item total</span>
          <span className="font-semibold" id="b-sub">
            {money(sub)}
          </span>
        </div>
        <div className="krow">
          <span className="text-[var(--ink-2)]">Delivery charge</span>
          <span className="font-semibold" id="b-del">
            {del === 0 ? <span className="text-[var(--green)] font-semibold">FREE</span> : money(del)}
          </span>
        </div>
        <div className="krow">
          <span className="text-[var(--ink-2)]">Taxes &amp; charges (5%)</span>
          <span className="font-semibold" id="b-tax">
            {money(tax)}
          </span>
        </div>
        <div className="border-t border-dashed border-[var(--line)] pt-3 mt-1 krow font-bold text-base">
          <span>To pay</span>
          <span id="b-total" className="display text-lg">
            {money(total)}
          </span>
        </div>
      </div>
      <p id="free-del-hint" className="text-[11px] text-[var(--brand)] font-bold mt-3">
        {hint}
      </p>
      <p className="text-[11px] text-[var(--ink-2)] text-center mt-3">Demo preview · sample menu &amp; prices</p>
    </div>
  );
}
