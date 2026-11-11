import type { ComponentType, ReactNode } from 'react'
import { A, Callout, Example, Ext, Formula, Prose, Steps, Table } from '@/components/marketing/prose'
import { BudgetCalculator } from '@/features/calculators/budget-calculator'
import { DebtPayoffCalculator } from '@/features/calculators/debt-payoff-calculator'
import { EmergencyFundCalculator } from '@/features/calculators/emergency-fund-calculator'
import { FinancialFreedomCalculator } from '@/features/calculators/financial-freedom-calculator'
import { SavingsCalculator } from '@/features/calculators/savings-calculator'
import { SavingsGoalCalculator } from '@/features/calculators/savings-goal-calculator'
import type { Faq, Source } from '@/lib/seo/schema'

export interface CalculatorMeta {
  slug: string
  /** Short name used in navigation and cards. */
  name: string
  /** H1. */
  title: string
  /** <title> without brand suffix. */
  seoTitle: string
  description: string
  /** One or two sentences: what it answers. Shown under the H1. */
  summary: string
  keywords: string[]
  updated: string
  related: { href: string; label: string }[]
  faq: Faq[]
  sources?: Source[]
}

export interface Calculator {
  meta: CalculatorMeta
  Widget: ComponentType
  Body: () => ReactNode
}

const UPDATED = '2026-11-11'

const budget: Calculator = {
  meta: {
    slug: 'budget',
    name: 'Budget calculator',
    title: 'Budget calculator: what’s left after every payment?',
    seoTitle: 'Budget calculator (KSh)',
    description: 'Free budget calculator for Kenyan salaries. Enter take-home pay, your payments and spending limits to see what’s left and how much you can spend per day.',
    summary: 'Enter your take-home pay, the payments you must make this month and your everyday spending limits. The calculator shows what’s left after payments and a safe daily spending amount for the rest of the month.',
    keywords: ['budget calculator', 'budget calculator Kenya', 'monthly budget calculator', 'salary budget calculator', 'how much can I spend per day'],
    updated: UPDATED,
    related: [
      { href: '/guides/how-to-make-a-monthly-budget', label: 'How to make a monthly budget' },
      { href: '/budgeting', label: 'Budgeting explained' },
      { href: '/guides/50-30-20-rule', label: 'The 50/30/20 rule' },
    ],
    faq: [
      { q: 'How much of my salary should go to loan repayments?', a: 'A common warning line is 30% of take-home pay. Above that, repayments squeeze essentials and many people start borrowing again to get through the month. Above 50% is a serious problem to fix first.' },
      { q: 'What is “left after payments”?', a: 'It is your take-home pay minus every payment you must make this month: loans, rent, school fees, house help and other fixed commitments. It is the money you actually have for food, transport and everything else.' },
      { q: 'How is the daily amount worked out?', a: 'Left after payments divided by the days left in the month, counting today. Spend less than that each day and you finish the month without borrowing.' },
    ],
  },
  Widget: BudgetCalculator,
  Body: () => (
    <Prose>
      <h2 id="how-it-works">How does the budget calculator work?</h2>
      <p>It uses the <strong>payments-first</strong> method, the same one behind Finfe’s monthly plan. You take care of what you must pay before deciding what you can spend.</p>
      <Formula label="Left after payments equals take-home pay minus planned payments">Left after payments = take-home pay − planned payments</Formula>
      <Formula label="Unplanned money equals left after payments minus everyday spending limits">Unplanned = left after payments − everyday limits</Formula>
      <Formula label="Daily allowance equals left after payments divided by days left">Per day = left after payments ÷ days left this month</Formula>
      <Example>
        <p>Take-home pay of <strong>KSh 85,000</strong>. Payments: rent KSh 18,000, SACCO loan KSh 8,000, a monthly share of school fees KSh 7,000 and house help KSh 7,500. That’s KSh 40,500 in payments.</p>
        <p>Left after payments: KSh 85,000 − KSh 40,500 = <strong>KSh 44,500</strong>. With 30 days left, that’s about <strong>KSh 1,483 a day</strong> for food, transport and everything else.</p>
      </Example>
      <h2 id="using-the-result">What should I do with the result?</h2>
      <Steps
        items={[
          { title: 'If it’s negative, fix the plan before the month starts', body: 'Move a payment, agree a smaller instalment, or cut a limit. Borrowing to cover the gap makes next month smaller still.' },
          { title: 'If it’s tight (under 15% of pay left), protect the essentials', body: 'Keep limits for food and transport realistic and pause anything optional until the month is covered.' },
          { title: 'If there’s unplanned money, give it a job on payday', body: <>Savings first (start an <A href="/calculators/emergency-fund">emergency fund</A>), then extra on your most expensive loan.</> },
        ]}
      />
      <h2 id="limits">Assumptions and limits</h2>
      <ul>
        <li>Amounts are monthly. For yearly costs such as school fees or insurance, enter the monthly share (yearly cost ÷ 12) or use a <A href="/blog/sinking-funds-for-school-fees">sinking fund</A>.</li>
        <li>The calculation runs in your browser and nothing you type is sent anywhere. Your last numbers are remembered on this device until you reset them.</li>
      </ul>
      <Callout tone="tip" title="Do this every month automatically">
        Finfe keeps this plan for every month: ticks payments as you make them, warns you at 80% of a limit, and shows the next six months so heavy months don’t surprise you. <A href="/signup">Start free</A>.
      </Callout>
    </Prose>
  ),
}

const debt: Calculator = {
  meta: {
    slug: 'debt-payoff',
    name: 'Debt payoff calculator',
    title: 'Debt payoff calculator: when will I be debt-free?',
    seoTitle: 'Debt payoff calculator: debt-free date',
    description: 'Add your loans to see your debt-free date, the total interest you’ll pay, and how much sooner you’d finish by paying a little extra each month (avalanche method).',
    summary: 'Add each loan’s balance, monthly payment and interest rate. The calculator projects your debt-free date and total interest, and shows how much time and interest an extra monthly payment saves.',
    keywords: ['debt payoff calculator', 'loan payoff calculator', 'debt free date calculator', 'debt avalanche calculator', 'loan calculator Kenya'],
    updated: UPDATED,
    related: [
      { href: '/guides/how-to-get-out-of-debt', label: 'How to get out of debt' },
      { href: '/guides/debt-avalanche-vs-snowball', label: 'Avalanche vs snowball' },
      { href: '/blog/true-cost-of-mobile-loans', label: 'The true cost of mobile loans' },
    ],
    faq: [
      { q: 'What happens if my payment is smaller than the interest?', a: 'The balance never falls, because each month’s interest is bigger than what you pay. The calculator flags these loans. The only fixes are paying more on that loan or negotiating the rate down.' },
      { q: 'Which loan should I pay extra on first?', a: 'Mathematically, the loan with the highest interest rate (the avalanche method) costs the least overall. Paying off the smallest balance first (snowball) can be more motivating. Either works if you stop new borrowing.' },
      { q: 'My loan charges a flat fee, not a yearly rate. What do I enter?', a: 'This calculator assumes interest on the reducing balance. For a flat-fee loan, enter the total you still have to repay as the balance and 0% as the rate, so the date is based on your remaining repayments.' },
    ],
  },
  Widget: DebtPayoffCalculator,
  Body: () => (
    <Prose>
      <h2 id="how-it-works">How is the debt-free date calculated?</h2>
      <p>Each month, every loan is charged one month of interest on its remaining balance (yearly rate ÷ 12), then its monthly payment comes off. Any extra you pay goes to the loan with the <strong>highest interest rate</strong> first: the <A href="/glossary#debt-avalanche">avalanche method</A>. This is the same engine as the “pay extra” simulator in Finfe.</p>
      <Formula label="New balance equals balance plus one month of interest minus the payment">New balance = balance + balance × (rate ÷ 12) − payment</Formula>
      <p>For a single loan there is a direct formula for the number of months, where <code>r</code> is the monthly rate, <code>B</code> the balance and <code>P</code> the payment:</p>
      <Formula label="Months equals minus log of one minus r times B over P, divided by log of one plus r">months = −ln(1 − r·B ÷ P) ÷ ln(1 + r)</Formula>
      <p>If <code>P</code> is not bigger than <code>r·B</code> (the monthly interest), the loan never clears.</p>
      <Example>
        <p>A KSh 180,000 bank loan at 16% a year, paid at KSh 9,000 a month. Interest in the first month is about KSh 2,400, so KSh 6,600 reduces the balance. Adding KSh 2,000 extra a month means KSh 8,600 reduces it instead, and the loan clears several months sooner with less interest paid.</p>
      </Example>
      <h2 id="rollover">Should I move a cleared loan’s payment to the next one?</h2>
      <p>Yes, if you can. When a loan is finished, its monthly payment is money you’re already used to living without. Sending it to the next loan speeds everything up. That is what the “move its monthly payment to the next loan” option models. Untick it to see the date if you stop paying that amount once a loan is cleared.</p>
      <h2 id="limits">Assumptions and limits</h2>
      <Table caption="What the calculator assumes">
        <thead>
          <tr>
            <th>Assumption</th>
            <th>What it means for you</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Interest on the reducing balance</td>
            <td>Many bank and SACCO loans work this way. Flat-fee and mobile loans don’t: see the FAQ below.</td>
          </tr>
          <tr>
            <td>Fixed payments and rates</td>
            <td>If your rate or instalment changes, update the numbers.</td>
          </tr>
          <tr>
            <td>No new borrowing</td>
            <td>Any new loan pushes the date out. Stopping new borrowing matters more than any method.</td>
          </tr>
        </tbody>
      </Table>
      <p>
        Before borrowing, check a lender’s total cost of credit. Banks, microfinance banks and digital credit providers in Kenya are licensed by the <Ext href="https://www.centralbank.go.ke/">Central Bank of Kenya</Ext>.
      </p>
    </Prose>
  ),
}

const emergency: Calculator = {
  meta: {
    slug: 'emergency-fund',
    name: 'Emergency fund calculator',
    title: 'Emergency fund calculator: how much do I need?',
    seoTitle: 'Emergency fund calculator',
    description: 'Work out your emergency fund target from your essential monthly costs, see how many months you already cover, and how long it will take to get there.',
    summary: 'Your emergency fund target is your essential monthly costs times the months of cover you want. Start with one month; three to six months is a common goal. Enter your numbers to see your target and timeline.',
    keywords: ['emergency fund calculator', 'how much emergency fund do I need', 'emergency savings Kenya', 'emergency fund target'],
    updated: UPDATED,
    related: [
      { href: '/guides/how-to-build-an-emergency-fund', label: 'How to build an emergency fund' },
      { href: '/saving-money', label: 'How to save money' },
      { href: '/calculators/savings-goal', label: 'Savings goal calculator' },
    ],
    faq: [
      { q: 'How many months should my emergency fund cover?', a: 'A common guideline is three to six months of essential costs. If your income is irregular, or you support many people, aim for the higher end. Start with one month, because that alone stops most emergency borrowing.' },
      { q: 'Should I save an emergency fund or pay off debt first?', a: 'Many people do both in order: a small buffer of about one month first, so emergencies don’t create new loans, then focus on expensive debt, then grow the fund to three to six months.' },
      { q: 'Where should I keep my emergency fund?', a: 'Somewhere separate from your spending money but quick to reach, and low-risk. Many people use a savings account or a money market fund. Check that any provider is regulated before you deposit.' },
    ],
    sources: [{ title: 'An essential guide to building an emergency fund', url: 'https://www.consumerfinance.gov/', publisher: 'Consumer Financial Protection Bureau' }],
  },
  Widget: EmergencyFundCalculator,
  Body: () => (
    <Prose>
      <h2 id="how-it-works">How is the target worked out?</h2>
      <Formula label="Emergency fund target equals essential monthly costs times months of cover">Target = essential costs per month × months of cover</Formula>
      <p><strong>Essential costs</strong> are what you must pay even in a bad month: rent, food, transport to work, utilities, school fees, insurance and the minimum on every loan. Leave out wants such as eating out. They’re the first thing you cut in an emergency.</p>
      <Example>
        <p>Essentials of <strong>KSh 45,000</strong> a month. Three months of cover is KSh 135,000. With KSh 20,000 already saved and KSh 8,000 saved a month, it takes about 15 months to get there, and you reach the first milestone of one month (KSh 45,000) in a little over three months.</p>
      </Example>
      <h2 id="why">Why does an emergency fund matter so much?</h2>
      <p>Without one, every surprise (a hospital bill, a car repair, a gap between jobs) becomes a new loan, often an expensive mobile loan. An emergency fund breaks that cycle. US consumer regulator the <Ext href="https://www.consumerfinance.gov/">CFPB</Ext> recommends building savings for unexpected expenses gradually, starting small.</p>
      <h2 id="limits">Assumptions and limits</h2>
      <ul>
        <li>The time to reach your target assumes you save the same amount every month and leave out any interest earned, so it’s slightly cautious.</li>
        <li>Your inputs stay in your browser.</li>
      </ul>
      <Callout tone="tip">Track your fund as a goal in Finfe and every contribution counts towards it automatically. <A href="/signup">Start free</A>.</Callout>
    </Prose>
  ),
}

const savings: Calculator = {
  meta: {
    slug: 'savings-goal',
    name: 'Savings goal calculator',
    title: 'Savings goal calculator: how much to save each month',
    seoTitle: 'Savings goal calculator (monthly)',
    description: 'Find out how much to save each month to reach a goal by a deadline, such as school fees, a deposit or stock for your business, with optional interest.',
    summary: 'Enter your goal, what you’ve already saved and how many months you have. The calculator gives the monthly amount to save, including any interest your savings earn.',
    keywords: ['savings goal calculator', 'how much to save per month', 'savings calculator Kenya', 'school fees savings plan'],
    updated: UPDATED,
    related: [
      { href: '/blog/sinking-funds-for-school-fees', label: 'Sinking funds for school fees' },
      { href: '/blog/pay-yourself-first', label: 'Pay yourself first' },
      { href: '/saving-money', label: 'How to save money' },
    ],
    faq: [
      { q: 'How do I calculate how much to save per month?', a: 'Without interest, subtract what you have from the goal and divide by the number of months. With interest, the calculator uses the standard future-value formula so the amount is a little lower.' },
      { q: 'What interest rate should I enter?', a: 'Leave it at 0% unless you know what your savings account or fund pays. Rates change, so treat any figure as an estimate and recheck it from time to time.' },
      { q: 'What if I can’t afford the monthly amount?', a: 'Move the deadline, lower the goal, or start with what you can and increase it when a loan is cleared. Saving something every month beats waiting for the perfect amount.' },
    ],
  },
  Widget: SavingsGoalCalculator,
  Body: () => (
    <Prose>
      <h2 id="how-it-works">How is the monthly amount calculated?</h2>
      <p>Without interest it’s simple division:</p>
      <Formula label="Monthly saving equals goal minus already saved, divided by months">Monthly = (goal − already saved) ÷ months</Formula>
      <p>With interest compounded monthly at rate <code>r</code> (yearly rate ÷ 12) over <code>n</code> months, what you already have grows too, so you need a little less each month:</p>
      <Formula label="Monthly saving equals goal minus current times one plus r to the n, all times r, divided by one plus r to the n minus one">Monthly = (goal − current × (1 + r)ⁿ) × r ÷ ((1 + r)ⁿ − 1)</Formula>
      <Example>
        <p>School fees of <strong>KSh 150,000</strong> due in 12 months, with KSh 10,000 already set aside. Without interest: (150,000 − 10,000) ÷ 12 = <strong>KSh 11,667 a month</strong>.</p>
      </Example>
      <h2 id="tips">How do I make sure I actually save it?</h2>
      <ul>
        <li>Save on payday, before spending: a standing order does it without willpower (<A href="/blog/pay-yourself-first">pay yourself first</A>).</li>
        <li>Keep goal money in a separate account so it doesn’t blend with spending money.</li>
        <li>Use one goal per purpose, so you can see each one progress.</li>
      </ul>
    </Prose>
  ),
}

const savingsGrowth: Calculator = {
  meta: {
    slug: 'savings',
    name: 'Savings calculator',
    title: 'Savings calculator: how much will my savings grow?',
    seoTitle: 'Savings calculator (KSh, with interest)',
    description: 'See how much your savings could grow with a monthly deposit and compound interest, year by year. Free, no sign-up, made for Kenyan shillings.',
    summary: 'Enter what you have saved, what you’ll add each month, an interest rate and the number of years. The calculator shows what you could end up with, how much you deposited, and how much came from interest.',
    keywords: ['savings calculator', 'savings calculator Kenya', 'compound interest calculator', 'how much will my savings grow', 'monthly savings calculator'],
    updated: UPDATED,
    related: [
      { href: '/saving-money', label: 'How to save money on a salary' },
      { href: '/blog/pay-yourself-first', label: 'Pay yourself first' },
      { href: '/glossary#compound-interest', label: 'Compound interest explained' },
    ],
    faq: [
      { q: 'How is interest on savings calculated?', a: 'This calculator compounds monthly: each month, one-twelfth of the yearly rate is added to the balance, then your deposit. Interest then earns interest, which is why growth speeds up over time.' },
      { q: 'What interest rate should I use?', a: 'Use the rate your savings account, SACCO or fund currently states, and treat it as an estimate. Rates change and returns on investment products are not guaranteed. Try a lower rate to see a cautious result.' },
      { q: 'Does this include inflation?', a: 'No. The result is in future shillings. If prices rise faster than your interest rate, your savings will buy less than the number suggests.' },
      { q: 'Is this different from the savings goal calculator?', a: 'Yes. This one starts from a monthly amount and tells you what you will have. The savings goal calculator starts from a target and a date and tells you what to save each month.' },
    ],
  },
  Widget: SavingsCalculator,
  Body: () => (
    <Prose>
      <h2 id="how-it-works">How does the savings calculator work?</h2>
      <p>Each month the balance earns one month of interest (the yearly rate ÷ 12), then your deposit is added. This is <A href="/glossary#compound-interest">compound interest</A>: interest is earned on earlier interest too, so growth speeds up the longer you keep going.</p>
      <Formula label="Future value equals start times one plus r to the n, plus deposit times one plus r to the n minus one, divided by r">Balance = start × (1 + r)ⁿ + deposit × ((1 + r)ⁿ − 1) ÷ r</Formula>
      <p>Here <code>r</code> is the monthly rate and <code>n</code> the number of months. With a 0% rate it is simply start + deposit × months.</p>
      <Example>
        <p>Start with <strong>KSh 20,000</strong> and add <strong>KSh 5,000 a month</strong> for 5 years. You deposit KSh 320,000 in total. At an assumed 8% a year, compounded monthly, the balance grows to about <strong>KSh 397,000</strong>, so roughly KSh 77,000 comes from interest.</p>
      </Example>
      <h2 id="what-matters">What makes the biggest difference?</h2>
      <ul>
        <li><strong>How much you add each month.</strong> For the first few years, deposits matter far more than the rate.</li>
        <li><strong>How long you keep going.</strong> Interest compounds, so the final years add the most.</li>
        <li><strong>Starting now.</strong> Automate the deposit on payday (<A href="/blog/pay-yourself-first">pay yourself first</A>) so it happens before spending.</li>
      </ul>
      <h2 id="limits">Assumptions and limits</h2>
      <ul>
        <li>The rate stays the same for the whole period, and there are no fees, taxes or withdrawals. Real products differ: check the terms, including any withholding tax on interest.</li>
        <li>Returns on investments such as money market funds are not guaranteed. Check that any provider is regulated by the <Ext href="https://www.centralbank.go.ke/">Central Bank of Kenya</Ext>, <Ext href="https://www.cma.or.ke/">Capital Markets Authority</Ext> or <Ext href="https://www.sasra.go.ke/">SASRA</Ext>, as relevant.</li>
        <li>Your numbers stay in your browser.</li>
      </ul>
      <Callout tone="tip">Saving for something specific, like school fees? The <A href="/calculators/savings-goal">savings goal calculator</A> works backwards from the amount and the date.</Callout>
    </Prose>
  ),
}

const freedom: Calculator = {
  meta: {
    slug: 'financial-freedom',
    name: 'Financial freedom calculator',
    title: 'Financial freedom calculator: when could work become optional?',
    seoTitle: 'Financial freedom calculator',
    description: 'Estimate your financial independence number (25× yearly spending at a 4% withdrawal rate) and how many years it could take at your savings rate. Assumptions shown.',
    summary: 'Your financial freedom number is roughly 25 times your yearly spending (a 4% withdrawal rate). Enter your income, spending and savings to estimate how long it could take. It’s an estimate built on assumptions, not a promise.',
    keywords: ['financial freedom calculator', 'financial independence calculator', 'FIRE calculator Kenya', 'how much do I need to retire', '4% rule calculator'],
    updated: UPDATED,
    related: [
      { href: '/financial-freedom', label: 'What financial freedom means' },
      { href: '/calculators/debt-payoff', label: 'Debt payoff calculator' },
      { href: '/glossary#four-percent-rule', label: 'The 4% rule' },
    ],
    faq: [
      { q: 'What is a financial freedom number?', a: 'The amount of invested money whose yearly withdrawals could cover your spending. At a 4% withdrawal rate it is 25 times your yearly spending. It is a planning estimate, not a guarantee.' },
      { q: 'Is the 4% rule reliable in Kenya?', a: 'It comes from US research on historical US market returns, so treat it as a rough starting point. Higher inflation and different returns mean a lower withdrawal rate, such as 3%, is the more cautious choice.' },
      { q: 'What matters most for reaching financial freedom?', a: 'Your savings rate: the share of income you keep. It both grows your investments and lowers the spending you need to cover. Clearing expensive debt first usually raises it the fastest.' },
    ],
  },
  Widget: FinancialFreedomCalculator,
  Body: () => (
    <Prose>
      <h2 id="how-it-works">How does the calculator work?</h2>
      <Formula label="Freedom number equals yearly spending divided by the withdrawal rate">Freedom number = yearly spending ÷ withdrawal rate</Formula>
      <p>At a 4% withdrawal rate that is 25× your yearly spending. The calculator then grows your current savings plus what you save each month (income − spending) at the return you enter, month by month, until they reach the number.</p>
      <p>The return you enter is a <strong>real</strong> return, meaning after inflation. That keeps every amount in today’s shillings, so the target stays meaningful years from now.</p>
      <Example>
        <p>Spending <strong>KSh 84,000</strong> a month is KSh 1,008,000 a year. At 4%, the freedom number is about <strong>KSh 25.2 million</strong>. Saving KSh 36,000 a month (a 30% savings rate) from KSh 200,000 at an assumed 3% real return takes several decades. Raising the savings rate shortens it far more than chasing higher returns.</p>
      </Example>
      <h2 id="limits">Assumptions and limits</h2>
      <Callout tone="warn" title="This is an estimate, not a forecast">
        <p>Investment returns are never guaranteed and can be negative for years. The 4% guideline comes from US research (often linked to the 1998 “Trinity study”) and may not hold elsewhere. Use the result to compare choices, such as saving more or clearing debt, not as a promise.</p>
      </Callout>
      <ul>
        <li>Clear expensive debt and build an <A href="/calculators/emergency-fund">emergency fund</A> before investing for independence.</li>
        <li>Check that any investment provider is licensed by the <Ext href="https://www.cma.or.ke/">Capital Markets Authority</Ext>.</li>
      </ul>
    </Prose>
  ),
}

export const CALCULATORS: Calculator[] = [budget, savingsGrowth, savings, emergency, debt, freedom]

export const getCalculator = (slug: string) => CALCULATORS.find((c) => c.meta.slug === slug)
