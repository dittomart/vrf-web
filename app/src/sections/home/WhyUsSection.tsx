import { ChefHat, Leaf, ShieldCheck, Truck } from 'lucide-react';
import { SectionHead } from '@/sections/home/SectionHead';

/* A static "why order from us" band. Unlike the catalog-driven sections it never
   goes empty, so a fresh kitchen with one dish still gets a home page that feels
   built-out rather than half-loaded. Pure brand storytelling — no data gate. */
const FEATURES = [
  {
    icon: Leaf,
    title: '100% Pure Veg',
    body: 'A strictly vegetarian kitchen — no cross-contamination, ever.',
    chip: 'ichip-green',
  },
  {
    icon: ChefHat,
    title: 'Cooked to order',
    body: 'Nothing sits under a heat lamp. Every plate is made when you order it.',
    chip: 'ichip-gold',
  },
  {
    icon: Truck,
    title: 'Fast delivery',
    body: 'Hot, home-style food at your door — quick and hyperlocal.',
    chip: 'ichip-brand',
  },
  {
    icon: ShieldCheck,
    title: 'Hygiene first',
    body: 'FSSAI-certified prep, sealed packaging, contactless handoff.',
    chip: 'ichip-green',
  },
] as const;

export function WhyUsSection() {
  return (
    <section className="mt-7">
      <SectionHead eyebrow="The VRF promise" title="Why families trust us" />

      <div className="mt-6 grid grid-cols-2 gap-3.5 stagger">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="why-card">
              <span className={`ichip ${f.chip} w-12 h-12 rounded-2xl`}>
                <Icon className="w-5 h-5" />
              </span>
              <p className="font-bold text-[13.5px] mt-3.5">{f.title}</p>
              <p className="text-[11.5px] text-[var(--ink-2)] mt-1 leading-relaxed">{f.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
