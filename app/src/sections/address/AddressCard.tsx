import { Bike, Briefcase, Check, House, MapPin, Pencil, Trash2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useBrandInfo } from '@/hooks/useBrandInfo';
import type { Address } from '@/types';

/* address.html — TAG_ICON = {Home:"house", Work:"briefcase", Other:"map-pin"} */
const TAG_ICON: Record<string, LucideIcon> = {
  Home: House,
  Work: Briefcase,
  Other: MapPin,
};

interface Props {
  address: Address;
  selected: boolean;
  onSelect: (id: string) => void;
  onEdit: (a: Address) => void;
  onRemove: (id: string) => void;
}

function lineOf(a: Address): string {
  return [a.houseNo, a.landmark].filter(Boolean).join(', ');
}

export function AddressCard({ address: a, selected: on, onSelect, onEdit, onRemove }: Props) {
  const TagIcon = TAG_ICON[a.label] ?? MapPin;
  const brand = useBrandInfo();

  return (
    <div onClick={() => onSelect(a.id)} className={`addr-card${on ? ' is-on' : ''}`}>
      <div className="flex items-start gap-3">
        <span className="addr-ico">
          <TagIcon />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-[15px] truncate">{a.label}</p>
            {on ? (
              <span className="badge badge-green">
                <Check className="w-3 h-3" /> Selected
              </span>
            ) : null}
          </div>
          <p className="text-sm text-[var(--ink)] mt-1 leading-snug">{lineOf(a)}</p>
          <p className="text-xs text-[var(--ink-2)] mt-0.5">
            {[a.street, a.city, a.pincode].filter(Boolean).join(', ')}
          </p>
          {a.receiverName || a.phone ? (
            <p className="text-xs text-[var(--ink-2)] mt-0.5">
              {[a.receiverName, a.phone].filter(Boolean).join(' · ')}
            </p>
          ) : null}
          <p className="text-[11px] text-[var(--green)] font-semibold mt-2 flex items-center gap-1">
            <Bike className="w-3.5 h-3.5" /> Delivers in ~{brand.eta} min
          </p>
        </div>
        <span className={`addr-radio${on ? ' is-on' : ''}`}>
          {on ? <Check className="w-3.5 h-3.5" /> : null}
        </span>
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--line)]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(a.id);
          }}
          className="flex-1 text-xs font-bold text-[var(--ink-2)] py-2.5 min-h-[44px] rounded-lg press flex items-center justify-center gap-1.5 hover:text-[var(--brand)]"
        >
          <Trash2 className="w-3.5 h-3.5" /> Remove
        </button>
        <div className="w-px bg-[var(--line)]" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(a);
          }}
          className="flex-1 text-xs font-bold text-[var(--ink-2)] py-2.5 min-h-[44px] rounded-lg press flex items-center justify-center gap-1.5 hover:text-[var(--green)]"
        >
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
      </div>
    </div>
  );
}
