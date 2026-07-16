import { Navigate, useLocation as useRouterLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useLocationStore } from '@/store/locationStore';

/* Gate on having a pin AT ALL, not on it being serviceable. The customer can
   browse the whole app from anywhere — being outside the delivery radius only
   blocks the actual order, which the payment screen enforces. A pin still has to
   exist so the catalog, delivery-fee quote and rider routing have coordinates;
   when it's genuinely missing, the location screen collects one. */
export function RequireLocation({ children }: { children: ReactNode }) {
  const loc = useLocationStore((s) => s.location);
  const here = useRouterLocation();

  const hasPin = !!loc && loc.lat != null && loc.lng != null;
  if (!hasPin) {
    return <Navigate to="/location" replace state={{ from: here.pathname }} />;
  }
  return <>{children}</>;
}
