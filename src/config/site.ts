/**
 * Brand, URL and navigation, in one place. Fill the TODOs before launch.
 * Server code may read SITE.url; client code should use relative URLs.
 */

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/+$/, '')
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel}`
  return 'http://localhost:3000'
}

export const SITE = {
  name: 'Finfe',
  /** What the name means; used once on key pages so people and machines connect the two. */
  nameMeaning: 'short for “financial freedom”',
  alternateName: 'Finfe Financial Freedom',
  shortName: 'Finfe',
  tagline: 'Know exactly what’s left after every payment.',
  description:
    'Finfe is a private, encrypted budget planner for Kenya. Plan your salary, track expenses, clear your loans and stop borrowing to get by. Free plan; Pro from KSh 299 a month with M-Pesa.',
  url: resolveSiteUrl(),
  locale: 'en_KE',
  language: 'en-KE',
  country: 'Kenya',
  countryCode: 'KE',
  currency: 'KES',
  themeColor: '#0a3c6e',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@yourdomain.co.ke', // TODO: your support address
  company: 'EMANET',
  /** Official profiles (X, LinkedIn, Facebook…). Used for Organization `sameAs`. Add real URLs only. */
  sameAs: [] as string[],
  /** X/Twitter handle without @, if you have one. */
  twitterHandle: undefined as string | undefined,
  /** When the site and its content first went live (ISO date). */
  launchDate: '2026-11-11',
} as const

/** Kept for the app code that used `BRAND` before the migration. */
export const BRAND = {
  name: SITE.name,
  tagline: SITE.tagline,
  supportEmail: SITE.supportEmail,
  company: SITE.company,
  country: SITE.country,
}

/**
 * Who writes the public content. An organisation author is honest until a named, qualified
 * reviewer exists. Add one (with credentials and a profile page) to strengthen E-E-A-T.
 */
export const EDITORIAL = {
  author: { type: 'Organization' as const, name: 'Finfe Editorial Team', url: '/about' },
  reviewPolicy: 'Every guide is checked against primary sources and updated when rules or products change.',
}

/**
 * Links into the private app. Public pages don't prefetch these: the encrypted app bundle is large
 * and most search visitors never open it, so prefetching would waste their mobile data.
 */
export const isAccountPath = (href: string) => /^\/(app|login|signup|forgot|reset)(\/|$|\?)/.test(href)

export const absoluteUrl = (path = '/') => `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`

export interface NavItem {
  href: string
  label: string
  description?: string
}

/** Main navigation for the public site. Plain links, crawlable without JavaScript. */
export const MAIN_NAV: NavItem[] = [
  { href: '/calculators', label: 'Free tools' },
  { href: '/learn', label: 'Learn' },
  { href: '/expense-tracker', label: 'Expense tracker' },
  { href: '/pricing', label: 'Pricing' },
]

export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  {
    title: 'Learn',
    items: [
      { href: '/learn', label: 'Financial education hub' },
      { href: '/personal-finance', label: 'Personal finance basics' },
      { href: '/budgeting', label: 'Budgeting' },
      { href: '/debt-management', label: 'Debt management' },
      { href: '/saving-money', label: 'Saving money' },
      { href: '/financial-freedom', label: 'Financial freedom' },
      { href: '/guides', label: 'Step-by-step guides' },
      { href: '/blog', label: 'Blog' },
      { href: '/glossary', label: 'Money glossary' },
    ],
  },
  {
    title: 'Free tools',
    items: [
      { href: '/calculators/budget', label: 'Budget calculator' },
      { href: '/calculators/savings', label: 'Savings calculator' },
      { href: '/calculators/debt-payoff', label: 'Debt payoff calculator' },
      { href: '/calculators/emergency-fund', label: 'Emergency fund calculator' },
      { href: '/calculators/savings-goal', label: 'Savings goal calculator' },
      { href: '/calculators/financial-freedom', label: 'Financial freedom calculator' },
      { href: '/financial-health', label: 'Financial health check' },
    ],
  },
  {
    title: 'Product',
    items: [
      { href: '/expense-tracker', label: 'Expense tracker' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/signup', label: 'Create an account' },
      { href: '/login', label: 'Log in' },
    ],
  },
  {
    title: 'Company',
    items: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy', label: 'Privacy policy' },
      { href: '/terms', label: 'Terms of service' },
    ],
  },
]
