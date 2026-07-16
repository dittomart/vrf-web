import { useAppStore } from '@/store/appStore';

/** Everything the chrome needs to say about the kitchen, resolved from the live
    brand + store rows. The prototype read these off a hardcoded `VRF` object;
    the field names are kept so the markup did not have to change.

    Nothing here invents a value: an empty string means the admin has not filled
    that column in, and the UI shows nothing rather than a plausible-looking
    stand-in. */
export function useBrandInfo() {
  const brand = useAppStore((s) => s.brand);
  const store = useAppStore((s) => s.storeLocation);

  const phone = store?.phone || brand?.phone || '';

  return {
    brand: brand?.name ?? '',
    logo: brand?.logo || '/image.png',

    city: store?.city ?? '',
    area: store?.landmark || store?.city || '',
    state: store?.state ?? '',
    pincode: store?.pincode ?? '',
    addressLine: store?.address ?? '',
    landmark: store?.landmark ?? '',
    address: [store?.address, store?.city, store?.state, store?.pincode].filter(Boolean).join(', '),

    lat: store?.latitude ?? 0,
    lng: store?.longitude ?? 0,
    radius: store?.deliveryRadius ?? 0,

    eta: store?.deliveryTime ?? 35,
    minOrder: store?.minOrder ?? 0,
    freeDeliveryAbove: store?.freeDeliveryAbove ?? 0,
    deliveryCharge: store?.deliveryCharge ?? 0,

    phone,
    whatsapp: store?.whatsapp || brand?.whatsapp || phone,
  };
}

/** Only the digits, for tel: and wa.me links. */
export function digitsOnly(phone: string): string {
  return (phone || '').replace(/\D/g, '');
}
