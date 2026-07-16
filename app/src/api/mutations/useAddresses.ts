import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client, num } from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import type { Address } from '@/types';

interface ApiAddress {
  id: number;
  user_id?: number;
  address?: string | null;
  house?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  tag?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  landmark?: string | null;
  name?: string | null;
  phone?: string | null;
  is_default?: number | boolean | null;
}

function mapAddress(a: ApiAddress): Address {
  return {
    id: String(a.id),
    label: String(a.tag || 'Home'),
    receiverName: String(a.name ?? ''),
    phone: String(a.phone ?? ''),
    houseNo: String(a.house ?? ''),
    building: '',
    street: String(a.address ?? ''),
    landmark: String(a.landmark ?? ''),
    city: String(a.city ?? ''),
    state: String(a.state ?? ''),
    pincode: String(a.pincode ?? ''),
    latitude: num(a.latitude),
    longitude: num(a.longitude),
    isDefault: !!a.is_default,
  };
}

/** Both /get-addresses and /save-address answer with the whole list — sometimes
    bare, sometimes wrapped. */
function unwrap(data: unknown): Address[] {
  const rows = Array.isArray(data)
    ? data
    : Array.isArray((data as { data?: unknown })?.data)
      ? ((data as { data: ApiAddress[] }).data)
      : [];
  return (rows as ApiAddress[]).filter((r) => r && r.id != null).map(mapAddress);
}

export interface AddressInput {
  id?: string;
  latitude: number;
  longitude: number;
  address: string;
  house: string;
  tag: string;
  landmark?: string;
  name?: string;
  phone?: string;
}

/** POST /get-addresses */
export function useGetAddresses() {
  const token = useAuthStore((s) => s.authToken);

  return useQuery<Address[]>({
    queryKey: ['addresses', token],
    enabled: !!token,
    staleTime: 60_000,
    queryFn: async () => {
      const { data } = await client.post('/get-addresses', {});
      return unwrap(data);
    },
  });
}

/** POST /save-address — the backend fills city/state/pincode itself by
    reverse-geocoding the coordinates, so those are never sent. */
export function useSaveAddress() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddressInput): Promise<Address[]> => {
      const body: Record<string, unknown> = {
        latitude: input.latitude,
        longitude: input.longitude,
        address: input.address ?? '',
        house: input.house ?? '',
        tag: input.tag ?? 'Home',
        landmark: input.landmark ?? '',
        name: input.name ?? '',
        phone: input.phone ?? '',
      };
      // an update carries the id under both names: the fork reads one or the
      // other depending on how old the deploy is
      if (input.id) {
        body.id = Number(input.id);
        body.address_id = Number(input.id);
      }

      const { data } = await client.post('/save-address', body);
      return unwrap(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  });
}

/** POST /delete-address */
export function useDeleteAddress() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<Address[]> => {
      const { data } = await client.post('/delete-address', {
        id: Number(id),
        address_id: Number(id),
      });
      return unwrap(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  });
}

/** POST /set-default-address */
export function useSetDefaultAddress() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await client.post('/set-default-address', {
        id: Number(id),
        address_id: Number(id),
      });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  });
}

/** POST /coordinate-to-address — the backend's own reverse geocoder. Answers
    with a bare string, and "" when it has nothing. */
export function useCoordinateToAddress() {
  return useMutation({
    mutationFn: async ({ lat, lng }: { lat: number; lng: number }): Promise<string> => {
      const { data } = await client.post<unknown>('/coordinate-to-address', { lat, lng });
      return typeof data === 'string' ? data : '';
    },
  });
}
