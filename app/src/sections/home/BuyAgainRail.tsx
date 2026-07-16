import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { useGetCatalog } from '@/api/queries/catalog';
import { useGetOrders } from '@/api/queries/useOrders';
import { SmartImage } from '@/shared/SmartImage';
import { useCartStore } from '@/store/cartStore';
import { toast } from '@/store/appStore';
import { flyToCart } from '@/utils/flyToCart';
import { money } from '@/utils/fmt';
import { getDisplayPrice } from '@/utils/productPricing';

/* home.html's #buy-again rail, fed by the customer's real order history.

   Each previously-ordered item is looked up in the live menu so it reorders at
   TODAY's price and today's variant — the price frozen on the old order row is
   history, not an offer. A dish that has since left the menu simply drops out of
   the rail rather than adding an unbuyable line to the cart. */
export function BuyAgainRail() {
  const { orders } = useGetOrders();
  const { data: catalog } = useGetCatalog();
  const add = useCartStore((s) => s.add);

  const ids = [...new Set(orders.flatMap((o) => o.items.map((i) => i.id)))].slice(0, 8);
  const items = ids
    .map((id) => catalog?.flat.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .slice(0, 6);

  if (items.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="flex items-end justify-between reveal gap-3">
        <div className="min-w-0 flex items-center gap-3">
          <span className="ichip ichip-gold shrink-0">
            <RotateCcw className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <p className="eyebrow">Quick reorder</p>
            <h2 className="display text-[24px] font-semibold leading-tight mt-0.5">Buy again</h2>
          </div>
        </div>
        <Link
          to="/orders"
          className="shrink-0 text-sm font-semibold text-[var(--green)] press flex items-center gap-1"
        >
          History <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2" id="buy-again">
        {items.map((p) => (
          <div key={p.id} className="shrink-0 w-32 card rounded-[18px] p-2.5 lift">
            <div className="frame rounded-xl">
              <SmartImage src={p.img} className="w-full h-20 object-cover rounded-xl" alt={p.name} />
            </div>
            <p className="text-xs font-semibold mt-2 line-clamp-1">{p.name}</p>
            <p className="text-xs font-semibold tnum">{money(getDisplayPrice(p).price)}</p>
            <button
              onClick={(e) => {
                add(p);
                toast('Reordered', 'rotate-ccw');
                flyToCart(e.currentTarget);
              }}
              className="w-full mt-1.5 btn-primary text-[11px] font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1 press"
            >
              <RotateCcw className="w-3 h-3" /> Reorder
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
