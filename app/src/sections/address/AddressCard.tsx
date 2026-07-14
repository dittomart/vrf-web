import { Bike, Briefcase, Check, House, MapPin, Phone, Trash2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { VRF } from '@/api/_seed';
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
  onRemove: (id: string) => void;
}

/** The card's two visible lines: `line` (flat + landmark) and `area` — the
    prototype's shape, rebuilt from the typed Address fields. */
function lineOf(a: Address): string {
  return a.landmark ? `${a.houseNo}, ${a.landmark}` : a.houseNo;
}

export function AddressCard({ address: a, selected: on, onSelect, onRemove }: Props) {
  const TagIcon = TAG_ICON[a.label] ?? MapPin;

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
          <p className="text-xs text-[var(--ink-2)] mt-0.5">{a.street}</p>
          <p className="text-[11px] text-[var(--green)] font-semibold mt-2 flex items-center gap-1">
            <Bike className="w-3.5 h-3.5" /> Delivers in ~{VRF.eta} min
          </p>
        </div>
        <span className={`addr-radio${on ? ' is-on' : ''}`}>{on ? <Check className="w-3.5 h-3.5" /> : null}</span>
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--line)]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(a.id);
          }}
          className="flex-1 text-xs font-bold text-[var(--ink-2)] py-1.5 rounded-lg press flex items-center justify-center gap-1.5 hover:text-[var(--brand)]"
        >
          <Trash2 className="w-3.5 h-3.5" /> Remove
        </button>
        <div className="w-px bg-[var(--line)]" />
        <a
          href={`tel:${VRF.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 text-xs font-bold text-[var(--ink-2)] py-1.5 rounded-lg press flex items-center justify-center gap-1.5 hover:text-[var(--green)]"
        >
          <Phone className="w-3.5 h-3.5" /> Contact
        </a>
      </div>
    </div>
  );
}
