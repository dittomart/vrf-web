import { money } from '@/utils/fmt';

export interface Variant {
  n: string;
  m: number;
}

/* product.html — serving-size variants. The multiplier scales the unit price;
   the label shows what that portion costs. */
export const VARIANTS: Variant[] = [
  { n: 'Regular', m: 1 },
  { n: 'Large', m: 1.5 },
  { n: 'Family', m: 2.4 },
];

export function VariantPicker({
  price,
  portion,
  onSelect,
}: {
  price: number;
  portion: string;
  onSelect: (v: Variant) => void;
}) {
  return (
    <div id="variants" className="flex gap-2.5 mt-3">
      {VARIANTS.map((v) => (
        <button
          key={v.n}
          data-v={v.n}
          onClick={() => onSelect(v)}
          className={`flex-1 rounded-xl border-2 py-2.5 text-sm font-bold press transition ${
            portion === v.n
              ? 'border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]'
              : 'border-[var(--line)] text-[var(--ink)]'
          }`}
        >
          {v.n}
          <br />
          <span className="text-[11px] font-medium text-[var(--ink-2)]">{money(Math.round(price * v.m))}</span>
        </button>
      ))}
    </div>
  );
}
