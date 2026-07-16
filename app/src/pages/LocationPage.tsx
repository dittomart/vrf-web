import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, CheckCircle, Lock, MapPin, Navigation } from 'lucide-react';

import '@/styles/location.css';
import { useAppStore, toast } from '@/store/appStore';
import { useLocationStore } from '@/store/locationStore';
import { useBrandInfo } from '@/hooks/useBrandInfo';
import { reverseGeo, distanceKm } from '@/utils/geo';

interface Pending {
  name: string;
  lat: number;
  lng: number;
  /** GPS accuracy in metres */
  acc?: number;
  serviceable: boolean;
  dist: number;
}

const IDLE_LBL = 'Use my current location';

/** reverseGeo, but it can never hang the screen. */
function geoName(lat: number, lng: number): Promise<string | null> {
  return Promise.race([
    reverseGeo(lat, lng).catch(() => null),
    new Promise<null>((r) => setTimeout(() => r(null), 4000)),
  ]);
}

/* location.html, with a real serviceability check.

   The prototype matched a typed area name against a hardcoded list and marked
   every GPS fix serviceable — which made /not-serviceable unreachable. The
   kitchen's actual pin and its delivery_radius decide it now, so a customer
   outside the delivery area is told so before they fill a cart. */
export default function LocationPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const setLocation = useLocationStore((s) => s.setLocation);
  const store = useAppStore((s) => s.storeLocation);
  const brand = useBrandInfo();

  const [gpsLabel, setGpsLabel] = useState(IDLE_LBL);
  const [gpsBusy, setGpsBusy] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);

  const busyRef = useRef(false);
  const next = params.get('next') || '/home';

  const serviceabilityOf = useCallback(
    (lat: number, lng: number) => {
      if (!store) return { serviceable: false, dist: 0 };
      const dist = distanceKm(lat, lng, store.latitude, store.longitude);
      // radius 0 means the admin has not set one — do not lock anyone out over it
      const serviceable = store.deliveryRadius <= 0 || dist <= store.deliveryRadius;
      return { serviceable, dist };
    },
    [store]
  );

  const runGps = useCallback(() => {
    if (busyRef.current) return;

    if (!navigator.geolocation || !window.isSecureContext) {
      toast('GPS needs https or localhost — open the app there', 'alert-circle');
      return;
    }

    busyRef.current = true;
    setGpsBusy(true);
    setGpsLabel('Detecting your location…');

    const reset = () => {
      busyRef.current = false;
      setGpsBusy(false);
      setGpsLabel(IDLE_LBL);
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void (async () => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const acc = Math.round(pos.coords.accuracy || 0);

          setGpsLabel('Finding your area…');
          const name = (await geoName(lat, lng)) ?? 'Your current location';

          const { serviceable, dist } = serviceabilityOf(lat, lng);
          reset();
          setPending({ name, lat, lng, acc, serviceable, dist });
        })();
      },
      (err) => {
        reset();
        toast(
          err.code === 1
            ? 'Location permission denied — allow it to check if we deliver to you'
            : "Couldn't get your location — try again",
          'alert-circle'
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, [serviceabilityOf]);

  // detect on arrival — the whole page exists to answer one question
  useEffect(() => {
    if (!navigator.geolocation || !window.isSecureContext) return;
    const t = setTimeout(() => runGps(), 400);
    return () => clearTimeout(t);
  }, [runGps]);

  const confirmLoc = () => {
    if (!pending || !pending.serviceable) return;
    setLocation({
      address: pending.name,
      area: pending.name.split(',')[0].trim(),
      lat: pending.lat,
      lng: pending.lng,
      serviceable: true,
      distanceKm: Math.round(pending.dist * 10) / 10,
    });
    navigate(next, { replace: true });
  };

  const cancelLoc = () => {
    if (pending && !pending.serviceable) {
      /* Out of the delivery radius is NOT a dead end: the customer can still
         browse the menu, and a real block only has to happen at checkout (the
         payment screen already gates on distance/min-order). So record the pin,
         flag it non-serviceable, and let them into the app rather than trapping
         them on /not-serviceable. */
      setLocation({
        address: pending.name,
        area: pending.name.split(',')[0].trim(),
        lat: pending.lat,
        lng: pending.lng,
        serviceable: false,
        distanceKm: Math.round(pending.dist * 10) / 10,
      });
      navigate(next, { replace: true });
      return;
    }
    setPending(null);
  };

  return (
    <div className="page-enter min-h-screen bg-[var(--ivory)] text-[var(--ink)]">
      <div className="max-w-md mx-auto min-h-screen flex flex-col px-6">
        <div className="pt-12 pb-2 text-center">
          <div className="logo-tile w-20 h-20 mx-auto a-scalein" style={{ boxShadow: 'var(--shadow-md)' }}>
            <img src={brand.logo} alt={brand.brand} />
          </div>
          <p className="eyebrow-g eyebrow mt-4" style={{ color: 'var(--green)' }}>
            {brand.brand}
            {brand.city ? ` · ${brand.city}` : ''}
          </p>
          <div className="div-label mt-4 max-w-[220px] mx-auto">PURE VEG KITCHEN</div>
        </div>

        <div className="flex-1 pt-6 pb-8">
          <div className="relative ui-card-lux card-topline a-fadeup overflow-hidden" style={{ padding: '1.6rem' }}>
            <div className="relative">
              <div className="flex justify-center mb-4">
                <div className="relative w-16 h-16 rounded-full btn-primary flex items-center justify-center">
                  <div className="radar">
                    <span />
                    <span style={{ animationDelay: '.9s' }} />
                  </div>
                  <MapPin className="w-8 h-8 text-white relative" />
                </div>
              </div>
              <h2 className="display text-[26px] font-semibold text-center leading-tight">
                Where should we
                <br />
                deliver your food?
              </h2>
              <p className="text-center text-[var(--ink-2)] text-sm mt-2">
                We&apos;re hyperlocal — let&apos;s check if we serve your area.
              </p>

              <button
                type="button"
                onClick={runGps}
                disabled={gpsBusy}
                className="w-full mt-6 pill cta-lux shine ripple justify-center press"
                style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
              >
                <Navigation className="w-5 h-5" />
                <span>{gpsLabel}</span>
              </button>

              <p className="text-center text-[12px] text-[var(--ink-2)] mt-4 leading-relaxed">
                {store && store.deliveryRadius > 0 ? (
                  <>
                    We deliver within {store.deliveryRadius} km of our kitchen
                    {brand.area ? ` in ${brand.area}` : ''}.
                  </>
                ) : (
                  <>Your exact pin is what the rider is routed to.</>
                )}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2.5 text-center stagger">
                <div className="stat-tile">
                  <p className="display font-bold text-lg text-[var(--green)]">
                    {brand.eta}
                    <span className="text-xs">min</span>
                  </p>
                  <p className="text-[10px] text-[var(--ink-2)] mt-0.5 font-semibold">delivery</p>
                </div>
                <div className="stat-tile">
                  <p className="display font-bold text-lg text-[var(--green)]">100%</p>
                  <p className="text-[10px] text-[var(--ink-2)] mt-0.5 font-semibold">pure veg</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] text-[var(--ink-2)] mt-5 leading-relaxed flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[var(--green)]" /> Used only to check serviceability &amp;
            route your delivery partner.
          </p>
        </div>
      </div>

      {pending ? (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-[rgba(var(--shadow-rgb),.45)] backdrop-blur-sm p-4">
          <div
            className="relative ui-card-lux card-topline w-full max-w-sm p-6 text-center anim-scalein overflow-hidden"
            style={{ borderRadius: '28px', boxShadow: 'var(--shadow-lg)' }}
          >
            <div className="relative">
              <div className="relative w-16 h-16 mx-auto mb-3 anim-pop">
                <div className="radar">
                  <span />
                </div>
                <div
                  className={`ichip w-16 h-16 rounded-full ${pending.serviceable ? 'ichip-green' : 'ichip-brand'}`}
                >
                  <Check className="w-8 h-8" />
                </div>
              </div>
              <p className="eyebrow-g eyebrow">Serviceability check</p>
              <h3 className="display font-semibold text-2xl mt-1 leading-tight">Location detected</h3>

              <div
                className="mt-4 rounded-2xl p-4 text-left flex items-center gap-3 border"
                style={{
                  background:
                    'linear-gradient(120deg,color-mix(in srgb, var(--primary) 6%, transparent),var(--ivory-2))',
                  borderColor: 'color-mix(in srgb, var(--primary) 15%, transparent)',
                }}
              >
                <span className="ichip ichip-green w-11 h-11 shrink-0">
                  <MapPin className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="eyebrow eyebrow-g mb-0.5">Delivering to</p>
                  <p className="font-bold text-sm truncate">{pending.name}</p>
                  <p className="text-[11px] text-[var(--ink-2)] mt-0.5 font-mono">
                    <span className="inline-flex items-center gap-1 text-[var(--green)] font-semibold">
                      <CheckCircle className="w-3 h-3" /> GPS verified
                      {pending.acc ? ` · accurate to ~${pending.acc} m` : ''}
                    </span>
                  </p>
                </div>
              </div>

              <p className="text-sm mt-3">
                {pending.serviceable ? (
                  <>
                    <b className="text-[var(--green)]">Great! We deliver here</b> — {pending.dist.toFixed(1)}{' '}
                    km away, about {brand.eta} min
                  </>
                ) : (
                  <>
                    <b className="text-[var(--brand)]">Sorry, that&apos;s outside our delivery area</b> —{' '}
                    {pending.dist.toFixed(1)} km from the kitchen
                  </>
                )}
              </p>

              {pending.serviceable ? (
                <button
                  type="button"
                  onClick={confirmLoc}
                  className="w-full mt-4 pill cta-lux shine ripple justify-center press"
                  style={{ paddingTop: '.9rem', paddingBottom: '.9rem' }}
                >
                  Confirm &amp; Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : null}

              <button type="button" onClick={cancelLoc} className="w-full mt-2 text-[var(--ink-2)] text-sm py-2 press">
                {pending.serviceable ? 'Choose a different location' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
