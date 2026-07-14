import { Ban, Lock, ShieldCheck, Undo2 } from 'lucide-react';

/* payment.html's lg-aside — the three security tiles plus the
   "100% secure · No cash on delivery" strip. */
export function TrustBand() {
  return (
    <div className="lg-aside">
      {/* trust / security band */}
      <div className="mt-4 grid grid-cols-3 gap-2.5 reveal" data-d="3">
        <div className="stat-tile">
          <ShieldCheck className="w-5 h-5 mx-auto text-[var(--green)]" />
          <p className="text-[11px] font-bold mt-1.5">256-bit SSL</p>
        </div>
        <div className="stat-tile">
          <Lock className="w-5 h-5 mx-auto text-[var(--green)]" />
          <p className="text-[11px] font-bold mt-1.5">PCI-DSS</p>
        </div>
        <div className="stat-tile">
          <Undo2 className="w-5 h-5 mx-auto text-[var(--brand)]" />
          <p className="text-[11px] font-bold mt-1.5">Easy refunds</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 reveal" data-d="3">
        <span className="text-[11px] text-[var(--ink-2)] font-semibold flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-[var(--green)]" /> 100% secure
        </span>
        <span className="w-1 h-1 rounded-full bg-[var(--line)]" />
        <span className="text-[11px] text-[var(--ink-2)] font-semibold flex items-center gap-1.5">
          <Ban className="w-3.5 h-3.5 text-[var(--brand)]" /> No cash on delivery
        </span>
      </div>
    </div>
  );
}
