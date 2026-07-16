import { SmartImage } from '@/shared/SmartImage';
import { money } from '@/utils/fmt';
import { useCartStore } from '@/store/cartStore';
import type { CartLine } from '@/types';

/* cart.html — one row of #cart-items. The row now shows the portion/extras the
   customer chose, because two rows of the same dish at different prices are
   otherwise indistinguishable. */
export function CartItemRow({ line }: { line: CartLine }) {
  const setQty = useCartStore((s) => s.setQty);
  const chosen = line.customizations.map((c) => c.addonName).filter(Boolean).join(', ');

  return (
    <div className="ui-card lift p-3 flex gap-3.5 items-center">
      <div className="frame rounded-xl shrink-0 relative">
        <SmartImage
          src={line.image}
          className="w-[68px] h-[68px] rounded-xl object-cover"
          alt={line.name}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm leading-snug line-clamp-1">{line.name}</p>
        {chosen ? (
          <p className="text-xs text-[var(--ink-2)] line-clamp-1 mt-0.5">{chosen}</p>
        ) : null}
        <p className="text-[11px] text-[var(--ink-2)] tnum mt-1">{money(line.unitPrice)} each</p>
      </div>
      {/* price + stepper travel together, right-aligned */}
      <div className="shrink-0 flex flex-col items-end gap-2">
        <p className="display font-bold text-base tnum leading-none">
          {money(line.unitPrice * line.qty)}
        </p>
        <div className="stepper">
          <button aria-label="Decrease" onClick={() => setQty(line.lineId, line.qty - 1)}>
            −
          </button>
          <span className="min-w-[20px] text-center tnum">{line.qty}</span>
          <button aria-label="Increase" onClick={() => setQty(line.lineId, line.qty + 1)}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}
