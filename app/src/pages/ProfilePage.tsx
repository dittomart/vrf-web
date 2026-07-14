import { Link } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';

import { AccountHero } from '@/sections/profile/AccountHero';
import { QuickActions } from '@/sections/profile/QuickActions';
import { SavedCombos } from '@/sections/profile/SavedCombos';
import { SettingsPanel } from '@/sections/profile/SettingsPanel';
import { useReveal } from '@/hooks/useReveal';

/* profile.html — appbar · identity hero (avatar + name + 3 stats) · quick
   actions · body grid (saved combos | settings). Logged-out is an inline state
   here, never a redirect: the hero reads "Guest / Not logged in" and the auth
   button becomes "Login / Sign up", exactly as the prototype did. */
export default function ProfilePage() {
  useReveal();

  return (
    <div className="page-enter pb-28 md:pb-10">
      <header className="appbar">
        <div className="appbar-inner flex items-center gap-3">
          <Link to="/home" className="ibtn ibtn-ghost shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="appbar-title flex-1">My Account</h1>
          <Link to="/wishlist" className="ibtn ibtn-ghost shrink-0" aria-label="Wishlist">
            <Heart className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-4">
        <AccountHero />
        <QuickActions />

        <div className="acct-grid">
          <SavedCombos />
          <SettingsPanel />
        </div>
      </main>
    </div>
  );
}
