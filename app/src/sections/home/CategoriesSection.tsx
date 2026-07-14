import { Link } from 'react-router-dom';
import { ArrowRight, Utensils } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '@/api/_seed';
import { SmartImage } from '@/shared/SmartImage';
import { Icon } from '@/ui/Icon';
import { prodImg } from '@/utils/fmt';

/* home.html's #cat-grid. The tile photo is the category's bestseller, or its
   first product if it has none — exactly the prototype's `rep` lookup. */
export function CategoriesSection() {
  return (
    <section className="mt-11">
      <div className="flex items-end justify-between reveal gap-3">
        <div className="min-w-0 flex items-center gap-3">
          <span className="ichip ichip-green shrink-0">
            <Utensils className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <p className="eyebrow eyebrow-g">The full menu</p>
            <h2 className="display text-[24px] font-semibold leading-tight mt-0.5">Shop by category</h2>
          </div>
        </div>
        <Link
          to="/category"
          className="shrink-0 text-sm font-semibold text-[var(--green)] press flex items-center gap-1"
        >
          See all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="mt-5 grid-cats gap-y-5" id="cat-grid">
        {CATEGORIES.map((c, i) => {
          const rep = PRODUCTS.find((p) => p.cat === c.id && p.best) || PRODUCTS.find((p) => p.cat === c.id);
          const img = rep ? prodImg(rep, 240, 240) : '';

          return (
            <Link
              key={c.id}
              to={`/category?cat=${c.id}`}
              className="flex flex-col items-center gap-2 reveal press"
              data-d={(i % 4) + 1}
            >
              <div className="frame w-full aspect-square rounded-[20px] overflow-hidden border border-[var(--line)] lift shadow-sm relative">
                <SmartImage src={img} className="w-full h-full object-cover" alt={c.name} />
                <span className="absolute top-1.5 left-1.5 bg-white/85 backdrop-blur-sm rounded-md w-6 h-6 flex items-center justify-center shadow-sm text-[var(--green)]">
                  <Icon name={c.icon} className="w-3.5 h-3.5" />
                </span>
              </div>
              <span className="text-[11px] font-semibold text-center leading-tight">{c.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
