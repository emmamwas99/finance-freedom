# Finfe API setup

The Next.js app uses the API in the sibling `finfe-backend` repository for accounts, vault sync, billing and server reports. The browser encrypts its vault backup, while the API stores a readable finance projection in MongoDB for reports.

## Local development

1. From `../finfe-backend`, start MongoDB, Redis and the API with `docker compose up --build`. Check `http://localhost:8080/health` and `http://localhost:8080/ready`.
2. In this repository, copy `.env.example` to `.env.local` and use `NEXT_PUBLIC_FINFE_API_URL=http://localhost:8080`. Run `npm install` and `npm run dev`.
3. Sign up, follow the verification link printed in the API logs, then log in. Development billing uses the backend's simulated checkout.

The frontend calls `/api/v1` with HttpOnly session cookies. The backend must allow the exact frontend origin in `APP_URL` or `CORS_ORIGINS`. For a phone on your local network, set `NEXT_PUBLIC_FINFE_API_URL` to the backend's reachable LAN address and allow the phone site's origin. Restart Next.js after changing a `NEXT_PUBLIC_*` variable.

## Production

Set `NEXT_PUBLIC_FINFE_API_URL` to the public HTTPS API origin and `NEXT_PUBLIC_SITE_URL` to the public HTTPS site origin before building. Configure the backend's `APP_URL`, `CORS_ORIGINS`, MongoDB replica set, JWT secret, secure cookies, SMTP and Paystack as described in [its README](../finfe-backend/README.md). The site and API must use cookie-compatible hostnames so browser sessions work. The production build fails when the API URL is missing.

The API contract is [`../finfe-backend/api/openapi.yaml`](../finfe-backend/api/openapi.yaml). Run `npm run api:types` when it changes. Vault saves send ciphertext and a readable finance snapshot together; the backend updates the snapshot transactionally. The client uses version checks to merge changes from another device and keeps an encrypted offline cache.

For browser-only demos or E2E tests, set `NEXT_PUBLIC_FINFE_DEMO_MODE=true` before building. This opt-in bypasses the API and stores data in that browser only.
