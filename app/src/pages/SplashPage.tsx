import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Timer, Star } from 'lucide-react';

import '@/styles/splash.css';
import { useLocationStore } from '@/store/locationStore';
import { useAppStore } from '@/store/appStore';
import { useBrandInfo } from '@/hooks/useBrandInfo';
import { distanceKm, reverseGeo } from '@/utils/geo';

/* Detect the pin silently, in the background — no gate, no popup. The app opens
   regardless of where the customer is; whether we deliver to them is answered at
   checkout, not on the doorstep. A denied or slow GPS just means the pin fills
   in later (from a saved address, or the address they type at checkout). */
function detectLocationSilently() {
  if (typeof navigator === 'undefined' || !navigator.geolocation || !window.isSecureContext) return;
  if (useLocationStore.getState().location?.lat != null) return; // already have one

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      void (async () => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const store = useAppStore.getState().storeLocation;
        const name = (await reverseGeo(lat, lng).catch(() => null)) ?? 'Your current location';
        const dist = store ? distanceKm(lat, lng, store.latitude, store.longitude) : 0;
        const serviceable = !store || store.deliveryRadius <= 0 || dist <= store.deliveryRadius;
        useLocationStore.getState().setLocation({
          address: name,
          area: name.split(',')[0].trim(),
          lat,
          lng,
          serviceable,
          distanceKm: Math.round(dist * 10) / 10,
        });
      })();
    },
    () => {
      /* denied / unavailable — the app still opens; the pin comes from the
         address the customer picks at checkout instead. */
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
  );
}

/* index.html — the light premium splash. Its <style> block is already ported
   to @/styles/splash.css (.splash / .mark / .arc / .dot3 / .rise / .gold-rule). */
export default function SplashPage() {
  const navigate = useNavigate();
  const brand = useBrandInfo();

  useEffect(() => {
    // kick off GPS in the background; it fills the pin in without gating anyone
    detectLocationSilently();
    // the app opens regardless of location — always go home
    const t = setTimeout(() => navigate('/home', { replace: true }), 2600);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="splash page-enter text-[var(--ink)]">
      <div className="relative z-10 flex flex-col items-center">
        {/* logo mark with orbiting arc */}
        <div className="mark">
          <svg className="arc" viewBox="0 0 100 100" aria-hidden="true">
            <circle className="track" cx="50" cy="50" r="47" />
            <circle cx="50" cy="50" r="47" />
          </svg>
          <div className="tile">
            <img src={brand.logo} alt={brand.brand} />
          </div>
        </div>

        {brand.city ? (
          <p
            className="text-[11px] font-bold tracking-[.3em] uppercase mt-9 rise"
            style={{ animationDelay: '.35s', color: 'var(--brand)' }}
          >
            {brand.city}
          </p>
        ) : null}
        <h1
          className="display text-[44px] font-semibold leading-none mt-2 rise text-[var(--ink)]"
          style={{ animationDelay: '.45s' }}
        >
          {brand.brand}
        </h1>
        <p className="script text-2xl mt-2 rise" style={{ animationDelay: '.58s', color: 'var(--gold)' }}>
          Pure Veg, perfected
        </p>

        <div className="gold-rule mt-6 rise" style={{ animationDelay: '.7s' }} />

        {/* feature chips */}
        <div className="flex items-center gap-2.5 mt-6 rise" style={{ animationDelay: '.82s' }}>
          <span
            className="flex items-center gap-1.5 text-[11px] font-bold bg-white border border-[var(--line)] px-3 py-1.5 rounded-full"
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            <Leaf className="w-3.5 h-3.5 text-[var(--green)]" /> 100% Veg
          </span>
          <span
            className="flex items-center gap-1.5 text-[11px] font-bold bg-white border border-[var(--line)] px-3 py-1.5 rounded-full"
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            <Timer className="w-3.5 h-3.5 text-[var(--green)]" /> 35-min
          </span>
          <span
            className="flex items-center gap-1.5 text-[11px] font-bold bg-white border border-[var(--line)] px-3 py-1.5 rounded-full"
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            <Star className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]" /> 4.8
          </span>
        </div>
      </div>

      {/* loader */}
      <div className="absolute bottom-16 flex flex-col items-center gap-3.5 rise" style={{ animationDelay: '.95s' }}>
        <div className="dot3">
          <span />
          <span />
          <span />
        </div>
        <p className="text-[11px] text-[var(--ink-2)] font-bold tracking-[.22em] uppercase">Preparing your table…</p>
      </div>

      <p
        className="absolute bottom-6 text-[10px] text-[var(--ink-2)] font-bold tracking-[.28em] uppercase"
        style={{ opacity: 0.6 }}
      >
        Taste · Time · Quality
      </p>
    </div>
  );
}
