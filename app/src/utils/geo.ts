/* ============================================================
   REVERSE GEOCODING — real place name from coordinates
   (OpenStreetMap Nominatim, free, no key needed)
   Ported from assets/app.js.
   ============================================================ */

/* Turn GPS coords into the most SPECIFIC place we can name:
       building / mall / amenity  →  road  →  neighbourhood  →  suburb
   Nominatim's bare `Ward NN` / `Zone` labels carry no meaning for a user,
   so they are only used as a last resort. */
export async function reverseGeo(lat: number, lng: number): Promise<string | null> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { Accept: 'application/json' } }
    );
    if (!r.ok) throw new Error('reverse geocode failed');
    const j = (await r.json()) as { name?: string; display_name?: string; address?: Record<string, string> };
    const a = j.address || {};

    const clean = (s: string | undefined) => (s || '').replace(/^[\s,·-]+|[\s,·-]+$/g, '').trim();
    const isWard = (s: string | undefined) => /^\s*(ward|zone)\b/i.test(s || ''); // "Ward 24" — useless to a human

    // 1. the exact place: a named POI/building the user is standing in
    const place = clean(
      j.name || a.building || a.mall || a.amenity || a.shop || a.office ||
      a.college || a.university || a.hospital || a.hotel || ''
    );

    // 2. the street
    const road = clean(a.road);
    const houseNo = clean(a.house_number);
    const street = road ? (houseNo ? `${houseNo} ${road}` : road) : '';

    // 3. the locality — skip meaningless "Ward NN" labels unless nothing else
    const localityRaw =
      a.neighbourhood || a.suburb || a.residential || a.village || a.town || a.city_district || '';
    const locality = isWard(localityRaw) ? '' : clean(localityRaw);

    const city = clean(a.city || a.town || a.municipality || a.county || a.state_district || '');

    // most specific first, then one broader anchor for context
    const primary = place || street || locality || (isWard(localityRaw) ? clean(localityRaw) : '');
    const context = primary && primary !== locality && locality ? locality : city;

    const name = [primary, context]
      .filter(Boolean)
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .join(', ');

    return name || clean((j.display_name || '').split(',').slice(0, 2).join(',')) || null;
  } catch {
    return null;
  }
}

/** Great-circle distance in km. Never stand in for a real coordinate with
    Math.random() or a hardcoded pin — this only measures what GPS gave us. */
export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}
