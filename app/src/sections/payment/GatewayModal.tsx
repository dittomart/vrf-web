import { Lock, ShieldCheck, X } from 'lucide-react';
import { SmartImage } from '@/shared/SmartImage';
import { useBrandInfo } from '@/hooks/useBrandInfo';

/** The modal is a two-face machine: `processing` while /place-order is in
    flight, `fail` when it comes back rejected. `closed` = not mounted. */
export type GatewayPhase = 'closed' | 'processing' | 'fail';

interface Props {
  phase: GatewayPhase;
  /** the gateway code the customer picked, as the store spells it */
  method: string;
  onRetry: () => void;
  onChangeMethod: () => void;
}

export function GatewayModal({ phase, method, onRetry, onChangeMethod }: Props) {
  const brand = useBrandInfo();
  if (phase === 'closed') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="ui-card-lux card-topline w-full max-w-sm p-6 sm:p-7 text-center anim-scalein">
        {phase === 'processing' && (
          <div>
            <div className="logo-tile w-12 h-12 mx-auto mb-4" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <SmartImage src={brand.logo} alt={brand.brand} />
            </div>
            <div className="relative w-16 h-16 mx-auto">
              <div
                className="absolute inset-0 border-4 border-[var(--line)] border-t-[var(--brand)] rounded-full"
                style={{ animation: 'spin 0.8s linear infinite' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-5 h-5 text-[var(--brand)]" />
              </div>
            </div>
            <p className="display font-bold text-lg mt-4">Processing payment…</p>
            <p className="text-xs text-[var(--ink-2)] mt-1">via {method}</p>
            <div className="div-label my-4">SECURE</div>
            <p className="text-[11px] text-[var(--ink-2)] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--green)]" /> Encrypted &amp; secure · Do
              not close this window
            </p>
          </div>
        )}

        {phase === 'fail' && (
          <div>
            <div className="ichip ichip-brand w-16 h-16 mx-auto rounded-full">
              <X className="w-8 h-8" />
            </div>
            <h3 className="display font-bold text-xl mt-3">Payment failed</h3>
            <p className="text-sm text-[var(--ink-2)] mt-1">
              Your transaction couldn&apos;t be completed. No money was deducted.
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="w-full mt-5 cta-lux-accent shine ripple font-bold py-3.5 rounded-2xl press"
            >
              Retry payment
            </button>
            <button
              type="button"
              onClick={onChangeMethod}
              className="w-full mt-2 text-[var(--ink-2)] text-sm py-2 font-semibold"
            >
              Change payment method
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
