import { ArrowRight, BarChart3, BellRing, Calculator, CalendarCheck, CloudOff, Compass, EyeOff, HeartPulse, KeyRound, ListChecks, Lock, Mountain, PiggyBank, Tags, Timer, Zap } from 'lucide-react'
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
  { q: 'Can you see my financial data?', a: 'When server reports are enabled, we store readable transaction data so we can calculate them. Your vault backup is also encrypted on your device. The local demo keeps everything in your browser.' },
  { q: 'What if I forget my password?', a: 'When you sign up you get a recovery key. Use it with the reset link we email you to choose a new password and reopen your encrypted vault. If you lose both, the old vault cannot be decrypted.' },
  { q: 'How do I pay?', a: 'With M-Pesa or a card through Paystack. M-Pesa payments cover one month or one year at a time, and we remind you before it ends. Card payments can renew automatically.' },
  { q: 'Can I cancel?', a: 'Yes, at any time. You keep Pro until the end of the period you paid for, then move to the free plan. Your data is never deleted unless you delete your account.' },
  { q: 'Does it work offline?', a: 'Yes. Your recent data is kept encrypted on your device, so you can record expenses without internet. It syncs when you’re back online.' },
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
      <section className="bg-navy text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[13px] text-white/90">
              <Lock aria-hidden className="size-3.5" /> Private and encrypted. Built for Kenya
            </p>
            <h1 className="text-[34px] leading-[1.1] font-semibold tracking-tight sm:text-5xl">{SITE.tagline}</h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/85">
              {SITE.name} ({SITE.nameMeaning}) is a budget planner for salaried Kenyans. Plan your salary before it arrives, track daily expenses, clear your loans faster, and stop borrowing to get through the month.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" prefetch={false} className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-base font-medium text-white hover:bg-primary/90">
                Start free: {TRIAL_DAYS} days of Pro <ArrowRight aria-hidden className="size-4" />
              </Link>
              <Link href="/login" prefetch={false} className="inline-flex h-12 items-center rounded-lg border border-white/30 px-6 text-base text-white hover:bg-white/10">
                Log in
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/70">No card needed · Pay with M-Pesa or card · Cancel any time</p>
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
              accent="Keep"
              title="it private"
              subtitle="Your vault backup is encrypted on your device. Server reports use readable transaction data."
              visual={<PrivacyVisual />}
              tiles={[
                { icon: Lock, label: 'Encrypted vault backup' },
                { icon: EyeOff, label: 'Clear data use for reports' },
                { icon: KeyRound, label: 'Recovery key and auto-lock' },
              ]}
              cta={{ href: '/about#privacy', label: 'How we protect your data' }}
            >
              Your data is encrypted with AES-256 using a key made from your password, before anything leaves your phone or computer. Our servers only ever hold scrambled text. Your password never leaves your device, and you can delete everything at any time.
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
            Budget, savings, emergency fund, debt payoff and financial freedom calculators, plus a two-minute financial health check. They run in your browser, nothing is sent anywhere, and your last numbers are remembered on your device for next time.
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
