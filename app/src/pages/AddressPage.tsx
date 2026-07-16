import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bike, MapPin, Plus } from 'lucide-react';

import {
  useDeleteAddress,
  useGetAddresses,
  useSaveAddress,
} from '@/api/mutations/useAddresses';
import { money } from '@/utils/fmt';
import { toast } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { useBrandInfo } from '@/hooks/useBrandInfo';
import { useReveal } from '@/hooks/useReveal';

import { AddressCard } from '@/sections/address/AddressCard';
import { AddAddressSheet, type AddressDraft } from '@/sections/address/AddAddressSheet';
import type { Address } from '@/types';

/* Port of address.html, against the customer's real saved addresses.

   Picking a card selects it and nothing else — it never navigates. The customer
   commits with "Deliver here", which is the only place the checkout moves on. */
export default function AddressPage() {
  useReveal();
  const navigate = useNavigate();
  const brand = useBrandInfo();

  const loggedIn = useAuthStore((s) => s.loggedIn);
  const { data: addresses = [], isLoading } = useGetAddresses();
  const saveAddress = useSaveAddress();
  const deleteAddress = useDeleteAddress();

  const selectedAddressId = useOrderStore((s) => s.selectedAddressId);
  const selectAddress = useOrderStore((s) => s.selectAddress);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  /* Checkout needs an account: the address list, the order and the payment all
     hang off the JWT. */
  useEffect(() => {
    if (!loggedIn) navigate('/login?next=/address', { replace: true });
  }, [loggedIn, navigate]);

  /* Nothing selected yet → the first saved address wins, as renderSaved() did.
     A selection pointing at an address that has since been deleted is dropped. */
  useEffect(() => {
    if (addresses.length === 0) return;
    const stillThere = addresses.some((a) => a.id === selectedAddressId);
    if (!stillThere) selectAddress(addresses[0].id);
  }, [addresses, selectedAddressId, selectAddress]);

  const onRemove = async (id: string) => {
    try {
      await deleteAddress.mutateAsync(id);
      if (selectedAddressId === id) selectAddress(null);
      toast('Address removed', 'trash-2');
    } catch {
      toast('Could not remove that address', 'alert-circle');
    }
  };

  const onSave = async (d: AddressDraft) => {
    try {
      const list = await saveAddress.mutateAsync({
        id: d.id,
        latitude: d.lat,
        longitude: d.lng,
        address: d.street,
        house: d.houseNo,
        tag: d.label,
        landmark: d.landmark,
        name: d.receiverName,
        phone: d.phone,
      });

      // the endpoint answers with the whole list, newest first
      const saved = list[0];
      if (saved) selectAddress(saved.id);

      setSheetOpen(false);
      setEditing(null);
      toast('Address saved');
    } catch {
      toast('Could not save that address', 'alert-circle');
    }
  };

  const onProceed = () => {
    if (!selectedAddressId) {
      toast('Choose where we should deliver', 'map-pin');
      return;
    }
    navigate('/payment');
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
        {brand.freeDeliveryAbove > 0 && (
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
              <p className="font-bold text-sm">
                Free delivery above {money(brand.freeDeliveryAbove)}
              </p>
              <p className="text-xs text-[var(--ink-2)] mt-0.5">
                Delivered hot within {brand.eta} minutes
              </p>
            </div>
            <span className="badge badge-gold">FRESH</span>
          </div>
        )}

        <div className="reveal mb-4 sec-head" data-d="1">
          <span className="ichip ichip-brand">
            <MapPin className="w-5 h-5" />
          </span>
          <div>
            <p className="eyebrow-g eyebrow">Where to deliver</p>
            <h2 className="sec-title leading-tight">Choose an address</h2>
          </div>
        </div>

        {/* The "add" tile lives INSIDE the same grid as the cards, so it lines up
            with them instead of running full-bleed under a half-width column. */}
        <div id="saved" className="reveal grid gap-4 md:grid-cols-2" data-d="2">
          {addresses.map((a) => (
            <AddressCard
              key={a.id}
              address={a}
              selected={selectedAddressId === a.id}
              onSelect={selectAddress}
              onEdit={(addr) => {
                setEditing(addr);
                setSheetOpen(true);
              }}
              onRemove={onRemove}
            />
          ))}

          {hasAddresses && (
            <button
              id="add-new"
              onClick={() => {
                setEditing(null);
                setSheetOpen(true);
              }}
              className="min-h-[7rem] flex items-center gap-2.5 justify-center border-2 border-dashed border-[var(--brand)] text-[var(--brand)] font-bold py-4 rounded-[20px] press hover:bg-[var(--brand-soft)] transition"
            >
              <span className="w-7 h-7 rounded-full bg-[var(--brand-soft)] flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </span>
              Add a new address
            </button>
          )}
        </div>

        {!isLoading && !hasAddresses && (
          <div
            id="addr-empty"
            className="ui-card ui-card-pad text-center reveal"
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
        )}

        {/* With no saved addresses the grid is empty, so the add tile stands alone
            full-width under the empty state. */}
        {!hasAddresses && (
          <button
            id="add-new"
            onClick={() => {
              setEditing(null);
              setSheetOpen(true);
            }}
            className="w-full mt-4 flex items-center gap-2.5 justify-center border-2 border-dashed border-[var(--brand)] text-[var(--brand)] font-bold py-4 rounded-[20px] press reveal hover:bg-[var(--brand-soft)] transition"
            data-d="3"
          >
            <span className="w-7 h-7 rounded-full bg-[var(--brand-soft)] flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </span>{' '}
            Add a new address
          </button>
        )}
      </main>

      <AddAddressSheet
        open={sheetOpen}
        editing={editing}
        saving={saveAddress.isPending}
        onClose={() => {
          setSheetOpen(false);
          setEditing(null);
        }}
        onSave={onSave}
      />

      <div
        id="proceed-bar"
        className={`${hasAddresses ? '' : 'hidden '}fixed bottom-0 inset-x-0 z-30 glass border-t border-[var(--line)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]`}
      >
        <button
          id="proceed"
          onClick={onProceed}
          disabled={!selectedAddressId}
          className="max-w-6xl mx-auto w-full cta-lux-accent shine ripple font-bold py-4 rounded-2xl press flex items-center justify-center gap-2 disabled:opacity-50"
        >
          Deliver here <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
