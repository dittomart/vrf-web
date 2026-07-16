import { Link } from 'react-router-dom';
import { ArrowRight, Crown, Timer } from 'lucide-react';
import { useGetCatalog } from '@/api/queries/catalog';
import { SmartImage } from '@/shared/SmartImage';
import { useBrandInfo } from '@/hooks/useBrandInfo';
import { money } from '@/utils/fmt';
import { getDisplayPrice } from '@/utils/productPricing';

/* The house-special banner. The prototype hardcoded a dish, a photo and a price;
   the real one is whatever the kitchen flagged — the first bestseller on the
   menu, at its actual price. No bestseller, no banner. */
export function FeatureBanner() {
  const { data: catalog } = useGetCatalog();
  const brand = useBrandInfo();

  /* Prefer a flagged bestseller; if the kitchen hasn't flagged one yet, fall
     back to the first dish that has a photo so the banner still has something to
     feature rather than vanishing. */
  const hero =
    (catalog?.flat ?? []).find((p) => p.best && p.img) ??
    (catalog?.flat ?? []).find((p) => p.img);
  if (!hero) return null;

  const { price } = getDisplayPrice(hero);

  return (
    <section className="mt-9 reveal">
      {/* one single card — the copy is written directly ON the photo, over a
          gradient so it stays readable. No inner card, no split. A gold ribbon
          and a frosted "Order" pill are the only floating bits. */}
      <Link to={`/product/${hero.id}`} className="gfeat">
        <SmartImage src={hero.img} className="gfeat-img" alt={hero.name} />
        <div className="gfeat-veil" />

        <span className="gfeat-ribbon">
          <Crown className="w-3 h-3" /> House special
        </span>

        <div className="gfeat-copy">
          <span className="gfeat-eyebrow">
            <Timer className="w-3 h-3" /> Today&apos;s favourite · {brand.eta} min
          </span>
          <h3 className="gfeat-title">{hero.name}</h3>
          <div className="gfeat-foot">
            <span className="gfeat-price">{money(price)}</span>
            <span className="gfeat-cta">
              Order <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
