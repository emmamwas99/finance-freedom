import type { Metadata } from 'next'
import { SITE } from '@/config/site'

export interface PageSeo {
  /** Page title without the brand suffix (the root layout's template adds " | Finfe"). */
  title: string
  description: string
  /** Path of the canonical URL, e.g. "/guides/how-to-make-a-budget". */
  path: string
  /** Use the title as-is, without the brand template (home page). */
  absoluteTitle?: boolean
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  keywords?: string[]
  section?: string
  /** Keep out of search results (account pages, utility pages). */
  noindex?: boolean
  /** Override the generated Open Graph image path. */
  image?: string
}

/** Path of the statically generated Open Graph image for a page (see app/og/[...slug]/route.tsx). */
export function ogImagePath(path: string) {
  return path === '/' ? '/og/home' : `/og${path}`
}

export const OG_SIZE = { width: 1200, height: 630 } as const

/**
 * One function for every page's metadata, so titles, canonicals, Open Graph, Twitter and robots
 * are always consistent. Relative URLs resolve against `metadataBase` (SITE.url) in the root layout.
 */
export function buildMetadata(p: PageSeo): Metadata {
  const image = p.image ?? ogImagePath(p.path)
  const fullTitle = p.absoluteTitle ? p.title : `${p.title} | ${SITE.name}`
  const images = [{ url: image, ...OG_SIZE, alt: p.title }]
  return {
    title: p.absoluteTitle ? { absolute: p.title } : p.title,
    description: p.description,
    keywords: p.keywords?.length ? p.keywords : undefined,
    alternates: { canonical: p.path },
    robots: p.noindex
      ? { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    openGraph: {
      type: p.type ?? 'website',
      url: p.path,
      siteName: SITE.name,
      locale: SITE.locale,
      title: fullTitle,
      description: p.description,
      images,
      ...(p.type === 'article'
        ? { publishedTime: p.publishedTime, modifiedTime: p.modifiedTime, section: p.section, authors: [`${SITE.url}/about`] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: p.description,
      images: [image],
      ...(SITE.twitterHandle ? { site: `@${SITE.twitterHandle}`, creator: `@${SITE.twitterHandle}` } : {}),
    },
  }
}

/** Metadata for private/account pages: unique title, no indexing, no social preview of anything personal. */
export function privateMetadata(title: string): Metadata {
  return {
    title,
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  }
}
