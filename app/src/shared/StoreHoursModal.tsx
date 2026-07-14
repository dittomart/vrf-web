import { MapPin, X } from 'lucide-react';
import { VRF } from '@/api/_seed';

/* Static store hours — the prototype deliberately keeps NO open/closed logic in
   the frontend. Copy is verbatim from home.html's #hours-modal. */
export function StoreHoursModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/45 p-4"
      onClick={onClose}
    >
      <div
        className="card text-[var(--ink)] rounded-[24px] w-full max-w-sm p-6 a-scalein"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="display font-semibold text-xl">Store Hours</h3>
          <button onClick={onClose} className="press" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1.5 border-b border-[var(--line)]">
            <span>All days</span>
            <span className="font-semibold">{VRF.hours}</span>
          </div>
          <div className="flex items-start gap-2 py-1.5 text-[var(--ink-2)]">
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--green)]" />
            <span className="text-[12px] leading-relaxed">
              {VRF.addressLine}, {VRF.area}, {VRF.city}, {VRF.state} {VRF.pincode}
              <br />
              {VRF.landmark}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-[var(--ink-2)] mt-4">
          Orders placed outside these hours are held and confirmed once we reopen.
        </p>
        <button onClick={onClose} className="w-full mt-4 btn-primary press font-semibold py-3 rounded-2xl">
          Got it
        </button>
      </div>
    </div>
  );
}
