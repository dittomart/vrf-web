import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, LogIn, LogOut, Moon, Navigation, Settings2, Sun } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { StoreHoursModal } from '@/shared/StoreHoursModal';
import { useAppStore, toast } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { useLocationStore } from '@/store/locationStore';
import { useBrandInfo } from '@/hooks/useBrandInfo';
import { getMode, resolveMode, toggleMode } from '@/theme/themes';
import { isStoreOpenNow, todayHours } from '@/utils/storeHours';

/* profile.html's Preferences panel. */
export function SettingsPanel() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const loggedIn = useAuthStore((s) => s.loggedIn);
  const logout = useAuthStore((s) => s.logout);
  const location = useLocationStore((s) => s.location);
  const store = useAppStore((s) => s.storeLocation);
  const brand = useBrandInfo();

  const [hoursOpen, setHoursOpen] = useState(false);
  const [dark, setDark] = useState(() => resolveMode(getMode()) === 'dark');
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    []
  );

  const onToggleMode = () => {
    toggleMode();
    setDark(resolveMode(getMode()) === 'dark');
  };

  const onAuth = () => {
    if (loggedIn) {
      logout();
      // the addresses, orders and wallet in the cache belong to that session
      qc.clear();
      toast('Logged out');
      timer.current = window.setTimeout(() => navigate('/home'), 600);
    } else {
      navigate('/login?next=/profile');
    }
  };

  const today = todayHours(store);
  const openNow = isStoreOpenNow(store);

  return (
    <aside className="min-w-0">
      <div className="sec-head">
        <span className="ichip ichip-green shrink-0">
          <Settings2 className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <p className="eyebrow eyebrow-g">Preferences</p>
          <p className="sec-title leading-tight">Settings</p>
        </div>
      </div>

      <div className="ui-card overflow-hidden">
        <button onClick={() => setHoursOpen(true)} className="acct-row press">
          <span className="ichip ichip-gold w-10 h-10 shrink-0">
            <Clock className="w-[19px] h-[19px]" />
          </span>
          <span className="flex-1 min-w-0 text-left">
            <span className="acct-row-t">Store Hours</span>
            <span className="acct-row-s">
              {today ? `${today} today` : openNow ? 'Open now' : 'Closed right now'}
            </span>
          </span>
          <ChevronRight className="w-4 h-4 text-[var(--ink-2)] shrink-0" />
        </button>

        <button onClick={() => navigate('/location')} className="acct-row press">
          <span className="ichip ichip-green w-10 h-10 shrink-0">
            <Navigation className="w-[19px] h-[19px]" />
          </span>
          <span className="flex-1 min-w-0 text-left">
            <span className="acct-row-t">Delivery Location</span>
            <span className="acct-row-s truncate">{location?.address || 'Set your area'}</span>
          </span>
          <ChevronRight className="w-4 h-4 text-[var(--ink-2)] shrink-0" />
        </button>

        <button onClick={onToggleMode} className="acct-row press">
          <span className="ichip ichip-brand w-10 h-10 shrink-0">
            {dark ? <Sun className="w-[19px] h-[19px]" /> : <Moon className="w-[19px] h-[19px]" />}
          </span>
          <span className="flex-1 min-w-0 text-left">
            <span className="acct-row-t">Appearance</span>
            <span className="acct-row-s">{dark ? 'Dark mode' : 'Light mode'}</span>
          </span>
          <span className={`acct-switch${dark ? ' is-on' : ''}`}>
            <span />
          </span>
        </button>
      </div>

      <button
        onClick={onAuth}
        className="w-full mt-4 btn-outline press font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2"
      >
        {loggedIn ? (
          <>
            <LogOut className="w-4 h-4" /> Logout
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" /> Login / Sign up
          </>
        )}
      </button>

      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="logo-tile w-10 h-10 opacity-90">
          <img src={brand.logo} alt="" />
        </div>
        <p className="script text-base" style={{ color: 'var(--gold)' }}>
          Taste · Time · Quality
        </p>
        {brand.phone ? (
          <p className="text-center text-[11px] text-[var(--ink-2)]">
            {brand.brand} · {brand.phone}
          </p>
        ) : null}
      </div>

      <StoreHoursModal open={hoursOpen} onClose={() => setHoursOpen(false)} />
    </aside>
  );
}
