import { A, Callout, Example, Ext, Formula, Prose, Steps, Table } from '@/components/marketing/prose'
import type { Article } from '@/content/types'

export const meta: Article['meta'] = {
  slug: 'how-to-make-a-monthly-budget',
  title: 'How to make a monthly budget on a Kenyan salary, step by step',
  seoTitle: 'How to Make a Monthly Budget in Kenya',
  description:
    'Make a monthly budget in five steps: start from take-home pay, list payments first, set spending limits, find your daily amount and review at month end.',
  summary:
    'Start from your take-home pay, not your gross salary. List every payment due this month first (rent, loans, school fees, house help, chama), subtract them to see what’s left after payments, then set limits for food, transport and fun and divide what remains by the days left in the month. Review at month end and adjust.',
  keyTakeaways: [
    'Budget from your net (take-home) pay, the amount that actually reaches your account.',
    'List fixed payments first: what’s left after payments is the money you really get to decide about.',
    'Set a few spending limits for food, transport and fun, and slow down when one reaches 80%.',
    'Divide what remains by the days left in the month to get one simple daily figure.',
    'Review at month end, compare plan with reality, and adjust next month’s plan.',
  ],
  keywords: [
    'how to make a monthly budget',
    'how to budget my salary in Kenya',
    'monthly budget example Kenya',
    'budget for KSh 50,000 salary',
    'personal budget template Kenya',
    'how to plan my salary',
  ],
  published: '2026-11-11',
  updated: '2026-11-11',
  readingMinutes: 8,
  category: 'Budgeting',
  related: ['/calculators/budget', '/guides/how-to-track-expenses', '/budgeting', '/blog/why-you-run-out-of-money-before-payday', '/guides/50-30-20-rule'],
  toc: [
    { id: 'what-is-a-monthly-budget', label: 'What is a monthly budget?' },
    { id: 'step-1-take-home-pay', label: 'Step 1: Start with take-home pay' },
    { id: 'step-2-list-payments', label: 'Step 2: List every payment' },
    { id: 'step-3-set-limits', label: 'Step 3: Set spending limits' },
    { id: 'step-4-daily-amount', label: 'Step 4: Work out your daily amount' },
    { id: 'worked-example', label: 'Worked example: KSh 85,000' },
    { id: 'step-5-review', label: 'Step 5: Review at month end' },
    { id: 'common-mistakes', label: 'Common mistakes' },
  ],
  faq: [
    {
      q: 'Should I budget with my gross or net salary?',
      a: 'Use your net (take-home) salary: the amount that reaches your account after PAYE, NSSF, SHIF, the Housing Levy and any check-off deductions. Budgeting from gross pay means planning to spend money you never receive.',
    },
    {
      q: 'How do I budget for school fees paid once a term?',
      a: 'Treat next term’s fees as a monthly payment. Divide the amount by the number of months until it’s due and set that much aside every month, so the full amount is ready when the term starts.',
    },
    {
      q: 'What if my payments are more than my take-home pay?',
      a: 'Then no spending limit can close the gap; the payments themselves have to change. Stop new borrowing, list every loan, talk to lenders early about repayments you can’t meet, and look for fixed costs you can reduce.',
    },
    {
      q: 'What if my income changes from month to month?',
      a: 'Plan with your lowest normal month and give any extra a job when it arrives, such as your emergency fund or an extra loan repayment. That way a slow month doesn’t break the plan.',
    },
    {
      q: 'How often should I update my budget?',
      a: 'Record spending as it happens, check it weekly, and do a proper review at month end before planning the next month. Most of the improvement comes from that monthly review.',
    },
  ],
  sources: [{ title: 'Kenya Revenue Authority', url: 'https://www.kra.go.ke/', publisher: 'Kenya Revenue Authority' }],
}

export default function Body() {
  return (
    <Prose>
      <p>
        A monthly budget is a plan for every shilling of your salary, made before the month starts. On a Kenyan salary, the most reliable way to build one is
        “payments first”: deal with the money that’s already spoken for, then decide what to do with the rest.
      </p>

      <h2 id="what-is-a-monthly-budget">What is a monthly budget?</h2>
      <p>
        A monthly budget is a list of the money you expect to receive and where each part of it will go. It answers one question: after everything I must
        pay, how much is left for me to live on?
      </p>
      <p>
        Most budgeting advice starts with spending categories. That works when most of your costs are flexible. But for many salaried Kenyans, the month is
        shaped by fixed commitments: rent, a SACCO or bank loan, school fees, house help, a chama contribution, money sent home. Those payments decide what’s
        possible, so they go first.
      </p>
      <Formula label="Left after payments equals take-home pay minus payments due this month. Remaining equals left after payments minus other spending so far.">
        Left after payments = take-home pay − payments due this month
        <br />
        Remaining = left after payments − other spending so far
      </Formula>
      <p>The five steps below build exactly this picture.</p>

      <h2 id="step-1-take-home-pay">Step 1: Start with your take-home pay</h2>
      <p>
        Budget with your take-home pay, the amount that actually lands in your bank account or M-Pesa, not the gross salary in your contract. You can only
        spend what you receive.
      </p>
      <p>
        Your payslip shows the difference. Statutory deductions such as PAYE (income tax, collected by the{' '}
        <Ext href="https://www.kra.go.ke/">Kenya Revenue Authority</Ext>), NSSF, SHIF and the Housing Levy come off before you’re paid. So do any check-off
        deductions you’ve agreed to, such as SACCO contributions, a SACCO loan or a staff loan repaid through payroll. What’s left is your{' '}
        <A href="/glossary#net-pay">net pay</A>.
      </p>
      <Callout tone="tip" title="Don’t count check-off loans twice">
        <p>
          If a loan is already deducted from your payslip, it’s gone before your salary arrives. Leave it out of your list of payments, or you’ll budget for
          it twice. Do keep a note of it, though: it still belongs in your debt plan.
        </p>
      </Callout>
      <p>
        If you have side income from a business, freelance work or rent, include only the part you can rely on. A practical approach is to plan with your
        lowest normal month and treat anything above it as a bonus that gets a job when it arrives.
      </p>

      <h2 id="step-2-list-payments">Step 2: List every payment due this month</h2>
      <p>
        Write down every fixed or committed payment due this month, with the amount and the day it’s due. These are the payments you can’t easily skip or
        shrink.
      </p>
      <ul>
        <li>
          <strong>Housing:</strong> rent, service charge or a mortgage.
        </li>
        <li>
          <strong>Loans:</strong> bank loan, SACCO loan (if it isn’t check-off), shamba loan, car loan, and any mobile loan that falls due this month.
        </li>
        <li>
          <strong>Children:</strong> school fees, school transport, lunch programmes and anything else the school expects this month.
        </li>
        <li>
          <strong>Household:</strong> house help, electricity, water, Wi-Fi and gas.
        </li>
        <li>
          <strong>Commitments to others:</strong> chama contributions, support for parents or siblings, and regular giving at church or mosque if you treat it as
          fixed.
        </li>
        <li>
          <strong>Yourself:</strong> a fixed transfer to savings or your emergency fund. Treating saving as a payment is the idea behind{' '}
          <A href="/blog/pay-yourself-first">paying yourself first</A>.
        </li>
      </ul>
      <p>
        Then look ahead. Some payments don’t come every month: school fees each term, an insurance renewal, land rates, Christmas travel upcountry. Divide the
        next big one by the number of months until it’s due and include that monthly share as a payment. That’s a{' '}
        <A href="/blog/sinking-funds-for-school-fees">sinking fund</A>, and it stops January from wrecking your year.
      </p>
      <p>
        Now subtract. Take-home pay minus this list is your money <strong>left after payments</strong>. If that number is tiny or negative, the budget has done
        its job by showing you early. The fix is on the payments side (see <A href="/guides/how-to-get-out-of-debt">how to get out of debt</A>), not in trying
        to feed a family on KSh 3,000 a month.
      </p>

      <h2 id="step-3-set-limits">Step 3: Set limits for flexible spending</h2>
      <p>
        Split what’s left after payments into a few spending limits for costs that vary day to day: food and groceries, transport, airtime and data, eating out
        and fun, clothes and personal items. Five to eight categories is enough for most people.
      </p>
      <p>
        Base each limit on what you actually spend, not what you wish you spent. If you’ve been <A href="/guides/how-to-track-expenses">tracking your expenses</A>,
        use the average of the last two or three months. If you haven’t, make your best guess and correct it at month end.
      </p>
      <p>
        Leave a buffer for things you can’t predict: a harambee, a birthday, a clinic visit. A budget with no slack tends to break in the first week, and a broken
        budget usually gets abandoned.
      </p>
      <p>
        A limit only helps if you notice when you’re close to it. A simple rule: when a category reaches 80% of its limit, slow down and check how many days are
        left. Finfe warns you at 80% for exactly this reason. If you want a rough check on your overall split, compare it with the{' '}
        <A href="/guides/50-30-20-rule">50/30/20 rule</A>.
      </p>

      <h2 id="step-4-daily-amount">Step 4: Work out what’s left per day</h2>
      <p>
        Divide the money you still have for flexible spending by the number of days left in the month. That gives you one number to live by each day.
      </p>
      <Formula label="Daily amount equals remaining money divided by days left in the month, counting today">Daily amount = remaining ÷ days left in the month (counting today)</Formula>
      <p>
        The daily figure is useful because it moves. Overspend on Saturday and Sunday’s number drops a little; have a quiet week and it rises. It turns a big,
        abstract balance (“I have KSh 33,500”) into a decision you can make at the supermarket (“I have about KSh 1,100 for today”).
      </p>
      <p>
        Finfe’s monthly plan does this calculation for you: tick each payment as you pay it, record other spending, and it shows what’s left and
        roughly how much that is per day for the rest of the month. You can <A href="/signup">start free</A>, or try your numbers first in the{' '}
        <A href="/calculators/budget">budget calculator</A>.
      </p>

      <h2 id="worked-example">Worked example: a KSh 85,000 take-home salary</h2>
      <p>Here’s how the steps look for one illustrative household. Your numbers will differ; the method is the point.</p>
      <Example title="Example: Wanjiru’s monthly budget">
        <p>
          Wanjiru takes home <strong>KSh 85,000</strong> after PAYE, NSSF, SHIF and the Housing Levy. These are her payments due this month:
        </p>
        <Table caption="Payments due this month">
          <thead>
            <tr>
              <th>Payment</th>
              <th className="num">Amount (KSh)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rent</td>
              <td className="num">18,000</td>
            </tr>
            <tr>
              <td>SACCO loan repayment</td>
              <td className="num">8,000</td>
            </tr>
            <tr>
              <td>School fees (monthly share of next term)</td>
              <td className="num">7,000</td>
            </tr>
            <tr>
              <td>House help</td>
              <td className="num">6,000</td>
            </tr>
            <tr>
              <td>Support for parents</td>
              <td className="num">4,000</td>
            </tr>
            <tr>
              <td>Electricity, water and Wi-Fi</td>
              <td className="num">3,500</td>
            </tr>
            <tr>
              <td>Emergency fund</td>
              <td className="num">3,000</td>
            </tr>
            <tr>
              <td>Chama contribution</td>
              <td className="num">2,000</td>
            </tr>
            <tr>
              <td>
                <strong>Total payments</strong>
              </td>
              <td className="num">
                <strong>51,500</strong>
              </td>
            </tr>
          </tbody>
        </Table>
        <p>
          Left after payments: 85,000 − 51,500 = <strong>KSh 33,500</strong>. She splits it into spending limits:
        </p>
        <Table caption="Spending limits for the month">
          <thead>
            <tr>
              <th>Category</th>
              <th className="num">Limit (KSh)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Food and groceries</td>
              <td className="num">15,000</td>
            </tr>
            <tr>
              <td>Transport</td>
              <td className="num">6,000</td>
            </tr>
            <tr>
              <td>Eating out and fun</td>
              <td className="num">3,000</td>
            </tr>
            <tr>
              <td>Clothes and personal</td>
              <td className="num">2,000</td>
            </tr>
            <tr>
              <td>Airtime and data</td>
              <td className="num">1,500</td>
            </tr>
            <tr>
              <td>Buffer for surprises</td>
              <td className="num">6,000</td>
            </tr>
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              <td className="num">
                <strong>33,500</strong>
              </td>
            </tr>
          </tbody>
        </Table>
        <p>
          On the 1st of a 30-day month, her daily amount is 33,500 ÷ 30 ≈ <strong>KSh 1,100</strong>. By the morning of the 16th she has spent KSh 18,500 of
          it, leaving KSh 15,000 for 15 days: <strong>KSh 1,000 a day</strong>. She has spent a little faster than planned, and the daily figure tells her so
          while there’s still half a month to adjust.
        </p>
      </Example>

      <h2 id="step-5-review">Step 5: Review at month end</h2>
      <p>
        At the end of the month, take 20 to 30 minutes to compare what you planned with what actually happened, then adjust next month’s plan. This review is
        where a budget gets better; without it, you repeat the same surprises.
      </p>
      <Steps
        items={[
          {
            title: 'Check every payment',
            body: 'Was each one paid, and for the amount you planned? Note anything that changed, such as a rent increase or a new school charge.',
          },
          {
            title: 'Compare each limit with what you spent',
            body: 'Which categories went over, and why? Separate one-off events from patterns that will repeat.',
          },
          {
            title: 'Adjust the limits honestly',
            body: 'If a limit is too low every month, raise it and find the money elsewhere, rather than pretending it will work next time.',
          },
          {
            title: 'Look three months ahead',
            body: 'Spot heavy months early: school fees in January, a wedding, an insurance renewal. Start their sinking funds now.',
          },
          {
            title: 'Give any surplus a job',
            body: 'Money left over can top up your emergency fund, go towards an extra loan repayment or a goal, before it quietly disappears.',
          },
        ]}
      />

      <h2 id="common-mistakes">What are the most common budgeting mistakes?</h2>
      <p>Most budgets fail for a handful of predictable reasons, and each has a simple fix.</p>
      <ul>
        <li>
          <strong>Budgeting from gross pay.</strong> Always start from what reaches your account.
        </li>
        <li>
          <strong>Forgetting payments that aren’t monthly.</strong> School fees, insurance and annual charges need a monthly sinking fund, or they arrive as a
          crisis.
        </li>
        <li>
          <strong>Counting borrowed money as income.</strong> Fuliza or a mobile loan fills a gap this month but adds a payment to next month. It’s one of the
          main reasons people <A href="/blog/why-you-run-out-of-money-before-payday">run out of money before payday</A>.
        </li>
        <li>
          <strong>No room for family and community.</strong> Requests for help, funerals and harambees are a normal part of life for many people. Give them a
          line in the budget instead of treating each one as a surprise.
        </li>
        <li>
          <strong>Limits that are too strict.</strong> A budget you can’t live with won’t last. Plan honestly first, then cut gradually.
        </li>
        <li>
          <strong>Not tracking.</strong> Without a record of what you spent, the month-end review is guesswork.
        </li>
      </ul>
    </Prose>
  )
}
