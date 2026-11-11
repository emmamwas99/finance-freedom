import { ArticleIndex } from '@/components/marketing/article-index'
import { Breadcrumbs } from '@/components/marketing/breadcrumbs'
import { PageIntro } from '@/components/marketing/page-intro'
import { JsonLd } from '@/components/seo/json-ld'
import { POSTS } from '@/content/blog'
import { buildMetadata } from '@/lib/seo/metadata'
import { PAGES } from '@/lib/seo/pages'
import { itemListSchema, webPageSchema } from '@/lib/seo/schema'

const page = PAGES.blog
export const metadata = buildMetadata(page)

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <Breadcrumbs items={[{ name: 'Blog', path: page.path }]} />
      <div className="mt-6 mb-10">
        <PageIntro title="The Finfe blog" lead="Honest articles about the money habits that keep people borrowing, and the small changes that get them out: planning before payday, the real cost of mobile loans, sinking funds and paying yourself first." />
      </div>
      <ArticleIndex articles={POSTS} base="/blog" />
      <JsonLd data={[webPageSchema({ type: 'CollectionPage', title: page.title, description: page.description, path: page.path, updated: page.updated }), itemListSchema('Blog posts', POSTS.map((p) => ({ name: p.meta.title, path: `/blog/${p.meta.slug}` })))]} />
    </div>
  )
}
