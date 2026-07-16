import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bike, Check, ReceiptText, RotateCcw, X } from 'lucide-react';

import { SmartImage } from '@/shared/SmartImage';
import { useGetCatalog } from '@/api/queries/catalog';
import { useCartStore } from '@/store/cartStore';
import { toast } from '@/store/appStore';
import { money } from '@/utils/fmt';
import { computeUnitPrice, lineIdOf } from '@/utils/productPricing';
import type { Order, OrderStatus } from '@/types';

/* orders.html's order-card template, plus its reorder handler. */

const STATUS_LABEL: Record<OrderStatus, string> = {
  'awaiting-payment': 'Awaiting payment',
  placed: 'Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  'out-for-delivery': 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  'payment-failed': 'Payment failed',
};

function orderTs(placedAt: string): string {
  const t = Date.parse(placedAt);
  if (Number.isNaN(t)) return '';

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
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function OrderCard({ order }: { order: Order }) {
  const navigate = useNavigate();
  const addLine = useCartStore((s) => s.addLine);
  const { data: catalog } = useGetCatalog();
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    []
  );

  const isDead =
    order.status === 'delivered' ||
    order.status === 'cancelled' ||
    order.status === 'payment-failed';
  const isLive = !isDead;
  const isCancelled = order.status === 'cancelled' || order.status === 'payment-failed';
  const n = order.items.length;

  /* Reorder buys today's menu, not last month's receipt: each item is resolved
     against the live catalog so a repriced dish reorders at the price the
     kitchen charges now, and a dish that has left the menu is skipped rather
     than added as a line /place-order would reject. */
  const reorder = () => {
    let added = 0;
    let missing = 0;

    for (const i of order.items) {
      const p = catalog?.flat.find((x) => x.id === i.id);
      if (!p) {
        missing += 1;
        continue;
      }

      const chosen = (i.customizations ?? []).flatMap((c) => {
        const group = p.addonGroups.find((g) => g.options.some((o) => o.id === c.addonId));
        const opt = group?.options.find((o) => o.id === c.addonId);
        if (!group || !opt) return [];
        return [
          {
            groupId: group.id,
            groupName: group.name,
            addonId: opt.id,
            addonName: opt.name,
            price: opt.price,
          },
        ];
      });

      addLine({
        lineId: lineIdOf(p.id, chosen),
        productId: p.id,
        restaurantId: p.restaurantId,
        name: p.name,
        image: p.img,
        basePrice: p.price,
        unitPrice: computeUnitPrice(p, chosen),
        qty: i.qty,
        customizations: chosen,
      });
      added += 1;
    }

    if (added === 0) {
      toast('None of these dishes are on the menu right now', 'alert-circle');
      return;
    }

    toast(
      missing > 0 ? `Added ${added} of ${n} — the rest are off the menu` : 'Order added to cart',
      'rotate-ccw'
    );
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
        <span
          className={`badge ${isCancelled ? 'badge-accent' : isLive ? 'badge-accent' : 'badge-green'} shrink-0`}
        >
          {isCancelled ? (
            <>
              <X className="w-3 h-3" /> Cancelled
            </>
          ) : isLive ? (
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
        {n} item{n === 1 ? '' : 's'}
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {order.items.map((i, idx) => (
          <div key={`${i.id}-${idx}`} className="frame rounded-xl shrink-0">
            <SmartImage src={i.image ?? ''} className="w-12 h-12 rounded-xl object-cover" alt="" />
          </div>
        ))}
        <div className="flex-1 min-w-0 flex items-center">
          <p className="text-xs text-[var(--ink-2)] line-clamp-2 ml-1">
            {order.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-dashed border-[var(--line)]">
        <div>
          <p className="eyebrow eyebrow-g mb-0.5">Total</p>
          <span className="display font-bold text-base tnum text-[var(--green)] leading-none">
            {money(order.total)}
          </span>
        </div>
        <div className="flex gap-2">
          {/* Every order opens its detail/tracking page — a live one shows the
              journey, a finished or cancelled one shows the receipt. */}
          <Link
            to={`/tracking/${order.id}`}
            className="text-xs font-bold btn-outline px-4 py-2.5 rounded-xl press"
          >
            {isLive ? 'Track' : 'View'}
          </Link>
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
