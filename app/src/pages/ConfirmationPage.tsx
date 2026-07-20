import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bike,
  BookmarkPlus,
  Check,
  CheckCircle,
  ChefHat,
  Home,
  Leaf,
  MapPin,
  ReceiptText,
  Utensils,
} from 'lucide-react';

import '@/styles/confirmation.css';

import { useGetOrder } from '@/api/queries/useOrders';
import { SmartImage } from '@/shared/SmartImage';
import { toast } from '@/store/appStore';
import { useOrderStore } from '@/store/orderStore';
import { useSavedOrdersStore } from '@/store/savedOrdersStore';
import { useBrandInfo } from '@/hooks/useBrandInfo';
import { money } from '@/utils/fmt';
import { confetti } from '@/utils/confetti';

/* confirmation.html — the ticket receipt, driven by the order that was actually
   placed. It is also the PayU return target (/running-order/:uniqueOrderId), so
   it must stand on its own with nothing but an id in the URL: the server order is
   the source, and the snapshot taken at checkout only fills the gap while
   /brand/{slug}/get-orders catches up. */
export default function ConfirmationPage() {
  const { uniqueOrderId } = useParams<{ uniqueOrderId: string }>();
  const brand = useBrandInfo();

  const lastOrder = useOrderStore((s) => s.lastOrder);
  const lastOrderId = useOrderStore((s) => s.lastOrderId);
  const saveCombo = useSavedOrdersStore((s) => s.save);
  const [saved, setSaved] = useState(false);

  const id = uniqueOrderId ?? lastOrderId ?? undefined;
  const { order: serverOrder, isLoading } = useGetOrder(id);

  const order = serverOrder ?? (lastOrder && (!id || lastOrder.id === id) ? lastOrder : null);
  const oid = order?.id ?? id ?? '';

  const bars = useMemo(() => {
    const seed = [...oid].reduce((a, c) => a + c.charCodeAt(0), 0);
    return Array.from({ length: 36 }, (_, i) => ((seed * (i + 3)) % 4) + 1);
  }, [oid]);

  const bcNum = oid.replace(/(.{3})/g, '$1 ').trim();

  const etaAddr = order?.address
    ? `to ${[order.address.houseNo, order.address.street].filter(Boolean).join(', ')}`
    : 'to your saved address';

  useEffect(() => {
    confetti(44);
  }, []);

  const onSave = () => {
    if (!order) return;
    saveCombo({
      name: `My ${order.items[0]?.name ?? 'order'} combo`,
      items: order.items,
      total: order.total,
    });
    setSaved(true);
    toast('Order saved to favourites', 'bookmark-plus');
  };

  if (!order && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--ink-2)]">
        Loading your order…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-8 text-center">
        <div className="empty-emoji">
          <ReceiptText className="w-9 h-9 text-[var(--brand)]" />
        </div>
        <p className="empty-title">Order not found</p>
        <p className="empty-sub">We couldn&apos;t find {oid ? `order #${oid}` : 'that order'}.</p>
        <Link to="/orders" className="pill pill-accent mt-4">
          View my orders
        </Link>
      </div>
    );
  }

  return (
    <div
      className="page-enter text-[var(--ink)] min-h-screen"
      style={{ background: 'radial-gradient(120% 70% at 50% -5%,var(--brand-soft),var(--ivory) 55%)' }}
    >
      <div className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-center px-5 py-10">
        {/* success mark */}
        <div className="relative flex items-center justify-center mb-1">
          <span
            className="absolute w-44 h-44 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle,color-mix(in srgb, var(--primary) 22%, transparent),transparent 66%)',
            }}
          />
          <span
            className="absolute w-28 h-28 rounded-full"
            style={{ border: '2px solid var(--gold)', animation: 'ringPulse 1.9s ease-out infinite' }}
          />
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-[var(--shadow-lg)]"
            style={{
              background: 'linear-gradient(160deg,var(--green),var(--green-2))',
              animation: 'pop .6s cubic-bezier(.2,.9,.3,1.3) both',
            }}
          >
            <svg
              width="46"
              height="46"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M4 12.5 L9.5 18 L20 6"
                strokeDasharray="60"
                style={{ animation: 'checkDraw .5s ease .4s both' }}
              />
            </svg>
          </div>
        </div>

        <div className="flex gap-2 mt-4 h-7 items-end text-[var(--brand)]/40">
          <span className="steam h-4" style={{ animationDelay: '0s' }} />
          <span className="steam h-6" style={{ animationDelay: '.5s' }} />
          <span className="steam h-3" style={{ animationDelay: '1s' }} />
        </div>

        <span className="badge badge-green mt-2">
          <CheckCircle className="w-3.5 h-3.5" /> Order placed successfully
        </span>
        <h1 className="display text-[32px] font-bold mt-2 leading-tight a-fadeup">You&apos;re all set!</h1>
        <p className="text-[var(--ink-2)] mt-2 text-center max-w-xs">
          Our kitchen has started preparing your fresh, hot meal — cooked with love.
        </p>

        {/* ETA hero */}
        <div
          className="w-full mt-6 relative overflow-hidden rounded-[22px] p-5 text-white shadow-[var(--shadow-lg)] a-scalein on-brand"
          style={{ background: 'linear-gradient(135deg,var(--green-2),var(--green) 60%,var(--primary-2))' }}
        >
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/12 border border-white/15 flex items-center justify-center shrink-0">
              <Bike className="w-7 h-7 text-[var(--gold)]" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[11px] font-bold tracking-[.16em] uppercase" style={{ color: 'var(--gold)' }}>
                Estimated arrival
              </p>
              <p className="display text-2xl font-bold leading-none mt-1">
                In about {order.etaMin || brand.eta} minutes
              </p>
              <p className="text-white/70 text-xs mt-1 truncate">{etaAddr}</p>
            </div>
            <span
              className="w-2.5 h-2.5 rounded-full bg-[var(--gold)] shrink-0"
              style={{ animation: 'ringPulse 1.6s ease-out infinite' }}
            />
          </div>
        </div>

        {/* mini timeline */}
        <div className="w-full mt-6 px-1">
          <div className="flex items-center">
            <div className="flex flex-col items-center gap-1.5 shrink-0 min-w-0">
              <span
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white shrink-0 on-brand"
                style={{ background: 'linear-gradient(160deg,var(--green),var(--green-2))' }}
              >
                <Check className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold text-[var(--green)] text-center leading-tight min-w-0 break-words">Placed</span>
            </div>
            <div
              className="flex-1 h-0.5 mx-1 rounded-full"
              style={{ background: 'linear-gradient(90deg,var(--green),var(--gold))' }}
            />
            <div className="flex flex-col items-center gap-1.5 shrink-0 min-w-0">
              <span
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white shrink-0"
                style={{ background: 'var(--gold)' }}
              >
                <ChefHat className="w-4 h-4 text-[var(--ink)]" />
              </span>
              <span className="text-[10px] font-bold text-[var(--ink)] text-center leading-tight min-w-0 break-words">Cooking</span>
            </div>
            <div className="flex-1 h-0.5 mx-1 rounded-full bg-[var(--line)]" />
            <div className="flex flex-col items-center gap-1.5 shrink-0 min-w-0">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 border-[var(--line)] bg-white shrink-0">
                <Bike className="w-4 h-4 text-[var(--ink-2)]" />
              </span>
              <span className="text-[10px] font-semibold text-[var(--ink-2)] text-center leading-tight min-w-0 break-words">On the way</span>
            </div>
            <div className="flex-1 h-0.5 mx-1 rounded-full bg-[var(--line)]" />
            <div className="flex flex-col items-center gap-1.5 shrink-0 min-w-0">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 border-[var(--line)] bg-white shrink-0">
                <Home className="w-4 h-4 text-[var(--ink-2)]" />
              </span>
              <span className="text-[10px] font-semibold text-[var(--ink-2)] text-center leading-tight min-w-0 break-words">Delivered</span>
            </div>
          </div>
        </div>

        {/* TICKET */}
        <div className="conf-ticket w-full mt-8 a-scalein" style={{ '--notch': '150px' } as CSSProperties}>
          <div className="conf-ticket-top" />
          <div
            className="px-5 py-4 flex items-center gap-3 rounded-t-[24px]"
            style={{
              background:
                'linear-gradient(120deg,color-mix(in srgb, var(--primary) 6%, transparent),color-mix(in srgb, var(--gold) 14%, transparent))',
            }}
          >
            <div className="logo-tile w-11 h-11 shrink-0">
              <SmartImage src={brand.logo} alt={brand.brand} />
            </div>
            <div className="min-w-0">
              <p className="display font-bold text-[15px] leading-none">{brand.brand}</p>
              <p className="text-[11px] text-[var(--green)] font-semibold mt-1 flex items-center gap-1">
                <Leaf className="w-3 h-3" /> Pure Vegetarian
              </p>
            </div>
            <span className="ml-auto badge badge-green shrink-0">
              <CheckCircle className="w-3.5 h-3.5" /> {order.paymentMethod || 'Placed'}
            </span>
          </div>

          <div className="px-5 py-4 space-y-3">
            <div className="krow">
              <span className="text-[var(--ink-2)] text-sm">Order ID</span>
              <span className="font-bold tnum">#{oid}</span>
            </div>
            <div className="krow">
              <span className="text-[var(--ink-2)] text-sm">Arriving in</span>
              <span className="font-bold flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full bg-[var(--green)]"
                  style={{ animation: 'ringPulse 1.6s ease-out infinite' }}
                />{' '}
                {order.etaMin || brand.eta} min
              </span>
            </div>
          </div>

          <hr className="perf" />

          <div className="px-5 py-4 space-y-2">
            {order.items.length > 0 ? (
              order.items.map((i, idx) => (
                <div key={`${i.id}-${idx}`} className="flex items-center gap-3">
                  <div className="frame rounded-lg shrink-0">
                    <SmartImage src={i.image ?? ''} className="w-10 h-10 rounded-lg object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{i.name}</p>
                    <p className="text-[11px] text-[var(--ink-2)] mt-0.5">Qty {i.qty}</p>
                  </div>
                  <span className="font-bold tnum text-sm shrink-0">{money(i.price * i.qty)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--ink-2)]">Your items are being prepared.</p>
            )}
          </div>

          <hr className="perf" />

          <div className="px-5 py-4 flex justify-between items-center">
            <div>
              <p className="eyebrow eyebrow-g">Total</p>
              <p className="text-[11px] text-[var(--ink-2)] mt-0.5">incl. taxes &amp; delivery</p>
            </div>
            <span className="display text-[28px] font-bold tnum text-[var(--green)]">
              {money(order.total)}
            </span>
          </div>

          <hr className="perf" />
          <div className="px-5 py-4">
            <div className="barcode">
              {bars.map((w, i) => (
                <i key={i} style={{ width: `${w}px` }} />
              ))}
            </div>
            <p className="text-center text-[10px] text-[var(--ink-2)] font-mono tracking-[.2em] mt-2">
              {bcNum}
            </p>
          </div>
        </div>

        <div
          className="w-full ui-card-lux card-topline ui-card-pad mt-4 flex items-center gap-3"
          style={{ background: 'var(--gold-soft)', borderColor: 'var(--gold)' }}
        >
          <div
            className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shrink-0"
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            <BookmarkPlus className="w-5 h-5 text-[var(--brand)]" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-bold text-sm">Save this order</p>
            <p className="text-xs text-[var(--ink-2)] mt-0.5">Reorder your favourites in one tap next time</p>
          </div>
          <button
            type="button"
            onClick={onSave}
            disabled={saved}
            className={`cta-lux text-white text-xs font-bold px-4 py-2.5 min-h-[44px] rounded-xl press shrink-0${saved ? ' opacity-70' : ''}`}
          >
            {saved ? 'Saved ✓' : 'Save'}
          </button>
        </div>

        <Link to={`/tracking/${oid}`} className="w-full mt-5 cta-lux shine ripple pill justify-center py-4">
          <MapPin className="w-5 h-5" /> Track my order live
        </Link>
        <div className="w-full mt-3 grid grid-cols-2 gap-3">
          <Link
            to="/orders"
            className="ui-card ui-card-pad py-3 flex items-center justify-center gap-1.5 text-sm font-bold text-[var(--ink)] press"
          >
            <ReceiptText className="w-4 h-4 text-[var(--green)]" /> My orders
          </Link>
          <Link
            to="/home"
            className="ui-card ui-card-pad py-3 flex items-center justify-center gap-1.5 text-sm font-bold text-[var(--ink)] press"
          >
            <Utensils className="w-4 h-4 text-[var(--brand)]" /> Order more
          </Link>
        </div>
        <Link to="/home" className="mt-4 text-[var(--ink-2)] text-sm font-semibold py-2 inline-flex items-center gap-1.5 min-h-[44px] press">
          <ArrowLeft className="w-4 h-4" /> Continue browsing
        </Link>
      </div>
    </div>
  );
}
