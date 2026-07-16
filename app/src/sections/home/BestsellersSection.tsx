import { useGetCatalog } from '@/api/queries/catalog';
import { ProductCard } from '@/cards/ProductCard';
import { SectionHead } from '@/sections/home/SectionHead';

/* home.html's #bestsellers grid. The prototype's `best` flag is now the two
   flags the admin actually sets on an item: recommended or popular. */
export function BestsellersSection() {
  const { data: catalog, isLoading } = useGetCatalog();
  const items = (catalog?.flat ?? []).filter((p) => p.best).slice(0, 8);

  if (isLoading) {
    return (
      <section className="mt-7">
        <div className="mt-5 grid-products">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="ui-card overflow-hidden">
              <div className="w-full h-32 sm:h-36 img-fallback" />
              <div className="p-3.5 space-y-2">
                <div className="h-3 w-3/4 rounded bg-[var(--ivory-2)]" />
                <div className="h-3 w-1/2 rounded bg-[var(--ivory-2)]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="mt-7">
      <SectionHead eyebrow="Loved by regulars" title="Bestsellers of the house" to="/category" />

      <div className="mt-5 grid-products" id="bestsellers">
        {items.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
