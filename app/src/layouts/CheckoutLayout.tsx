import { Outlet } from 'react-router-dom';
import { RequireLocation } from '@/shared/RequireLocation';

/* Checkout funnel — location-gated like the rest of the app, but with NO nav
   dock: cart, product, address, payment, confirmation and tracking all
   deliberately omitted injectChrome() so nothing competes with their own
   fixed action bars. */
export function CheckoutLayout() {
  return (
    <RequireLocation>
      <Outlet />
    </RequireLocation>
  );
}
