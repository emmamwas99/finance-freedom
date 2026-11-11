# Finance Freedom 💸

A private, offline budget app (PWA) to track every shilling, plan ahead, and get out of loan debt.

- **No database or server.** Everything is saved as one encrypted file on your device (browser storage).
- **Password protected.** Data is encrypted with AES-256. The key comes from your password (PBKDF2, 310k rounds), so without the password nobody can read it.
- **Works offline** and installs on your phone like a normal app.

## What it does

Designed for desktop first (sidebar, wide tables), and still works on a phone. Amounts are in **KSh**.

| Page | What you get |
|---|---|
| **Overview** | Income, payments, spent and **remaining** for the month, warnings, a 6-month chart, this month's payments, debt and spending limits |
| **Monthly plan** | List what you must pay this month (e.g. 5 debts), tick each one when paid, and see **what's left after all payments** right away. Payments set to "Every month" repeat automatically, and "This month only" ones don't. You can change one month's amount on its own row, or skip a month. "Coming months" shows what will be left in each upcoming month |
| **Transactions** | Every expense and income in a searchable table. Click a row to edit it |
| **Debts & goals** | All loans, your debt-free date, a "what if I pay extra?" simulator, and goals such as *Grow the shop* |
| **Reports → Monthly** | A report card for any month: verdict and score, plan vs actual, comparison with last month, categories vs limits, biggest expenses, what went well and what to improve. Can be printed or saved as PDF |
| **Reports → Yearly** | Year chart (income vs spending), monthly table, where the money went |
| **Am I on track?** | 10 checks: living within income, borrowing, debt direction and burden, saving, limits, wants, the coming 6 months, debt-free date, and the habit of recording expenses. Each gives a good / watch / fix verdict, plus your top 3 next moves |

Keyboard shortcuts: **N** adds an expense and **I** adds income.

**Everything is editable.**
- **Income:** click *Income* to set a month's amount, either "only this month" (e.g. KSh 388,000 in November) or "this month and after" (e.g. KSh 264,000 from December). Every change is listed in Settings, where you can edit or delete it.
- **Spending:** click *Spent so far* to edit or delete that month's expenses, or to add a lump sum you didn't track.
- **Transactions:** each row has a ⋯ menu with Edit, Duplicate and Delete. Deletes can be undone.
- **Payments, loans, goals and categories:** each has Edit and Delete.

**How "left" is worked out:** income − payments listed = *left after payments*. Then − other spending = *remaining right now*.
A payment you've ticked counts what you actually paid; an unticked one counts the planned amount.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173 on this computer
npm run phone      # HTTPS on your Wi-Fi so you can try it on your phone
```

With `npm run phone`, open the **Network** address it prints (e.g. `https://192.168.0.107:4173`) on your phone. Accept the certificate warning (it's self-signed). Encryption needs HTTPS, which is why this script exists.

## Put it on your phone for good (free)

1. Run `npm run build`. This creates the `dist/` folder.
2. Upload `dist/` to any free static host, e.g. **Netlify** (drag the folder onto app.netlify.com/drop), **Vercel**, or **Cloudflare Pages**. You get an `https://` link.
3. Open the link on your phone:
   - **Android (Chrome):** menu ⋮ → *Install app* / *Add to Home screen*
   - **iPhone (Safari):** Share → *Add to Home Screen*

The site only contains the app code. Your financial data never goes to the host; it stays encrypted on your phone.

## Backups (important)

Your data lives on the device. If the phone is lost, or you clear the browser data, the data is gone.
Go to **Settings → Save encrypted backup file** about once a month and save it to Google Drive, email or WhatsApp.
To restore, use **Restore from backup** on a new device; you need the password the backup was made with.

> If you forget your password, the data **cannot** be recovered. That is the price of real security.

## Tech

React 19 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui · Recharts · vite-plugin-pwa · Web Crypto API

Colours: navy `#0A3C6E`, white `#FFFFFF`, blue `#1783C1`, charcoal `#333333` (tokens in `src/index.css`).

```
src/
  lib/crypto.ts     AES-GCM + PBKDF2 encryption
  lib/storage.ts    encrypted file in localStorage, lockout after failed tries, file export
  lib/calc.ts       monthPlan (what's left), budgets, loans, debt-free projection, forecasts
  store/data.tsx    unlock/lock, auto-lock, save on every change
  pages/            Home, Activity, Plan, Freedom, Stats, Settings
  components/       dialogs, charts, shared UI (shadcn in components/ui)
```
# finance-freedom
