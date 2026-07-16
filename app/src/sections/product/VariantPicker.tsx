import { money } from '@/utils/fmt';
import type { AddonGroup, Customization } from '@/types';

/* product.html — the serving-size picker. The prototype multiplied the price by
   a made-up factor (Regular ×1, Large ×1.5); the real portions are the store's
   own addon options, and each one carries the price the kitchen charges for it.

   A SINGLE group is a radio (pick one — this is the portion). A MULTIPLE group
   is a checkbox row (extras), rendered with the same tiles so the page reads the
   same. */
export function VariantPicker({
  groups,
  chosen,
  onChange,
}: {
  groups: AddonGroup[];
  chosen: Customization[];
  onChange: (next: Customization[]) => void;
}) {
  if (groups.length === 0) return null;

  const isOn = (groupId: number, addonId: number) =>
    chosen.some((c) => c.groupId === groupId && c.addonId === addonId);

  const pick = (g: AddonGroup, optionId: number) => {
    const opt = g.options.find((o) => o.id === optionId);
    if (!opt) return;

    const entry: Customization = {
      groupId: g.id,
      groupName: g.name,
      addonId: opt.id,
      addonName: opt.name,
      price: opt.price,
    };

    if (g.type === 'SINGLE') {
      // exactly one choice per group — swap, never accumulate
      onChange([...chosen.filter((c) => c.groupId !== g.id), entry]);
      return;
    }

    const already = isOn(g.id, opt.id);
    if (already) {
      onChange(chosen.filter((c) => !(c.groupId === g.id && c.addonId === opt.id)));
      return;
    }

    const inGroup = chosen.filter((c) => c.groupId === g.id).length;
    if (g.limit > 0 && inGroup >= g.limit) return; // the store's own cap
    onChange([...chosen, entry]);
  };

  return (
    <div id="variants" className="mt-3 space-y-4">
      {groups.map((g) => (
        <div key={g.id}>
          <p className="fld-label">
            {g.name}
            {g.type === 'MULTIPLE' ? ' (optional)' : ''}
          </p>
          <div className="flex gap-2.5 flex-wrap">
            {g.options.map((o) => {
              const on = isOn(g.id, o.id);
              return (
                <button
                  key={o.id}
                  data-v={o.name}
                  onClick={() => pick(g, o.id)}
                  className={`flex-1 min-w-[92px] rounded-xl border-2 py-2.5 text-sm font-bold press transition ${
                    on
                      ? 'border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]'
                      : 'border-[var(--line)] text-[var(--ink)]'
                  }`}
                >
                  {o.name}
                  <br />
                  <span className="text-[11px] font-medium text-[var(--ink-2)]">
                    {o.price > 0 ? money(o.price) : 'Included'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
