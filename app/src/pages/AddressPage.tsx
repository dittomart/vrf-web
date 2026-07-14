import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bike, MapPin, Plus } from 'lucide-react';

import { VRF } from '@/api/_seed';
import { money } from '@/utils/fmt';
import { toast } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { useLocationStore } from '@/store/locationStore';
import { normalizePhone } from '@/utils/normalizePhone';
import { useReveal } from '@/hooks/useReveal';

import { AddressCard } from '@/sections/address/AddressCard';
import { AddAddressSheet, type AddressDraft } from '@/sections/address/AddAddressSheet';
import type { Address } from '@/types';

/* Port of address.html. The typed Address carries more fields than the
   prototype's {tag,line,area,lat,lng} blob, so the mapping is:
     label ← tag · houseNo ← flat · street ← the captured place name (area)
     city/state ← the kitchen's city (Chennai, Tamil Nadu)
   `state` is required and is never dropped. */
export default function AddressPage() {
  useReveal();
  const navigate = useNavigate();

  const loggedIn = useAuthStore((s) => s.loggedIn);
  const user = useAuthStore((s) => s.user);
  const location = useLocationStore((s) => s.location);
  const addresses = useOrderStore((s) => s.addresses);
  const selectedAddressId = useOrderStore((s) => s.selectedAddressId);
  const addAddress = useOrderStore((s) => s.addAddress);
  const removeAddress = useOrderStore((s) => s.removeAddress);
  const selectAddress = useOrderStore((s) => s.selectAddress);

  const [sheetOpen, setSheetOpen] = useState(false);

  const receiverName = user?.name ?? '';
  const phone = user?.phone ? normalizePhone(user.phone) : '';

  /* Seed a starter address ONLY for a logged-in user who has none yet.
     (After logout the addresses are cleared and we must NOT re-seed.) */
  useEffect(() => {
    if (!loggedIn || addresses.length > 0 || !location?.address) return;
    addAddress({
      id: 'a1',
      label: 'Home',
      receiverName,
      phone,
      houseNo: 'Home',
      building: '',
      street: location.address,
      landmark: '',
      city: VRF.city,
      state: 'Tamil Nadu',
      pincode: '',
      latitude: location.lat,
      longitude: location.lng,
    });
  }, [loggedIn, addresses.length, location, addAddress, receiverName, phone]);

  /* renderSaved(): if nothing is selected, the first address wins. */
  useEffect(() => {
    if (!selectedAddressId && addresses[0]) selectAddress(addresses[0].id);
  }, [selectedAddressId, addresses, selectAddress]);

  const onRemove = (id: string) => {
    removeAddress(id);
    toast('Address removed', 'trash-2');
  };

  const onSave = (d: AddressDraft) => {
    const addr: Address = {
      id: 'a' + Date.now(),
      label: d.label,
      receiverName,
      phone,
      houseNo: d.houseNo,
      building: '',
      street: d.coords.name,
      landmark: d.landmark,
      city: VRF.city,
      state: 'Tamil Nadu',
      pincode: '',
      latitude: d.coords.lat,
      longitude: d.coords.lng,
    };
    addAddress(addr);
    selectAddress(addr.id);
    setSheetOpen(false);
    toast('Address saved');
  };

  const onProceed = () => {
    // Conditional login gate — exactly as the prototype's #proceed handler.
    navigate(loggedIn ? '/payment' : '/login');
  };

  const hasAddresses = addresses.length > 0;

  return (
    <div className="page-enter bg-[var(--cream)] text-[var(--ink)] pb-32">
      <header className="appbar">
        <div className="appbar-inner narrow flex items-center gap-3">
          <Link to="/cart" className="ibtn ibtn-ghost shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="appbar-title">Delivery Address</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6">
        {/* delivery banner */}
        <div
          className="ui-card-lux card-topline ui-card-pad flex items-center gap-3.5 mb-6 reveal"
          style={{
            background:
              'linear-gradient(120deg,color-mix(in srgb, var(--primary) 5%, transparent),color-mix(in srgb, var(--gold) 11%, transparent))',
          }}
        >
          <div className="ichip ichip-green w-11 h-11 bg-white shadow-sm">
            <Bike className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">Free delivery above {money(VRF.freeDeliveryAbove)}</p>
            <p className="text-xs text-[var(--ink-2)] mt-0.5">Delivered hot within {VRF.eta} minutes</p>
          </div>
          <span className="badge badge-gold">FRESH</span>
        </div>

        {/* saved */}
        <div className="reveal mb-4 sec-head" data-d="1">
          <span className="ichip ichip-brand">
            <MapPin className="w-5 h-5" />
          </span>
          <div>
            <p className="eyebrow-g eyebrow">Where to deliver</p>
            <h2 className="sec-title leading-tight">Choose an address</h2>
          </div>
        </div>
        <div id="saved" className="reveal grid gap-3 md:grid-cols-2" data-d="2">
          {addresses.map((a) => (
            <AddressCard
              key={a.id}
              address={a}
              selected={selectedAddressId === a.id}
              onSelect={selectAddress}
              onRemove={onRemove}
            />
          ))}
        </div>

        {/* empty state */}
        <div
          id="addr-empty"
          className={`${hasAddresses ? 'hidden ' : ''}ui-card ui-card-pad text-center reveal`}
          style={{ padding: '2.5rem 1.5rem' }}
        >
          <div className="empty-emoji" style={{ width: '70px', height: '70px' }}>
            <MapPin className="w-8 h-8 text-[var(--brand)]" />
          </div>
          <p className="empty-title" style={{ fontSize: '1.15rem' }}>
            No saved addresses
          </p>
          <p className="empty-sub">Add your first delivery address to continue.</p>
        </div>

        <button
          id="add-new"
          onClick={() => setSheetOpen(true)}
          className="w-full mt-4 flex items-center gap-2.5 justify-center border-2 border-dashed border-[var(--brand)] text-[var(--brand)] font-bold py-4 rounded-[20px] press reveal hover:bg-[var(--brand-soft)] transition"
          data-d="3"
        >
          <span className="w-7 h-7 rounded-full bg-[var(--brand-soft)] flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </span>{' '}
          Add a new address
        </button>
      </main>

      {/* Add address sheet */}
      <AddAddressSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onSave={onSave} />

      {/* proceed bar */}
      <div
        id="proceed-bar"
        className={`${hasAddresses ? '' : 'hidden '}fixed bottom-0 inset-x-0 z-30 glass border-t border-[var(--line)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]`}
      >
        <button
          id="proceed"
          onClick={onProceed}
          className="max-w-6xl mx-auto w-full cta-lux-accent shine ripple font-bold py-4 rounded-2xl press flex items-center justify-center gap-2"
        >
          Deliver here <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
