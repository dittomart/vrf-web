import { ChefHat, Clock, Leaf } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useBrandInfo } from '@/hooks/useBrandInfo';

/* category.html — MENU HERO, the photo-textured brand panel. The backdrop is the
   brand's own hero image; without one the panel is the brand wash alone, which
   is what it was designed to sit on. */
export function MenuHero({ title, count }: { title: string; count: number }) {
  const heroImage = useAppStore((s) => s.brand?.heroImage ?? '');
  const brand = useBrandInfo();

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4">
      <section className="menu-hero on-brand a-scalein">
        {heroImage ? (
          <div
            className="menu-hero-photo"
            id="menu-photo"
            aria-hidden="true"
            style={{ backgroundImage: `url("${heroImage}")` }}
          />
        ) : null}
        <div className="menu-hero-wash" aria-hidden="true" />
        <div className="menu-hero-glow" aria-hidden="true" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="menu-hero-eyebrow">{brand.brand} · Chef-crafted daily</span>
            <h1 className="menu-hero-title" id="hero-title">
              {title}
            </h1>
            <p id="hero-count" className="text-[13px] text-white/70 mt-1.5">
              {count} {count === 1 ? 'dish' : 'dishes'} · freshly made
            </p>
          </div>
        </div>

        <div className="relative mt-5 flex flex-wrap gap-2">
          <span className="menu-hero-chip">
            <Leaf className="w-3.5 h-3.5" /> Pure veg kitchen
          </span>
          <span className="menu-hero-chip">
            <Clock className="w-3.5 h-3.5" /> {brand.eta}-min delivery
          </span>
          <span className="menu-hero-chip">
            <ChefHat className="w-3.5 h-3.5" /> Cooked to order
          </span>
        </div>
      </section>
    </div>
  );
}
