import { A, Callout, Example, Ext, Formula, LinkGrid, Prose, Steps, Table } from '@/components/marketing/prose'
import type { Article } from '@/content/types'

export const meta: Article['meta'] = {
  slug: 'debt-management',
  title: 'Debt management: how to take control of your loans',
  seoTitle: 'Debt Management: Take Control of Your Loans',
  description:
    'Debt management in Kenya: list every loan, check your debt-to-income ratio, pay in the right order, talk to lenders early and track your debt-free date.',
  summary:
    'Debt management means knowing exactly what you owe, keeping repayments to a share of income your salary can carry, and paying in a deliberate order: first the payments that protect your home, income and assets, then the minimum on every loan, then any extra on one target loan. Stop borrowing to get by, talk to lenders before you miss a payment, and check your debt-free date every month.',
  keyTakeaways: [
    'List every debt, including Fuliza, loan apps, chama loans and money owed to family, with its balance, rate or fee, minimum payment and due date.',
    'Debt-to-income ratio = monthly debt repayments ÷ monthly income × 100. At 30% or more repayments are heavy; at 50% or more they crowd out the basics.',
    'Pay in order: what protects your home, income and assets first, then every minimum, then all extra money to one target loan.',
    'If you can’t make a payment, contact the lender before the due date, ask about a smaller instalment or restructuring, and get any agreement in writing.',
    'A debt-free date, worked out from each loan’s balance, rate and payment, shows whether your plan is working. Check it monthly.',
  ],
  keywords: [
    'debt management',
    'debt management Kenya',
    'how to manage debt',
    'how to manage multiple loans',
    'debt-to-income ratio',
    'what to do if I can’t pay my loan',
    'CRB Kenya',
    'SACCO loan guarantor',
  ],
  published: '2026-11-11',
  updated: '2026-11-11',
  readingMinutes: 9,
  category: 'Debt',
  related: [
    '/guides/how-to-get-out-of-debt',
    '/calculators/debt-payoff',
    '/guides/debt-avalanche-vs-snowball',
    '/blog/true-cost-of-mobile-loans',
    '/financial-health',
  ],
  toc: [
    { id: 'what-is-debt-management', label: 'What is debt management?' },
    { id: 'list-your-debts', label: 'List every debt you owe' },
    { id: 'debt-to-income', label: 'How much debt is too much?' },
    { id: 'productive-vs-consumption', label: 'Productive vs consumption borrowing' },
    { id: 'borrowing-loop', label: 'Breaking the borrowing loop' },
    { id: 'priorities', label: 'Which debts to pay first' },
    { id: 'avalanche-vs-snowball', label: 'Avalanche or snowball?' },
    { id: 'cant-pay', label: 'When you can’t make a payment' },
    { id: 'guarantors', label: 'Guarantors and SACCO loans' },
    { id: 'crb', label: 'Credit reference bureaus' },
    { id: 'debt-free-date', label: 'Tracking your debt-free date' },
    { id: 'explore', label: 'Debt guides and tools' },
  ],
  faq: [
    {
      q: 'What is a good debt-to-income ratio?',
      a: 'As a rule of thumb, keep total loan repayments below about 30% of your monthly income. From 30% to 50% is heavy and leaves little room to save; at 50% or more, repayments usually crowd out basics like food and transport. Lenders may work the ratio out differently, for example on gross pay.',
    },
    {
      q: 'Which debt should I pay first?',
      a: 'First keep up the payments that protect your home, your income and anything you could lose, plus any loan that is close to default. Then pay the minimum on every other loan, and put all extra money on one target, usually the most expensive loan.',
    },
    {
      q: 'What should I do if I can’t pay my loan this month?',
      a: 'Contact the lender before the due date, explain what has changed, and ask whether a smaller instalment for a while or a restructured loan is possible. Get any agreement in writing, and if it is a SACCO loan, tell your guarantors.',
    },
    {
      q: 'How do I check my CRB record in Kenya?',
      a: 'Credit reference bureaus in Kenya are licensed by the Central Bank of Kenya, whose website has information about them. You can ask a licensed bureau for your own credit report, and ask how to dispute anything you think is wrong.',
    },
    {
      q: 'Is it ever a good idea to borrow?',
      a: 'Borrowing for something likely to raise your income or build an asset can make sense, as long as your salary could carry the repayments even if the return is slow. Borrowing to cover everyday spending is the kind to stop, because it makes next month shorter.',
    },
    {
      q: 'What happens if someone I guaranteed stops paying?',
      a: 'The lender may recover the money from you; in a SACCO, often from your deposits. Read the guarantee form before you sign, guarantee only what you could afford to lose, and ask the SACCO how a default would affect your own deposits and borrowing.',
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
      <h2 id="what-is-debt-management">What is debt management?</h2>
      <p>
        Debt management is running your loans on purpose instead of letting them run you. You know what you owe, keep repayments to a level your salary can
        carry, pay in a sensible order and bring the total down steadily.
      </p>
      <p>
        It isn’t the same as having no debt. Plenty of people carry a SACCO loan or a land loan sensibly for years. The trouble starts when debts are scattered,
        half-remembered and growing, and new loans pay for old ones. This page gives the whole picture; for a step-by-step repayment plan, see{' '}
        <A href="/guides/how-to-get-out-of-debt">how to get out of debt</A>.
      </p>

      <h2 id="list-your-debts">How do you list every debt you owe?</h2>
      <p>
        Put every debt on one list, formal and informal, with four details each: the balance today, the interest rate or fee, the minimum payment and the due
        date. You can’t manage a loan you’ve left off the list, and the ones people forget are often the most expensive.
      </p>
      <Table caption="Types of debt and what to check for each">
        <thead>
          <tr>
            <th>Type</th>
            <th>Examples</th>
            <th>What to check</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bank loans</td>
            <td>Personal loans, salary advances, credit cards</td>
            <td>Rate, reducing balance or flat, and fees</td>
          </tr>
          <tr>
            <td>
              <A href="/glossary#sacco">SACCO</A> loans
            </td>
            <td>Development, emergency or school-fees loans</td>
            <td>Rate, check-off or not, and who guaranteed it</td>
          </tr>
          <tr>
            <td>
              <A href="/glossary#chama">Chama</A> loans
            </td>
            <td>Loans from your group’s pot</td>
            <td>Group rules on interest and penalties</td>
          </tr>
          <tr>
            <td>
              <A href="/glossary#mobile-loan">Mobile and app loans</A>
            </td>
            <td>Digital loans repaid within weeks</td>
            <td>Total repaid vs borrowed, and whether the lender is licensed</td>
          </tr>
          <tr>
            <td>
              <A href="/glossary#overdraft">Overdrafts</A>
            </td>
            <td>Fuliza, a bank overdraft</td>
            <td>Balance and the charges while it stays unpaid</td>
          </tr>
          <tr>
            <td>Asset loans</td>
            <td>A shamba loan, car or logbook loan, hire purchase</td>
            <td>What happens to the land, car or item if you fall behind</td>
          </tr>
          <tr>
            <td>Family and friends</td>
            <td>Money from a sibling, parent or colleague</td>
            <td>What you agreed, ideally in writing</td>
          </tr>
        </tbody>
      </Table>
      <Example title="Illustration: one person’s debt list on KSh 80,000 net pay">
        <Table caption="An illustrative debt list">
          <thead>
            <tr>
              <th>Debt</th>
              <th className="num">Balance (KSh)</th>
              <th>Rate or fee</th>
              <th className="num">Minimum (KSh)</th>
              <th>Due</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SACCO loan</td>
              <td className="num">180,000</td>
              <td>12% a year</td>
              <td className="num">7,000</td>
              <td>5th</td>
            </tr>
            <tr>
              <td>Bank personal loan</td>
              <td className="num">120,000</td>
              <td>15% a year</td>
              <td className="num">5,500</td>
              <td>28th</td>
            </tr>
            <tr>
              <td>Shamba loan (instalments to the seller)</td>
              <td className="num">150,000</td>
              <td>None, fixed price</td>
              <td className="num">5,000</td>
              <td>10th</td>
            </tr>
            <tr>
              <td>Chama loan</td>
              <td className="num">20,000</td>
              <td>Set by group rules</td>
              <td className="num">4,000</td>
              <td>Meeting day</td>
            </tr>
            <tr>
              <td>Loan from brother</td>
              <td className="num">15,000</td>
              <td>None</td>
              <td className="num">3,000</td>
              <td>30th</td>
            </tr>
            <tr>
              <td>Mobile overdraft</td>
              <td className="num">3,000</td>
              <td>Daily charges</td>
              <td className="num">3,000</td>
              <td>As soon as possible</td>
            </tr>
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              <td className="num">
                <strong>488,000</strong>
              </td>
              <td></td>
              <td className="num">
                <strong>27,500</strong>
              </td>
              <td></td>
            </tr>
          </tbody>
        </Table>
        <p>Seeing KSh 488,000 in one place is uncomfortable, but every decision below starts here. The regular instalments come to KSh 24,500 a month.</p>
      </Example>

      <h2 id="debt-to-income">How much debt is too much?</h2>
      <p>
        A useful test is your <A href="/glossary#debt-to-income-ratio">debt-to-income ratio</A>: the share of your monthly income that goes to loan
        repayments. Below 30% is generally manageable. At 30% or more repayments are heavy, and at 50% or more they crowd out food, transport and saving.
      </p>
      <Formula label="Debt-to-income ratio equals total monthly debt repayments divided by monthly income, times 100">
        Debt-to-income ratio = total monthly debt repayments ÷ monthly income × 100
      </Formula>
      <Table caption="Reading your debt-to-income ratio">
        <thead>
          <tr>
            <th>Ratio</th>
            <th>What it usually means</th>
            <th>What to do</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Under 30%</td>
            <td>Repayments fit, with room for saving</td>
            <td>Keep paying, avoid new loans for spending, and save as you go</td>
          </tr>
          <tr>
            <td>30% to 49%</td>
            <td>Heavy: one surprise can push you into borrowing</td>
            <td>Take no new loans, cut wants and put extra on one target loan</td>
          </tr>
          <tr>
            <td>50% or more</td>
            <td>Repayments compete with the basics</td>
            <td>Talk to lenders now about smaller instalments, and protect food, transport and rent</td>
          </tr>
        </tbody>
      </Table>
      <p>
        These lines are rules of thumb, not lending rules. Use your take-home pay, and if a loan is deducted from your payslip, add it back to both your pay
        and your repayments so the ratio isn’t flattered. Lenders may work it out differently, for example on gross pay. In the example above, KSh 24,500 ÷
        KSh 80,000 is about 31%, just past the first line.
      </p>
      <p>
        Finfe Pro’s “Am I on track?” check uses the same two lines. It warns when debt payments reach 30% of your income and flags 50% or more as a problem.
        You can also score yourself in the free <A href="/financial-health">financial health check</A>.
      </p>

      <h2 id="productive-vs-consumption">Is all borrowing bad?</h2>
      <p>
        No. What matters is what the loan pays for. Productive borrowing pays for something expected to raise your income or build an asset. Consumption
        borrowing pays for things you use up, and has to be repaid entirely from future pay.
      </p>
      <Table caption="Productive vs consumption borrowing">
        <thead>
          <tr>
            <th></th>
            <th>Productive borrowing</th>
            <th>Consumption borrowing</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Pays for</td>
            <td>Land, a home, stock for a working business, a course linked to better pay</td>
            <td>Groceries, rent shortfalls, outings, a newer phone</td>
          </tr>
          <tr>
            <td>Repaid from</td>
            <td>Ideally partly from what the asset earns or saves</td>
            <td>Your future salary alone</td>
          </tr>
          <tr>
            <td>Main risk</td>
            <td>The return comes late or not at all, while repayments stay fixed</td>
            <td>Next month starts short, so you borrow again</td>
          </tr>
          <tr>
            <td>Question to ask</td>
            <td>Could my salary carry the repayments if the return were zero for a year?</td>
            <td>Is this an emergency, or a gap in my plan?</td>
          </tr>
        </tbody>
      </Table>
      <p>
        “Productive” doesn’t mean safe: a land or business loan can still sink a budget if the repayments are too big. The test is whether your pay could carry
        the loan if things go slowly.
      </p>

      <h2 id="borrowing-loop">How do you break the borrowing-to-get-by loop?</h2>
      <p>
        Work out how much you borrow each month just to get through, then close that gap from the spending side, one lender at a time. Borrowing to get by is
        what turns manageable debt into a trap.
      </p>
      <p>
        Money runs short before payday, so you use Fuliza or a loan app. The next salary starts with a repayment, so that month is shorter still, and you
        borrow again. Each fee looks small, but as <A href="/blog/true-cost-of-mobile-loans">the true cost of mobile loans</A> shows, they add up to a very
        high yearly rate.
      </p>
      <ul>
        <li>
          <strong>Measure the gap.</strong> Add up what you borrowed to get by over the last three months.
        </li>
        <li>
          <strong>Find the cause:</strong> usually unplanned spending, a payment that lands at a bad time, or no buffer. See{' '}
          <A href="/blog/why-you-run-out-of-money-before-payday">why you run out of money before payday</A>.
        </li>
        <li>
          <strong>Close it from wants first.</strong> Two months of fewer outings costs less than fees on the same amount.
        </li>
        <li>
          <strong>Stop one source at a time.</strong> Clear the most expensive short-term loan, lower the overdraft limit where your provider allows it, and
          delete apps you don’t need.
        </li>
        <li>
          <strong>Build a small buffer,</strong> so the next surprise doesn’t become a loan.
        </li>
      </ul>

      <h2 id="priorities">Which debts should you pay first?</h2>
      <p>
        Pay in three tiers: first the payments that protect your home, your income and your assets, along with any loan close to default; then the minimum on
        every other debt; then any extra money on one target loan. Before any of it, keep enough for food and transport to work.
      </p>
      <Steps
        items={[
          {
            title: 'Protect your home, income and assets',
            body: (
              <>
                Rent comes first. So do loans secured on something you can’t afford to lose, such as a car you work with or land you’re paying for, and any
                loan already behind, where another missed payment could bring penalties, a call to your guarantors or a report to a credit reference bureau.
              </>
            ),
          },
          {
            title: 'Pay the minimum on everything else',
            body: (
              <>
                Pay at least the <A href="/glossary#minimum-payment">minimum payment</A> on every other loan, every month, on time. Put each one in your
                monthly plan alongside rent, so it is paid before everyday spending.
              </>
            ),
          },
          {
            title: 'Send all extra money to one target',
            body: (
              <>
                Whatever is left after minimums and a basic budget goes to one loan at a time. When that loan is cleared, roll its whole payment onto the next
                target.
              </>
            ),
          },
        ]}
      />
      <p>
        In the example above, rent and the shamba instalments are protected first. Paying the mobile overdraft off in full this month stops its daily charges.
        Extra money would then go to the most expensive remaining loan: probably the bank loan at 15%, unless the chama’s rules work out dearer.
      </p>

      <h2 id="avalanche-vs-snowball">Avalanche or snowball: how do you choose the target?</h2>
      <p>
        The debt avalanche targets the highest interest rate first and costs the least interest. The debt snowball targets the smallest balance first and gives
        quicker wins. Either beats spreading extra money thinly across every loan.
      </p>
      <p>
        The <A href="/glossary#debt-avalanche">avalanche</A> is best on paper, especially when rates differ a lot. The{' '}
        <A href="/glossary#debt-snowball">snowball</A> helps some people stay motivated. In Kenya the two often agree on the first target, because small mobile
        loans and overdrafts tend to be both the smallest and the most expensive. Convert any fee to a yearly rate before you compare. Our{' '}
        <A href="/guides/debt-avalanche-vs-snowball">avalanche vs snowball comparison</A> works through both with numbers.
      </p>

      <h2 id="cant-pay">What should you do if you can’t make a payment?</h2>
      <p>
        Contact the lender before the due date, not after. Explain what has changed, ask what options exist, and get any new arrangement in writing. It is
        usually easier to agree a plan before an account falls behind.
      </p>
      <ol>
        <li>
          <strong>Work out what you can pay.</strong> Check your plan, cut wants for now, and arrive with a realistic figure.
        </li>
        <li>
          <strong>Call or visit early.</strong> Say what happened, such as a pay cut or illness, and how long you expect it to last.
        </li>
        <li>
          <strong>Ask about options:</strong> a smaller instalment for a few months, a longer term (often called restructuring) or waived penalties. Many
          lenders prefer a workable plan to a default, but nothing is guaranteed, and a longer term usually means more interest in total.
        </li>
        <li>
          <strong>Get it in writing.</strong> Ask for the new amount, dates and charges by email, letter or official message, and keep a copy.
        </li>
        <li>
          <strong>Keep to the new plan,</strong> and tell anyone who guaranteed the loan what you agreed.
        </li>
      </ol>
      <Callout tone="warn" title="Don’t go silent, and don’t borrow to cover it">
        <p>
          Ignoring calls rarely makes a debt smaller, and a new loan to make this payment usually moves the problem to next month with extra fees. If you do
          borrow, the <Ext href="https://www.centralbank.go.ke/">Central Bank of Kenya</Ext> lists the lenders it licenses.
        </p>
      </Callout>

      <h2 id="guarantors">How do guarantors and SACCO loans work?</h2>
      <p>
        Many SACCO loans need <A href="/glossary#guarantor">guarantors</A>: fellow members who pledge their deposits behind your loan. If you stop paying, the
        SACCO may recover what you owe from them, so a SACCO loan puts other people’s money at stake as well as yours.
      </p>
      <ul>
        <li>
          <strong>As a borrower,</strong> tell your guarantors early if you’re struggling, and speak to the SACCO before you miss a payment. A quiet default
          can damage friendships as well as your record.
        </li>
        <li>
          <strong>As a guarantor,</strong> read the form before signing, guarantee only what you could afford to lose, and ask how it affects your own
          deposits and borrowing. Note each loan you’ve guaranteed under your debt list: not your debt today, but it could become one.
        </li>
      </ul>
      <p>
        Deposit-taking SACCOs in Kenya are licensed and supervised by the <Ext href="https://www.sasra.go.ke/">SACCO Societies Regulatory Authority</Ext>{' '}
        (SASRA). Your own SACCO’s by-laws and loan forms set out its rules.
      </p>

      <h2 id="crb">What are credit reference bureaus, and why do they matter?</h2>
      <p>
        A <A href="/glossary#credit-reference-bureau">credit reference bureau</A> (CRB) collects information from lenders about how people repay and shares it
        with other lenders. In Kenya, CRBs are licensed by the <Ext href="https://www.centralbank.go.ke/">Central Bank of Kenya</Ext>.
      </p>
      <p>
        Lenders share both good and bad information. Paying on time builds a positive record. Late payments and defaults may be reported, which can make
        borrowing harder or more expensive later. You can ask a licensed bureau for your own credit report, and if something in it looks wrong, ask the
        bureau how to raise a dispute.
      </p>
      <p>
        Be wary of anyone offering to remove a record for a fee. The information comes from lenders, so deal with the lender directly: settle the debt or agree
        a plan, and keep the paperwork.
      </p>

      <h2 id="debt-free-date">How do you track progress to a debt-free date?</h2>
      <p>
        Once a month, update each balance and ask three questions. Is total debt falling? Did you repay more than you borrowed? Has your debt-free date moved
        closer?
      </p>
      <p>
        A debt-free date is the month a loan would be fully paid if you keep making the same payment, worked out from the balance, the interest rate and the
        payment, with interest charged each month on the balance that remains. With several loans, your overall date is the latest one. If a payment doesn’t
        cover the monthly interest, there is no date: the balance never falls, so that loan needs attention first. Try your numbers in the{' '}
        <A href="/calculators/debt-payoff">debt payoff calculator</A>.
      </p>
      <p>
        Finfe shows a debt-free date for every loan on the free plan, and records borrowed money separately from earned income, so a loan is never counted as
        income. Pro’s “pay extra” simulator shows how an extra amount each month, sent to the highest-interest loan first, would bring
        the date forward. You can <A href="/signup">start free</A>.
      </p>
      <p>When the last loan is cleared, keep paying the same total each month, but into your savings and goals instead of to a lender.</p>

      <h2 id="explore">Debt guides and tools</h2>
      <p>Go deeper into each part of managing debt, or try your own numbers.</p>
      <LinkGrid
        items={[
          {
            href: '/guides/how-to-get-out-of-debt',
            title: 'How to get out of debt',
            text: 'A step-by-step plan, from listing every loan to rolling payments forward.',
          },
          {
            href: '/guides/debt-avalanche-vs-snowball',
            title: 'Debt avalanche vs snowball',
            text: 'Which loan to target first, compared with worked numbers.',
          },
          {
            href: '/blog/true-cost-of-mobile-loans',
            title: 'The true cost of mobile loans',
            text: 'Turn a small fee into a yearly rate and see what short loans really cost.',
          },
          {
            href: '/calculators/debt-payoff',
            title: 'Debt payoff calculator',
            text: 'See your debt-free date and how paying extra would change it.',
          },
          {
            href: '/financial-health',
            title: 'Financial health check',
            text: 'Score your habits, including how heavy your debt payments are.',
          },
          {
            href: '/blog/why-you-run-out-of-money-before-payday',
            title: 'Why you run out before payday',
            text: 'The common reasons salaries run short, and how to stop borrowing to get by.',
          },
        ]}
      />
    </Prose>
  )
}
