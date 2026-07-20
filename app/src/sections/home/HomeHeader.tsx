import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MapPin, Search, ShoppingBag, Timer, User } from 'lucide-react';
import { useStickyBar } from '@/hooks/useStickyBar';
import { useCartCount } from '@/store/cartStore';
import { useLocationStore } from '@/store/locationStore';
import { useBrandInfo } from '@/hooks/useBrandInfo';
import { useGetCatalog } from '@/api/queries/catalog';

/* home.html's <header class="appbar"> — logo tile, "Delivering to" chip, the
   search pill with its rotating placeholder, cart and profile buttons.

   The placeholder cycles through dishes that are actually on the menu, so it
   never advertises something the kitchen does not sell. */
export function HomeHeader() {
  const stuck = useStickyBar();
  const n = useCartCount();
  const location = useLocationStore((s) => s.location);
  const brand = useBrandInfo();
  const { data: catalog } = useGetCatalog();

  const words = (catalog?.flat ?? []).slice(0, 5).map((p) => p.name.toLowerCase());

  const [wi, setWi] = useState(0);
  const [visible, setVisible] = useState(true);
  const swapTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (words.length < 2) return;
    const iv = window.setInterval(() => {
      setVisible(false);
      swapTimer.current = window.setTimeout(() => {
        setWi((i) => (i + 1) % words.length);
        setVisible(true);
      }, 250);
    }, 2400);

    return () => {
      window.clearInterval(iv);
      if (swapTimer.current) window.clearTimeout(swapTimer.current);
    };
  }, [words.length]);

  const typed = words.length > 0 ? `Search ${words[wi % words.length]}…` : 'Search the menu…';

  const parts = (location?.address ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const area = parts.slice(0, 2).join(', ') || location?.address || 'Your area';

  return (
    <header className={stuck ? 'appbar is-stuck' : 'appbar'}>
      <div className="max-w-6xl mx-auto px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link to="/home" className="logo-tile w-11 h-11 shadow-sm shrink-0 press">
            <img src={brand.logo} alt={brand.brand} />
          </Link>

          <Link
            to="/location"
            className="hidden sm:flex flex-col justify-center min-w-0 press text-left gap-[3px] leading-none shrink-0 max-w-[160px]"
          >
            <span className="flex items-center gap-1 text-[11px] font-bold tracking-[.14em] uppercase text-[var(--brand)]">
              <MapPin className="w-3 h-3" /> Delivering to
            </span>
            <span className="flex items-center gap-1 min-w-0">
              <span className="text-[15px] font-bold truncate text-[var(--ink)]">{area}</span>
              <ChevronDown className="w-4 h-4 shrink-0 text-[var(--ink-2)]" />
            </span>
          </Link>

          <Link to="/category" className="appbar-search flex-1">
            <Search className="w-5 h-5 text-[var(--green)] shrink-0" />
            <span
              className="text-sm text-[var(--ink-2)] truncate flex-1"
              style={{ transition: 'opacity .25s', opacity: visible ? 1 : 0 }}
            >
              {typed}
            </span>
            <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-[var(--green)] pl-2 border-l border-[var(--line)]">
              <Timer className="w-3.5 h-3.5" /> {brand.eta} min
            </span>
          </Link>

          <Link to="/cart" className="ibtn ibtn-ghost shrink-0">
            <ShoppingBag className="w-5 h-5" />
            {/* unmounted, not just `hidden`: .ibtn-badge sets display:flex at the
                same specificity as Tailwind's .hidden and wins the cascade, so a
                hidden badge still paints a "0" over an empty cart */}
            {n > 0 && (
              <span data-cart-badge className="ibtn-badge">
                {n}
              </span>
            )}
          </Link>

          <Link to="/profile" className="ibtn ibtn-ghost shrink-0">
            <User className="w-5 h-5" />
          </Link>
        </div>

        {/* Mobile: the "delivering to" address gets its own row under the bar so
            the customer always sees where we'll deliver and can tap to change it
            (the desktop chip lives inline above and is hidden here). */}
        <Link
          to="/location"
          className="sm:hidden mt-2 flex items-center gap-2 press active:opacity-70 min-w-0"
        >
          <span className="ichip ichip-green w-7 h-7 rounded-lg shrink-0">
            <MapPin className="w-3.5 h-3.5" />
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block text-[11px] font-bold tracking-[.14em] uppercase text-[var(--brand)]">
              Delivering to
            </span>
            <span className="block text-[13px] font-bold truncate min-w-0 text-[var(--ink)]">{area}</span>
          </span>
          <span className="shrink-0 flex items-center gap-0.5 text-[11px] font-bold text-[var(--green)]">
            Change <ChevronDown className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </header>
  );
}
