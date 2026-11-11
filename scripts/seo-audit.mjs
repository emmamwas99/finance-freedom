#!/usr/bin/env node
/**
 * Crawls a running production build (npm run build && npm start) like a search engine would,
 * with no JavaScript, and fails on SEO regressions.
 *
 *   BASE_URL=http://localhost:3000 node scripts/seo-audit.mjs
 *
 * Checks: sitemap URLs return 200 · unique <title> and meta description · canonical = page URL ·
 * Open Graph + Twitter tags · og:image is a real PNG · exactly one <h1> · no skipped heading levels ·
 * JSON-LD parses, uses schema.org and has required properties · images have alt text ·
 * every internal link resolves with 200 (no redirect chains, no 404s) · private routes are noindex
 * and absent from the sitemap · robots.txt, llms.txt, 301 redirects and real 404s.
 */
const BASE = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const PRIVATE = ['/app', '/app/plan', '/app/transactions', '/app/debts', '/app/reports', '/app/on-track', '/app/settings', '/app/billing', '/login', '/signup', '/forgot', '/reset', '/demo-checkout']
const REDIRECTS = { '/budget-calculator': '/calculators/budget', '/financial-freedom-calculator': '/calculators/financial-freedom', '/expense-tracking': '/expense-tracker' }

const errors = []
const warnings = []
const fail = (page, msg) => errors.push(`${page}: ${msg}`)
const warn = (page, msg) => warnings.push(`${page}: ${msg}`)

const get = (path, init) => fetch(BASE + path, { redirect: 'manual', ...init })
const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1]
const metas = (html) => [...html.matchAll(/<meta\s[^>]*>/g)].map((m) => m[0])
const meta = (html, key) => {
  const tag = metas(html).find((t) => attr(t, 'name') === key || attr(t, 'property') === key)
  return tag ? attr(tag, 'content') : undefined
}
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const toPath = (url) => {
  const u = new URL(url)
  return u.pathname
}

// ---------- sitemap ----------
const sm = await get('/sitemap.xml')
if (sm.status !== 200) throw new Error(`sitemap.xml returned ${sm.status}`)
const sitemapXml = await sm.text()
const pages = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => toPath(m[1]))
if (pages.length < 20) fail('sitemap', `only ${pages.length} URLs`)
for (const p of PRIVATE) if (pages.includes(p)) fail('sitemap', `private route listed: ${p}`)

const titles = new Map()
const descriptions = new Map()
const internalLinks = new Set()
const ogImages = new Set()

// ---------- every public page ----------
for (const path of pages) {
  const res = await get(path)
  if (res.status !== 200) {
    fail(path, `status ${res.status}`)
    continue
  }
  const html = await res.text()
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '')
  const desc = decode(meta(html, 'description') ?? '')
  if (!title) fail(path, 'missing <title>')
  else if (title.length > 70) warn(path, `title is ${title.length} chars`)
  if (!desc) fail(path, 'missing meta description')
  else if (desc.length < 50 || desc.length > 170) warn(path, `description is ${desc.length} chars`)
  titles.set(title, [...(titles.get(title) ?? []), path])
  descriptions.set(desc, [...(descriptions.get(desc) ?? []), path])

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
  if (!canonical) fail(path, 'missing canonical')
  else if (toPath(canonical) !== path) fail(path, `canonical points to ${canonical}`)

  for (const k of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type', 'twitter:card', 'twitter:image']) if (!meta(html, k)) fail(path, `missing ${k}`)
  const og = meta(html, 'og:image')
  if (og) ogImages.add(toPath(og))
  const robots = meta(html, 'robots') ?? ''
  if (/noindex/.test(robots)) fail(path, 'public page is noindex')

  const h1s = html.match(/<h1[\s>]/g)?.length ?? 0
  if (h1s !== 1) fail(path, `${h1s} <h1> elements`)
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]))
  for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) {
    fail(path, `heading jumps from h${levels[i - 1]} to h${levels[i]}`)
    break
  }

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1])
  if (blocks.length < 2) fail(path, 'expected Organization/WebSite plus page JSON-LD')
  for (const raw of blocks) {
    let data
    try {
      data = JSON.parse(raw)
    } catch {
      fail(path, 'JSON-LD does not parse')
      continue
    }
    if (data['@context'] !== 'https://schema.org' || !data['@type']) fail(path, 'JSON-LD missing @context/@type')
    const t = data['@type']
    if ((t === 'Article' || t === 'BlogPosting') && !(data.headline && data.datePublished && data.dateModified && data.author && data.publisher)) fail(path, `${t} missing required properties`)
    if (t === 'BreadcrumbList' && !data.itemListElement?.every((it, i) => it.position === i + 1 && it.item && it.name)) fail(path, 'BreadcrumbList malformed')
    if (t === 'FAQPage' && !data.mainEntity?.every((q) => q.name && q.acceptedAnswer?.text)) fail(path, 'FAQPage malformed')
    if (/aggregateRating|"review"/i.test(raw)) fail(path, 'ratings/reviews in JSON-LD (not shown on page)')
  }

  for (const img of html.match(/<img\s[^>]*>/g) ?? []) if (!/\salt="/.test(img)) fail(path, `image without alt: ${img.slice(0, 80)}`)

  for (const m of html.matchAll(/<a\s[^>]*href="(\/[^"#]*)(#[^"]*)?"/g)) internalLinks.add(m[1] || '/')
}

for (const [t, ps] of titles) if (t && ps.length > 1) fail('titles', `duplicate "${t}" on ${ps.join(', ')}`)
for (const [d, ps] of descriptions) if (d && ps.length > 1) fail('descriptions', `duplicate on ${ps.join(', ')}`)

// ---------- internal links ----------
for (const link of internalLinks) {
  const res = await get(link)
  if (res.status !== 200) fail('links', `${link} → ${res.status}${res.headers.get('location') ? ` (${res.headers.get('location')})` : ''}`)
}

// ---------- Open Graph images ----------
for (const img of ogImages) {
  const res = await get(img)
  if (res.status !== 200 || !String(res.headers.get('content-type')).includes('image/png')) fail('og:image', `${img} → ${res.status} ${res.headers.get('content-type')}`)
}

// ---------- private routes ----------
for (const p of PRIVATE) {
  const res = await get(p)
  const html = await res.text()
  if (!/noindex/.test(res.headers.get('x-robots-tag') ?? '')) fail(p, 'missing X-Robots-Tag: noindex')
  if (!/<meta name="robots" content="[^"]*noindex/.test(html)) fail(p, 'missing robots noindex meta')
  if (/<script type="application\/ld\+json">[^<]*(Article|WebApplication","@id)/.test(html)) warn(p, 'page-level JSON-LD on a private route')
}

// ---------- robots, llms, redirects, 404 ----------
const robotsTxt = await (await get('/robots.txt')).text()
for (const must of ['Disallow: /app$', 'Disallow: /app/', 'Sitemap:']) if (!robotsTxt.includes(must)) fail('robots.txt', `missing "${must}"`)
if (/Disallow: \/app\s*$/m.test(robotsTxt)) fail('robots.txt', 'bare "/app" would also block /apple-touch-icon')
const llms = await get('/llms.txt')
if (llms.status !== 200 || !(await llms.text()).startsWith('# ')) fail('llms.txt', 'missing or not Markdown')
for (const [from, to] of Object.entries(REDIRECTS)) {
  const res = await get(from)
  if (res.status !== 301 || !String(res.headers.get('location')).endsWith(to)) fail('redirects', `${from} → ${res.status} ${res.headers.get('location')}`)
}
const nf = await get('/this-page-does-not-exist')
if (nf.status !== 404) fail('404', `unknown URL returned ${nf.status}`)
const headers = (await get('/')).headers
for (const h of ['content-security-policy', 'x-content-type-options', 'referrer-policy', 'x-frame-options']) if (!headers.get(h)) fail('headers', `missing ${h}`)

// ---------- report ----------
console.log(`SEO audit of ${BASE}`)
console.log(`  ${pages.length} sitemap URLs · ${internalLinks.size} internal links · ${ogImages.size} OG images · ${PRIVATE.length} private routes`)
for (const w of warnings) console.log(`  warn  ${w}`)
for (const e of errors) console.log(`  FAIL  ${e}`)
console.log(errors.length ? `\n${errors.length} problem(s) found.` : '\nAll checks passed.')
process.exit(errors.length ? 1 : 0)
