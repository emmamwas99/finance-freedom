import { Breadcrumbs } from '@/components/marketing/breadcrumbs'
import { FaqSection } from '@/components/marketing/faq'
import { PageIntro } from '@/components/marketing/page-intro'
import { PricingCards } from '@/components/marketing/pricing-cards'
import { Table } from '@/components/marketing/prose'
import { JsonLd } from '@/components/seo/json-ld'
import { money } from '@/lib/format'
import { PRICES, TRIAL_DAYS } from '@/lib/plans'
import { buildMetadata } from '@/lib/seo/metadata'
import { PAGES } from '@/lib/seo/pages'
import { webApplicationSchema, webPageSchema } from '@/lib/seo/schema'

const page = PAGES.pricing
export const metadata = buildMetadata(page)

const ROWS: [string, boolean, boolean][] = [
  ['Monthly plan: payments, ticks and what’s left', true, true],
  ['Unlimited expenses, income, loans and goals', true, true],
  ['Spending limits with 80% warnings', true, true],
  ['Debt-free date for every loan', true, true],
  ['Sync across phone and computer, encrypted vault backup and offline use', true, true],
  ['Monthly report card (plan vs actual)', false, true],
  ['Yearly reports and charts', false, true],
  ['“Am I on track?” 10-habit check', false, true],
  ['“Pay extra” debt-free simulator', false, true],
  ['Encrypted backups and spreadsheet export', false, true],
]

const FAQ = [
  { q: 'Is there a free trial?', a: `Yes. Every new account gets ${TRIAL_DAYS} days of Pro for free. No card or M-Pesa payment is needed to start, and you move to the Free plan automatically if you don’t upgrade.` },
  { q: 'How does paying with M-Pesa work?', a: 'You pay through Paystack’s secure checkout and get an M-Pesa prompt on your phone. Each M-Pesa payment covers one month or one year. It doesn’t renew by itself, and we remind you before it ends.' },
  { q: 'Can card payments renew automatically?', a: 'Yes. Card subscriptions can renew each period until you cancel. You can manage or cancel a card subscription from the billing page in the app.' },
  { q: 'What happens to my data if I stop paying?', a: 'Nothing is deleted. You move to the Free plan and keep all your records and the core features. Pro reports come back as soon as you upgrade again.' },
  { q: 'Can I get a refund?', a: 'You can cancel at any time and keep Pro until the end of the period you paid for. Refunds follow our Terms of Service.' },
]

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <Breadcrumbs items={[{ name: 'Pricing', path: page.path }]} />
      <div className="mt-6">
        <PageIntro
          title="Finfe pricing"
          lead={`Finfe is free to start. Pro costs ${money(PRICES.monthly.amount)} a month or ${money(PRICES.yearly.amount)} a year, and every new account gets a ${TRIAL_DAYS}-day Pro trial with no payment details. Pay with M-Pesa or card.`}
        />
      </div>
      <div className="mt-10">
        <PricingCards headingLevel={2} />
      </div>
      <section aria-labelledby="compare" className="mt-16">
        <h2 id="compare" className="text-2xl font-semibold tracking-tight text-navy">
          Free vs Pro: what’s included?
        </h2>
        <div className="prose-ff mt-5 max-w-none">
          <Table caption="Features by plan">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col" className="num">Free</th>
                <th scope="col" className="num">Pro</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([f, free, pro]) => (
                <tr key={f}>
                  <th scope="row" className="!bg-transparent font-normal !text-foreground">{f}</th>
                  <td className="num">{free ? '✓' : '—'}<span className="sr-only">{free ? 'Included' : 'Not included'}</span></td>
                  <td className="num">{pro ? '✓' : '—'}<span className="sr-only">{pro ? 'Included' : 'Not included'}</span></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </section>
      <div className="mt-16">
        <FaqSection faqs={FAQ} title="Billing questions" />
      </div>
      <JsonLd data={[webPageSchema({ title: page.title, description: page.description, path: page.path, updated: page.updated }), webApplicationSchema()]} />
    </div>
  )
}
