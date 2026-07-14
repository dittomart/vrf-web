import { SmartImage } from '@/shared/SmartImage';
import { money, prodImg } from '@/utils/fmt';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types';

/* cart.html — one row of #cart-items, rendered by render() in the page script. */
export function CartItemRow({ product, qty }: { product: Product; qty: number }) {
  const setQty = useCartStore((s) => s.setQty);

  return (
    <div className="ui-card lift p-3 flex gap-3.5 items-center">
      <div className="frame rounded-xl shrink-0 relative">
        <SmartImage
          src={prodImg(product, 160, 160)}
          className="w-[68px] h-[68px] rounded-xl object-cover"
          alt={product.name}
        />
        <span
          className="absolute top-1 left-1 veg-dot"
          style={{ transform: 'scale(.75)', transformOrigin: 'top left' }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm leading-snug line-clamp-1">{product.name}</p>
        <p className="text-xs text-[var(--ink-2)] line-clamp-1 mt-0.5">{product.desc}</p>
        <p className="text-[11px] text-[var(--ink-2)] tnum mt-1">{money(product.price)} each</p>
      </div>
      {/* price + stepper travel together, right-aligned */}
      <div className="shrink-0 flex flex-col items-end gap-2">
        <p className="display font-bold text-base tnum leading-none">{money(product.price * qty)}</p>
        <div className="stepper">
          <button aria-label="Decrease" onClick={() => setQty(product.id, qty - 1)}>
            −
          </button>
          <span className="min-w-[20px] text-center tnum">{qty}</span>
          <button aria-label="Increase" onClick={() => setQty(product.id, qty + 1)}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}
