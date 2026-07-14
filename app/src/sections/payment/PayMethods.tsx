import { BadgeCheck, Check, CreditCard, ShieldCheck, Smartphone, Wallet } from 'lucide-react';

/** payment.html's three methods, in its order. No cash on delivery. */
export type PayMethod = 'UPI' | 'Card' | 'Wallet';

export const PAY_METHODS: PayMethod[] = ['UPI', 'Card', 'Wallet'];

interface Props {
  method: PayMethod;
  onSelect: (m: PayMethod) => void;
}

/* "Pay using" — the sec-head, the UPI-first radio list, and the
   charged-once reassurance card. */
export function PayMethods({ method, onSelect }: Props) {
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

      {/* UPI FIRST */}
      <div
        className="ui-card-lux overflow-hidden divide-y divide-[var(--line)] stagger reveal"
        data-d="2"
      >
        <label
          className={method === 'UPI' ? 'pay opt-row is-sel' : 'pay opt-row'}
          onClick={() => onSelect('UPI')}
        >
          <div className="ichip ichip-brand">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">UPI</p>
            <p className="text-xs text-[var(--ink-2)] mt-0.5">GPay · PhonePe · Paytm · BHIM</p>
          </div>
          <span className="badge badge-green shrink-0">POPULAR</span>
          <span className="opt-check shrink-0">
            <Check className="w-3.5 h-3.5" />
          </span>
          <input
            type="radio"
            name="pay"
            className="hidden"
            checked={method === 'UPI'}
            onChange={() => onSelect('UPI')}
          />
        </label>

        <label
          className={method === 'Card' ? 'pay opt-row is-sel' : 'pay opt-row'}
          onClick={() => onSelect('Card')}
        >
          <div className="ichip ichip-green">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">Credit / Debit Card</p>
            <p className="text-xs text-[var(--ink-2)] mt-0.5">Visa · Mastercard · RuPay</p>
          </div>
          <span className="opt-check shrink-0">
            <Check className="w-3.5 h-3.5" />
          </span>
          <input
            type="radio"
            name="pay"
            className="hidden"
            checked={method === 'Card'}
            onChange={() => onSelect('Card')}
          />
        </label>

        <label
          className={method === 'Wallet' ? 'pay opt-row is-sel' : 'pay opt-row'}
          onClick={() => onSelect('Wallet')}
        >
          <div className="ichip ichip-gold">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">Wallets</p>
            <p className="text-xs text-[var(--ink-2)] mt-0.5">Paytm · Amazon Pay · Mobikwik</p>
          </div>
          <span className="opt-check shrink-0">
            <Check className="w-3.5 h-3.5" />
          </span>
          <input
            type="radio"
            name="pay"
            className="hidden"
            checked={method === 'Wallet'}
            onChange={() => onSelect('Wallet')}
          />
        </label>
      </div>

      {/* charged-once reassurance */}
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
