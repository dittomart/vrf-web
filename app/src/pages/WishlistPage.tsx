import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bookmark, Heart, Star, Zap } from 'lucide-react';

import { SmartImage } from '@/shared/SmartImage';
import { getProduct } from '@/api/queries/catalog';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { toast } from '@/store/appStore';
import { flyToCart } from '@/utils/flyToCart';
import { useReveal } from '@/hooks/useReveal';
import { discountPct, money, prodImg } from '@/utils/fmt';
import type { Product } from '@/types';

/* wishlist.html renders its OWN card template — not the shared prodCard: the
   heart sits top-right, the discount badge moves to bottom-left, the price is
   `script` rather than `display`, and ADD is an inline btn-outline. So this is
   a port of THAT markup, not @/cards/ProductCard. */
function WishlistCard({ p, onRemove }: { p: Product; onRemove: (id: string) => void }) {
  const add = useCartStore((s) => s.add);
  const off = discountPct(p.price, p.mrp);

  return (
    <div className="ui-card card-topline overflow-hidden lift flex flex-col">
      <Link to={`/product/${p.id}`} className="relative block frame">
        <SmartImage src={prodImg(p, 300, 220)} className="w-full h-32 object-cover" alt={p.name} />
        <span className="absolute top-2.5 left-2.5 bg-white/95 rounded-md p-0.5 shadow-sm">
          <span className="veg-dot" />
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            onRemove(p.id);
            toast('Removed from wishlist', 'heart');
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-sm press"
        >
          <Heart className="w-4 h-4 fill-[var(--brand)] text-[var(--brand)]" />
        </button>
        {off > 0 && <span className="absolute bottom-2.5 left-2.5 badge badge-accent shadow-sm">{off}% OFF</span>}
      </Link>

      <div className="p-3.5 flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <Link to={`/product/${p.id}`} className="font-bold text-sm line-clamp-1 flex-1">
            {p.name}
          </Link>
          <span className="shrink-0 flex items-center gap-0.5 text-[10px] font-bold badge badge-gold !py-0.5 !px-1.5">
            <Star className="w-2.5 h-2.5 fill-current" />
            4.8
          </span>
        </div>
        <p className="text-[11px] text-[var(--ink-2)] line-clamp-1 mt-1 flex-1">{p.desc}</p>
        <div className="flex items-end justify-between mt-2.5">
          <div className="tnum leading-none">
            <span className="script text-[18px] text-[var(--green)]">{money(p.price)}</span>
            <span className="text-[11px] text-[var(--ink-2)] line-through ml-1">{money(p.mrp)}</span>
          </div>
          <button
            onClick={(e) => {
              add(p.id);
              toast(`Added ${p.name}`);
              flyToCart(e.currentTarget);
            }}
            className="text-xs btn-outline press font-bold px-3.5 py-1.5 rounded-xl"
          >
            ADD +
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  useReveal();
  const ids = useWishlistStore((s) => s.ids);
  const remove = useWishlistStore((s) => s.remove);

  /* the prototype's getWishlist().map(getProduct).filter(Boolean) */
  const wl = ids.map((id) => getProduct(id)).filter((p): p is Product => !!p);

  return (
    <div className="page-enter pb-28 md:pb-10">
      <header className="appbar">
        <div className="appbar-inner narrow flex items-center gap-3">
          <Link to="/profile" className="ibtn ibtn-ghost shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="appbar-title">Wishlist</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6">
        <div className="reveal mb-4 sec-head">
          <span className="ichip ichip-brand">
            <Heart className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <p className="eyebrow">Saved for later</p>
            <h2 className="sec-title leading-tight">Your favourites</h2>
          </div>
        </div>

        {wl.length > 0 && (
          <div className="reveal mb-5 flex items-center gap-2 flex-wrap">
            <span className="badge badge-accent shadow-sm">
              <Bookmark className="w-3.5 h-3.5" /> {wl.length} saved
            </span>
            <span className="badge badge-green">
              <span className="veg-dot" /> Pure Veg
            </span>
            <span className="badge badge-gold">
              <Zap className="w-3.5 h-3.5" /> Ready to reorder
            </span>
          </div>
        )}

        {wl.length > 0 && (
          <div className="grid-products stagger">
            {wl.map((p) => (
              <WishlistCard key={p.id} p={p} onRemove={remove} />
            ))}
          </div>
        )}

        {wl.length === 0 && (
          <div className="empty-wrap">
            <div className="empty-emoji">
              <Heart className="w-9 h-9 text-[var(--green)]" />
            </div>
            <p className="empty-title">No favourites yet</p>
            <p className="empty-sub">Tap the heart on any dish to save it here for quick ordering.</p>
            <Link to="/category" className="pill pill-green mt-5">
              Explore the menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
