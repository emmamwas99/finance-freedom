import { ArticleLayout } from '@/components/marketing/article-layout'
import { PILLARS } from '@/content/pillars'
import { buildMetadata } from '@/lib/seo/metadata'

const article = PILLARS['financial-freedom']
const { meta } = article

export const metadata = buildMetadata({ title: meta.seoTitle, description: meta.description, path: '/financial-freedom', type: 'article', publishedTime: meta.published, modifiedTime: meta.updated, keywords: meta.keywords, section: meta.category })

export default function Page() {
  return <ArticleLayout article={article} path="/financial-freedom" crumbs={[{ name: 'Financial freedom', path: '/financial-freedom' }]} />
}
