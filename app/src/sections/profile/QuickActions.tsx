import { Link } from 'react-router-dom';
import { Heart, MapPin, ReceiptText } from 'lucide-react';

import { useGetOrders } from '@/api/queries/useOrders';
import { useGetAddresses } from '@/api/mutations/useAddresses';
import { useWishlistStore } from '@/store/wishlistStore';

/* profile.html's quick actions. Each tile's sub-label is a live count. */
export function QuickActions() {
  const { orders } = useGetOrders();
  const { data: addresses = [] } = useGetAddresses();
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
        <span className="qtile-lbl min-w-0 truncate">My Orders</span>
        <span className="qtile-sub min-w-0 truncate">
          {nOrders ? `${nOrders} order${nOrders > 1 ? 's' : ''}` : 'Track & reorder'}
        </span>
      </Link>

      <Link to="/address" className="qtile">
        <span className="qtile-ico ichip-gold">
          <MapPin className="w-5 h-5" />
        </span>
        <span className="qtile-lbl min-w-0 truncate">Addresses</span>
        <span className="qtile-sub min-w-0 truncate">{nAddr ? `${nAddr} saved` : 'Add one'}</span>
      </Link>

      <Link to="/wishlist" className="qtile">
        <span className="qtile-ico ichip-brand">
          <Heart className="w-5 h-5" />
        </span>
        <span className="qtile-lbl min-w-0 truncate">Wishlist</span>
        <span className="qtile-sub min-w-0 truncate">{nWish ? `${nWish} saved` : 'Nothing yet'}</span>
      </Link>
    </section>
  );
}
