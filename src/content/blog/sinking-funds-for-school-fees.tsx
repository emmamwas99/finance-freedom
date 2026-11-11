import { A, Callout, Example, Ext, Formula, Prose, Table } from '@/components/marketing/prose'
import type { Article } from '@/content/types'

const YEAR: { month: string; saved: number; fees: number; balance: number }[] = [
  { month: 'January', saved: 15000, fees: 60000, balance: 15000 },
  { month: 'February', saved: 15000, fees: 0, balance: 30000 },
  { month: 'March', saved: 15000, fees: 0, balance: 45000 },
  { month: 'April', saved: 15000, fees: 0, balance: 60000 },
  { month: 'May', saved: 15000, fees: 60000, balance: 15000 },
  { month: 'June', saved: 15000, fees: 0, balance: 30000 },
  { month: 'July', saved: 15000, fees: 0, balance: 45000 },
  { month: 'August', saved: 15000, fees: 0, balance: 60000 },
  { month: 'September', saved: 15000, fees: 60000, balance: 15000 },
  { month: 'October', saved: 15000, fees: 0, balance: 30000 },
  { month: 'November', saved: 15000, fees: 0, balance: 45000 },
  { month: 'December', saved: 15000, fees: 0, balance: 60000 },
]

const FUNDS: { cost: string; amount: number; months: number }[] = [
  { cost: 'School fees (next term)', amount: 60000, months: 4 },
  { cost: 'Car insurance renewal', amount: 36000, months: 9 },
  { cost: 'Car service', amount: 12000, months: 6 },
  { cost: 'Back-to-school shopping', amount: 10000, months: 4 },
  { cost: 'Christmas travel upcountry', amount: 30000, months: 10 },
]

/** 15000 → "15,000" (deterministic, no locale data needed). */
const ksh = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const meta: Article['meta'] = {
  slug: 'sinking-funds-for-school-fees',
  title: 'Sinking funds for school fees: stop January, May and September wrecking your budget',
  seoTitle: 'Sinking funds for school fees',
  description:
    'A sinking fund sets aside a little each month for a known big cost. For school fees, divide the next term’s fees by the months left. KSh example and table.',
  summary:
    'A sinking fund is money you set aside each month for a known future cost, so it doesn’t hit one month’s budget all at once. For school fees, divide the fees due by the months left before they’re due, save that amount every month somewhere separate, and use the same method for insurance, car servicing and Christmas travel.',
  keyTakeaways: [
    'Monthly amount = upcoming total ÷ months left until it’s due.',
    'If fees are due three times a year, about four months of saving goes into each term.',
    'Starting late means a bigger monthly amount: save what you can, and plan the gap early instead of borrowing at the last minute.',
    'Keep sinking funds separate from everyday money, somewhere safe and accessible, not in investments that can fall in value.',
    'The same method works for insurance renewals, car services, back-to-school shopping and Christmas travel upcountry.',
  ],
  keywords: [
    'sinking fund',
    'what is a sinking fund',
    'how to save for school fees',
    'school fees savings plan Kenya',
    'how to budget for school fees',
    'saving for irregular expenses',
  ],
  published: '2026-11-11',
  updated: '2026-11-11',
  readingMinutes: 7,
  category: 'Saving',
  related: [
    '/calculators/savings-goal',
    '/guides/how-to-make-a-monthly-budget',
    '/guides/how-to-build-an-emergency-fund',
    '/blog/why-you-run-out-of-money-before-payday',
    '/glossary#sinking-fund',
  ],
  toc: [
    { id: 'what-is', label: 'What a sinking fund is' },
    { id: 'school-fees-problem', label: 'Why school fees wreck certain months' },
    { id: 'how-much', label: 'How much to save each month' },
    { id: 'other-costs', label: 'Other costs that need a sinking fund' },
    { id: 'where-to-keep', label: 'Where to keep the money' },
    { id: 'make-it-automatic', label: 'Making it automatic' },
  ],
  faq: [
    {
      q: 'What is the difference between a sinking fund and an emergency fund?',
      a: 'A sinking fund is for a cost you know is coming, such as school fees or an insurance renewal. An emergency fund is for surprises you can’t predict, such as a job loss or a hospital bill, so keep the two apart.',
    },
    {
      q: 'How much should I save each month for school fees?',
      a: 'Divide the fees due by the number of months you have left to save before they’re due. For example, KSh 60,000 due in four months needs KSh 15,000 a month.',
    },
    {
      q: 'Where should I keep money saved for school fees?',
      a: 'Somewhere separate from your everyday account, safe, and easy to reach by the time fees are due. Many people use a separate savings account, SACCO savings they can withdraw, or a money market fund, after checking fees, withdrawal times and that the provider is properly regulated.',
    },
    {
      q: 'What if I can’t afford the full monthly amount?',
      a: 'Save what you can and plan the gap early. Ask the school about paying in instalments before term starts and trim other spending in the months before, rather than borrowing at the last minute.',
    },
  ],
  sources: [
    { title: 'SACCO Societies Regulatory Authority (SASRA)', url: 'https://www.sasra.go.ke/', publisher: 'SASRA' },
    { title: 'Capital Markets Authority', url: 'https://www.cma.or.ke/', publisher: 'Capital Markets Authority, Kenya' },
  ],
}

export default function Body() {
  const fundsTotal = FUNDS.reduce((t, f) => t + f.amount / f.months, 0)
  return (
    <Prose>
      <h2 id="what-is">What is a sinking fund?</h2>
      <p>
        A sinking fund is money you put aside a little at a time for a cost you know is coming. When the bill arrives, the money is already there,
        so one month doesn’t have to carry the whole cost on its own.
      </p>
      <p>
        It’s different from an <A href="/guides/how-to-build-an-emergency-fund">emergency fund</A>. An emergency fund is for surprises. A sinking
        fund is for things that aren’t surprises at all: school fees, the car insurance renewal, the December trip home. They only feel like
        emergencies when nothing was set aside for them.
      </p>

      <h2 id="school-fees-problem">Why do school fees wreck January, May and September?</h2>
      <p>
        Because fees are usually due in one go at the start of each term, while your salary arrives in equal monthly amounts. For many families
        that means January, around May and around September, though exact dates vary by school and by year.
      </p>
      <p>
        January is often the hardest. December brings Christmas, travel and gifts, and some employers pay December salaries early, which makes the
        wait for January’s pay even longer. Then fees, uniforms, books and shopping all land together. If the fees come out of one month’s salary,
        rent or loan repayments get squeezed and many families turn to loans. Those repayments then eat into February and March, which is the
        pattern behind <A href="/blog/why-you-run-out-of-money-before-payday">running out of money before payday</A>.
      </p>

      <h2 id="how-much">How much should you save each month?</h2>
      <p>Divide the total that’s due by the number of months you have left to save for it.</p>
      <Formula label="Monthly amount equals upcoming total divided by months left until it is due">
        Monthly amount = upcoming total ÷ months left until it’s due
      </Formula>
      <p>
        Count only the months you can actually save in. If fees are due early in January and you’re paid at the end of each month, your September,
        October, November and December salaries can each contribute. That’s four months.
      </p>

      <h3>A full year of school fees</h3>
      <Example title="Illustrative example: KSh 60,000 a term (made-up figures)">
        <p>
          Otieno and Akinyi pay KSh 60,000 a term for two children, due in January, May and September: KSh 180,000 a year. Each term gets four
          months of saving, so the monthly amount is KSh 60,000 ÷ 4 = <strong>KSh 15,000</strong>. They start the year with KSh 60,000 already
          saved between September and December.
        </p>
        <Table caption="School-fee sinking fund over one year (illustrative, KSh)">
          <thead>
            <tr>
              <th>Month</th>
              <th className="num">Saved</th>
              <th className="num">Fees paid</th>
              <th className="num">Balance at month end</th>
            </tr>
          </thead>
          <tbody>
            {YEAR.map((r) => (
              <tr key={r.month}>
                <td>{r.month}</td>
                <td className="num">{ksh(r.saved)}</td>
                <td className="num">{r.fees ? ksh(r.fees) : '–'}</td>
                <td className="num">{ksh(r.balance)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <p>
          The fund never runs dry and every month costs the same KSh 15,000. Fee months become ordinary months, and December ends with KSh 60,000
          ready for the next January. A quick check: KSh 180,000 a year ÷ 12 months gives the same KSh 15,000.
        </p>
      </Example>

      <h3>Starting late</h3>
      <p>
        If a term is close, the same formula gives a bigger number. Suppose it’s November, nothing is saved, and KSh 60,000 is due in January. You
        have two salaries left, November’s and December’s, so KSh 60,000 ÷ 2 = KSh 30,000 a month.
      </p>
      <p>
        If that’s more than you can manage, don’t abandon the fund. Save what you can, say KSh 20,000 a month, which covers KSh 40,000. Then deal
        with the KSh 20,000 gap now, not in January: ask the school before term starts whether you can pay in instalments, and trim December
        spending. Any instalments you agree are payments too, so put them on your monthly list. Once January is behind you, switch to the steady
        amount so the May fees never need a catch-up.
      </p>

      <h2 id="other-costs">What other costs need a sinking fund?</h2>
      <p>Any cost that’s large, predictable and doesn’t come every month. List them, note when each is due, and use the same formula. Common ones include:</p>
      <ul>
        <li>
          <strong>Insurance renewals:</strong> motor, home or medical cover that renews once a year.
        </li>
        <li>
          <strong>Car servicing and tyres:</strong> you know roughly how often the car needs a service, even if not the exact date.
        </li>
        <li>
          <strong>Back-to-school costs:</strong> uniforms, shoes, books and stationery, on top of the fees.
        </li>
        <li>
          <strong>Christmas travel upcountry:</strong> fares or fuel, gifts and contributions at home in December.
        </li>
        <li>
          <strong>Annual payments:</strong> subscriptions, licences and anything else billed once a year.
        </li>
        <li>
          <strong>Celebrations you know about:</strong> weddings and other family events with a date already set.
        </li>
      </ul>

      <Example title="Illustrative example: one household’s sinking funds (made-up figures)">
        <Table caption="Monthly amount for each sinking fund (illustrative, KSh)">
          <thead>
            <tr>
              <th>Cost</th>
              <th className="num">Amount</th>
              <th className="num">Months left</th>
              <th className="num">Per month</th>
            </tr>
          </thead>
          <tbody>
            {FUNDS.map((f) => (
              <tr key={f.cost}>
                <td>{f.cost}</td>
                <td className="num">{ksh(f.amount)}</td>
                <td className="num">{f.months}</td>
                <td className="num">{ksh(f.amount / f.months)}</td>
              </tr>
            ))}
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              <td />
              <td />
              <td className="num">
                <strong>{ksh(fundsTotal)}</strong>
              </td>
            </tr>
          </tbody>
        </Table>
        <p>
          KSh {ksh(fundsTotal)} a month looks like a lot. But this household was already spending that money, just in painful lumps, often with a
          loan on top. Now it’s spread out and planned. If the total is more than you can manage, put the essentials first (fees and insurance) and
          trim the rest, such as the Christmas budget, rather than borrow.
        </p>
      </Example>

      <h2 id="where-to-keep">Where should you keep a sinking fund?</h2>
      <p>
        Keep it separate from your everyday money, somewhere safe, and where you can get it out in time for the bill. Separate, so you don’t spend
        it by accident. Safe, because the money already has a job. Accessible, because a fund you can’t withdraw until after the deadline is no use.
      </p>
      <p>Options people commonly use include:</p>
      <ul>
        <li>
          <strong>A separate savings account</strong> with no card attached, so the money is out of sight but easy to move when you need it.
        </li>
        <li>
          <strong>SACCO savings.</strong> Check which of your SACCO savings you can actually withdraw, and how quickly: deposits that back your loans
          or count towards your membership often can’t be taken out on demand. Deposit-taking SACCOs are licensed and supervised by{' '}
          <Ext href="https://www.sasra.go.ke/">SASRA</Ext>.
        </li>
        <li>
          <strong>A money market fund</strong>, a type of collective investment scheme regulated by the{' '}
          <Ext href="https://www.cma.or.ke/">Capital Markets Authority</Ext>. Withdrawals usually take a few working days, so plan around that, and
          returns aren’t guaranteed.
        </li>
      </ul>
      <p>
        Avoid putting money you’ll need within months into anything whose value can fall in the short term, such as shares. Whatever you choose,
        check the fees, how long withdrawals take and that the provider is properly licensed. This is general information, not investment advice.
      </p>
      <p>
        If several funds share one account, keep a simple note of how much belongs to each, or use separate accounts if your provider makes that
        easy.
      </p>

      <h2 id="make-it-automatic">How do you make it automatic?</h2>
      <p>
        Treat each sinking-fund contribution as a payment, just like rent. Set up a standing order for the day after payday, so the money moves
        before you can spend it. Then put the contribution on your list of payments for the month, so it’s part of what’s already spoken for, not
        something you’ll do if money is left over. For a single goal, the <A href="/calculators/savings-goal">savings goal calculator</A> works out
        the monthly amount for you.
      </p>
      <Callout tone="tip" title="Spot fee months before they arrive">
        <p>
          In Finfe you can add school fees as a payment in the months they fall due, next to a monthly payment into your fees fund. The
          outlook looks 6 to 12 months ahead and flags the heavy months, so January’s fees show up while there’s still time to prepare.{' '}
          <A href="/signup">Start free</A>.
        </p>
      </Callout>
    </Prose>
  )
}
