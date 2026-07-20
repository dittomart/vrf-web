import { Flame } from 'lucide-react';

export type SortKey = 'pop' | 'low' | 'high';

/* category.html — FILTER BAR. The sort buttons are a radio group (only one
   .is-on at a time); Bestsellers is an independent toggle. */
export function FilterBar({
  sort,
  onSort,
  onlyBest,
  onToggleBest,
}: {
  sort: SortKey;
  onSort: (s: SortKey) => void;
  onlyBest: boolean;
  onToggleBest: () => void;
}) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center gap-2">
      <div className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          data-sort="pop"
          onClick={() => onSort('pop')}
          className={`sortbtn fchip shrink-0 ${sort === 'pop' ? 'is-on' : ''}`}
        >
          <Flame className="w-3.5 h-3.5" /> Popular
        </button>
        <button
          data-sort="low"
          onClick={() => onSort('low')}
          className={`sortbtn fchip shrink-0 ${sort === 'low' ? 'is-on' : ''}`}
        >
          Price ↑
        </button>
        <button
          data-sort="high"
          onClick={() => onSort('high')}
          className={`sortbtn fchip shrink-0 ${sort === 'high' ? 'is-on' : ''}`}
        >
          Price ↓
        </button>
        <button
          data-filter="best"
          onClick={onToggleBest}
          className={`filterbtn fchip shrink-0 ${onlyBest ? 'is-on' : ''}`}
        >
          <Flame className="w-3.5 h-3.5" /> Bestsellers
        </button>
      </div>
      <span className="shrink-0 flex items-center gap-1 text-xs font-bold badge badge-green">
        <span className="veg-dot" /> Pure Veg
      </span>
    </div>
  );
}
