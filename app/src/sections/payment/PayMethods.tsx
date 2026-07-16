import {
  BadgeCheck,
  Banknote,
  Check,
  CreditCard,
  ShieldCheck,
  Smartphone,
  Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SmartImage } from '@/shared/SmartImage';
import { money } from '@/utils/fmt';
import { isCodGateway } from '@/api/queries/usePaymentGateways';
import type { Gateway } from '@/types';

function iconFor(code: string): LucideIcon {
  if (isCodGateway(code)) return Banknote;
  if (/upi|phonepe|gpay|paytm/i.test(code)) return Smartphone;
  if (/wallet/i.test(code)) return Wallet;
  return CreditCard;
}

/* "Pay using" — the store's own active gateways, in the order the backend
   returned them.

   The wallet is NOT one of the radios: it is an independent toggle. Wallet money
   can pay for part of an order and a gateway for the rest, so making it a
   mutually-exclusive choice would make the part-paid case unreachable. */
export function PayMethods({
  gateways,
  selected,
  onSelect,
  walletBalance,
  useWallet,
  onToggleWallet,
  walletCoversAll,
  isLoading,
}: {
  gateways: Gateway[];
  selected: string;
  onSelect: (code: string) => void;
  walletBalance: number;
  useWallet: boolean;
  onToggleWallet: (on: boolean) => void;
  walletCoversAll: boolean;
  isLoading: boolean;
}) {
  return (
    <div>
      <div className="reveal mb-3" data-d="1">
        <div className="sec-head">
          <span className="ichip ichip-green">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <div>
            <p className="eyebrow-g eyebrow">Secure checkout</p>
            <h2 className="sec-title leading-tight">Pay using</h2>
          </div>
        </div>
      </div>

      {walletBalance > 0 && (
        <label className="ui-card-lux overflow-hidden reveal mb-3 pay opt-row" data-d="2">
          <div className="ichip ichip-gold">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">Use wallet balance</p>
            <p className="text-xs text-[var(--ink-2)] mt-0.5">
              {money(walletBalance)} available
              {useWallet && !walletCoversAll ? ' · covers part of this order' : ''}
            </p>
          </div>
          <span className={`acct-switch${useWallet ? ' is-on' : ''}`}>
            <span />
          </span>
          <input
            type="checkbox"
            className="hidden"
            checked={useWallet}
            onChange={(e) => onToggleWallet(e.target.checked)}
          />
        </label>
      )}

      {/* the wallet already covers the bill — there is nothing left to charge */}
      {!walletCoversAll && (
        <div className="ui-card-lux overflow-hidden divide-y divide-[var(--line)] stagger reveal" data-d="2">
          {isLoading && (
            <div className="p-4 text-sm text-[var(--ink-2)]">Loading payment methods…</div>
          )}

          {!isLoading && gateways.length === 0 && (
            <div className="p-4 text-sm text-[var(--ink-2)]">
              This kitchen has no payment method enabled yet. Ask the store to switch one on in the
              admin panel.
            </div>
          )}

          {gateways.map((g) => {
            const Ico = iconFor(g.code);
            const on = selected === g.code;
            return (
              <label
                key={g.id}
                className={on ? 'pay opt-row is-sel' : 'pay opt-row'}
                onClick={() => onSelect(g.code)}
              >
                <div className="ichip ichip-brand">
                  {g.logo ? (
                    <SmartImage src={g.logo} alt="" className="w-5 h-5 object-contain" />
                  ) : (
                    <Ico className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{g.name || g.code}</p>
                  {g.description ? (
                    <p className="text-xs text-[var(--ink-2)] mt-0.5">{g.description}</p>
                  ) : null}
                </div>
                <span className="opt-check shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <input
                  type="radio"
                  name="pay"
                  className="hidden"
                  checked={on}
                  onChange={() => onSelect(g.code)}
                />
              </label>
            );
          })}
        </div>
      )}

      <div className="ui-card ui-card-pad mt-4 flex items-center gap-3 reveal" data-d="3">
        <span className="ichip ichip-green">
          <BadgeCheck className="w-5 h-5" />
        </span>
        <div className="flex-1">
          <p className="font-bold text-sm">You&apos;ll be charged just once</p>
          <p className="text-xs text-[var(--ink-2)] mt-0.5">
            No hidden fees. Full refund if your order can&apos;t be delivered.
          </p>
        </div>
      </div>
    </div>
  );
}
