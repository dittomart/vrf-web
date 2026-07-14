import { useState } from 'react';
import { Briefcase, CheckCircle, House, MapPin, Navigation, Search, X } from 'lucide-react';
import { SERVICE_AREA_PINS } from '@/api/_seed';
import { toast } from '@/store/appStore';
import { reverseGeo } from '@/utils/geo';

export interface Coords {
  name: string;
  lat: number;
  lng: number;
}

export interface AddressDraft {
  label: string;
  houseNo: string;
  landmark: string;
  coords: Coords;
}

/* address.html — the `areas` list the manual search filters over. Same
   serviceable-area pins the location screen uses, so the two cannot drift. */
const AREAS: Coords[] = SERVICE_AREA_PINS;

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

export function AddAddressSheet({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (draft: AddressDraft) => void;
}) {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [tag, setTag] = useState<string>('Home');
  const [flat, setFlat] = useState('');
  const [landmark, setLandmark] = useState('');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Coords[] | null>(null);
  const [gpsLbl, setGpsLbl] = useState(GPS_IDLE);

  /* address.html's setCoords(): shows the coord box and mirrors the place
     name into the search field. */
  const capture = (a: Coords) => {
    setCoords(a);
    setSearch(a.name);
    setResults(null);
  };

  const reset = () => {
    setCoords(null);
    setFlat('');
    setLandmark('');
    setSearch('');
    setResults(null);
    setGpsLbl(GPS_IDLE);
  };

  const onGps = () => {
    /* Coordinates only ever come from navigator.geolocation — there is no
       synthetic stand-in. Without it, Save stays disabled and the user is
       pointed at the manual area search. */
    if (!navigator.geolocation || !window.isSecureContext) {
      toast('GPS unavailable here — search your area below', 'map-pin');
      return;
    }
    setGpsLbl('Detecting…');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const pt = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setGpsLbl('Finding your area…');
          // real place name (never hangs — 4s timeout race)
          const label = await Promise.race<string | null>([
            reverseGeo(pt.lat, pt.lng).catch(() => null),
            new Promise<string | null>((r) => setTimeout(() => r(null), 4000)),
          ]);
          setGpsLbl(GPS_IDLE);
          capture({ name: label || 'My current location', lat: pt.lat, lng: pt.lng });
          toast('Location captured ✓', 'check-circle');
        } catch {
          setGpsLbl(GPS_IDLE);
          toast('Something went wrong — search below', 'alert-circle');
        }
      },
      (err) => {
        setGpsLbl(GPS_IDLE);
        toast(
          err.code === 1 ? 'Location blocked — search your area below' : "Couldn't detect — search below",
          'alert-circle'
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const onSearch = (v: string) => {
    setSearch(v);
    setCoords(null); // typing invalidates the captured pin → Save locks again
    const q = v.toLowerCase();
    if (!q) {
      setResults(null);
      return;
    }
    setResults(AREAS.filter((a) => a.name.toLowerCase().includes(q)));
  };

  const ok = !!coords && flat.trim().length > 0;

  const submit = () => {
    if (!coords) return;
    onSave({ label: tag, houseNo: flat.trim(), landmark: landmark.trim(), coords });
    reset();
  };

  return (
    <div
      id="sheet"
      className={`fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} items-end justify-center bg-black/50 p-0 md:p-4`}
    >
      <div className="bg-[var(--card)] w-full max-w-2xl rounded-t-[26px] md:rounded-[26px] p-5 max-h-[90vh] overflow-y-auto anim-slidedown border border-[var(--line)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="eyebrow-g eyebrow">New location</p>
            <h2 className="sec-title mt-0.5">Add address</h2>
          </div>
          <button onClick={onClose} className="ibtn ibtn-ghost shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* coordinate capture */}
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
        <div className="div-label my-4">OR SEARCH MANUALLY</div>
        <div className="fld-wrap">
          <Search className="fld-ico w-4 h-4" />
          <input
            id="addr-search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search your area / landmark"
            className="fld"
          />
          <div
            id="addr-results"
            className={`${results ? '' : 'hidden '}mt-2 rounded-xl border border-[var(--line)] overflow-hidden divide-y divide-[var(--line)] shadow-[var(--shadow-md)]`}
          >
            {results && results.length > 0 ? (
              results.map((a) => (
                <button
                  key={a.name}
                  onClick={() => capture(a)}
                  className="w-full text-left px-4 py-3 hover:bg-[var(--ivory-2)] flex items-center gap-2 text-sm bg-[var(--card)]"
                >
                  <MapPin className="w-4 h-4 text-[var(--brand)]" />
                  {a.name}
                </button>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-[var(--ink-2)] bg-[var(--card)]">No match</p>
            )}
          </div>
        </div>

        {/* captured coords indicator */}
        <div
          id="coord-box"
          className={`${coords ? '' : 'hidden '}mt-3 rounded-xl p-3.5 flex items-center gap-3 border`}
          style={{
            background: 'color-mix(in srgb, var(--primary) 6%, transparent)',
            borderColor: 'color-mix(in srgb, var(--primary) 20%, transparent)',
          }}
        >
          <span className="ichip ichip-green w-9 h-9">
            <CheckCircle className="w-5 h-5" />
          </span>
          <div className="text-xs min-w-0">
            <p className="font-bold truncate" id="coord-addr">
              {coords?.name}
            </p>
            <p className="mt-0.5" id="coord-latlng">
              <span className="inline-flex items-center gap-1 text-[var(--green)] font-semibold">
                <CheckCircle className="w-3 h-3" /> GPS verified · location captured
              </span>
            </p>
          </div>
        </div>

        {/* details */}
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
              placeholder="e.g. near Bharathi Park"
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
          Save address
        </button>
        <p className="text-[11px] text-[var(--ink-2)] text-center mt-2">
          Save unlocks once GPS/search captures your coordinates.
        </p>
      </div>
    </div>
  );
}
