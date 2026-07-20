import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartCount, useCartSubtotal } from '@/store/cartStore';
import { money } from '@/utils/fmt';

/* Floats above the bottom nav; slides away when the cart is empty. */
export function StickyCart() {
  const n = useCartCount();
  const subtotal = useCartSubtotal();

  return (
    <div
      id="sticky-cart"
      className={`fixed bottom-[calc(7rem+env(safe-area-inset-bottom))] md:bottom-4 inset-x-0 z-30 px-4 transition-transform duration-300 ${
        n === 0 ? 'translate-y-40' : ''
      }`}
    >
      <Link
        to="/cart"
        className="max-w-6xl mx-auto flex items-center justify-between btn-primary rounded-2xl px-5 py-3.5 press"
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <ShoppingBag className="w-5 h-5" />
          <span>{n > 1 ? `${n} items` : `${n} item`}</span>
        </span>
        <span className="flex items-center gap-2 font-semibold tnum">
          <span>{money(subtotal)}</span>
          <ArrowRight className="w-5 h-5" />
        </span>
      </Link>
    </div>
  );
}
