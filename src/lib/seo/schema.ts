/**
 * Schema.org JSON-LD generators. Everything here must describe content that is VISIBLE on the page:
 * no ratings, reviews or claims that the page doesn't show.
 */
import { absoluteUrl, EDITORIAL, SITE } from '@/config/site'
import { FREE_FEATURES, PRICES, PRO_FEATURES, TRIAL_DAYS } from '@/lib/plans'
import { ogImagePath } from './metadata'

export type JsonLd = Record<string, unknown>

export const ORG_ID = `${SITE.url}/#organization`
export const WEBSITE_ID = `${SITE.url}/#website`
export const APP_ID = `${SITE.url}/#app`

export function organizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.company,
    description: `${SITE.company} operates ${SITE.name}, a personal finance app for Kenya.`,
    contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer support', email: SITE.supportEmail, availableLanguage: ['en'] }],
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  }
}

export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    alternateName: SITE.alternateName,
    description: SITE.description,
    inLanguage: SITE.language,
    publisher: { '@id': ORG_ID },
  }
}

/** The product itself. Prices come from the same file the billing code uses, so they can't drift. */
export function webApplicationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': APP_ID,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    applicationCategory: 'FinanceApplication',
    applicationSubCategory: 'Budgeting and expense tracking',
    operatingSystem: 'Any (web browser). Installable as an app on Android, iOS, Windows and macOS.',
    browserRequirements: 'Requires JavaScript and a modern browser with Web Crypto (HTTPS).',
    inLanguage: SITE.language,
    image: absoluteUrl('/pwa-512x512.png'),
    publisher: { '@id': ORG_ID },
    featureList: [...FREE_FEATURES, ...PRO_FEATURES],
    offers: [
      { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: SITE.currency, availability: 'https://schema.org/InStock', url: absoluteUrl('/pricing') },
      {
        '@type': 'Offer',
        name: `Pro (monthly, ${TRIAL_DAYS}-day free trial)`,
        price: String(PRICES.monthly.amount),
        priceCurrency: SITE.currency,
        availability: 'https://schema.org/InStock',
        url: absoluteUrl('/pricing'),
        priceSpecification: { '@type': 'UnitPriceSpecification', price: String(PRICES.monthly.amount), priceCurrency: SITE.currency, billingDuration: 'P1M', unitText: 'month' },
      },
      {
        '@type': 'Offer',
        name: `Pro (yearly, ${TRIAL_DAYS}-day free trial)`,
        price: String(PRICES.yearly.amount),
        priceCurrency: SITE.currency,
        availability: 'https://schema.org/InStock',
        url: absoluteUrl('/pricing'),
        priceSpecification: { '@type': 'UnitPriceSpecification', price: String(PRICES.yearly.amount), priceCurrency: SITE.currency, billingDuration: 'P1Y', unitText: 'year' },
      },
    ],
  }
}

export interface Crumb {
  name: string
  path: string
}

export function breadcrumbSchema(items: Crumb[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: absoluteUrl(c.path) })),
  }
}

export interface Source {
  title: string
  url: string
  publisher: string
}

export function articleSchema(a: {
  type?: 'Article' | 'BlogPosting'
  title: string
  description: string
  path: string
  published: string
  updated: string
  keywords?: string[]
  section?: string
  sources?: Source[]
}): JsonLd {
  const url = absoluteUrl(a.path)
  return {
    '@context': 'https://schema.org',
    '@type': a.type ?? 'Article',
    '@id': `${url}#article`,
    headline: a.title,
    description: a.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: absoluteUrl(ogImagePath(a.path)),
    datePublished: a.published,
    dateModified: a.updated,
    inLanguage: SITE.language,
    isAccessibleForFree: true,
    author: { '@type': EDITORIAL.author.type, name: EDITORIAL.author.name, url: absoluteUrl(EDITORIAL.author.url) },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': WEBSITE_ID },
    ...(a.keywords?.length ? { keywords: a.keywords.join(', ') } : {}),
    ...(a.section ? { articleSection: a.section } : {}),
    ...(a.sources?.length
      ? { citation: a.sources.map((s) => ({ '@type': 'CreativeWork', name: s.title, url: s.url, publisher: { '@type': 'Organization', name: s.publisher } })) }
      : {}),
  }
}

export interface Faq {
  q: string
  a: string
}

/** Only for questions and answers shown on the page itself. */
export function faqSchema(faqs: Faq[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
}

/** A free browser calculator. */
export function calculatorSchema(c: { name: string; description: string; path: string }): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: c.name,
    description: c.description,
    url: absoluteUrl(c.path),
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any (web browser)',
    isAccessibleForFree: true,
    inLanguage: SITE.language,
    offers: { '@type': 'Offer', price: '0', priceCurrency: SITE.currency },
    publisher: { '@id': ORG_ID },
  }
}

export function itemListSchema(name: string, items: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: absoluteUrl(it.path) })),
  }
}

export function definedTermSetSchema(name: string, path: string, terms: { slug: string; term: string; definition: string }[]): JsonLd {
  const url = absoluteUrl(path)
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${url}#terms`,
    name,
    url,
    hasDefinedTerm: terms.map((t) => ({ '@type': 'DefinedTerm', name: t.term, description: t.definition, url: `${url}#${t.slug}`, inDefinedTermSet: `${url}#terms` })),
  }
}

/** Generic page node, used for hubs, about, contact and legal pages. */
export function webPageSchema(p: { type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage'; title: string; description: string; path: string; updated?: string }): JsonLd {
  const url = absoluteUrl(p.path)
  return {
    '@context': 'https://schema.org',
    '@type': p.type ?? 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: p.title,
    description: p.description,
    inLanguage: SITE.language,
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORG_ID },
    ...(p.updated ? { dateModified: p.updated } : {}),
  }
}
