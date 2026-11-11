import { A, Callout, Definition, Example, Ext, Prose, Steps, Table } from '@/components/marketing/prose'
import type { Article } from '@/content/types'

export const meta: Article['meta'] = {
  slug: '50-30-20-rule',
  title: 'What is the 50/30/20 rule, and does it work on a Kenyan salary?',
  seoTitle: 'The 50/30/20 Rule on a Kenyan Salary',
  description:
    'The 50/30/20 rule splits take-home pay into 50% needs, 30% wants and 20% savings and debt repayment. Here’s how to apply it in KSh, and when to adjust it.',
  summary:
    'The 50/30/20 rule splits your take-home pay into 50% for needs, 30% for wants and 20% for savings and paying off debt. It was popularised by Elizabeth Warren and Amelia Warren Tyagi in their 2005 book All Your Worth. It’s a useful starting point, but loans, school fees and family support often push needs well above 50% on a Kenyan salary, so a different split is often more realistic.',
  keyTakeaways: [
    '50% needs, 30% wants, 20% savings and extra debt repayment, all from take-home pay.',
    'The rule comes from the 2005 book All Your Worth by Elizabeth Warren and Amelia Warren Tyagi.',
    'Loans, school fees, house help and family support often push needs past 50% on a Kenyan salary.',
    'When needs are higher, cut wants first and protect some saving, with splits such as 60/20/20 or 70/20/10.',
    'Use the split as a check on your plan, not as the plan: list your actual payments first.',
  ],
  keywords: [
    '50/30/20 rule',
    '50 30 20 budget rule Kenya',
    '50/30/20 rule example',
    'how to split my salary',
    'needs wants savings percentage',
    'budget rule of thumb Kenya',
  ],
  published: '2026-11-11',
  updated: '2026-11-11',
  readingMinutes: 7,
  category: 'Budgeting',
  related: ['/calculators/budget', '/guides/how-to-make-a-monthly-budget', '/budgeting', '/guides/how-to-track-expenses', '/blog/pay-yourself-first'],
  toc: [
    { id: 'what-is-it', label: 'What is the 50/30/20 rule?' },
    { id: 'how-to-apply', label: 'How to apply it' },
    { id: 'what-goes-where', label: 'What counts as needs, wants and savings' },
    { id: 'when-it-works', label: 'When it works well' },
    { id: 'kenyan-salary', label: 'Why it often doesn’t fit a Kenyan salary' },
    { id: 'alternative-splits', label: 'Practical alternative splits' },
    { id: 'payments-first', label: 'A better starting point' },
  ],
  faq: [
    {
      q: 'Is the 50/30/20 rule based on gross or net income?',
      a: 'It’s applied to take-home (after-tax) pay. On a Kenyan payslip, that means after PAYE, NSSF, SHIF, the Housing Levy and any other deductions.',
    },
    {
      q: 'Do loan repayments count as needs or savings?',
      a: 'In the original version, required minimum repayments sit with needs and anything you pay above the minimum counts towards the 20%. What matters most is that you count each repayment once and consistently.',
    },
    {
      q: 'Where do school fees go in the 50/30/20 rule?',
      a: 'School fees are a need. Because they’re paid per term, save a monthly share towards each term and count that monthly amount in your needs.',
    },
    {
      q: 'What if my needs are more than 50% of my salary?',
      a: 'That’s common, especially with loans and dependants. Cut wants first, protect at least some saving, and work on reducing fixed costs over time, for example by clearing loans.',
    },
    {
      q: 'Who created the 50/30/20 rule?',
      a: 'It was popularised by Elizabeth Warren and Amelia Warren Tyagi in their 2005 book All Your Worth: The Ultimate Lifetime Money Plan.',
    },
  ],
  sources: [{ title: 'Kenya Revenue Authority', url: 'https://www.kra.go.ke/', publisher: 'Kenya Revenue Authority' }],
}

export default function Body() {
  return (
    <Prose>
      <p>
        The 50/30/20 rule is one of the best-known budgeting rules of thumb. It’s simple, which is its strength, and it’s also why it often needs adjusting
        for a salary that carries loans, school fees and family responsibilities.
      </p>

      <h2 id="what-is-it">What is the 50/30/20 rule?</h2>
      <Definition term="50/30/20 rule">
        a way of dividing take-home pay into three parts: 50% for needs, 30% for wants and 20% for savings and paying off debt.
      </Definition>
      <p>
        The rule was popularised by Elizabeth Warren and Amelia Warren Tyagi, a mother-and-daughter writing team, in their 2005 book{' '}
        <em>All Your Worth: The Ultimate Lifetime Money Plan</em>. They called it a “balanced money formula” and described the three parts as must-haves,
        wants and savings.
      </p>
      <p>
        Its appeal is that you don’t track dozens of categories. You only ask three questions: are my needs within half my pay, are my wants within 30%, and
        am I putting at least 20% towards my future?
      </p>

      <h2 id="how-to-apply">How do you apply 50/30/20 to your take-home pay?</h2>
      <p>
        Multiply your take-home pay by 0.5, 0.3 and 0.2, then compare those targets with what you actually spend in each group. Always start from take-home pay,
        not gross salary.
      </p>
      <Steps
        items={[
          {
            title: 'Find your take-home pay',
            body: (
              <>
                This is what reaches your account after PAYE (collected by the <Ext href="https://www.kra.go.ke/">Kenya Revenue Authority</Ext>), NSSF, SHIF, the
                Housing Levy and any check-off deductions.
              </>
            ),
          },
          {
            title: 'Work out the three targets',
            body: 'Half for needs, 30% for wants, 20% for savings and extra debt repayment.',
          },
          {
            title: 'Sort your spending into the three groups',
            body: 'Use last month’s records, or your planned payments and spending limits for this month.',
          },
          {
            title: 'Compare and adjust',
            body: 'Where a group is over its target, decide whether to cut it or to accept a different split for now.',
          },
        ]}
      />
      <Example title="Example: KSh 80,000 take-home pay">
        <Table caption="The 50/30/20 split of KSh 80,000">
          <thead>
            <tr>
              <th>Group</th>
              <th className="num">Share</th>
              <th className="num">Amount (KSh)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Needs</td>
              <td className="num">50%</td>
              <td className="num">40,000</td>
            </tr>
            <tr>
              <td>Wants</td>
              <td className="num">30%</td>
              <td className="num">24,000</td>
            </tr>
            <tr>
              <td>Savings and extra debt repayment</td>
              <td className="num">20%</td>
              <td className="num">16,000</td>
            </tr>
          </tbody>
        </Table>
      </Example>

      <h2 id="what-goes-where">What counts as needs, wants and savings?</h2>
      <p>
        Needs are costs you’d have to pay even in a hard month; wants are things you could cut or downgrade; savings covers anything that builds your future
        or reduces debt faster. Some items sit in a grey zone, so decide once and stay consistent.
      </p>
      <Table caption="Sorting common Kenyan expenses">
        <thead>
          <tr>
            <th>Needs (50%)</th>
            <th>Wants (30%)</th>
            <th>Savings and debt (20%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rent and utilities</td>
            <td>Eating out and takeaways</td>
            <td>Emergency fund</td>
          </tr>
          <tr>
            <td>Basic food and groceries</td>
            <td>Entertainment and outings</td>
            <td>Extra repayments above the minimum</td>
          </tr>
          <tr>
            <td>Transport to work</td>
            <td>TV and streaming subscriptions</td>
            <td>SACCO deposits and voluntary pension top-ups</td>
          </tr>
          <tr>
            <td>School fees (monthly share)</td>
            <td>Clothes beyond the basics</td>
            <td>Sinking funds for future goals</td>
          </tr>
          <tr>
            <td>Health costs and cover</td>
            <td>Upgrades: a newer phone, a pricier brand</td>
            <td>Investments</td>
          </tr>
          <tr>
            <td>Minimum loan repayments</td>
            <td>Holidays and gifts</td>
            <td></td>
          </tr>
        </tbody>
      </Table>
      <p>
        House help and support for parents or siblings are needs for many households, even if a textbook might not list them. Be honest about what you would
        keep paying in a tough month; see <A href="/glossary#needs-and-wants">needs and wants</A> in the glossary for more on the grey areas.
      </p>

      <h2 id="when-it-works">When does the 50/30/20 rule work well?</h2>
      <p>
        It works best when your fixed costs are modest and your income is steady: for example, early in your career with no loans and no dependants, or later
        on, once loans are cleared and children have finished school.
      </p>
      <p>It’s also useful as a quick health check, even if you never follow it exactly. It can reveal three warning signs:</p>
      <ul>
        <li>
          <strong>Wants well above 30%</strong> while you’re still borrowing to get through the month. That’s usually the quickest place to find money.
        </li>
        <li>
          <strong>Savings at zero</strong> month after month. Without any saving, each surprise becomes a new loan.
        </li>
        <li>
          <strong>Needs creeping up</strong> every time your pay rises: a bigger house, a newer car, another loan. This is often called lifestyle creep.
        </li>
      </ul>
      <p>
        Finfe tags every category as a need, want, debt repayment, saving or investment, and its yearly report (part of Pro) uses the same yardstick: keep wants
        under 30% and put at least 20% into debt, savings and investments. The app counts all loan repayments in that 20% group, so your figures may look a
        little different from the book’s version, where minimum repayments sit with needs.
      </p>

      <h2 id="kenyan-salary">Why does 50/30/20 often not fit a Kenyan salary?</h2>
      <p>
        Because many salaried Kenyans carry fixed commitments that push needs well past 50% before any wants are counted. The rule assumes your must-haves fit
        in half your pay; for many households, they simply don’t. Tax and statutory deductions aren’t the issue, since the rule already works on take-home
        pay. The pressure comes from what has to be paid after that.
      </p>
      <ul>
        <li>
          <strong>Loan repayments:</strong> SACCO, bank and shamba loans can take a large share of pay for years.
        </li>
        <li>
          <strong>School fees:</strong> often one of the biggest costs in the household, even when spread across the year.
        </li>
        <li>
          <strong>Family support:</strong> regular help for parents, siblings or relatives is a real obligation, not a want.
        </li>
        <li>
          <strong>House help and childcare:</strong> often what makes it possible for both parents to work.
        </li>
        <li>
          <strong>Rent and transport:</strong> in big towns, these alone can take a large part of a modest salary.
        </li>
      </ul>
      <Example title="Example: Njeri’s KSh 80,000, with real commitments">
        <p>
          Njeri’s needs: rent 16,000, food 12,000, transport 5,000, utilities, airtime and data 4,000, school fees (monthly share) 6,000, house help 5,000, family
          support 4,000 and minimum loan repayments 8,000. That’s <strong>KSh 60,000, or 75%</strong> of take-home pay.
        </p>
        <p>
          That leaves KSh 20,000. If she keeps wants to KSh 8,000 (10%) and saves KSh 12,000 (15%), her real split is <strong>75/10/15</strong>. Nothing is
          wrong with her budget; it just doesn’t look like 50/30/20.
        </p>
      </Example>
      <Callout tone="tip" title="Don’t squeeze needs into 50% on paper">
        <p>
          Forcing your numbers into 50/30/20 by under-budgeting food or leaving out school fees only makes the plan fail in week two. Start from what you
          really pay, then use the split to see where you can move over time.
        </p>
      </Callout>

      <h2 id="alternative-splits">What are practical alternative splits?</h2>
      <p>
        If your needs are above 50%, cut wants first and protect at least some saving. The splits below are common adjustments rather than official rules;
        pick the one closest to your situation and aim to move towards a lower needs share over time.
      </p>
      <Table caption="Alternative splits on KSh 80,000 take-home pay">
        <thead>
          <tr>
            <th>Split</th>
            <th className="num">Needs (KSh)</th>
            <th className="num">Wants (KSh)</th>
            <th className="num">Savings and debt (KSh)</th>
            <th>When it fits</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>50/30/20</td>
            <td className="num">40,000</td>
            <td className="num">24,000</td>
            <td className="num">16,000</td>
            <td>Modest fixed costs, few or no loans</td>
          </tr>
          <tr>
            <td>60/20/20</td>
            <td className="num">48,000</td>
            <td className="num">16,000</td>
            <td className="num">16,000</td>
            <td>Higher rent or school fees, still saving a fifth</td>
          </tr>
          <tr>
            <td>70/20/10</td>
            <td className="num">56,000</td>
            <td className="num">16,000</td>
            <td className="num">8,000</td>
            <td>Heavy fixed costs; protects a 10% saving habit</td>
          </tr>
          <tr>
            <td>70/10/20</td>
            <td className="num">56,000</td>
            <td className="num">8,000</td>
            <td className="num">16,000</td>
            <td>Clearing debt fast: wants cut back hard for a while</td>
          </tr>
          <tr>
            <td>80/10/10</td>
            <td className="num">64,000</td>
            <td className="num">8,000</td>
            <td className="num">8,000</td>
            <td>A temporary squeeze, such as a heavy loan year; aim to move up</td>
          </tr>
        </tbody>
      </Table>
      <p>
        Whatever split you choose, try to keep the savings share above zero, even if it’s only an emergency fund contribution. That’s what stops the next
        surprise from becoming a new loan. <A href="/blog/pay-yourself-first">Paying yourself first</A> makes that easier.
      </p>

      <h2 id="payments-first">A better starting point: payments first, then the split</h2>
      <p>
        Use 50/30/20 as a check, not as the plan itself. Start by listing every payment due this month, see what’s left after payments, set your spending
        limits, and only then look at the percentages.
      </p>
      <p>
        That order matters because your payments are mostly fixed this month, while the split shows the direction to move in. In the example above, once the
        KSh 8,000 loan is cleared, needs fall to KSh 52,000 (65%). Moving half the freed money to wants and half to savings gives{' '}
        <strong>65/15/20</strong>. Each cleared loan moves you closer to the classic split without any pretending.
      </p>
      <p>
        Our guide on <A href="/guides/how-to-make-a-monthly-budget">how to make a monthly budget</A> walks through the payments-first method step by step.
        Finfe’s monthly plan is built the same way and is <A href="/signup">free to start</A>, or you can try the{' '}
        <A href="/calculators/budget">budget calculator</A> first.
      </p>
    </Prose>
  )
}
