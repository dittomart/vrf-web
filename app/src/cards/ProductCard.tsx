import { Link } from 'react-router-dom';
import { Flame, Plus, Star } from 'lucide-react';
import { SmartImage } from '@/shared/SmartImage';
import { useCartStore } from '@/store/cartStore';
import { toast } from '@/store/appStore';
import { flyToCart } from '@/utils/flyToCart';
import { money } from '@/utils/fmt';
import { getDisplayPrice } from '@/utils/productPricing';
import type { Product } from '@/types';

/* home.html's prodCard(p). The price is whatever the customer can actually pay
   the least of — for a dish sold by portion that is the cheapest portion, not
   the item row's ₹0. ADD buys exactly that. */
export function ProductCard({ p }: { p: Product }) {
  const add = useCartStore((s) => s.add);
  const { price, oldPrice, discountPercent } = getDisplayPrice(p);
  const off = discountPercent ?? 0;

  return (
    <div className="dish-card lift">
      <Link to={`/product/${p.id}`} className="relative frame block dish-media">
        <SmartImage src={p.img} className="w-full h-36 object-cover" alt={p.name} />
        <span className="dish-scrim" aria-hidden="true" />

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

        <button
          onClick={(e) => {
            e.preventDefault();
            add(p);
            toast(`Added ${p.name}`);
            flyToCart(e.currentTarget);
          }}
          className="dish-add press absolute -bottom-5 right-4 z-10"
          aria-label={`Add ${p.name}`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </Link>

      <div className="px-4 pt-4 pb-3.5">
        <Link
          to={`/product/${p.id}`}
          className="display font-semibold text-[15px] leading-tight line-clamp-1 block"
        >
          {p.name}
        </Link>
        <p className="text-[11px] text-[var(--ink-2)] line-clamp-1 mt-1 leading-relaxed">
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
