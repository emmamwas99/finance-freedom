import { A, Callout, Example, Formula, Prose, Steps, Table } from '@/components/marketing/prose'
import type { Article } from '@/content/types'

export const meta: Article['meta'] = {
  slug: 'why-you-run-out-of-money-before-payday',
  title: 'Why you run out of money before payday (and how to stop borrowing to get by)',
  seoTitle: 'Why you run out of money before payday',
  description:
    'Money runs out before payday when payments, big months and borrowing aren’t planned. Break the cycle with a payments-first plan and a daily allowance.',
  summary:
    'Most salaried people run out of money before payday because the month’s payments, irregular big costs and small daily spending aren’t planned before the salary lands, so the gaps get filled with loans that shrink next month’s pay. To break the cycle, list every payment first, divide what’s left by the days left, keep a small buffer, and stop borrowing for everyday costs.',
  keyTakeaways: [
    'Borrowing to reach payday creates a loop: each repayment comes out of next month’s salary, so the next gap arrives sooner.',
    'Irregular big months, such as school-fee months, Christmas and insurance renewals, cause many shortfalls. Plan for them months ahead.',
    'List every payment due before your salary arrives, then work out what’s left after payments.',
    'A daily allowance (what’s left ÷ days left) turns a monthly budget into one simple number you can check every day.',
    'A small buffer and a set monthly amount for family support let you handle surprises without a loan.',
  ],
  keywords: [
    'run out of money before payday',
    'broke before end of month',
    'how to stop borrowing to get to payday',
    'payday to payday Kenya',
    'salary finishes before month end',
    'how to make salary last the whole month',
  ],
  published: '2026-11-11',
  updated: '2026-11-11',
  readingMinutes: 9,
  category: 'Budgeting',
  related: [
    '/guides/how-to-make-a-monthly-budget',
    '/blog/true-cost-of-mobile-loans',
    '/guides/how-to-build-an-emergency-fund',
    '/calculators/budget',
    '/blog/sinking-funds-for-school-fees',
  ],
  toc: [
    { id: 'why', label: 'Why money runs out' },
    { id: 'the-cycle', label: 'The payday-to-payday cycle' },
    { id: 'causes', label: 'What causes the shortfall' },
    { id: 'break-the-cycle', label: 'How to break the cycle' },
    { id: 'daily-allowance', label: 'Working out a daily allowance' },
    { id: 'big-months', label: 'School-fee months and other big months' },
    { id: 'pay-rise', label: 'What to do with a pay rise' },
    { id: 'already-borrowing', label: 'If you already borrow every month' },
  ],
  faq: [
    {
      q: 'Why is my salary finished by the middle of the month?',
      a: 'Usually because the big payments go out in the first week and the rest is spent with no daily limit. Listing every payment first, then dividing what’s left by the days left, shows how much you can spend each day so the money lasts.',
    },
    {
      q: 'Is it okay to use a mobile loan to get to payday?',
      a: 'An occasional emergency loan that you repay in full is one thing, but borrowing every month is a warning sign. Each repayment comes out of next month’s salary, which makes the next gap bigger and brings it sooner.',
    },
    {
      q: 'How big should my buffer be?',
      a: 'Start with something reachable, such as one week of everyday spending, so a late salary or a small surprise doesn’t force you to borrow. Then grow it towards a full emergency fund of several months of essential costs.',
    },
    {
      q: 'How do I say no to family requests without guilt?',
      a: 'Decide in advance how much you can give each month and put it in your plan as a payment. When it’s used up, offer a smaller amount, a later date or help that isn’t money, so you can keep helping without borrowing.',
    },
  ],
}

export default function Body() {
  return (
    <Prose>
      <h2 id="why">Why does money run out before payday?</h2>
      <p>
        Money usually runs out before payday because nothing was planned before the salary arrived. The big payments go out in the first week, the
        rest feels like plenty, and by the third week there’s nothing left for the last ten days. The gap gets filled with a loan, and that loan is
        repaid from next month’s salary.
      </p>
      <p>It’s rarely about one bad decision. It’s a pattern, and a pattern can be changed once you can see it.</p>

      <h2 id="the-cycle">How does the payday-to-payday cycle work?</h2>
      <p>The cycle follows the same steps every month:</p>
      <ol>
        <li>
          <strong>Salary lands.</strong> Rent, loan instalments, the house help and the chama are paid in the first few days.
        </li>
        <li>
          <strong>The balance looks healthy.</strong> With no daily limit, spending in the first two weeks runs at a pace the month can’t sustain.
        </li>
        <li>
          <strong>A gap opens.</strong> Somewhere around the 20th, the money runs out, or a cost you didn’t plan for lands.
        </li>
        <li>
          <strong>You borrow.</strong> A mobile loan, an overdraft, a salary advance or a friend covers the gap.
        </li>
        <li>
          <strong>Next month starts smaller.</strong> The repayment, plus fees, comes out of the next salary. There’s less to live on, so the gap
          arrives earlier.
        </li>
      </ol>
      <p>Step five is what turns one bad month into a loop. Each round of borrowing makes the next one more likely.</p>

      <h2 id="causes">What causes the shortfall?</h2>
      <p>Five things cause most shortfalls for salaried people. Most households have at least two of them at once.</p>

      <h3>1. Irregular “big” months</h3>
      <p>
        Some costs don’t come every month, so they’re easy to forget until they arrive. School fees at the start of each term, back-to-school
        shopping, an insurance renewal, a car service, a wedding contribution or Christmas travel upcountry can each swallow a large part of a
        salary. If you budget as if every month were an ordinary month, the big ones will keep catching you out. A{' '}
        <A href="/blog/sinking-funds-for-school-fees">sinking fund</A> spreads these costs across the months before them.
      </p>

      <h3>2. Family and friends asking for help</h3>
      <p>
        Supporting parents, siblings and relatives is part of life for many Kenyans, and it matters. The problem isn’t helping. It’s helping with
        money that was already meant for rent or food, with no limit, and then borrowing to fill the hole it leaves.
      </p>

      <h3>3. Lifestyle creep</h3>
      <p>
        When pay rises, spending tends to rise with it: a bigger house, a car, more eating out, a more expensive school. Each step feels small and
        reasonable. After a few raises you earn far more than you used to, yet you still run out before payday. This is{' '}
        <A href="/glossary#lifestyle-inflation">lifestyle inflation</A>.
      </p>

      <h3>4. Small daily spending with no limit</h3>
      <p>
        Lunch, matatu fare or fuel, airtime and data, a snack, transaction charges. None of it feels like real spending, and it rarely gets written
        down. Across a month it can add up to a surprising amount. Tracking it for even a few weeks usually shows where the money goes: see{' '}
        <A href="/guides/how-to-track-expenses">how to track expenses</A>.
      </p>

      <h3>5. Borrowing to cover gaps</h3>
      <p>
        This is the one that keeps the cycle turning. Short-term loans feel cheap because the fee looks small, but over a year they can cost a great
        deal. We show how to work out the real figure in <A href="/blog/true-cost-of-mobile-loans">the true cost of mobile loans</A>. Worse, every
        repayment shrinks next month before it has even started.
      </p>

      <Example title="Illustrative example: how a KSh 8,000 gap grows">
        <p>
          Wanjiru takes home KSh 85,000. Her monthly payments are rent KSh 22,000, a SACCO loan KSh 12,000, house help KSh 8,000, chama KSh 5,000
          and school transport KSh 4,000: KSh 51,000 in total. That leaves KSh 34,000 for everything else.
        </p>
        <p>
          Food and household items, transport, airtime, lunches and small treats come to about KSh 37,000. Then her brother needs KSh 5,000 for a
          hospital bill. She is KSh 8,000 short, so she borrows it on her phone and has to repay KSh 8,800 next month.
        </p>
        <Table caption="Wanjiru’s two months (illustrative figures)">
          <thead>
            <tr>
              <th>KSh</th>
              <th className="num">Month 1</th>
              <th className="num">Month 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Net pay</td>
              <td className="num">85,000</td>
              <td className="num">85,000</td>
            </tr>
            <tr>
              <td>Regular payments</td>
              <td className="num">51,000</td>
              <td className="num">51,000</td>
            </tr>
            <tr>
              <td>Loan repayment</td>
              <td className="num">0</td>
              <td className="num">8,800</td>
            </tr>
            <tr>
              <td>
                <strong>Left after payments</strong>
              </td>
              <td className="num">
                <strong>34,000</strong>
              </td>
              <td className="num">
                <strong>25,200</strong>
              </td>
            </tr>
            <tr>
              <td>Everyday spending</td>
              <td className="num">37,000</td>
              <td className="num">37,000</td>
            </tr>
            <tr>
              <td>Family emergency</td>
              <td className="num">5,000</td>
              <td className="num">0</td>
            </tr>
            <tr>
              <td>
                <strong>Short by</strong>
              </td>
              <td className="num">
                <strong>8,000</strong>
              </td>
              <td className="num">
                <strong>11,800</strong>
              </td>
            </tr>
          </tbody>
        </Table>
        <p>
          With no emergency at all in month 2, the gap is bigger, because the repayment came off the top. Without a change, she borrows again, and
          earlier. (Names and figures are made up to show the pattern. The loan cost is not any lender’s actual fee.)
        </p>
      </Example>

      <h2 id="break-the-cycle">How do you break the cycle?</h2>
      <p>
        You break the cycle by deciding where the salary goes before it lands, giving yourself a daily limit, and building a small cushion so the
        next surprise doesn’t need a loan. The steps work best together.
      </p>
      <Steps
        items={[
          {
            title: 'Plan your payments before the salary lands',
            body: (
              <>
                A day or two before payday, list every payment due this month: rent, loan instalments, school fees, house help, chama, insurance,
                utilities, and any repayment left over from last month. Include the irregular costs that fall this month. Add them up. This is the
                money that’s already spoken for.
              </>
            ),
          },
          {
            title: 'Work out what’s left after payments',
            body: (
              <>
                <strong>Net pay − payments = what’s left after payments.</strong> This is the real amount you have for food, transport and everything
                else. If it’s smaller than you expected, it’s far better to find out on the 1st than on the 20th.
              </>
            ),
          },
          {
            title: 'Turn it into a daily allowance',
            body: (
              <>
                Divide what’s left by the days until your next salary. Check it every few days and recalculate. If you overspend one weekend, the
                daily number drops for the rest of the month. That drop is your early warning.
              </>
            ),
          },
          {
            title: 'Build a small buffer',
            body: (
              <>
                Aim first for about one week of everyday spending, kept in a separate place. It covers a late salary or a small surprise, so you
                don’t have to borrow. Later, grow it into a full <A href="/guides/how-to-build-an-emergency-fund">emergency fund</A>.
              </>
            ),
          },
          {
            title: 'Say no, with a plan',
            body: (
              <>
                Put a fixed amount for family support on your list of monthly payments. When a request comes, you know what you can give. If that
                amount is used up, offer a smaller sum, a later date, or help that isn’t cash. “I can send KSh 2,000 now and more after payday” is
                still a yes.
              </>
            ),
          },
          {
            title: 'Stop new borrowing for everyday costs',
            body: (
              <>
                Treat each existing loan as a payment to clear, and don’t take a new loan to repay an old one. Once a loan is cleared, keep paying
                the same amount, but into your buffer.
              </>
            ),
          },
        ]}
      />

      <h2 id="daily-allowance">How do you work out a daily allowance?</h2>
      <p>Divide the money you have left for everyday spending by the number of days until your next salary, counting today.</p>
      <Formula label="Daily allowance equals what is left divided by days left until payday">Daily allowance = what’s left ÷ days left until payday</Formula>
      <Example title="Illustrative example: a daily allowance that adjusts">
        <p>
          On the 1st, Wanjiru has KSh 34,000 left after payments and 30 days to go: KSh 34,000 ÷ 30 ≈ <strong>KSh 1,130 a day</strong>.
        </p>
        <p>
          By the morning of the 12th she has spent KSh 15,000, not the roughly KSh 12,400 that 11 days at her allowance would have used. She has KSh
          19,000 left for 19 days: <strong>KSh 1,000 a day</strong>. The lower number tells her to ease off now, while there are still 19 days to
          put it right, instead of finding out on the 25th.
        </p>
      </Example>
      <p>
        The daily allowance covers everyday spending only. Your payments are already set aside, so the allowance never has to stretch to cover rent
        or a loan instalment.
      </p>

      <h2 id="big-months">How do you handle school-fee months and other big months?</h2>
      <p>
        Look ahead, not just at this month. Write down every large cost due in the next six to twelve months, then set aside a share each month so
        the money is ready when the bill arrives.
      </p>
      <p>
        For example, KSh 30,000 of school fees due in three months means putting aside KSh 10,000 a month, starting now. That’s a payment like any
        other, and it goes on the list before the salary lands. The full method is in{' '}
        <A href="/blog/sinking-funds-for-school-fees">sinking funds for school fees</A>.
      </p>
      <Callout tone="tip" title="See your heavy months coming">
        <p>
          Finfe’s monthly plan starts with your payments and shows what’s left after them. Its outlook looks 6 to 12 months ahead and
          flags the heavy months, such as school-fee months, before they arrive. You can <A href="/signup">start free</A>, or try your numbers
          first with the <A href="/calculators/budget">budget calculator</A>.
        </p>
      </Callout>

      <h2 id="pay-rise">What should you do with a pay rise?</h2>
      <p>
        Decide where it goes before it lands. A simple rule is to split the increase: half to savings or debt, half to enjoy. If your take-home pay
        rises by KSh 10,000, KSh 5,000 can go to clearing a loan or building your buffer, and you still feel the raise. This is how you get ahead
        without feeling deprived, and it’s the idea behind <A href="/blog/pay-yourself-first">paying yourself first</A>.
      </p>

      <h2 id="already-borrowing">What if you’re already borrowing every month?</h2>
      <p>
        Start by listing every loan you have, with what you owe and when it’s due. Add the repayments to next month’s list of payments, even if it
        makes what’s left look painfully small. For a month or two, cut back wherever you can, so you can repay without borrowing again.
      </p>
      <p>
        If you have several loans, put any extra money on the most expensive one first. Our guide on{' '}
        <A href="/guides/how-to-get-out-of-debt">how to get out of debt</A> walks through it, and the{' '}
        <A href="/calculators/debt-payoff">debt payoff calculator</A> shows a debt-free date for your own numbers. If you can’t keep up with a
        repayment, talk to the lender before you miss it, not after.
      </p>
    </Prose>
  )
}
