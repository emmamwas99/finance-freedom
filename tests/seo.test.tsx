import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import robots from '../src/app/robots'
import sitemap from '../src/app/sitemap'
import { POSTS } from '../src/content/blog'
import { CALCULATORS } from '../src/content/calculators'
import { GLOSSARY } from '../src/content/glossary'
import { GUIDES } from '../src/content/guides'
import { PILLARS } from '../src/content/pillars'
import { PRICES } from '../src/lib/plans'
import { buildMetadata, ogImagePath, privateMetadata } from '../src/lib/seo/metadata'
import { publicRoutes, routeTitle } from '../src/lib/seo/routes'
import { articleSchema, breadcrumbSchema, faqSchema, webApplicationSchema } from '../src/lib/seo/schema'

const PRIVATE = ['/app', '/login', '/signup', '/forgot', '/reset', '/demo-checkout']
const routes = publicRoutes()
const paths = new Set(routes.map((r) => r.path))
const glossarySlugs = new Set(GLOSSARY.map((t) => t.slug))
const ARTICLES = [...GUIDES, ...POSTS, ...Object.values(PILLARS)]

describe('metadata builder', () => {
  it('sets canonical, Open Graph, Twitter and indexable robots', () => {
    const m = buildMetadata({ title: 'Budget calculator', description: 'd', path: '/calculators/budget' })
    expect(m.alternates?.canonical).toBe('/calculators/budget')
    expect(m.openGraph).toMatchObject({ url: '/calculators/budget', title: 'Budget calculator | Finfe' })
    expect(JSON.stringify(m.openGraph)).toContain('/og/calculators/budget')
    expect(m.twitter).toMatchObject({ card: 'summary_large_image' })
    expect(m.robots).toMatchObject({ index: true, follow: true })
  })

  it('private pages are noindex with no social preview', () => {
    const m = privateMetadata('Overview')
    expect(m.robots).toMatchObject({ index: false, follow: false })
    expect(m.openGraph).toBeUndefined()
    expect(ogImagePath('/')).toBe('/og/home')
  })
})

describe('route registry, sitemap and robots', () => {
  it('has unique paths, titles and descriptions of a sensible length', () => {
    expect(paths.size).toBe(routes.length)
    expect(new Set(routes.map((r) => r.title)).size).toBe(routes.length)
    expect(new Set(routes.map((r) => r.description)).size).toBe(routes.length)
    for (const r of routes) {
      expect(r.description.length, r.path).toBeGreaterThanOrEqual(70)
      expect(r.description.length, r.path).toBeLessThanOrEqual(170)
      expect(r.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('article <title>s stay short enough not to be truncated', () => {
    for (const a of ARTICLES) expect(`${a.meta.seoTitle} | Finfe`.length, a.meta.slug).toBeLessThanOrEqual(65)
    for (const c of CALCULATORS) expect(`${c.meta.seoTitle} | Finfe`.length, c.meta.slug).toBeLessThanOrEqual(65)
  })

  it('sitemap lists every public route and no private route', () => {
    const urls = sitemap().map((s) => new URL(s.url).pathname)
    expect(urls).toHaveLength(routes.length)
    for (const p of PRIVATE) expect(urls.some((u) => u === p || u.startsWith(`${p}/`))).toBe(false)
    for (const r of routes) expect(urls).toContain(r.path)
  })

  it('robots keeps crawlers out of the app without blocking /apple-touch-icon', () => {
    const r = robots()
    const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules
    expect(rule.disallow).toEqual(expect.arrayContaining(['/app$', '/app/']))
    expect(rule.disallow).not.toContain('/app')
    expect(String(r.sitemap)).toMatch(/\/sitemap\.xml$/)
  })
})

describe('structured data', () => {
  it('product offers use the real prices from plans.ts', () => {
    const offers = webApplicationSchema().offers as { price: string }[]
    expect(offers.map((o) => o.price)).toEqual(['0', String(PRICES.monthly.amount), String(PRICES.yearly.amount)])
    expect(JSON.stringify(webApplicationSchema())).not.toMatch(/aggregateRating|review/i) // no fabricated ratings
  })

  it('article, breadcrumb and FAQ schemas have the required properties', () => {
    const a = articleSchema({ title: 'T', description: 'D', path: '/guides/x', published: '2026-11-11', updated: '2026-11-11' })
    expect(a).toMatchObject({ '@context': 'https://schema.org', '@type': 'Article', headline: 'T', datePublished: '2026-11-11', dateModified: '2026-11-11' })
    expect(a.author).toMatchObject({ '@type': 'Organization' })
    const b = breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Guides', path: '/guides' }])
    expect((b.itemListElement as { position: number }[]).map((i) => i.position)).toEqual([1, 2])
    const f = faqSchema([{ q: 'Q?', a: 'A.' }])
    expect(f.mainEntity).toEqual([{ '@type': 'Question', name: 'Q?', acceptedAnswer: { '@type': 'Answer', text: 'A.' } }])
  })
})

describe('content quality and internal links', () => {
  const linkOk = (href: string) => {
    const [path, hash] = href.split('#')
    if (path === '/glossary' && hash) return glossarySlugs.has(hash)
    return paths.has(path) || PRIVATE.includes(path)
  }

  it('every article has the fields answer engines rely on', () => {
    for (const { meta } of ARTICLES) {
      expect(meta.summary.length, meta.slug).toBeGreaterThan(40)
      expect(meta.keyTakeaways.length, meta.slug).toBeGreaterThanOrEqual(3)
      expect(meta.description.length, meta.slug).toBeLessThanOrEqual(170)
      expect(meta.updated >= meta.published, meta.slug).toBe(true)
      for (const f of meta.faq ?? []) expect(f.q.endsWith('?'), f.q).toBe(true)
    }
  })

  it('every internal link in every article, calculator and glossary entry resolves', () => {
    const bad: string[] = []
    const check = (from: string, href: string) => {
      if (href.startsWith('/') && !linkOk(href)) bad.push(`${from} → ${href}`)
    }
    for (const a of ARTICLES) {
      a.meta.related.forEach((h) => check(a.meta.slug, h))
      const html = renderToStaticMarkup(createElement(a.Body))
      for (const m of html.matchAll(/href="([^"]+)"/g)) check(a.meta.slug, m[1])
      // table-of-contents ids must exist in the body
      for (const t of a.meta.toc ?? []) expect(html, `${a.meta.slug}#${t.id}`).toContain(`id="${t.id}"`)
    }
    for (const c of CALCULATORS) {
      c.meta.related.forEach((r) => check(c.meta.slug, r.href))
      for (const m of renderToStaticMarkup(createElement(c.Body)).matchAll(/href="([^"]+)"/g)) check(c.meta.slug, m[1])
    }
    for (const t of GLOSSARY) t.related?.forEach((r) => check(`glossary:${t.slug}`, r.href))
    expect(bad).toEqual([])
  })

  it('related-link labels resolve to page titles, not raw paths', () => {
    expect(routeTitle('/calculators/budget')).toBe('Budget calculator')
    expect(routeTitle('/glossary#emergency-fund')).toMatch(/definition/)
  })

  it('no unsupported promises in public content', () => {
    const text = ARTICLES.map((a) => renderToStaticMarkup(createElement(a.Body)) + JSON.stringify(a.meta)).join(' ')
    // "guaranteed returns" may appear only as a warning sign; promises in our own voice may not
    expect(text).not.toMatch(/(we|finfe) guarantees?\b|guaranteed (financial freedom|to be debt[- ]free)|you will (be|become) (debt[- ]free|rich)|risk[- ]free returns?/i)
  })
})
