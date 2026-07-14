import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';

import { PRODUCTS, VRF } from '@/api/_seed';
import { useAuthStore } from '@/store/authStore';
import { useCartStore, useCartSubtotal } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { toast } from '@/store/appStore';
import { useReveal } from '@/hooks/useReveal';
import { useStickyBar } from '@/hooks/useStickyBar';
import { money } from '@/utils/fmt';
import type { Order, OrderItem } from '@/types';

import { calcTotals } from '@/sections/cart/totals';
import { PaySummary } from '@/sections/payment/PaySummary';
import { PayMethods, type PayMethod } from '@/sections/payment/PayMethods';
import { GatewayModal, type GatewayPhase } from '@/sections/payment/GatewayModal';
import { ClosedStoreModal } from '@/sections/payment/ClosedStoreModal';
import { TrustBand } from '@/sections/payment/TrustBand';

/* ============================================================
   payment.html — total card, UPI/Card/Wallet picker, the fake gateway
   (processing → success, with a fail → retry branch) and the closed-store
   rejection modal.
   ============================================================ */

export default function PaymentPage() {
  const navigate = useNavigate();
  useReveal();
  const stuck = useStickyBar();

  const loggedIn = useAuthStore((s) => s.loggedIn);
  const cart = useCartStore((s) => s.cart);
  const clearCart = useCartStore((s) => s.clear);
  const subtotal = useCartSubtotal();
  const bill = useOrderStore((s) => s.bill);
  const placeOrder = useOrderStore((s) => s.placeOrder);
  const addresses = useOrderStore((s) => s.addresses);
  const selectedAddressId = useOrderStore((s) => s.selectedAddressId);

  const [method, setMethod] = useState<PayMethod>('UPI');
  const [phase, setPhase] = useState<GatewayPhase>('closed');
  const [closedStore, setClosedStore] = useState(false);

  const timers = useRef<number[]>([]);
  const alive = useRef(true);

  /* payment.html fell back to the bare cart subtotal when no bill had been
     written (`bill.total || cartSubtotal()`), which silently dropped tax and
     delivery for anyone who reached /payment without passing through /cart.
     Fall back to the same calc() the cart runs instead, so the amount charged
     is always the amount owed. */
  const fallback = calcTotals(subtotal);
  const billed = bill ?? {
    subtotal: fallback.sub,
    deliveryCharge: fallback.del,
    tax: fallback.tax,
    total: fallback.total,
  };
  const total = billed.total;

  useEffect(() => {
    alive.current = true;
    const ids = timers.current;
    return () => {
      alive.current = false;
      ids.forEach((id) => window.clearTimeout(id));
      ids.length = 0;
    };
  }, []);

  /* guard: nothing to pay for → back to cart */
  useEffect(() => {
    if (!loggedIn || total > 0) return;
    toast('Your cart is empty', 'shopping-bag');
    const id = window.setTimeout(() => {
      if (alive.current) navigate('/cart', { replace: true });
    }, 800);
    timers.current.push(id);
  }, [loggedIn, total, navigate]);

  /* The gateway. payment.html shows the spinner, then settles after 1.6s —
     and its settle step is success ("payment succeeds on the first attempt").
     The fail face below is the same modal's other state: `retry` re-enters
     this function, `change method` closes it. */
  const success = () => {
    const items: OrderItem[] = Object.entries(cart).flatMap(([id, qty]) => {
      const p = PRODUCTS.find((x) => x.id === id);
      return p ? [{ id, name: p.name, price: p.price, qty }] : [];
    });

    const order: Order = {
      id: 'VRF' + Date.now().toString().slice(-6),
      items,
      subtotal: billed.subtotal,
      deliveryCharge: billed.deliveryCharge,
      tax: billed.tax,
      total,
      paymentMethod: method,
      status: 'placed',
      placedAt: new Date().toISOString(),
      etaMin: VRF.eta,
      address: addresses.find((a) => a.id === selectedAddressId) ?? null,
    };

    placeOrder(order);
    clearCart();
    navigate('/confirmation', { replace: true });
  };

  const showGateway = () => {
    setPhase('processing');
    const id = window.setTimeout(() => {
      if (alive.current) success();
    }, 1600);
    timers.current.push(id);
  };

  if (!loggedIn) return <Navigate to="/login?return=/payment" replace />;

  return (
    <div className="page-enter bg-[var(--cream)] text-[var(--ink)] pb-32 min-h-screen">
      <header className={stuck ? 'appbar is-stuck' : 'appbar'}>
        <div className="appbar-inner narrow flex items-center gap-3">
          <Link to="/address" className="ibtn ibtn-ghost shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="appbar-title">Payment</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6">
        {/* pay summary */}
        <PaySummary total={total} />

        <div className="lg-2col mt-8">
          <PayMethods method={method} onSelect={setMethod} />
          <TrustBand />
        </div>
      </main>

      <div className="fixed bottom-0 inset-x-0 z-30 glass border-t border-[var(--line)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={showGateway}
          className="max-w-6xl mx-auto w-full cta-lux-accent shine ripple font-bold py-4 rounded-2xl press flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" /> Pay <span>{money(total)}</span> securely
        </button>
      </div>

      {/* Gateway modal */}
      <GatewayModal
        phase={phase}
        method={method}
        onRetry={showGateway}
        onChangeMethod={() => setPhase('closed')}
      />

      {/* closed-store error (backend rejection demo) */}
      <ClosedStoreModal
        open={closedStore}
        onBackHome={() => navigate('/home')}
        onDismiss={() => setClosedStore(false)}
      />
    </div>
  );
}
