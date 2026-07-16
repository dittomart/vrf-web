import { useGetCatalog } from '@/api/queries/catalog';
import { SmartImage } from '@/shared/SmartImage';
import { money } from '@/utils/fmt';
import { getDisplayPrice } from '@/utils/productPricing';
import { useCartStore } from '@/store/cartStore';
import { toast } from '@/store/appStore';
import type { CartLine } from '@/types';

/* cart.html — "Complete your meal" (#fbt). theme.css sizes the cards with
   `#fbt>*{width:9.5rem}`, so the id is load-bearing and must stay.

   The prototype hardcoded which categories count as add-ons; the real menu is
   whatever the kitchen built, so the rail offers the cheapest dishes that are
   not already in the basket. */
export function AddOnRail({ lines }: { lines: CartLine[] }) {
  const { data: catalog } = useGetCatalog();
  const add = useCartStore((s) => s.add);

  const inCart = new Set(lines.map((l) => l.productId));
  const fbt = (catalog?.flat ?? [])
    .filter((p) => !inCart.has(p.id))
    .sort((a, b) => getDisplayPrice(a).price - getDisplayPrice(b).price)
    .slice(0, 6);

  if (fbt.length === 0) return null;

  return (
    <div id="fbt" className="rail -mx-1 px-1">
      {fbt.map((x) => (
        <div key={x.id} className="shrink-0 w-28 ui-card p-2 lift">
          <div className="frame rounded-xl">
            <SmartImage src={x.img} className="w-full h-16 object-cover rounded-xl" alt={x.name} />
          </div>
          <p className="text-[11px] font-bold mt-1.5 line-clamp-1">{x.name}</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] font-bold tnum text-[var(--green)]">
              {money(getDisplayPrice(x).price)}
            </span>
            <button
              onClick={() => {
                add(x);
                toast('Added');
              }}
              className="w-7 h-7 rounded-full btn-accent text-white text-sm font-bold press flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
