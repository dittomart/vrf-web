import { Check, Leaf, Phone, PiggyBank, ReceiptText, Wallet } from 'lucide-react';

import { getProduct } from '@/api/queries/catalog';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { money } from '@/utils/fmt';

/* profile.html <section class="acct-hero"> — avatar, name, phone and the three
   stats in ONE card. Wallet / Orders / Saved are all driven by real state, as
   the page's script did. */
export function AccountHero() {
  const user = useAuthStore((s) => s.user);
  const loggedIn = useAuthStore((s) => s.loggedIn);
  const orders = useOrderStore((s) => s.orders);

  /* savedAmt = Σ (mrp − price) × qty across every item ever ordered */
  const savedAmt = orders
    .flatMap((o) => o.items)
    .reduce((s, i) => {
      const p = getProduct(i.id);
      return s + (p ? (p.mrp - p.price) * (i.qty || 1) : 0);
    }, 0);

  return (
    <section className="acct-hero a-scalein">
      <div
        className="acct-hero-top"
        style={{
          background:
            'radial-gradient(130% 140% at 15% 0%,var(--primary-2),var(--primary) 60%,var(--primary-2))',
        }}
      >
        <span className="acct-hero-sheen" aria-hidden="true" />
        <div className="relative flex items-center gap-4">
          <div className="relative shrink-0">
            <div
              className="logo-tile w-[62px] h-[62px]"
              style={{
                boxShadow:
                  '0 10px 26px -12px rgba(0,0,0,.5),0 0 0 3px color-mix(in srgb, var(--gold) 38%, transparent)',
              }}
            >
              <img src="/image.png" alt="VRF" />
            </div>
            <span
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--gold)] flex items-center justify-center border-2"
              style={{ borderColor: 'var(--primary)' }}
            >
              <Check className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="display font-bold text-[25px] leading-tight truncate">
              {loggedIn && user ? user.name : 'Guest'}
            </p>
            <p className="text-white/75 text-sm mt-1 flex items-center gap-1.5 truncate">
              <Phone className="w-3.5 h-3.5 shrink-0" />{' '}
              {loggedIn && user ? `+91 ${user.phone}` : 'Not logged in'}
            </p>
          </div>

          <span className="acct-vegtag shrink-0 hidden sm:inline-flex">
            <Leaf className="w-3.5 h-3.5" /> Pure-veg member
          </span>
        </div>
      </div>

      <div className="acct-stats">
        <div className="acct-stat">
          <span className="acct-stat-ico ichip-green">
            <Wallet className="w-[18px] h-[18px]" />
          </span>
          <p className="acct-stat-num tnum">{money(user?.wallet ?? 250)}</p>
          <p className="acct-stat-lbl">Wallet</p>
        </div>
        <div className="acct-stat">
          <span className="acct-stat-ico ichip-gold">
            <ReceiptText className="w-[18px] h-[18px]" />
          </span>
          <p className="acct-stat-num tnum">{orders.length}</p>
          <p className="acct-stat-lbl">Orders</p>
        </div>
        <div className="acct-stat">
          <span className="acct-stat-ico ichip-brand">
            <PiggyBank className="w-[18px] h-[18px]" />
          </span>
          <p className="acct-stat-num tnum">{money(savedAmt)}</p>
          <p className="acct-stat-lbl">Saved</p>
        </div>
      </div>
    </section>
  );
}
