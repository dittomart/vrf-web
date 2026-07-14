import { Flame, Star } from 'lucide-react';
import { SmartImage } from '@/shared/SmartImage';
import { prodImg } from '@/utils/fmt';
import type { Product } from '@/types';

/* product.html — the gallery: a contained 4:3 frame, not a full-viewport-height
   photo. #ordered-badge only appears for bestsellers ("Ordered N times"). */
export function ProductGallery({ p }: { p: Product }) {
  return (
    <div className="product-media imgzoom lg:sticky lg:top-[88px] a-scalein">
      <SmartImage id="hero-img" src={prodImg(p, 800, 600)} className="w-full h-full object-cover" alt="" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top,rgba(0,0,0,.42),rgba(0,0,0,0) 45%)' }}
      />
      {p.best && (
        <span id="ordered-badge" className="absolute bottom-4 left-4 badge badge-gold shadow-md anim-fadein">
          <Flame className="w-3 h-3" /> Ordered {p.ordered} times
        </span>
      )}
      <span
        className="absolute bottom-4 right-4 badge shadow-md"
        style={{ background: 'rgba(255,255,255,.92)', color: '#16211D' }}
      >
        <Star className="w-3.5 h-3.5 fill-[var(--gold)] text-[var(--gold)]" /> 4.8 · 12k+
      </span>
    </div>
  );
}
