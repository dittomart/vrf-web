import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, Phone } from 'lucide-react';
import { VRF } from '@/api/_seed';

/* home.html's <footer>. "Store Hours" opens the shared StoreHoursModal, which
   HomePage owns — the prototype's openHours(). */
export function HomeFooter({ onOpenHours }: { onOpenHours: () => void }) {
  return (
    <footer className="mt-6 bg-[var(--ink)] text-white/70">
      <div className="max-w-6xl mx-auto px-6 py-11">
        <div className="flex items-center gap-3">
          <div className="logo-tile w-11 h-11">
            <img src="/image.png" alt="VRF" />
          </div>
          <p className="display text-white font-semibold text-xl">VRF Kitchen</p>
        </div>

        <p className="text-sm mt-3 max-w-sm">
          Pure-vegetarian cloud kitchen — home-style South Indian food, delivered hot across{' '}
          {VRF.area}, {VRF.city}.
        </p>

        <div className="grid grid-cols-2 gap-6 mt-8 text-sm">
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
            <a href={`tel:${VRF.phone}`} className="flex items-center gap-2 py-1 hover:text-white">
              <Phone className="w-3.5 h-3.5" /> 93723 81280
            </a>
            <a
              href={`https://wa.me/91${VRF.whatsapp}`}
              className="flex items-center gap-2 py-1 hover:text-white"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <p className="flex items-start gap-2 py-1">
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                {VRF.addressLine}, {VRF.area}, {VRF.city}, {VRF.state} {VRF.pincode}
                <br />
                {VRF.landmark}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-white/10 text-[12px] text-white/45 leading-relaxed">
          <p className="mb-2">
            Preview design with sample products. Your actual menu appears once onboarding is complete.
            Contact: 93723 81280
          </p>
          <p>© 2026 VRF Kitchen · Taste · Time · Quality</p>
        </div>
      </div>
    </footer>
  );
}
