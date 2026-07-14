import { Link } from 'react-router-dom';
import { Flame, Star } from 'lucide-react';
import { SmartImage } from '@/shared/SmartImage';
import { useCartStore } from '@/store/cartStore';
import { toast } from '@/store/appStore';
import { flyToCart } from '@/utils/flyToCart';
import { discountPct, money, prodImg } from '@/utils/fmt';
import type { Product } from '@/types';

/* Section-by-section translation of home.html's prodCard(p) template — the
   same card renders the Bestsellers grid, Recommended grid, category listing
   and wishlist. */
export function ProductCard({ p }: { p: Product }) {
  const add = useCartStore((s) => s.add);
  const off = discountPct(p.price, p.mrp);

  return (
    <div className="ui-card card-topline overflow-hidden flex flex-col lift">
      <Link to={`/product/${p.id}`} className="relative frame block">
        <SmartImage src={prodImg(p, 320, 240)} className="w-full h-32 sm:h-36 object-cover" alt={p.name} />
        <span className="absolute top-2.5 left-2.5 rounded-md p-0.5 bg-white shadow-sm">
          <span className="veg-dot" />
        </span>
        {off > 0 && <span className="absolute top-2.5 right-2.5 badge badge-accent shadow-sm">{off}% OFF</span>}
        {p.best && (
          <span className="absolute bottom-2.5 left-2.5 badge badge-gold shadow-sm">
            <Flame className="w-3 h-3" /> {p.ordered}× ordered
          </span>
        )}
      </Link>

      <div className="p-3.5 flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <Link to={`/product/${p.id}`} className="font-bold text-sm leading-tight line-clamp-1 flex-1">
            {p.name}
          </Link>
          <span className="shrink-0 flex items-center gap-0.5 text-[10px] font-bold badge badge-gold !py-0.5 !px-1.5">
            <Star className="w-2.5 h-2.5 fill-current" />
            4.8
          </span>
        </div>

        <p className="text-[11px] text-[var(--ink-2)] line-clamp-2 mt-1 flex-1 leading-relaxed">{p.desc}</p>

        <div className="flex items-end justify-between mt-2.5 tnum">
          <div className="leading-none">
            <span className="display font-bold text-[16px] text-[var(--green)]">{money(p.price)}</span>
            <span className="text-[11px] text-[var(--ink-2)] line-through ml-1">{money(p.mrp)}</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            add(p.id);
            toast(`Added ${p.name}`);
            flyToCart(e.currentTarget);
          }}
          className="w-full mt-2.5 pill pill-green press justify-center !text-xs !py-2"
        >
          ADD +
        </button>
      </div>
    </div>
  );
}
