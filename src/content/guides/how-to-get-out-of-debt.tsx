import { A, Callout, Example, Ext, Formula, Prose, Steps, Table } from '@/components/marketing/prose'
import type { Article } from '@/content/types'

export const meta: Article['meta'] = {
  slug: 'how-to-get-out-of-debt',
  title: 'How to get out of debt in Kenya: a step-by-step plan',
  seoTitle: 'How to Get Out of Debt in Kenya',
  description:
    'List every loan, stop new borrowing, pay the minimum on each and put all extra money on one target loan. Then watch your debt-free date as balances fall.',
  summary:
    'Write down every loan you owe, from Fuliza to SACCO and bank loans, stop taking new ones, and pay at least the minimum on each. Put every extra shilling on one target loan (usually the most expensive), and when it’s cleared, roll its payment onto the next.',
  keyTakeaways: [
    'You can’t plan for debts you haven’t listed: include Fuliza, mobile loans, chama loans and money owed to family.',
    'Stopping new borrowing comes first; otherwise repayments just make room for the next loan.',
    'Pay the minimum on every loan and send all extra money to one target loan at a time.',
    'A debt-free date is an estimate from each loan’s balance, rate and payment; it moves when those change.',
    'If a payment doesn’t cover the monthly interest, the balance grows: act on that loan first and talk to the lender early.',
  ],
  keywords: [
    'how to get out of debt',
    'how to get out of debt in Kenya',
    'how to clear loans fast',
    'how to pay off Fuliza and mobile loans',
    'debt repayment plan',
    'debt-free date',
  ],
  published: '2026-11-11',
  updated: '2026-11-11',
  readingMinutes: 8,
  category: 'Debt',
  related: ['/debt-management', '/calculators/debt-payoff', '/guides/debt-avalanche-vs-snowball', '/blog/true-cost-of-mobile-loans', '/guides/how-to-build-an-emergency-fund'],
  toc: [
    { id: 'step-1-list', label: 'Step 1: List every loan' },
    { id: 'step-2-stop', label: 'Step 2: Stop new borrowing' },
    { id: 'step-3-plan', label: 'Step 3: Put repayments in your plan' },
    { id: 'step-4-minimums', label: 'Step 4: Pay every minimum' },
    { id: 'step-5-target', label: 'Step 5: Extra money to one target' },
    { id: 'step-6-roll', label: 'Step 6: Roll payments forward' },
    { id: 'debt-free-date', label: 'How to read a debt-free date' },
    { id: 'interest-trap', label: 'When a payment doesn’t cover interest' },
    { id: 'stay-out', label: 'Staying out of debt' },
  ],
  faq: [
    {
      q: 'Should I pay off Fuliza or my SACCO loan first?',
      a: 'Keep paying at least the minimum on both, then usually target the one that costs more per shilling borrowed. Short-term mobile credit can work out far more expensive than a SACCO loan once its fees are expressed as a yearly rate, so many people clear it first.',
    },
    {
      q: 'Is it a good idea to take a loan to clear other loans?',
      a: 'Only if the new loan’s total cost, including fees, is lower than what you’re paying now, and you stop borrowing from the old lenders. Otherwise consolidation just adds another loan.',
    },
    {
      q: 'Should I save or pay off debt first?',
      a: 'Many people build a small starter emergency fund first while paying minimums, then put extra towards expensive debt. Without any buffer, the next emergency tends to become a new loan.',
    },
    {
      q: 'What if I can’t afford my minimum payments?',
      a: 'Contact your lenders before the due date to discuss a revised plan, and cut flexible spending in the meantime. Missed payments can add penalties and may be reported to credit reference bureaus.',
    },
    {
      q: 'How long will it take to get out of debt?',
      a: 'It depends on your balances, interest rates and how much you can pay each month. A debt payoff calculator, or the debt-free date in a budgeting app, gives an estimate that updates as you pay.',
    },
  ],
  sources: [
    { title: 'Central Bank of Kenya', url: 'https://www.centralbank.go.ke/', publisher: 'Central Bank of Kenya' },
    { title: 'SACCO Societies Regulatory Authority', url: 'https://www.sasra.go.ke/', publisher: 'SASRA' },
  ],
}

export default function Body() {
  return (
    <Prose>
      <p>
        Getting out of debt is less about a clever trick and more about a plan you can keep for months. The six steps below work for any mix of loans, from a
        KSh 2,000 Fuliza balance to a bank loan running for years.
      </p>

      <h2 id="step-1-list">Step 1: List every loan you owe</h2>
      <p>
        Write down every debt, including the small and informal ones. You can’t plan for loans you haven’t listed, and the ones people leave out, such as
        Fuliza, a loan app or money owed to a sister, are often the most expensive or the most stressful.
      </p>
      <p>Include all of these that apply:</p>
      <ul>
        <li>Fuliza and other overdrafts on your mobile money or bank account</li>
        <li>Mobile loan apps</li>
        <li>SACCO loans, whether repaid by check-off or not</li>
        <li>Bank loans and salary advances</li>
        <li>Shamba or land loans, car loans and logbook loans</li>
        <li>Hire purchase or pay-later plans for phones, furniture or appliances</li>
        <li>Chama loans</li>
        <li>Money borrowed from family, friends or your employer</li>
        <li>Credit cards</li>
      </ul>
      <p>For each one, record five details:</p>
      <Table caption="What to record for each loan">
        <thead>
          <tr>
            <th>Detail</th>
            <th>Where to find it</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Balance owed today</td>
            <td>Latest statement or the lender’s app</td>
          </tr>
          <tr>
            <td>Interest rate or fees</td>
            <td>Loan agreement or statement; ask the lender if it isn’t clear</td>
          </tr>
          <tr>
            <td>Minimum monthly payment</td>
            <td>Loan agreement or statement</td>
          </tr>
          <tr>
            <td>Due date</td>
            <td>Loan agreement</td>
          </tr>
          <tr>
            <td>Type of lender</td>
            <td>Bank, SACCO, digital lender, chama, family</td>
          </tr>
        </tbody>
      </Table>
      <Callout tone="info" title="Check who you’re borrowing from">
        <p>
          The <Ext href="https://www.centralbank.go.ke/">Central Bank of Kenya</Ext> licenses banks, microfinance banks and digital credit providers and lists
          them on its website. <Ext href="https://www.sasra.go.ke/">SASRA</Ext> regulates many SACCOs. If a lender you use doesn’t appear where you’d expect,
          be cautious about borrowing from it again.
        </p>
      </Callout>

      <h2 id="step-2-stop">Step 2: Stop new borrowing</h2>
      <p>
        Stop taking new loans before you start paying the old ones down. Otherwise every repayment just makes room for the next loan, and the total never falls.
      </p>
      <ul>
        <li>Don’t borrow from one lender to repay another, unless it’s a deliberate move to a cheaper loan (see below).</li>
        <li>Delete loan apps you don’t need and ignore “you qualify” offers.</li>
        <li>Lower or switch off overdraft limits where your provider lets you.</li>
        <li>
          Start a small buffer so the next emergency doesn’t become a loan. Our guide to{' '}
          <A href="/guides/how-to-build-an-emergency-fund">building an emergency fund</A> shows how.
        </li>
      </ul>

      <h2 id="step-3-plan">Step 3: Put every repayment in your monthly plan</h2>
      <p>
        Add each loan’s minimum repayment to your list of payments for the month, alongside rent and school fees, then check what’s left after payments. This is
        the same “payments first” method as in <A href="/guides/how-to-make-a-monthly-budget">making a monthly budget</A>.
      </p>
      <p>
        If what’s left covers food, transport and the basics with something to spare, you’re ready to start paying extra. If it doesn’t, the size of your
        repayments is the real problem, and the section on payments that don’t cover interest below is where to start.
      </p>

      <h2 id="step-4-minimums">Step 4: Pay the minimum on every loan</h2>
      <p>
        Pay at least the minimum on every loan, every month, on time. Missed payments can bring penalties and extra interest, and may be reported to credit
        reference bureaus, which can make future borrowing harder or more expensive.
      </p>
      <p>
        If you can’t meet a minimum, contact the lender before the due date, not after. It’s usually easier to agree a revised plan before a payment is missed
        than once the account is in arrears.
      </p>

      <h2 id="step-5-target">Step 5: Send all extra money to one target loan</h2>
      <p>
        Choose one loan as your target and put every extra shilling on it, while paying minimums on the rest. Concentrating the extra clears loans one at a
        time, which is faster and far easier to track than spreading it thinly.
      </p>
      <p>There are two common ways to choose the target:</p>
      <ul>
        <li>
          <strong>Debt avalanche:</strong> the highest interest rate first. It costs the least interest overall.
        </li>
        <li>
          <strong>Debt snowball:</strong> the smallest balance first. It gives the quickest first win.
        </li>
      </ul>
      <p>
        Our comparison of the <A href="/guides/debt-avalanche-vs-snowball">debt avalanche and snowball</A> works through both with real numbers. In Kenya the
        two often agree on the first target, because small mobile loans and overdrafts are frequently both the smallest and the most expensive.
      </p>
      <p>
        Extra money can come from cutting a want category, side income, part of a bonus, or selling something you no longer use. Even KSh 1,000 a month extra
        makes a difference over a year.
      </p>

      <h2 id="step-6-roll">Step 6: When a loan is cleared, roll its payment onto the next</h2>
      <p>
        When your target loan is paid off, don’t let its payment disappear into everyday spending. Add it to the payment on your next target. Each cleared loan
        makes the next one go faster, which is why this approach speeds up over time.
      </p>
      <p>
        For example, say you were paying KSh 5,000 a month on a mobile loan (minimum plus your extra) and KSh 6,000 on a SACCO loan. Once the mobile loan is
        cleared, the SACCO loan gets KSh 11,000 a month. Your total monthly repayment stays the same; it just works harder.
      </p>

      <h2 id="debt-free-date">How do you read a debt-free date?</h2>
      <p>
        A debt-free date is the month your last loan would be fully paid if you keep making the same payments. It’s an estimate worked out from three numbers
        for each loan: the balance, the interest rate and the monthly payment.
      </p>
      <p>
        Each month, interest is added on the balance that remains and your payment comes off. Early on, a bigger share of each payment goes to interest; as the
        balance falls, more of it goes to the loan itself. This is called amortisation.
      </p>
      <Example title="Example: one loan, two payment levels">
        <p>
          A loan of <strong>KSh 120,000</strong> at 14% a year, with interest charged monthly on the reducing balance. The first payment is in December 2026.
        </p>
        <Table caption="How the monthly payment changes the debt-free date">
          <thead>
            <tr>
              <th>Monthly payment</th>
              <th className="num">Payments needed</th>
              <th className="num">Interest paid (approx.)</th>
              <th>Last payment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>KSh 6,000</td>
              <td className="num">23</td>
              <td className="num">KSh 17,400</td>
              <td>October 2028</td>
            </tr>
            <tr>
              <td>KSh 8,000</td>
              <td className="num">17</td>
              <td className="num">KSh 12,700</td>
              <td>April 2028</td>
            </tr>
          </tbody>
        </Table>
        <p>Paying KSh 2,000 more each month brings the date six months closer and saves almost KSh 4,800 in interest.</p>
      </Example>
      <p>A few things to keep in mind when you read the date:</p>
      <ul>
        <li>With several loans, your overall debt-free date is the latest of the individual dates.</li>
        <li>It moves earlier when you pay extra, and later when you miss payments, borrow more or a rate goes up.</li>
        <li>Treat it as a direction, not a promise, and check it once a month.</li>
      </ul>
      <p>
        Finfe shows a debt-free date for each loan from its balance, rate and monthly payment, and the Pro “pay extra” simulator shows how an extra
        amount every month would move it. You can run the same sums in the <A href="/calculators/debt-payoff">debt payoff calculator</A>.
      </p>

      <h2 id="interest-trap">What if your payment doesn’t even cover the interest?</h2>
      <p>
        Then the loan won’t be paid off at that rate: the balance stays the same or grows each month, however long you keep paying. It’s the most important
        thing to check on your list.
      </p>
      <Formula label="Monthly interest is approximately the balance times the yearly interest rate divided by 12">
        Monthly interest ≈ balance × yearly interest rate ÷ 12
      </Formula>
      <Example title="Example: a payment that loses ground">
        <p>
          A balance of <strong>KSh 200,000</strong> at 24% a year has monthly interest of about 200,000 × 24% ÷ 12 = <strong>KSh 4,000</strong>. If you pay KSh
          3,500 a month, the balance grows by about KSh 500 in the first month, and by a little more each month after. A debt payoff calculator would show that
          it never clears.
        </p>
      </Example>
      <p>
        Some loans charge interest differently, for example a flat rate on the original amount, or a fee per loan period instead of a yearly rate. The simplest
        test is your statement: if the balance isn’t falling from one month to the next, you’re in this situation.
      </p>
      <Steps
        items={[
          {
            title: 'Make this loan your target',
            body: 'Raise its payment above the monthly interest, even slightly, so the balance starts to fall. Find the money in wants or other extra payments first.',
          },
          {
            title: 'Talk to the lender',
            body: 'Ask about a lower rate, waived penalties or a revised plan. A longer term can lower the monthly payment but usually increases total interest, so compare the total cost.',
          },
          {
            title: 'Consider consolidation carefully',
            body: 'Moving several loans into one only helps if the new loan’s total cost, including fees, is lower and you’ve stopped new borrowing.',
          },
          {
            title: 'Get help early',
            body: 'If the numbers don’t work at all, speak to your lenders, your SACCO or your employer’s HR or welfare office before payments are missed.',
          },
        ]}
      />

      <h2 id="stay-out">How do you stay out of debt once you’re clear?</h2>
      <p>
        Keep the habits that got you out: payments first, a <A href="/blog/sinking-funds-for-school-fees">sinking fund</A> for big known costs such as school
        fees, and an emergency fund for the unknown ones. When your last loan is cleared, keep making the same total payment each month, but to your savings and
        goals instead of a lender.
      </p>
    </Prose>
  )
}
