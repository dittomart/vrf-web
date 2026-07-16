import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { StickyCart } from '@/shared/StickyCart';
import { StoreHoursModal } from '@/shared/StoreHoursModal';

import { HomeHeader } from '@/sections/home/HomeHeader';
import { HeroCarousel } from '@/sections/home/HeroCarousel';
import { TrustBar } from '@/sections/home/TrustBar';
import { CategoriesSection } from '@/sections/home/CategoriesSection';
import { BestsellersSection } from '@/sections/home/BestsellersSection';
import { RecommendedSection } from '@/sections/home/RecommendedSection';
import { BuyAgainRail } from '@/sections/home/BuyAgainRail';
import { WhyUsSection } from '@/sections/home/WhyUsSection';
import { TestimonialsSection } from '@/sections/home/TestimonialsSection';
import { BrandClose } from '@/sections/home/BrandClose';
import { HomeFooter } from '@/sections/home/HomeFooter';
import { useAppStore } from '@/store/appStore';
import { isStoreOpenNow } from '@/utils/storeHours';

/* home.html, section for section. The testimonial wall the prototype shipped is
   gone: those were three invented customers with invented quotes, and there is no
   reviews endpoint to fill it with real ones. */
export default function HomePage() {
  const [hoursOpen, setHoursOpen] = useState(false);
  const store = useAppStore((s) => s.storeLocation);
  const closed = !isStoreOpenNow(store);
  useReveal();

  return (
    <div className="pb-28 md:pb-12">
      <HomeHeader />

      <main className="max-w-6xl mx-auto px-4 page-enter">
        <div className="flex items-center justify-between pt-4">
          <span className="badge badge-green">
            <span className="veg-dot" /> 100% Pure Veg Kitchen
          </span>
          {closed && (
            <button onClick={() => setHoursOpen(true)} className="badge badge-accent press">
              Closed right now · see hours
            </button>
          )}
        </div>

        <HeroCarousel />
        <TrustBar />
        <CategoriesSection />
        <BestsellersSection />
        <RecommendedSection />
        <BuyAgainRail />
        <WhyUsSection />
        <TestimonialsSection />
        <BrandClose />
      </main>

      <HomeFooter onOpenHours={() => setHoursOpen(true)} />

      <StoreHoursModal open={hoursOpen} onClose={() => setHoursOpen(false)} />
      <StickyCart />
    </div>
  );
}
