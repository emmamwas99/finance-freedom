/**
 * Offline service worker, served from a route so each deploy gets a fresh cache version.
 * - App pages (/app, auth pages): network first, fall back to the last copy, so the encrypted app opens offline.
 * - Build assets (/_next/static): cache first. They're content-hashed and immutable.
 * - After the first app visit, every dashboard route and its scripts are warmed into the cache.
 * - Never touches cross-origin requests (Supabase, Paystack) or RSC data requests.
 */
export const dynamic = 'force-static'

const APP_ROUTES = ['/app', '/app/plan', '/app/transactions', '/app/debts', '/app/reports', '/app/on-track', '/app/settings', '/app/billing', '/login']

function script(version: string) {
  return `
const VERSION = ${JSON.stringify(version)};
const PAGES = 'ff-pages-' + VERSION;
const ASSETS = 'ff-assets-' + VERSION;
const APP_ROUTES = ${JSON.stringify(APP_ROUTES)};
const isAppPage = (p) => p === '/app' || p.startsWith('/app/') || ['/login', '/signup', '/forgot', '/reset'].includes(p);

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('ff-') && !k.endsWith(VERSION)).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

async function warm() {
  const pages = await caches.open(PAGES);
  const assets = await caches.open(ASSETS);
  for (const route of APP_ROUTES) {
    try {
      const res = await fetch(route, { credentials: 'same-origin' });
      if (!res.ok) continue;
      await pages.put(route, res.clone());
      const html = await res.text();
      const urls = new Set(html.match(/\\/_next\\/static\\/[^"'\\s)]+/g) || []);
      await Promise.all([...urls].map(async (u) => { if (!(await assets.match(u))) { try { await assets.add(u); } catch (e) {} } }));
    } catch (e) {}
  }
}

// Warm once per deploy: only when some dashboard route is not cached yet.
async function warmOnce() {
  const pages = await caches.open(PAGES);
  for (const route of APP_ROUTES) if (!(await pages.match(route))) return warm();
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.headers.get('RSC') || url.searchParams.has('_rsc')) return;

  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(caches.open(ASSETS).then(async (c) => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) c.put(req, res.clone());
      return res;
    }));
    return;
  }

  if (req.mode === 'navigate' && isAppPage(url.pathname)) {
    event.respondWith((async () => {
      const c = await caches.open(PAGES);
      try {
        const res = await fetch(req);
        if (res.ok) {
          c.put(url.pathname, res.clone());
          if (url.pathname.startsWith('/app')) event.waitUntil(warmOnce());
        }
        return res;
      } catch (e) {
        return (await c.match(url.pathname)) || (await c.match('/app')) || Response.error();
      }
    })());
  }
});
`
}

export function GET() {
  return new Response(script(process.env.NEXT_PUBLIC_APP_VERSION ?? 'dev'), {
    headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
  })
}
