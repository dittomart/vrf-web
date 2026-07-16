import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Lock, ShieldCheck } from 'lucide-react';

import { startPayuCheckout, useCreatePayuOrder } from '@/api/mutations/usePayu';
import { isPhonePeGateway, phonePeBridgeUrl } from '@/api/mutations/usePhonePe';
import { toast } from '@/store/appStore';
import { useBrandInfo } from '@/hooks/useBrandInfo';

/* The handoff between /place-order and the gateway.

   The order is ALREADY placed by the time this screen mounts — it is sitting on
   the backend awaiting payment. So nothing here may silently drop the customer:
   every failure path names the order and sends them somewhere they can still pay
   for or track it.

   PayU: a signed form POST from this page.
   PhonePe: opens the app.dittomart.in bridge (/phonepe/pay/{id}) in a NEW TAB —
   the bridge forwards to PhonePe from the onboarded domain so PhonePe accepts
   the origin. A new tab needs a user gesture (popup blockers eat programmatic
   window.open after an await), so PhonePe shows a "Continue" button instead of
   auto-forwarding. */
export default function PaymentProcessingPage() {
  const navigate = useNavigate();
  const brand = useBrandInfo();
  const createPayu = useCreatePayuOrder();

  const [step, setStep] = useState(1);
  /** set when the chosen gateway is PhonePe: we render a tap-to-open card
      instead of the auto-forwarding spinner. */
  const [phonePeUrl, setPhonePeUrl] = useState<string | null>(null);
  const started = useRef(false);
  const uniqueIdRef = useRef<string>('');

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const orderId = sessionStorage.getItem('pending_order_id');
    const uniqueId = sessionStorage.getItem('pending_unique_order_id') ?? '';
    const method = sessionStorage.getItem('pending_payment_method') ?? '';
    uniqueIdRef.current = uniqueId;

    if (!orderId) {
      navigate('/home', { replace: true });
      return;
    }

    const savedOrderFallback = () =>
      navigate(uniqueId ? `/running-order/${uniqueId}` : '/my-orders', { replace: true });

    // PhonePe: no API call here — the bridge initiates the payment itself. We
    // just present its URL for the customer to open in a new tab.
    if (isPhonePeGateway(method)) {
      setPhonePeUrl(phonePeBridgeUrl(Number(orderId)));
      setStep(3);
      return;
    }

    void (async () => {
      // PayU: a signed form POST hands the customer off.
      try {
        setStep(2);
        const handoff = await createPayu.mutateAsync(Number(orderId));

        if (!handoff) {
          toast('The gateway could not be opened — your order is saved', 'alert-circle');
          savedOrderFallback();
          return;
        }

        setStep(3);
        const mode = startPayuCheckout(handoff);

        /* Inside a native shell the payment happens outside the page, and the
           host tells us how it went. */
        if (mode === 'webview') {
          const onMessage = (e: MessageEvent) => {
            let payload: unknown = e.data;
            if (typeof payload === 'string') {
              try {
                payload = JSON.parse(payload);
              } catch {
                return;
              }
            }
            const msg = payload as { type?: string; status?: string };
            if (msg?.type !== 'PAYMENT_RESULT') return;

            if (msg.status === 'SUCCESS') {
              navigate(uniqueId ? `/running-order/${uniqueId}` : '/my-orders', { replace: true });
            } else {
              toast('The payment did not go through', 'alert-circle');
              navigate('/my-orders', { replace: true });
            }
          };
          window.addEventListener('message', onMessage);
        }
      } catch {
        toast('The payment could not be started — your order is saved', 'alert-circle');
        savedOrderFallback();
      }
    })();
  }, [createPayu, navigate]);

  const steps = ['Confirming your order', 'Preparing secure checkout', 'Opening the payment gateway'];

  // PhonePe: a tap-to-open card. Opening in a new tab keeps this order page
  // alive, so after paying the customer can come back here to track it.
  if (phonePeUrl) {
    const openPhonePe = () => {
      window.open(phonePeUrl, '_blank', 'noopener');
    };
    return (
      <div className="page-enter min-h-screen flex items-center justify-center bg-[var(--ivory)] text-[var(--ink)] px-6">
        <div className="ui-card-lux card-topline w-full max-w-sm p-7 text-center anim-scalein">
          <div className="logo-tile w-12 h-12 mx-auto mb-4" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <img src={brand.logo} alt={brand.brand} />
          </div>

          <p className="display font-bold text-lg mt-2">Pay with PhonePe</p>
          <p className="text-xs text-[var(--ink-2)] mt-1 leading-relaxed">
            PhonePe opens in a new tab. Finish the payment there, then come back
            to this tab to track your order.
          </p>

          <button
            type="button"
            onClick={openPhonePe}
            className="mt-5 w-full cta-lux-accent shine ripple font-bold py-4 rounded-2xl press flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" /> Continue to PhonePe
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                uniqueIdRef.current ? `/running-order/${uniqueIdRef.current}` : '/my-orders',
                { replace: true }
              )
            }
            className="mt-3 text-xs font-bold text-[var(--ink-2)] press"
          >
            I&apos;ve paid — track my order
          </button>

          <div className="div-label my-4">SECURE</div>
          <p className="text-[11px] text-[var(--ink-2)] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--green)]" /> Encrypted &amp; secure
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter min-h-screen flex items-center justify-center bg-[var(--ivory)] text-[var(--ink)] px-6">
      <div className="ui-card-lux card-topline w-full max-w-sm p-7 text-center anim-scalein">
        <div className="logo-tile w-12 h-12 mx-auto mb-4" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <img src={brand.logo} alt={brand.brand} />
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

        <p className="display font-bold text-lg mt-4">{steps[step - 1]}</p>
        <p className="text-xs text-[var(--ink-2)] mt-1">Step {step} of 3</p>

        <div className="div-label my-4">SECURE</div>
        <p className="text-[11px] text-[var(--ink-2)] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--green)]" /> Encrypted &amp; secure · do not
          close this window
        </p>
      </div>
    </div>
  );
}
