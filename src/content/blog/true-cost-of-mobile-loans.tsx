import { A, Callout, Example, Ext, Formula, Prose, Steps, Table } from '@/components/marketing/prose'
import type { Article } from '@/content/types'

export const meta: Article['meta'] = {
  slug: 'true-cost-of-mobile-loans',
  title: 'The true cost of mobile loans and overdrafts: how to work it out',
  seoTitle: 'True cost of mobile loans and overdrafts',
  description:
    'Work out what a mobile loan or overdraft really costs: total repaid minus amount borrowed, as a percentage, then scaled to a year. Simple steps, KSh examples.',
  summary:
    'The true cost of a mobile loan or overdraft is the total you repay minus the amount you borrowed. Divide that by the amount borrowed to get the cost for the period, then scale it to a year: because these loans are so short, a fee that looks small often works out to a very high yearly rate.',
  keyTakeaways: [
    'Total cost = total repaid − amount borrowed. Count every fee and charge, not just the “interest”.',
    'Cost for the period (%) = total cost ÷ amount borrowed × 100.',
    'To compare with other loans, scale it to a year: cost for the period × (365 ÷ days borrowed). Short loans with small fees often come out well above 100% a year.',
    'Fees and terms change, so check a lender’s current terms before you borrow, and only use lenders licensed by the Central Bank of Kenya.',
    'If you’re borrowing to repay other loans, stop new borrowing, list every debt and clear the most expensive first.',
  ],
  keywords: [
    'true cost of mobile loans',
    'mobile loan interest Kenya',
    'how to calculate the cost of a loan',
    'mobile overdraft charges',
    'annualised interest rate',
    'digital loans Kenya',
    'how to stop borrowing from loan apps',
  ],
  published: '2026-11-11',
  updated: '2026-11-11',
  readingMinutes: 8,
  category: 'Debt',
  related: [
    '/debt-management',
    '/guides/how-to-get-out-of-debt',
    '/calculators/debt-payoff',
    '/blog/why-you-run-out-of-money-before-payday',
    '/guides/debt-avalanche-vs-snowball',
    '/glossary#annual-percentage-rate',
  ],
  toc: [
    { id: 'why-it-matters', label: 'Why work out the true cost' },
    { id: 'the-method', label: 'How to calculate the cost' },
    { id: 'why-short-loans-cost-more', label: 'Why small fees on short loans are expensive' },
    { id: 'monthly-habit', label: 'What borrowing every month costs' },
    { id: 'before-you-borrow', label: 'What to check before you borrow' },
    { id: 'borrowing-loop', label: 'If you’re already in a borrowing loop' },
  ],
  faq: [
    {
      q: 'How do I calculate the cost of a mobile loan?',
      a: 'Subtract the amount you borrowed from the total you repay, including every fee. Divide that cost by the amount borrowed and multiply by 100 to get the cost as a percentage for the loan period.',
    },
    {
      q: 'Why is a small fee on a short loan so expensive?',
      a: 'Because the fee pays for only a few days of borrowing. Paying 5% to borrow for 10 days is like paying that 5% about 36 times in a year, which is roughly 180% a year before any compounding.',
    },
    {
      q: 'How do I know if a digital lender is licensed in Kenya?',
      a: 'The Central Bank of Kenya licenses digital credit providers and publishes the list of licensed lenders on its website. Check the list, and read the lender’s current fees and terms, before you borrow.',
    },
    {
      q: 'Should I take a new loan to repay an old one?',
      a: 'Usually not, because you pay a fresh set of fees and the debt doesn’t shrink. Cut spending for a month or two, list your debts, and if you can’t make a payment, talk to the lender early about a repayment plan.',
    },
  ],
  sources: [{ title: 'Central Bank of Kenya', url: 'https://www.centralbank.go.ke/', publisher: 'Central Bank of Kenya' }],
}

export default function Body() {
  return (
    <Prose>
      <Callout tone="warn" title="About the numbers on this page">
        <p>
          Every figure below is made up, using round numbers to show the method. None of them are any provider’s actual fees or rates, which change
          over time. Always check a lender’s current terms before you borrow.
        </p>
      </Callout>

      <h2 id="why-it-matters">Why work out the true cost?</h2>
      <p>
        Because short-term credit is priced in a way that makes it look cheaper than it is. A loan app or an overdraft on your mobile money line
        rarely shows a yearly rate. You see a one-off fee, a daily charge or a percentage for 30 days instead. Those small numbers are hard to
        compare with a SACCO or bank loan, which is usually quoted per year.
      </p>
      <p>
        Working out the true cost takes three short sums. After you’ve done it a couple of times, you can do it in your head before you tap
        “accept”.
      </p>

      <h2 id="the-method">How do you calculate the cost of a loan?</h2>
      <p>
        Take everything you repay, subtract what you actually received, and express the difference as a percentage: first for the loan period, then
        for a year.
      </p>
      <Formula label="Total cost equals total repaid minus amount borrowed. Cost for the period in percent equals total cost divided by amount borrowed times 100. Rough yearly rate equals cost for the period times 365 divided by days borrowed.">
        Total cost = total repaid − amount borrowed
        <br />
        Cost for the period (%) = total cost ÷ amount borrowed × 100
        <br />
        Rough yearly rate (%) = cost for the period × (365 ÷ days borrowed)
      </Formula>

      <h3>Step 1: count every shilling you repay</h3>
      <p>
        Include the interest, any access, facilitation or processing fee, daily charges, taxes added to the fees, and any late-payment penalty. If a
        fee was taken off before the money reached you, the amount borrowed is what you actually received, not the headline figure. Borrowing KSh
        10,000 with KSh 500 deducted upfront means you borrowed KSh 9,500.
      </p>

      <h3>Step 2: turn it into a percentage for the period</h3>
      <p>Divide the total cost by the amount borrowed and multiply by 100. This is what the loan cost you for the time you had the money.</p>

      <h3>Step 3: scale it to a year</h3>
      <p>
        Multiply by the number of periods of that length in a year. A 10-day loan fits into a year 36.5 times; a 30-day loan about 12 times. The
        result is a rough yearly rate you can compare with a bank or SACCO loan, much like an{' '}
        <A href="/glossary#annual-percentage-rate">annual percentage rate</A>. It’s a simple figure with no compounding, so if you borrow again and
        again, the real yearly cost is higher still.
      </p>

      <Example title="Illustrative example: a short app loan (made-up numbers)">
        <p>
          You borrow <strong>KSh 2,000</strong> on your phone and repay <strong>KSh 2,100</strong> ten days later.
        </p>
        <ul>
          <li>
            Total cost: KSh 2,100 − KSh 2,000 = <strong>KSh 100</strong>
          </li>
          <li>
            Cost for the period: 100 ÷ 2,000 × 100 = <strong>5% for 10 days</strong>
          </li>
          <li>
            Rough yearly rate: 5% × (365 ÷ 10) = <strong>about 183% a year</strong>
          </li>
        </ul>
        <p>KSh 100 feels like nothing. As a yearly rate, it’s far above what a typical bank or SACCO loan charges.</p>
      </Example>

      <h2 id="why-short-loans-cost-more">Why is a small fee on a short loan so expensive?</h2>
      <p>
        Because the fee buys you the money for only a few days. The shorter the loan, the more times that fee would be paid over a year. The same
        KSh 100 fee on KSh 2,000 means very different things depending on how long you keep the money:
      </p>
      <Table caption="The same KSh 100 fee on KSh 2,000, by loan length (illustrative)">
        <thead>
          <tr>
            <th>Loan length</th>
            <th className="num">Cost for the period</th>
            <th className="num">Rough yearly rate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>7 days</td>
            <td className="num">5%</td>
            <td className="num">about 261%</td>
          </tr>
          <tr>
            <td>10 days</td>
            <td className="num">5%</td>
            <td className="num">about 183%</td>
          </tr>
          <tr>
            <td>30 days</td>
            <td className="num">5%</td>
            <td className="num">about 61%</td>
          </tr>
          <tr>
            <td>1 year</td>
            <td className="num">5%</td>
            <td className="num">5%</td>
          </tr>
        </tbody>
      </Table>
      <p>
        The same logic explains why daily charges can look cheap per day and still be costly. A small charge every day for three weeks adds up, and
        the longer the balance stays unpaid, the more you pay.
      </p>

      <Example title="Illustrative example: an overdraft with daily charges (made-up numbers)">
        <p>
          You go KSh 1,000 into an overdraft on your mobile money line. Suppose there’s a one-off access fee of KSh 10 and a daily charge of KSh 10
          while the balance is unpaid, and you clear it after 15 days.
        </p>
        <ul>
          <li>Total repaid: KSh 1,000 + KSh 10 + (15 × KSh 10) = KSh 1,160</li>
          <li>
            Total cost: <strong>KSh 160</strong>, which is <strong>16% for 15 days</strong>
          </li>
          <li>
            Rough yearly rate: 16% × (365 ÷ 15) ≈ <strong>389% a year</strong>
          </li>
        </ul>
        <p>
          Clear the same overdraft in 3 days and the cost is KSh 40, or 4%. With this kind of pricing, how fast you repay matters as much as how
          much you borrow.
        </p>
      </Example>

      <h2 id="monthly-habit">What does borrowing every month cost over a year?</h2>
      <p>
        Add up the fees on every loan and overdraft you took in the last 12 months. That total is the price you paid to have part of your own
        salary a few days or weeks early.
      </p>
      <Example title="Illustrative example: the cost of a monthly habit (made-up numbers)">
        <p>Every month around the 20th, you borrow KSh 5,000 and repay KSh 5,375 on payday. Each loan costs KSh 375.</p>
        <p>
          Over 12 months that’s 12 × KSh 375 = <strong>KSh 4,500</strong> in fees, and you still start every month KSh 5,375 down. If the same KSh
          4,500 went into a buffer instead, within a year you’d have close to the amount you keep borrowing.
        </p>
      </Example>
      <p>
        This is how a “small” loan becomes part of the cycle described in{' '}
        <A href="/blog/why-you-run-out-of-money-before-payday">why you run out of money before payday</A>: each repayment shrinks the next month,
        so the next loan comes sooner.
      </p>

      <h2 id="before-you-borrow">What should you check before you borrow?</h2>
      <p>Check five things: who the lender is, the current terms, the yearly cost, whether next month can carry the repayment, and the effect on your credit record.</p>
      <ul>
        <li>
          <strong>Is the lender licensed?</strong> In Kenya, digital lenders that aren’t banks must be licensed by the{' '}
          <Ext href="https://www.centralbank.go.ke/">Central Bank of Kenya</Ext>, which publishes the list of licensed digital credit providers on
          its website. If an app isn’t on the list, don’t use it.
        </li>
        <li>
          <strong>What are the current terms?</strong> Read the total you’ll repay, every fee, the due date and what happens if you’re late. Terms
          change, so check each time you borrow, not just the first time.
        </li>
        <li>
          <strong>What does it cost as a yearly rate?</strong> Use the three steps above, then compare it with your other options, such as a SACCO
          loan, a salary advance from your employer, or agreeing a later date with someone you owe.
        </li>
        <li>
          <strong>Can next month carry the repayment?</strong> Put the repayment on next month’s list of payments now and check what’s left after
          payments. If that doesn’t cover your essentials, this loan will probably lead to another one.
        </li>
        <li>
          <strong>What happens to your credit record?</strong> Lenders share repayment information with{' '}
          <A href="/glossary#credit-reference-bureau">credit reference bureaus</A>. Late or missed payments can make borrowing harder or more
          expensive later.
        </li>
      </ul>

      <h2 id="borrowing-loop">What should you do if you’re already in a borrowing loop?</h2>
      <p>
        Stop adding new debt first, then clear what you owe one loan at a time, most expensive first. It takes a few tight months, but every loan
        you clear frees money in every month after it.
      </p>
      <Steps
        items={[
          {
            title: 'List every loan',
            body: (
              <>
                Write down each app loan, overdraft, salary advance and personal debt, with the amount owed, the due date and the cost worked out as
                above. Seeing the total in one place is uncomfortable, and it’s the most useful thing you’ll do.
              </>
            ),
          },
          {
            title: 'Stop borrowing to repay borrowing',
            body: (
              <>
                A new loan to clear an old one adds a fresh set of fees and doesn’t reduce what you owe. If your provider lets you lower or switch off
                an overdraft limit, consider doing that while you recover.
              </>
            ),
          },
          {
            title: 'Make repayments the first payments of the month',
            body: (
              <>
                Before your salary lands, list each repayment as a payment, next to rent and school fees. What’s left after payments is what you
                live on. For a month or two, cut back hard so you can repay without borrowing again.
              </>
            ),
          },
          {
            title: 'Clear the most expensive loan first',
            body: (
              <>
                Pay what’s due on everything, and put any extra on the loan with the highest yearly rate. This is the{' '}
                <A href="/glossary#debt-avalanche">debt avalanche</A>. If you need a quick win to stay motivated, clearing the smallest balance
                first, the <A href="/glossary#debt-snowball">debt snowball</A>, also works. Compare them in{' '}
                <A href="/guides/debt-avalanche-vs-snowball">debt avalanche vs snowball</A>.
              </>
            ),
          },
          {
            title: 'Talk to lenders early',
            body: (
              <>
                If you can’t pay on time, contact the lender before the due date and ask about a repayment plan. It’s usually easier to agree
                something before a payment is missed than after.
              </>
            ),
          },
          {
            title: 'Turn each cleared loan into a buffer',
            body: (
              <>
                When a loan is gone, keep paying the same amount, but into a separate buffer. Even one week of everyday spending in reserve can
                break the habit of borrowing around the 20th.
              </>
            ),
          },
        ]}
      />
      <p>
        For the full plan, read <A href="/guides/how-to-get-out-of-debt">how to get out of debt</A>.
      </p>
      <Callout tone="tip" title="Keep borrowed money separate from income">
        <p>
          In Finfe, money you borrow is recorded as borrowed, not as income, so you can see when a month only balanced because of a loan.
          Each loan gets a debt-free date, and the Pro “pay extra” simulator shows how much sooner you’d be clear by adding a little each month.{' '}
          <A href="/signup">Start free</A>, or try your numbers in the <A href="/calculators/debt-payoff">debt payoff calculator</A>.
        </p>
      </Callout>
    </Prose>
  )
}
