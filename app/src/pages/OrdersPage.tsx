import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, LogIn, ReceiptText } from 'lucide-react';

import { useGetOrders } from '@/api/queries/useOrders';
import { OrderCard } from '@/cards/OrderCard';
import { StickyCart } from '@/shared/StickyCart';
import { useAuthStore } from '@/store/authStore';
import { useReveal } from '@/hooks/useReveal';

/* orders.html, fed by /brand/{brand}/get-orders.

   Logged-out is an inline state, never a redirect: this route is also where PayU
   lands a FAILED payment, and bouncing someone who just tried to pay to a login
   screen reads as the order having vanished. */
export default function OrdersPage() {
  useReveal();
  const loggedIn = useAuthStore((s) => s.loggedIn);
  const { orders, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetOrders();

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

        {!loggedIn ? (
          <div className="empty-wrap">
            <div className="empty-emoji">
              <LogIn className="w-9 h-9 text-[var(--brand)]" />
            </div>
            <p className="empty-title">Log in to see your orders</p>
            <p className="empty-sub">Your order history is tied to your phone number.</p>
            <Link to="/login?next=/orders" className="pill pill-accent mt-5">
              Login <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
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

            {hasNextPage && (
              <button
                onClick={() => void fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full mt-5 btn-outline press font-bold py-3.5 rounded-2xl"
              >
                {isFetchingNextPage ? 'Loading…' : 'Load older orders'}
              </button>
            )}

            {isLoading && orders.length === 0 && (
              <p className="text-sm text-[var(--ink-2)] py-8 text-center">Loading your orders…</p>
            )}

            {!isLoading && orders.length === 0 && (
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
          </>
        )}
      </main>

      <StickyCart />
    </div>
  );
}
