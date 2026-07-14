━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  DEMO MODE ACTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This website was built with sample data because no product
details were provided during intake (Categories & Bestsellers
were blank).

What's real : Brand name, tagline, logo colours, category type
              (Pure-Veg Restaurant / Cloud Kitchen), layout,
              location (Coimbatore), contact info.
What's demo : Categories, product names, prices — all TN-market
              sample data.

Replace demo data via the DittoMart SaaS dashboard once merchant
onboarding is complete.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# VRF Kitchen — Hyperlocal Prototype

Vijay Raghavan's **VRF Kitchen** — Pure Vegetarian Cloud Kitchen, Coimbatore.
_Taste · Time · Quality_

---

## 🎨 DESIGN DECISION FOR VRF Kitchen
| | |
|---|---|
| **Category** | Restaurant / Cloud Kitchen (Pure Vegetarian) |
| **Variant Picked** | R1 — "Appetite Orange" (logo-driven) |
| **Selection Reason** | Logo extract — burnt-orange field + forest-green pot/lid + cream-gold script are the real brand DNA, so the palette is derived from the uploaded logo (brand comes first) over the variant default. |
| **Layout Pattern** | Pattern C — Editorial Magazine (asymmetric, numbered section markers "01/02/03/04", oversized display type) |
| **Color Palette** | Burnt Orange `#E8590C` · Forest Green `#0F5132` · Cream/Gold `#F4D9A0` |
| **Unique Accent** | Saffron `#F4C430` |
| **Font Pairing** | Bricolage Grotesque (display) + Inter Tight (body) |
| **Hero Treatment** | Solid colour blocks per slide with oversized emoji float-off (appetite-driving) |
| **Section Order** | Hero → **Bestsellers** → Categories → Buy Again → Offer → Testimonials |

Category DNA respected: warm spice/saffron/appetite tones, NO cool
medical blues, NO pastels. A 5-year-old will not confuse this with a
pharmacy or a bakery.

---

## 📄 Pages (18 states, all built)
| File | Flow step |
|---|---|
| `index.html` | A — Splash + redirect logic |
| `location.html` | B — Location gate (GPS + search, lat/lng captured) |
| `not-serviceable.html` | C1 — Out-of-area |
| `home.html` | D — Home (hero carousel, buy-again, categories, bestsellers, testimonials, footer) |
| `category.html` | E/F — Product list (search + sort + filter) |
| `product.html` | G — Product detail (variants, qty, FBT, ordered-X-times) |
| `cart.html` | H/I/J — Cart + coupon + bill (delivery/tax) |
| `address.html` | K — Address with **mandatory lat/lng** capture |
| `login.html` | L/L1/L2 — OTP login/signup (`use 1234`) |
| `payment.html` | M/M1/M2 — UPI-first, gateway, fail→retry, closed-store error |
| `confirmation.html` | O — Order confirmed + confetti + save-order |
| `tracking.html` | P — Live timeline + rider card + 1-tap reorder |
| `orders.html` | Q — Past orders + Reorder |
| `profile.html` | R — Wallet, saved orders, addresses, logout |
| `wishlist.html` | S — Saved items |

---

## ✅ DittoMart rule compliance
- **No "DittoMart" branding** anywhere — only VRF Kitchen is visible.
- **Location gate**: every protected page runs `requireLocation()` at top of script; redirects to `location.html` if `dittomart_location` is missing/not serviceable. No skip / browse-without-location.
- **Lat/lng mandatory**: address `Save` button stays disabled until GPS or search geocoding captures coordinates. No "Pin on Map" option.
- **No subscription** — repeat-order UX only (Buy Again, Reorder, Saved Orders, 1-tap reorder from history/tracking).
- **No COD** — UPI (shown first) / Card / Wallet only.
- **No store open/closed logic in frontend** — static Store Hours modal (footer + profile) only; checkout shows a graceful closed-store error if backend rejects. No countdowns / pre-order.
- **Mobile-first** with mandatory bottom nav + WhatsApp FAB.

---

## 🔑 Demo tips
- Serviceable areas: **R.S. Puram, Gandhipuram, Peelamedu, Saibaba Colony, Ukkadam** (Coimbatore). Chennai / Mettupalayam show the not-serviceable screen.
- **OTP** is `1234`.
- Payment **fails once** on the first attempt to demonstrate the retry (M2) branch, then succeeds.
- State (cart, location, login, orders) persists in `localStorage`.

## 🗣️ Sales talking points
- "This is exactly how YOUR website will look."
- "Only the products are sample — your real menu replaces these in ~5 minutes via the dashboard."
- "Notice the design, colours, flow — that's all custom for YOUR brand."

## 🚀 To convert to production
Re-run with real Categories (Q16) + Products (Q17), same variant (R1)
+ layout (Pattern C), add `PRODUCTION_BUILD: true`. The DEMO badge,
footer disclaimer, and this warning are then removed.

## ▶️ Run
Open `index.html` in a browser (or serve the folder). All assets are
CDN-loaded (Tailwind, Lucide, Google Fonts) — needs internet.
