import { ArrowRight, BarChart3, BellRing, Calculator, CalendarCheck, CloudOff, Compass, Database, HeartPulse, KeyRound, ListChecks, Lock, Mountain, PiggyBank, Tags, Timer, Zap } from 'lucide-react'
import Link from 'next/link'
import { CtaBanner } from '@/components/marketing/cta'
import { FaqSection } from '@/components/marketing/faq'
import { HeroMock } from '@/components/marketing/hero-mock'
import { PricingCards } from '@/components/marketing/pricing-cards'
import { Showcase } from '@/components/marketing/showcase'
import { DebtVisual, PlanVisual, PrivacyVisual, ProgressVisual, ToolsVisual, TrackVisual } from '@/components/marketing/showcase-visuals'
import { JsonLd } from '@/components/seo/json-ld'
import { SITE } from '@/config/site'
import { TRIAL_DAYS } from '@/lib/plans'
import { buildMetadata } from '@/lib/seo/metadata'
import { PAGES } from '@/lib/seo/pages'
import { webApplicationSchema, webPageSchema } from '@/lib/seo/schema'

const page = PAGES.home

export const metadata = buildMetadata({ ...page, absoluteTitle: true })

const STEPS = [
  { title: 'List what you must pay', text: 'Loans, school fees, rent, house help, chama. Mark which repeat every month.' },
  { title: 'See what’s left', text: 'Income − payments = what you really have for food, transport and the rest, plus a safe daily amount.' },
  { title: 'Record and get warned', text: 'Add each expense in seconds (press N on a computer). Limits warn you at 80%.' },
]

const FAQ = [
  { q: 'Can you see my financial data?', a: 'Yes. Finfe stores readable finance records in our database to calculate reports. We also keep an encrypted vault backup for syncing and recovery. We do not receive your password or recovery key. The free calculators are separate and run in your browser.' },
  { q: 'What if I forget my password?', a: 'Use the reset link we email you and the recovery key from signup to reopen your encrypted vault. Without the recovery key, you can reset your account and start fresh, but the old vault cannot be unlocked.' },
  { q: 'How do I pay?', a: 'With M-Pesa or a card through Paystack. M-Pesa payments cover one month or one year at a time, and we remind you before it ends. Card payments can renew automatically.' },
  { q: 'Can I cancel?', a: 'Yes, at any time. You keep Pro until the end of the period you paid for, then move to the free plan. Your account and records remain available on the free plan.' },
  { q: 'Does it work offline?', a: 'Yes. A recent encrypted copy stays on your device so you can record expenses without internet. When you reconnect, changes sync to your account and the finance records used for reports are saved in our database.' },
  { q: 'Does it connect to my bank or M-Pesa?', a: 'No. You record what you spend yourself, which is what makes you think twice before spending.' },
]

const TOPIC_LINKS = [
  { href: '/budgeting', label: 'Budgeting' },
  { href: '/expense-tracker', label: 'Expenses' },
  { href: '/debt-management', label: 'Debt management' },
  { href: '/saving-money', label: 'Saving' },
  { href: '/financial-freedom', label: 'Financial independence' },
]

export default function HomePage() {
  return (
    <>
      <section className="finfe-hero relative isolate overflow-hidden text-navy">
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-4 pt-11 pb-14 sm:px-6 sm:py-20 lg:min-h-[620px] lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="max-w-xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/75 px-3 py-1.5 text-[13px] font-medium text-navy shadow-sm">
              <Lock aria-hidden className="size-3.5 text-primary" /> Secure sync. Built for Kenya
            </p>
            <h1 className="text-[36px] leading-[1.08] font-semibold tracking-tight sm:text-5xl lg:text-[54px]">{SITE.tagline}</h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[#45576c]">
              {SITE.name} ({SITE.nameMeaning}) is a budget planner for salaried Kenyans. Plan your salary before it arrives, track daily expenses, clear your loans faster, and stop borrowing to get through the month.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/signup" prefetch={false} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-center text-base font-medium text-white shadow-[0_10px_24px_rgba(20,112,168,0.2)] transition-colors hover:bg-navy sm:w-auto">
                Start free: {TRIAL_DAYS} days of Pro <ArrowRight aria-hidden className="size-4" />
              </Link>
              <Link href="/login" prefetch={false} className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-navy/15 bg-white/70 px-6 py-2.5 text-base text-navy transition-colors hover:bg-white sm:w-auto">
                Log in
              </Link>
            </div>
            <p className="mt-4 text-sm text-[#52677a]">No card needed · Pay with M-Pesa or card · Cancel any time</p>
          </div>
          <HeroMock />
        </div>
      </section>

      <section aria-labelledby="how" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="how" className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            How does Finfe work?
          </h2>
          <p className="mt-3 text-[17px] text-muted-foreground">It answers one question every day: how much money is really left this month, after every payment you must make?</p>
        </div>
        <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8 md:before:absolute md:before:top-6 md:before:right-[16%] md:before:left-[16%] md:before:border-t-2 md:before:border-dashed md:before:border-[#c6dbea] md:before:content-['']">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative text-center">
              <span aria-hidden className="relative mx-auto flex size-12 items-center justify-center rounded-full bg-navy text-[17px] font-semibold text-white ring-8 ring-background">
                {i + 1}
              </span>
              <h3 className="mt-5 text-[19px] font-semibold text-navy">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-[16px] leading-relaxed text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="features" aria-labelledby="features-title" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <h2 id="features-title" className="text-center text-[32px] leading-tight font-medium tracking-tight text-navy sm:text-[44px]">
            Money management, made simple.
          </h2>
          <div className="mt-14 grid gap-24 lg:mt-20 lg:gap-32">
            <Showcase
              id="plan"
              accent="Plan"
              title="your month"
              subtitle="Know what’s left after every payment, before your salary is spent."
              visual={<PlanVisual />}
              tiles={[
                { icon: CalendarCheck, label: 'Tick payments as you pay' },
                { icon: BellRing, label: 'Warnings at 80% of a limit' },
                { icon: Timer, label: 'The next 6 months covered' },
              ]}
              cta={{ href: '/signup', label: 'Plan my month' }}
            >
              List your loans, school fees, rent, house help and chama. Finfe works out what’s left after all of them, and how much you can safely spend each day, so payday doesn’t disappear by the 10th.
            </Showcase>

            <Showcase
              id="track"
              reverse
              accent="Track"
              title="every shilling"
              subtitle="Record spending in seconds and see where your money really goes."
              visual={<TrackVisual />}
              tiles={[
                { icon: Zap, label: 'Add an expense in seconds' },
                { icon: Tags, label: 'Needs, wants, debt and savings' },
                { icon: CloudOff, label: 'Works offline, syncs later' },
              ]}
              cta={{ href: '/expense-tracker', label: 'Explore the expense tracker' }}
            >
              Every expense goes into a category with a type, so you see how much goes to essentials, to lifestyle and to your future. Set a limit for food, transport or fun and you’re warned before it’s gone, not after.
            </Showcase>

            <Showcase
              id="debt"
              accent="Clear"
              title="your loans"
              subtitle="See the month you’ll be debt-free, and how to get there sooner."
              visual={<DebtVisual />}
              tiles={[
                { icon: Mountain, label: 'Every loan in one place' },
                { icon: Calculator, label: 'A “pay extra” simulator' },
                { icon: ListChecks, label: 'Highest interest first' },
              ]}
              cta={{ href: '/calculators/debt-payoff', label: 'Find your debt-free date' }}
            >
              Add every loan, from the shamba loan to SACCO and mobile loans. Finfe projects a debt-free date for each one and shows how much sooner a little extra each month would get you there, and how much interest it saves.
            </Showcase>

            <Showcase
              id="progress"
              reverse
              accent="Know"
              title="you’re on track"
              subtitle="An honest monthly check of the habits that decide where your money goes."
              visual={<ProgressVisual />}
              tiles={[
                { icon: Compass, label: '10 money habits checked' },
                { icon: BarChart3, label: 'A monthly report card' },
                { icon: ListChecks, label: 'Your next 3 moves' },
              ]}
              cta={{ href: '/financial-health', label: 'Try the free health check' }}
            >
              Are you living within your income? Is your debt going down? Are “wants” creeping up? Each month Finfe checks ten habits on your real numbers, explains what’s working, and gives you three specific moves in plain shillings.
            </Showcase>

            <Showcase
              id="security"
              accent="Know"
              title="where your data goes"
              subtitle="Your vault backup is encrypted. Your finance records are stored in our database for reports."
              visual={<PrivacyVisual />}
              tiles={[
                { icon: Lock, label: 'Encrypted vault backup' },
                { icon: Database, label: 'Records for server reports' },
                { icon: KeyRound, label: 'Password stays on your device' },
              ]}
              cta={{ href: '/about#privacy', label: 'How we protect your data' }}
            >
              We encrypt your vault backup on your device before upload. We also save readable categories, transactions, budgets, loans, goals and plans in our database so we can calculate reports. Your password and recovery key are not sent to us. You can delete your account and its finance records in Settings.
            </Showcase>
          </div>
        </div>
      </section>

      <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-20 border-y bg-card">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <h2 id="pricing-title" className="text-3xl font-semibold tracking-tight text-navy">
              Simple pricing
            </h2>
            <p className="mt-3 text-[17px] text-muted-foreground">
              Start free. Upgrade when it’s helping you. <Link href="/pricing" className="text-primary underline underline-offset-2">Compare plans</Link>.
            </p>
          </div>
          <div className="mt-8">
            <PricingCards />
          </div>
        </div>
      </section>

      <section aria-label="Free financial tools" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <Showcase
            id="tools"
            as="h2"
            reverse
            accent="Try"
            title="free money tools"
            subtitle="Answers with your own numbers, no account needed."
            visual={<ToolsVisual />}
            tiles={[
              { icon: Calculator, label: 'Budget calculator', href: '/calculators/budget' },
              { icon: PiggyBank, label: 'Savings calculator', href: '/calculators/savings' },
              { icon: HeartPulse, label: 'Financial health check', href: '/financial-health' },
            ]}
            cta={{ href: '/calculators', label: 'See all free tools' }}
          >
            Budget, savings, emergency fund, debt payoff and financial freedom calculators, plus a two-minute financial health check. These free tools run separately from your account: their inputs stay in your browser, and your last numbers are remembered on your device for next time.
          </Showcase>
        </div>
      </section>

      <section aria-labelledby="learn" className="border-y bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 id="learn" className="text-3xl font-semibold tracking-tight text-navy">
            Learn how money works, in plain language
          </h2>
          <p className="mt-3 max-w-2xl text-[17px] text-muted-foreground">
            Step-by-step guides with Kenyan examples, in the <Link href="/learn" className="text-primary underline underline-offset-2">financial education hub</Link>.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {TOPIC_LINKS.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className="inline-flex rounded-full border bg-background px-5 py-2.5 text-[15px] font-medium text-navy hover:border-primary/50">
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <FaqSection faqs={FAQ} title="Questions" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <CtaBanner />
      </div>

      <JsonLd data={[webPageSchema({ title: page.title, description: page.description, path: '/', updated: page.updated }), webApplicationSchema()]} />
    </>
  )
}
