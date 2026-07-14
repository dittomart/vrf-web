import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Search, Check, CheckCircle, ArrowRight, Lock } from 'lucide-react';

import '@/styles/location.css';
import { SERVICEABLE_AREAS, SERVICE_AREA_PINS, VRF } from '@/api/_seed';
import { useLocationStore } from '@/store/locationStore';
import { toast } from '@/store/appStore';
import { reverseGeo, distanceKm } from '@/utils/geo';

interface Area {
  name: string;
  lat: number;
  lng: number;
  serviceable: boolean;
}

/* The areas the kitchen delivers to, with their pins — one list, in the seed,
   so the location search, the login chip and the address sheet cannot drift. */
const AREAS: Area[] = SERVICE_AREA_PINS.map((a) => ({ ...a, serviceable: true }));

/** the kitchen's own pin — Perungalathur, Chennai */
const KITCHEN = { lat: VRF.lat, lng: VRF.lng };

const IDLE_LBL = 'Use my current location';

interface Pending {
  name: string;
  lat: number;
  lng: number;
  /** real GPS accuracy in metres — absent when the pin came from the search list */
  acc?: number;
  serviceable: boolean;
  dist: number;
}

function nearestArea(lat: number, lng: number): { area: Area | null; dist: number } {
  let best: Area | null = null;
  let bd = Infinity;
  AREAS.forEach((a) => {
    const d = distanceKm(lat, lng, a.lat, a.lng);
    if (d < bd) {
      bd = d;
      best = a;
    }
  });
  return { area: best, dist: bd };
}

/** Serviceability for a place the user TYPED. location.html accepted any typed
    name outright, which left /not-serviceable unreachable. A typed name is
    served when it matches a serviceable area or the delivery city.

    GPS is deliberately NOT run through this: location.html marked the GPS
    result `serviceable: true // demo: always serviceable`, and re-deciding it
    from the kitchen pin strands every user outside the delivery zone on a
    dead-end modal. */
function serviceabilityOfTyped(name: string): { serviceable: boolean; dist: number } {
  const n = name.toLowerCase();
  const named =
    SERVICEABLE_AREAS.some((a) => n.includes(a.toLowerCase())) || n.includes(VRF.city.toLowerCase());
  return { serviceable: named, dist: 0 };
}

/** reverseGeo but never hangs — resolves null after 4s */
function geoName(lat: number, lng: number): Promise<string | null> {
  return Promise.race([
    reverseGeo(lat, lng).catch(() => null),
    new Promise<null>((r) => setTimeout(() => r(null), 4000)),
  ]);
}

export default function LocationPage() {
  const navigate = useNavigate();
  const setLocation = useLocationStore((s) => s.setLocation);

  const [gpsLabel, setGpsLabel] = useState(IDLE_LBL);
  const [gpsBusy, setGpsBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [pending, setPending] = useState<Pending | null>(null);

  const busyRef = useRef(false);

  const runGps = useCallback(() => {
    if (busyRef.current) return;
    if (!navigator.geolocation || !window.isSecureContext) {
      toast('Open via http://localhost to use GPS — or search below', 'alert-circle');
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
          try {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const acc = Math.round(pos.coords.accuracy || 0); // metres
            setGpsLabel('Finding your area…');
            let name = await geoName(lat, lng);
            // Only fall back to the nearest known area if the lookup failed —
            // never overwrite a real reverse-geocoded place name.
            if (!name) {
              const near = nearestArea(lat, lng);
              name = near.area && near.dist < 3 ? near.area.name : 'Your current location';
            }
            // demo: a real GPS fix is always serviceable, as location.html had it
            reset();
            setPending({
              name,
              lat,
              lng,
              acc,
              serviceable: true,
              dist: distanceKm(KITCHEN.lat, KITCHEN.lng, lat, lng),
            });
          } catch {
            reset();
            toast('Something went wrong — please search below', 'alert-circle');
          }
        })();
      },
      (err) => {
        reset();
        const m =
          err.code === 1
            ? 'Location permission denied — allow it or search below'
            : err.code === 3
              ? 'Location timed out — try again or search below'
              : "Couldn't get location — please search below";
        toast(m, 'alert-circle');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  // auto-detect real current location on first visit (no tap needed)
  useEffect(() => {
    if (!navigator.geolocation || !window.isSecureContext) return;
    const t = setTimeout(() => runGps(), 400);
    return () => clearTimeout(t);
  }, [runGps]);

  const q = query.trim();
  const matches = q ? AREAS.filter((a) => a.name.toLowerCase().includes(q.toLowerCase())) : [];

  const pickArea = (a: Area) => {
    const dist = distanceKm(KITCHEN.lat, KITCHEN.lng, a.lat, a.lng);
    setPending({ name: a.name, lat: a.lat, lng: a.lng, serviceable: a.serviceable, dist });
  };

  const pickCustom = () => {
    /* A free-typed name has no coordinates of its own — location.html anchors it
       to the kitchen's own pin (Perungalathur) and lets the name decide the
       serviceability. Real GPS above is what produces real coordinates. */
    const { serviceable, dist } = serviceabilityOfTyped(q);
    setPending({ name: q, lat: KITCHEN.lat, lng: KITCHEN.lng, serviceable, dist });
  };

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
    navigate('/home');
  };

  const cancelLoc = () => {
    if (pending && !pending.serviceable) {
      setLocation({
        address: pending.name,
        area: pending.name.split(',')[0].trim(),
        lat: pending.lat,
        lng: pending.lng,
        serviceable: false,
        distanceKm: Math.round(pending.dist * 10) / 10,
      });
      navigate('/not-serviceable');
      return;
    }
    setPending(null);
  };

  return (
    <div className="page-enter min-h-screen bg-[var(--ivory)] text-[var(--ink)]">
      <div className="max-w-md mx-auto min-h-screen flex flex-col px-6">
        {/* hero */}
        <div className="pt-12 pb-2 text-center">
          <div className="logo-tile w-20 h-20 mx-auto a-scalein" style={{ boxShadow: 'var(--shadow-md)' }}>
            <img src="/image.png" alt="VRF Kitchen" />
          </div>
          <p className="eyebrow-g eyebrow mt-4" style={{ color: 'var(--green)' }}>
            VRF Kitchen · {VRF.city}
          </p>
          <p className="script text-xl mt-1" style={{ color: 'var(--gold)' }}>
            Taste · Time · Quality
          </p>
          <div className="div-label mt-4 max-w-[220px] mx-auto">PURE VEG KITCHEN</div>
        </div>

        <div className="flex-1 pt-6 pb-8">
          <div className="relative ui-card-lux card-topline a-fadeup overflow-hidden" style={{ padding: '1.6rem' }}>
            <div
              className="absolute -top-12 -right-10 w-36 h-36 rounded-full blur-2xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle,color-mix(in srgb, var(--primary) 16%, transparent),transparent 70%)',
              }}
            />
            <div
              className="absolute -bottom-12 -left-10 w-36 h-36 rounded-full blur-2xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle,color-mix(in srgb, var(--gold) 22%, transparent),transparent 70%)',
              }}
            />
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

              <div className="flex items-center gap-3 my-5 text-[var(--ink-2)] text-xs">
                <div className="h-px flex-1 rule-gold" /> OR <div className="h-px flex-1 rule-gold" />
              </div>

              <div className="relative">
                <div className="field flex items-center gap-3 px-4">
                  <Search className="w-4 h-4 text-[var(--ink-2)] shrink-0" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type any area or city…"
                    className="flex-1 py-3.5 bg-transparent outline-none text-sm placeholder:text-[var(--ink-2)]"
                  />
                </div>
                {q ? (
                  <div className="mt-2 rounded-2xl border border-[var(--line)] overflow-hidden divide-y divide-[var(--line)] bg-white shadow-[var(--shadow-md)] anim-slidedown">
                    {matches.map((a) => (
                      <button
                        key={a.name}
                        type="button"
                        onClick={() => pickArea(a)}
                        className="w-full text-left px-4 py-3 hover:bg-[var(--ivory-2)] flex items-center gap-3 transition"
                      >
                        <MapPin className="w-4 h-4 text-[var(--brand)]" />
                        <span className="text-sm">{a.name}</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={pickCustom}
                      className="w-full text-left px-4 py-3 hover:bg-[var(--ivory-2)] flex items-center gap-3 transition border-t border-[var(--line)]"
                    >
                      <Navigation className="w-4 h-4 text-[var(--green)]" />
                      <span className="text-sm">
                        Use &quot;<b>{q}</b>&quot; as my location
                      </span>
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2.5 text-center stagger">
                <div className="stat-tile">
                  <p className="display font-bold text-lg text-[var(--green)]">
                    35<span className="text-xs">min</span>
                  </p>
                  <p className="text-[10px] text-[var(--ink-2)] mt-0.5 font-semibold">delivery</p>
                </div>
                <div className="stat-tile">
                  <p className="display font-bold text-lg text-[var(--green)]">100%</p>
                  <p className="text-[10px] text-[var(--ink-2)] mt-0.5 font-semibold">pure veg</p>
                </div>
                <div className="stat-tile">
                  <p className="display font-bold text-lg text-[var(--brand)]">4.8★</p>
                  <p className="text-[10px] text-[var(--ink-2)] mt-0.5 font-semibold">rating</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-[11px] text-[var(--ink-2)] mt-5 leading-relaxed flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[var(--green)]" /> Used only to check serviceability &amp; route your
            delivery partner.
          </p>
        </div>
      </div>

      {pending ? (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-[rgba(var(--shadow-rgb),.45)] backdrop-blur-sm p-4">
          <div
            className="relative ui-card-lux card-topline w-full max-w-sm p-6 text-center anim-scalein overflow-hidden"
            style={{ borderRadius: '28px', boxShadow: 'var(--shadow-lg)' }}
          >
            <div
              className="absolute -top-14 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-2xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle,color-mix(in srgb, var(--primary) 14%, transparent),transparent 70%)',
              }}
            />
            <div className="relative">
              <div className="relative w-16 h-16 mx-auto mb-3 anim-pop">
                <div className="radar">
                  <span />
                </div>
                <div className="ichip ichip-green w-16 h-16 rounded-full">
                  <Check className="w-8 h-8" />
                </div>
              </div>
              <p className="eyebrow-g eyebrow">Serviceability check</p>
              <h3 className="display font-semibold text-2xl mt-1 leading-tight">Location detected</h3>
              <p className="script text-base mt-0.5" style={{ color: 'var(--gold)' }}>
                We found you on the map
              </p>
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
                  {/* Show the real GPS accuracy — if the fix is coarse (wifi/cell rather
                      than satellite) the user can see why the place name may be approximate. */}
                  <p className="text-[11px] text-[var(--ink-2)] mt-0.5 font-mono">
                    <span className="inline-flex items-center gap-1 text-[var(--green)] font-semibold">
                      <CheckCircle className="w-3 h-3" /> GPS verified
                      {pending.acc ? ` · accurate to ~${pending.acc} m` : ''}
                    </span>
                  </p>
                </div>
                <span className="badge badge-green shrink-0">✓</span>
              </div>
              <p className="text-sm mt-3">
                {pending.serviceable ? (
                  <>
                    <b className="text-[var(--green)]">Great! We deliver here</b> in ~{VRF.eta} min
                  </>
                ) : (
                  <b className="text-[var(--brand)]">Sorry, we don&apos;t serve this area yet</b>
                )}
              </p>
              <div className="div-label mt-4 mb-3">SERVING {VRF.city.toUpperCase()}</div>
              {pending.serviceable ? (
                <button
                  type="button"
                  onClick={confirmLoc}
                  className="w-full pill cta-lux shine ripple justify-center press"
                  style={{ paddingTop: '.9rem', paddingBottom: '.9rem' }}
                >
                  Confirm &amp; Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : null}
              <button type="button" onClick={cancelLoc} className="w-full mt-2 text-[var(--ink-2)] text-sm py-2 press">
                Choose a different location
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
