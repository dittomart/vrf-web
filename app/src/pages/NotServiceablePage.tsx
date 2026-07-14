import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPinOff, Bell, Navigation, MessageCircle } from 'lucide-react';

import '@/styles/location.css';
import { VRF } from '@/api/_seed';
import { useLocationStore } from '@/store/locationStore';

export default function NotServiceablePage() {
  const location = useLocationStore((s) => s.location);
  const [notified, setNotified] = useState(false);
  const [phone, setPhone] = useState('');

  const area = location?.address ? location.address.split(',').slice(0, 2).join(', ') : 'your area';

  return (
    <div className="page-enter min-h-screen bg-[var(--ivory)] text-[var(--ink)]">
      <div className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-center px-8 text-center py-12">
        <div className="logo-tile w-16 h-16 mb-8 a-scalein" style={{ boxShadow: 'var(--shadow-md)' }}>
          <img src="/image.png" alt="VRF Kitchen" />
        </div>

        <div className="empty-emoji drift anim-pop">
          <MapPinOff className="w-11 h-11 text-[var(--brand)]" />
        </div>

        <h1 className="display text-3xl font-semibold anim-fadein leading-tight">
          We&apos;re not there
          <br />
          <span className="script text-[var(--brand)]">just yet</span>
        </h1>
        <p className="text-[var(--ink-2)] mt-3 leading-relaxed">
          VRF Kitchen isn&apos;t delivering to <b className="text-[var(--ink)]">{area}</b> yet. We&apos;re expanding fast
          — you&apos;ll be the first to know.
        </p>

        <div className="mt-7 w-full ui-card ui-card-pad text-left" style={{ padding: '1.25rem' }}>
          <p className="text-sm font-semibold mb-1 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[var(--green)]" /> Get notified when we reach you
          </p>
          <p className="text-[12px] text-[var(--ink-2)] mb-3">We&apos;ll ping you the moment your area goes live.</p>
          <div className="flex gap-2">
            {/* not-serviceable.html re-declares .field with a tighter radius */}
            <div className="field flex-1 flex items-center px-3.5" style={{ borderRadius: '.85rem' }}>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your mobile number"
                type="tel"
                className="flex-1 py-3 bg-transparent outline-none text-sm placeholder:text-[var(--ink-2)]"
              />
            </div>
            <button
              type="button"
              onClick={() => setNotified(true)}
              className="pill pill-green ripple press"
              style={{ padding: '.75rem 1.15rem' }}
            >
              {notified ? 'Added ✓' : 'Notify me'}
            </button>
          </div>
        </div>

        <Link
          to="/location"
          className="w-full mt-4 pill pill-accent ripple press justify-center"
          style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
        >
          <Navigation className="w-5 h-5" /> Try a different location
        </Link>
        <a
          href={`https://wa.me/91${VRF.whatsapp}`}
          className="mt-4 text-sm text-[var(--ink-2)] flex items-center gap-1.5 press"
        >
          <MessageCircle className="w-4 h-4 text-[var(--green)]" /> Chat with us on WhatsApp
        </a>
      </div>
    </div>
  );
}
