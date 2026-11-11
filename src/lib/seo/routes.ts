/**
 * Every public, indexable route with its SEO record: one registry for the sitemap, Open Graph
 * images, llms.txt, related-link labels and tests. Adding content here makes it discoverable everywhere.
 */
import { POSTS } from '@/content/blog'
import { CALCULATORS } from '@/content/calculators'
import { GLOSSARY } from '@/content/glossary'
import { GUIDES } from '@/content/guides'
import { PILLARS } from '@/content/pillars'
import { PAGES, type ChangeFrequency } from './pages'

export interface RouteEntry {
  path: string
  title: string
  description: string
  kicker: string
  updated: string
  changeFrequency: ChangeFrequency
  priority: number
  group: 'core' | 'pillar' | 'calculator' | 'guide' | 'blog' | 'legal'
}

export function publicRoutes(): RouteEntry[] {
  const pages = Object.values(PAGES).map<RouteEntry>((p) => ({
    path: p.path,
    title: p.title,
    description: p.description,
    kicker: p.kicker,
    updated: p.updated,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
    group: p.path === '/privacy' || p.path === '/terms' ? 'legal' : 'core',
  }))
  const pillars = Object.values(PILLARS).map<RouteEntry>(({ meta }) => ({
    path: `/${meta.slug}`,
    title: meta.title,
    description: meta.description,
    kicker: meta.category,
    updated: meta.updated,
    changeFrequency: 'monthly',
    priority: 0.9,
    group: 'pillar',
  }))
  const calculators = CALCULATORS.map<RouteEntry>(({ meta }) => ({
    path: `/calculators/${meta.slug}`,
    title: meta.title,
    description: meta.description,
    kicker: 'Free calculator',
    updated: meta.updated,
    changeFrequency: 'monthly',
    priority: 0.8,
    group: 'calculator',
  }))
  const guides = GUIDES.map<RouteEntry>(({ meta }) => ({
    path: `/guides/${meta.slug}`,
    title: meta.title,
    description: meta.description,
    kicker: `Guide · ${meta.category}`,
    updated: meta.updated,
    changeFrequency: 'monthly',
    priority: 0.7,
    group: 'guide',
  }))
  const posts = POSTS.map<RouteEntry>(({ meta }) => ({
    path: `/blog/${meta.slug}`,
    title: meta.title,
    description: meta.description,
    kicker: `Blog · ${meta.category}`,
    updated: meta.updated,
    changeFrequency: 'monthly',
    priority: 0.6,
    group: 'blog',
  }))
  return [...pages, ...pillars, ...calculators, ...guides, ...posts]
}

/** Human label for an internal link, e.g. in "Keep reading". Handles /glossary#term anchors. */
export function routeTitle(href: string): string {
  const [path, hash] = href.split('#')
  if (path === '/glossary' && hash) {
    const term = GLOSSARY.find((t) => t.slug === hash)
    if (term) return `${term.term}: definition`
  }
  const hit = publicRoutes().find((r) => r.path === path)
  if (hit) return hit.title.split(':')[0]
  if (path === '/signup') return 'Create a free account'
  return path
}
