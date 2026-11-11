import { A, Callout, Example, Ext, Prose, Steps, Table } from '@/components/marketing/prose'
import type { Article } from '@/content/types'

export const meta: Article['meta'] = {
  slug: 'pay-yourself-first',
  title: 'Pay yourself first: save on payday, not at the end of the month',
  seoTitle: 'Pay yourself first: how it works',
  description:
    'Pay yourself first means moving savings out the day your salary arrives, before you spend. How it works, how much to start with, and how it fits with debt.',
  summary:
    'Paying yourself first means moving a set amount into savings, or into your side business, on the day your salary arrives, before you spend anything else. It works because it doesn’t rely on willpower: start with as little as 5% of your take-home pay, automate it with a standing order, and raise it towards 10% or more over time.',
  keyTakeaways: [
    'Save at the start of the month, not with whatever is left at the end, because for most people nothing is left.',
    'Start with an amount you can keep up, even 5% of take-home pay, and raise it with each pay rise.',
    'Automate it with a standing order or payroll deduction for the day after payday.',
    'If you have debt, build a small emergency buffer first, then clear high-cost debt, then grow your savings.',
    'If paying yourself first leaves you borrowing at month-end, the amount is too high. Lower it until it’s sustainable.',
  ],
  keywords: [
    'pay yourself first',
    'how to save money from salary',
    'how much of my salary should I save',
    'saving on payday',
    'standing order savings',
    'how to start saving in Kenya',
  ],
  published: '2026-11-11',
  updated: '2026-11-11',
  readingMinutes: 7,
  category: 'Saving',
  related: [
    '/calculators/savings-goal',
    '/guides/how-to-build-an-emergency-fund',
    '/guides/how-to-get-out-of-debt',
    '/saving-money',
    '/blog/sinking-funds-for-school-fees',
  ],
  toc: [
    { id: 'what-it-means', label: 'What it means' },
    { id: 'why-it-works', label: 'Why it works' },
    { id: 'how-much', label: 'How much to start with' },
    { id: 'automate', label: 'How to automate it' },
    { id: 'debt', label: 'Paying yourself first when you have debt' },
    { id: 'irregular', label: 'If your income changes' },
  ],
  faq: [
    {
      q: 'What does pay yourself first mean?',
      a: 'It means treating your savings as the first payment of the month. On payday, before rent, shopping or anything else, a set amount moves to savings or investment, and you live on the rest.',
    },
    {
      q: 'How much should I pay myself first?',
      a: 'Start with an amount you can keep up every month, even 5% of your take-home pay. Increase it by a percentage point every few months, or with each pay rise, working towards 10% or more.',
    },
    {
      q: 'Should I pay myself first if I have debt?',
      a: 'Yes, but point the money at the right job. Build a small emergency buffer first, then put the money towards high-cost debt, then grow your savings once the expensive debt is gone.',
    },
    {
      q: 'Does pay yourself first work with an irregular income?',
      a: 'Yes. Use a percentage instead of a fixed amount, and move it out each time money comes in, so the habit stays the same even when the amount changes.',
    },
  ],
  sources: [
    { title: 'SACCO Societies Regulatory Authority (SASRA)', url: 'https://www.sasra.go.ke/', publisher: 'SASRA' },
    { title: 'Capital Markets Authority', url: 'https://www.cma.or.ke/', publisher: 'Capital Markets Authority, Kenya' },
  ],
}

export default function Body() {
  return (
    <Prose>
      <h2 id="what-it-means">What does “pay yourself first” mean?</h2>
      <p>
        Paying yourself first means your savings are the first payment of the month. On payday, before rent, shopping or anything else, a set
        amount moves out of your main account into savings or an investment. You then live on what remains.
      </p>
      <p>
        Most people do it the other way round. They pay the bills, spend through the month and plan to save whatever is left. For most salaried
        people nothing is left, and the plan quietly fails again.
      </p>
      <p>
        “Yourself” doesn’t only mean a savings account. If you’re building a shop, a kiosk or a side business, the money you move into it on payday
        counts too. What matters is that it leaves your spending money before you have a chance to spend it.
      </p>

      <h2 id="why-it-works">Why does paying yourself first work?</h2>
      <p>
        It works because it takes willpower out of the equation. You decide once, set it up, and the saving happens without you having to choose it
        again every month.
      </p>
      <ul>
        <li>
          <strong>Spending expands to fit what’s available.</strong> Whatever sits in your main account tends to get spent. Money that isn’t there
          doesn’t.
        </li>
        <li>
          <strong>You make one decision, not thirty.</strong> Saving “what’s left” means resisting temptation every single day. Paying yourself
          first means deciding once, on payday, while you’re calm and the whole month is ahead of you.
        </li>
        <li>
          <strong>You adjust to the smaller amount.</strong> After a month or two, you plan around the money you actually have. Many people find
          they don’t miss a small amount saved this way.
        </li>
      </ul>

      <h2 id="how-much">How much should you pay yourself first?</h2>
      <p>
        Start with an amount you can keep up every month, even if it feels small. 5% of take-home pay is a sensible start. Build towards 10% or
        more as debts are cleared and your pay rises.
      </p>
      <p>
        Consistency beats size. A small amount saved every month builds both the habit and the balance. A big amount you abandon in March builds
        neither.
      </p>
      <Example title="Illustrative example: starting at 5% and building up">
        <p>Achieng takes home KSh 60,000 a month.</p>
        <Table caption="Paying yourself first on KSh 60,000 net pay (illustrative)">
          <thead>
            <tr>
              <th>Share of pay</th>
              <th className="num">Each month (KSh)</th>
              <th className="num">After 12 months (KSh)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>5%</td>
              <td className="num">3,000</td>
              <td className="num">36,000</td>
            </tr>
            <tr>
              <td>8%</td>
              <td className="num">4,800</td>
              <td className="num">57,600</td>
            </tr>
            <tr>
              <td>10%</td>
              <td className="num">6,000</td>
              <td className="num">72,000</td>
            </tr>
            <tr>
              <td>15%</td>
              <td className="num">9,000</td>
              <td className="num">108,000</td>
            </tr>
          </tbody>
        </Table>
        <p>
          She starts at 5%, or KSh 3,000. Every three months she adds one percentage point, about KSh 600 more. By the end of the year she’s at 8%
          and barely noticed the steps. These totals leave out any interest or returns, which would add to them.
        </p>
      </Example>
      <p>
        Your <A href="/glossary#savings-rate">savings rate</A> is simply what you save divided by what you earn. Watching it creep up is a better
        measure of progress than any single balance.
      </p>

      <h3>Use your pay rises</h3>
      <p>
        The easiest time to save more is when you get a raise, before you’ve got used to the extra money. A simple rule: send at least half of
        every increase to savings. If your take-home pay rises by KSh 8,000, raise your standing order by KSh 4,000. You still feel the raise, and
        you avoid <A href="/glossary#lifestyle-inflation">lifestyle inflation</A>.
      </p>

      <h2 id="automate">How do you automate it?</h2>
      <p>Set it up once so it happens without you. By the time you check your balance on payday, the saving should already have gone.</p>
      <Steps
        items={[
          {
            title: 'Choose where the money goes',
            body: (
              <>
                A separate savings account, SACCO deposits, a money market fund, or your business account. Keep it apart from your everyday
                account, ideally with no card attached.
              </>
            ),
          },
          {
            title: 'Set a standing order for the day after payday',
            body: (
              <>
                Ask your bank to move the amount automatically every month. Setting it for the day after your salary usually lands gives you a
                little room if pay is a day late.
              </>
            ),
          },
          {
            title: 'Or use a payroll deduction',
            body: (
              <>
                Many employers can deduct SACCO contributions straight from your salary through check-off, so the money never reaches your account
                at all. Ask HR or payroll.
              </>
            ),
          },
          {
            title: 'Put it on your list of monthly payments',
            body: (
              <>
                List the transfer as a payment for the month, next to rent and loan instalments. Then what’s left after payments already accounts
                for it, and you won’t plan to spend it by mistake.
              </>
            ),
          },
          {
            title: 'Review every few months',
            body: <>Raise the amount after a pay rise or when a loan is cleared. Lower it if you find yourself borrowing at month-end.</>,
          },
        ]}
      />

      <h3>Where to put it</h3>
      <p>
        Choose a home that matches what the money is for. Emergency money needs to be reachable within days. Longer-term savings can sit where
        withdrawing is slower. If you use a SACCO, check whether it’s a deposit-taking SACCO licensed by{' '}
        <Ext href="https://www.sasra.go.ke/">SASRA</Ext>, and understand which of your savings you can withdraw, and when. Money market funds are
        collective investment schemes regulated by the <Ext href="https://www.cma.or.ke/">Capital Markets Authority</Ext>; returns aren’t
        guaranteed and withdrawals usually take a few working days. Compare fees and access before you choose. This is general information, not
        investment advice.
      </p>

      <h3>For a shop or side business</h3>
      <p>
        If your goal is to grow a business, pay it first too. Decide a fixed monthly amount for stock or equipment, move it to a separate business
        account or till on payday, and keep business and household money apart. Mixing them makes it hard to tell whether the business is actually
        making money, and easy to spend the stock money on household costs.
      </p>

      <h2 id="debt">How does paying yourself first fit with paying off debt?</h2>
      <p>
        It still applies when you have debt, but the money does different jobs in order: a small emergency buffer first, then high-cost debt, then
        growing your savings.
      </p>
      <ol>
        <li>
          <strong>A small emergency buffer.</strong> Without one, the next surprise goes on a mobile loan and undoes your progress. Aim for
          something modest first, such as one month of essential costs, or a smaller round figure to begin with.
        </li>
        <li>
          <strong>High-cost debt.</strong> Next, point your pay-yourself-first money at expensive debt, such as mobile loans, overdrafts and credit
          cards. Earning a modest return on savings while paying a much higher rate on debt usually leaves you behind. Clear the most expensive
          first: see <A href="/guides/how-to-get-out-of-debt">how to get out of debt</A>, and{' '}
          <A href="/blog/true-cost-of-mobile-loans">how to work out what a mobile loan really costs</A>.
        </li>
        <li>
          <strong>Grow your savings.</strong> Once the expensive debt is gone, build a full{' '}
          <A href="/guides/how-to-build-an-emergency-fund">emergency fund</A>, then longer-term savings and investments.
        </li>
      </ol>
      <Example title="Illustrative example: turning a loan repayment into savings">
        <p>
          Brian takes home KSh 80,000. He pays KSh 7,000 a month on a loan that clears in June, and pays himself first with KSh 3,000 a month into
          a buffer. In July, instead of letting the KSh 7,000 disappear into everyday spending, he adds it to his standing order: KSh 10,000 a
          month.
        </p>
        <p>
          He lives on exactly what he lived on before, but his monthly saving has more than tripled. His savings rate goes from under 4% to 12.5%.
        </p>
      </Example>
      <Callout tone="warn" title="Don’t pay yourself first into a loan">
        <p>
          If you save KSh 5,000 on payday and then borrow KSh 5,000 on the 25th, you haven’t saved anything. You’ve paid a lender to move your own
          money around. Lower the amount until you can get through the month without borrowing, then raise it from there.
        </p>
      </Callout>

      <h2 id="irregular">What if your income changes month to month?</h2>
      <p>
        Use a percentage, not a fixed amount. Each time money comes in, move your percentage out first. A good month saves more, a thin month saves
        less, and the habit stays the same. If your salary is steady but you get occasional bonuses or side income, send a bigger share of those,
        such as half, straight to savings.
      </p>
      <Callout tone="tip" title="Make it the first line of your plan">
        <p>
          In Finfe, add your savings transfer as a payment in your monthly plan and tick it off on payday. What’s left after payments
          then shows what you really have to spend, and spending limits warn you when a category reaches 80%. <A href="/signup">Start free</A>, or
          see how long a goal will take with the <A href="/calculators/savings-goal">savings goal calculator</A>.
        </p>
      </Callout>
    </Prose>
  )
}
