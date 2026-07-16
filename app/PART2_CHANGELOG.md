# Part 2 — static React → live Dittomart/Foodomaa backend

`src/api/_seed.ts` is deleted. Nothing in the app invents a price, an ETA, a
delivery radius, a store address or a customer review any more: every one of
those is read off the backend, and where the backend has nothing, the UI shows
nothing rather than a plausible-looking stand-in.

`npx tsc --noEmit` and `npm run build` are clean. Driven end-to-end in a real
browser against `dev.dittomart.in` (see **Verified** below).

---

## Configuration

`.env` (see `.env.example`):

| var | meaning |
|---|---|
| `VITE_API_BASE_URL` | API root **including** the `/api` (or `/public/api`) suffix |
| `VITE_BRAND_DOMAIN` | the BARE domain — must equal `brands.domain` in the DB |
| `VITE_PAYU_FORM_URL` | PayU checkout endpoint (only used if a PayU gateway is on) |

`ASSET_HOST` is derived by trimming `/public/api` or `/api` off the base, and
every image path from the API goes through `assetUrl()`.

**The app resolves its storefront by domain.** `/brands?domain=<VITE_BRAND_DOMAIN>`
must return a brand, and that brand must have an approved store, or boot stops
with an explanatory screen instead of a blank page. There is no VRF brand row on
`dev.dittomart.in` yet — create it in the admin panel and the catalog, hours,
radius, fees and gateways all appear with no code change.

---

## Endpoints wired

| Endpoint | Used by |
|---|---|
| `GET /brands?domain=` | boot (AppInit) |
| `POST /brand-locations/{brand}` | boot — store, radius, hours, fees, tax |
| `POST /get-meats-categories` | category chips, home grid |
| `POST /get-restaurant-items/{slug}` | the whole menu (home, category, PDP, wishlist, reorder) |
| `POST /get-single-item` | PDP on a cold deep link |
| `GET /restaurant-sliders/{slug}` | home hero (hides itself when empty) |
| `POST /generate-otp-for-login` · `POST /login-with-otp` | login |
| `POST /get-addresses` · `/save-address` · `/delete-address` | address book |
| `POST /coordinate-to-address` | reverse-geocode the GPS pin |
| `POST /get-deliverable-amount` | delivery fee + distance (the pricing oracle) |
| `POST /get-payment-gateways` | the payment method list |
| `POST /check-ban` · `POST /place-order` | checkout |
| `POST /payment/payu/create-order` | PayU handoff |
| `POST /brand/{brand}/get-orders` | order history, reorder, confirmation, tracking |
| `POST /update-user-info` | live order tracking (the fork's tracker, misleading name and all) |
| `POST /get-wallet-transactions` | wallet balance |

---

## The things that would have silently shipped wrong

**Variant-priced dishes.** This backend stores `price: "0.00"` on an item and puts
the real money on a SINGLE addon group — Sakisa's "Fish Curry" is ₹0 + a "1 Bowl"
addon at ₹90. Rendering `item.price` would have shown **₹0** on every card, and
ordering one would have sent ₹0 to `/place-order`. `getDisplayPrice()` resolves the
cheapest reachable combination; `computeUnitPrice()` folds the chosen options; and
`/place-order` gets the RAW item price plus `selectedaddons`, because the backend
re-adds the addons itself.

**The cart had no room for choices.** It was a `{ productId: qty }` map, which
cannot express "1 Bowl" vs "2 Bowls". It is now `CartLine[]` (persist v3) keyed by
product + choices, so two portions of one dish are two rows at two prices.

**Delivery fee.** `/get-deliverable-amount` sits behind `jwt.auth`, so a guest can
never be quoted one. Showing the ₹0 fallback would have read as **FREE delivery**
on a store that charges ₹42. The bill now says "at checkout" until it knows, and
the free-delivery line only appears when the store actually has a threshold
configured — the same condition the backend applies when it prices the order.

**`dis` is DISTANCE, not discount.** It goes to `/place-order` verbatim from
`/get-deliverable-amount`, because the backend recomputes the delivery charge from
it. If the distance has not arrived, checkout blocks with a toast rather than
guessing a haversine value that would charge the customer a different fee than the
one they were shown.

**401 on a guest.** The response interceptor logged out and cleared the location
store on any 401 — including the ones a guest gets simply for touching an authed
endpoint, which would have thrown a browsing customer back to the location screen
mid-cart. It now only fires when there actually was a token.

**The "0" cart badge.** `.ibtn-badge { display: flex }` beats Tailwind's `.hidden`
at the same specificity, so an empty cart painted a literal **0** over the bag icon
on every appbar. The badge is now unmounted, not hidden.

**Item descriptions are HTML.** `desc` comes out of a rich-text editor, so cards
were rendering `<p><br></p>` as visible text. Flattened to plain text at the data
boundary.

**Reorder.** Resolves each item against the live menu, so a repriced dish reorders
at today's price and a delisted dish is skipped with a count ("Added 2 of 3 — the
rest are off the menu") rather than poisoning the cart with a line `/place-order`
would reject.

---

## Invented content that was removed

The prototype shipped marketing copy that reads as fact. On a real storefront it
would be a lie the customer can act on, and there is no endpoint behind any of it:

- **Testimonials** — three invented customers with invented quotes. Section deleted.
- **"4.8 ★ · 12k ratings"** — no ratings feed. Tile replaced with the store's real
  minimum order.
- **"Ordered 214×"** counters — not a field the API returns. Gone; the bestseller
  ribbon (a flag the admin does set) stays.
- **"Notify me when you deliver here"** on `/not-serviceable` — collected phone
  numbers into the void. Replaced with the real distance and a WhatsApp link.
- **The demo OTP (`123456`)** and the auto-advancing tracking timeline (which told
  the customer their food was on the way whether or not it was).

---

## Routing

`/running-order/:uniqueOrderId` and `/my-orders` are **hardcoded on the backend** as
PayU's success and failure URLs (`PayuController`), so both now exist. Neither sits
behind the location gate: iOS Safari can drop the session across the gateway bounce,
and bouncing a customer who just paid would read as a lost order.

`/payment-processing` handles the PayU handoff (legacy Android bridge → RN WebView →
browser form POST, in that order — the Android shell also exposes a WebView bridge,
so checking for it first would hijack the native SDK).

---

## Verified in a browser

Against `dev.dittomart.in` with a real brand (Sakisa, brand 17), viewport 420×1000,
GPS mocked at the store's own pin:

- boot → `/location` → GPS → "we deliver here, 0.0 km away" → `/home`
- home renders the real brand, the real 20 km radius, the real 60-min ETA, real
  categories (Curry, Crab & Masala) and real dishes
- Fish Curry PDP shows **₹90** (not ₹0), the "Bowl" portion picker is the store's
  own addon group
- add → cart shows "Fish Curry / 1 Bowl / ₹90 each"
- `/payment` hard-redirects a guest to `/login?next=/payment`
- store-hours modal reads the real schedule ("this kitchen opens and closes by
  hand" — that store has `is_schedulable: 0`)
- zero console errors across the funnel

**Not verified:** everything behind a completed login (address save, gateway list,
`/place-order`, PayU, tracking) — the OTP is a real SMS and I can't read it on the
dev host. That leg is exercisable against your local backend, where the code sits in
`sms_otps`.

**Images 404 on `dev.dittomart.in`** — the uploads aren't on that host. `assetUrl()`
builds the same URL the working Sakisa storefront uses; images will resolve wherever
the uploads actually live.
