# Finfe API setup

The Next.js app uses the API in the sibling `finfe-backend` repository for accounts, vault sync, billing and server reports. The browser encrypts its vault backup, while the API stores a readable finance projection in MongoDB for reports.

## Local development

1. In `../finfe-backend/.env.local`, set a private `MONGODB_URI` and `MONGODB_DATABASE`. This file is ignored by Git. The backend's `scripts/dev.sh` loads the tracked development defaults from `.env`, then this override. A MongoDB Atlas replica set works without local MongoDB; Redis is optional in development.
2. In this repository, use `FINFE_API_URL=http://localhost:8080` in `.env.local`, install dependencies, then run `npm run dev`. It starts the sibling API when needed, waits for `/ready`, and starts Next.js. `npm run dev:web` starts only Next.js if the API is already managed elsewhere.
3. Sign up, confirm your email, then log in. The private backend override uses authenticated SMTP for confirmation and password reset messages, with `REQUIRE_EMAIL_VERIFICATION=true`. Existing accounts that were created before verification was enabled can request a new confirmation link from the login screen. Development billing uses the backend's simulated checkout.

The browser calls the same-origin `/api/v1` path. `src/proxy.ts` forwards it to `FINFE_API_URL`, including the HttpOnly access and refresh cookies. The backend must allow the exact frontend origin in `APP_URL` or `CORS_ORIGINS`. A page reload keeps the API session and, during the current browser tab session, restores the non-extractable vault key from IndexedDB. Explicit Lock and sign-out clear that saved key; the password is never stored. For a phone on your local network, keep the backend reachable from the Next.js server and allow the phone site's origin.

## Production

Set `FINFE_API_URL` to the backend origin reachable from the Next.js server and `NEXT_PUBLIC_SITE_URL` to the public HTTPS site origin before building. Configure the backend's `APP_URL`, `CORS_ORIGINS`, MongoDB replica set, JWT secret, secure cookies, SMTP and Paystack as described in [its README](../finfe-backend/README.md). The browser keeps its cookies on the site origin through the proxy. The production build fails when the API URL is missing. The older `NEXT_PUBLIC_FINFE_API_URL` remains a fallback during migration.

The API contract is [`../finfe-backend/api/openapi.yaml`](../finfe-backend/api/openapi.yaml). Run `npm run api:types` when it changes. Vault saves send ciphertext and a readable finance snapshot together; the backend updates the snapshot transactionally. The client uses version checks to merge changes from another device and keeps an encrypted offline cache.

For browser-only demos or E2E tests, set `NEXT_PUBLIC_FINFE_DEMO_MODE=true` before building. This opt-in bypasses the API and stores data in that browser only.
