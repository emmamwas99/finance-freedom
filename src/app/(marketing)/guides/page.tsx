import { ArticleIndex } from '@/components/marketing/article-index'
import { Breadcrumbs } from '@/components/marketing/breadcrumbs'
import { PageIntro } from '@/components/marketing/page-intro'
import { JsonLd } from '@/components/seo/json-ld'
import { GUIDES } from '@/content/guides'
import { buildMetadata } from '@/lib/seo/metadata'
import { PAGES } from '@/lib/seo/pages'
import { itemListSchema, webPageSchema } from '@/lib/seo/schema'

const page = PAGES.guides
export const metadata = buildMetadata(page)

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <Breadcrumbs items={[{ name: 'Guides', path: page.path }]} />
      <div className="mt-6 mb-10">
        <PageIntro title="Step-by-step money guides" lead="Clear, practical steps for the money problems salaried Kenyans face most: making a budget that lasts the month, tracking expenses, building an emergency fund and getting out of debt." />
      </div>
      <ArticleIndex articles={GUIDES} base="/guides" />
      <JsonLd data={[webPageSchema({ type: 'CollectionPage', title: page.title, description: page.description, path: page.path, updated: page.updated }), itemListSchema('Money guides', GUIDES.map((g) => ({ name: g.meta.title, path: `/guides/${g.meta.slug}` })))]} />
    </div>
  )
}
