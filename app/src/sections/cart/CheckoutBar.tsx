import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { money } from '@/utils/fmt';

/* cart.html — the fixed checkout bar. theme.css reserves the page's bottom
   padding with `body:has(#checkout-bar:not(.hidden))`, so this element stays
   mounted at all times and only toggles the `hidden` class.

   `disabled` is the store's minimum-order rule: the backend would reject the
   order anyway, so the bar blocks it here rather than letting the customer walk
   all the way to the payment screen first. */
export function CheckoutBar({
  total,
  visible,
  disabled = false,
}: {
  total: number;
  visible: boolean;
  disabled?: boolean;
}) {
  const navigate = useNavigate();

  return (
    <div
      id="checkout-bar"
      className={`${visible ? '' : 'hidden '}fixed bottom-0 inset-x-0 z-30 glass border-t border-[var(--line)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0">
            <p className="eyebrow eyebrow-g mb-0.5">Total</p>
            <p className="display font-bold text-xl tnum leading-none" id="bar-total">
              {money(total)}
            </p>
          </div>
          <button
            onClick={() => navigate('/address')}
            disabled={disabled}
            className="flex-1 pill cta-lux-accent ripple shine justify-center disabled:opacity-50"
          >
            Choose address <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[11px] text-[var(--ink-2)] flex items-center justify-center gap-1.5 mt-2.5 whitespace-nowrap truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--green)] shrink-0" /> Safe &amp; secure checkout ·
          Inclusive of all taxes
        </p>
      </div>
    </div>
  );
}
