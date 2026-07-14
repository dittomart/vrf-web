import { Grid2x2 } from 'lucide-react';
import { CATEGORIES } from '@/api/_seed';
import { Icon } from '@/ui/Icon';
import type { Category } from '@/types';

/* category.html — CATEGORY RAIL. renderChips() prepended a synthetic
   { id:"all", name:"All", icon:"grid-2x2" } chip to CATEGORIES; grid-2x2 is the
   one icon the seed never names, so it is rendered directly. */
const ALL: Category = { id: 'all', name: 'All', icon: 'grid-2x2' };

export function CategoryChips({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-5 flex gap-2.5 overflow-x-auto no-scrollbar" id="chips">
      {[ALL, ...CATEGORIES].map((c) => (
        <button
          key={c.id}
          data-cat={c.id}
          onClick={() => onSelect(c.id)}
          className={`cat-chip shrink-0 ${active === c.id ? 'is-active' : ''}`}
        >
          <span className="cat-chip-ico">
            {c.id === 'all' ? <Grid2x2 /> : <Icon name={c.icon} />}
          </span>
          <span>{c.name}</span>
        </button>
      ))}
    </div>
  );
}
