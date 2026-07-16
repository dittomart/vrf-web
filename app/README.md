# VRF Kitchen — web storefront

React 18 + TypeScript + Vite + React Router 6 + TanStack Query 5 + Zustand 5 +
Tailwind. Talks to the Dittomart / Foodomaa-fork Laravel backend (`d:/vrf/backend`).

```bash
npm install
cp .env.example .env     # then edit it — see below
npm run dev              # http://localhost:5173
npm run build
```

## .env — the two lines that matter

```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_BRAND_DOMAIN=localhost
```

**`VITE_API_BASE_URL`** must include the API prefix.
- `php artisan serve` → `http://localhost:8000/api`
- Apache/XAMPP with the docroot at the Laravel root → `http://<host>/public/api`
- the shared dev box → `https://dev.dittomart.in/public/api`

The asset host (product photos, logos) is derived from it by trimming `/public/api`
or `/api`, so it does not need its own variable.

**`VITE_BRAND_DOMAIN`** is a BARE domain — no `https://`, no trailing slash — and it
must match the `domain` column of a row in the backend's `brands` table. The app
resolves its entire storefront from it:

```
GET  /brands?domain=<VITE_BRAND_DOMAIN>      → the brand
POST /brand-locations/<brand.unique_id>      → the store: menu slug, delivery
                                               radius, hours, fees, tax, phone
```

If no brand matches, boot stops on a screen that says so — it does not fall back to
sample data. So: **create the brand row (with its `domain`) and one approved store
in the admin panel, and the whole app fills in.** Nothing else needs a code change.

## What comes from where

| On screen | Source |
|---|---|
| menu, prices, portions, bestseller ribbons | `/get-restaurant-items/{slug}` |
| categories | `/get-meats-categories` |
| home hero slides | `/restaurant-sliders/{slug}` (hidden when the store has none) |
| delivery radius, ETA, min order, free-delivery threshold, tax %, open/closed | the store row |
| delivery fee + distance | `/get-deliverable-amount` (needs a login) |
| payment methods | `/get-payment-gateways` (whatever the store switched on) |
| orders, tracking, wallet | `/brand/{brand}/get-orders`, `/update-user-info`, `/get-wallet-transactions` |

There is no seed data and no fallback layer. An empty menu means the store has no
items; a missing photo means nothing was uploaded.

## Login

Real OTP over SMS (`/generate-otp-for-login` → `/login-with-otp`). A number the
backend has never seen is asked for a name and email first, because the backend will
not create an account without them. In local development the code lands in the
`sms_otps` table.

## Payment

The gateway list is the store's own. Wallet is an independent toggle, not a method:
it can cover the whole bill (the order settles as `WALLET`) or part of it (the
gateway takes the rest and `partial_wallet: true` goes with the order).

PayU returns the customer to `/running-order/{unique_order_id}` on success and
`/my-orders` on failure — **both paths are hardcoded in the backend's `PayuController`**,
so both routes exist here and neither is behind the location gate.

See `PART2_CHANGELOG.md` for the API contract's sharp edges (variant pricing, the
`dis` field, envelope variance).
