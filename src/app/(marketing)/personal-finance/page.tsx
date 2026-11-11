import { ArticleLayout } from '@/components/marketing/article-layout'
import { PILLARS } from '@/content/pillars'
import { buildMetadata } from '@/lib/seo/metadata'

const article = PILLARS['personal-finance']
const { meta } = article

export const metadata = buildMetadata({ title: meta.seoTitle, description: meta.description, path: '/personal-finance', type: 'article', publishedTime: meta.published, modifiedTime: meta.updated, keywords: meta.keywords, section: meta.category })

export default function Page() {
  return <ArticleLayout article={article} path="/personal-finance" crumbs={[{ name: 'Personal finance', path: '/personal-finance' }]} />
}
