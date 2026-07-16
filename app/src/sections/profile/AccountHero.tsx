import { useEffect } from 'react';
import { Check, Leaf, MapPin, Phone, ReceiptText, Wallet } from 'lucide-react';

import { useGetOrders, useGetWallet } from '@/api/queries/useOrders';
import { useGetAddresses } from '@/api/mutations/useAddresses';
import { useAuthStore } from '@/store/authStore';
import { useBrandInfo } from '@/hooks/useBrandInfo';
import { money } from '@/utils/fmt';

/* profile.html's identity hero. The three stats are real: the wallet balance is
   the one /get-wallet-transactions reports (the copy taken at login drifts as
   soon as an order is paid from it), and orders and addresses are counted off
   the server, not off a local cache. */
export function AccountHero() {
  const user = useAuthStore((s) => s.user);
  const loggedIn = useAuthStore((s) => s.loggedIn);
  const setWallet = useAuthStore((s) => s.setWallet);
  const brand = useBrandInfo();

  const { orders } = useGetOrders();
  const { data: wallet } = useGetWallet();
  const { data: addresses = [] } = useGetAddresses();

  const balance = wallet?.balance ?? user?.wallet ?? 0;

  // keep the session copy in step with the live balance
  useEffect(() => {
    if (wallet && user && wallet.balance !== user.wallet) setWallet(wallet.balance);
  }, [wallet, user, setWallet]);

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
              <img src={brand.logo} alt={brand.brand} />
            </div>
            {loggedIn && (
              <span
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--gold)] flex items-center justify-center border-2"
                style={{ borderColor: 'var(--primary)' }}
              >
                <Check className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="display font-bold text-[25px] leading-tight truncate">
              {loggedIn && user?.name ? user.name : 'Guest'}
            </p>
            <p className="text-white/75 text-sm mt-1 flex items-center gap-1.5 truncate">
              <Phone className="w-3.5 h-3.5 shrink-0" />{' '}
              {loggedIn && user ? user.phone : 'Not logged in'}
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
          <p className="acct-stat-num tnum">{money(balance)}</p>
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
            <MapPin className="w-[18px] h-[18px]" />
          </span>
          <p className="acct-stat-num tnum">{addresses.length}</p>
          <p className="acct-stat-lbl">Addresses</p>
        </div>
      </div>
    </section>
  );
}
