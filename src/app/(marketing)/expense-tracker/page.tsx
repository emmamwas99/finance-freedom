import { BarChart3, BellRing, CloudOff, EyeOff, KeyRound, Lock, Smartphone, Tags, Zap } from 'lucide-react'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/marketing/breadcrumbs'
import { CtaBanner } from '@/components/marketing/cta'
import { FaqSection } from '@/components/marketing/faq'
import { PageIntro } from '@/components/marketing/page-intro'
import { A, Prose, Steps, Table } from '@/components/marketing/prose'
import { Showcase } from '@/components/marketing/showcase'
import { LimitsVisual, PrivacyVisual, TrackVisual } from '@/components/marketing/showcase-visuals'
import { JsonLd } from '@/components/seo/json-ld'
import { money } from '@/lib/format'
import { TRIAL_DAYS } from '@/lib/plans'
import { buildMetadata } from '@/lib/seo/metadata'
import { PAGES } from '@/lib/seo/pages'
import { webApplicationSchema, webPageSchema } from '@/lib/seo/schema'

const page = PAGES.expenseTracker
export const metadata = buildMetadata(page)

const FAQ = [
  { q: 'Is there a free expense tracker?', a: `Yes. Finfe’s Free plan includes unlimited expenses, income and loans, spending limits with warnings, and the monthly plan. Pro adds reports and the “Am I on track?” check, with a ${TRIAL_DAYS}-day free trial.` },
  { q: 'Does it read my M-Pesa messages or connect to my bank?', a: 'No. You record each expense yourself. That takes a few seconds and makes you notice every shilling, which is the point. It also means no one else ever needs access to your accounts.' },
  { q: 'Can I track expenses offline?', a: 'Yes. Recent data is stored encrypted on your device, so you can record expenses with no internet. Changes sync automatically when you reconnect.' },
  { q: 'What if I forget to record some spending?', a: 'Add it as one “untracked spending” amount for that month so your totals are still right, then pick the habit back up. It’s better than abandoning the month.' },
  { q: 'Can I export my expenses?', a: 'Yes. Pro includes a spreadsheet (CSV) export and encrypted backups you can keep yourself.' },
]

function TrackerMock() {
  const rows: [string, string, string, number][] = [
    ['🍲', 'Naivas', 'Food & Groceries · need', 2340],
    ['🚌', 'Matatu to town', 'Transport · need', 100],
    ['📱', 'Data bundle', 'Airtime & Data · need', 500],
    ['🎉', 'Lunch with team', 'Eating Out & Fun · want', 850],
  ]
  return (
    <figure aria-label="Example expense list with a spending-limit warning" className="rounded-2xl border bg-card p-5 shadow-[0_1px_3px_rgba(10,60,110,0.06)]">
      <p className="text-sm font-semibold text-navy">Today</p>
      <ul className="mt-2 divide-y">
        {rows.map(([e, n, c, a]) => (
          <li key={n} className="flex items-center gap-3 py-2.5">
            <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-muted text-lg">
              {e}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px]">{n}</span>
              <span className="block truncate text-[13px] text-muted-foreground">{c}</span>
            </span>
            <span className="text-[15px] font-medium tabular-nums">− {money(a)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 rounded-lg bg-amber-50 p-2.5 text-[13px] text-amber-900">Eating Out & Fun is at 84% of its {money(4000)} limit for November.</p>
    </figure>
  )
}

export default function ExpenseTrackerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <Breadcrumbs items={[{ name: 'Expense tracker', path: page.path }]} />
      <div className="mt-6 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <PageIntro
          title="An expense tracker that warns you before you overspend"
          lead="Finfe is an expense tracker for Kenya: record daily spending in KSh in a few seconds, sort it into needs and wants, and get a warning at 80% of any limit. It works offline, and your records are encrypted on your device."
        >
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" prefetch={false} className="inline-flex h-12 items-center rounded-lg bg-primary px-6 text-base font-medium text-white hover:bg-primary/90">
              Start tracking free
            </Link>
            <Link href="/guides/how-to-track-expenses" className="inline-flex h-12 items-center rounded-lg border bg-card px-6 text-base text-navy hover:border-primary/50">
              How to track expenses
            </Link>
          </div>
        </PageIntro>
        <TrackerMock />
      </div>

      <section aria-labelledby="features" className="mt-20">
        <h2 id="features" className="text-center text-[30px] leading-tight font-medium tracking-tight text-navy sm:text-[40px]">
          What does the expense tracker do?
        </h2>
        <div className="mt-14 grid gap-24 lg:gap-32">
          <Showcase
            id="record"
            accent="Record"
            title="in seconds"
            subtitle="Amount, category, done. The categories you use most come first."
            visual={<TrackVisual />}
            tiles={[
              { icon: Zap, label: 'N for an expense, I for income' },
              { icon: Tags, label: 'Needs, wants, debt and savings' },
              { icon: CloudOff, label: 'Works offline, syncs later' },
            ]}
            cta={{ href: '/signup', label: 'Start tracking free' }}
          >
            Every category has a type, so you see how much goes to essentials, to lifestyle, to loans and to your future. Missed a day? Add it as one “untracked” amount and the month still adds up.
          </Showcase>
          <Showcase
            id="limits"
            reverse
            accent="Stop"
            title="overspending early"
            subtitle="Set a monthly limit per category and get warned at 80%, while you’re entering the expense."
            visual={<LimitsVisual />}
            tiles={[
              { icon: BellRing, label: 'A limit for each category' },
              { icon: Smartphone, label: 'Phone and computer in sync' },
              { icon: BarChart3, label: 'Plan vs actual each month' },
            ]}
            cta={{ href: '/guides/how-to-track-expenses', label: 'How to track expenses' }}
          >
            The warning comes before the money is gone, not after. At month end you see what you planned against what you actually spent, category by category.
          </Showcase>
          <Showcase
            id="private"
            accent="Private"
            title="by design"
            subtitle="Your vault backup is encrypted on your device. Server reports use readable transaction data."
            visual={<PrivacyVisual />}
            tiles={[
              { icon: Lock, label: 'Encrypted vault backup' },
              { icon: EyeOff, label: 'Server reports from your records' },
              { icon: KeyRound, label: 'Recovery key if you forget' },
            ]}
            cta={{ href: '/about#privacy', label: 'How we protect your data' }}
          >
            Your spending is stored for reports when the Go backend is enabled. We do not sell it. No bank or M-Pesa connection is needed: you record each expense yourself, which is what makes you think twice.
          </Showcase>
        </div>
      </section>

      <Prose className="mt-16">
        <h2 id="how">How do I track my expenses with Finfe?</h2>
        <Steps
          items={[
            { title: 'List this month’s payments first', body: <>Loans, rent, school fees, house help. The <A href="/budgeting">monthly plan</A> shows what’s left after them, which is your real spending money.</> },
            { title: 'Set a limit for each everyday category', body: 'Food, transport, airtime, eating out. Start from what you actually spent last month.' },
            { title: 'Record every expense the same day', body: 'Even KSh 50. A one-off forgotten day? Add it as one untracked amount so the month still adds up.' },
            { title: 'Look at the month once a week', body: 'Which limits are close? Which wants could wait? Adjust before the month ends, not after.' },
          ]}
        />
        <h2 id="compare">Notebook, spreadsheet or app: which works best?</h2>
        <p>Any method works if you keep it up. The difference is how much effort each takes and whether it warns you in time.</p>
        <Table caption="Ways to track expenses compared">
          <thead>
            <tr>
              <th scope="col">Method</th>
              <th scope="col">Good at</th>
              <th scope="col">Weak at</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Notebook</td>
              <td>Simple, no phone needed</td>
              <td>Totals by hand, no warnings, easy to lose</td>
            </tr>
            <tr>
              <td>Spreadsheet</td>
              <td>Flexible, good for analysis</td>
              <td>Awkward on a phone, easy to fall behind</td>
            </tr>
            <tr>
              <td>M-Pesa statement</td>
              <td>A complete record of mobile money</td>
              <td>Misses cash and card spending; looking back, not planning ahead</td>
            </tr>
            <tr>
              <td>Finfe</td>
              <td>Seconds per entry, limits with early warnings, plan vs actual</td>
              <td>You still have to record each expense (on purpose)</td>
            </tr>
          </tbody>
        </Table>
        <p>
          Want the full method? Read <A href="/guides/how-to-track-expenses">how to track your daily expenses</A>, or try the <A href="/calculators/budget">budget calculator</A> to see what you can spend per day.
        </p>
      </Prose>

      <div className="mt-16 max-w-3xl">
        <FaqSection faqs={FAQ} />
      </div>
      <div className="mt-16">
        <CtaBanner title="Start tracking today" text="Free to start, with a 14-day Pro trial. No card needed." />
      </div>
      <JsonLd data={[webPageSchema({ title: page.title, description: page.description, path: page.path, updated: page.updated }), webApplicationSchema()]} />
    </div>
  )
}
