import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, ShoppingBag } from 'lucide-react';

import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { useOrderTotals } from '@/hooks/useOrderTotals';
import { useReveal } from '@/hooks/useReveal';

import { DeliveryEtaCard } from '@/sections/cart/DeliveryEtaCard';
import { CartItemRow } from '@/sections/cart/CartItemRow';
import { AddOnRail } from '@/sections/cart/AddOnRail';
import { BillCard } from '@/sections/cart/BillCard';
import { CheckoutBar } from '@/sections/cart/CheckoutBar';

/* Port of cart.html. The four visibility toggles (#empty, #cart-body,
   #cart-summary, #checkout-bar) still hang off a single `hasItems` flag and are
   class-toggled rather than unmounted, so theme.css's
   `body:has(#checkout-bar:not(.hidden))` padding rule still fires. */
export default function CartPage() {
  useReveal();
  const navigate = useNavigate();

  const lines = useCartStore((s) => s.lines);
  const setBill = useOrderStore((s) => s.setBill);
  const totals = useOrderTotals();

  const hasItems = lines.length > 0;

  /* Hand the bill to the payment screen. Both screens read the same
     useOrderTotals cache, so this is a fallback for a deep link into /payment,
     not the source of truth. */
  useEffect(() => {
    setBill({
      subtotal: totals.subtotal,
      deliveryCharge: totals.deliveryFee,
      tax: totals.tax,
      total: totals.total,
    });
  }, [totals.subtotal, totals.deliveryFee, totals.tax, totals.total, setBill]);

  return (
    <div className="page-enter bg-[var(--cream)] text-[var(--ink)] pb-40">
      <header className="appbar">
        <div className="appbar-inner narrow flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="ibtn ibtn-ghost shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="appbar-title">Your Cart</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-4">
        {/* With an empty cart the bill aside is gone, so the two-column track
            would leave a 360px hole on the right — collapse to one column. */}
        <div className={hasItems ? 'cart-layout' : 'cart-layout is-empty'}>
          <div className="cart-main">
            <DeliveryEtaCard />

            <div className="sec-head mb-3 reveal" id="basket-head">
              <span className="ichip ichip-green w-9 h-9 rounded-xl">
                <ShoppingBag className="w-[18px] h-[18px]" />
              </span>
              <div>
                <p className="eyebrow eyebrow-g">Your selection</p>
                <p className="display font-bold text-lg leading-none">In your basket</p>
              </div>
            </div>

            <div id="cart-items" className="space-y-3 stagger">
              {lines.map((l) => (
                <CartItemRow key={l.lineId} line={l} />
              ))}
            </div>

            <div id="empty" className={`${hasItems ? 'hidden ' : ''}empty-wrap`}>
              <div className="empty-emoji">
                <ShoppingBag className="w-9 h-9 text-[var(--brand)]" />
              </div>
              <p className="empty-title">Your cart is empty</p>
              <p className="empty-sub">Add some delicious home-style veg dishes to get started!</p>
              <Link to="/category" className="pill pill-accent mt-5">
                Browse the menu <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div id="cart-body" className={hasItems ? undefined : 'hidden'}>
              <div className="mt-7 reveal">
                <div className="sec-head mb-3">
                  <span className="ichip ichip-gold w-9 h-9 rounded-xl">
                    <Plus className="w-[18px] h-[18px]" />
                  </span>
                  <div>
                    <p className="eyebrow">Add ons</p>
                    <p className="display font-bold text-lg leading-none">Complete your meal</p>
                  </div>
                </div>
                <AddOnRail lines={lines} />
              </div>
            </div>
          </div>

          <aside className={`cart-aside${hasItems ? '' : ' hidden'}`} id="cart-summary">
            <BillCard totals={totals} />
          </aside>
        </div>
      </main>

      <CheckoutBar total={totals.total} visible={hasItems} disabled={totals.belowMin} />
    </div>
  );
}
