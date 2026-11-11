import { Calculator as CalcIcon, HeartPulse, type LucideIcon, Mountain, MonitorSmartphone, PiggyBank, Sigma, Target, TrendingUp, Umbrella, UserX, Wallet } from 'lucide-react'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/marketing/breadcrumbs'
import { CtaBanner } from '@/components/marketing/cta'
import { PageIntro } from '@/components/marketing/page-intro'
import { LinkList, ShowcasePanel } from '@/components/marketing/showcase'
import { ToolsVisual } from '@/components/marketing/showcase-visuals'
import { JsonLd } from '@/components/seo/json-ld'
import { CALCULATORS } from '@/content/calculators'
import { buildMetadata } from '@/lib/seo/metadata'
import { PAGES } from '@/lib/seo/pages'
import { itemListSchema, webPageSchema } from '@/lib/seo/schema'

const page = PAGES.calculators

/** One line per tool for the list (what question it answers). */
const SHORT: Record<string, string> = {
  budget: 'What’s left after your payments, and a safe amount to spend per day.',
  savings: 'How much your savings could grow with a monthly deposit and interest.',
  'savings-goal': 'How much to save each month to reach a goal by a date.',
  'emergency-fund': 'How big your emergency fund should be, and how long it will take.',
  'debt-payoff': 'Your debt-free date, and what paying a little extra would change.',
  'financial-freedom': 'Roughly when work could become optional, with the assumptions shown.',
}

const ICONS: Record<string, LucideIcon> = {
  budget: Wallet,
  savings: PiggyBank,
  'savings-goal': Target,
  'emergency-fund': Umbrella,
  'debt-payoff': Mountain,
  'financial-freedom': TrendingUp,
}
export const metadata = buildMetadata(page)

export default function CalculatorsPage() {
  const items = [
    ...CALCULATORS.map((c) => ({ name: c.meta.name, path: `/calculators/${c.meta.slug}`, text: SHORT[c.meta.slug] ?? c.meta.summary, icon: ICONS[c.meta.slug] ?? CalcIcon })),
    { name: 'Financial health check', path: '/financial-health', text: 'Score seven money habits in two minutes and get your next three moves.', icon: HeartPulse },
  ]
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <Breadcrumbs items={[{ name: 'Free tools', path: page.path }]} />
      <div className="mt-6">
        <PageIntro title="Free financial tools" lead="Quick, honest answers for Kenyan salaries: what’s left after your payments, how your savings could grow, how big your emergency fund should be, when you’ll be debt-free and when work could become optional. No account needed. Everything runs in your browser, nothing is sent anywhere, and your last numbers are remembered on your device so you can pick up where you left off." />
      </div>
      <div className="mt-12 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <ShowcasePanel
          tiles={[
            { icon: UserX, label: 'No account needed' },
            { icon: MonitorSmartphone, label: 'Your numbers stay in your browser' },
            { icon: Sigma, label: 'Formulas and assumptions shown' },
          ]}
        >
          <ToolsVisual />
        </ShowcasePanel>
        <div className="rounded-[28px] border border-border/80 bg-[#f7f9fc] p-2.5 sm:p-3.5">
          <div className="rounded-[22px] border border-border/80 bg-white">
            <LinkList title="All free tools" items={items.map((it) => ({ href: it.path, label: it.name, note: it.text, icon: it.icon }))} />
          </div>
        </div>
      </div>
      <div className="mt-16">
        <section aria-labelledby="learn-more" className="rounded-2xl border bg-card p-6">
          <h2 id="learn-more" className="text-xl font-semibold text-navy">
            Understand the numbers
          </h2>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Every tool explains its formula and assumptions. For the bigger picture, the <Link href="/learn" className="text-primary underline underline-offset-2">financial education hub</Link> has guides on budgeting, expenses, debt, saving and financial independence.
          </p>
        </section>
        <div className="mt-10">
          <CtaBanner title="Want these numbers every month, automatically?" text="Finfe keeps your plan, limits and debt-free date up to date as you record spending." />
        </div>
      </div>
      <JsonLd data={[webPageSchema({ type: 'CollectionPage', title: page.title, description: page.description, path: page.path, updated: page.updated }), itemListSchema('Free financial tools', items.map(({ name, path }) => ({ name, path })))]} />
    </div>
  )
}
