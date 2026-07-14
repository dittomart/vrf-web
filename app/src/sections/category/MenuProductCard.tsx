import { Link } from 'react-router-dom';
import { Flame, Plus, Star } from 'lucide-react';
import { SmartImage } from '@/shared/SmartImage';
import { useCartStore } from '@/store/cartStore';
import { toast } from '@/store/appStore';
import { flyToCart } from '@/utils/flyToCart';
import { discountPct, money, prodImg } from '@/utils/fmt';
import type { Product } from '@/types';

/* category.html ships its OWN card()/stepper() templates — visibly different
   from the shared ProductCard: a bestseller gradient ribbon across the photo,
   a "Save N%" badge next to the price, the script-face price, and an inline
   ADD → quantity-bar swap instead of a plain ADD pill. Ported as-is. */
export function MenuProductCard({ p }: { p: Product }) {
  const cart = useCartStore((s) => s.cart);
  const add = useCartStore((s) => s.add);
  const setQty = useCartStore((s) => s.setQty);

  const off = discountPct(p.price, p.mrp);
  const q = cart[p.id] || 0;

  return (
    <div className="ui-card card-topline overflow-hidden flex flex-col lift">
      <Link to={`/product/${p.id}`} className="relative frame block">
        <SmartImage src={prodImg(p, 300, 220)} className="w-full h-32 object-cover" alt={p.name} />
        <span className="absolute top-2.5 left-2.5 rounded-md p-0.5 bg-white shadow-sm">
          <span className="veg-dot" />
        </span>
        {off > 0 && <span className="absolute top-2.5 right-2.5 badge badge-accent shadow-sm">{off}% OFF</span>}
        {p.best && (
          <span className="absolute bottom-0 left-0 bg-gradient-to-r from-[var(--brand)] to-transparent text-white text-[10px] font-bold px-2.5 py-1 tracking-wide flex items-center gap-1">
            <Flame className="w-3 h-3 fill-current" /> BESTSELLER · {p.ordered}×
          </span>
        )}
      </Link>

      <div className="p-3 flex flex-col flex-1">
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

        <div className="flex items-end justify-between mt-2.5">
          <div className="tnum leading-none">
            <span className="script text-[18px] text-[var(--green)]">{money(p.price)}</span>
            <span className="text-[11px] text-[var(--ink-2)] line-through ml-1">{money(p.mrp)}</span>
          </div>
          {off > 0 && <span className="badge badge-green !py-0.5 !px-1.5 text-[10px] font-bold">Save {off}%</span>}
        </div>

        <div data-add={p.id} className="mt-2.5">
          {/* Adding to cart is THE primary action on a card, so it wears the brand
              green — not the brass accent, which is reserved for decoration. */}
          {q === 0 ? (
            <button
              onClick={(e) => {
                add(p.id);
                toast('Added');
                flyToCart(e.currentTarget);
              }}
              className="btn-add press"
            >
              ADD <Plus className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="qty-bar anim-scalein">
              <button aria-label="Decrease" onClick={() => setQty(p.id, q - 1)} className="press">
                −
              </button>
              <span className="tnum">{q}</span>
              <button aria-label="Increase" onClick={() => setQty(p.id, q + 1)} className="press">
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
