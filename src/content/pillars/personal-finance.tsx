import { A, Callout, Definition, Example, Ext, Formula, LinkGrid, Prose, Steps, Table } from '@/components/marketing/prose'
import type { Article } from '@/content/types'

export const meta: Article['meta'] = {
  slug: 'personal-finance',
  title: 'Personal finance basics for Kenya: where to start and what to do next',
  seoTitle: 'Personal Finance Basics for Kenya',
  description:
    'Personal finance in Kenya, explained simply: earning, budgeting, saving, borrowing, protecting and investing, and the order to tackle them on a salary.',
  summary:
    'Personal finance is how you manage the money you earn: planning it, spending it, saving it, borrowing carefully, protecting it and investing for later. On a Kenyan salary, the safest order is to know your numbers, plan every payment, stop new borrowing, build a small buffer, clear expensive debt, build a full emergency fund and then invest for your goals.',
  keyTakeaways: [
    'Personal finance has seven parts: earning, budgeting, spending, saving, borrowing, protecting and investing.',
    'Plan from your net pay, the amount that reaches your account after deductions such as PAYE, NSSF, SHIF and the Housing Levy.',
    'Work in order: know your numbers, plan payments, stop new borrowing, build a small buffer, clear expensive debt, build a full emergency fund, then invest.',
    'Measure progress with habits, not feelings: living within your income, debt going down, saving at least 10% and keeping loan repayments under 30% of income.',
    'Check that any bank, SACCO, lender or fund you use is licensed by the right Kenyan regulator.',
  ],
  keywords: [
    'personal finance Kenya',
    'personal finance basics',
    'how to manage money in Kenya',
    'how to manage my salary',
    'money management tips Kenya',
    'financial planning for beginners Kenya',
    'how to stop living paycheck to paycheck',
  ],
  published: '2026-11-11',
  updated: '2026-11-11',
  readingMinutes: 9,
  category: 'Personal finance',
  related: ['/learn', '/budgeting', '/debt-management', '/saving-money', '/financial-freedom', '/financial-health'],
  toc: [
    { id: 'what-is-personal-finance', label: 'What is personal finance?' },
    { id: 'what-it-covers', label: 'What personal finance covers' },
    { id: 'where-to-start', label: 'Where to start' },
    { id: 'order-of-priorities', label: 'The order of priorities' },
    { id: 'worked-example', label: 'A worked example' },
    { id: 'measure-progress', label: 'How to measure progress' },
    { id: 'common-mistakes', label: 'Common mistakes' },
    { id: 'protecting', label: 'Protecting your money' },
    { id: 'explore', label: 'Explore every topic' },
  ],
  faq: [
    {
      q: 'What are the basics of personal finance?',
      a: 'The basics are knowing your net pay, planning every payment before you spend, living below your income, avoiding new debt for everyday costs, keeping an emergency fund and saving or investing a regular share of your pay.',
    },
    {
      q: 'How should I manage my salary in Kenya?',
      a: 'Start from your net pay, list every payment due this month and plan only what is left after payments. Move your savings out on payday, set limits for food, transport and other spending, and record expenses as they happen.',
    },
    {
      q: 'Should I save or pay off debt first?',
      a: 'Build a small buffer first, about one month of essential costs, so an emergency doesn’t force you into a new loan. Then put most of your extra money into your most expensive debt, and build a full emergency fund once that debt is cleared.',
    },
    {
      q: 'What percentage of my salary should I save?',
      a: 'A common first target is 10% of net pay. If that isn’t possible yet, start with a smaller fixed amount and raise it each time a loan ends or your pay goes up.',
    },
    {
      q: 'How much of my salary should go to loan repayments?',
      a: 'As a rule of thumb, keep loan repayments below 30% of your income. Above that, debt becomes heavy and it gets harder to cover everyday costs without borrowing again.',
    },
    {
      q: 'Is Finfe free to use?',
      a: 'Yes. Finfe has a free plan that includes the monthly plan, unlimited expenses and loans, overspending warnings and debt-free dates. Pro costs KSh 299 a month or KSh 2,999 a year, with a 14-day trial, and you can pay by M-Pesa or card.',
    },
  ],
  sources: [
    { title: 'Kenya Revenue Authority', url: 'https://www.kra.go.ke/', publisher: 'Kenya Revenue Authority' },
    { title: 'Central Bank of Kenya', url: 'https://www.centralbank.go.ke/', publisher: 'Central Bank of Kenya' },
    { title: 'Sacco Societies Regulatory Authority', url: 'https://www.sasra.go.ke/', publisher: 'SASRA' },
    { title: 'Capital Markets Authority', url: 'https://www.cma.or.ke/', publisher: 'Capital Markets Authority' },
    { title: 'Retirement Benefits Authority', url: 'https://www.rba.go.ke/', publisher: 'Retirement Benefits Authority' },
  ],
}

export default function Body() {
  return (
    <Prose>
      <h2 id="what-is-personal-finance">What is personal finance?</h2>
      <p>
        Personal finance is the way you manage your own money: what comes in, what goes out, what you keep and what you owe. It isn’t about
        being good with numbers. It is a handful of habits that, repeated every month, decide whether your salary works for you or runs out
        before payday.
      </p>
      <p>
        For most salaried people in Kenya, the problem isn’t a lack of advice. It’s that the salary is spoken for before it arrives: rent, a
        SACCO loan, school fees, house help, a chama contribution, money for family at home. Good personal finance starts by seeing all of
        that clearly, then making steady choices with what is left.
      </p>

      <h2 id="what-it-covers">What does personal finance cover?</h2>
      <p>
        Personal finance covers seven connected areas: earning, budgeting, spending, saving, borrowing, protecting and investing. Each one
        affects the others, so a problem in one (borrowing to get by, for example) soon shows up in all the rest.
      </p>
      <Table caption="The seven areas of personal finance">
        <thead>
          <tr>
            <th>Area</th>
            <th>What it means</th>
            <th>The question to ask</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Earning</td>
            <td>Your salary and any side income, after deductions.</td>
            <td>How much actually lands in my account each month?</td>
          </tr>
          <tr>
            <td>Budgeting</td>
            <td>A plan for where each shilling will go, made before you spend it.</td>
            <td>After every payment due this month, what is left?</td>
          </tr>
          <tr>
            <td>Spending</td>
            <td>Day-to-day money for food, transport, airtime and wants.</td>
            <td>Am I spending in line with my plan?</td>
          </tr>
          <tr>
            <td>Saving</td>
            <td>Money kept for emergencies and known future costs.</td>
            <td>If something went wrong tomorrow, could I cover it without a loan?</td>
          </tr>
          <tr>
            <td>Borrowing</td>
            <td>Loans of every kind, from mobile loans and overdrafts to SACCO and bank loans.</td>
            <td>Is my debt going down, and what is it costing me?</td>
          </tr>
          <tr>
            <td>Protecting</td>
            <td>Insurance, licensed providers and guarding against fraud.</td>
            <td>What would happen to my household’s finances if I fell ill or lost my job?</td>
          </tr>
          <tr>
            <td>Investing</td>
            <td>Putting money into things that can grow over years, such as a pension, a fund or a business.</td>
            <td>Am I building something for later, beyond my next salary?</td>
          </tr>
        </tbody>
      </Table>
      <p>
        You don’t need to master all seven at once. The first four are about control. The last three build on that control. The order of
        priorities below shows how they fit together.
      </p>

      <h2 id="where-to-start">Where should you start?</h2>
      <p>
        Start with two numbers: your net pay, and the total of every payment you must make this month. Together they tell you more about your
        finances than any rule of thumb.
      </p>
      <Definition term="Net pay">
        The amount your employer actually pays into your account after deductions such as PAYE (income tax), NSSF, SHIF and the Housing
        Levy, and after anything deducted at source, such as a SACCO or bank loan on check-off. Plan from this figure, never from your gross
        salary. See <A href="/glossary#net-pay">net pay</A> in the glossary.
      </Definition>
      <p>
        Your payslip lists each deduction. If a line is unclear, the <Ext href="https://www.kra.go.ke/">Kenya Revenue Authority</Ext> explains
        how PAYE works, and your payroll or HR team can explain the rest.
      </p>
      <p>
        Next, list every payment due this month with its amount and due date: rent, loan repayments, school fees, house help, chama,
        insurance, utilities and support for family. This is the heart of the “payments first” method that Finfe is built on.
      </p>
      <Formula label="What is left after payments equals net pay minus this month's payments">
        What’s left after payments = net pay − this month’s payments
      </Formula>
      <p>
        What’s left after payments is the money that is truly yours to plan: food, transport, airtime, savings and everything else. When
        people say their salary “disappears”, it is usually because they never saw this number on day one. The{' '}
        <A href="/budgeting">budgeting guide</A> explains the method in full.
      </p>

      <h2 id="order-of-priorities">In what order should you sort out your money?</h2>
      <p>
        Work through seven steps in order: know your numbers, plan your payments, stop new borrowing, build a small buffer, clear expensive
        debt, build a full emergency fund, then invest for your goals. Each step makes the next one easier. Skipping ahead, such as investing
        while still borrowing to get by, usually costs more than it earns.
      </p>
      <Steps
        items={[
          {
            title: 'Know your numbers',
            body: (
              <>
                Record your net pay and every expense for one month, even KSh 50 for a matatu. You can’t fix what you can’t see. The guide on{' '}
                <A href="/guides/how-to-track-expenses">how to track expenses</A> shows a simple daily routine.
              </>
            ),
          },
          {
            title: 'Plan your payments',
            body: (
              <>
                Each month, list every payment due, subtract the total from net pay and set limits for what is left. See{' '}
                <A href="/guides/how-to-make-a-monthly-budget">how to make a monthly budget</A>.
              </>
            ),
          },
          {
            title: 'Stop new borrowing',
            body: (
              <>
                Commit to no new loans for everyday costs. Every loan taken to “bridge” to payday makes next month shorter. Read{' '}
                <A href="/blog/true-cost-of-mobile-loans">the true cost of mobile loans</A> before taking another one.
              </>
            ),
          },
          {
            title: 'Build a small buffer',
            body: (
              <>
                Set aside a starter <A href="/glossary#emergency-fund">emergency fund</A>. A common first target is one month of essential
                costs, built in small steps, so a hospital bill or a broken phone doesn’t send you back to a loan app.
              </>
            ),
          },
          {
            title: 'Clear expensive debt',
            body: (
              <>
                Pay the minimum on every loan, then put any extra on the most expensive one first (the{' '}
                <A href="/glossary#debt-avalanche">debt avalanche</A>), or on the smallest first if quick wins keep you going (the{' '}
                <A href="/glossary#debt-snowball">debt snowball</A>). Compare them in{' '}
                <A href="/guides/debt-avalanche-vs-snowball">debt avalanche vs snowball</A>.
              </>
            ),
          },
          {
            title: 'Build a full emergency fund',
            body: (
              <>
                Grow the buffer to cover several months of essential costs. A common guideline is three to six months, or more if your income
                is uncertain or others depend on you. The <A href="/calculators/emergency-fund">emergency fund calculator</A> gives you a
                target.
              </>
            ),
          },
          {
            title: 'Invest for your goals',
            body: (
              <>
                With expensive debt gone and a safety net in place, put money towards long-term goals: retirement, a home, a business or your
                children’s education. The <A href="/financial-freedom">financial freedom guide</A> explains how far this can take you.
              </>
            ),
          },
        ]}
      />
      <Callout tone="tip" title="Saving and clearing debt at the same time">
        <p>
          You don’t have to finish one step completely before touching the next. Many people keep a small monthly saving going while they
          clear debt, so the habit isn’t lost. What matters is where most of your extra money goes.
        </p>
      </Callout>

      <h2 id="worked-example">What does this look like on a real salary?</h2>
      <p>
        Here is how the payments-first view changes the picture for one household. The figures are round and made up for illustration, but
        the pattern is common.
      </p>
      <Example title="Illustration: a KSh 85,000 net salary">
        <Table caption="This month’s payments, listed first">
          <thead>
            <tr>
              <th>Item</th>
              <th className="num">KSh</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Net pay</td>
              <td className="num">85,000</td>
            </tr>
            <tr>
              <td>Rent</td>
              <td className="num">−18,000</td>
            </tr>
            <tr>
              <td>SACCO loan repayment</td>
              <td className="num">−12,000</td>
            </tr>
            <tr>
              <td>House help</td>
              <td className="num">−10,000</td>
            </tr>
            <tr>
              <td>School fees set-aside</td>
              <td className="num">−8,000</td>
            </tr>
            <tr>
              <td>Mobile loan repayment</td>
              <td className="num">−5,000</td>
            </tr>
            <tr>
              <td>Support for parents</td>
              <td className="num">−4,000</td>
            </tr>
            <tr>
              <td>Chama contribution</td>
              <td className="num">−3,000</td>
            </tr>
            <tr>
              <td>
                <strong>What’s left after payments</strong>
              </td>
              <td className="num">
                <strong>25,000</strong>
              </td>
            </tr>
          </tbody>
        </Table>
        <p>
          That KSh 25,000 has to cover food (say KSh 12,000), transport (KSh 6,000) and airtime and data (KSh 2,000), which leaves KSh 5,000
          for everything else. Nothing is going into savings, so any surprise means another loan.
        </p>
        <p>
          Loan repayments total KSh 17,000, or 20% of net pay, which is manageable. The plan: no new loans, clear the mobile loan first
          because it is the most expensive, then move its KSh 5,000 into a buffer. Within a few months this household has a safety net
          without earning a shilling more.
        </p>
      </Example>
      <p>
        Finfe’s <A href="/signup">monthly plan</A> does this arithmetic for you. You list each payment once, tick it off when it’s
        paid, and the plan shows what’s left after payments and what remains to spend. You can also try the{' '}
        <A href="/calculators/budget">budget calculator</A> without signing up.
      </p>

      <h2 id="measure-progress">How do you know you are making progress?</h2>
      <p>
        Measure habits, not feelings. If most of the ten habits below hold true month after month, your finances are moving in the right
        direction, whatever your salary.
      </p>
      <Table caption="Ten habits of healthy personal finances">
        <thead>
          <tr>
            <th>Habit</th>
            <th>What good looks like</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Living within your income</td>
            <td>You spend less than you earn, ideally keeping at least 10%.</td>
          </tr>
          <tr>
            <td>Not borrowing to get by</td>
            <td>No new loans to cover everyday costs.</td>
          </tr>
          <tr>
            <td>Debt going down</td>
            <td>You repay more each month than you borrow.</td>
          </tr>
          <tr>
            <td>Manageable debt payments</td>
            <td>Loan repayments take less than 30% of income.</td>
          </tr>
          <tr>
            <td>Saving or investing</td>
            <td>At least 10% of income goes to savings or investments.</td>
          </tr>
          <tr>
            <td>Keeping to your spending limits</td>
            <td>Your limits for food, transport and other spending hold most months.</td>
          </tr>
          <tr>
            <td>Wants under control</td>
            <td>Wants make up less than 30% of your spending.</td>
          </tr>
          <tr>
            <td>The next six months covered</td>
            <td>Your income covers every planned payment over the coming six months, school-fee months included.</td>
          </tr>
          <tr>
            <td>On course to be debt-free</td>
            <td>You can name a realistic month when your last loan will be cleared.</td>
          </tr>
          <tr>
            <td>Recording expenses</td>
            <td>You record spending as it happens, not from memory at month end.</td>
          </tr>
        </tbody>
      </Table>
      <p>
        The percentages are rules of thumb, not official limits. They are the same ones Finfe’s “Am I on track?” check uses, and
        you can test yourself against them with the <A href="/financial-health">financial health check</A>. Two terms worth knowing here are
        your <A href="/glossary#savings-rate">savings rate</A> and your{' '}
        <A href="/glossary#debt-to-income-ratio">debt-to-income ratio</A>.
      </p>
      <p>
        Finfe Pro also gives each month a score out of 100, built from five parts: spending within income (40 points), spending
        limits respected (25), no new loans (15), paying down debt (10) and saving or investing (10). It is a quick way to see whether this
        month was better than the last.
      </p>

      <h2 id="common-mistakes">What mistakes keep salaried people stuck?</h2>
      <p>Most money trouble on a salary comes from a few predictable patterns, not from one big mistake.</p>
      <ul>
        <li>
          <strong>Planning from gross pay.</strong> The figure in your contract isn’t the figure you can spend. Plan from net pay, after
          every deduction.
        </li>
        <li>
          <strong>Forgetting lumpy costs.</strong> School fees, insurance renewals and December travel come round every year, yet still
          catch people out. Spread them with a <A href="/glossary#sinking-fund">sinking fund</A>, as explained in{' '}
          <A href="/blog/sinking-funds-for-school-fees">sinking funds for school fees</A>.
        </li>
        <li>
          <strong>Borrowing to reach payday.</strong> A loan to cover the last week makes next month shorter by the loan plus its cost. More
          in <A href="/blog/why-you-run-out-of-money-before-payday">why you run out of money before payday</A>.
        </li>
        <li>
          <strong>Saving whatever is left.</strong> There is rarely anything left. <A href="/blog/pay-yourself-first">Pay yourself first</A>{' '}
          instead, by moving savings out the day your salary arrives.
        </li>
        <li>
          <strong>Not tracking small spending.</strong> Lunch, matatu fares, airtime and deliveries are small one at a time and large over a
          month.
        </li>
        <li>
          <strong>Guaranteeing loans without a plan.</strong> If you guarantee a colleague’s or relative’s SACCO loan and they stop paying,
          you can be asked to cover it, sometimes from your own deposits. Only guarantee what you could afford to lose.
        </li>
      </ul>

      <h2 id="protecting">How do you protect your money in Kenya?</h2>
      <p>
        Use licensed institutions, insure against the risks you couldn’t carry alone, and guard your accounts. Before you save, borrow or
        invest with anyone, check that the right regulator licenses or approves them.
      </p>
      <Table caption="Which regulator to check">
        <thead>
          <tr>
            <th>If you are dealing with…</th>
            <th>Check with</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Banks, microfinance banks and digital (app-based) lenders</td>
            <td>
              <Ext href="https://www.centralbank.go.ke/">Central Bank of Kenya</Ext>
            </td>
          </tr>
          <tr>
            <td>Deposit-taking SACCOs</td>
            <td>
              <Ext href="https://www.sasra.go.ke/">Sacco Societies Regulatory Authority (SASRA)</Ext>
            </td>
          </tr>
          <tr>
            <td>Money market funds and other unit trusts, stockbrokers and investment advisers</td>
            <td>
              <Ext href="https://www.cma.or.ke/">Capital Markets Authority (CMA)</Ext>
            </td>
          </tr>
          <tr>
            <td>Pension and retirement schemes</td>
            <td>
              <Ext href="https://www.rba.go.ke/">Retirement Benefits Authority (RBA)</Ext>
            </td>
          </tr>
          <tr>
            <td>Income tax, including PAYE on your salary</td>
            <td>
              <Ext href="https://www.kra.go.ke/">Kenya Revenue Authority (KRA)</Ext>
            </td>
          </tr>
        </tbody>
      </Table>
      <p>
        Protection also means health cover for your household, life cover if others depend on your income, never sharing your M-Pesa PIN or
        one-time codes, and treating any promise of high, guaranteed returns as a warning sign. The{' '}
        <A href="/saving-money">saving money guide</A> covers how to check a savings provider step by step.
      </p>

      <h2 id="explore">Where should you go next?</h2>
      <p>
        Each page below goes deeper into one part of personal finance. Start with the one that matches your biggest worry right now.
      </p>
      <h3>Topics</h3>
      <LinkGrid
        items={[
          {
            href: '/budgeting',
            title: 'Budgeting',
            text: 'Plan your salary so it lasts the month: payments first, spending limits and a daily allowance.',
          },
          {
            href: '/debt-management',
            title: 'Debt management',
            text: 'List every loan, stop new borrowing and pay down the right loan first.',
          },
          {
            href: '/saving-money',
            title: 'Saving money',
            text: 'Your savings rate, paying yourself first, emergency funds and sinking funds for school fees.',
          },
          {
            href: '/financial-freedom',
            title: 'Financial freedom',
            text: 'The four stages, from not borrowing to get by to work becoming optional, with honest maths.',
          },
          {
            href: '/expense-tracker',
            title: 'Expense tracker',
            text: 'Record spending in seconds and see where your salary really goes each month.',
          },
          {
            href: '/financial-health',
            title: 'Financial health check',
            text: 'Score seven key money habits in two minutes and see what to fix first.',
          },
          {
            href: '/guides',
            title: 'All guides',
            text: 'Step-by-step guides on budgets, tracking, emergency funds and getting out of debt.',
          },
        ]}
      />
      <h3>Calculators</h3>
      <LinkGrid
        items={[
          {
            href: '/calculators/budget',
            title: 'Budget calculator',
            text: 'Try a quick plan for your net pay and see what’s left after payments.',
          },
          {
            href: '/calculators/debt-payoff',
            title: 'Debt payoff calculator',
            text: 'Find your debt-free date and see how paying extra brings it forward.',
          },
          {
            href: '/calculators/emergency-fund',
            title: 'Emergency fund calculator',
            text: 'Work out how big your safety net should be.',
          },
          {
            href: '/calculators/savings-goal',
            title: 'Savings goal calculator',
            text: 'Turn a goal and a deadline into a monthly amount.',
          },
          {
            href: '/calculators/financial-freedom',
            title: 'Financial freedom calculator',
            text: 'Get a rough sense of how much you might need for work to become optional.',
          },
          {
            href: '/calculators',
            title: 'All calculators',
            text: 'Every free Finfe calculator in one place.',
          },
        ]}
      />
      <h3>Reference</h3>
      <LinkGrid
        items={[
          {
            href: '/glossary',
            title: 'Glossary',
            text: 'Plain definitions of money terms, from net pay and sinking funds to SACCOs and the 4% rule.',
          },
          {
            href: '/blog',
            title: 'Blog',
            text: 'Shorter reads on mobile loans, payday gaps, school fees and paying yourself first.',
          },
        ]}
      />
    </Prose>
  )
}
