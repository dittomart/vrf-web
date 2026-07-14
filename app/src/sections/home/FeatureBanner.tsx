import { Link } from 'react-router-dom';
import { ArrowRight, Crown, Star, Timer } from 'lucide-react';
import { SmartImage } from '@/shared/SmartImage';
import { imgUrl } from '@/utils/fmt';

/* "The Grand Feast" — the unlimited-meals house special banner. */
export function FeatureBanner() {
  return (
    <section className="mt-12 reveal">
      <div
        className="rounded-[26px] overflow-hidden relative text-white grid md:grid-cols-2 shadow-[var(--shadow-lg)] on-brand"
        style={{ background: 'linear-gradient(135deg,var(--green-2),var(--green) 60%,var(--primary-2))' }}
      >
        <div
          className="absolute -top-16 -left-16 w-52 h-52 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle,color-mix(in srgb, var(--gold) 30%, transparent),transparent 70%)',
          }}
        />

        <div className="p-7 md:p-10 relative z-10">
          <span className="badge badge-gold">
            <Crown className="w-3.5 h-3.5" /> House special
          </span>
          <p className="script text-[var(--gold)] text-2xl mt-3">The Grand Feast</p>
          <h3 className="display text-3xl font-semibold leading-tight mt-1">
            South Indian
            <br />
            Meals, unlimited
          </h3>
          <p className="text-white/75 text-sm mt-3 max-w-xs">
            Rice, sambar, rasam, three curries, poriyal, curd, papad &amp; sweet — served hot.
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="pill !py-1.5 !px-3 !text-xs bg-white/10 text-white/90">
              <Timer className="w-3.5 h-3.5 text-[var(--gold)]" /> 35 min
            </span>
            <span className="pill !py-1.5 !px-3 !text-xs bg-white/10 text-white/90">
              <Star className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]" /> 4.9 · 421 orders
            </span>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <Link to="/product/p23" className="pill btn-gold press font-bold text-sm">
              Order at ₹180 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="frame relative min-h-[190px] md:min-h-full">
          <SmartImage
            src={imgUrl('1567337710282-00832b415979', 700, 600)}
            className="absolute inset-0 w-full h-full object-cover"
            alt="South Indian meals"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[var(--green)] via-[var(--green)]/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
