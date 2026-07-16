import { Grid2x2 } from 'lucide-react';
import { useGetCategories } from '@/api/queries/catalog';
import { Icon } from '@/ui/Icon';

/* category.html — CATEGORY RAIL. The "All" chip is synthetic (it is not a
   category on the store); every other chip is one the kitchen enabled. */
export function CategoryChips({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) {
  const { data: categories = [] } = useGetCategories();

  return (
    <div className="max-w-6xl mx-auto px-4 pt-5 flex gap-2.5 overflow-x-auto no-scrollbar" id="chips">
      <button
        data-cat="all"
        onClick={() => onSelect('all')}
        className={`cat-chip shrink-0 ${active === 'all' ? 'is-active' : ''}`}
      >
        <span className="cat-chip-ico">
          <Grid2x2 />
        </span>
        <span>All</span>
      </button>

      {categories.map((c) => (
        <button
          key={c.id}
          data-cat={c.id}
          onClick={() => onSelect(c.id)}
          className={`cat-chip shrink-0 ${active === c.id ? 'is-active' : ''}`}
        >
          <span className="cat-chip-ico">
            <Icon name={c.icon} />
          </span>
          <span>{c.name}</span>
        </button>
      ))}
    </div>
  );
}
