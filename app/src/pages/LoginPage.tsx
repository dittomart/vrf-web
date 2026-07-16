import { useEffect, useRef, useState } from 'react';
import type { ClipboardEvent, KeyboardEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Leaf,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Timer,
} from 'lucide-react';

import { useGenerateOtp, useVerifyOtp } from '@/api/mutations/useAuth';
import { useAuthStore } from '@/store/authStore';
import { useLocationStore } from '@/store/locationStore';
import { toast } from '@/store/appStore';
import { SmartImage } from '@/shared/SmartImage';
import { useBrandInfo } from '@/hooks/useBrandInfo';
import { useAppStore } from '@/store/appStore';

/* login.html — the phone → OTP form, against the real SMS flow.

   There is no demo code. The OTP is whatever the backend sent to that number; a
   wrong one is rejected by the server, not by a string compare in the browser.

   A number the backend has never seen needs a name and an email before it will
   create the account — that is the middle step. */
const OTP_LEN = 6;
const RESEND_SECONDS = 30;

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const brand = useBrandInfo();
  const heroImage = useAppStore((s) => s.brand?.heroImage ?? '');

  const loggedIn = useAuthStore((s) => s.loggedIn);
  const generateOtp = useGenerateOtp();
  const verifyOtp = useVerifyOtp();

  const [step, setStep] = useState<'phone' | 'details' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(() => Array<string>(OTP_LEN).fill(''));
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  const phoneRef = useRef<HTMLInputElement | null>(null);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const next = params.get('next') || params.get('return') || '/home';

  useEffect(() => {
    if (loggedIn) navigate(next, { replace: true });
  }, [loggedIn, navigate, next]);

  useEffect(() => {
    if (step !== 'otp' || seconds <= 0) return;
    const iv = window.setInterval(() => setSeconds((t) => (t <= 1 ? 0 : t - 1)), 1000);
    return () => window.clearInterval(iv);
  }, [step, seconds]);

  useEffect(() => {
    if (step === 'otp') otpRefs.current[0]?.focus();
  }, [step]);

  const sendOtp = async (withDetails: boolean) => {
    setError('');

    if (phone.replace(/\D/g, '').length !== 10) {
      phoneRef.current?.focus();
      setError('Enter a valid 10-digit number');
      return;
    }
    if (withDetails && (!name.trim() || !/^\S+@\S+\.\S+$/.test(email))) {
      setError('We need your name and a valid email to create the account');
      return;
    }

    try {
      const res = await generateOtp.mutateAsync({
        phone,
        name: withDetails ? name.trim() : undefined,
        email: withDetails ? email.trim() : undefined,
      });

      switch (res.status) {
        case 'otp':
          setOtp(Array<string>(OTP_LEN).fill(''));
          setSeconds(RESEND_SECONDS);
          setStep('otp');
          toast('Code sent', 'check-circle');
          break;
        case 'new_user':
          // the backend will not create an account off a phone number alone
          setStep('details');
          break;
        case 'user_deleted':
          setError(res.message ?? 'This account was removed. Contact us to restore it.');
          break;
        case 'email_phone_already_used':
          setError(res.message ?? 'That email or phone is already registered to another account.');
          break;
        default:
          setError(res.message ?? 'Could not send the code. Try again.');
      }
    } catch {
      setError('Could not reach the kitchen. Check your connection and try again.');
    }
  };

  const onVerify = async () => {
    const code = otp.join('');
    if (code.length !== OTP_LEN) {
      setError('Enter the 6-digit code');
      return;
    }

    setError('');
    try {
      const res = await verifyOtp.mutateAsync({
        phone,
        otp: code,
        name: name.trim() || undefined,
        email: email.trim() || undefined,
      });

      if (!res.ok) {
        setError(res.message ?? 'That code did not work');
        setOtp(Array<string>(OTP_LEN).fill(''));
        otpRefs.current[0]?.focus();
        return;
      }

      toast('Logged in successfully');

      /* A returning customer whose saved address seeded a pin goes straight where
         they were headed; only someone with no pin at all still needs the
         location step. Serviceability is not checked here — it's a checkout-time
         concern, and gating login on it would trap out-of-radius customers. */
      const loc = useLocationStore.getState().location;
      if (loc?.lat != null && loc?.lng != null) navigate(next, { replace: true });
      else navigate(`/location?next=${encodeURIComponent(next)}`, { replace: true });
    } catch {
      setError('Could not verify that code. Try again.');
    }
  };

  const setBox = (i: number, value: string) =>
    setOtp((prev) => {
      const nextOtp = [...prev];
      nextOtp[i] = value;
      return nextOtp;
    });

  const onOtpChange = (i: number, raw: string) => {
    const v = raw.replace(/\D/g, '').slice(-1);
    setBox(i, v);
    if (v && i < OTP_LEN - 1) otpRefs.current[i + 1]?.focus();
  };

  const onOtpKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const onOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const d = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, OTP_LEN).split('');
    if (!d.length) return;
    setOtp((prev) => {
      const nextOtp = [...prev];
      d.forEach((ch, j) => (nextOtp[j] = ch));
      return nextOtp;
    });
    (otpRefs.current[d.length] ?? otpRefs.current[OTP_LEN - 1])?.focus();
  };

  const masked = phone.replace(/(\d{2})\d{6}(\d{2})/, '$1••••••$2');
  const sending = generateOtp.isPending;
  const verifying = verifyOtp.isPending;

  return (
    <div className="auth page-enter">
      <aside className="auth-brand on-brand">
        {heroImage ? (
          <div
            className="auth-brand-photo"
            aria-hidden="true"
            style={{ backgroundImage: `url("${heroImage}")` }}
          />
        ) : null}
        <div className="auth-brand-wash" aria-hidden="true" />
        <div className="auth-brand-glow" aria-hidden="true" />

        <div className="relative flex items-center gap-3">
          <div className="logo-tile w-12 h-12">
            <SmartImage src={brand.logo} alt={brand.brand} />
          </div>
          <div>
            <p className="display font-bold text-lg leading-none">{brand.brand}</p>
            {brand.city ? (
              <p className="text-[10.5px] text-white/65 mt-1.5 tracking-[.16em] font-semibold">
                PURE VEGETARIAN · {brand.city.toUpperCase()}
              </p>
            ) : null}
          </div>
        </div>

        <div className="relative max-w-md">
          <span className="auth-eyebrow">Home-style, always fresh</span>
          <h2 className="auth-head">
            South Indian classics,
            <br />
            delivered hot.
          </h2>
          <p className="text-white/70 text-[15px] mt-5 leading-relaxed max-w-sm">
            Log in to reorder your favourites, track your food live, and check out in seconds.
          </p>

          <div className="auth-stats">
            <div className="auth-stat">
              <p className="auth-stat-n">
                <Timer /> {brand.eta}
              </p>
              <p className="auth-stat-l">Min delivery</p>
            </div>
            <div className="auth-stat">
              <p className="auth-stat-n">
                <Leaf /> 100%
              </p>
              <p className="auth-stat-l">Pure veg</p>
            </div>
          </div>
        </div>

        <div className="relative auth-trust">
          <ShieldCheck className="w-4 h-4" style={{ color: 'var(--gold)' }} />
          Secured with bank-grade encryption
        </div>
      </aside>

      <div className="auth-form">
        <div className="relative flex items-center justify-between">
          <button type="button" onClick={() => navigate('/home')} className="ibtn ibtn-ghost press" aria-label="Back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button type="button" onClick={() => navigate('/home')} className="btn-ghost press">
            Skip
          </button>
        </div>

        <div className="auth-card">
          <div className="auth-mini">
            <div className="logo-tile w-14 h-14" style={{ boxShadow: 'var(--e2)' }}>
              <SmartImage src={brand.logo} alt={brand.brand} />
            </div>
            <p className="display font-bold text-[18px] mt-2">{brand.brand}</p>
          </div>

          {step === 'phone' && (
            <div id="step-phone">
              <h1 className="display text-[26px] font-semibold leading-tight text-center">Welcome back</h1>
              <p className="text-[var(--ink-2)] text-sm mt-1.5 text-center">
                Login with your mobile number to continue
              </p>

              <div className="mt-6">
                <label className="fld-label flex items-center gap-1.5" htmlFor="phone">
                  <Smartphone className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} /> Mobile number
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
                  <MessageSquare className="w-3 h-3" /> We&apos;ll text you a one-time code
                </p>
              </div>

              {error ? (
                <p className="text-xs mt-3 font-semibold flex items-center gap-1" style={{ color: 'var(--accent-on)' }}>
                  <AlertCircle className="w-3.5 h-3.5" /> {error}
                </p>
              ) : null}

              <button
                type="button"
                onClick={() => void sendOtp(false)}
                disabled={sending || phone.length !== 10}
                className="w-full mt-6 pill pill-green ripple justify-center press disabled:opacity-50"
                style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
              >
                {sending ? 'Sending…' : 'Continue'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'details' && (
            <div id="step-details">
              <button type="button" onClick={() => setStep('phone')} className="btn-ghost press mb-4 !px-0">
                <ArrowLeft className="w-4 h-4" /> Change number
              </button>
              <h1 className="display text-[26px] font-semibold leading-tight text-center">
                Let&apos;s get you set up
              </h1>
              <p className="text-[var(--ink-2)] text-sm mt-1.5 text-center">
                First time with us — we just need your name and email.
              </p>

              <div className="mt-6 space-y-3.5">
                <div>
                  <label className="fld-label">Full name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="fld"
                  />
                </div>
                <div>
                  <label className="fld-label">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@example.com"
                    className="fld"
                  />
                </div>
              </div>

              {error ? (
                <p className="text-xs mt-3 font-semibold flex items-center gap-1" style={{ color: 'var(--accent-on)' }}>
                  <AlertCircle className="w-3.5 h-3.5" /> {error}
                </p>
              ) : null}

              <button
                type="button"
                onClick={() => void sendOtp(true)}
                disabled={sending}
                className="w-full mt-6 pill pill-green ripple justify-center press disabled:opacity-50"
                style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
              >
                {sending ? 'Sending…' : 'Send me the code'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'otp' && (
            <div id="step-otp">
              <button type="button" onClick={() => setStep('phone')} className="btn-ghost press mb-4 !px-0">
                <ArrowLeft className="w-4 h-4" /> Change number
              </button>
              <h1 className="display text-[26px] font-semibold leading-tight text-center">Verify your number</h1>
              <p className="text-[var(--ink-2)] text-sm mt-1.5 text-center">
                Enter the 6-digit code sent to +91{' '}
                <span className="font-semibold text-[var(--ink)]">{masked}</span>
              </p>

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

              {error ? (
                <p className="text-xs mt-3 font-semibold flex items-center gap-1" style={{ color: 'var(--accent-on)' }}>
                  <AlertCircle className="w-3.5 h-3.5" /> {error}
                </p>
              ) : null}

              <button
                type="button"
                onClick={() => void onVerify()}
                disabled={verifying}
                className="w-full mt-6 pill pill-green ripple justify-center press disabled:opacity-50"
                style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
              >
                {verifying ? 'Verifying…' : 'Verify & Continue'}
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
                      onClick={() => void sendOtp(!!name)}
                      className="text-[var(--green)] font-semibold"
                    >
                      Resend code
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
