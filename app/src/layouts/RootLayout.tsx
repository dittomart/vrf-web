import { Outlet } from 'react-router-dom';
import { BottomNav } from '@/shared/BottomNav';
import { RequireLocation } from '@/shared/RequireLocation';

/* Full chrome: the page renders its own .appbar (each HTML page has a
   different one), and the floating nav dock rides on top — exactly the set of
   pages that called injectChrome() in the prototype. */
export function RootLayout() {
  return (
    <RequireLocation>
      <Outlet />
      <BottomNav />
    </RequireLocation>
  );
}
