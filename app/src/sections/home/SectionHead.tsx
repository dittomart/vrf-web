import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/* One header for every home section — a small gold eyebrow with a diamond
   ornament rule, then a serif title, and an optional "See all" link. Mirrors the
   reference banners' centred ornamental headings but left-aligned for a rail. */
export function SectionHead({
  eyebrow,
  title,
  to,
  linkLabel = 'See all',
}: {
  eyebrow: string;
  title: string;
  to?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-3 reveal">
      <div className="min-w-0">
        <span className="sec-eyebrow">
          <span className="sec-eyebrow-rule" />
          {eyebrow}
        </span>
        <h2 className="sec-heading">{title}</h2>
      </div>
      {to ? (
        <Link
          to={to}
          className="shrink-0 text-sm font-bold text-[var(--green)] press flex items-center gap-1 pb-1"
        >
          {linkLabel} <ArrowRight className="w-4 h-4" />
        </Link>
      ) : null}
    </div>
  );
}
