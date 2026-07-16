import { type ComponentType } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bike,
  CheckCheck,
  ChefHat,
  ExternalLink,
  MessageCircle,
  PackageCheck,
  Phone,
  ReceiptText,
  Route,
  X,
} from 'lucide-react';

import { useGetOrder, useTrackOrder } from '@/api/queries/useOrders';
import { TrackingMap } from '@/sections/tracking/TrackingMap';
import { SmartImage } from '@/shared/SmartImage';
import { useOrderStore } from '@/store/orderStore';
import { digitsOnly, useBrandInfo } from '@/hooks/useBrandInfo';
import { useReveal } from '@/hooks/useReveal';
import { useStickyBar } from '@/hooks/useStickyBar';
import type { OrderStatus } from '@/types';

interface Step {
  key: OrderStatus;
  t: string;
  s: string;
  e: ComponentType<{ className?: string }>;
}

/* The kitchen's real stages. The prototype auto-advanced these on a timer, which
   told the customer their food was on the way whether or not it was. */
const STEPS: Step[] = [
  { key: 'placed', t: 'Order Placed', s: "We've received your order", e: ReceiptText },
  { key: 'confirmed', t: 'Order Accepted', s: 'The kitchen confirmed your order', e: CheckCheck },
  { key: 'preparing', t: 'Preparing food', s: 'Our chef is cooking it fresh', e: ChefHat },
  { key: 'out-for-delivery', t: 'Out for delivery', s: 'Your food is on its way', e: Bike },
  { key: 'delivered', t: 'Delivered', s: 'Enjoy your meal!', e: PackageCheck },
];

function stepIndex(status: OrderStatus | undefined): number {
  switch (status) {
    case 'confirmed':
      return 1;
    case 'preparing':
    case 'ready':
      return 2;
    case 'out-for-delivery':
      return 3;
    case 'delivered':
      return 4;
    default:
      // placed, awaiting-payment, payment-failed, cancelled all sit at step 0
      return 0;
  }
}

export default function TrackingPage() {
  const { uniqueOrderId } = useParams<{ uniqueOrderId: string }>();
  const lastOrderId = useOrderStore((s) => s.lastOrderId);
  const id = uniqueOrderId ?? lastOrderId ?? undefined;

  const brand = useBrandInfo();
  const stuck = useStickyBar();
  useReveal();

  const { order } = useGetOrder(id);
  const { data: track } = useTrackOrder(id);

  // the live poll is the truth; the order row is the fallback until it answers
  const status = track?.status ?? order?.status;
  const cur = stepIndex(status);
  const paymentFailed = status === 'payment-failed';
  // a failed payment is a dead end just like a cancellation — same red X state
  const cancelled = status === 'cancelled' || paymentFailed;

  const step = STEPS[cur];
  const StatusIcon = cancelled ? X : step.e;
  const eta = Math.max(2, brand.eta - cur * 8);
  const phone = digitsOnly(track?.rider?.phone || brand.phone);

  if (!id) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-8 text-center">
        <div className="empty-emoji">
          <ReceiptText className="w-9 h-9 text-[var(--brand)]" />
        </div>
        <p className="empty-title">Nothing to track</p>
        <p className="empty-sub">Place an order and you can follow it live from here.</p>
        <Link to="/orders" className="pill pill-accent mt-4">
          My orders
        </Link>
      </div>
    );
  }

  return (
    <div className="page-enter bg-[var(--cream)] text-[var(--ink)] pb-28">
      <header className={`appbar${stuck ? ' is-stuck' : ''}`}>
        <div className="appbar-inner narrow flex items-center gap-3">
          <Link to="/home" className="ibtn ibtn-ghost shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="appbar-title">Track Order</h1>
          <span className="ml-auto text-sm font-semibold text-[var(--green)]">#{id}</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6">
        <TrackingMap step={cur} eta={eta} />

        <div className="lg-2col mt-4">
          <div>
            <div
              className="relative ui-card ui-card-lux card-topline ui-card-pad mt-4 overflow-hidden reveal"
              data-d="1"
            >
              <div className="relative flex items-center gap-3.5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center bob shrink-0"
                  style={{ background: 'linear-gradient(135deg,var(--brand-soft),var(--gold-soft))' }}
                >
                  <StatusIcon className="w-7 h-7 text-[var(--brand)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="eyebrow eyebrow-g mb-0.5">Live status</p>
                  <p className="display font-bold text-lg leading-tight">
                    {paymentFailed ? 'Payment failed' : cancelled ? 'Order cancelled' : step.t}
                  </p>
                  <p className="text-xs text-[var(--ink-2)] mt-0.5">
                    {paymentFailed
                      ? "The payment didn't go through, so this order wasn't placed. You can try again from your cart."
                      : cancelled
                        ? 'This order was cancelled. No payment is due.'
                        : step.s}
                  </p>
                </div>
              </div>

              {track?.trackingUrl ? (
                <a
                  href={track.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 btn-outline press text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open live map
                </a>
              ) : null}
            </div>

            <div className="ui-card ui-card-lux ui-card-pad mt-4 reveal" data-d="2">
              <div className="sec-head mb-4">
                <span className="ichip ichip-green w-8 h-8 rounded-lg">
                  <Route className="w-4 h-4" />
                </span>
                <p className="eyebrow-g eyebrow">Order journey</p>
              </div>
              <div className="space-y-0">
                {STEPS.map((st, i) => {
                  const done = i < cur;
                  const active = i === cur && !cancelled;
                  return (
                    <div key={st.key} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            done || active ? 'bg-[var(--brand)] text-white' : 'text-[var(--ink-2)]'
                          }`}
                          style={done || active ? undefined : { background: 'var(--ivory-2)' }}
                        >
                          {done ? '✓' : i + 1}
                        </div>
                        {i < STEPS.length - 1 && (
                          <div
                            className="w-0.5 flex-1 min-h-[28px]"
                            style={{ background: done ? 'var(--brand)' : 'var(--line)' }}
                          />
                        )}
                      </div>
                      <div className={`pb-4 ${active ? '' : 'opacity-' + (done ? '100' : '50')}`}>
                        <p className={`font-semibold text-sm ${active ? 'text-[var(--brand)]' : ''}`}>
                          {st.t}
                        </p>
                        <p className="text-xs text-[var(--ink-2)]">{st.s}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg-aside">
            {track?.rider ? (
              <div className="ui-card ui-card-lux card-topline ui-card-pad mt-4 flex items-center gap-3 reveal">
                {track.rider.photo ? (
                  <div className="frame rounded-full shrink-0">
                    <SmartImage
                      src={track.rider.photo}
                      className="w-12 h-12 rounded-full object-cover"
                      alt={track.rider.name}
                    />
                  </div>
                ) : null}
                <div className="flex-1 min-w-0">
                  <p className="eyebrow eyebrow-g mb-0.5">Delivery partner</p>
                  <p className="font-bold text-sm">{track.rider.name}</p>
                  {track.rider.rating > 0 ? (
                    <p className="text-xs text-[var(--ink-2)]">
                      <span className="text-[var(--brand)] font-semibold">★ {track.rider.rating}</span>
                    </p>
                  ) : null}
                </div>
                {phone ? (
                  <a href={`tel:${phone}`} className="ichip ichip-green w-11 h-11 press">
                    <Phone className="w-5 h-5" />
                  </a>
                ) : null}
              </div>
            ) : null}

            {phone ? (
              <a
                href={`https://wa.me/${phone.length === 10 ? `91${phone}` : phone}`}
                className="ui-card ui-card-pad mt-4 flex items-center gap-3 press"
              >
                <span className="ichip ichip-green w-11 h-11">
                  <MessageCircle className="w-5 h-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">Need help with this order?</p>
                  <p className="text-xs text-[var(--ink-2)] mt-0.5">Message the kitchen on WhatsApp</p>
                </div>
              </a>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
