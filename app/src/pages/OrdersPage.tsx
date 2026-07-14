import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ReceiptText } from 'lucide-react';

import { OrderCard } from '@/cards/OrderCard';
import { StickyCart } from '@/shared/StickyCart';
import { useOrderStore } from '@/store/orderStore';
import { useReveal } from '@/hooks/useReveal';

/* orders.html — appbar · hero card · "All orders" grid (or the empty state) ·
   sticky cart bar. The prototype seeded three fake orders when the history was
   empty; the real store is the source of truth here, so an empty history now
   falls through to the page's own #empty block. */
export default function OrdersPage() {
  useReveal();
  const orders = useOrderStore((s) => s.orders);

  return (
    <div className="page-enter pb-28 md:pb-10">
      <header className="appbar">
        <div className="appbar-inner narrow flex items-center gap-3">
          <Link to="/home" className="ibtn ibtn-ghost shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="appbar-title">My Orders</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6">
        {/* hero header */}
        <div className="relative ui-card ui-card-lux card-topline ui-card-pad overflow-hidden mb-5 reveal">
          <div
            className="absolute -top-10 -left-8 w-32 h-32 rounded-full blur-2xl pointer-events-none"
            style={{
              background:
                'radial-gradient(circle,color-mix(in srgb, var(--primary) 18%, transparent),transparent 70%)',
            }}
          />
          <div className="relative flex items-center gap-3.5">
            <span className="ichip ichip-green w-12 h-12">
              <ReceiptText className="w-6 h-6" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="eyebrow eyebrow-g">Your history</p>
              <h2 className="sec-title leading-tight">Past orders</h2>
              <p className="text-xs text-[var(--ink-2)] mt-0.5">
                Tap reorder to add favourites back in one tap
              </p>
            </div>
          </div>
        </div>

        <div className="sec-head mb-3 reveal">
          <p className="eyebrow eyebrow-g">All orders</p>
        </div>

        {orders.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 stagger">
            {orders.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        )}

        {orders.length === 0 && (
          <div className="empty-wrap">
            <div className="empty-emoji">
              <ReceiptText className="w-9 h-9 text-[var(--brand)]" />
            </div>
            <p className="empty-title">No orders yet</p>
            <p className="empty-sub">Your past orders will appear here for one-tap reordering.</p>
            <Link to="/category" className="pill pill-accent mt-5">
              Order now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>

      <StickyCart />
    </div>
  );
}
