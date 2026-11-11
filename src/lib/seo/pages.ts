import { PRICES, TRIAL_DAYS } from '@/lib/plans'

export type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

/** SEO record for a hand-built public page. Articles and calculators have their own registries. */
export interface PageEntry {
  path: string
  /** <title> without the brand suffix. */
  title: string
  description: string
  /** Short label shown above the title on the Open Graph image. */
  kicker: string
  updated: string
  changeFrequency: ChangeFrequency
  priority: number
  keywords?: string[]
}

const UPDATED = '2026-11-11'

export const PAGES = {
  home: {
    path: '/',
    title: 'Finfe: budget planner and debt-free tracker for Kenya',
    description: `Plan your salary, track daily expenses and see your debt-free date. A private, encrypted budget app for Kenya. Free plan; Pro from KSh ${PRICES.monthly.amount}/month with M-Pesa.`,
    kicker: 'Budget planner for Kenya',
    updated: UPDATED,
    changeFrequency: 'weekly',
    priority: 1,
    keywords: ['budget app Kenya', 'budget planner', 'expense tracker Kenya', 'debt free app', 'personal finance app Kenya', 'M-Pesa budget app'],
  },
  pricing: {
    path: '/pricing',
    title: 'Pricing: Free and Pro plans',
    description: `Finfe is free to start. Pro is KSh ${PRICES.monthly.amount} a month or KSh ${PRICES.yearly.amount.toLocaleString('en-KE')} a year, with a ${TRIAL_DAYS}-day free trial. Pay with M-Pesa or card, cancel any time.`,
    kicker: 'Pricing',
    updated: UPDATED,
    changeFrequency: 'monthly',
    priority: 0.8,
    keywords: ['Finfe price', 'budget app price Kenya', 'pay with M-Pesa'],
  },
  expenseTracker: {
    path: '/expense-tracker',
    title: 'Expense tracker app for Kenya',
    description: 'Track daily expenses in KSh, sort them into needs and wants, and get a warning before you overspend. Private, encrypted, and it works offline on your phone.',
    kicker: 'Expense tracker',
    updated: UPDATED,
    changeFrequency: 'monthly',
    priority: 0.9,
    keywords: ['expense tracker', 'expense tracker app Kenya', 'daily expense tracker', 'spending tracker', 'track expenses'],
  },
  financialHealth: {
    path: '/financial-health',
    title: 'Financial health check: score your money habits',
    description: 'A free 2-minute financial health check. Score seven money habits, from spending and borrowing to saving and your emergency fund, and get your next three moves.',
    kicker: 'Financial health check',
    updated: UPDATED,
    changeFrequency: 'monthly',
    priority: 0.8,
    keywords: ['financial health check', 'financial health assessment', 'money health score', 'am I financially healthy'],
  },
  glossary: {
    path: '/glossary',
    title: 'Money glossary: personal finance terms explained',
    description: 'Plain-English definitions of budgeting, saving, debt and investing terms, from net pay and sinking funds to APR, SACCOs and the 4% rule, with Kenyan examples.',
    kicker: 'Money glossary',
    updated: UPDATED,
    changeFrequency: 'monthly',
    priority: 0.6,
    keywords: ['personal finance terms', 'finance glossary', 'what is a sinking fund', 'what is APR'],
  },
  calculators: {
    path: '/calculators',
    title: 'Free financial tools and calculators',
    description: 'Free financial tools for Kenyan salaries: budget, savings, emergency fund, debt payoff and financial freedom calculators. No account needed; nothing leaves your browser.',
    kicker: 'Free financial tools',
    updated: UPDATED,
    changeFrequency: 'monthly',
    priority: 0.8,
    keywords: ['free financial tools', 'financial calculators Kenya', 'budget calculator', 'savings calculator', 'loan payoff calculator'],
  },
  learn: {
    path: '/learn',
    title: 'Financial education hub: budgeting, debt and saving',
    description: 'Free personal finance education for Kenya, organised by topic: budgeting, expenses, debt management, saving and financial independence. Guides, articles and tools.',
    kicker: 'Financial education',
    updated: UPDATED,
    changeFrequency: 'weekly',
    priority: 0.8,
    keywords: ['financial education Kenya', 'personal finance guides', 'learn budgeting', 'money management tips'],
  },
  guides: {
    path: '/guides',
    title: 'Step-by-step money guides',
    description: 'Practical, step-by-step guides to budgeting a salary, tracking expenses, building an emergency fund and getting out of debt, written for Kenya.',
    kicker: 'Guides',
    updated: UPDATED,
    changeFrequency: 'weekly',
    priority: 0.7,
  },
  blog: {
    path: '/blog',
    title: 'Blog: money habits, debt and saving',
    description: 'Articles on running out of money before payday, the true cost of mobile loans, sinking funds for school fees and paying yourself first.',
    kicker: 'Blog',
    updated: UPDATED,
    changeFrequency: 'weekly',
    priority: 0.6,
  },
  about: {
    path: '/about',
    title: 'About Finfe',
    description: 'Why we built a private, payments-first budget planner for salaried Kenyans, how we protect your data, and how we write and review our money guides.',
    kicker: 'About us',
    updated: UPDATED,
    changeFrequency: 'yearly',
    priority: 0.5,
  },
  contact: {
    path: '/contact',
    title: 'Contact us',
    description: 'Get help with your Finfe account, billing or a lost password, or send us feedback. We reply by email.',
    kicker: 'Contact',
    updated: UPDATED,
    changeFrequency: 'yearly',
    priority: 0.4,
  },
  privacy: {
    path: '/privacy',
    title: 'Privacy policy',
    description: 'What Finfe processes: encrypted vault backups, readable finance records for server reports when enabled, account and payment data.',
    kicker: 'Privacy policy',
    updated: UPDATED,
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  terms: {
    path: '/terms',
    title: 'Terms of service',
    description: 'The terms for using Finfe: accounts, Free and Pro plans, payments through Paystack, cancellation and your data.',
    kicker: 'Terms of service',
    updated: UPDATED,
    changeFrequency: 'yearly',
    priority: 0.3,
  },
} satisfies Record<string, PageEntry>

export type PageKey = keyof typeof PAGES
