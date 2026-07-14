import { Link, useLocation } from 'react-router-dom';
import { House, UtensilsCrossed, ReceiptText, UserRound } from 'lucide-react';

/* Floating pill dock — the React equivalent of app.js injectChrome().
   Same four items, same icons, same labels, same order. */
const ITEMS = [
  { key: 'home', label: 'Home', Icon: House, href: '/home' },
  { key: 'search', label: 'Menu', Icon: UtensilsCrossed, href: '/category' },
  { key: 'orders', label: 'Orders', Icon: ReceiptText, href: '/orders' },
  { key: 'profile', label: 'Profile', Icon: UserRound, href: '/profile' },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();

  // wishlist lives under the Profile tab, as injectChrome("profile") did
  const active =
    pathname.startsWith('/category') || pathname.startsWith('/product')
      ? 'search'
      : pathname.startsWith('/orders')
        ? 'orders'
        : pathname.startsWith('/profile') || pathname.startsWith('/wishlist')
          ? 'profile'
          : 'home';

  return (
    <nav id="bottom-nav" className="md:hidden">
      <div className="nav-dock">
        {ITEMS.map(({ key, label, Icon, href }) => (
          <Link
            key={key}
            to={href}
            className={`nav-item ${active === key ? 'is-active' : ''}`}
            aria-label={label}
          >
            <span className="nav-ico">
              <Icon className="w-[21px] h-[21px]" />
            </span>
            <span className="nav-lbl">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
