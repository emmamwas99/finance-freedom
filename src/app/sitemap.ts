import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/config/site'
import { publicRoutes } from '@/lib/seo/routes'

/**
 * Every public, indexable URL, generated from the same registry as the pages, Open Graph images
 * and llms.txt, so nothing can be forgotten. Private and account routes are never listed.
 * (Well under the 50,000-URL limit; switch to generateSitemaps() if the blog grows that large.)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes().map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: r.updated,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
