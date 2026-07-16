import { Star } from 'lucide-react';
import { SectionHead } from '@/sections/home/SectionHead';

/* A "kind words" band mirroring the reference's testimonial row. These are
   representative of the kitchen's positioning, not scraped from a real reviews
   feed (there isn't one) — so they carry no invented full names or locations, no
   fabricated order counts. If a reviews endpoint lands later, swap this list. */
const NOTES = [
  {
    stars: 5,
    body: 'Home-style taste, packed hot and sealed. Exactly what pure-veg families look for.',
    who: 'Pure-veg household',
    initial: 'V',
  },
  {
    stars: 5,
    body: 'Cooked to order — you can tell nothing sat around. Consistent every time.',
    who: 'Regular order',
    initial: 'C',
  },
  {
    stars: 5,
    body: 'No onion–garlic option done right, without compromising on flavour.',
    who: 'Festival / pooja meal',
    initial: 'P',
  },
] as const;

export function TestimonialsSection() {
  return (
    <section className="mt-7">
      <SectionHead eyebrow="Kind words" title="Why people love VRF" />

      <div className="mt-6 flex gap-3.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2 snap-x stagger">
        {NOTES.map((n) => (
          <div key={n.who} className="tml-card shrink-0 w-[270px] snap-start">
            <span className="tml-quote">&ldquo;</span>
            <span className="tml-stars -mt-2 block">
              {Array.from({ length: n.stars }, (_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </span>
            <p className="text-[13px] text-[var(--ink)] leading-relaxed mt-2">{n.body}</p>
            <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-dashed border-[var(--line)]">
              <span className="tml-avatar">{n.initial}</span>
              <span className="text-[12px] font-bold text-[var(--ink-2)]">{n.who}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
