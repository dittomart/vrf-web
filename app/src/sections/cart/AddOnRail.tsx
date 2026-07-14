import { PRODUCTS } from '@/api/_seed';
import { SmartImage } from '@/shared/SmartImage';
import { money, prodImg } from '@/utils/fmt';
import { useCartStore } from '@/store/cartStore';
import { toast } from '@/store/appStore';
import type { Cart } from '@/types';

/* cart.html — "Complete your meal" (#fbt). theme.css sizes the cards with
   `#fbt>*{width:9.5rem}`, so the id is load-bearing and must stay. */
export function AddOnRail({ cart }: { cart: Cart }) {
  const add = useCartStore((s) => s.add);

  const fbt = PRODUCTS.filter(
    (x) => !cart[x.id] && (x.cat === 'beverages' || x.cat === 'desserts' || x.cat === 'breads')
  ).slice(0, 6);

  return (
    <div id="fbt" className="rail -mx-1 px-1">
      {fbt.map((x) => (
        <div key={x.id} className="shrink-0 w-28 ui-card p-2 lift">
          <div className="frame rounded-xl">
            <SmartImage
              src={prodImg(x, 150, 120)}
              className="w-full h-16 object-cover rounded-xl"
              alt={x.name}
            />
          </div>
          <p className="text-[11px] font-bold mt-1.5 line-clamp-1">{x.name}</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] font-bold tnum text-[var(--green)]">{money(x.price)}</span>
            <button
              onClick={() => {
                add(x.id);
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
