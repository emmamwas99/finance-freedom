# Finfe 💸

*Finfe is short for **financial freedom**.*

A budgeting SaaS for salaried Kenyans: plan the month, clear your loans, stop borrowing to get by. Built with **Next.js 16 (App Router)**.

- **A public website built for search and answer engines:** static, server-rendered pages: a product site, free financial tools (6 calculators and a financial health check, no account needed), a financial education hub with 5 topic pages, 7 guides, a blog and a glossary, with full metadata, JSON-LD, a sitemap, robots.txt, Open Graph images and `llms.txt`.
- **A private app with an encrypted vault:** the browser encrypts its vault backup and a recovery key covers forgotten passwords. Go mode also sends readable finance rows for server reports.
- **Accounts and sync** through the adjacent Go backend, or the legacy Supabase backend. Phone and computer stay in step, and the app works offline (installable PWA).
- **Free + Pro plans,** with a 14-day Pro trial. Pay with **M-Pesa or card through Paystack**.

**Running without setup?** If neither `NEXT_PUBLIC_FINFE_API_URL` nor Supabase is set, the app runs in **demo mode**. For Go mode, start [the adjacent backend](../finfe-backend/README.md) and set `NEXT_PUBLIC_FINFE_API_URL=http://localhost:8080` in `.env.local`. The migration from the old Vite app is documented in [docs/MIGRATION-PLAN.md](docs/MIGRATION-PLAN.md).

## Run it

```bash
npm install
npm run dev          # http://localhost:3000 (demo unless .env.local configures Go or Supabase)
npm run phone        # HTTPS dev server on your Wi-Fi, so encryption works on your phone
npm run build && npm start   # production build
```

## Check it

```bash
npm run verify       # lint + typecheck + unit/integration tests + production build
npm test             # Vitest: money maths, debt engine, calculators, insights, crypto, sync, Paystack, DB rules, SEO
npm run test:e2e     # Playwright (desktop + mobile): sign-up → expense → lock/unlock, calculators, redirects, responsive layout
npm run seo:audit    # crawl a running build like a search engine (BASE_URL=http://localhost:3000)
```

The first time you run the E2E tests, install the browser with `npx playwright install chromium`. `npm run seo:audit` needs a running production server (`npm start`).

## What the app does

| Page | What you get |
|---|---|
| **Overview** `/app` | Income, payments, spent and **remaining** for the month, warnings, a 6-month chart, this month's payments, debt and spending limits |
| **Monthly plan** `/app/plan` | List what you must pay this month, tick each when paid, and see **what's left after all payments**. Repeating vs one-off payments, one-month overrides and skips, and a 6-month outlook |
| **Transactions** `/app/transactions` | Every expense and income in a searchable table, with edit, duplicate and delete (with undo) |
| **Debts & goals** `/app/debts` | All loans, your debt-free date, a "what if I pay extra?" simulator, and goals |
| **Reports** `/app/reports` (Pro) | Monthly report card (printable) and yearly report |
| **Am I on track?** `/app/on-track` (Pro) | 10 habit checks with good / watch / fix verdicts and your top 3 next moves |
| **Settings** / **Billing** | Income schedule, categories, encrypted backups, CSV export, password and recovery key, delete account · plans, M-Pesa/card checkout, history |

Keyboard shortcuts: **N** adds an expense and **I** adds income. **How "left" is worked out:** income − payments listed = *left after payments*; then − other spending = *remaining right now*. A ticked payment counts what you actually paid, an unticked one the planned amount.

## Architecture

```
src/
  app/
    layout.tsx                 <html>, self-hosted Geist (next/font), global metadata, Organization + WebSite JSON-LD
    (marketing)/               PUBLIC · static Server Components · indexable
      page.tsx pricing/ expense-tracker/ about/ contact/ privacy/ terms/
      learn/ personal-finance/ budgeting/ debt-management/ saving-money/ financial-freedom/   education hub + topic pages
      calculators/[slug]/ financial-health/   free tools (inputs remembered on the visitor's device)
      guides/[slug]/ blog/[slug]/ glossary/
    (account)/                 PRIVATE · noindex · vault decrypted in the browser
      layout.tsx               one DataProvider for login → app, so the unlocked vault survives navigation
      login/ signup/ forgot/ reset/ demo-checkout/
      app/                     dashboard routes (layout = sidebar/bottom nav + add-transaction dialog)
    sitemap.ts robots.ts manifest.ts not-found.tsx error.tsx global-error.tsx
    og/[...slug]/route.tsx     Open Graph images, one per public page, prerendered
    sw.js/route.ts             versioned offline service worker
    llms.txt/route.ts          site summary for AI answer engines
  components/ui                shadcn/ui primitives (Radix)
  components/marketing         header, footer, breadcrumbs, FAQ, article layout, prose blocks, pricing
  components/seo/json-ld.tsx   XSS-safe JSON-LD renderer
  features/                    private app modules: auth, shell, overview, plan, transactions, debts, reports, insights, settings, billing
                               + calculators/ (small client islands for the public calculators)
  lib/
    calc.ts insights.ts        business rules (monthPlan, budgets, loans, forecasts, 10 habit checks)
    calculators/               pure, tested maths: debt engine (shared with the app), budget, emergency fund, savings goal, financial freedom, health check
    crypto.ts cloud/           AES-GCM/PBKDF2, vault key hierarchy, three-way merge, Go + Supabase + demo backends
    api/                       central HTTP client, generated OpenAPI types and TanStack Query hooks
    seo/                       metadata builder, Schema.org generators, page registry, route registry
    plans.ts                   re-exports supabase/functions/_shared/plans.ts (prices shared with the server)
  config/site.ts               brand, site URL (from env), navigation, editorial author
  content/                     guides, blog, pillars, calculators copy, glossary (typed TSX, no MDX dependency)
  store/                       DataProvider (encrypted vault + sync + auto-lock) and UI state
supabase/                      migrations (RLS, trial trigger, apply_payment) and Edge Functions (billing, Paystack webhook, account delete)
tests/                         Vitest unit + integration tests     e2e/   Playwright tests     scripts/seo-audit.mjs
```

**Server/client boundary.** Public pages are Server Components, prerendered at build time. The private app keeps vault decryption and offline edits in the browser. In Go mode, saved transactions are also sent as readable rows for SQL reports. Private pages are noindexed.

## SEO, AEO and GEO

These are three different goals, kept separate on purpose. The full strategy, and how to measure each, is in [docs/SEO-AEO-GEO.md](docs/SEO-AEO-GEO.md).

- **SEO** (be found and ranked in search engines): static server-rendered pages built around **free tools** (`/calculators`) and an **education hub** (`/learn`), one canonical URL per intent with 301s for alternatives, `buildMetadata()` for every page, `sitemap.xml` and `robots.txt` from one registry, breadcrumbs, internal linking and fast pages. Guarded by `tests/seo.test.tsx` and `npm run seo:audit`.
- **AEO** (structure answers so answer engines can surface them): a "Quick answer" and key takeaways first, question-style headings with direct answers, steps, tables, formulas and definitions, plus JSON-LD that matches the visible content (Article, BreadcrumbList, FAQPage, WebApplication, DefinedTermSet, ItemList; no invented ratings).
- **GEO** (improve the *chances* of being referenced by generative AI): consistent entity information (Finfe, short for "financial freedom"), original calculations, cited primary sources, author and dates, no unsupported promises, AI crawlers allowed, and `/llms.txt`. **There is no guaranteed way to make an AI engine cite a website**, and nothing here claims otherwise.

## Security

The vault backup is encrypted in the browser (see `src/lib/cloud/keys.ts`). Go mode stores a readable finance projection for server reports; Supabase mode stores ciphertext only. The Go API uses owner-scoped PostgreSQL queries, rotating HttpOnly session cookies and rate limits. The site sends a Content-Security-Policy allowing the configured API origin, HSTS, `X-Frame-Options: DENY`, `nosniff`, a referrer policy and a permissions policy.

## Tech

Next.js 16 (Turbopack) · React 19 · TypeScript 5 (strict) · TanStack Query · Tailwind CSS v4 · shadcn/ui (Radix) · Lucide · Recharts · Web Crypto API · Go/Chi/PostgreSQL or Supabase · Paystack · Vitest · Playwright · oxlint

Logo: a lowercase “f” whose crossbar is a rising arrow (`public/logo.svg`, and `public/logo-inverse.svg` for navy backgrounds). All icons are generated by `node scripts/generate-icons.mjs`.

Colours: navy `#0A3C6E`, white `#FFFFFF`, blue `#1783C1` (brand) and `#1470A8` (text and buttons, for WCAG AA contrast), charcoal `#333333`. Tokens live in `src/app/globals.css`.

**Lint rules switched off on purpose** (`.oxlintrc.json`): `react/purity` (no React Compiler; "today"-based client views read the date during render), `jsx-a11y/prefer-tag-over-role` (deliberate, valid ARIA: progressbar, math, scroll regions, a row with its own menu), `jsx-a11y/no-noninteractive-tabindex` (scrollable tables must be keyboard-focusable) and `jsx-a11y/control-has-associated-label` (it misfires on empty table cells).
