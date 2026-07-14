import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MapPin, Search, ShoppingBag, Timer, User } from 'lucide-react';
import { useStickyBar } from '@/hooks/useStickyBar';
import { useCartCount } from '@/store/cartStore';
import { useLocationStore } from '@/store/locationStore';

/* home.html's <header class="appbar"> — logo tile, "Delivering to" chip, the
   search pill with its rotating placeholder, cart and profile buttons. */

/** The rotating search placeholder, verbatim from home.html's inline script. */
const WORDS = ['dosa', 'biryani', 'filter coffee', 'paneer masala', 'parotta'];

export function HomeHeader() {
  const stuck = useStickyBar();
  const n = useCartCount();
  const location = useLocationStore((s) => s.location);

  const [typed, setTyped] = useState('Search dosa, biryani…');
  const [visible, setVisible] = useState(true);
  const wi = useRef(0);
  const swapTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const iv = window.setInterval(() => {
      wi.current = (wi.current + 1) % WORDS.length;
      setVisible(false);
      swapTimer.current = window.setTimeout(() => {
        setTyped(`Search ${WORDS[wi.current]}…`);
        setVisible(true);
      }, 250);
    }, 2400);

    return () => {
      window.clearInterval(iv);
      if (swapTimer.current) window.clearTimeout(swapTimer.current);
    };
  }, []);

  /* Same slice the prototype's script did: the first two comma-parts of the
     saved address, falling back to the whole address. */
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
            <img src="/image.png" alt="VRF" />
          </Link>

          <Link
            to="/location"
            className="hidden sm:flex flex-col justify-center min-w-0 press text-left gap-[3px] leading-none shrink-0 max-w-[160px]"
          >
            <span className="flex items-center gap-1 text-[10px] font-bold tracking-[.14em] uppercase text-[var(--brand)]">
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
              <Timer className="w-3.5 h-3.5" /> 35 min
            </span>
          </Link>

          <Link to="/cart" className="ibtn ibtn-ghost shrink-0">
            <ShoppingBag className="w-5 h-5" />
            <span data-cart-badge className={n === 0 ? 'hidden ibtn-badge' : 'ibtn-badge'}>
              {n}
            </span>
          </Link>

          <Link to="/profile" className="ibtn ibtn-ghost shrink-0">
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
