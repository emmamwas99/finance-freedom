# Finfe (formerly Finance Freedom): Vite → Next.js migration plan

## 1. Audit summary (Vite app, Nov 2026)

**Product:** a budgeting SaaS for salaried Kenyans (amounts in KSh). Free + Pro plans, 14-day trial, Paystack (M-Pesa / card).

**Architecture facts that shape the rewrite**

| Area | Current implementation | Consequence for Next.js |
|---|---|---|
| Data privacy | All financial data is **end-to-end encrypted in the browser** (PBKDF2 600k → HKDF → AES-256-GCM data key, wrapped by password and recovery key). Supabase stores ciphertext only. | The server can never read finances, so the private dashboard **must** decrypt and render on the client. Server Components and Server Actions can't touch financial data. That's a deliberate security boundary, not a shortcut. |
| Sync | Optimistic versioned vault, three-way merge across devices, encrypted offline cache in `localStorage` | Kept unchanged (`src/lib/cloud/*`). |
| Auth | Supabase Auth with a *derived login secret* (the password never leaves the device); demo backend when env is missing | Kept. Env vars renamed `VITE_*` → `NEXT_PUBLIC_*`. Backend created lazily on the client. |
| Billing | Supabase Edge Functions (`billing-*`, `paystack-webhook`, `account-delete`), signature-verified webhooks, idempotent `apply_payment()` | Kept as-is. They're already server-side, tested and deployed separately. Moving them into Route Handlers would only add risk. |
| Routing | Hand-rolled `history.pushState` router; everything client-rendered from one `index.html` | Replaced by App Router file routes. Public pages become static Server Components. |
| SEO | One `index.html` with static meta tags; every route served the same HTML; no sitemap, robots, canonical, schema or content | Full rebuild (below). |
| PWA | `vite-plugin-pwa` (Workbox), installable, offline | `app/manifest.ts` + a small versioned service worker served from a Route Handler (no new dependency). |
| Tests | Vitest: crypto keys, merge, Paystack signatures, plans, DB/RLS (PGlite) | Kept, plus new tests (below). |

**Features to preserve (all of them):** Overview (income / payments / spent / remaining, warnings, 6-month chart, debt, limits, "on track" teaser) · Monthly plan (payments ticked as paid, overrides, skips, one-off vs repeating, limits, 6-month outlook) · Transactions (search / filter / edit / duplicate / delete + undo) · Debts & goals (debt-free date, avalanche "pay extra" simulator, goals) · Reports (monthly report card + print, yearly) · Am I on track? (10 checks) · Settings (income schedule, categories, backups, CSV export, password change, recovery key, legacy import, delete account) · Billing (checkout, verify on return, history, manage card) · Auth (sign up, confirm email, log in, unlock, auto-lock, forgot / reset with recovery key or fresh start) · keyboard shortcuts N / I · demo mode · offline.

**SEO gaps:** client-only rendering, no per-page metadata, no canonical, no sitemap or robots, no structured data, no content beyond one landing page, private routes not marked noindex.

## 2. Target architecture

```
src/
  app/
    layout.tsx               root <html>, next/font, global metadata, Organization + WebSite JSON-LD
    manifest.ts robots.ts sitemap.ts not-found.tsx error.tsx global-error.tsx
    sw.js/route.ts           versioned service worker (offline app)
    llms.txt/route.ts        machine-readable site summary for AI answer engines
    og/[...slug]/route.tsx   statically generated Open Graph images
    (marketing)/             PUBLIC: static Server Components, indexable
      page.tsx pricing/ about/ contact/ privacy/ terms/
      personal-finance/ budgeting/ expense-tracker/ saving-money/ financial-freedom/ financial-health/ glossary/
      calculators/[slug]  guides/[slug]  blog/[slug]
    (account)/               PRIVATE: noindex, client-only data, one DataProvider for the whole group
      login/ signup/ forgot/ reset/ demo-checkout/
      app/                   dashboard routes: / plan transactions debts reports on-track settings billing
  components/ui              shadcn primitives
  components/marketing       header, footer, article layout, breadcrumbs, FAQ, CTA…
  components/seo             JSON-LD renderer
  features/                  private app modules (auth, shell, transactions, plan, debts, reports, insights, settings, billing)
  lib/                       business logic (calc, insights, format, crypto, cloud), calculators/, seo/
  config/site.ts             brand, site URL (from env), navigation
  content/                   guides, blog posts, glossary (typed TSX modules, no MDX dependency)
  store/                     DataProvider (encrypted vault + sync) and UI state
```

**Server/client boundary.** Public pages are Server Components, statically generated. Interactive islands (calculators, pricing toggle, mobile menu) are small Client Components that render their default result on the server, so the HTML is meaningful without JS. The `(account)` group is client-rendered by design: its server HTML is an empty shell with `noindex`, and private data never reaches the server.

**Route protection.** Private routes are gated on the client by auth and vault status (as before). The real protection is cryptographic: the data is unreadable without the password, and Supabase Row-Level Security limits each user to their own ciphertext. On top of that, the server sends `X-Robots-Tag: noindex`, `Cache-Control: no-store` and strict security headers for every private route, and robots.txt keeps crawlers out of `/app`.

## 3. URL map

| Old | New | Notes |
|---|---|---|
| `/` | `/` | Server-rendered landing |
| `/login` `/signup` `/forgot` `/reset` `/demo-checkout` | same | noindex |
| `/app`, `/app/plan`, `/app/transactions`, `/app/debts`, `/app/reports`, `/app/on-track`, `/app/settings`, `/app/billing` | same | Paystack return URL unchanged |
| `/terms` `/privacy` | same | |
| *(suggested)* `/budget-calculator` `/financial-freedom-calculator` | `/calculators/budget`, `/calculators/financial-freedom` | 301, one canonical URL per calculator |
| *(suggested)* `/expense-tracking` | `/expense-tracker` | 301, avoids two pages competing for one intent |

## 4. Phases

1. Audit ✔ · 2. Plan ✔ · 3. Next.js 16 scaffold (App Router, TS strict, Tailwind v4, shadcn) · 4. Port business logic and private app to file routes · 5. SEO infrastructure: metadata builder, schema generators, sitemap, robots, OG images, redirects, headers, llms.txt · 6. Content: pillar pages, calculators, guides, blog, glossary · 7. Performance, security headers, accessibility, PWA, tests (unit, integration, e2e, SEO audit) · 8. Production build and verification.
