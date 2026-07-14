import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { useBuyAgain } from '@/api/queries/catalog';
import { SmartImage } from '@/shared/SmartImage';
import { useCartStore } from '@/store/cartStore';
import { toast } from '@/store/appStore';
import { flyToCart } from '@/utils/flyToCart';
import { money, prodImg } from '@/utils/fmt';

/* home.html's #buy-again horizontal rail — order history when there is any,
   else the demo seed. Reorder adds to the cart and toasts with rotate-ccw. */
export function BuyAgainRail() {
  const items = useBuyAgain();
  const add = useCartStore((s) => s.add);

  return (
    <section className="mt-12">
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
              <SmartImage
                src={prodImg(p, 220, 170)}
                className="w-full h-20 object-cover rounded-xl"
                alt={p.name}
              />
            </div>
            <p className="text-xs font-semibold mt-2 line-clamp-1">{p.name}</p>
            <p className="text-xs font-semibold tnum">{money(p.price)}</p>
            <button
              onClick={(e) => {
                add(p.id);
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
