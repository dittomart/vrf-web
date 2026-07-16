import { useEffect, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '@/api/client';
import { BRAND_DOMAIN, useGetBrands, useGetLocations } from '@/api/queries/useInit';
import { useAppStore } from '@/store/appStore';

/* Nothing in this app means anything without a brand and a store: the catalog is
   keyed by the store slug, the delivery fee by its id, the open/closed state by
   its schedule. So boot resolves both before the first page renders — and when it
   cannot, it SAYS SO. A silent spinner over a dead API is indistinguishable from
   a slow one, and that is the state a developer wastes an afternoon on. */

function BootScreen({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8 text-center bg-[var(--ivory)] text-[var(--ink)]">
      {children}
    </div>
  );
}

export function AppInit({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const { data: brand, isLoading: brandLoading, isError, error } = useGetBrands();
  const { data: locations, isLoading: locLoading } = useGetLocations(brand?.uniqueId);

  const setBrand = useAppStore((s) => s.setBrand);

  /* Gate on the zustand mirrors, not on the query state. The store is written
     from inside the queryFn, so there is exactly one render where React Query
     says "settled" while storeLocation is still null — and every consumer that
     reads the store in that render sees a shop that does not exist. */
  const appBrand = useAppStore((s) => s.brand);
  const appStore = useAppStore((s) => s.storeLocation);

  useEffect(() => {
    if (brand) setBrand(brand);
  }, [brand, setBrand]);

  if (brandLoading || locLoading) {
    return (
      <BootScreen>
        <div className="dot3">
          <span />
          <span />
          <span />
        </div>
        <p className="text-[11px] font-bold tracking-[.22em] uppercase text-[var(--ink-2)]">
          Opening the kitchen…
        </p>
      </BootScreen>
    );
  }

  // the API never answered — almost always a backend that is not running
  if (isError) {
    return (
      <BootScreen>
        <div className="empty-emoji">
          <AlertCircle className="w-9 h-9 text-[var(--brand)]" />
        </div>
        <div>
          <p className="empty-title">Can&apos;t reach the kitchen</p>
          <p className="empty-sub mt-1">
            No answer from <b>{API_BASE_URL}</b>.
          </p>
          <p className="text-xs text-[var(--ink-2)] mt-3 leading-relaxed max-w-sm">
            Start the backend (<code>php artisan serve</code>), or point{' '}
            <code>VITE_API_BASE_URL</code> in <code>.env</code> at one that is running.
          </p>
          <p className="text-[11px] text-[var(--ink-2)] mt-2 font-mono">
            {error instanceof Error ? error.message : ''}
          </p>
        </div>
        <button
          onClick={() => qc.invalidateQueries({ queryKey: ['brands'] })}
          className="pill pill-green press mt-2"
        >
          <RefreshCw className="w-4 h-4" /> Try again
        </button>
      </BootScreen>
    );
  }

  // the API answered, but no brand is registered for this domain
  if (!brand) {
    return (
      <BootScreen>
        <div className="empty-emoji">
          <AlertCircle className="w-9 h-9 text-[var(--brand)]" />
        </div>
        <div>
          <p className="empty-title">This storefront isn&apos;t set up yet</p>
          <p className="empty-sub mt-1">
            No brand is registered for <b>{BRAND_DOMAIN}</b>.
          </p>
          <p className="text-xs text-[var(--ink-2)] mt-3 leading-relaxed max-w-sm">
            Create the brand in the admin panel with <b>domain = {BRAND_DOMAIN}</b>, or set{' '}
            <code>VITE_BRAND_DOMAIN</code> in <code>.env</code> to a domain that already has one.
          </p>
        </div>
        <button
          onClick={() => qc.invalidateQueries({ queryKey: ['brands'] })}
          className="pill pill-green press mt-2"
        >
          <RefreshCw className="w-4 h-4" /> Try again
        </button>
      </BootScreen>
    );
  }

  if (locations && locations.length === 0) {
    return (
      <BootScreen>
        <div className="empty-emoji">
          <AlertCircle className="w-9 h-9 text-[var(--brand)]" />
        </div>
        <div>
          <p className="empty-title">{brand.name} has no store yet</p>
          <p className="empty-sub mt-1">
            Add a store under this brand and mark it accepted — the menu, hours, delivery radius and
            fees all come from it.
          </p>
        </div>
      </BootScreen>
    );
  }

  if (!appBrand || !appStore) {
    return (
      <BootScreen>
        <div className="dot3">
          <span />
          <span />
          <span />
        </div>
      </BootScreen>
    );
  }

  return <>{children}</>;
}
