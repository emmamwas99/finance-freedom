# Launching Finfe as a paid SaaS

This guide covers the older Supabase encrypted-vault mode. For the Go API in the adjacent `finfe-backend` folder, follow its README and set `NEXT_PUBLIC_FINFE_API_URL`. Go mode also stores readable finance records for server reports.

This guide takes the app from **demo mode** (everything simulated in the browser) to a real product that people sign up for and pay for.

**Until you finish step 4, the app runs in demo mode.** Accounts, sync and payments are simulated in the browser, and a yellow "Demo mode" banner shows on every screen.

---

## How it fits together

```
Browser (Next.js PWA)                    Supabase                         Paystack
─────────────────────                    ────────                         ────────
password ─▶ keys (never sent)            Auth: email + derived secret
data ─▶ AES-256 encrypt ─────────────▶   vaults (ciphertext only)
                                         subscriptions / payments
"Pay with M-Pesa" ──▶ billing-checkout ─────────────────────────────────▶ hosted checkout
                      billing-verify   ◀── customer returns ◀───────────── (M-Pesa / card)
                      paystack-webhook ◀── signed events ◀──────────────── charge.success …
```

- **Your servers never see readable financial data.** Supabase only stores encrypted data in `vaults`.
- **Payments:** Paystack is the source of truth. The webhook and the "verify" call both record the payment, and a payment that arrives twice is only counted once.
- **M-Pesa can't auto-renew** (Paystack limitation), so it pays for a month or a year at a time. Cards can auto-renew once you add Paystack plan codes (step 3).

---

## 1. Accounts you need

| What | Where | Cost |
|---|---|---|
| Supabase project | supabase.com | Free tier to start; about $25/month (Pro) when you grow |
| Paystack Kenya business account | dashboard.paystack.com | No monthly fee. About 1.5% per M-Pesa payment, about 2.9% per local card ([pricing](https://paystack.com/ke/pricing)) |
| Hosting for the website | Netlify or Vercel | Free tier is enough |
| A domain | e.g. a `.co.ke` registrar | About KSh 1,000–2,500 a year |
| Email sending (recommended) | Resend, Brevo, Postmark… | Free tiers available |

## 2. Supabase

1. Create a project. Pick the region closest to your users.
2. Create the database tables. Either:
   - paste `supabase/migrations/20261111000000_init.sql` into **SQL Editor → Run**, or
   - use the CLI:
     ```bash
     npx supabase login
     npx supabase link --project-ref YOUR_REF
     npx supabase db push
     ```
3. Under **Authentication → URL Configuration**:
   - Site URL: `https://yourdomain.co.ke`
   - Redirect URLs: `https://yourdomain.co.ke/**` and `http://localhost:3000/**`
4. Under **Authentication → Providers → Email**:
   - Keep **Confirm email** ON.
   - Set **minimum password length** to 8.
5. Under **Authentication → Emails → SMTP Settings**, add your own email sender. Supabase's built-in sender is limited to a few emails an hour.
   - Edit the "Confirm signup" and "Reset password" templates so they mention Finfe.
6. Copy the **Project URL** and **anon public key** from **Project Settings → API**.

## 3. Paystack

1. Sign up and complete KYC for your business. Start in **Test mode**.
2. Under **Settings → API Keys & Webhooks**:
   - Copy the **Secret key** (`sk_test_…`).
   - Set the **Webhook URL** to `https://YOUR_REF.supabase.co/functions/v1/paystack-webhook`.
   - Copy the **Webhook signing secret** (`whsec_…`).
3. **(Optional) Card auto-renew.** Under **Products → Plans**, create:
   - *Pro Monthly*: KES 299, interval Monthly
   - *Pro Yearly*: KES 2,999, interval Annually

   Copy the plan codes (`PLN_…`). Without them, card payments work like M-Pesa: one period at a time.
   > Paystack's subscription docs list card subscriptions. Run one test-mode card subscription in KES to confirm it works for your account before relying on it.

## 4. Connect everything

Set the server secrets. `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided automatically.

```bash
npx supabase secrets set \
  PAYSTACK_SECRET_KEY=sk_test_xxx \
  PAYSTACK_WEBHOOK_SECRET=whsec_xxx \
  APP_URL=https://yourdomain.co.ke \
  PAYSTACK_PLAN_MONTHLY=PLN_xxx \
  PAYSTACK_PLAN_YEARLY=PLN_xxx
```

Deploy the server functions:

```bash
npx supabase functions deploy billing-checkout billing-verify billing-manage paystack-webhook account-delete
```

`paystack-webhook` is deployed without Supabase login checks (set in `supabase/config.toml`). Instead it checks Paystack's signature on every request.

Then tell the website where Supabase is, and what its public address is. Copy `.env.example` to `.env.local`, or set these in your host's environment settings:

```
NEXT_PUBLIC_SITE_URL=https://yourdomain.co.ke
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SUPPORT_EMAIL=support@yourdomain.co.ke
```

`NEXT_PUBLIC_*` values are built into the site, so **rebuild after changing them**. `NEXT_PUBLIC_SITE_URL` sets canonical URLs, the sitemap, Open Graph images and structured data. Set it to the exact production address (with `https://`, no trailing slash).

The site's Content-Security-Policy only allows connections to the Supabase project in `NEXT_PUBLIC_SUPABASE_URL`, so that variable must be set at build time.

## 5. Deploy the website

It's a standard Next.js 16 app: build command `npm run build`, start command `npm start` (Node.js 20.9 or newer).

- **Vercel:** import the repository; the framework is detected as Next.js. Set the environment variables above for **Production**. Preview deployments are automatically blocked from search engines (robots.txt disallows everything outside production).
- **Netlify / other hosts:** use their Next.js runtime, or any Node host running `npm start`.

Add your domain and make sure it uses **https** (encryption only works over https). Then submit `https://yourdomain.co.ke/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

## 6. Test everything (Paystack test mode)

- [ ] Sign up → confirmation email arrives → log in → recovery key screen
- [ ] Add data on the laptop, then open the site on your phone: same data appears
- [ ] Edit on both at the same time: both edits survive
- [ ] Billing → M-Pesa → pay with Paystack's test number → back in the app with "Payment received"
- [ ] Paystack dashboard → Webhooks: the event shows **200**
- [ ] Card (if plans set): subscribe → "Manage card subscription" → cancel → Pro stays until period end
- [ ] Forgot password → email link → recovery key → new password → data intact
- [ ] Settings → Delete account → can no longer log in

## 7. Go live

1. Switch Paystack to **Live**: new secret key, live webhook URL and signing secret, live plan codes.
2. `npx supabase secrets set ...` with the live values, then redeploy the functions.
3. Do one real KSh 299 M-Pesa payment yourself.

---

## Business & legal checklist (Kenya)

- [ ] Register the business (eCitizen / Business Registration Service) and get a KRA PIN. Paystack needs these.
- [ ] **Register with the ODPC** (Office of the Data Protection Commissioner) as a data controller, under the Data Protection Act 2019 and its 2021 registration regulations.
- [ ] Fill the placeholders in `src/config/site.ts` (company name, support email, social profiles) and in the Terms and Privacy pages (`src/app/(marketing)/terms/page.tsx`, `src/app/(marketing)/privacy/page.tsx`). Have a lawyer review them, then remove the yellow "Template" notice in `src/components/marketing/legal-layout.tsx`.
- [ ] Decide your refund policy and put it in the Terms.
- [ ] VAT: register once taxable turnover passes the KRA threshold (currently KSh 5M a year). Prices then need to include VAT.
- [ ] Set up a support email and respond to "forgot password / lost recovery key" requests kindly. You can't recover their data, but you can explain.

## Changing prices or plans

Edit `supabase/functions/_shared/plans.ts` (prices, trial days, feature lists). The website and the server functions both read it. Then:

1. Redeploy the functions.
2. Rebuild the website.
3. Update the Paystack plans: plan amounts can't be edited, so create new plans and update the `PAYSTACK_PLAN_*` secrets.

## Known limits (by design)

- **Lost password AND lost recovery key = data lost.** That's the cost of "even we can't read it". Users can start fresh on the same account.
- **Email address can't be changed.** It is part of the key derivation. To change it, a user would create a new account and import a backup file.
- **Pro features are checked in the browser.** That's fine here because the data is encrypted on the user's device anyway. Payments themselves can only be recorded by the server (database rules block users from changing their own plan).

## Costs at a glance

At 200 paying users on the yearly plan:

- **Revenue:** about KSh 600,000 a year.
- **Paystack fees:** about KSh 9,000 (1.5% on M-Pesa).
- **Supabase Pro:** about KSh 40,000 a year (≈$25/month).
- **Hosting:** free tier.
