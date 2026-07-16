import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChefHat, Crown, Utensils } from 'lucide-react';
import { useGetSliders } from '@/api/queries/catalog';
import { SmartImage } from '@/shared/SmartImage';
import { useAppStore } from '@/store/appStore';
import { useBrandInfo } from '@/hooks/useBrandInfo';

/* home.html's #hero — the storefront carousel, driven by the slides the store
   uploaded (/restaurant-sliders). When a store hasn't uploaded any (a fresh
   kitchen), we DON'T leave a hole at the top of the page: a branded hero built
   from the logo + a real dish photo fills it, so the home page always opens with
   something to look at. */
export function HeroCarousel() {
  const { data: slides = [] } = useGetSliders();
  const brandName = useAppStore((s) => s.brand?.name ?? '');
  const brand = useBrandInfo();
  const [hi, setHi] = useState(0);

  const n = slides.length;

  useEffect(() => {
    if (n < 2) return;
    const iv = window.setInterval(() => setHi((i) => (i + 1) % n), 4200);
    return () => window.clearInterval(iv);
  }, [n]);

  // No uploaded slides → the reference hero, in VRF green/gold: a food photo
  // behind a deep green overlay, a crown "since" badge, a three-line headline
  // (two white lines + one gold), a subline, and twin CTAs.
  if (n === 0) {
    // A crisp, art-directed stock photo — not the store's low-res item image —
    // so the hero always looks professional. Ships with the app (public/img),
    // BASE_URL keeps it correct under the deploy sub-path.
    const heroImg = `${import.meta.env.BASE_URL}img/hero-thali.jpg`;
    return (
      <section className="mt-3 reveal">
        <div className="rhero">
          <img src={heroImg} className="absolute inset-0 w-full h-full object-cover" alt="" />
          <div className="rhero-wash" />

          <div className="rhero-body">
            <span className="rhero-badge">
              <Crown className="w-3.5 h-3.5" /> Pure Veg · {brandName || 'VRF Kitchen'}
            </span>

            <h2 className="rhero-title">
              ROYAL TASTE,
              <br />
              COOKED FRESH
              <br />
              <span className="rhero-title-gold">FOR EVERY MEAL</span>
            </h2>

            <p className="rhero-sub">
              Authentic South &amp; North Indian vegetarian meals &amp; catering,
              delivered hot{brand.city ? ` across ${brand.city}` : ''} in {brand.eta}–60 min.
            </p>

            <div className="rhero-row">
              <Link to="/category" className="hero-cta-gold press">
                <Utensils className="w-4 h-4" /> Order now
              </Link>
              <Link to="/category" className="rhero-ghost press">
                <ChefHat className="w-4 h-4" /> Catering
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const active = Math.min(hi, n - 1);

  return (
    <section className="mt-3 reveal">
      <div className="relative rounded-[24px] overflow-hidden shadow-[var(--shadow-lg)]">
        <div
          id="hero"
          className="flex transition-transform duration-[800ms] ease-[cubic-bezier(.2,.7,.3,1)]"
          style={{ width: `${n * 100}%`, transform: `translateX(-${active * (100 / n)}%)` }}
        >
          {slides.map((s) => {
            const to = s.url && s.url.startsWith('/') ? s.url : '/category';
            return (
              <Link
                key={s.id}
                to={to}
                className="relative block frame aspect-[1200/560] sm:aspect-[1200/460] md:aspect-[1200/400]"
                style={{ width: `${100 / n}%` }}
              >
                <SmartImage src={s.image} className="w-full h-full object-cover" alt={s.name} />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(90deg,color-mix(in srgb, var(--primary) 94%, transparent) 0%,color-mix(in srgb, var(--primary) 60%, transparent) 45%,transparent 78%)',
                  }}
                />
                <div className="absolute inset-0 flex flex-col justify-center p-7 sm:p-10 md:p-12 text-white max-w-[80%]">
                  <span className="eyebrow text-[var(--gold)]">{brandName}</span>
                  <h2 className="display text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mt-2">
                    {s.name}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 mt-4 sm:mt-5 btn-gold press font-semibold text-sm px-4 py-2.5 rounded-full w-max">
                    Order now <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {n > 1 && (
          <div id="dots" className="absolute bottom-4 left-6 flex gap-1.5 z-10">
            {slides.map((s, j) => (
              <span
                key={s.id}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  j === active ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
