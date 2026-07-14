import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { migrateLegacyStorage } from '@/utils/storageKeys';
import { initThemeEngine } from '@/theme/themes';
import { ErrorBoundary } from '@/shared/ErrorBoundary';
import { ToastHost } from '@/shared/Toast';
import { useRipple } from '@/hooks/useRipple';
import { DotLoader } from '@/ui/DotLoader';
import { RootLayout } from '@/layouts/RootLayout';
import { CheckoutLayout } from '@/layouts/CheckoutLayout';
import { BlankLayout } from '@/layouts/BlankLayout';

/* Module import time, not inside an effect: the stores rehydrate from
   localStorage as soon as they are imported, so the legacy keys must already
   have been copied across by then. Same reason the theme paints here — before
   first render, so there is no flash of the wrong palette. */
migrateLegacyStorage();
initThemeEngine();

const SplashPage = lazy(() => import('@/pages/SplashPage'));
const LocationPage = lazy(() => import('@/pages/LocationPage'));
const NotServiceablePage = lazy(() => import('@/pages/NotServiceablePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const ProductPage = lazy(() => import('@/pages/ProductPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const AddressPage = lazy(() => import('@/pages/AddressPage'));
const PaymentPage = lazy(() => import('@/pages/PaymentPage'));
const ConfirmationPage = lazy(() => import('@/pages/ConfirmationPage'));
const TrackingPage = lazy(() => import('@/pages/TrackingPage'));
const OrdersPage = lazy(() => import('@/pages/OrdersPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));

export default function App() {
  useRipple();

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<DotLoader />}>
          <Routes>
            {/* no chrome, no location gate */}
            <Route element={<BlankLayout />}>
              <Route path="/" element={<SplashPage />} />
              <Route path="/location" element={<LocationPage />} />
              <Route path="/not-serviceable" element={<NotServiceablePage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* nav dock */}
            <Route element={<RootLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/category" element={<CategoryPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
            </Route>

            {/* checkout funnel — gated, no nav dock */}
            <Route element={<CheckoutLayout />}>
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/address" element={<AddressPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <ToastHost />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
