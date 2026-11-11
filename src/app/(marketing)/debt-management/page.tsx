import { ArticleLayout } from '@/components/marketing/article-layout'
import { PILLARS } from '@/content/pillars'
import { buildMetadata } from '@/lib/seo/metadata'

const article = PILLARS['debt-management']
const { meta } = article

export const metadata = buildMetadata({ title: meta.seoTitle, description: meta.description, path: '/debt-management', type: 'article', publishedTime: meta.published, modifiedTime: meta.updated, keywords: meta.keywords, section: meta.category })

export default function Page() {
  return <ArticleLayout article={article} path="/debt-management" crumbs={[{ name: 'Debt management', path: '/debt-management' }]} />
}
