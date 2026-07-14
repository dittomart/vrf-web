import { BadgeCheck, Quote } from 'lucide-react';
import { SmartImage } from '@/shared/SmartImage';
import { imgUrl } from '@/utils/fmt';

/* home.html's #testimonials — the three-entry array, verbatim. */

interface Testimonial {
  n: string;
  a: string;
  t: string;
  img: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    n: 'Lakshmi R.',
    a: 'Tambaram',
    t: 'The dum biryani tastes exactly like my paati makes it. Piping hot every single time.',
    img: '1494790108377-be9c29b29330',
  },
  {
    n: 'Karthik S.',
    a: 'Chromepet',
    t: 'The unlimited meals combo at ₹180 is genuinely unbeatable. Ordered thrice this week.',
    img: '1507003211169-0a1dd7228f2d',
  },
  {
    n: 'Divya M.',
    a: 'Selaiyur',
    t: 'A pure-veg kitchen I trust completely. The filter coffee is the real degree coffee.',
    img: '1438761681033-6461ffad8d80',
  },
];

export function TestimonialsSection() {
  return (
    <section className="mt-12">
      <div className="reveal sec-head">
        <span className="ichip ichip-gold shrink-0">
          <Quote className="w-5 h-5" />
        </span>
        <div className="shrink-0">
          <p className="eyebrow">In their words</p>
          <h2 className="display text-[24px] font-semibold leading-tight mt-0.5">
            Regulars who keep coming back
          </h2>
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-3 gap-4" id="testimonials">
        {TESTIMONIALS.map((x) => (
          <div key={x.n} className="ui-card-lux card-topline p-6 lift relative overflow-hidden">
            <span className="script text-6xl text-[var(--gold-soft)] absolute top-2 right-4 leading-none pointer-events-none">
              ”
            </span>
            <div className="flex gap-0.5 text-[var(--gold)] mb-3 relative">★★★★★</div>
            <p
              className="text-[15px] text-[var(--ink)] leading-relaxed display relative"
              style={{ fontWeight: 400 }}
            >
              &quot;{x.t}&quot;
            </p>
            <div className="flex items-center gap-3 mt-5">
              <SmartImage
                src={imgUrl(x.img, 80, 80)}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[var(--gold-soft)]"
                alt={x.n}
              />
              <div>
                <p className="text-sm font-semibold flex items-center gap-1">
                  {x.n} <BadgeCheck className="w-3.5 h-3.5 text-[var(--green)]" />
                </p>
                <p className="text-[11px] text-[var(--ink-2)]">{x.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
