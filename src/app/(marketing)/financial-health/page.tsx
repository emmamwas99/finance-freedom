import { Breadcrumbs } from '@/components/marketing/breadcrumbs'
import { CtaBanner } from '@/components/marketing/cta'
import { FaqSection } from '@/components/marketing/faq'
import { Byline, PageIntro } from '@/components/marketing/page-intro'
import { A, Prose, Table } from '@/components/marketing/prose'
import { JsonLd } from '@/components/seo/json-ld'
import { EDITORIAL } from '@/config/site'
import { FinancialHealthCheck } from '@/features/calculators/financial-health-check'
import { buildMetadata } from '@/lib/seo/metadata'
import { PAGES } from '@/lib/seo/pages'
import { calculatorSchema } from '@/lib/seo/schema'

const page = PAGES.financialHealth
export const metadata = buildMetadata(page)

/** Thresholds shown here are the ones in src/lib/calculators/financial-health.ts. Keep them in sync. */
const CHECKS: [string, string, string, string][] = [
  ['Living within your income', 'Spending ≤ 90% of take-home pay', '90–100%', 'Over 100%'],
  ['Not borrowing to get by', 'No new borrowing', 'Up to 10% of pay', 'More than 10%'],
  ['Debt payments are manageable', 'Under 30% of pay', '30–50%', '50% or more'],
  ['Saving or investing regularly', '10% of pay or more', 'Something, under 10%', 'Nothing'],
  ['An emergency fund', '3+ months of essentials', '1–3 months', 'Under 1 month'],
  ['“Wants” under control', 'Up to 30% of spending', '30–40%', 'Over 40%'],
  ['Recording every expense', 'Every expense', 'Sometimes', 'Not tracking'],
]

const FAQ = [
  { q: 'How is the financial health score calculated?', a: 'Each of the seven checks scores 2 points when healthy, 1 when it needs attention and 0 when it needs fixing. Your score is the points earned as a percentage of the 14 possible. 75 or more is healthy; under 50 needs action.' },
  { q: 'Is my information saved?', a: 'Only in your own browser, so your answers are there next time; use “Reset to example” to clear them. Nothing you type is sent to us or anyone else.' },
  { q: 'What should I fix first?', a: 'Start with the items marked “Fix this first”, in the order shown. Usually that means stopping new borrowing and building one month of essential costs, because both stop problems from growing.' },
  { q: 'How is this different from a credit score?', a: 'A credit score estimates how likely you are to repay lenders. This check looks at your own money habits (spending, saving, debt load and buffers), which is what decides whether you need to borrow in the first place.' },
]

export default function FinancialHealthPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <Breadcrumbs items={[{ name: 'Free tools', path: '/calculators' }, { name: 'Financial health check', path: page.path }]} />
      <div className="mt-6 grid gap-3">
        <PageIntro title="Financial health check" lead="Financial health is whether your money habits keep you out of trouble: spending below your income, not borrowing to get by, manageable debt, regular saving and an emergency buffer. Answer eight quick questions to score seven habits out of 100 and get your next three moves." />
        <Byline author={EDITORIAL.author.name} updated={page.updated} />
      </div>
      <div className="mt-8">
        <FinancialHealthCheck />
      </div>
      <Prose className="mt-12">
        <h2 id="what-it-measures">What does the financial health check measure?</h2>
        <p>Seven habits that decide whether a salary lasts the month and whether debt is shrinking or growing. They are the same thresholds Finfe’s “Am I on track?” check uses on your real numbers each month.</p>
        <Table caption="The seven checks and their thresholds">
          <thead>
            <tr>
              <th scope="col">Check</th>
              <th scope="col">Healthy</th>
              <th scope="col">Needs attention</th>
              <th scope="col">Fix this first</th>
            </tr>
          </thead>
          <tbody>
            {CHECKS.map(([c, good, warn, bad]) => (
              <tr key={c}>
                <td>{c}</td>
                <td>{good}</td>
                <td>{warn}</td>
                <td>{bad}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <h2 id="why-these">Why these seven habits?</h2>
        <ul>
          <li><strong>Spending and borrowing</strong> show whether you live on your income or on credit. Borrowing to cover everyday spending shrinks next month’s pay and starts a cycle (see <A href="/blog/why-you-run-out-of-money-before-payday">why you run out before payday</A>).</li>
          <li><strong>Debt payments over 30% of pay</strong> leave too little for essentials. Use the <A href="/calculators/debt-payoff">debt payoff calculator</A> to see your way out.</li>
          <li><strong>Saving and an emergency fund</strong> turn surprises into inconveniences instead of new loans. Size yours with the <A href="/calculators/emergency-fund">emergency fund calculator</A>.</li>
          <li><strong>Wants and tracking</strong> are where most of the room to change is, and you can’t manage what you don’t record (<A href="/guides/how-to-track-expenses">how to track expenses</A>).</li>
        </ul>
        <p>This check is general education, not financial advice. It uses the typical-month numbers you enter, so the result is only as accurate as those numbers.</p>
      </Prose>
      <div className="mt-14 max-w-3xl">
        <FaqSection faqs={FAQ} />
      </div>
      <div className="mt-14">
        <CtaBanner title="Check your habits on real numbers, every month" text="Finfe’s “Am I on track?” runs ten checks on what you actually record, and tells you your next three moves." />
      </div>
      <JsonLd data={calculatorSchema({ name: 'Financial health check', description: page.description, path: page.path })} />
    </div>
  )
}
