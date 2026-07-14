import { useEffect, useRef, type MouseEvent } from 'react';
import { money } from '@/utils/fmt';

/* product.html — the fixed add-to-cart bar. The #addbtn id is load-bearing:
   theme.css keys `body:has(#addbtn){padding-bottom:9.5rem}` off it, which is
   what keeps the page content clear of this bar. The quantity pops on change,
   exactly as updateTotal() animated #qty. */
export function AddToCartBar({
  qty,
  total,
  onDec,
  onInc,
  onAdd,
}: {
  qty: number;
  total: number;
  onDec: () => void;
  onInc: () => void;
  onAdd: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  const qtyRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    qtyRef.current?.animate([{ transform: 'scale(1.4)' }, { transform: 'scale(1)' }], { duration: 250 });
  }, [qty, total]);

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 glass border-t border-[var(--line)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="max-w-6xl mx-auto flex items-center gap-3">
        <div className="stepper text-base shrink-0">
          <button id="minus" onClick={onDec} className="px-3.5 py-3">
            −
          </button>
          <span id="qty" ref={qtyRef} className="min-w-[20px] text-center tnum">
            {qty}
          </span>
          <button id="plus" onClick={onInc} className="px-3.5 py-3">
            +
          </button>
        </div>
        <button id="addbtn" onClick={onAdd} className="flex-1 pill cta-lux-accent ripple shine justify-center">
          Add to cart · <span id="addtotal" className="tnum">{money(total)}</span>
        </button>
      </div>
    </div>
  );
}
