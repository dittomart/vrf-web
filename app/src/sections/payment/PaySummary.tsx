import { Link } from 'react-router-dom';
import { Bike, Lock, ReceiptText, ShieldCheck } from 'lucide-react';
import { money } from '@/utils/fmt';
import { useBrandInfo } from '@/hooks/useBrandInfo';

/* payment.html's "pay summary" — the brand-gradient total card. */
export function PaySummary({ total }: { total: number }) {
  const brand = useBrandInfo();

  return (
    <div
      className="rounded-[26px] p-6 relative overflow-hidden reveal text-white on-brand"
      style={{
        background:
          'linear-gradient(140deg,var(--primary-2) 0%,var(--primary) 55%,var(--primary-2) 100%)',
        boxShadow: '0 20px 44px -20px color-mix(in srgb, var(--primary) 60%, transparent)',
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: 'linear-gradient(90deg,var(--gold),transparent 75%)' }}
      />
      <div
        className="absolute -right-10 -bottom-12 w-40 h-40 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 40% 40%,color-mix(in srgb, var(--gold) 22%, transparent),transparent 70%)',
        }}
      />
      <div className="flex items-start justify-between relative">
        <div className="min-w-0">
          <p
            className="text-[11px] font-bold tracking-[.18em] uppercase flex items-center gap-1.5"
            style={{ color: 'var(--gold)' }}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Total payable
          </p>
          <p className="display font-extrabold text-[34px] sm:text-[42px] leading-none mt-2.5 tnum text-white min-w-0 break-words">
            {money(total)}
          </p>
        </div>
        <Link
          to="/cart"
          className="text-xs font-bold text-white bg-white/15 border border-white/25 px-3.5 py-2 rounded-full press flex items-center gap-1.5 backdrop-blur shrink-0"
        >
          <ReceiptText className="w-3.5 h-3.5" /> View bill
        </Link>
      </div>
      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-white/20 relative text-[11px] font-semibold text-white/90">
        <span className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} /> 256-bit secure
        </span>
        <span className="w-1 h-1 rounded-full bg-white/30" />
        <span className="flex items-center gap-1.5">
          <Bike className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} /> ~{brand.eta} min delivery
        </span>
      </div>
    </div>
  );
}
