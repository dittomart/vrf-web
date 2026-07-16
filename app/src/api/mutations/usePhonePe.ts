import { useMutation } from '@tanstack/react-query';
import { API_BASE_URL, client } from '@/api/client';

/** The gateway code the backend compares against on /place-order is the exact
    string 'PhonePe' (case-sensitive, see OrderController). */
export function isPhonePeGateway(code: string): boolean {
  return /phone\s*pe/i.test(code);
}

/** The app.dittomart.in bridge that initiates PhonePe. Serving the redirect
    FROM the onboarded domain (not from our storefront) makes the Referer origin
    PhonePe reads match the merchant's onboarding URL — without it PhonePe
    answers INTERNAL_SECURITY_BLOCK_1.

    Route is a WEB route (`/phonepe/pay/{orderId}`), so it hangs off the host's
    web root, i.e. API base minus the trailing `/api` — e.g.
    https://app.dittomart.in/public/phonepe/pay/123 */
export function phonePeBridgeUrl(orderId: number): string {
  const webRoot = API_BASE_URL.replace(/\/api$/, '');
  return `${webRoot}/phonepe/pay/${orderId}`;
}

/** POST /payment/phonepe/create-order — the API path that returns the hosted
    checkout URL directly. Kept for reference / non-bridge fallback; the
    storefront prefers the bridge (see phonePeBridgeUrl) so the transacting
    origin is app.dittomart.in. */
export function useCreatePhonePeOrder() {
  return useMutation({
    mutationFn: async (orderId: number): Promise<string | null> => {
      const { data } = await client.post<{ success?: boolean; url?: string; message?: string }>(
        '/payment/phonepe/create-order',
        { order_id: orderId }
      );
      if (data?.success && typeof data.url === 'string' && data.url) return data.url;
      throw new Error(data?.message || 'PhonePe did not return a payment link');
    },
  });
}
