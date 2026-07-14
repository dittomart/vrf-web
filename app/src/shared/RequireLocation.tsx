import { Navigate, useLocation as useRouterLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useLocationStore, hasServiceableLocation } from '@/store/locationStore';

/* The prototype's requireLocation() gate, which every protected page ran at the
   top of its script: no serviceable location with real coordinates → bounce to
   the location screen. There is deliberately no "browse without location". */
export function RequireLocation({ children }: { children: ReactNode }) {
  const loc = useLocationStore((s) => s.location);
  const here = useRouterLocation();

  if (!hasServiceableLocation(loc)) {
    return <Navigate to="/location" replace state={{ from: here.pathname }} />;
  }
  return <>{children}</>;
}
