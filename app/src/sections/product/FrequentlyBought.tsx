import { Link } from 'react-router-dom';
import { PRODUCTS } from '@/api/_seed';
import { SmartImage } from '@/shared/SmartImage';
import { useCartStore } from '@/store/cartStore';
import { toast } from '@/store/appStore';
import { flyToCart } from '@/utils/flyToCart';
import { money, prodImg } from '@/utils/fmt';
import type { Product } from '@/types';

/* product.html — "Frequently bought together": the sides rail. The prototype
   picks the first five breads / beverages / desserts that are not this dish.
   The id stays #fbt — theme.css sizes the rail's children off it. */
export function FrequentlyBought({ p }: { p: Product }) {
  const add = useCartStore((s) => s.add);

  const fbt = PRODUCTS.filter(
    (x) => x.id !== p.id && (x.cat === 'breads' || x.cat === 'beverages' || x.cat === 'desserts')
  ).slice(0, 5);

  return (
    <div id="fbt" className="rail -mx-1 px-1 pb-1">
      {fbt.map((x) => (
        <div key={x.id} className="shrink-0 w-32 ui-card p-2.5 lift">
          <Link to={`/product/${x.id}`} className="frame block rounded-xl">
            <SmartImage src={prodImg(x, 200, 150)} className="w-full h-16 object-cover rounded-xl" alt={x.name} />
          </Link>
          <p className="text-xs font-bold mt-2 line-clamp-1">{x.name}</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-bold tnum text-[var(--green)]">{money(x.price)}</span>
            <button
              onClick={(e) => {
                add(x.id);
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
  );
}
