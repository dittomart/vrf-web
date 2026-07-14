import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SmartImage } from '@/shared/SmartImage';
import { imgUrl } from '@/utils/fmt';

/* home.html's #hero — a full-width storefront carousel of four promotional
   slides that auto-advances every 4200ms by translating the 400%-wide track. */

interface Slide {
  id: string;
  tag: string;
  title: ReactNode;
  img: string;
}

/** The slides array, verbatim — including the <br> inside each title. */
const SLIDES: Slide[] = [
  {
    id: 'p5',
    tag: 'Signature',
    title: (
      <>
        Chennai&apos;s favourite
        <br />
        Dum Biryani
      </>
    ),
    img: '1589302168068-964664d93dc0',
  },
  {
    id: 'p15',
    tag: 'Most reordered',
    title: (
      <>
        Crispy Masala Dosa,
        <br />
        ordered 356 times
      </>
    ),
    img: '1668236543090-82eba5ee5976',
  },
  {
    id: 'p8',
    tag: 'House special',
    title: (
      <>
        Rich, buttery
        <br />
        Paneer Masala
      </>
    ),
    img: '1631452180519-c014fe946bc7',
  },
  {
    id: 'p20',
    tag: 'South Indian classic',
    title: (
      <>
        Authentic degree
        <br />
        Filter Coffee
      </>
    ),
    img: '1509042239860-f550ce710b93',
  },
];

const SLIDE_OVERLAY =
  'linear-gradient(90deg,color-mix(in srgb, var(--primary) 94%, transparent) 0%,color-mix(in srgb, var(--primary) 60%, transparent) 45%,transparent 78%)';

export function HeroCarousel() {
  const [hi, setHi] = useState(0);

  useEffect(() => {
    const iv = window.setInterval(() => {
      setHi((i) => (i + 1) % SLIDES.length);
    }, 4200);
    return () => window.clearInterval(iv);
  }, []);

  return (
    <section className="mt-3 reveal">
      <div className="relative rounded-[24px] overflow-hidden shadow-[var(--shadow-lg)]">
        <div
          id="hero"
          className="flex transition-transform duration-[800ms] ease-[cubic-bezier(.2,.7,.3,1)]"
          style={{ width: '400%', transform: `translateX(-${hi * 25}%)` }}
        >
          {SLIDES.map((s) => (
            <Link
              key={s.id}
              to={`/product/${s.id}`}
              className="w-1/4 relative block frame aspect-[1200/560] sm:aspect-[1200/460] md:aspect-[1200/400]"
            >
              <SmartImage src={imgUrl(s.img, 1200, 560)} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0" style={{ background: SLIDE_OVERLAY }} />
              <div className="absolute inset-0 flex flex-col justify-center p-7 sm:p-10 md:p-12 text-white max-w-[80%]">
                <span className="eyebrow text-[var(--gold)]">{s.tag}</span>
                <h2 className="display text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mt-2">
                  {s.title}
                </h2>
                <span className="inline-flex items-center gap-1.5 mt-4 sm:mt-5 btn-gold press font-semibold text-sm px-4 py-2.5 rounded-full w-max">
                  Order now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div id="dots" className="absolute bottom-4 left-6 flex gap-1.5 z-10">
          {SLIDES.map((s, j) => (
            <span
              key={s.id}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                j === hi ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
