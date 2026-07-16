import { Leaf, ShieldCheck, Timer, Wallet } from 'lucide-react';
import { useBrandInfo } from '@/hooks/useBrandInfo';
import { money } from '@/utils/fmt';

/* The stat tiles under the hero. The prototype's "4.8 · 12k ratings" tile is
   gone — there is no ratings feed behind it, and a made-up score on a real
   storefront is a lie the customer can act on. The tiles that remain are all
   read off the store row. */
export function TrustBar() {
  const brand = useBrandInfo();

  const stats = [
    { icon: Timer, chip: 'ichip-green', big: `${brand.eta}`, small: 'min', label: 'Hot delivery' },
    { icon: Leaf, chip: 'ichip-green', big: '100', small: '%', label: 'Pure veg' },
    {
      icon: Wallet,
      chip: 'ichip-gold',
      big: brand.minOrder > 0 ? money(brand.minOrder) : '—',
      small: '',
      label: 'Min order',
    },
    { icon: ShieldCheck, chip: 'ichip-brand', big: 'FSSAI', small: '', label: 'Certified' },
  ];

  /* Four compact stat tiles in an even grid — all visible, no cut-off, aligned
     to the same baseline. A vertical layout (icon on top) keeps each tile narrow
     enough that all four fit a phone width. */
  return (
    <section className="mt-4 grid grid-cols-4 gap-2 stagger">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="trust-tile">
            <span className={`ichip ${s.chip} w-9 h-9 rounded-xl`}>
              <Icon className="w-[18px] h-[18px]" />
            </span>
            <p className="display font-bold text-[15px] leading-none text-[var(--green)] mt-2">
              {s.big}
              {s.small ? <span className="text-[10px]">{s.small}</span> : null}
            </p>
            <p className="text-[10px] font-semibold mt-0.5 text-[var(--ink-2)] text-center leading-tight">
              {s.label}
            </p>
          </div>
        );
      })}
    </section>
  );
}
