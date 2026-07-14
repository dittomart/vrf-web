import { ChefHat, Clock, Leaf } from 'lucide-react';
import { imgUrl } from '@/utils/fmt';

/* category.html — MENU HERO, the photo-textured brand panel.
   The backdrop is a real dish behind the brand wash, so the panel reads as an
   editorial header rather than a flat colour block. Title/count are driven by
   the active filter, exactly as render() rewrote #hero-title / #hero-count. */
export function MenuHero({ title, count }: { title: string; count: number }) {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-4">
      <section className="menu-hero on-brand a-scalein">
        <div
          className="menu-hero-photo"
          id="menu-photo"
          aria-hidden="true"
          style={{ backgroundImage: `url("${imgUrl('1585937421612-70a008356fbe', 1400, 500)}")` }}
        />
        <div className="menu-hero-wash" aria-hidden="true" />
        <div className="menu-hero-glow" aria-hidden="true" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="menu-hero-eyebrow">VRF Kitchen · Chef-crafted daily</span>
            <h1 className="menu-hero-title" id="hero-title">
              {title}
            </h1>
            <p id="hero-count" className="text-[13px] text-white/70 mt-1.5">
              {count} dishes · handpicked &amp; freshly made
            </p>
          </div>
          <span className="badge badge-green shrink-0">
            <span className="veg-dot" /> 100% Pure Veg
          </span>
        </div>

        <div className="relative mt-5 flex flex-wrap gap-2">
          <span className="menu-hero-chip">
            <Leaf className="w-3.5 h-3.5" /> No onion · no garlic
          </span>
          <span className="menu-hero-chip">
            <Clock className="w-3.5 h-3.5" /> 30-min delivery
          </span>
          <span className="menu-hero-chip">
            <ChefHat className="w-3.5 h-3.5" /> Cooked to order
          </span>
        </div>
      </section>
    </div>
  );
}
