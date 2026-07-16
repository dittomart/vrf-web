import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Repeat, RotateCcw, Utensils } from 'lucide-react';

import { useGetCatalog } from '@/api/queries/catalog';
import { useCartStore } from '@/store/cartStore';
import { useSavedOrdersStore, type SavedCombo } from '@/store/savedOrdersStore';
import { toast } from '@/store/appStore';

/* profile.html's "Saved orders" (#favs), fed by the combos the confirmation
   screen saves. Reordering resolves each dish against the live menu, so a saved
   combo picks up today's price rather than the one frozen at save time. */
export function SavedCombos() {
  const favs = useSavedOrdersStore((s) => s.favs);
  const add = useCartStore((s) => s.add);
  const { data: catalog } = useGetCatalog();
  const navigate = useNavigate();
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const reorderFav = (combo: SavedCombo) => {
    let added = 0;
    for (const i of combo.items) {
      const p = catalog?.flat.find((x) => x.id === i.id);
      if (!p) continue;
      add(p, i.qty);
      added += 1;
    }

    if (added === 0) {
      toast('These dishes are off the menu right now', 'alert-circle');
      return;
    }

    toast('Added to cart', 'rotate-ccw');
    timer.current = window.setTimeout(() => navigate('/cart'), 600);
  };

  return (
    <section className="min-w-0">
      <div className="sec-head">
        <span className="ichip ichip-brand shrink-0">
          <Bookmark className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <p className="eyebrow">Your combos</p>
          <p className="sec-title leading-tight">Saved orders</p>
        </div>
      </div>

      <div className="space-y-3">
        {favs.length === 0 ? (
          <div className="ui-card ui-card-pad text-center text-sm text-[var(--ink-2)]">
            <p>No saved combos yet.</p>
            <p className="text-xs mt-1">Save an order after checkout to reorder in one tap.</p>
          </div>
        ) : (
          favs.map((f, i) => (
            <div key={i} className="ui-card-lux card-topline ui-card-pad flex items-center gap-3.5">
              <div className="ichip ichip-gold w-12 h-12">
                <Utensils className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{f.name}</p>
                <p className="text-xs text-[var(--ink-2)] truncate mt-0.5">
                  {f.items.map((x) => `${x.qty}× ${x.name}`).join(', ')}
                </p>
                <span className="badge badge-green mt-1.5">
                  <Repeat className="w-3 h-3" /> Quick reorder
                </span>
              </div>
              <button
                onClick={() => reorderFav(f)}
                className="w-11 h-11 rounded-2xl cta-lux-accent shine flex items-center justify-center press shrink-0"
                aria-label="Reorder"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
