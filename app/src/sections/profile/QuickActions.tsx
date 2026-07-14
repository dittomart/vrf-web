import { Link } from 'react-router-dom';
import { Heart, MapPin, MessageCircle, ReceiptText } from 'lucide-react';

import { VRF } from '@/api/_seed';
import { useOrderStore } from '@/store/orderStore';
import { useWishlistStore } from '@/store/wishlistStore';

/* profile.html <section class="acct-quick"> — the four things people actually
   come here for. Each tile's sub-label shows a live count, exactly as the
   page's script recomputed them. */
export function QuickActions() {
  const orders = useOrderStore((s) => s.orders);
  const addresses = useOrderStore((s) => s.addresses);
  const wishlist = useWishlistStore((s) => s.ids);

  const nOrders = orders.length;
  const nAddr = addresses.length;
  const nWish = wishlist.length;

  return (
    <section className="acct-quick stagger">
      <Link to="/orders" className="qtile">
        <span className="qtile-ico ichip-green">
          <ReceiptText className="w-5 h-5" />
        </span>
        <span className="qtile-lbl">My Orders</span>
        <span className="qtile-sub">
          {nOrders ? `${nOrders} order${nOrders > 1 ? 's' : ''}` : 'Track & reorder'}
        </span>
      </Link>

      <Link to="/address" className="qtile">
        <span className="qtile-ico ichip-gold">
          <MapPin className="w-5 h-5" />
        </span>
        <span className="qtile-lbl">Addresses</span>
        <span className="qtile-sub">{nAddr ? `${nAddr} saved` : 'Add one'}</span>
      </Link>

      <Link to="/wishlist" className="qtile">
        <span className="qtile-ico ichip-brand">
          <Heart className="w-5 h-5" />
        </span>
        <span className="qtile-lbl">Wishlist</span>
        <span className="qtile-sub">{nWish ? `${nWish} saved` : 'Nothing yet'}</span>
      </Link>

      <a href={`https://wa.me/91${VRF.whatsapp}`} className="qtile">
        <span className="qtile-ico ichip-green">
          <MessageCircle className="w-5 h-5" />
        </span>
        <span className="qtile-lbl">Support</span>
        <span className="qtile-sub">WhatsApp us</span>
      </a>
    </section>
  );
}
