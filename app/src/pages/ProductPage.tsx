import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ChefHat,
  Flame,
  Heart,
  PackageCheck,
  Leaf,
  ShoppingBag,
  Sparkles,
  Star,
  Timer,
  Truck,
  Utensils,
  UtensilsCrossed,
} from 'lucide-react';
import { useGetProduct } from '@/api/queries/catalog';
import { ProductGallery } from '@/sections/product/ProductGallery';
import { VariantPicker, type Variant } from '@/sections/product/VariantPicker';
import { FrequentlyBought } from '@/sections/product/FrequentlyBought';
import { AddToCartBar } from '@/sections/product/AddToCartBar';
import { useCartStore, useCartCount } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { toast } from '@/store/appStore';
import { flyToCart } from '@/utils/flyToCart';
import { discountPct, money } from '@/utils/fmt';

/* product.html — the dish page: gallery, headline + trust chips, price block,
   stat tiles, serving-size variants, the frequently-bought rail, the three
   assurance cards, and the fixed add-to-cart bar. */
export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading } = useGetProduct(id);

  const add = useCartStore((s) => s.add);
  const count = useCartCount();

  const wishIds = useWishlistStore((s) => s.ids);
  const toggleWish = useWishlistStore((s) => s.toggle);

  const [qty, setQty] = useState(1);
  const [portion, setPortion] = useState('Regular');
  const [priceMult, setPriceMult] = useState(1);

  const goTimer = useRef<number | null>(null);
  useEffect(() => () => { if (goTimer.current) window.clearTimeout(goTimer.current); }, []);

  const p = product ?? null;
  const saved = p ? wishIds.includes(p.id) : false;
  const unitPrice = p ? Math.round(p.price * priceMult) : 0;

  const onFav = (e: MouseEvent<HTMLButtonElement>) => {
    if (!p) return;
    const nowSaved = toggleWish(p.id);
    e.currentTarget.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }],
      { duration: 300 }
    );
    toast(nowSaved ? 'Saved to wishlist' : 'Removed from wishlist', 'heart');
  };

  const onAdd = (e: MouseEvent<HTMLButtonElement>) => {
    if (!p) return;
    add(p.id, qty);
    flyToCart(e.currentTarget);
    toast(`Added ${qty} × ${p.name}`);
    goTimer.current = window.setTimeout(() => navigate('/cart'), 700);
  };

  const onVariant = (v: Variant) => {
    setPortion(v.n);
    setPriceMult(v.m);
  };

  return (
    <div className="page-enter pb-28">
      {/* product.html scopes a larger veg dot to this page only */}
      <style>{'.veg-dot{width:18px;height:18px;border-width:2px}.veg-dot::after{width:8px;height:8px}'}</style>

      <header className="appbar">
        <div className="appbar-inner flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="ibtn ibtn-ghost shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="appbar-title flex-1 truncate" id="appbar-title">
            {p ? p.name : 'Dish'}
          </h1>
          <Link to="/cart" className="ibtn ibtn-ghost shrink-0 relative">
            <ShoppingBag className="w-5 h-5" />
            <span data-cart-badge className={count === 0 ? 'hidden ibtn-badge' : 'ibtn-badge'}>
              {count}
            </span>
          </Link>
        </div>
      </header>

      {!p ? (
        !isLoading && (
          <div className="empty-wrap">
            <div className="empty-emoji">
              <UtensilsCrossed className="w-9 h-9 text-[var(--brand)]" />
            </div>
            <p className="empty-title">Dish not found</p>
            <p className="empty-sub">This dish is no longer on the menu.</p>
            <Link to="/category" className="pill btn-primary press mt-4">
              Back to the menu
            </Link>
          </div>
        )
      ) : (
        <>
          <div className="max-w-6xl mx-auto px-4 pt-4">
            <div className="product-layout">
              {/* gallery: a contained 4:3 frame, not a full-viewport-height photo */}
              <ProductGallery p={p} />

              <div className="relative anim-fadein min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="badge badge-green mb-2">
                      <span className="veg-dot" /> PURE VEG
                    </div>
                    <h1 id="p-name" className="display text-[26px] font-extrabold leading-tight">
                      {p.name}
                    </h1>
                  </div>
                  <button id="fav" onClick={onFav} className="ibtn shrink-0" aria-pressed={saved}>
                    <Heart
                      className={`w-5 h-5 ${
                        saved ? 'fill-[var(--brand)] text-[var(--brand)]' : 'text-[var(--ink-2)]'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center flex-wrap gap-2 mt-3">
                  <span className="flex items-center gap-1 text-xs font-bold badge badge-gold">
                    <Star className="w-3.5 h-3.5 fill-current" /> 4.8
                  </span>
                  <span
                    className="flex items-center gap-1.5 text-xs font-semibold badge"
                    style={{ background: 'var(--ivory-2)', color: 'var(--ink-2)' }}
                  >
                    <Timer className="w-3.5 h-3.5" /> 35 min
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold badge badge-accent">
                    <Flame className="w-3.5 h-3.5" /> Home-style
                  </span>
                </div>

                <p id="p-desc" className="text-[var(--ink-2)] mt-4 leading-relaxed">
                  {p.desc}
                </p>

                <div className="rule-gold my-5" />

                <div className="flex items-end gap-2.5">
                  <span id="p-price" className="display text-[32px] font-bold tnum text-[var(--green)] leading-none">
                    {money(unitPrice)}
                  </span>
                  <span id="p-mrp" className="text-[var(--ink-2)] line-through mb-0.5 tnum">
                    {money(p.mrp)}
                  </span>
                  <span id="p-off" className="mb-0.5 badge badge-accent">
                    {discountPct(p.price, p.mrp)}% OFF
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="stat-tile !py-2.5">
                    <Truck className="w-4 h-4 mx-auto text-[var(--green)]" />
                    <p className="text-[10px] font-bold mt-1">Free above ₹349</p>
                  </div>
                  <div className="stat-tile !py-2.5">
                    <Flame className="w-4 h-4 mx-auto text-[var(--brand)]" />
                    <p className="text-[10px] font-bold mt-1">Served hot</p>
                  </div>
                  <div className="stat-tile !py-2.5">
                    <Leaf className="w-4 h-4 mx-auto text-[var(--green)]" />
                    <p className="text-[10px] font-bold mt-1">No onion garlic opt.</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2.5">
                  <span className="ichip ichip-brand shrink-0">
                    <Utensils className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="eyebrow eyebrow-g mb-0.5">Serving size</p>
                    <p className="sec-title leading-none">Choose your portion</p>
                  </div>
                </div>

                <VariantPicker price={p.price} portion={portion} onSelect={onVariant} />

                <div className="mt-9">
                  <div className="sec-head mb-3">
                    <span className="ichip ichip-gold shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </span>
                    <div className="shrink-0">
                      <p className="eyebrow eyebrow-g mb-0.5">Pairs well with</p>
                      <p className="sec-title leading-none">Frequently bought together</p>
                    </div>
                  </div>
                  <FrequentlyBought p={p} />
                </div>

                <div className="mt-8 grid grid-cols-3 gap-2.5 text-center pb-6 stagger">
                  <div className="ui-card ui-card-lux py-4">
                    <span className="ichip ichip-green mx-auto mb-1.5">
                      <Leaf className="w-5 h-5" />
                    </span>
                    <p className="text-[11px] font-bold">100% Veg</p>
                  </div>
                  <div className="ui-card ui-card-lux py-4">
                    <span className="ichip ichip-brand mx-auto mb-1.5">
                      <ChefHat className="w-5 h-5" />
                    </span>
                    <p className="text-[11px] font-bold">Made fresh</p>
                  </div>
                  <div className="ui-card ui-card-lux py-4">
                    <span className="ichip ichip-gold mx-auto mb-1.5">
                      <PackageCheck className="w-5 h-5" />
                    </span>
                    <p className="text-[11px] font-bold">Hygienic pack</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AddToCartBar
            qty={qty}
            total={unitPrice * qty}
            onDec={() => setQty((q) => (q > 1 ? q - 1 : q))}
            onInc={() => setQty((q) => q + 1)}
            onAdd={onAdd}
          />
        </>
      )}
    </div>
  );
}
