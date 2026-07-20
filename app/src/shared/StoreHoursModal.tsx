import { MapPin, X } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useBrandInfo } from '@/hooks/useBrandInfo';
import { isStoreOpenNow, weekHours } from '@/utils/storeHours';

/* The kitchen's real opening hours, off the store's schedule. When the admin
   runs the store by hand there is no schedule to show — only whether it is open
   right now, which is the thing the customer actually came here to find out. */
export function StoreHoursModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const store = useAppStore((s) => s.storeLocation);
  const brand = useBrandInfo();

  if (!open) return null;

  const week = weekHours(store).filter((d) => d.hours);
  const openNow = isStoreOpenNow(store);

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
          <button onClick={onClose} className="press w-11 h-11 flex items-center justify-center -mr-2" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-3">
          <span className={openNow ? 'badge badge-green' : 'badge badge-accent'}>
            {openNow ? 'Open now' : 'Closed right now'}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          {week.length > 0 ? (
            week.map((d) => (
              <div key={d.day} className="flex justify-between py-1.5 border-b border-[var(--line)]">
                <span>{d.day}</span>
                <span className="font-semibold">{d.hours}</span>
              </div>
            ))
          ) : (
            <p className="text-[var(--ink-2)] text-[13px] py-1.5">
              This kitchen opens and closes by hand rather than on a fixed schedule.
            </p>
          )}

          {brand.address ? (
            <div className="flex items-start gap-2 py-1.5 text-[var(--ink-2)]">
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--green)]" />
              <span className="text-[12px] leading-relaxed">
                {brand.address}
                {brand.landmark ? (
                  <>
                    <br />
                    {brand.landmark}
                  </>
                ) : null}
              </span>
            </div>
          ) : null}
        </div>

        <button onClick={onClose} className="w-full mt-4 btn-primary press font-semibold py-3 rounded-2xl">
          Got it
        </button>
      </div>
    </div>
  );
}
