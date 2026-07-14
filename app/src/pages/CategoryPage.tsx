import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '@/api/_seed';
import { MenuHero } from '@/sections/category/MenuHero';
import { CategoryChips } from '@/sections/category/CategoryChips';
import { FilterBar, type SortKey } from '@/sections/category/FilterBar';
import { MenuProductCard } from '@/sections/category/MenuProductCard';
import { StickyCart } from '@/shared/StickyCart';
import { useCartCount } from '@/store/cartStore';
import { useReveal } from '@/hooks/useReveal';

/* category.html — the full menu: hero panel, category rail, sort/filter bar,
   then the filtered grid. The prototype's render() is a pure function of
   (activeCat, sort, onlyBest, query), so it becomes a useMemo. */
export default function CategoryPage() {
  useReveal();

  const [params, setParams] = useSearchParams();
  const activeCat = params.get('cat') || 'all';

  const [sort, setSort] = useState<SortKey>('pop');
  const [onlyBest, setOnlyBest] = useState(false);
  const [query, setQuery] = useState('');

  const count = useCartCount();

  const items = useMemo(() => {
    let list = PRODUCTS.slice();
    if (activeCat !== 'all') list = list.filter((p) => p.cat === activeCat);
    if (onlyBest) list = list.filter((p) => p.best);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    if (sort === 'low') list.sort((a, b) => a.price - b.price);
    else if (sort === 'high') list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => b.ordered - a.ordered);
    return list;
  }, [activeCat, onlyBest, query, sort]);

  const cat = CATEGORIES.find((c) => c.id === activeCat);
  const title = cat ? cat.name : 'Full Menu';

  const selectCat = (id: string) => {
    if (id === 'all') setParams({}, { replace: true });
    else setParams({ cat: id }, { replace: true });
  };

  return (
    <div className="page-enter pb-28 md:pb-10">
      <header className="appbar">
        <div className="appbar-inner">
          <div className="flex items-center gap-2.5">
            <Link to="/home" className="ibtn ibtn-ghost shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <label className="appbar-search">
              <Search className="w-4 h-4 text-[var(--green)] shrink-0" />
              <input
                id="search"
                placeholder="Search the menu…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <Link to="/cart" className="ibtn relative shrink-0">
              <ShoppingBag className="w-5 h-5" />
              <span data-cart-badge className={count === 0 ? 'hidden ibtn-badge' : 'ibtn-badge'}>
                {count}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* ============ MENU HERO — photo-textured brand panel ============ */}
      <MenuHero title={title} count={items.length} />

      {/* CATEGORY RAIL */}
      <CategoryChips active={activeCat} onSelect={selectCat} />

      {/* FILTER BAR */}
      <FilterBar
        sort={sort}
        onSort={setSort}
        onlyBest={onlyBest}
        onToggleBest={() => setOnlyBest((b) => !b)}
      />

      {/* COUPON TICKET */}

      <main className="max-w-6xl mx-auto px-4">
        <div className="sec-head reveal mb-5">
          <span className="ichip ichip-green shrink-0">
            <UtensilsCrossed className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <p className="eyebrow eyebrow-g mb-0.5">Now serving</p>
            <h2 id="cat-title" className="sec-title leading-tight">
              {title}
            </h2>
            <p id="cat-count" className="text-sm text-[var(--ink-2)]">
              {items.length} pure-veg dishes
            </p>
          </div>
        </div>

        <div id="list" className="grid-products stagger">
          {items.map((p) => (
            <MenuProductCard key={p.id} p={p} />
          ))}
        </div>

        {items.length === 0 && (
          <div id="empty" className="empty-wrap">
            <div className="empty-emoji">
              <UtensilsCrossed className="w-9 h-9 text-[var(--brand)]" />
            </div>
            <p className="empty-title">No dishes found</p>
            <p className="empty-sub">Try a different search or category.</p>
          </div>
        )}
      </main>

      <StickyCart />
    </div>
  );
}
