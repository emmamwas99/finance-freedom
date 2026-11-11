import type { MetadataRoute } from 'next'
import { SITE } from '@/config/site'

/**
 * Public content is open to every crawler, including AI answer engines (GEO).
 * The private app is kept out: `/app$` + `/app/` rather than a bare `/app` prefix, which would
 * also block `/apple-touch-icon…`. Account pages stay crawlable so their noindex tag is seen.
 * Preview deployments are blocked entirely so they never compete with production.
 */
export default function robots(): MetadataRoute.Robots {
  const preview = process.env.VERCEL_ENV !== undefined && process.env.VERCEL_ENV !== 'production'
  if (preview) return { rules: [{ userAgent: '*', disallow: '/' }] }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/app$', '/app/', '/demo-checkout', '/api/'] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
