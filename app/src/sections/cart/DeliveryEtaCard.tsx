import { Bike, Flame, Leaf, Zap } from 'lucide-react';
import { VRF } from '@/api/_seed';
import { useLocationStore } from '@/store/locationStore';

/* cart.html — "delivery eta" card, verbatim. */
export function DeliveryEtaCard() {
  const location = useLocationStore((s) => s.location);
  const deliverTo = location?.address ? `to ${location.address.split(',')[0]}` : 'to your saved location';

  return (
    <div className="relative ui-card ui-card-lux card-topline ui-card-pad overflow-hidden mb-5 reveal">
      <div
        className="absolute -top-10 -right-8 w-32 h-32 rounded-full blur-2xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle,color-mix(in srgb, var(--gold) 35%, transparent),transparent 70%)',
        }}
      />
      <div className="relative flex items-center gap-3.5">
        <div className="ichip ichip-brand w-12 h-12 bob">
          <Bike className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="eyebrow eyebrow-g mb-0.5">Estimated arrival</p>
          <p className="display font-bold text-lg leading-tight">Delivery in {VRF.eta} minutes</p>
          <p className="text-xs text-[var(--ink-2)] truncate mt-0.5" id="deliver-to">
            {deliverTo}
          </p>
        </div>
        <span className="badge badge-gold shrink-0">
          <Zap className="w-3 h-3" /> Fast
        </span>
      </div>
      <div className="relative mt-3.5 pt-3 border-t border-dashed border-[var(--line)] flex items-center gap-2 flex-wrap">
        <span className="badge badge-green">
          <Leaf className="w-3 h-3" /> 100% Pure Veg
        </span>
        <span className="badge badge-green">
          <Flame className="w-3 h-3" /> Cooked fresh
        </span>
        <span className="badge badge-accent">
          <Bike className="w-3 h-3" /> Live tracking
        </span>
      </div>
    </div>
  );
}
