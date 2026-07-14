import { MapPin, Timer, UtensilsCrossed } from 'lucide-react';

/* tracking.html's inline SVG map mock, node-for-node. The rider group is
   translated as the order advances — the prototype set
   `transform: translate(cur*22px, -cur*12px)` with a 1s transition. */
export function TrackingMap({ step, eta }: { step: number; eta: number }) {
  return (
    <div
      className="relative rounded-[22px] overflow-hidden h-56 ui-card-lux card-topline reveal"
      style={{ background: 'var(--canvas-2)' }}
    >
      <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="200" fill="var(--canvas-2)" />
        <path
          d="M0 60 H400 M0 130 H400 M120 0 V200 M280 0 V200"
          stroke="var(--canvas-2)"
          strokeWidth="6"
          fill="none"
        />
        <rect x="150" y="72" width="40" height="34" rx="4" fill="var(--canvas-2)" />
        <rect x="300" y="140" width="46" height="40" rx="4" fill="var(--canvas-2)" />
        <path
          id="route"
          d="M60 150 C 140 150, 160 70, 280 60"
          stroke="var(--brand)"
          strokeWidth="4"
          fill="none"
          strokeDasharray="6 6"
        />
        <circle cx="60" cy="150" r="11" fill="var(--green)" opacity=".18" />
        <circle cx="60" cy="150" r="8" fill="var(--green)" />
        <circle cx="280" cy="60" r="11" fill="var(--brand)" opacity=".18" />
        <circle cx="280" cy="60" r="8" fill="var(--brand)" />
        <g
          id="rider"
          style={{ transform: `translate(${step * 22}px,${-step * 12}px)`, transition: 'transform 1s' }}
        >
          <circle cx="150" cy="118" r="14" fill="white" stroke="var(--brand)" strokeWidth="2" />
          <circle cx="150" cy="118" r="5" fill="var(--brand)" />
        </g>
      </svg>
      <div className="absolute top-3 left-3 glass rounded-full px-3.5 py-1.5 text-xs font-bold shadow flex items-center gap-1.5 border border-[var(--line)]">
        <Timer className="w-4 h-4 text-[var(--brand)]" /> <span>{eta}</span> min away
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
        <span className="badge badge-green bg-white/90">
          <UtensilsCrossed className="w-3 h-3" /> VRF Kitchen
        </span>
        <span className="badge badge-accent bg-white/90">
          <MapPin className="w-3 h-3" /> Your door
        </span>
      </div>
    </div>
  );
}
