import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';

import { useGetAddresses } from '@/api/mutations/useAddresses';
import { checkBan, usePlaceOrder } from '@/api/mutations/useCheckout';
import { isCodGateway, useGetPaymentGateways } from '@/api/queries/usePaymentGateways';
import { useGetWallet } from '@/api/queries/useOrders';
import { useAppStore, toast } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { useOrderTotals } from '@/hooks/useOrderTotals';
import { useBrandInfo } from '@/hooks/useBrandInfo';
import { useReveal } from '@/hooks/useReveal';
import { useStickyBar } from '@/hooks/useStickyBar';
import { money } from '@/utils/fmt';
import { buildPlaceOrderBody } from '@/utils/placeOrderBody';
import { isStoreOpenNow } from '@/utils/storeHours';
import { distanceKm } from '@/utils/geo';

import { PaySummary } from '@/sections/payment/PaySummary';
import { PayMethods } from '@/sections/payment/PayMethods';
import { GatewayModal, type GatewayPhase } from '@/sections/payment/GatewayModal';
import { ClosedStoreModal } from '@/sections/payment/ClosedStoreModal';
import { TrustBand } from '@/sections/payment/TrustBand';
import type { Order } from '@/types';

/* payment.html, wired to the real checkout: the store's own gateways, the
   customer's wallet, /check-ban, /place-order and the PayU handoff. */
export default function PaymentPage() {
  const navigate = useNavigate();
  useReveal();
  const stuck = useStickyBar();
  const brand = useBrandInfo();

  const user = useAuthStore((s) => s.user);
  const authToken = useAuthStore((s) => s.authToken);
  const loggedIn = useAuthStore((s) => s.loggedIn);

  const store = useAppStore((s) => s.storeLocation);
  const lines = useCartStore((s) => s.lines);
  const clearCart = useCartStore((s) => s.clear);

  const selectedAddressId = useOrderStore((s) => s.selectedAddressId);
  const setLastOrder = useOrderStore((s) => s.setLastOrder);

  const { data: addresses } = useGetAddresses();
  const { data: gateways = [], isLoading: gatewaysLoading } = useGetPaymentGateways();
  const { data: wallet } = useGetWallet();
  const totals = useOrderTotals();
  const placeOrder = usePlaceOrder();

  const [selected, setSelected] = useState('');
  const [useWallet, setUseWallet] = useState(false);
  const [phase, setPhase] = useState<GatewayPhase>('closed');
  const [storeClosed, setStoreClosed] = useState(false);

  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  /* Once the order is placed we clear the cart and hand off to the gateway. That
     empties `lines`, which must NOT be read as "customer arrived with an empty
     cart" and bounce them to /cart — it would race the gateway navigation and
     win, so PayU/PhonePe never opens. This latch says "a handoff is in flight". */
  const handingOff = useRef(false);

  /* Checkout is an authed flow end to end — the address list, the order and the
     wallet all hang off the token. */
  useEffect(() => {
    if (!loggedIn) navigate('/login?next=/payment', { replace: true });
  }, [loggedIn, navigate]);

  useEffect(() => {
    if (!selected && gateways.length > 0) setSelected(gateways[0].code);
  }, [gateways, selected]);

  useEffect(() => {
    if (lines.length === 0 && !handingOff.current) {
      toast('Your cart is empty', 'shopping-bag');
      navigate('/cart', { replace: true });
    }
  }, [lines.length, navigate]);

  const total = totals.total;
  const walletBalance = wallet?.balance ?? user?.wallet ?? 0;

  /* The wallet is a toggle, not a method. When it covers the whole bill the
     order settles as WALLET and no gateway is involved; when it covers part, the
     gateway takes the remainder and the backend is told so with partial_wallet. */
  const walletCoversAll = useWallet && walletBalance > 0 && walletBalance >= total;
  const effectiveMethod = walletCoversAll ? 'WALLET' : selected;
  const amountAfterWallet = useWallet ? Math.max(0, total - walletBalance) : total;
  const walletApplied = useWallet ? Math.min(walletBalance, total) : 0;

  const addr = useMemo(
    () =>
      addresses?.find((a) => a.id === selectedAddressId) ??
      addresses?.find((a) => a.id === String(user?.defaultAddressId ?? '')) ??
      addresses?.[0],
    [addresses, selectedAddressId, user]
  );

  const onPay = async () => {
    if (placeOrder.isPending) return;

    if (!effectiveMethod) {
      toast('Choose how you want to pay', 'alert-circle');
      return;
    }
    if (!user || !authToken) {
      navigate('/login?next=/payment');
      return;
    }
    if (!addr) {
      toast('Add a delivery address first', 'map-pin');
      navigate('/address');
      return;
    }

    /* An address row with no pin cannot be routed to. The backend would still
       accept the order and quote a delivery charge against (0,0) — a fee for a
       destination in the Atlantic. */
    if (
      !Number.isFinite(addr.latitude) ||
      !Number.isFinite(addr.longitude) ||
      (addr.latitude === 0 && addr.longitude === 0)
    ) {
      toast('This address is missing its location pin — please re-confirm it', 'alert-circle');
      navigate('/address');
      return;
    }

    if (!store?.restaurantId) {
      toast('The kitchen is unavailable right now', 'alert-circle');
      return;
    }

    /* Serviceability is checked HERE, at checkout — not on a gate at app open.
       The customer can browse from anywhere; we only block the actual order when
       the delivery address falls outside the kitchen's radius. */
    if (store.deliveryRadius > 0) {
      const dist = distanceKm(addr.latitude, addr.longitude, store.latitude, store.longitude);
      if (dist > store.deliveryRadius) {
        toast(
          `This address is ${dist.toFixed(1)} km away — outside our ${store.deliveryRadius} km delivery area`,
          'alert-circle'
        );
        return;
      }
    }

    if (!isStoreOpenNow(store)) {
      setStoreClosed(true);
      return;
    }

    if (totals.belowMin) {
      toast(`Minimum order is ${money(totals.minOrder)}`, 'alert-circle');
      return;
    }

    const ban = await checkBan();
    if (ban.banned) {
      toast(ban.message ?? 'This account cannot place orders', 'alert-circle');
      return;
    }

    /* The backend recomputes the delivery charge from `dis`. Guessing it here
       (a haversine line, say) would quote the customer one fee and charge them
       another, so a missing distance blocks rather than guesses. */
    if (totals.distanceKm == null) {
      toast('Still calculating the delivery fee — try again in a moment', 'alert-circle');
      return;
    }

    setPhase('processing');

    try {
      /* An online gateway (PhonePe/PayU) collects payment AFTER the order is
         placed, so the order must be created "awaiting payment" (status 8), not
         settled as paid. COD and a wallet-covered order settle immediately. */
      const isOnlineGateway =
        !walletCoversAll && !isCodGateway(effectiveMethod) && effectiveMethod !== 'WALLET';

      const body = buildPlaceOrderBody({
        lines,
        restaurantId: store.restaurantId,
        user,
        authToken,
        address: addr,
        method: effectiveMethod,
        deliveryType: 1,
        useWallet,
        walletCoversAll,
        walletBalance,
        distanceKm: totals.distanceKm,
        pendingPayment: isOnlineGateway,
      });

      const result = await placeOrder.mutateAsync(body);
      if (!alive.current) return;

      /* The order exists now. From here every path clears the cart and leaves
         this page, so latch the "empty cart" guard shut before that happens. */
      handingOff.current = true;

      const snapshot: Order = {
        id: result.uniqueOrderId || String(result.id),
        orderId: result.id,
        items: lines.map((l) => ({
          id: l.productId,
          name: l.name,
          price: l.unitPrice,
          qty: l.qty,
          image: l.image,
          customizations: l.customizations,
        })),
        subtotal: totals.subtotal,
        deliveryCharge: totals.deliveryFee,
        tax: totals.tax,
        total,
        paymentMethod: result.paymentMode || effectiveMethod,
        status: 'placed',
        statusId: 1,
        placedAt: new Date().toISOString(),
        etaMin: brand.eta,
        address: addr,
      };
      setLastOrder(snapshot);

      /* What the order actually settled as is the BACKEND's answer, not ours:
         the wallet balance can change between the tap and the response, and a
         wallet-paid order routed into the gateway would ask the customer to pay
         twice. */
      const paidByWallet =
        result.paymentMode.toUpperCase() === 'WALLET' || walletCoversAll || effectiveMethod === 'WALLET';

      if (paidByWallet || isCodGateway(effectiveMethod)) {
        clearCart();
        navigate(`/running-order/${snapshot.id}`, { replace: true });
        return;
      }

      if (result.paymentUrl) {
        clearCart();
        window.location.href = result.paymentUrl;
        return;
      }

      // an online gateway: hand off through the processing screen. Carry which
      // gateway was chosen so the handoff picks PhonePe vs PayU — the backend
      // settles as `method`, so that string is authoritative.
      sessionStorage.setItem('pending_order_id', String(result.id));
      sessionStorage.setItem('pending_unique_order_id', snapshot.id);
      sessionStorage.setItem('pending_payment_method', result.paymentMode || effectiveMethod);
      clearCart();
      navigate('/payment-processing', { replace: true });
    } catch (err) {
      if (!alive.current) return;
      setPhase('fail');
      const message = err instanceof Error ? err.message : 'The payment could not be started';
      toast(message, 'alert-circle');
    }
  };

  const payLabel = walletCoversAll
    ? `Pay ${money(total)} with wallet`
    : walletApplied > 0
      ? `Pay ${money(amountAfterWallet)} & use wallet`
      : `Pay ${money(total)} securely`;

  return (
    <div className="page-enter bg-[var(--cream)] text-[var(--ink)] pb-32 min-h-screen">
      <header className={stuck ? 'appbar is-stuck' : 'appbar'}>
        <div className="appbar-inner narrow flex items-center gap-3">
          <Link to="/address" className="ibtn ibtn-ghost shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="appbar-title">Payment</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6">
        <PaySummary total={total} />

        {addr ? (
          <div className="ui-card ui-card-pad mt-4 flex items-start gap-3 reveal">
            <div className="flex-1 min-w-0">
              <p className="eyebrow eyebrow-g mb-0.5">Delivering to {addr.label}</p>
              <p className="font-bold text-sm">{addr.receiverName || user?.name}</p>
              <p className="text-xs text-[var(--ink-2)] mt-0.5">
                {[addr.houseNo, addr.street, addr.city, addr.pincode].filter(Boolean).join(', ')}
              </p>
            </div>
            <Link to="/address" className="text-xs font-bold text-[var(--green)] press shrink-0">
              Change
            </Link>
          </div>
        ) : (
          <Link to="/address" className="ui-card ui-card-pad mt-4 block text-sm font-bold text-[var(--brand)]">
            + Add a delivery address
          </Link>
        )}

        <div className="lg-2col mt-8">
          <PayMethods
            gateways={gateways}
            selected={selected}
            onSelect={setSelected}
            walletBalance={walletBalance}
            useWallet={useWallet}
            onToggleWallet={setUseWallet}
            walletCoversAll={walletCoversAll}
            isLoading={gatewaysLoading}
          />
          <TrustBand />
        </div>
      </main>

      <div className="fixed bottom-0 inset-x-0 z-30 glass border-t border-[var(--line)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onPay}
          disabled={placeOrder.isPending || (!effectiveMethod && !walletCoversAll)}
          className="max-w-6xl mx-auto w-full cta-lux-accent shine ripple font-bold py-4 rounded-2xl press flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Lock className="w-4 h-4" /> {placeOrder.isPending ? 'Placing your order…' : payLabel}
        </button>
      </div>

      <GatewayModal
        phase={placeOrder.isPending ? 'processing' : phase === 'fail' ? 'fail' : 'closed'}
        method={effectiveMethod || 'your payment method'}
        onRetry={() => {
          setPhase('closed');
          void onPay();
        }}
        onChangeMethod={() => setPhase('closed')}
      />

      <ClosedStoreModal
        open={storeClosed}
        onBackHome={() => navigate('/home')}
        onDismiss={() => setStoreClosed(false)}
      />
    </div>
  );
}
