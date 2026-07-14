import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bike, Check, ReceiptText, RotateCcw } from 'lucide-react';

import { SmartImage } from '@/shared/SmartImage';
import { getProduct } from '@/api/queries/catalog';
import { useCartStore } from '@/store/cartStore';
import { toast } from '@/store/appStore';
import { imgUrl, money, prodImg } from '@/utils/fmt';
import type { Order, OrderStatus } from '@/types';

/* Verbatim port of orders.html's order-card template (the `wrap.innerHTML =
   orders.map(o => …)` block) plus its window.reorder() handler. */

const STATUS_LABEL: Record<OrderStatus, string> = {
  placed: 'Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  'out-for-delivery': 'Out for delivery',
  delivered: 'Delivered',
};

/* The prototype stored a pre-baked `ts` string ("Yesterday, 8:42 PM", "3 days
   ago", "Last week"). The real order carries an ISO placedAt, so the same
   phrasing is derived from it — falling back to the HTML's "just now". */
function orderTs(placedAt: string): string {
  const t = Date.parse(placedAt);
  if (Number.isNaN(t)) return 'just now';

  const d = new Date(t);
  const mins = Math.floor((Date.now() - t) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;

  const startOfDay = (ms: number) => new Date(ms).setHours(0, 0, 0, 0);
  const days = Math.round((startOfDay(Date.now()) - startOfDay(t)) / 86400000);
  const time = d
    .toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toUpperCase();

  if (days <= 0) return `Today, ${time}`;
  if (days === 1) return `Yesterday, ${time}`;
  if (days < 7) return `${days} days ago`;
  if (days < 14) return 'Last week';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function OrderCard({ order }: { order: Order }) {
  const navigate = useNavigate();
  const add = useCartStore((s) => s.add);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const isLive = order.status !== 'delivered';
  const n = order.items.length;

  /* window.reorder(items) */
  const reorder = () => {
    order.items.forEach((i) => add(i.id, i.qty));
    toast('Order added to cart', 'rotate-ccw');
    timer.current = window.setTimeout(() => navigate('/cart'), 600);
  };

  return (
    <div className="ui-card ui-card-lux card-topline ui-card-pad lift">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`ichip ${isLive ? 'ichip-brand' : 'ichip-green'}`}>
            <ReceiptText className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <p className="font-bold text-sm tnum">#{order.id}</p>
            <p className="text-xs text-[var(--ink-2)]">{orderTs(order.placedAt)}</p>
          </div>
        </div>
        <span className={`badge ${isLive ? 'badge-accent' : 'badge-green'} shrink-0`}>
          {isLive ? (
            <>
              <Bike className="w-3 h-3" /> {STATUS_LABEL[order.status]}
            </>
          ) : (
            <>
              <Check className="w-3 h-3" /> Delivered
            </>
          )}
        </span>
      </div>

      <div className="div-label mt-3.5 mb-2.5">
        {n} item{n > 1 ? 's' : ''}
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {order.items.map((i, idx) => {
          const p = getProduct(i.id);
          return (
            <div key={`${i.id}-${idx}`} className="frame rounded-xl shrink-0">
              <SmartImage
                src={p ? prodImg(p, 120, 120) : imgUrl('1589302168068-964664d93dc0', 120, 120)}
                className="w-12 h-12 rounded-xl object-cover"
                alt=""
              />
            </div>
          );
        })}
        <div className="flex-1 min-w-0 flex items-center">
          <p className="text-xs text-[var(--ink-2)] line-clamp-2 ml-1">
            {order.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-dashed border-[var(--line)]">
        <div>
          <p className="eyebrow eyebrow-g mb-0.5">Paid</p>
          <span className="display font-bold text-base tnum text-[var(--green)] leading-none">
            {money(order.total)}
          </span>
        </div>
        <div className="flex gap-2">
          {isLive && (
            <Link to="/tracking" className="text-xs font-bold btn-outline px-4 py-2.5 rounded-xl press">
              Track
            </Link>
          )}
          <button
            onClick={reorder}
            className="text-xs font-bold cta-lux-accent px-4 py-2.5 rounded-xl flex items-center gap-1.5 press ripple"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reorder
          </button>
        </div>
      </div>
    </div>
  );
}
