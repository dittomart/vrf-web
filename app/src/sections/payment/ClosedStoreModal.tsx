import { Moon } from 'lucide-react';

interface Props {
  open: boolean;
  onBackHome: () => void;
  onDismiss: () => void;
}

/* payment.html's closed-store error — the backend-rejection demo: the kitchen
   refused the order, so no payment was taken. */
export function ClosedStoreModal({ open, onBackHome, onDismiss }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="ui-card-lux card-topline w-full max-w-sm p-6 sm:p-7 text-center anim-scalein">
        <div className="empty-emoji">
          <Moon className="w-9 h-9 text-[var(--brand)]" />
        </div>
        <h3 className="display font-bold text-xl mt-1">Kitchen is closed right now</h3>
        <p className="text-sm text-[var(--ink-2)] mt-1">
          We couldn&apos;t accept your order because the store is currently closed. No payment was
          taken.
        </p>
        <button
          type="button"
          onClick={onBackHome}
          className="w-full mt-5 cta-lux-accent shine ripple font-bold py-3.5 rounded-2xl press"
        >
          Back to home
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="w-full mt-2 text-[var(--ink-2)] text-sm py-2 font-semibold"
        >
          View store hours
        </button>
      </div>
    </div>
  );
}
