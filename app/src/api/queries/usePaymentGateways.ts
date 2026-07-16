import { useQuery } from '@tanstack/react-query';
import { assetUrl, client, num, truthy } from '@/api/client';
import { useAppStore } from '@/store/appStore';
import type { Gateway } from '@/types';

interface ApiGateway {
  id: number;
  name?: string | null;
  description?: string | null;
  is_active?: number | boolean;
  logo?: string | null;
  gateway?: string | null;
  payment_method?: string | null;
  type?: string | null;
}

/** POST /get-payment-gateways — only the gateways the store actually has on.

    The code is sent straight back as `method` on /place-order, so its CASE is
    load-bearing: the backend compares against 'PayUMoney', not 'payumoney'. */
export function useGetPaymentGateways() {
  const restaurantId = useAppStore((s) => s.storeLocation?.restaurantId);

  return useQuery<Gateway[]>({
    queryKey: ['payment-gateways', restaurantId],
    enabled: !!restaurantId,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data } = await client.post<ApiGateway[] | { data?: ApiGateway[] }>(
        '/get-payment-gateways',
        { restaurant_id: restaurantId }
      );

      const rows: ApiGateway[] = Array.isArray(data) ? data : (data?.data ?? []);

      return rows
        .filter((g) => truthy(g.is_active))
        .map((g) => ({
          id: num(g.id),
          code: String(g.gateway || g.name || g.payment_method || g.type || '').trim(),
          name: String(g.name ?? g.gateway ?? ''),
          description: String(g.description ?? ''),
          logo: assetUrl(g.logo),
        }))
        .filter((g) => !!g.code);
    },
  });
}

const COD = /^(cod|cash|cash_?on_?delivery)$/i;

export function isCodGateway(code: string): boolean {
  return COD.test(code.replace(/\s+/g, ''));
}

export function isPayuGateway(code: string): boolean {
  return /payu/i.test(code);
}
