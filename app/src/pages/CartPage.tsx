import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, ShoppingBag } from 'lucide-react';

import { getProduct } from '@/api/queries/catalog';
import { useCartStore, useCartSubtotal } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { useReveal } from '@/hooks/useReveal';

import { DeliveryEtaCard } from '@/sections/cart/DeliveryEtaCard';
import { CartItemRow } from '@/sections/cart/CartItemRow';
import { AddOnRail } from '@/sections/cart/AddOnRail';
import { BillCard } from '@/sections/cart/BillCard';
import { CheckoutBar } from '@/sections/cart/CheckoutBar';
import { calcTotals } from '@/sections/cart/totals';

/* Port of cart.html. The page script's render() drove four visibility toggles
   (#empty, #cart-body, #cart-summary, #checkout-bar) off a single `hasItems`
   flag — kept exactly, class-toggled rather than unmounted so theme.css's
   `body:has(#checkout-bar:not(.hidden))` padding rule still fires. */
export default function CartPage() {
  useReveal();
  const navigate = useNavigate();

  const cart = useCartStore((s) => s.cart);
  const subtotal = useCartSubtotal();
  const setBill = useOrderStore((s) => s.setBill);

  const ids = useMemo(() => Object.keys(cart), [cart]);
  const hasItems = ids.length > 0;
  const totals = useMemo(() => calcTotals(subtotal), [subtotal]);

  /* the prototype stashed the bill in localStorage on every render so the
     checkout pages could read it back */
  useEffect(() => {
    setBill({
      subtotal: totals.sub,
      deliveryCharge: totals.del,
      tax: totals.tax,
      total: totals.total,
    });
  }, [totals, setBill]);

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
        {/* On desktop: items + add-ons on the left, the bill in a sticky
            right rail. */}
        <div className="cart-layout">
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
              {ids.map((id) => {
                const p = getProduct(id);
                if (!p) return null;
                return <CartItemRow key={id} product={p} qty={cart[id]} />;
              })}
            </div>

            {/* empty state */}
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
              {/* FBT */}
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
                <AddOnRail cart={cart} />
              </div>
            </div>
          </div>
          {/* /.cart-main */}

          {/* ===== sticky summary rail ===== */}
          <aside className={`cart-aside${hasItems ? '' : ' hidden'}`} id="cart-summary">
            <BillCard totals={totals} />
          </aside>
        </div>
        {/* /.cart-layout */}
      </main>

      <CheckoutBar total={totals.total} visible={hasItems} />
    </div>
  );
}
