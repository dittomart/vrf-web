import { useCallback, useEffect, useRef, useState } from 'react';
import type { ClipboardEvent, KeyboardEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Leaf,
  Loader,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Timer,
} from 'lucide-react';

import { SERVICE_AREA_PINS, VRF } from '@/api/_seed';
import { useAuthStore } from '@/store/authStore';
import { useLocationStore } from '@/store/locationStore';
import { toast } from '@/store/appStore';
import { SmartImage } from '@/shared/SmartImage';
import { imgUrl } from '@/utils/fmt';
import { distanceKm, reverseGeo } from '@/utils/geo';
import { normalizePhone } from '@/utils/normalizePhone';

/* ============================================================
   login.html — editorial brand panel (desktop) + phone → OTP form.
   ============================================================ */

/** Nearest-area fallback when reverse geocoding is unavailable or too slow —
    the same serviceable-area pins the location screen uses. */
const AREAS = SERVICE_AREA_PINS;

/** The brand panel backdrop — the same verified Unsplash id as the biryani
    hero, so it cannot 404. */
const BRAND_PHOTO = imgUrl('1589302168068-964664d93dc0', 1200, 1500);

const OTP_CODE = '123456';
const OTP_LEN = 6;
const RESEND_SECONDS = 20;

/** login.html's shortArea() — first two comma-parts, "Near " stripped. */
function shortArea(addr: string): string {
  return (
    (addr || '')
      .replace(/^Near /, '')
      .split(',')
      .slice(0, 2)
      .map((s) => s.trim())
      .filter(Boolean)
      .join(', ') || 'Your area'
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);
  const location = useLocationStore((s) => s.location);
  const setLocation = useLocationStore((s) => s.setLocation);

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState<string[]>(() => Array<string>(OTP_LEN).fill(''));
  const [otpErr, setOtpErr] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  /** null → paint the saved location; a string → a transient detect status. */
  const [locStatus, setLocStatus] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);

  const phoneRef = useRef<HTMLInputElement | null>(null);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const verifyRef = useRef<HTMLButtonElement | null>(null);
  const timers = useRef<number[]>([]);
  const alive = useRef(true);

  /** Every deferred navigation/toast in this page goes through here so the
      unmount cleanup can cancel it. */
  const defer = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      if (alive.current) fn();
    }, ms);
    timers.current.push(id);
  }, []);

  useEffect(() => {
    alive.current = true;
    const ids = timers.current;
    return () => {
      alive.current = false;
      ids.forEach((id) => window.clearTimeout(id));
      ids.length = 0;
    };
  }, []);

  /* Resend countdown — runs only while the OTP step is on screen. */
  useEffect(() => {
    if (step !== 'otp' || seconds <= 0) return;
    const iv = window.setInterval(() => {
      setSeconds((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => window.clearInterval(iv);
  }, [step, seconds]);

  /* login.html focused the first OTP box the moment the step flipped. */
  useEffect(() => {
    if (step === 'otp') otpRefs.current[0]?.focus();
  }, [step]);

  const onDetect = () => {
    if (detecting) return;

    if (!navigator.geolocation || !window.isSecureContext) {
      // file:// or unsupported → send to the full location picker instead of erroring
      toast('Opening location picker…', 'map-pin');
      defer(() => navigate('/location'), 600);
      return;
    }

    setDetecting(true);
    setLocStatus('Detecting your location…');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void (async () => {
          const pt = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          if (!alive.current) return;
          setLocStatus('Finding your area…');

          // real place name (never hangs — 4s timeout race)
          const addr = await Promise.race([
            reverseGeo(pt.lat, pt.lng).catch(() => null),
            new Promise<string | null>((r) => window.setTimeout(() => r(null), 4000)),
          ]);
          if (!alive.current) return;

          let address = addr;
          if (!address) {
            let near = AREAS[0];
            let bd = Infinity;
            AREAS.forEach((a) => {
              const d = distanceKm(pt.lat, pt.lng, a.lat, a.lng);
              if (d < bd) {
                bd = d;
                near = a;
              }
            });
            address = bd <= 8 ? `Near ${near.name.split(',')[0]}` : 'Your current location';
          }

          setLocation({
            address,
            area: shortArea(address),
            lat: pt.lat,
            lng: pt.lng,
            serviceable: true,
          });
          setDetecting(false);
          setLocStatus(null);
          toast('Location updated ✓', 'map-pin');
        })();
      },
      (err) => {
        if (!alive.current) return;
        setDetecting(false);
        setLocStatus(null);
        toast(
          err.code === 1
            ? 'Location blocked — pick your area manually'
            : "Couldn't detect — pick your area manually",
          'alert-circle'
        );
        defer(() => navigate('/location'), 900);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const onSendOtp = () => {
    if (phone.replace(/\D/g, '').length !== 10) {
      phoneRef.current?.focus();
      toast('Enter a valid 10-digit number', 'alert-circle');
      return;
    }
    setOtp(Array<string>(OTP_LEN).fill(''));
    setOtpErr(false);
    setSeconds(RESEND_SECONDS);
    setStep('otp');
  };

  const setBox = (i: number, value: string) => {
    setOtp((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  };

  const onOtpChange = (i: number, raw: string) => {
    const v = raw.replace(/\D/g, '').slice(-1);
    setBox(i, v);
    if (v && i < OTP_LEN - 1) otpRefs.current[i + 1]?.focus();
    if (v && i === OTP_LEN - 1) verifyRef.current?.focus();
  };

  const onOtpKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const onOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const d = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, OTP_LEN).split('');
    if (!d.length) return;
    setOtp((prev) => {
      const next = [...prev];
      d.forEach((ch, j) => {
        next[j] = ch;
      });
      return next;
    });
    (otpRefs.current[d.length] ?? otpRefs.current[OTP_LEN - 1])?.focus();
  };

  const onVerify = () => {
    const code = otp.join('');
    if (code !== OTP_CODE) {
      setOtpErr(true);
      setOtp(Array<string>(OTP_LEN).fill(''));
      otpRefs.current[0]?.focus();
      return;
    }
    login({
      name: user?.name ?? 'Guest',
      phone: normalizePhone(phone),
      email: user?.email,
      wallet: user?.wallet ?? 0,
    });
    toast('Logged in successfully');
    /* dynamic return: go back to wherever the user came from (default: payment,
       exactly as login.html's ?next fallback did) */
    const next = params.get('return') || params.get('next') || '/payment';
    defer(() => navigate(next, { replace: true }), 500);
  };

  const onResend = () => {
    setOtp(Array<string>(OTP_LEN).fill(''));
    setOtpErr(false);
    setSeconds(RESEND_SECONDS);
    otpRefs.current[0]?.focus();
    toast('OTP resent — use 123456', 'sparkles');
  };

  const locText =
    locStatus ?? (location ? shortArea(location.address) : 'Set your location');
  const locLabel = location ? 'Delivering to' : 'Tap to detect';
  const masked = phone.replace(/(\d{2})\d{6}(\d{2})/, '$1••••••$2');

  return (
    <div className="auth page-enter">
      {/* ============ LEFT — editorial brand panel (desktop) ============ */}
      <aside className="auth-brand on-brand">
        <div
          className="auth-brand-photo"
          aria-hidden="true"
          style={{ backgroundImage: `url("${BRAND_PHOTO}")` }}
        />
        <div className="auth-brand-wash" aria-hidden="true" />
        <div className="auth-brand-glow" aria-hidden="true" />

        <div className="relative flex items-center gap-3">
          <div className="logo-tile w-12 h-12">
            <SmartImage src="/image.png" alt="VRF Kitchen" />
          </div>
          <div>
            <p className="display font-bold text-lg leading-none">VRF Kitchen</p>
            <p className="text-[10.5px] text-white/65 mt-1.5 tracking-[.16em] font-semibold">
              PURE VEGETARIAN · {VRF.city.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <span className="auth-eyebrow">Home-style, always fresh</span>
          <h2 className="auth-head">
            South Indian classics,
            <br />
            delivered hot in
            <br />
            35 minutes.
          </h2>
          <p className="text-white/70 text-[15px] mt-5 leading-relaxed max-w-sm">
            Log in to reorder your favourites, track your food live, and check out in seconds.
          </p>

          <div className="auth-stats">
            <div className="auth-stat">
              <p className="auth-stat-n">
                <Timer /> 35
              </p>
              <p className="auth-stat-l">Min delivery</p>
            </div>
            <div className="auth-stat">
              <p className="auth-stat-n">
                <Leaf /> 100%
              </p>
              <p className="auth-stat-l">Pure veg</p>
            </div>
            <div className="auth-stat">
              <p className="auth-stat-n">
                <Star /> 4.8
              </p>
              <p className="auth-stat-l">12k ratings</p>
            </div>
          </div>
        </div>

        <div className="relative auth-trust">
          <ShieldCheck className="w-4 h-4" style={{ color: 'var(--gold)' }} />
          Secured with bank-grade encryption
        </div>
      </aside>

      {/* ============ RIGHT — the form ============ */}
      <div className="auth-form">
        <div className="relative flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="ibtn ibtn-ghost press"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button type="button" onClick={() => navigate('/home')} className="btn-ghost press">
            Skip
          </button>
        </div>

        <div className="auth-card">
          {/* mobile-only brand mark (the left panel is desktop-only) */}
          <div className="auth-mini">
            <div className="logo-tile w-14 h-14" style={{ boxShadow: 'var(--e2)' }}>
              <SmartImage src="/image.png" alt="VRF Kitchen" />
            </div>
            <p className="script text-[13px] font-semibold mt-3" style={{ color: 'var(--gold)' }}>
              Pure vegetarian, cooked fresh
            </p>
            <p className="display font-bold text-[18px] mt-0.5">VRF Kitchen</p>
          </div>

          {/* ---------- Phone step ---------- */}
          {step === 'phone' && (
            <div id="step-phone">
              <h1 className="display text-[26px] font-semibold leading-tight text-center">
                Welcome back
              </h1>
              <p className="text-[var(--ink-2)] text-sm mt-1.5 text-center">
                Login with your mobile number to continue
              </p>

              <button type="button" onClick={onDetect} className="auth-loc press">
                <span className="auth-loc-ico">
                  {detecting ? (
                    <Loader
                      className="w-3.5 h-3.5 text-[var(--brand)]"
                      style={{ animation: 'spin 1s linear infinite' }}
                    />
                  ) : (
                    <MapPin className="w-3.5 h-3.5" />
                  )}
                </span>
                <span className="auth-loc-txt">{locText}</span>
                <span className="hidden">{locLabel}</span>
                <span className="auth-loc-cta">Change</span>
              </button>

              <div className="mt-6">
                <label className="fld-label flex items-center gap-1.5" htmlFor="phone">
                  <Smartphone className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} /> Mobile
                  number
                </label>
                <div className="auth-field">
                  <span className="auth-cc">+91</span>
                  <span className="auth-div" />
                  <input
                    id="phone"
                    ref={phoneRef}
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Enter 10-digit number"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                  <CheckCircle
                    className="w-4 h-4 transition-opacity shrink-0"
                    style={{ color: 'var(--primary)', opacity: phone.length === 10 ? 1 : 0 }}
                  />
                </div>
                <p className="text-[11px] text-[var(--ink-2)] mt-2 flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3" /> We&apos;ll send a one-time verification code
                </p>
              </div>

              <button
                type="button"
                onClick={onSendOtp}
                className="w-full mt-6 pill pill-green ripple justify-center press"
                style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-[var(--ink-2)] text-center mt-5 leading-relaxed">
                By continuing you agree to our{' '}
                <span
                  className="font-semibold underline underline-offset-2"
                  style={{ color: 'var(--primary)' }}
                >
                  Terms
                </span>{' '}
                &amp;{' '}
                <span
                  className="font-semibold underline underline-offset-2"
                  style={{ color: 'var(--primary)' }}
                >
                  Privacy Policy
                </span>
              </p>
            </div>
          )}

          {/* ---------- OTP step ---------- */}
          {step === 'otp' && (
            <div id="step-otp">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="btn-ghost press mb-4 !px-0"
              >
                <ArrowLeft className="w-4 h-4" /> Change number
              </button>
              <h1 className="display text-[26px] font-semibold leading-tight text-center">
                Verify your number
              </h1>
              <p className="text-[var(--ink-2)] text-sm mt-1.5 text-center">
                Enter the 6-digit code sent to +91{' '}
                <span className="font-semibold text-[var(--ink)]">{masked}</span>
              </p>
              <div className="mt-3 text-center">
                <span className="badge badge-green">
                  <Sparkles className="w-3.5 h-3.5" /> Demo OTP: 123456
                </span>
              </div>

              <div className="flex gap-2 mt-6 justify-between">
                {otp.map((v, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={v}
                    onChange={(e) => onOtpChange(i, e.target.value)}
                    onKeyDown={(e) => onOtpKeyDown(i, e)}
                    onPaste={onOtpPaste}
                    className={v ? 'auth-otp filled' : 'auth-otp'}
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>

              {otpErr && (
                <p
                  className="text-xs mt-3 font-semibold flex items-center gap-1"
                  style={{ color: 'var(--accent-on)' }}
                >
                  <AlertCircle className="w-3.5 h-3.5" /> Incorrect OTP, please try 123456
                </p>
              )}

              <button
                type="button"
                ref={verifyRef}
                onClick={onVerify}
                className="w-full mt-6 pill pill-green ripple justify-center press"
                style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
              >
                Verify &amp; Continue
              </button>

              <p className="text-center text-sm text-[var(--ink-2)] mt-5">
                {seconds > 0 ? (
                  <>
                    Didn&apos;t get it? Resend in{' '}
                    <span className="font-semibold text-[var(--ink)] tnum">
                      {`0:${String(seconds).padStart(2, '0')}`}
                    </span>
                  </>
                ) : (
                  <>
                    Didn&apos;t get it?{' '}
                    <button
                      type="button"
                      onClick={onResend}
                      className="text-[var(--green)] font-semibold"
                    >
                      Resend OTP
                    </button>
                  </>
                )}
              </p>
            </div>
          )}

          <div className="mt-7 pt-5 border-t border-dashed border-[var(--line)] flex items-center justify-center gap-2 text-[11px] font-semibold text-[var(--ink-2)]">
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} /> Secured with
            bank-grade encryption
          </div>
        </div>

        <div className="relative h-6" />
      </div>
    </div>
  );
}
