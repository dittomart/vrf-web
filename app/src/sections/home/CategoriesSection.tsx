import { Link } from 'react-router-dom';
import { useGetCatalog, useGetCategories } from '@/api/queries/catalog';
import { SmartImage } from '@/shared/SmartImage';
import { Icon } from '@/ui/Icon';
import { SectionHead } from '@/sections/home/SectionHead';

/* home.html's #cat-grid. The tile photo is the category's bestseller, or its
   first dish if it has none — exactly the prototype's `rep` lookup, now run
   against the live menu. */
export function CategoriesSection() {
  const { data: categories = [], isLoading } = useGetCategories();
  const { data: catalog } = useGetCatalog();

  if (isLoading) {
    return (
      <section className="mt-7">
        <div className="mt-5 flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="shrink-0 w-[5.5rem] flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full img-fallback" />
              <span className="h-3 w-14 rounded bg-[var(--ivory-2)]" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="mt-7">
      <SectionHead eyebrow="Explore the menu" title="Shop by category" to="/category" />


      {/* circular tiles on a scroll rail — round photo in a gold ring, label
          below (the reference layout). One reads fine, a dozen just scroll. */}
      <div className="mt-6 flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1" id="cat-grid">
        {categories.map((c, i) => {
          const items = catalog?.flat.filter((p) => p.cat === c.id) ?? [];
          const rep = items.find((p) => p.best) ?? items[0];
          const img = c.image || rep?.img || '';

          return (
            <Link
              key={c.id}
              to={`/category?cat=${c.id}`}
              className="cat-tile shrink-0 reveal"
              data-d={(i % 4) + 1}
            >
              <span className="cat-ring">
                <span className="cat-photo frame">
                  <SmartImage src={img} className="w-full h-full object-cover" alt={c.name} />
                </span>
                <span className="cat-icon">
                  <Icon name={c.icon} className="w-3.5 h-3.5" />
                </span>
              </span>
              <span className="cat-label">{c.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
