import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS } from '@/api/_seed';
import { ProductCard } from '@/cards/ProductCard';

/* home.html's #recommended grid — PRODUCTS.filter(p => !p.best).slice(0, 8). */
export function RecommendedSection() {
  const items = PRODUCTS.filter((p) => !p.best).slice(0, 8);

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between reveal gap-3">
        <div className="min-w-0 flex items-center gap-3">
          <span className="ichip ichip-gold shrink-0">
            <Sparkles className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <p className="eyebrow">Handpicked for you</p>
            <h2 className="display text-[24px] font-semibold leading-tight mt-0.5">Recommended</h2>
          </div>
        </div>
        <Link
          to="/category"
          className="shrink-0 text-sm font-semibold text-[var(--green)] press flex items-center gap-1"
        >
          See all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="mt-5 grid-products" id="recommended">
        {items.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
