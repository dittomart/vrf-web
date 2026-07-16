import { Award, Leaf } from 'lucide-react';
import { useBrandInfo } from '@/hooks/useBrandInfo';

/* The "SINCE OUR FIRST POT" brand-close card that ends <main>. */
export function BrandClose() {
  const brand = useBrandInfo();

  return (
    <section className="mt-7 reveal">
      <div className="div-label mb-8">SINCE OUR FIRST POT</div>
      <div className="ui-card-lux card-topline text-center py-11 px-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="logo-tile w-20 h-20 mx-auto shadow-md">
            <img src={brand.logo} alt={brand.brand} />
          </div>
          <p className="script text-2xl text-[var(--green)] mt-5">Home-style, always fresh</p>
          {brand.city ? (
            <p className="text-[var(--ink-2)] text-sm mt-2 max-w-xs mx-auto leading-relaxed">
              A pure-veg kitchen cooking South Indian classics for {brand.city}.
            </p>
          ) : null}
          <div className="flex items-center justify-center gap-2 mt-5">
            <span className="badge badge-green">
              <Leaf className="w-3.5 h-3.5" /> Pure veg
            </span>
            <span className="badge badge-gold">
              <Award className="w-3.5 h-3.5" /> South Indian classics
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
