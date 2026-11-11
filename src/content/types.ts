import type { ReactNode } from 'react'
import type { Faq, Source } from '@/lib/seo/schema'

export type ContentCategory = 'Budgeting' | 'Expense tracking' | 'Saving' | 'Debt' | 'Financial freedom' | 'Personal finance'

/** Metadata for a guide or blog post. Everything here is rendered visibly on the page. */
export interface ArticleMeta {
  slug: string
  /** The H1. */
  title: string
  /** The <title> without the " | Finfe" suffix. Keep it under ~45 characters. */
  seoTitle: string
  /** Meta description, 120–160 characters, written to be quoted as-is. */
  description: string
  /** A direct 1–3 sentence answer to the page's main question. Shown first ("Quick answer"). */
  summary: string
  /** 3–5 short, factual takeaways. */
  keyTakeaways: string[]
  keywords: string[]
  /** ISO dates (YYYY-MM-DD). */
  published: string
  updated: string
  readingMinutes: number
  category: ContentCategory
  /** Internal paths to related pages, most relevant first. */
  related: string[]
  /** Optional table of contents: ids must match <h2 id> in the body. */
  toc?: { id: string; label: string }[]
  /** Questions answered visibly in the FAQ section (also emitted as FAQPage JSON-LD). */
  faq?: Faq[]
  /** Primary sources cited in the text. */
  sources?: Source[]
}

export interface Article {
  meta: ArticleMeta
  Body: () => ReactNode
}
