import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV !== 'production'

// Canonical URLs, the sitemap, Open Graph and JSON-LD all use the public site URL. Shout if it's missing.
if (!isDev && !process.env.NEXT_PUBLIC_SITE_URL && !process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  console.warn('\n⚠  NEXT_PUBLIC_SITE_URL is not set: canonical URLs and the sitemap will point to http://localhost:3000.\n   Set it to your production address (e.g. https://yourdomain.co.ke) before deploying.\n')
}

/** Supabase origin from the public env (http(s) + websocket), so the CSP allows exactly that project. */
function supabaseOrigins() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!raw) return []
  try {
    const u = new URL(raw)
    return [u.origin, `wss://${u.host}`]
  } catch {
    return []
  }
}

function apiOrigin() {
  try { return process.env.NEXT_PUBLIC_FINFE_API_URL ? new URL(process.env.NEXT_PUBLIC_FINFE_API_URL).origin : '' }
  catch { return '' }
}

/**
 * Content Security Policy. Static pages can't carry per-request nonces, so inline scripts
 * (Next's RSC payload) are allowed, but every *source* is pinned to this site and Supabase.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' ${supabaseOrigins().join(' ')} ${apiOrigin()}`.trim(),
  "worker-src 'self'",
  "manifest-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  ...(isDev ? [] : [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]),
]

/** Routes that hold (encrypted) personal data or account flows: never indexed, never cached by shared caches. */
const PRIVATE_ROUTES = ['/app', '/app/:path*', '/login', '/signup', '/forgot', '/reset', '/verify-email', '/demo-checkout']

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // `npm run phone`: let phones on the local network load dev resources (development only).
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '172.*.*.*'],
  experimental: {
    // Tailwind CSS is small; inlining it removes a render-blocking request for first-time visitors on slow mobile networks.
    inlineCss: true,
  },
  env: {
    // Versions the service-worker cache so each deploy starts clean.
    NEXT_PUBLIC_APP_VERSION: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? Date.now().toString(36),
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      ...PRIVATE_ROUTES.map((source) => ({
        source,
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
        ],
      })),
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ]
  },
  async redirects() {
    // One canonical URL per intent. 301 (not Next's default 308) as requested for SEO migrations.
    return [
      { source: '/budget-calculator', destination: '/calculators/budget', statusCode: 301 },
      { source: '/financial-freedom-calculator', destination: '/calculators/financial-freedom', statusCode: 301 },
      { source: '/emergency-fund-calculator', destination: '/calculators/emergency-fund', statusCode: 301 },
      { source: '/debt-calculator', destination: '/calculators/debt-payoff', statusCode: 301 },
      { source: '/savings-calculator', destination: '/calculators/savings', statusCode: 301 },
      { source: '/savings-goal-calculator', destination: '/calculators/savings-goal', statusCode: 301 },
      { source: '/tools', destination: '/calculators', statusCode: 301 },
      { source: '/free-tools', destination: '/calculators', statusCode: 301 },
      { source: '/education', destination: '/learn', statusCode: 301 },
      { source: '/expense-tracking', destination: '/expense-tracker', statusCode: 301 },
      { source: '/register', destination: '/signup', statusCode: 301 },
      { source: '/sign-up', destination: '/signup', statusCode: 301 },
      { source: '/sign-in', destination: '/login', statusCode: 301 },
      { source: '/dashboard', destination: '/app', statusCode: 301 },
      { source: '/home', destination: '/', statusCode: 301 },
    ]
  },
}

export default nextConfig
