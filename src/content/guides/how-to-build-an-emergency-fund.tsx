import { A, Callout, Definition, Example, Ext, Formula, Prose, Steps, Table } from '@/components/marketing/prose'
import type { Article } from '@/content/types'

export const meta: Article['meta'] = {
  slug: 'how-to-build-an-emergency-fund',
  title: 'How to build an emergency fund on a salary in Kenya',
  seoTitle: 'How to Build an Emergency Fund in Kenya',
  description:
    'A common guideline is 3–6 months of essential expenses. Start with one month, keep it separate but easy to reach, and save a fixed amount every payday.',
  summary:
    'A common guideline is to hold three to six months of essential expenses, not your full salary. Start with a first target of one month, keep the money separate from your everyday account but easy to withdraw within a few days, and build it by treating saving as a payment you make on payday.',
  keyTakeaways: [
    'Size the fund on essential expenses (rent, food, transport, loan minimums, school fees), not on total income.',
    'One month of essentials is a realistic first target and already covers many common emergencies.',
    'Keep it separate from your M-Pesa and spending account, somewhere stable you can reach within days.',
    'Save a fixed amount on payday as a planned payment, not whatever is left at month end.',
    'Use it only for true emergencies, then refill it before restarting other goals.',
  ],
  keywords: [
    'how to build an emergency fund',
    'how much emergency fund do I need',
    'emergency fund Kenya',
    'where to keep emergency fund in Kenya',
    'emergency savings on a salary',
    '3 to 6 months emergency fund',
  ],
  published: '2026-11-11',
  updated: '2026-11-11',
  readingMinutes: 8,
  category: 'Saving',
  related: ['/calculators/emergency-fund', '/saving-money', '/blog/pay-yourself-first', '/blog/sinking-funds-for-school-fees', '/guides/how-to-get-out-of-debt'],
  toc: [
    { id: 'what-is-an-emergency-fund', label: 'What is an emergency fund?' },
    { id: 'how-much', label: 'How much should it be?' },
    { id: 'start-with-one-month', label: 'Why start with one month' },
    { id: 'where-to-keep-it', label: 'Where to keep it' },
    { id: 'how-to-build-it', label: 'How to build it from a salary' },
    { id: 'debt-or-savings-first', label: 'Emergency fund or debt first?' },
    { id: 'using-and-refilling', label: 'Using and refilling it' },
    { id: 'common-mistakes', label: 'Mistakes to avoid' },
  ],
  faq: [
    {
      q: 'Is three months of salary enough for an emergency fund?',
      a: 'The common guideline is three to six months of essential expenses rather than salary, which is usually less than your full pay. Whether three months is enough depends on how secure your income is and how many people depend on you.',
    },
    {
      q: 'Can I keep my emergency fund in a SACCO?',
      a: 'Only in savings you can withdraw quickly. Many SACCO member deposits can’t be withdrawn while you remain a member because they back your loans, so check your SACCO’s rules before relying on it.',
    },
    {
      q: 'Is a money market fund a good place for an emergency fund?',
      a: 'Many people consider money market funds for emergency savings because withdrawals usually take only a few working days. Returns aren’t guaranteed, so read the fund’s terms and check that the manager is licensed by the Capital Markets Authority. This is general information, not advice.',
    },
    {
      q: 'What counts as an emergency?',
      a: 'Something unexpected, necessary and urgent, such as a medical bill, a job loss or an essential repair. Planned costs like school fees or Christmas travel are better covered by a separate sinking fund.',
    },
    {
      q: 'How long does it take to build an emergency fund?',
      a: 'Divide your target by what you can save each month. For example, KSh 60,000 at KSh 6,000 a month takes 10 months; lump sums such as part of a bonus shorten that.',
    },
  ],
  sources: [
    { title: 'Central Bank of Kenya', url: 'https://www.centralbank.go.ke/', publisher: 'Central Bank of Kenya' },
    { title: 'Capital Markets Authority', url: 'https://www.cma.or.ke/', publisher: 'Capital Markets Authority, Kenya' },
    { title: 'SACCO Societies Regulatory Authority', url: 'https://www.sasra.go.ke/', publisher: 'SASRA' },
    { title: 'Consumer Financial Protection Bureau', url: 'https://www.consumerfinance.gov/', publisher: 'US Consumer Financial Protection Bureau' },
  ],
}

export default function Body() {
  return (
    <Prose>
      <p>
        An emergency fund is the money that stands between an unexpected bill and a new loan. It won’t stop emergencies happening, but it changes what happens
        next: you pay, and next month’s salary is still yours.
      </p>

      <h2 id="what-is-an-emergency-fund">What is an emergency fund?</h2>
      <Definition term="Emergency fund">
        money set aside only for unexpected, necessary costs or a sudden drop in income, kept where you can reach it quickly. See also the{' '}
        <A href="/glossary#emergency-fund">glossary entry</A>.
      </Definition>
      <p>
        In practice that might be a hospital deposit, a job loss or a salary that arrives late, urgent travel upcountry for a funeral, a repair to the car or
        motorbike you need for work, or replacing a phone you can’t work without.
      </p>
      <p>
        It isn’t for costs you can see coming, such as school fees, an insurance renewal or Christmas travel. Those belong in a{' '}
        <A href="/blog/sinking-funds-for-school-fees">sinking fund</A>, saved for month by month. Keeping the two apart stops school fees from emptying your
        emergency money in January.
      </p>
      <p>
        Without an emergency fund, emergencies usually end up on Fuliza, a mobile loan or a salary advance, and the repayment becomes next month’s problem. That
        borrowing is rarely cheap; see <A href="/blog/true-cost-of-mobile-loans">the true cost of mobile loans</A>.
      </p>

      <h2 id="how-much">How much should an emergency fund be?</h2>
      <p>
        A common guideline is three to six months of <strong>essential</strong> expenses. That’s what you’d need to keep the household running if your income
        stopped, which is usually less than your full salary.
      </p>
      <Formula label="Emergency fund target equals monthly essential expenses times number of months">Target = monthly essential expenses × number of months</Formula>
      <Table caption="What counts as an essential expense">
        <thead>
          <tr>
            <th>Expense</th>
            <th>Count it?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rent, food, electricity, water</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Transport</td>
            <td>Yes, though some of it may fall if you lose your job</td>
          </tr>
          <tr>
            <td>Airtime and data</td>
            <td>Yes, the basic amount</td>
          </tr>
          <tr>
            <td>Minimum loan repayments</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>School fees</td>
            <td>Yes, as a monthly share</td>
          </tr>
          <tr>
            <td>Family support</td>
            <td>Yes, the part you’d keep giving in a hard month</td>
          </tr>
          <tr>
            <td>Eating out, entertainment, new clothes</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Extra loan repayments, saving and investing</td>
            <td>No</td>
          </tr>
        </tbody>
      </Table>
      <p>Where you land in the three-to-six range depends on how exposed you are:</p>
      <ul>
        <li>
          <strong>Aim nearer six months (or more)</strong> if yours is the only income in the household, several people depend on you, your pay includes
          commission or contract work, or your side income varies a lot.
        </li>
        <li>
          <strong>Three months may be enough</strong> if there are two steady incomes at home, your job is permanent and your fixed costs are modest.
        </li>
      </ul>
      <Example title="Example: setting a target">
        <p>
          Otieno’s essentials come to <strong>KSh 60,000</strong> a month: rent 18,000, food 14,000, transport 6,000, utilities, airtime and data 5,000, loan
          minimums 8,000, a monthly share of school fees 6,000 and support for his mother 3,000.
        </p>
        <p>
          One month of cover is KSh 60,000. Three months is <strong>KSh 180,000</strong>. Six months is <strong>KSh 360,000</strong>.
        </p>
      </Example>

      <h2 id="start-with-one-month">Why start with one month?</h2>
      <p>
        Because three to six months can look impossible, and a goal that feels impossible is easy to abandon. One month of essentials is a realistic first
        target, and it already covers many common emergencies.
      </p>
      <Table caption="Milestones for Otieno, saving KSh 6,000 a month">
        <thead>
          <tr>
            <th>Milestone</th>
            <th className="num">Target (KSh)</th>
            <th className="num">Months to reach</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>One month of essentials</td>
            <td className="num">60,000</td>
            <td className="num">10</td>
          </tr>
          <tr>
            <td>Three months</td>
            <td className="num">180,000</td>
            <td className="num">30</td>
          </tr>
          <tr>
            <td>Six months</td>
            <td className="num">360,000</td>
            <td className="num">60</td>
          </tr>
        </tbody>
      </Table>
      <p>
        These timelines are honest: building a full fund from a salary usually takes years, not weeks. They shrink when you add lump sums, such as part of a
        bonus, a salary increase or side-business profit, and when a loan is cleared and its repayment can come here instead. The{' '}
        <A href="/calculators/emergency-fund">emergency fund calculator</A> works out your own target and timeline.
      </p>

      <h2 id="where-to-keep-it">Where should you keep an emergency fund?</h2>
      <p>
        Keep it somewhere separate from your everyday money, where its value is stable and you can withdraw it within a few days. For this money, safety and
        access matter more than return.
      </p>
      <Table caption="Common places to keep emergency savings, compared in general terms">
        <thead>
          <tr>
            <th>Option</th>
            <th>Access</th>
            <th>Things to check</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>A separate savings account at a bank</td>
            <td>Usually quick</td>
            <td>Fees, minimum balance and withdrawal rules</td>
          </tr>
          <tr>
            <td>A money market fund</td>
            <td>Usually a few working days</td>
            <td>Returns vary and aren’t guaranteed; check withdrawal times and charges</td>
          </tr>
          <tr>
            <td>Withdrawable savings at a SACCO</td>
            <td>Depends on the SACCO</td>
            <td>Member deposits that back loans often can’t be withdrawn while you’re a member</td>
          </tr>
          <tr>
            <td>Your main M-Pesa wallet or current account</td>
            <td>Instant</td>
            <td>Too easy to spend; it mixes with daily money</td>
          </tr>
          <tr>
            <td>Cash at home</td>
            <td>Instant</td>
            <td>Risk of theft or loss, and easy to dip into</td>
          </tr>
          <tr>
            <td>Shares, land, crypto, or lending to friends</td>
            <td>Slow or uncertain</td>
            <td>Can fall in value or be hard to turn into cash quickly</td>
          </tr>
        </tbody>
      </Table>
      <p>
        A little friction is the point. Money that sits one step away from your spending account, under a name like “Emergency only”, is much less likely to
        drift into everyday costs.
      </p>
      <Callout tone="warn" title="General information, not a product recommendation">
        <p>
          Before you put money anywhere, check that the provider is licensed and read the terms. The{' '}
          <Ext href="https://www.centralbank.go.ke/">Central Bank of Kenya</Ext> regulates banks, the{' '}
          <Ext href="https://www.cma.or.ke/">Capital Markets Authority</Ext> licenses fund managers, and{' '}
          <Ext href="https://www.sasra.go.ke/">SASRA</Ext> regulates many SACCOs. Each publishes information on its website.
        </p>
      </Callout>

      <h2 id="how-to-build-it">How do you build an emergency fund from a salary?</h2>
      <p>
        Save a fixed amount every payday, before you start spending, and add lump sums whenever they come. Small, regular amounts add up; the US{' '}
        <Ext href="https://www.consumerfinance.gov/">Consumer Financial Protection Bureau</Ext>’s guidance on emergency savings makes the same point about
        saving regularly and automatically.
      </p>
      <Steps
        items={[
          {
            title: 'Work out your essentials',
            body: 'Add up your monthly essential costs using the table above. This is the number everything else is based on.',
          },
          {
            title: 'Set your first target',
            body: 'One month of essentials. Write the number down; a specific target is easier to reach than “some savings”.',
          },
          {
            title: 'Choose an amount you can keep up',
            body: 'Even KSh 2,000 a month is KSh 24,000 in a year. Saving the same amount every month beats a big start you can’t sustain.',
          },
          {
            title: 'Pay it on payday',
            body: (
              <>
                Treat the transfer as a payment in your monthly budget, made the day your salary arrives, not from whatever is left at month end. A standing order
                makes it automatic. This is <A href="/blog/pay-yourself-first">paying yourself first</A>.
              </>
            ),
          },
          {
            title: 'Keep it out of sight',
            body: 'Use a separate account or fund from your spending money, so it isn’t in the balance you check every day.',
          },
          {
            title: 'Add windfalls and freed-up payments',
            body: 'Put part of any bonus, salary increase or side-business profit here. When a loan is cleared, redirect some of its repayment too.',
          },
        ]}
      />
      <h3>If your income varies</h3>
      <p>
        If part of your income comes from commission, contracts or a side business, save a fixed amount from your basic salary every month and add a share of
        anything above it, for example a quarter of each month’s extra. That keeps the habit steady in slow months and speeds it up in good ones. It’s also a
        reason to aim towards the upper end of the three-to-six-month range, because a quiet spell in the business and an emergency can arrive together.
      </p>
      <p>
        In Finfe you can add your emergency fund as a goal and as a monthly payment. It then sits in your plan alongside rent and loan repayments,
        and you can see how close you are to the target. It’s free to start, with a 14-day Pro trial; <A href="/signup">create an account</A>.
      </p>

      <h2 id="debt-or-savings-first">Should you build an emergency fund or pay off debt first?</h2>
      <p>
        Many people do a bit of both: build a small starter fund while paying the minimum on every loan, then put extra money towards expensive debt, then grow
        the fund to its full size.
      </p>
      <p>
        The reason is simple. If every spare shilling goes to loans and nothing is saved, the next emergency goes straight back onto Fuliza or a mobile loan,
        and the cycle restarts. A starter fund breaks that cycle. On the other hand, holding a large fund while paying very high charges on a mobile loan costs
        you money every month. Where the balance sits depends on your loans; our guide on{' '}
        <A href="/guides/how-to-get-out-of-debt">how to get out of debt</A> covers the repayment side.
      </p>

      <h2 id="using-and-refilling">When should you use it, and how do you refill it?</h2>
      <p>
        Use it when something is unexpected, necessary and urgent. If all three are true, spend it without guilt: that’s exactly what it’s for.
      </p>
      <ul>
        <li>
          <strong>Unexpected:</strong> you couldn’t reasonably have planned for it. School fees fail this test; a burst pipe passes.
        </li>
        <li>
          <strong>Necessary:</strong> it protects your health, your income or your home. A TV on offer fails; a hospital deposit passes.
        </li>
        <li>
          <strong>Urgent:</strong> it can’t wait until next month’s budget.
        </li>
      </ul>
      <p>
        Afterwards, refill it before restarting other extra goals. Put the same monthly amount back, a little more if you can, until you’re back at your target.
      </p>

      <h2 id="common-mistakes">What mistakes should you avoid?</h2>
      <p>Most emergency funds fail for one of a few avoidable reasons.</p>
      <ul>
        <li>
          <strong>Mixing it with planned costs.</strong> If school fees or Christmas travel come out of the same pot, it will be empty when a real emergency
          arrives.
        </li>
        <li>
          <strong>Chasing returns.</strong> Putting it into something that can fall in value, or that takes weeks to sell, defeats the purpose.
        </li>
        <li>
          <strong>Lending it out.</strong> A loan to a friend or relative may not come back when you need it. If you choose to help, treat it as a gift from
          your budget, not from this fund.
        </li>
        <li>
          <strong>Stopping after the first emergency.</strong> Using the fund is a success, not a failure. The only mistake is not refilling it.
        </li>
      </ul>
    </Prose>
  )
}
