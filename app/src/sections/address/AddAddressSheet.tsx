import { useEffect, useState } from 'react';
import { AlertCircle, Briefcase, CheckCircle, House, MapPin, Navigation, X } from 'lucide-react';
import { useCoordinateToAddress } from '@/api/mutations/useAddresses';
import { useAppStore, toast } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { useLocationStore } from '@/store/locationStore';
import { reverseGeo, distanceKm } from '@/utils/geo';
import type { Address } from '@/types';

export interface AddressDraft {
  id?: string;
  label: string;
  houseNo: string;
  landmark: string;
  receiverName: string;
  phone: string;
  street: string;
  lat: number;
  lng: number;
}

const TAGS = [
  { tag: 'Home', Icon: House },
  { tag: 'Work', Icon: Briefcase },
  { tag: 'Other', Icon: MapPin },
] as const;

const TAG_OFF =
  'tagbtn flex-1 flex items-center gap-1.5 justify-center border-2 border-[var(--line)] rounded-xl py-2.5 text-sm font-semibold';
const TAG_ON =
  'tagbtn flex-1 flex items-center gap-1.5 justify-center border-2 border-[var(--brand)] text-[var(--brand)] rounded-xl py-2.5 text-sm font-semibold';

const GPS_IDLE = 'Detect my location (GPS)';

/* address.html's sheet. Coordinates only ever come from the device: an address
   the kitchen cannot route a rider to is worse than no address, so Save stays
   locked until a real fix lands, and a pin outside the delivery radius is
   rejected here rather than at the payment screen. */
export function AddAddressSheet({
  open,
  editing,
  onClose,
  onSave,
  saving,
}: {
  open: boolean;
  editing?: Address | null;
  onClose: () => void;
  onSave: (draft: AddressDraft) => void;
  saving?: boolean;
}) {
  const store = useAppStore((s) => s.storeLocation);
  const user = useAuthStore((s) => s.user);
  const userLoc = useLocationStore((s) => s.location);
  const coordinateToAddress = useCoordinateToAddress();

  const [coords, setCoords] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [tag, setTag] = useState('Home');
  const [flat, setFlat] = useState('');
  const [landmark, setLandmark] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gpsLbl, setGpsLbl] = useState(GPS_IDLE);

  /* Reopening the sheet on a different address must not leave the previous
     one's coordinates behind — that is how a customer ends up with two rows
     pinned to the same doorstep. */
  useEffect(() => {
    if (!open) return;

    if (editing) {
      setCoords(
        Number.isFinite(editing.latitude) && !(editing.latitude === 0 && editing.longitude === 0)
          ? { name: editing.street, lat: editing.latitude, lng: editing.longitude }
          : null
      );
      setTag(editing.label || 'Home');
      setFlat(editing.houseNo);
      setLandmark(editing.landmark);
      setName(editing.receiverName || user?.name || '');
      setPhone(editing.phone || user?.phone || '');
    } else {
      // seed from the pin the customer already dropped on the location screen
      setCoords(
        userLoc && Number.isFinite(userLoc.lat) && !(userLoc.lat === 0 && userLoc.lng === 0)
          ? { name: userLoc.address, lat: userLoc.lat, lng: userLoc.lng }
          : null
      );
      setTag('Home');
      setFlat('');
      setLandmark('');
      setName(user?.name ?? '');
      setPhone(user?.phone ?? '');
    }
    setGpsLbl(GPS_IDLE);
  }, [open, editing, user, userLoc]);

  const dist =
    coords && store ? distanceKm(coords.lat, coords.lng, store.latitude, store.longitude) : null;
  const outOfRange =
    dist != null && store != null && store.deliveryRadius > 0 && dist > store.deliveryRadius;

  const onGps = () => {
    if (!navigator.geolocation || !window.isSecureContext) {
      toast('GPS is unavailable here — open the app over https or localhost', 'map-pin');
      return;
    }

    setGpsLbl('Detecting…');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void (async () => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setGpsLbl('Finding your area…');

          // the backend's own geocoder first, OpenStreetMap as the backstop —
          // neither is allowed to hang the sheet
          let label = '';
          try {
            label = await coordinateToAddress.mutateAsync({ lat, lng });
          } catch {
            label = '';
          }
          if (!label) label = (await reverseGeo(lat, lng)) ?? '';

          setGpsLbl(GPS_IDLE);
          setCoords({ name: label || 'My current location', lat, lng });
          toast('Location captured ✓', 'check-circle');
        })();
      },
      (err) => {
        setGpsLbl(GPS_IDLE);
        toast(
          err.code === 1
            ? 'Location blocked — allow it to save an address'
            : "Couldn't detect your location — try again",
          'alert-circle'
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const ok =
    !!coords &&
    !outOfRange &&
    flat.trim().length > 0 &&
    name.trim().length > 0 &&
    /^\d{10}$/.test(phone.replace(/\D/g, '')) &&
    !saving;

  const submit = () => {
    if (!coords || !ok) return;
    onSave({
      id: editing?.id,
      label: tag,
      houseNo: flat.trim(),
      landmark: landmark.trim(),
      receiverName: name.trim(),
      phone: phone.replace(/\D/g, ''),
      street: coords.name,
      lat: coords.lat,
      lng: coords.lng,
    });
  };

  return (
    <div
      id="sheet"
      className={`fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} items-end justify-center bg-black/50 p-0 md:p-4`}
    >
      <div className="bg-[var(--card)] w-full max-w-2xl rounded-t-[26px] md:rounded-[26px] p-5 max-h-[90vh] overflow-y-auto anim-slidedown border border-[var(--line)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="eyebrow-g eyebrow">{editing ? 'Edit location' : 'New location'}</p>
            <h2 className="sec-title mt-0.5">{editing ? 'Edit address' : 'Add address'}</h2>
          </div>
          <button onClick={onClose} className="ibtn ibtn-ghost shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs font-bold text-[var(--ink-2)] mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" /> We need exact coordinates for delivery *
        </p>
        <button
          id="gps"
          onClick={onGps}
          className="w-full flex items-center justify-center gap-2 cta-lux shine ripple font-bold py-4 rounded-2xl press"
        >
          <Navigation className="w-5 h-5" /> <span id="gps-lbl">{gpsLbl}</span>
        </button>

        {coords ? (
          <div
            id="coord-box"
            className="mt-3 rounded-xl p-3.5 flex items-center gap-3 border"
            style={{
              background: outOfRange
                ? 'color-mix(in srgb, var(--brand) 8%, transparent)'
                : 'color-mix(in srgb, var(--primary) 6%, transparent)',
              borderColor: outOfRange
                ? 'color-mix(in srgb, var(--brand) 30%, transparent)'
                : 'color-mix(in srgb, var(--primary) 20%, transparent)',
            }}
          >
            <span className={`ichip w-9 h-9 ${outOfRange ? 'ichip-brand' : 'ichip-green'}`}>
              {outOfRange ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            </span>
            <div className="text-xs min-w-0">
              <p className="font-bold truncate" id="coord-addr">
                {coords.name}
              </p>
              <p className="mt-0.5" id="coord-latlng">
                {outOfRange ? (
                  <span className="inline-flex items-center gap-1 text-[var(--brand)] font-semibold">
                    {dist?.toFixed(1)} km away — outside the {store?.deliveryRadius} km delivery area
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[var(--green)] font-semibold">
                    <CheckCircle className="w-3 h-3" /> Location captured
                    {dist != null ? ` · ${dist.toFixed(1)} km from the kitchen` : ''}
                  </span>
                )}
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-5 space-y-3.5">
          <div>
            <label className="fld-label">Flat / House no, Floor *</label>
            <input
              id="flat"
              value={flat}
              onChange={(e) => setFlat(e.target.value)}
              placeholder="e.g. 12A, 2nd floor"
              className="fld"
            />
          </div>
          <div>
            <label className="fld-label">Landmark (optional)</label>
            <input
              id="landmark"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. near the bus stand"
              className="fld"
            />
          </div>
          <div>
            <label className="fld-label">Receiver name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Who is receiving this order?"
              className="fld"
            />
          </div>
          <div>
            <label className="fld-label">Phone *</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit mobile number"
              className="fld"
            />
          </div>
          <div>
            <label className="fld-label">Save address as</label>
            <div className="flex gap-2">
              {TAGS.map(({ tag: t, Icon }) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={tag === t ? TAG_ON : TAG_OFF}
                  style={tag === t ? { background: 'var(--brand-soft)' } : undefined}
                >
                  <Icon className="w-4 h-4" /> {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          id="save"
          disabled={!ok}
          onClick={submit}
          className={
            ok
              ? 'w-full mt-5 btn-brand ripple font-bold py-3.5 rounded-2xl press anim-scalein'
              : 'w-full mt-5 py-3.5 rounded-2xl font-bold text-white cursor-not-allowed'
          }
          style={ok ? undefined : { background: 'var(--ink-2)', opacity: 0.55 }}
        >
          {saving ? 'Saving…' : 'Save address'}
        </button>
        <p className="text-[11px] text-[var(--ink-2)] text-center mt-2">
          Save unlocks once GPS captures a deliverable location.
        </p>
      </div>
    </div>
  );
}
