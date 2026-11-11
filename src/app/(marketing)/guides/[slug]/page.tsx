import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleLayout } from '@/components/marketing/article-layout'
import { GUIDES } from '@/content/guides'
import { buildMetadata } from '@/lib/seo/metadata'

export const dynamicParams = false

const find = (slug: string) => GUIDES.find((a) => a.meta.slug === slug)

export function generateStaticParams() {
  return GUIDES.map((a) => ({ slug: a.meta.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = find((await params).slug)
  if (!a) return {}
  const { meta } = a
  return buildMetadata({ title: meta.seoTitle, description: meta.description, path: `/guides/${meta.slug}`, type: 'article', publishedTime: meta.published, modifiedTime: meta.updated, keywords: meta.keywords, section: meta.category })
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const a = find((await params).slug)
  if (!a) notFound()
  const path = `/guides/${a.meta.slug}`
  return <ArticleLayout article={a} path={path} schemaType="Article" crumbs={[{ name: 'Guides', path: '/guides' }, { name: a.meta.title, path }]} />
}
