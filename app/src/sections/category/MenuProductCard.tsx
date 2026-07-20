import { Link } from 'react-router-dom';
import { Flame, Plus, Star } from 'lucide-react';
import { SmartImage } from '@/shared/SmartImage';
import { useCartStore, useProductQty } from '@/store/cartStore';
import { toast } from '@/store/appStore';
import { flyToCart } from '@/utils/flyToCart';
import { money } from '@/utils/fmt';
import { defaultCustomizations, getDisplayPrice, lineIdOf } from '@/utils/productPricing';
import type { Product } from '@/types';

/* category.html ships its own card: the bestseller ribbon across the photo, the
   "Save N%" badge, the script-face price, and the ADD → stepper swap.

   The stepper drives the line this card created — the dish with its cheapest
   portion. A different portion of the same dish, chosen on the product page, is
   its own line and its own row in the cart. */
export function MenuProductCard({ p }: { p: Product }) {
  const add = useCartStore((s) => s.add);
  const setQty = useCartStore((s) => s.setQty);
  const q = useProductQty(p.id);

  const { price, oldPrice, discountPercent } = getDisplayPrice(p);
  const off = discountPercent ?? 0;
  const lineId = lineIdOf(p.id, defaultCustomizations(p));

  return (
    <div className="dish-card lift">
      <Link to={`/product/${p.id}`} className="relative frame block dish-media">
        <SmartImage src={p.img} className="w-full h-36 object-cover" alt={p.name} />
        <span className="dish-scrim" aria-hidden="true" />

        {/* top-row badges */}
        <span className="absolute top-3 left-3 flex items-center gap-1.5">
          {p.isVeg && (
            <span className="rounded-md p-0.5 bg-white shadow-sm">
              <span className="veg-dot" />
            </span>
          )}
          {p.best && (
            <span className="dish-chip dish-chip-gold">
              <Flame className="w-3 h-3" /> Bestseller
            </span>
          )}
          {p.isNew && !p.best && (
            <span className="dish-chip dish-chip-gold">
              <Star className="w-2.5 h-2.5 fill-current" /> New
            </span>
          )}
        </span>
        {off > 0 && (
          <span className="absolute top-3 right-3 dish-chip dish-chip-accent">{off}% OFF</span>
        )}

        {/* the round ADD/stepper floats over the photo's bottom-right corner */}
        <div data-add={p.id} className="absolute -bottom-4 right-3 sm:-bottom-5 sm:right-4 z-10">
          {q === 0 ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                add(p);
                toast('Added');
                flyToCart(e.currentTarget);
              }}
              className="dish-add press"
              aria-label={`Add ${p.name}`}
            >
              <Plus className="w-5 h-5" />
            </button>
          ) : (
            <div className="dish-step anim-scalein">
              <button aria-label="Decrease" onClick={(e) => { e.preventDefault(); setQty(lineId, q - 1); }} className="press">
                −
              </button>
              <span className="tnum">{q}</span>
              <button aria-label="Increase" onClick={(e) => { e.preventDefault(); setQty(lineId, q + 1); }} className="press">
                +
              </button>
            </div>
          )}
        </div>
      </Link>

      <div className="px-4 pt-4 pb-3.5">
        <Link
          to={`/product/${p.id}`}
          className="display font-semibold text-[15px] leading-tight line-clamp-1 block"
        >
          {p.name}
        </Link>
        <p className="text-xs text-[var(--ink-2)] line-clamp-1 mt-1 leading-relaxed">
          {p.desc || 'Freshly made to order'}
        </p>

        <div className="flex items-center gap-2 mt-2.5 tnum">
          <span className="dish-price">{money(price)}</span>
          {oldPrice ? (
            <span className="text-[12px] text-[var(--ink-2)] line-through">{money(oldPrice)}</span>
          ) : null}
          {off > 0 && <span className="dish-save">Save {off}%</span>}
        </div>
      </div>
    </div>
  );
}
