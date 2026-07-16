import { useGetCatalog } from '@/api/queries/catalog';
import { ProductCard } from '@/cards/ProductCard';
import { SectionHead } from '@/sections/home/SectionHead';

/* home.html's #recommended grid. The endpoint returns its own `recommended`
   list; the rest of the menu fills the section out when it is short, exactly as
   the prototype's `!best` slice did. */
export function RecommendedSection() {
  const { data: catalog } = useGetCatalog();

  const flat = catalog?.flat ?? [];
  const picked = catalog?.recommended ?? [];
  const seen = new Set(picked.map((p) => p.id));
  const items = [...picked, ...flat.filter((p) => !p.best && !seen.has(p.id))].slice(0, 8);

  if (items.length === 0) return null;

  return (
    <section className="mt-7">
      <SectionHead eyebrow="Handpicked for you" title="Recommended" to="/category" />

      {/* .grid-products — the one shared product grid (2/3/4 cols) used by the
          category page too, so column counts match everywhere. */}
      <div className="mt-5 grid-products" id="recommended">
        {items.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
