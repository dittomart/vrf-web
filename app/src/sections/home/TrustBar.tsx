import { Leaf, ShieldCheck, Star, Timer } from 'lucide-react';

/* The four stat tiles under the hero: delivery ETA, pure-veg, rating, FSSAI. */
export function TrustBar() {
  return (
    <section className="mt-4 grid grid-cols-4 gap-2.5 text-center stagger">
      <div className="stat-tile">
        <span className="ichip ichip-green mx-auto mb-1.5">
          <Timer className="w-5 h-5" />
        </span>
        <p className="display font-bold text-[15px] leading-none text-[var(--green)]">
          35<span className="text-[10px]">min</span>
        </p>
        <p className="text-[10px] font-semibold mt-1 text-[var(--ink-2)]">Avg delivery</p>
      </div>

      <div className="stat-tile">
        <span className="ichip ichip-green mx-auto mb-1.5">
          <Leaf className="w-5 h-5" />
        </span>
        <p className="display font-bold text-[15px] leading-none text-[var(--green)]">
          100<span className="text-[10px]">%</span>
        </p>
        <p className="text-[10px] font-semibold mt-1 text-[var(--ink-2)]">Pure veg</p>
      </div>

      <div className="stat-tile">
        <span className="ichip ichip-gold mx-auto mb-1.5">
          <Star className="w-5 h-5 fill-[var(--gold)]" />
        </span>
        <p className="display font-bold text-[15px] leading-none text-[var(--green)]">4.8</p>
        <p className="text-[10px] font-semibold mt-1 text-[var(--ink-2)]">12k+ ratings</p>
      </div>

      <div className="stat-tile">
        <span className="ichip ichip-brand mx-auto mb-1.5">
          <ShieldCheck className="w-5 h-5" />
        </span>
        <p className="display font-bold text-[15px] leading-none text-[var(--green)]">FSSAI</p>
        <p className="text-[10px] font-semibold mt-1 text-[var(--ink-2)]">Certified</p>
      </div>
    </section>
  );
}
