import { A, Callout, Example, Ext, Formula, LinkGrid, Prose, Steps, Table } from '@/components/marketing/prose'
import type { Article } from '@/content/types'

export const meta: Article['meta'] = {
  slug: 'budgeting',
  title: 'Budgeting: how to plan your salary so it lasts the month',
  seoTitle: 'Budgeting: Make Your Salary Last the Month',
  description:
    'How to budget a salary in Kenya: compare budgeting methods, plan payments first, set spending limits, use a daily allowance and prepare for heavy months.',
  summary:
    'Budgeting means deciding before the month starts where each shilling of your net pay will go, then checking as the month runs. For salaries that carry loans, rent and school fees, the most reliable method is to list every payment due first, see what is left after payments, and split that into spending limits and a daily allowance.',
  keyTakeaways: [
    'A budget is a plan for your net pay, made before the month starts and checked while it runs.',
    'A payments-first plan lists loans, rent, school fees and other fixed payments before anything else, so you see what is truly free to spend.',
    'Spending limits with an early warning at about 80% let you slow down before you overspend, not after.',
    'Daily allowance = what remains ÷ days left in the month, counting today.',
    'Spread heavy months such as school-fee months over the months before them, and review your budget weekly and at month end.',
  ],
  keywords: [
    'how to budget my salary in Kenya',
    'monthly budget Kenya',
    'budgeting methods compared',
    'how to make money last until payday',
    'budget planner Kenya',
    'zero-based budget vs 50/30/20',
    'how to budget with loans',
  ],
  published: '2026-11-11',
  updated: '2026-11-11',
  readingMinutes: 9,
  category: 'Budgeting',
  related: [
    '/guides/how-to-make-a-monthly-budget',
    '/calculators/budget',
    '/guides/50-30-20-rule',
    '/expense-tracker',
    '/blog/why-you-run-out-of-money-before-payday',
  ],
  toc: [
    { id: 'what-is-a-budget', label: 'What is a budget?' },
    { id: 'methods', label: 'Budgeting methods compared' },
    { id: 'payments-first', label: 'Why plan payments first?' },
    { id: 'build', label: 'Build a payments-first budget' },
    { id: 'limits', label: 'Spending limits and early warnings' },
    { id: 'daily-allowance', label: 'Your daily allowance' },
    { id: 'heavy-months', label: 'Heavy and irregular months' },
    { id: 'review', label: 'A budget review routine' },
    { id: 'explore', label: 'Budgeting guides and tools' },
  ],
  faq: [
    {
      q: 'What is the best budgeting method for a salary in Kenya?',
      a: 'The best method is the one you will keep up. For salaries that carry loans, rent and school fees, a payments-first plan works well: list every payment due this month, subtract it from net pay, and budget only what is left.',
    },
    {
      q: 'How do I make my salary last the whole month?',
      a: 'Plan every payment before the month starts, set limits for food, transport and other spending, and check a daily allowance in the second half of the month. Spread lumpy costs like school fees over several months so they never land all at once.',
    },
    {
      q: 'Does the 50/30/20 rule work in Kenya?',
      a: 'It works as a quick check of where your money goes. If rent, loans and school fees already take more than half your pay, the 50% for needs won’t fit, so plan payments first and treat 50/30/20 as a direction to move towards.',
    },
    {
      q: 'How do I calculate my daily spending allowance?',
      a: 'Take what remains for the month after payments and other spending so far, and divide it by the number of days left, counting today. For example, KSh 9,000 with 13 days left is about KSh 690 a day.',
    },
    {
      q: 'How often should I review my budget?',
      a: 'Record spending daily, spend about ten minutes each week checking your limits and payments, and do a longer review at month end to compare plan with actual and set next month’s limits.',
    },
  ],
  sources: [
    { title: 'Kenya Revenue Authority', url: 'https://www.kra.go.ke/', publisher: 'Kenya Revenue Authority' },
    { title: 'Consumer Financial Protection Bureau', url: 'https://www.consumerfinance.gov/', publisher: 'Consumer Financial Protection Bureau' },
  ],
}

export default function Body() {
  return (
    <Prose>
      <h2 id="what-is-a-budget">What is a budget?</h2>
      <p>
        A budget is a plan for your net pay, made before the month starts: how much goes to payments, how much to everyday spending and how
        much you keep. As the month runs, you compare what actually happens with the plan and adjust.
      </p>
      <p>
        A budget isn’t a punishment or a list of things you can’t have. It is the difference between deciding where your money goes and
        finding out at month end where it went. People who budget don’t necessarily earn more. They are just surprised less often.
      </p>
      <p>
        Every budget, whatever the method, rests on one honest number: your <A href="/glossary#net-pay">net pay</A>. That is the amount that
        reaches your account after PAYE, NSSF, SHIF, the Housing Levy and any loan deducted at source. The{' '}
        <Ext href="https://www.kra.go.ke/">Kenya Revenue Authority</Ext> explains how PAYE is worked out if your payslip is unclear.
      </p>

      <h2 id="methods">Which budgeting method should you use?</h2>
      <p>
        Use the method you will actually keep up. For most salaried people with loans and school fees, a payments-first plan works best,
        because it starts with the money that is already committed. The table compares the five most common methods.
      </p>
      <Table caption="Five budgeting methods compared">
        <thead>
          <tr>
            <th>Method</th>
            <th>How it works</th>
            <th>Works well for</th>
            <th>Watch out for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Payments-first plan</td>
            <td>List every payment due this month, subtract the total from net pay, then set limits for what is left.</td>
            <td>Salaries carrying loans, rent, school fees, house help and chama contributions.</td>
            <td>Needs a complete, honest list that you update when payments change.</td>
          </tr>
          <tr>
            <td>
              <A href="/glossary#zero-based-budget">Zero-based budget</A>
            </td>
            <td>Give every shilling a job until income minus everything allocated equals zero.</td>
            <td>Detail-minded people who want full control.</td>
            <td>Takes time every month and can feel rigid.</td>
          </tr>
          <tr>
            <td>
              <A href="/guides/50-30-20-rule">50/30/20 rule</A>
            </td>
            <td>Split net pay into 50% needs, 30% wants and 20% savings and extra debt payments.</td>
            <td>A quick first check of where your money goes.</td>
            <td>If rent, loans and school fees already take more than half your pay, the split doesn’t fit.</td>
          </tr>
          <tr>
            <td>Envelope method</td>
            <td>Put a fixed amount for each category in its own envelope, wallet or account. When it’s empty, you stop.</td>
            <td>People who overspend in one or two categories, such as food or going out.</td>
            <td>Cash envelopes are awkward when most spending goes through M-Pesa. Use separate accounts or limits instead.</td>
          </tr>
          <tr>
            <td>
              <A href="/glossary#pay-yourself-first">Pay yourself first</A>
            </td>
            <td>Move savings out on payday, then spend the rest freely.</td>
            <td>People who mean to save but never have anything left.</td>
            <td>Doesn’t control spending. If payments aren’t planned, you may end up raiding the savings.</td>
          </tr>
        </tbody>
      </Table>
      <p>
        The methods combine well. A practical mix is payments-first for structure, pay-yourself-first for savings (treat your saving as one
        of the payments) and envelope-style limits for the categories where you tend to overspend.
      </p>

      <h2 id="payments-first">Why plan payments first?</h2>
      <p>
        Because on most salaries, a large share of the money is committed before payday. Percentage methods ask “what share should go to
        needs?” A payments-first plan asks “what do I already owe this month, and what is left?” The second question matches how a salary
        carrying loans and school fees really behaves.
      </p>
      <p>
        It also fixes the most common budgeting mistake: treating the whole salary as available. If net pay is KSh 70,000 but KSh 48,000 is
        owed to the landlord, the SACCO, the school and the house help, you have KSh 22,000 to run the month. Seeing that on day one changes
        every decision after it.
      </p>
      <Formula label="What is left after payments equals net pay minus payments; remaining equals what is left after payments minus other spending">
        What’s left after payments = net pay − this month’s payments
        <br />
        Remaining = what’s left after payments − other spending so far
      </Formula>
      <Callout tone="info" title="Loans deducted from your payslip">
        <p>
          If a SACCO or bank loan is deducted by your employer (check-off), it is already out of your net pay. Don’t list it again as a
          payment, or you will count it twice. Do keep a record of the loan, so you still know your total debt and your debt-free date.
        </p>
      </Callout>

      <h2 id="build">How do you build a payments-first budget?</h2>
      <p>
        It takes six steps: about half an hour the first time and ten minutes a month after that. The step-by-step guide on{' '}
        <A href="/guides/how-to-make-a-monthly-budget">how to make a monthly budget</A> goes into more detail.
      </p>
      <Steps
        items={[
          {
            title: 'Write down your net pay',
            body: (
              <>
                Use the amount that lands in your account, not the gross figure in your contract. If your pay varies, use a cautious figure,
                such as your lowest recent month.
              </>
            ),
          },
          {
            title: 'List every payment due this month',
            body: (
              <>
                Rent, loan repayments, school fees, house help, chama, insurance, electricity and water, internet and support for family.
                Note each due date.
              </>
            ),
          },
          {
            title: 'Work out what’s left after payments',
            body: (
              <>
                Subtract the total from net pay. If the answer is negative, you find out now rather than on the 25th, while there is still
                time to cut, move or renegotiate a payment.
              </>
            ),
          },
          {
            title: 'Set limits for everyday spending',
            body: (
              <>
                Split what’s left into limits for food, transport, airtime and data, personal spending and fun, and decide your saving
                amount. Five to eight categories are easier to manage than twenty.
              </>
            ),
          },
          {
            title: 'Tick payments and record spending',
            body: (
              <>
                Tick each payment when it’s made and record other spending the same day. See{' '}
                <A href="/guides/how-to-track-expenses">how to track expenses</A>.
              </>
            ),
          },
          {
            title: 'Check your daily allowance',
            body: <>Divide what remains by the days left in the month. That single number tells you whether today’s spending fits the plan.</>,
          },
        ]}
      />
      <Example title="Illustration: a KSh 70,000 net salary">
        <Table caption="A payments-first plan for one month">
          <thead>
            <tr>
              <th>Item</th>
              <th className="num">KSh</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Net pay</td>
              <td className="num">70,000</td>
            </tr>
            <tr>
              <td>Payments: rent, SACCO loan, school fees set-aside, house help, chama, family support</td>
              <td className="num">−48,000</td>
            </tr>
            <tr>
              <td>
                <strong>What’s left after payments</strong>
              </td>
              <td className="num">
                <strong>22,000</strong>
              </td>
            </tr>
            <tr>
              <td>Limit: food and groceries</td>
              <td className="num">10,000</td>
            </tr>
            <tr>
              <td>Limit: transport</td>
              <td className="num">5,000</td>
            </tr>
            <tr>
              <td>Saving (paid on payday)</td>
              <td className="num">3,500</td>
            </tr>
            <tr>
              <td>Limit: personal and fun</td>
              <td className="num">2,000</td>
            </tr>
            <tr>
              <td>Limit: airtime and data</td>
              <td className="num">1,500</td>
            </tr>
          </tbody>
        </Table>
        <p>
          Every shilling has a place, and saving starts at 5% of net pay. When the SACCO loan ends, moving part of its repayment into saving
          lifts that towards 10% without changing daily life.
        </p>
      </Example>
      <p>
        In Finfe you enter each repeating payment once, monthly or only in certain months such as school-fee months, and each
        month’s <A href="/signup">plan</A> fills itself in. You can try the numbers first in the{' '}
        <A href="/calculators/budget">budget calculator</A>.
      </p>

      <h2 id="limits">How do spending limits and early warnings work?</h2>
      <p>
        A spending limit is the most you plan to spend in a category this month. An early warning tells you when you have used most of it
        (80% is a common trigger), so you can slow down while something is still left, rather than finding out after you’ve gone over.
      </p>
      <Example title="Illustration: a KSh 10,000 food limit">
        <p>
          With a warning at 80%, the alert comes when food spending reaches KSh 8,000. If that happens on the 14th, you know the rest of the
          month must run on KSh 2,000, or that you need to move money from another limit, such as fun, before the gap turns into a loan.
        </p>
      </Example>
      <ul>
        <li>
          <strong>Set limits from real spending.</strong> Track a month first, then set limits a little below what you actually spent.
        </li>
        <li>
          <strong>A limit you always break isn’t a plan.</strong> If a limit fails three months running, raise it and take the money from
          somewhere else.
        </li>
        <li>
          <strong>Move money, don’t borrow it.</strong> Shifting KSh 1,000 from fun to food is a budget working as it should.
        </li>
      </ul>
      <p>
        Finfe sets its warning at 80% of each limit by default (you can change this in settings) and shows you when an expense you
        are recording would push a category over its limit. Recording spending quickly is what makes the warnings useful, which is why the{' '}
        <A href="/expense-tracker">expense tracker</A> is built for speed.
      </p>

      <h2 id="daily-allowance">What is a daily allowance, and how do you work it out?</h2>
      <p>
        Your daily allowance is how much you can spend each day for the rest of the month and still finish on plan. Divide what remains by
        the number of days left, counting today.
      </p>
      <Formula label="Daily allowance equals remaining divided by days left in the month including today">
        Daily allowance = remaining ÷ days left in the month (including today)
      </Formula>
      <Example title="Illustration: the 18th of a 30-day month">
        <p>
          All this month’s payments are made and KSh 9,000 remains for everything else. Days left, counting today: 30 − 18 + 1 = 13. Daily
          allowance: KSh 9,000 ÷ 13 ≈ KSh 690 a day.
        </p>
        <p>
          If you spend KSh 1,500 today, tomorrow’s allowance falls to KSh 625 (KSh 7,500 ÷ 12 days). Spending less than the allowance builds
          a cushion for the last few days.
        </p>
      </Example>
      <p>
        Make sure “remaining” already excludes payments you haven’t made yet. Otherwise the allowance looks bigger than it is. The daily
        allowance matters most in the second half of the month, which is exactly when most people run short: see{' '}
        <A href="/blog/why-you-run-out-of-money-before-payday">why you run out of money before payday</A>.
      </p>

      <h2 id="heavy-months">How do you handle heavy months like school-fee months?</h2>
      <p>
        Look ahead and spread them out. A heavy month is one where payments are much bigger than usual: school fees at the start of a term,
        an annual insurance renewal, December travel. Spot them early and set aside a fixed amount each month, so the heavy month becomes an
        ordinary one.
      </p>
      <Formula label="Monthly set-aside equals the cost divided by the number of salaries before it is due">
        Monthly set-aside = cost ÷ salaries left before it is due
      </Formula>
      <Example title="Illustration: school fees due in January">
        <p>
          It is September and KSh 36,000 in fees is due in January. There are four salaries before then (September to December), so set
          aside KSh 9,000 a month. Add it to your payments list like any other bill.
        </p>
      </Example>
      <p>
        This kind of set-aside is called a <A href="/glossary#sinking-fund">sinking fund</A>, and{' '}
        <A href="/blog/sinking-funds-for-school-fees">sinking funds for school fees</A> walks through it for a full school year.
      </p>
      <p>
        Irregular months work the other way too: months where income dips because of no overtime, unpaid leave or a late salary. Plan that
        month with the lower figure. Finfe lets you change your expected income for a single month, or from a given month onwards,
        and its monthly plan shows the next six months side by side, so a month that would leave you short shows up long before it arrives.
      </p>

      <h2 id="review">How often should you review your budget?</h2>
      <p>
        Briefly and often: a minute or two a day, ten minutes a week and half an hour at month end. Small, regular checks catch problems
        while they’re still small.
      </p>
      <Table caption="A simple budget review routine">
        <thead>
          <tr>
            <th>When</th>
            <th>What to do</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Payday</td>
            <td>Pay yourself first, make or schedule the fixed payments, and confirm net pay matches the plan.</td>
            <td>15 minutes</td>
          </tr>
          <tr>
            <td>Every day</td>
            <td>Record what you spent and glance at your daily allowance.</td>
            <td>1–2 minutes</td>
          </tr>
          <tr>
            <td>Every week</td>
            <td>Check limits close to their warning, tick payments made and move money between limits if needed.</td>
            <td>10 minutes</td>
          </tr>
          <tr>
            <td>Month end</td>
            <td>Compare plan with actual, note what went over and why, set next month’s limits and look at the months ahead.</td>
            <td>30 minutes</td>
          </tr>
        </tbody>
      </Table>
      <p>
        The month-end review is where budgets get better. Each month your limits become more realistic and your payments list more complete.
        Finfe Pro’s monthly report card puts plan and actual side by side and gives the month a score out of 100. If you prefer
        paper, the US <Ext href="https://www.consumerfinance.gov/">Consumer Financial Protection Bureau</Ext> publishes free worksheets for
        tracking spending and planning a budget, which work just as well in shillings.
      </p>

      <h2 id="explore">Budgeting guides and tools</h2>
      <p>Go deeper into each part of budgeting, or try your own numbers.</p>
      <LinkGrid
        items={[
          {
            href: '/guides/how-to-make-a-monthly-budget',
            title: 'How to make a monthly budget',
            text: 'A step-by-step walkthrough of your first payments-first budget.',
          },
          {
            href: '/calculators/budget',
            title: 'Budget calculator',
            text: 'Try your own numbers and see what’s left after payments.',
          },
          {
            href: '/guides/50-30-20-rule',
            title: 'The 50/30/20 rule',
            text: 'How the split works, and how to adapt it when payments take more than half your pay.',
          },
          {
            href: '/guides/how-to-track-expenses',
            title: 'How to track expenses',
            text: 'A simple daily routine for recording what you spend.',
          },
          {
            href: '/expense-tracker',
            title: 'Expense tracker',
            text: 'Record spending in seconds and get a warning before you go over a limit.',
          },
          {
            href: '/blog/why-you-run-out-of-money-before-payday',
            title: 'Why you run out before payday',
            text: 'The common reasons salaries run short, and how to fix each one.',
          },
          {
            href: '/blog/sinking-funds-for-school-fees',
            title: 'Sinking funds for school fees',
            text: 'Turn each term’s fees into a steady monthly amount.',
          },
          {
            href: '/personal-finance',
            title: 'Personal finance basics',
            text: 'Where budgeting fits among saving, borrowing, protecting and investing.',
          },
        ]}
      />
    </Prose>
  )
}
