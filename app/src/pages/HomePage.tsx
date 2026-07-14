import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { StickyCart } from '@/shared/StickyCart';
import { StoreHoursModal } from '@/shared/StoreHoursModal';

import { HomeHeader } from '@/sections/home/HomeHeader';
import { HeroCarousel } from '@/sections/home/HeroCarousel';
import { TrustBar } from '@/sections/home/TrustBar';
import { CategoriesSection } from '@/sections/home/CategoriesSection';
import { BestsellersSection } from '@/sections/home/BestsellersSection';
import { FeatureBanner } from '@/sections/home/FeatureBanner';
import { RecommendedSection } from '@/sections/home/RecommendedSection';
import { BuyAgainRail } from '@/sections/home/BuyAgainRail';
import { TestimonialsSection } from '@/sections/home/TestimonialsSection';
import { BrandClose } from '@/sections/home/BrandClose';
import { HomeFooter } from '@/sections/home/HomeFooter';

/* home.html, section for section, in the same order:
   header · badges row · hero · trust bar · categories · promos · bestsellers ·
   feature banner · recommended · buy again · testimonials · brand close ·
   footer · hours modal · sticky cart. The bottom nav comes from RootLayout. */
export default function HomePage() {
  const [hoursOpen, setHoursOpen] = useState(false);
  useReveal();

  return (
    <div className="pb-28 md:pb-12">
      <HomeHeader />

      <main className="max-w-6xl mx-auto px-4 page-enter">
        <div className="flex items-center justify-between pt-4">
          <span className="badge badge-green">
            <span className="veg-dot" /> 100% Pure Veg Kitchen
          </span>
          <span className="text-[10px] font-bold bg-[var(--gold-soft)] text-[var(--ink)] px-2.5 py-1 rounded-full">
            DEMO PREVIEW
          </span>
        </div>

        <HeroCarousel />
        <TrustBar />
        <CategoriesSection />
        <BestsellersSection />
        <FeatureBanner />
        <RecommendedSection />
        <BuyAgainRail />
        <TestimonialsSection />
        <BrandClose />
      </main>

      <HomeFooter onOpenHours={() => setHoursOpen(true)} />

      <StoreHoursModal open={hoursOpen} onClose={() => setHoursOpen(false)} />
      <StickyCart />
    </div>
  );
}
