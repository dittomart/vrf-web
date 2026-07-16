import { Link } from 'react-router-dom';
import { MapPinOff, Navigation, MessageCircle } from 'lucide-react';

import '@/styles/location.css';
import { useAppStore } from '@/store/appStore';
import { useLocationStore } from '@/store/locationStore';
import { digitsOnly, useBrandInfo } from '@/hooks/useBrandInfo';

/* The customer is outside the delivery radius. The prototype offered a "notify
   me" form that went nowhere — there is no endpoint behind it, so it is gone
   rather than collecting numbers into the void. What is left is real: how far
   out they are, and a way to reach the kitchen. */
export default function NotServiceablePage() {
  const location = useLocationStore((s) => s.location);
  const store = useAppStore((s) => s.storeLocation);
  const brand = useBrandInfo();

  const area = location?.address ? location.address.split(',').slice(0, 2).join(', ') : 'your area';
  const whatsapp = digitsOnly(brand.whatsapp);

  return (
    <div className="page-enter min-h-screen bg-[var(--ivory)] text-[var(--ink)]">
      <div className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-center px-8 text-center py-12">
        <div className="logo-tile w-16 h-16 mb-8 a-scalein" style={{ boxShadow: 'var(--shadow-md)' }}>
          <img src={brand.logo} alt={brand.brand} />
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
          {brand.brand} isn&apos;t delivering to <b className="text-[var(--ink)]">{area}</b> yet.
          {location?.distanceKm != null && store && store.deliveryRadius > 0 ? (
            <>
              {' '}
              You&apos;re {location.distanceKm} km from the kitchen, and we deliver within{' '}
              {store.deliveryRadius} km.
            </>
          ) : null}
        </p>

        <Link
          to="/location"
          className="w-full mt-7 pill pill-accent ripple press justify-center"
          style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
        >
          <Navigation className="w-5 h-5" /> Try a different location
        </Link>

        {whatsapp ? (
          <a
            href={`https://wa.me/${whatsapp.length === 10 ? `91${whatsapp}` : whatsapp}`}
            className="mt-4 text-sm text-[var(--ink-2)] flex items-center gap-1.5 press"
          >
            <MessageCircle className="w-4 h-4 text-[var(--green)]" /> Chat with us on WhatsApp
          </a>
        ) : null}
      </div>
    </div>
  );
}
