import { A, Callout, Definition, Example, Ext, Formula, Prose, Table } from '@/components/marketing/prose'
import type { Article } from '@/content/types'

export const meta: Article['meta'] = {
  slug: 'debt-avalanche-vs-snowball',
  title: 'Debt avalanche vs debt snowball: which should you use?',
  seoTitle: 'Debt Avalanche vs Debt Snowball',
  description:
    'The debt avalanche pays the highest-interest loan first and costs the least interest; the snowball clears the smallest balance first for quicker wins.',
  summary:
    'Both methods pay the minimum on every loan and put all extra money on one target loan. The debt avalanche targets the highest interest rate first and, mathematically, costs the least interest; the debt snowball targets the smallest balance first, which can cost more but clears a loan sooner.',
  keyTakeaways: [
    'Both methods pay minimums on every loan, send extra to one target and roll cleared payments onto the next.',
    'Avalanche (highest rate first) keeps total interest lowest when rates are fixed and payments stay the same.',
    'Snowball (smallest balance first) usually clears the first loan sooner, which many people find motivating.',
    'The gap between them grows with the difference in interest rates; paying extra at all matters most.',
    'Finfe’s “pay extra” simulator uses the avalanche order.',
  ],
  keywords: [
    'debt avalanche vs snowball',
    'debt snowball method',
    'debt avalanche method',
    'which loan to pay off first',
    'pay off multiple loans Kenya',
    'best way to pay off debt',
  ],
  published: '2026-11-11',
  updated: '2026-11-11',
  readingMinutes: 7,
  category: 'Debt',
  related: ['/calculators/debt-payoff', '/debt-management', '/guides/how-to-get-out-of-debt', '/blog/true-cost-of-mobile-loans'],
  toc: [
    { id: 'how-both-work', label: 'How both methods work' },
    { id: 'avalanche', label: 'What is the debt avalanche?' },
    { id: 'snowball', label: 'What is the debt snowball?' },
    { id: 'comparison', label: 'Side-by-side comparison' },
    { id: 'worked-example', label: 'Worked example: three loans' },
    { id: 'what-it-shows', label: 'What the example shows' },
    { id: 'which-to-choose', label: 'Which method to choose' },
    { id: 'fees-not-interest', label: 'Comparing loans that charge fees' },
    { id: 'simulator', label: 'How our simulator works' },
  ],
  faq: [
    {
      q: 'Is the debt avalanche or the snowball better?',
      a: 'The avalanche costs less interest, so it’s better on paper. The snowball gives quicker wins, which helps some people stick with the plan; the best method is the one you’ll keep following.',
    },
    {
      q: 'How much more does the snowball method cost?',
      a: 'It depends on your loans. If your smallest loans are also your most expensive, the two methods are identical; if your small loans are cheap and your big ones costly, the snowball costs more.',
    },
    {
      q: 'Which loan should I pay first if two have the same interest rate?',
      a: 'Pay the smaller balance first. You’ll clear it sooner and free up its payment for the next loan, at no extra cost.',
    },
    {
      q: 'Can I switch from the snowball to the avalanche halfway?',
      a: 'Yes. Many people clear one or two small loans first for momentum, then switch to highest interest first. What matters most is that you keep paying extra.',
    },
    {
      q: 'Which method does Finfe use?',
      a: 'The “pay extra” simulator uses the avalanche method: extra money goes to the highest-interest loan first, because that keeps total interest lowest.',
    },
  ],
  sources: [{ title: 'Central Bank of Kenya', url: 'https://www.centralbank.go.ke/', publisher: 'Central Bank of Kenya' }],
}

export default function Body() {
  return (
    <Prose>
      <p>
        If you have more than one loan and some money to pay beyond the minimums, you have to decide which loan gets the extra. The two best-known answers are
        the debt avalanche and the debt snowball. They share the same structure and differ in just one choice: the order.
      </p>

      <h2 id="how-both-work">How do both methods work?</h2>
      <p>Both methods follow the same four rules. Only the order of targets in step three is different.</p>
      <ol>
        <li>List every loan with its balance, interest rate and minimum payment.</li>
        <li>Pay the minimum on every loan, every month.</li>
        <li>Put all your extra money on one target loan.</li>
        <li>When the target is cleared, add its whole payment to the next target, and repeat.</li>
      </ol>
      <p>
        The fourth rule is what makes either method speed up over time: your total monthly repayment stays the same, but more of it lands on fewer loans. Our
        step-by-step guide on <A href="/guides/how-to-get-out-of-debt">how to get out of debt</A> covers the groundwork, such as stopping new borrowing.
      </p>

      <h2 id="avalanche">What is the debt avalanche?</h2>
      <Definition term="Debt avalanche">
        a repayment order that puts all extra money on the loan with the highest interest rate first, then the next highest, and so on. See the{' '}
        <A href="/glossary#debt-avalanche">glossary</A>.
      </Definition>
      <p>
        Interest is charged on balances, so every shilling that clears your most expensive balance stops the fastest-growing interest first. When rates are
        fixed and you pay the same total each month, this order keeps the total interest you pay to a minimum.
      </p>
      <p>The downside: if your most expensive loan is also a large one, your first cleared loan can be many months away.</p>

      <h2 id="snowball">What is the debt snowball?</h2>
      <Definition term="Debt snowball">
        a repayment order that puts all extra money on the loan with the smallest balance first, whatever its interest rate. See the{' '}
        <A href="/glossary#debt-snowball">glossary</A>.
      </Definition>
      <p>
        The appeal is speed of the first win. You clear a loan quickly: one fewer lender, one fewer payment date, one fewer message reminding you what you owe.
        Many people find that early success helps them keep going.
      </p>
      <p>The downside: if your small loans are cheap and your big loans expensive, the expensive balances sit longer and you pay more interest.</p>

      <h2 id="comparison">Avalanche vs snowball at a glance</h2>
      <Table caption="Debt avalanche and debt snowball compared">
        <thead>
          <tr>
            <th>Aspect</th>
            <th>Debt avalanche</th>
            <th>Debt snowball</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>First target</td>
            <td>Highest interest rate</td>
            <td>Smallest balance</td>
          </tr>
          <tr>
            <td>Total interest</td>
            <td>Lowest</td>
            <td>Same or higher</td>
          </tr>
          <tr>
            <td>First loan cleared</td>
            <td>Can take longer</td>
            <td>Usually sooner</td>
          </tr>
          <tr>
            <td>Motivation comes from</td>
            <td>Knowing you’re paying the least</td>
            <td>Seeing loans disappear</td>
          </tr>
          <tr>
            <td>Works best when</td>
            <td>Interest rates differ a lot</td>
            <td>You have several small loans, or need a win to stay on track</td>
          </tr>
          <tr>
            <td>Main risk</td>
            <td>Losing heart before the first loan is cleared</td>
            <td>Paying more interest than you need to</td>
          </tr>
        </tbody>
      </Table>

      <h2 id="worked-example">Worked example: three loans and KSh 5,000 extra a month</h2>
      <p>Here are both methods applied to the same three illustrative loans, with the same total payment every month.</p>
      <Example title="Example: Achieng’s three loans">
        <Table caption="The loans">
          <thead>
            <tr>
              <th>Loan</th>
              <th className="num">Balance (KSh)</th>
              <th className="num">Interest a year</th>
              <th className="num">Minimum a month (KSh)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SACCO loan</td>
              <td className="num">40,000</td>
              <td className="num">12%</td>
              <td className="num">2,000</td>
            </tr>
            <tr>
              <td>Bank loan</td>
              <td className="num">200,000</td>
              <td className="num">18%</td>
              <td className="num">7,000</td>
            </tr>
            <tr>
              <td>Digital lender loan</td>
              <td className="num">100,000</td>
              <td className="num">36%</td>
              <td className="num">4,000</td>
            </tr>
          </tbody>
        </Table>
        <p>
          Her minimums add up to KSh 13,000. She adds <strong>KSh 5,000</strong> extra, so she pays <strong>KSh 18,000</strong> a month in total.
        </p>
        <p>
          <strong>Avalanche</strong> (digital lender → bank → SACCO): the digital loan gets KSh 9,000 a month and is cleared in month 14. Its payment then moves
          to the bank loan, which gets KSh 16,000 a month. The SACCO loan finishes on its own minimum in month 23, and the bank loan is cleared in month 24.
        </p>
        <p>
          <strong>Snowball</strong> (SACCO → digital lender → bank): the SACCO loan gets KSh 7,000 a month and is cleared in month 6. Its payment moves to the
          digital loan, which gets KSh 11,000 a month and is cleared in month 16. The full KSh 18,000 then goes to the bank loan, cleared in month 24.
        </p>
        <Table caption="Results (rounded)">
          <thead>
            <tr>
              <th>Result</th>
              <th>Avalanche</th>
              <th>Snowball</th>
              <th>Minimums only</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>First loan cleared</td>
              <td>Month 14</td>
              <td>Month 6</td>
              <td>Month 23</td>
            </tr>
            <tr>
              <td>All loans cleared</td>
              <td>Month 24</td>
              <td>Month 24</td>
              <td>Month 46</td>
            </tr>
            <tr>
              <td>Total interest paid</td>
              <td>≈ KSh 75,100</td>
              <td>≈ KSh 83,300</td>
              <td>≈ KSh 153,600</td>
            </tr>
          </tbody>
        </Table>
        <p>
          Assumptions: interest charged monthly on the reducing balance, rates that don’t change, and no new borrowing. “Minimums only” means no extra money and
          no rolling of cleared payments. Figures are illustrative.
        </p>
      </Example>

      <h2 id="what-it-shows">What does the example show?</h2>
      <p>The avalanche saved money, the snowball delivered an earlier win, and paying extra at all mattered more than either choice.</p>
      <ul>
        <li>
          <strong>The avalanche saved more than KSh 8,000 in interest</strong> compared with the snowball, and in this case both finished in the same month.
        </li>
        <li>
          <strong>The snowball cleared its first loan eight months sooner</strong> (month 6 instead of month 14), which is the motivation many people need.
        </li>
        <li>
          <strong>Paying KSh 5,000 extra was the biggest win.</strong> Either method roughly halved the time (46 months down to 24) and roughly halved the
          interest compared with paying minimums only.
        </li>
        <li>
          <strong>The gap depends on the rates.</strong> If all three loans had similar interest rates, the two methods would come out very close.
        </li>
      </ul>

      <h2 id="which-to-choose">Which method should you choose?</h2>
      <p>
        Choose the avalanche if you can stay motivated without an early win, because it costs the least. Choose the snowball if you’ve started debt plans before
        and stopped, or if a long list of small loans is wearing you down.
      </p>
      <p>
        In Kenya the choice is often easier than it looks. The smallest debts, such as Fuliza balances and loan-app loans, are frequently also the most
        expensive, so both methods pick the same first target. A practical hybrid is to clear any tiny, expensive loans first, then follow the avalanche for the
        rest.
      </p>
      <p>
        If two loans have the same rate, target the smaller balance first. And switching methods halfway is fine; what matters most is that you don’t stop.
      </p>

      <h2 id="fees-not-interest">How do you compare loans that charge fees instead of interest?</h2>
      <p>
        Turn each fee into a rough rate over the same period so you can rank your loans. Many mobile loans quote a fee for the loan period rather than a yearly
        interest rate, which makes them hard to compare at a glance.
      </p>
      <Formula label="Rough cost per month in percent equals fee divided by amount borrowed times 100, divided by the loan period in months">
        Rough cost per month (%) = fee ÷ amount borrowed × 100 ÷ loan period in months
      </Formula>
      <p>
        For example, if you borrow KSh 5,000 and must repay KSh 5,500 after 30 days, the fee is KSh 500: 10% for one month. Over a year that’s roughly 120% in
        simple terms (10% × 12), before any compounding, which is far above what a typical SACCO or bank loan costs. On this basis, that loan would be your
        avalanche target. Read more about <A href="/blog/true-cost-of-mobile-loans">the true cost of mobile loans</A>.
      </p>
      <Callout tone="info" title="Find the real numbers">
        <p>
          Your loan agreement or statement should show the rate and fees. If you’re unsure what kind of lender you’re dealing with, the{' '}
          <Ext href="https://www.centralbank.go.ke/">Central Bank of Kenya</Ext> website lists licensed banks, microfinance banks and digital credit providers.
        </p>
      </Callout>

      <h2 id="simulator">How does Finfe’s “pay extra” simulator work?</h2>
      <p>
        It uses the avalanche method: any extra amount you enter goes to your highest-interest loan first. For each loan you record the balance, the yearly
        interest rate and the monthly payment, and the app works out a debt-free date for that loan. The simulator then shows how many months sooner you’d be
        debt-free with a set extra amount every month.
      </p>
      <p>
        Debt-free dates are included in the free plan; the simulator is part of Pro, which you can try free for 14 days (<A href="/pricing">see pricing</A>). To
        test your own numbers right now, use the <A href="/calculators/debt-payoff">debt payoff calculator</A>.
      </p>
    </Prose>
  )
}
