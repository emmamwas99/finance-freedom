import { A, Callout, Definition, Example, Ext, Formula, LinkGrid, Prose, Steps, Table } from '@/components/marketing/prose'
import type { Article } from '@/content/types'

export const meta: Article['meta'] = {
  slug: 'saving-money',
  title: 'How to save money on a salary in Kenya',
  seoTitle: 'How to Save Money on a Salary in Kenya',
  description:
    'How to save on a Kenyan salary: your savings rate, paying yourself first, emergency funds, sinking funds for school fees and where people keep their savings.',
  summary:
    'To save on a salary, decide your saving before you spend: move it out on payday, build an emergency fund first, then save for goals and lumpy costs like school fees in separate pots. Start with whatever amount you can manage and work towards at least 10% of net pay, raising it each time a loan ends or your pay rises.',
  keyTakeaways: [
    'Your savings rate is the share of net pay you save or invest: amount saved ÷ net pay × 100. A good first target is 10%.',
    'Pay yourself first: move savings out the day your salary arrives, before discretionary spending.',
    'Build an emergency fund before other goals, so a surprise doesn’t send you to a loan.',
    'Sinking funds turn lumpy costs such as school fees into steady monthly amounts.',
    'Before depositing, check the provider with the right regulator: CBK for banks, SASRA for deposit-taking SACCOs and CMA for money market funds.',
  ],
  keywords: [
    'how to save money in Kenya',
    'how to save money on a salary',
    'how to save on a low income in Kenya',
    'saving tips Kenya',
    'what is a good savings rate',
    'where to keep savings in Kenya',
    'sinking fund for school fees',
  ],
  published: '2026-11-11',
  updated: '2026-11-11',
  readingMinutes: 9,
  category: 'Saving',
  related: [
    '/guides/how-to-build-an-emergency-fund',
    '/calculators/savings-goal',
    '/calculators/emergency-fund',
    '/blog/pay-yourself-first',
    '/blog/sinking-funds-for-school-fees',
  ],
  toc: [
    { id: 'why-saving-is-hard', label: 'Why saving on a salary is hard' },
    { id: 'savings-rate', label: 'What is a good savings rate?' },
    { id: 'pay-yourself-first', label: 'How to pay yourself first' },
    { id: 'what-first', label: 'What to save for first' },
    { id: 'sinking-funds', label: 'Sinking funds for school fees' },
    { id: 'cutting-wants', label: 'Cutting wants without misery' },
    { id: 'where-to-keep', label: 'Where people keep savings' },
    { id: 'check-provider', label: 'Checking a provider is regulated' },
    { id: 'explore', label: 'Saving guides and calculators' },
  ],
  faq: [
    {
      q: 'How much should I save from my salary?',
      a: 'A common first target is 10% of your net pay, saved or invested. If that isn’t possible yet, start with a smaller fixed amount and raise it whenever a loan ends or your pay rises.',
    },
    {
      q: 'How can I save money on a low salary?',
      a: 'Start small and save first: move even a modest fixed amount out on payday, before other spending. Cut the wants you value least, and when a loan is cleared, keep paying the same amount into savings instead.',
    },
    {
      q: 'How big should my emergency fund be?',
      a: 'Start with about one month of essential costs as a buffer. Once expensive debt is cleared, grow it to the common guideline of three to six months of essential costs, or more if your income is uncertain or others depend on you.',
    },
    {
      q: 'Where should I keep my savings in Kenya?',
      a: 'No option is completely risk-free. Many people use a bank savings account, a SACCO or a money market fund; check the provider with CBK, SASRA or CMA first, and choose by how quickly you may need the money and how it is protected, not only by the advertised return.',
    },
    {
      q: 'What is a sinking fund?',
      a: 'A sinking fund is money you set aside each month for a cost you know is coming, such as school fees or an insurance renewal. You divide the cost by the number of months until it is due and save that amount every month.',
    },
    {
      q: 'Is a chama a good way to save?',
      a: 'A chama can build saving discipline and give access to lump sums, but most chamas are not supervised by a financial regulator. Keep written rules and clear records, and don’t keep your only emergency fund there.',
    },
  ],
  sources: [
    { title: 'Central Bank of Kenya', url: 'https://www.centralbank.go.ke/', publisher: 'Central Bank of Kenya' },
    { title: 'Sacco Societies Regulatory Authority', url: 'https://www.sasra.go.ke/', publisher: 'SASRA' },
    { title: 'Capital Markets Authority', url: 'https://www.cma.or.ke/', publisher: 'Capital Markets Authority' },
  ],
}

export default function Body() {
  return (
    <Prose>
      <h2 id="why-saving-is-hard">Why is it so hard to save on a salary?</h2>
      <p>
        Because saving usually comes last. Payments, everyday spending and family requests all arrive before the end of the month, and
        whatever is “left over” rarely survives. The fix isn’t more willpower. It is changing the order, so saving happens first and on
        purpose.
      </p>
      <p>
        A few other things make it harder: predictable costs such as school fees that still arrive like emergencies, loan repayments that
        take what you would otherwise save, and savings kept somewhere too easy to spend, such as your M-Pesa balance or everyday account.
        Each of these has a simple fix, covered below.
      </p>

      <h2 id="savings-rate">What is a good savings rate?</h2>
      <p>
        Your savings rate is the share of your net pay that you save or invest each month. A good first target is 10%. Higher is better, but
        any regular amount beats none, because the habit matters more than the figure at the start.
      </p>
      <Formula label="Savings rate equals the amount saved or invested this month divided by net pay, times 100">
        Savings rate = (amount saved or invested this month ÷ net pay) × 100
      </Formula>
      <Example title="Illustration: a KSh 60,000 net salary">
        <p>
          Saving KSh 3,000 a month is a 5% savings rate. When a KSh 3,000 loan repayment ends and you keep paying that amount into savings
          instead, you save KSh 6,000 a month: a 10% savings rate, without changing how you live.
        </p>
      </Example>
      <p>
        Count money that goes to your emergency fund, SACCO deposits, voluntary pension contributions and investments. Payslip deductions
        such as NSSF are already taken out before net pay, so this rate comes on top of them. Money set aside for a known bill, such as next
        term’s fees, is better tracked separately: it is already spoken for. See <A href="/glossary#savings-rate">savings rate</A> in the
        glossary.
      </p>

      <h2 id="pay-yourself-first">How does paying yourself first work?</h2>
      <p>
        Paying yourself first means moving your saving out the day your salary arrives, before any spending you could put off. You then live
        on what remains, so saving no longer depends on how disciplined you feel on the 25th.
      </p>
      <Steps
        items={[
          {
            title: 'Pick an amount',
            body: <>Start where you can, even if it is small, and work towards 10% of net pay or more.</>,
          },
          {
            title: 'Choose a separate place',
            body: <>Keep savings away from your everyday account and M-Pesa wallet, so they aren’t spent by accident.</>,
          },
          {
            title: 'Make it automatic',
            body: (
              <>
                If your bank, SACCO or employer can move the money on payday for you, use that. If not, make the transfer yourself as the first
                thing you do when your salary lands.
              </>
            ),
          },
          {
            title: 'Treat it like a bill',
            body: (
              <>
                Put your saving on your list of monthly payments, next to rent. In Finfe you can add it as a planned payment linked
                to a goal and tick it off like any other payment.
              </>
            ),
          },
          {
            title: 'Raise it when you can',
            body: <>Each pay rise, bonus or cleared loan is a chance to raise the amount before your spending quietly grows to absorb it.</>,
          },
        ]}
      />
      <p>
        More on why this works in <A href="/blog/pay-yourself-first">pay yourself first</A>, and on fitting it into a monthly plan in the{' '}
        <A href="/budgeting">budgeting guide</A>.
      </p>

      <h2 id="what-first">What should you save for first?</h2>
      <p>
        An emergency fund first, then your other goals. Without one, the first surprise sends you to a loan and undoes months of saving.
      </p>
      <Definition term="Emergency fund">
        Money kept only for real emergencies, such as losing your job, a medical bill or an urgent repair. It should be reachable within a
        few days, but not so easy to reach that it slips into everyday spending. See{' '}
        <A href="/glossary#emergency-fund">emergency fund</A>.
      </Definition>
      <ol>
        <li>
          <strong>A starter emergency fund</strong> of about one month of essential costs.
        </li>
        <li>
          <strong>Clear expensive debt</strong> while keeping the starter fund in place. See{' '}
          <A href="/guides/how-to-get-out-of-debt">how to get out of debt</A>.
        </li>
        <li>
          <strong>A full emergency fund</strong>, commonly three to six months of essential costs.
        </li>
        <li>
          <strong>Goals</strong>: sinking funds for known costs, then longer-term goals such as land, a home deposit, a business or
          retirement.
        </li>
      </ol>
      <Example title="Illustration: sizing an emergency fund">
        <p>
          Essential costs (rent, food, transport, the school fees set-aside and minimum loan payments) come to KSh 45,000 a month. The starter
          fund is KSh 45,000. A full fund of three to six months is KSh 135,000 to KSh 270,000.
        </p>
        <p>
          Saving KSh 6,000 a month, the starter fund takes about eight months. A bonus, or a cleared loan whose repayment moves into savings,
          shortens that.
        </p>
      </Example>
      <p>
        The <A href="/calculators/emergency-fund">emergency fund calculator</A> works out your own target, and the guide on{' '}
        <A href="/guides/how-to-build-an-emergency-fund">how to build an emergency fund</A> covers the steps in detail.
      </p>

      <h2 id="sinking-funds">How do sinking funds help with school fees?</h2>
      <p>
        A sinking fund is money you put aside each month for a cost you know is coming. It turns one big, painful payment into small,
        predictable ones, and stops predictable costs from turning into emergencies or loans.
      </p>
      <Formula label="Monthly amount equals the total cost divided by the months until it is due">
        Monthly amount = total cost ÷ months until it is due
      </Formula>
      <Example title="Illustration: three school terms a year">
        <p>
          If fees are about KSh 30,000 a term and there are three terms a year, that is KSh 90,000 a year, or KSh 7,500 a month. Save KSh
          7,500 every month and each term’s fees are waiting when the term starts.
        </p>
      </Example>
      <p>
        Other common sinking funds: insurance renewals, December travel, back-to-school costs such as uniforms and books, car servicing, and
        contributions to weddings, funerals and harambees. Keep each one visible on its own, as a separate goal or account, so you don’t
        mistake it for spare money. The <A href="/calculators/savings-goal">savings goal calculator</A> works out the monthly amount, and{' '}
        <A href="/blog/sinking-funds-for-school-fees">sinking funds for school fees</A> plans a whole school year.
      </p>

      <h2 id="cutting-wants">How do you cut spending without being miserable?</h2>
      <p>
        Cut what you value least, not everything. Keep the few wants that genuinely make life better and trim the ones you barely notice. A
        useful check is to keep wants under about 30% of your spending, a rule of thumb that Finfe’s “Am I on track?” check also
        uses.
      </p>
      <Definition term="Needs and wants">
        Needs are costs you must pay to live and work: housing, basic food, transport to work, school fees and minimum loan payments. Wants
        are everything you could cut without real harm, even if you would rather not. See{' '}
        <A href="/glossary#needs-and-wants">needs and wants</A>.
      </Definition>
      <ul>
        <li>
          <strong>Track first, cut second.</strong> One month of records shows where the money really goes. Start with the{' '}
          <A href="/expense-tracker">expense tracker</A>.
        </li>
        <li>
          <strong>Protect your top three wants.</strong> Choose the ones you care about most and trim the rest.
        </li>
        <li>
          <strong>Cut how often, not the whole habit.</strong> Lunch out twice a week instead of five times still feels like a treat.
        </li>
        <li>
          <strong>Wait 48 hours</strong> before any non-essential purchase above an amount you set, say KSh 2,000.
        </li>
        <li>
          <strong>Watch small, frequent spending.</strong> Deliveries, betting stakes and impulse buys add up faster than they feel.
        </li>
        <li>
          <strong>Plan family support.</strong> Put a set amount for family requests in your plan, so you can give generously without guilt
          or debt.
        </li>
        <li>
          <strong>Move the saving straight away.</strong> If you cut KSh 2,000 of spending, move KSh 2,000 to savings the same day, or it
          will be spent elsewhere.
        </li>
      </ul>

      <h2 id="where-to-keep">Where do people in Kenya keep their savings?</h2>
      <p>
        Most people use one or more of four places: a bank savings account, a SACCO, a money market fund or a chama. Each differs in how
        quickly you can get your money out, what protects it and who supervises it. This is a general comparison, not a recommendation, and
        terms differ between providers and change over time.
      </p>
      <Table caption="Common places to keep savings in Kenya">
        <thead>
          <tr>
            <th>Option</th>
            <th>What it is</th>
            <th>Getting your money out</th>
            <th>Supervised by</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bank savings account</td>
            <td>
              A deposit account at a bank or microfinance bank, including savings accounts that banks run through your phone. Check fees and
              any minimum balance.
            </td>
            <td>Usually at any time, sometimes with withdrawal limits.</td>
            <td>Central Bank of Kenya</td>
          </tr>
          <tr>
            <td>
              <A href="/glossary#sacco">SACCO</A>
            </td>
            <td>
              A member-owned co-operative. Members save regularly and can borrow against their savings. Returns depend on how the SACCO
              performs each year.
            </td>
            <td>
              Member deposits often can’t be withdrawn while you remain a member. Some SACCOs also offer separate savings accounts you can
              withdraw from.
            </td>
            <td>SASRA for deposit-taking SACCOs. Not every SACCO is supervised by SASRA.</td>
          </tr>
          <tr>
            <td>
              <A href="/glossary#money-market-fund">Money market fund</A>
            </td>
            <td>
              A unit trust that pools investors’ money into short-term, lower-risk investments such as government securities and bank
              deposits. Returns go up and down and aren’t guaranteed.
            </td>
            <td>Usually within a few working days of asking.</td>
            <td>Capital Markets Authority, which approves the fund and licenses its manager.</td>
          </tr>
          <tr>
            <td>
              <A href="/glossary#chama">Chama</A>
            </td>
            <td>An informal group that saves together and sometimes lends to members or invests.</td>
            <td>Depends on the group’s rules.</td>
            <td>Usually no financial regulator. Protection depends on written rules, good records and trust.</td>
          </tr>
        </tbody>
      </Table>
      <p>
        Match the place to the purpose. An emergency fund needs to be safe and reachable within days. A sinking fund for fees due in four
        months needs much the same. Money for goals many years away can accept slower access in exchange for the chance of growth, which is
        covered in the <A href="/financial-freedom">financial freedom guide</A>.
      </p>
      <p>
        Bank deposits have some protection through the Kenya Deposit Insurance Corporation, but only up to a set limit per depositor. A
        money market fund is an investment rather than a deposit, so that cover doesn’t apply to it.
      </p>

      <h2 id="check-provider">How do you check that a savings provider is regulated?</h2>
      <p>
        Look the provider up on the regulator’s own website before you deposit. Each regulator publishes the institutions it licenses or
        approves.
      </p>
      <Steps
        items={[
          {
            title: 'Identify what kind of provider it is',
            body: <>A bank, a SACCO, an investment fund or a lender. The type tells you which regulator to check.</>,
          },
          {
            title: 'Go to the right regulator',
            body: (
              <>
                The <Ext href="https://www.centralbank.go.ke/">Central Bank of Kenya</Ext> for banks and microfinance banks, the{' '}
                <Ext href="https://www.sasra.go.ke/">Sacco Societies Regulatory Authority (SASRA)</Ext> for deposit-taking SACCOs, and the{' '}
                <Ext href="https://www.cma.or.ke/">Capital Markets Authority (CMA)</Ext> for fund managers and funds such as money market
                funds.
              </>
            ),
          },
          {
            title: 'Match the exact name',
            body: <>Find the provider’s full registered name on the regulator’s list. Watch for lookalike names and unofficial social media pages.</>,
          },
          {
            title: 'Read the terms',
            body: <>Check fees, minimum amounts, how long withdrawals take, and what happens to your money if you leave.</>,
          },
        ]}
      />
      <Callout tone="warn" title="Red flags">
        <p>
          A promise of high, guaranteed returns, pressure to decide quickly, rewards for recruiting other people, or a provider you can’t find
          on any regulator’s list. If you see any of these, walk away.
        </p>
      </Callout>

      <h2 id="explore">Saving guides, posts and calculators</h2>
      <p>Go deeper into each part of saving, or work out your own numbers.</p>
      <LinkGrid
        items={[
          {
            href: '/guides/how-to-build-an-emergency-fund',
            title: 'How to build an emergency fund',
            text: 'Size your safety net and build it step by step on a salary.',
          },
          {
            href: '/calculators/emergency-fund',
            title: 'Emergency fund calculator',
            text: 'Work out your own emergency fund target.',
          },
          {
            href: '/calculators/savings-goal',
            title: 'Savings goal calculator',
            text: 'Turn a goal and a deadline into a monthly saving amount.',
          },
          {
            href: '/blog/pay-yourself-first',
            title: 'Pay yourself first',
            text: 'Why saving on payday works better than saving what’s left.',
          },
          {
            href: '/blog/sinking-funds-for-school-fees',
            title: 'Sinking funds for school fees',
            text: 'Spread each term’s fees across the months before it.',
          },
          {
            href: '/budgeting',
            title: 'Budgeting',
            text: 'Fit saving into a payments-first monthly plan.',
          },
          {
            href: '/financial-freedom',
            title: 'Financial freedom',
            text: 'How saving leads to being debt-free and, one day, work becoming optional.',
          },
          {
            href: '/glossary',
            title: 'Glossary',
            text: 'Plain definitions of savings rate, sinking fund, SACCO, money market fund and more.',
          },
        ]}
      />
    </Prose>
  )
}
