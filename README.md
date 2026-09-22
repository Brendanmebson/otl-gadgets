# OTL Gadgets

A premium, production-structured e-commerce storefront for a Nigerian gadget
retailer — React + TypeScript + Vite + Material UI, backed by Supabase
(Postgres, Storage, Edge Functions) with Paystack payments.

**This build runs out of the box with realistic mock data** (no Supabase
project required) so you can `npm install && npm run dev` immediately.
Connecting Supabase is a config change, not a rewrite — every data hook
automatically switches from mock data to live queries once your `.env` is
filled in.

## Quick start

```bash
npm install
cp .env.example .env      # fill in Supabase + Paystack keys when ready
npm run dev
```

Visit `http://localhost:5173` for the storefront and
`http://localhost:5173/admin` for the admin dashboard.

## What's real vs. what's scaffolded

| Area | Status |
|---|---|
| Storefront UI (home, shop, product, cart, checkout) | Fully built, responsive, functional |
| Product data, categories, brands | Live Supabase queries **or** mock data fallback — same hook, both paths |
| Cart | Working in-memory cart (React state) via `CartContext` |
| Checkout form | React Hook Form + Zod validation, fully functional |
| Paystack payment | Real client-side Popup integration (needs your public key) |
| Payment verification & stock decrement | Real Edge Function (`verify-payment`) — deploy it to go live |
| Admin dashboard/products/orders/inventory | Fully built UI wired to local mock state; swap in Supabase calls (shapes already match the schema) to make it live |
| Auth (customer accounts, admin login) | Not implemented — `profiles.is_admin` and RLS policies are ready in the schema for when you add Supabase Auth |
| Reviews submission | UI structured for it; wire to the `reviews` table once auth is in |

## Architecture

```
src/
  components/
    layout/      Header, Footer, StorefrontLayout (sticky nav, mobile drawer)
    home/        Hero, TrustFeatures, FeaturedCategories, ProductRowSection,
                 PromoBanner, CountdownDeals, Testimonials
    product/     ProductCard, ProductCardSkeleton
    common/      Breadcrumbs, EmptyState
  pages/         Home, Shop, ProductDetails, Cart, Checkout, NotFound
  pages/admin/   AdminLayout, AdminDashboard, AdminProducts, AdminOrders, AdminInventory
  hooks/         useProducts (+ featured/new/deals/categories/brands), useOrders, usePaystack
  context/       CartContext (reducer-based cart state)
  lib/           supabase.ts (client + isSupabaseConfigured flag), format.ts (Naira, slugify)
  data/          mockData.ts — the fallback catalog used until Supabase is connected
  theme/         theme.ts — MUI theme carrying the brand's black/white/grey/red system
supabase/
  schema.sql             Full Postgres schema: products, categories, brands,
                          orders, order_items, payments, cart_items,
                          wishlists, reviews, coupons, addresses, profiles + RLS
  seed.sql               Example seed data matching the mock catalog
  functions/
    create-payment/      Edge Function: server-side Paystack transaction init
    verify-payment/      Edge Function: server-side verification + safe stock decrement
```

## Connecting Supabase

1. Create a project at supabase.com.
2. Run `supabase/schema.sql` in the SQL editor, then `supabase/seed.sql` if
   you want the demo catalog live instead of local mock data.
3. Copy your project URL and anon key into `.env`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Restart `npm run dev` — `src/lib/supabase.ts` will detect the env vars and
   every hook in `src/hooks/` switches to live Supabase queries automatically.
5. Create a Storage bucket (e.g. `product-images`) for product photos and
   point `product_images.url` at the public URLs.

## Connecting Paystack

1. Get your test keys from the Paystack dashboard.
2. Add the public key to `.env`:
   ```
   VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxx
   ```
3. Deploy the two Edge Functions (this is what keeps your **secret** key off
   the frontend):
   ```bash
   supabase functions deploy create-payment
   supabase functions deploy verify-payment
   supabase secrets set PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxx
   ```
4. In `src/pages/Checkout.tsx`, the `onSuccess` callback from
   `usePaystack` currently marks the UI as paid directly for demo purposes.
   In production, call `verify-payment` with the returned reference (or set
   up a Paystack webhook pointed at it) and only show the success screen
   after that function confirms `status: "paid"`. This is what makes stock
   decrements and payment status safe against a closed browser tab or a
   tampered client-side response.

## Extending the admin dashboard

`AdminProducts`, `AdminOrders`, and `AdminInventory` currently read/write
local React state seeded from `mockData.ts` so the UI is fully clickable
without a backend. Every field already matches the Supabase schema, so
wiring them up means replacing the `useState` calls with:

- `supabase.from('products').select(...)` / `.insert(...)` / `.update(...)` / `.delete(...)`
- Image uploads via `supabase.storage.from('product-images').upload(...)`

and adding Supabase Auth so `/admin` can check `profiles.is_admin` before
rendering (the RLS policies for this are already in `schema.sql`).

## Design system

- **Colors**: near-black `#080808`, white, light-grey background `#F5F7F9`,
  red accent `#E31C25` used only for CTAs, prices, badges and active states.
- **Typography**: Inter, bold/heavy headings, tight tracking on large sizes.
- **Spacing**: MUI's 8px grid throughout; consistent card radius (10–12px).
- Full guidance lives in the original product brief — see the uploaded
  reference brief for section-by-section detail if you extend the design.

## Known limitations of this build

- No authentication yet (customer accounts, admin login, order history per user).
- Search is a simple `ilike`/substring match — swap in Postgres full-text
  search (`idx_products_search` is already created) or a dedicated search
  service for large catalogs.
- Images use placeholder URLs (`placehold.co`) — replace with real product
  photography uploaded to Supabase Storage.
- No automated tests included.
