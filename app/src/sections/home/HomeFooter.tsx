import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, Phone } from 'lucide-react';
import { digitsOnly, useBrandInfo } from '@/hooks/useBrandInfo';

/* home.html's <footer>. Every contact detail is the store's own row — a phone
   number the admin has not filled in is simply not shown, rather than a
   plausible-looking one nobody answers. */
export function HomeFooter({ onOpenHours }: { onOpenHours: () => void }) {
  const brand = useBrandInfo();
  const phones = brand.phones.filter((p) => digitsOnly(p));
  const whatsapp = digitsOnly(brand.whatsapp);

  return (
    <footer className="mt-6 bg-[var(--ink)] text-white/70">
      <div className="max-w-6xl mx-auto px-6 py-11">
        <div className="flex items-center gap-3">
          <div className="logo-tile w-11 h-11">
            <img src={brand.logo} alt={brand.brand} />
          </div>
          <p className="display text-white font-semibold text-xl">{brand.brand}</p>
        </div>

        {brand.city ? (
          <p className="text-sm mt-3 max-w-sm">
            Pure-vegetarian cloud kitchen — home-style South Indian food, delivered hot across{' '}
            {brand.city}.
          </p>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 text-sm">
          <div>
            <p className="font-semibold text-white mb-2">Company</p>
            <button onClick={onOpenHours} className="block py-1 hover:text-white">
              Store Hours
            </button>
            <Link to="/orders" className="block py-1 hover:text-white">
              My Orders
            </Link>
            <Link to="/profile" className="block py-1 hover:text-white">
              My Account
            </Link>
          </div>
          <div>
            <p className="font-semibold text-white mb-2">Reach us</p>
            {phones.map((p) => (
              <a
                key={p}
                href={`tel:${digitsOnly(p)}`}
                className="flex items-center gap-2 py-1 hover:text-white"
              >
                <Phone className="w-3.5 h-3.5" /> {p}
              </a>
            ))}
            {whatsapp ? (
              <a
                href={`https://wa.me/${whatsapp.length === 10 ? `91${whatsapp}` : whatsapp}`}
                className="flex items-center gap-2 py-1 hover:text-white"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </a>
            ) : null}
            {brand.address ? (
              <p className="flex items-start gap-2 py-1">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span className="min-w-0 break-words">
                  {brand.address}
                  {brand.landmark ? (
                    <>
                      <br />
                      {brand.landmark}
                    </>
                  ) : null}
                </span>
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-white/10 text-[12px] text-white/45 leading-relaxed">
          <p>© {new Date().getFullYear()} {brand.brand} · Taste · Time · Quality</p>
        </div>
      </div>
    </footer>
  );
}
