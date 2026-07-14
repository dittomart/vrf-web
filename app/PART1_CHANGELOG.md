# VRF Kitchen — Part 1 (HTML → React) Changelog

React 18.3 + TypeScript 5.6 (strict) + Vite 5.4 + React Router 6 + TanStack Query 5 + Zustand 5 + Tailwind 3.4 + lucide-react.
`tsc -b` and `npm run build` pass clean. No HTTP calls except OpenStreetMap Nominatim reverse-geocoding, which the prototype itself made.

The React app lives in `app/`. The original HTML files stay at the repo root, untouched, as the reference.

## HTML inventory

| HTML file | React route | Layout | Page |
|---|---|---|---|
| `index.html` | `/` | Blank | `SplashPage` — a **splash page**, not the Vite shell |
| `location.html` | `/location` | Blank | `LocationPage` |
| `not-serviceable.html` | `/not-serviceable` | Blank | `NotServiceablePage` |
| `login.html` | `/login` | Blank | `LoginPage` |
| `home.html` | `/home` | Root | `HomePage` |
| `category.html` | `/category` (`?cat=`) | Root | `CategoryPage` |
| `orders.html` | `/orders` | Root | `OrdersPage` |
| `profile.html` | `/profile` | Root | `ProfilePage` |
| `wishlist.html` | `/wishlist` | Root | `WishlistPage` |
| `product.html` | `/product/:id` | Checkout | `ProductPage` |
| `cart.html` | `/cart` | Checkout | `CartPage` |
| `address.html` | `/address` | Checkout | `AddressPage` |
| `payment.html` | `/payment` | Checkout | `PaymentPage` |
| `confirmation.html` | `/confirmation` | Checkout | `ConfirmationPage` |
| `tracking.html` | `/tracking` | Checkout | `TrackingPage` |
| `assets/theme.css` | — | — | ported verbatim to `src/theme.css` |
| `assets/themes.js` | — | — | ported to `src/theme/themes.ts` (5 presets, light/dark/auto) |
| `assets/app.js` | — | — | split into `src/api/_seed.ts` + `src/utils/*` + `src/hooks/*` + `src/store/*` |
| `assets/theme-switcher.js` | — | — | **not loaded by any HTML page** — not ported |
| `*` | — | — | `Navigate replace /` |

## Layouts — derived from the HTML, not from a template

The prototype gives every page its **own** `<header class="appbar">` (home has search + location chip; the rest are back-button + title). So the layouts render **no** shared header — each page ports its own. The three layouts differ by chrome and gate:

- **RootLayout** — location gate + `BottomNav`. Exactly the pages that called `injectChrome()`: home, category, orders, profile, wishlist.
- **CheckoutLayout** — location gate, **no** nav dock: product, cart, address, payment, confirmation, tracking (their HTML deliberately omits `injectChrome()` so nothing competes with their fixed action bars).
- **BlankLayout** — no chrome, no gate: splash, location, login, not-serviceable.

`RequireLocation` is the React port of `requireLocation()`: no serviceable location with real coordinates → redirect to `/location`. There is deliberately no browse-without-location path.

## Design tokens

Colour is **not** hard-coded. `themes.js` writes CSS custom properties onto `:root` at runtime, so `tailwind.config.js` starts from an **empty** palette and maps every colour to a live variable (`primary: 'var(--primary)'`, …) plus the back-compat aliases the markup uses (`brand`, `green`, `ivory`, `cream`, `card`). Switching a preset or toggling dark mode still re-skins the whole app with zero CSS edits.

`src/index.css` (Tailwind layers) is imported **before** `src/theme.css` in `main.tsx` — the same order the HTML loaded the Tailwind CDN before `assets/theme.css`, so a branded class always wins a specificity tie against a utility.

## Animations ported

`theme.css` carries its own keyframes verbatim (`fadeUp fadeIn scaleIn sheetUp spin drift shimmer ringPulse barFill ticker steamRise rise authPan`). Page-level `<style>` blocks were ported to `src/styles/`:

- `splash.css` — `arcspin`, `markIn`, `rise`, `dotb` (from `index.html`)
- `location.css` — `.radar`, `.field` (from `location.html`)
- `confirmation.css` — `pop`, `fall`, `checkDraw`

`.page-enter` sits on every page's root element. `useReveal()` is the `initReveal()` port (IntersectionObserver + MutationObserver + scroll failsafe); `useRipple()` and `useStickyBar()` port the remaining delegated handlers from `app.js`.

## Naming collision resolved

`theme.css` already defines `.ticket` as the **coupon stub** (flex + a dashed `::before` perforation). `confirmation.html`'s receipt also called itself `.ticket`, which would have corrupted it — the receipt's rules are ported unchanged under `.conf-ticket`.

## Deviations from the HTML — read these

1. **`location.html` hardcoded `serviceable: true`** for every GPS or typed pick, so `/not-serviceable` was unreachable and the README's "Chennai shows the not-serviceable screen" promise never fired. Replaced with a real check: serviceable-area name match, or haversine distance from the kitchen.
2. **Service radius contradicts itself in the source**: `location.html` uses `SERVICE_RADIUS_KM = 8`, `app.js` declares `radius: 6`. The React app follows the page (8). **Pick one** and set it in `_seed.ts`.
3. **`payment.html` succeeds on the first attempt** (`setTimeout(success, 1600); // payment succeeds on the first attempt`) — the opposite of what the README claims. The HTML won: success-first is what ships. The fail/retry (M2) and closed-store branches are fully built but unreachable; flip one line in `showGateway` to demo them.
4. **`profile.html` has no delete-account flow**, so none was invented.
5. **Seeded demo state dropped.** The HTML seeded 3 fake orders and a 4-item wishlist on first visit, which made its own empty states unreachable. The React stores are the single source of truth, so those pages now start empty and show the HTML's own `.empty-wrap` copy.
6. **`address.html`'s `file://` GPS fallback** silently used a hardcoded coordinate. Dropped — coordinates only ever come from `navigator.geolocation`. Save stays disabled until real coords land, exactly as the HTML intends.
7. **`.shine`** is used in the markup but defined nowhere in the prototype's CSS. It was a no-op there and is preserved verbatim as a no-op here.
8. **Login OTP is `123456`** (6 boxes) per `login.html`; the README's "OTP is 1234" is stale.
9. **Category and wishlist cards** have visibly different markup from home's `prodCard()`, so each ports its own rather than sharing `ProductCard`.

## TODO[part-2]

Every stub consumer is marked `// TODO[part-2]` in `src/api/queries/catalog.ts`. `src/api/_seed.ts` is deleted once the real endpoints land — no fallback layer remains. `src/api/client.ts` is an axios placeholder that issues no requests. `src/utils/sanitizeHtml.ts` is ready for the CMS policy endpoints.

## Not verified

The app builds, typechecks and serves, but the pages have **not** been visually diffed against the HTML in a browser at 320 / 375 / 1280. That pass is still open.
