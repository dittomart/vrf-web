import { Link } from 'react-router-dom';
import { useGetCatalog } from '@/api/queries/catalog';
import { SmartImage } from '@/shared/SmartImage';
import { useCartStore } from '@/store/cartStore';
import { toast } from '@/store/appStore';
import { flyToCart } from '@/utils/flyToCart';
import { money } from '@/utils/fmt';
import { getDisplayPrice } from '@/utils/productPricing';
import type { Product } from '@/types';

/* product.html — "Frequently bought together". The prototype hardcoded the
   sides categories; the real menu has whatever categories the kitchen made, so
   the rail offers the cheapest dishes from OTHER categories — the things people
   actually add on top of a main. The id stays #fbt: theme.css sizes the rail's
   children off it. */
export function FrequentlyBought({ p }: { p: Product }) {
  const { data: catalog } = useGetCatalog();
  const add = useCartStore((s) => s.add);

  const fbt = (catalog?.flat ?? [])
    .filter((x) => x.id !== p.id && x.cat !== p.cat)
    .sort((a, b) => getDisplayPrice(a).price - getDisplayPrice(b).price)
    .slice(0, 5);

  if (fbt.length === 0) return null;

  return (
    <div className="rail-wrap">
      <div id="fbt" className="rail -mx-1 px-1 pb-1">
        {fbt.map((x) => (
        <div key={x.id} className="shrink-0 w-32 ui-card p-2.5 lift">
          <Link to={`/product/${x.id}`} className="frame block rounded-xl">
            <SmartImage src={x.img} className="w-full h-16 object-cover rounded-xl" alt={x.name} />
          </Link>
          <p className="text-xs font-bold mt-2 line-clamp-1">{x.name}</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-bold tnum text-[var(--green)]">
              {money(getDisplayPrice(x).price)}
            </span>
            <button
              onClick={(e) => {
                add(x);
                toast(`Added ${x.name}`);
                flyToCart(e.currentTarget);
              }}
              className="w-7 h-7 rounded-full btn-accent text-white text-sm font-bold press flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}
