import { Flame } from 'lucide-react';
import { SmartImage } from '@/shared/SmartImage';
import type { Product } from '@/types';

/* product.html — the gallery: a contained 4:3 frame, not a full-viewport-height
   photo. The bestseller ribbon shows only for the dishes the kitchen flagged. */
export function ProductGallery({ p }: { p: Product }) {
  return (
    <div className="product-media imgzoom lg:sticky lg:top-[88px] a-scalein">
      <SmartImage id="hero-img" src={p.img} className="w-full h-full object-cover" alt={p.name} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top,rgba(0,0,0,.42),rgba(0,0,0,0) 45%)' }}
      />
      {p.best && (
        <span id="ordered-badge" className="absolute bottom-4 left-4 badge badge-gold shadow-md anim-fadein">
          <Flame className="w-3 h-3" /> Bestseller
        </span>
      )}
    </div>
  );
}
