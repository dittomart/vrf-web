import { useEffect, useRef, useState, type ComponentType } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bike,
  CheckCheck,
  ChefHat,
  MessageCircle,
  PackageCheck,
  Phone,
  ReceiptText,
  RotateCcw,
  Route,
} from 'lucide-react';

import { VRF } from '@/api/_seed';
import { TrackingMap } from '@/sections/tracking/TrackingMap';
import { SmartImage } from '@/shared/SmartImage';
import { toast } from '@/store/appStore';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { useReveal } from '@/hooks/useReveal';
import { useStickyBar } from '@/hooks/useStickyBar';

interface Step {
  t: string;
  s: string;
  /** the prototype's data-lucide name, as a component */
  e: ComponentType<{ className?: string }>;
}

const STEPS: Step[] = [
  { t: 'Order Placed', s: "We've received your order", e: ReceiptText },
  { t: 'Order Accepted', s: 'Kitchen confirmed your order', e: CheckCheck },
  { t: 'Preparing food', s: 'Our chef is cooking it fresh', e: ChefHat },
  { t: 'Out for delivery', s: 'Suresh is on the way with your food', e: Bike },
  { t: 'Delivered', s: 'Enjoy your meal!', e: PackageCheck },
];

export default function TrackingPage() {
  const orders = useOrderStore((s) => s.orders);
  const lastOrderId = useOrderStore((s) => s.lastOrderId);
  const add = useCartStore((s) => s.add);
  const navigate = useNavigate();
  const stuck = useStickyBar();
  useReveal();

  /* start at "Preparing food", exactly like the prototype's `let cur = 2` */
  const [cur, setCur] = useState(2);
  const jumpTimer = useRef<number | null>(null);

  const order = orders.find((o) => o.id === lastOrderId) ?? orders[0] ?? null;
  const oid = order?.id ?? 'VRF000000';

  /* auto-advance every 4s until delivered */
  useEffect(() => {
    const auto = window.setInterval(() => {
      setCur((c) => (c < STEPS.length - 1 ? c + 1 : c));
    }, 4000);
    return () => window.clearInterval(auto);
  }, []);

  useEffect(
    () => () => {
      if (jumpTimer.current !== null) window.clearTimeout(jumpTimer.current);
    },
    []
  );

  const jump = () => setCur((c) => (c < STEPS.length - 1 ? c + 1 : c));

  const onReorder = () => {
    (order?.items ?? []).forEach((i) => add(i.id, i.qty));
    toast('Items added to cart', 'rotate-ccw');
    jumpTimer.current = window.setTimeout(() => navigate('/cart'), 600);
  };

  const step = STEPS[cur];
  const StatusIcon = step.e;
  const eta = Math.max(2, VRF.eta - cur * 8);

  return (
    <div className="page-enter bg-[var(--cream)] text-[var(--ink)] pb-28">
      <header className={`appbar${stuck ? ' is-stuck' : ''}`}>
        <div className="appbar-inner narrow flex items-center gap-3">
          <Link to="/home" className="ibtn ibtn-ghost shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="appbar-title">Track Order</h1>
          <span className="ml-auto text-sm font-semibold text-[var(--green)]">#{oid}</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6">
        {/* map mock */}
        <TrackingMap step={cur} eta={eta} />

        <div className="lg-2col mt-4">
          <div>
            {/* status banner */}
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
                  <p className="display font-bold text-lg leading-tight">{step.t}</p>
                  <p className="text-xs text-[var(--ink-2)] mt-0.5">{step.s}</p>
                </div>
              </div>
            </div>

            {/* timeline */}
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
                  const active = i === cur;
                  return (
                    <div key={st.t} className="flex gap-3">
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
            {/* delivery partner */}
            {cur >= 3 && (
              <div className="ui-card ui-card-lux card-topline ui-card-pad mt-4 flex items-center gap-3 reveal">
                <div className="frame rounded-full shrink-0">
                  <SmartImage
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                    className="w-12 h-12 rounded-full object-cover"
                    alt="rider"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="eyebrow eyebrow-g mb-0.5">Delivery partner</p>
                  <p className="font-bold text-sm">Suresh K.</p>
                  <p className="text-xs text-[var(--ink-2)]">
                    On the way · <span className="text-[var(--brand)] font-semibold">★ 4.9</span>
                  </p>
                </div>
                <a href={`tel:${VRF.phone}`} className="ichip ichip-green w-11 h-11 press">
                  <Phone className="w-5 h-5" />
                </a>
                <a href={`https://wa.me/91${VRF.whatsapp}`} className="ichip ichip-green w-11 h-11 press">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            )}

            {/* reorder CTA (shown when delivered) */}
            {cur >= 4 && (
              <div className="relative cta-lux text-white rounded-[22px] p-5 mt-4 flex items-center gap-3.5 shadow-lg overflow-hidden">
                <div
                  className="absolute -top-8 -right-6 w-28 h-28 rounded-full blur-2xl pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle,color-mix(in srgb, var(--gold) 40%, transparent),transparent 70%)',
                  }}
                />
                <div className="relative w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div className="relative flex-1 min-w-0">
                  <p className="script text-base leading-none" style={{ color: 'var(--gold)' }}>
                    Enjoyed your meal?
                  </p>
                  <p className="font-bold text-sm mt-1">Reorder the same in one tap</p>
                </div>
                <button
                  type="button"
                  onClick={onReorder}
                  className="relative bg-white text-[var(--green)] text-xs font-bold px-4 py-2.5 rounded-xl press shine"
                >
                  Reorder
                </button>
              </div>
            )}

            <button type="button" onClick={jump} className="w-full mt-5 text-xs text-[var(--ink-2)] underline">
              Demo: skip to next status
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
