export interface GlossaryTerm {
  /** kebab-case, used as the #anchor */
  slug: string
  term: string
  /** 1–2 plain sentences, quotable on its own, starting with the term's meaning */
  definition: string
  /** optional 1–3 extra sentences: an example in KSh or a Kenya-specific note */
  detail?: string
  /** 0–2 internal links */
  related?: { href: string; label: string }[]
}

/** Sorted A–Z by term (numbers first). */
export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: 'four-percent-rule',
    term: '4% rule',
    definition:
      'The 4% rule is a rule of thumb that says you can withdraw about 4% of your investments in the first year of retirement, then raise that amount with inflation each year, with a good chance of the money lasting around 30 years.',
    detail:
      'It comes from US research on retirement withdrawals, often linked to the 1998 “Trinity study”, which used US share and bond returns. It’s a rough guideline, not a guarantee, and returns, inflation and costs in Kenya differ. Turned around, it suggests a target of about 25 times your yearly spending: KSh 1,200,000 a year of spending implies roughly KSh 30 million invested.',
    related: [
      { href: '/calculators/financial-freedom', label: 'Financial freedom calculator' },
      { href: '/glossary#financial-independence', label: 'Financial independence' },
    ],
  },
  {
    slug: '50-30-20-rule',
    term: '50/30/20 rule',
    definition:
      'The 50/30/20 rule is a simple budgeting guideline that splits take-home pay into about 50% for needs, 30% for wants and 20% for savings and extra debt repayment.',
    detail:
      'On net pay of KSh 80,000, that’s KSh 40,000 for needs, KSh 24,000 for wants and KSh 16,000 for saving or clearing debt. Rent, school fees and loan repayments often push needs above 50%, so treat the split as a starting point, not a rule you’ve failed.',
    related: [
      { href: '/guides/50-30-20-rule', label: 'The 50/30/20 rule, explained' },
      { href: '/glossary#needs-and-wants', label: 'Needs and wants' },
    ],
  },
  {
    slug: 'amortisation',
    term: 'Amortisation',
    definition:
      'Amortisation is paying off a loan through regular instalments that each cover some interest and some of the principal, so the balance reaches zero by the end of the loan term.',
    detail:
      'On a reducing-balance loan, early instalments are mostly interest and later ones mostly principal. Some lenders charge “flat-rate” interest on the original amount for the whole term instead, which costs more than the same rate on a reducing balance.',
    related: [
      { href: '/glossary#principal', label: 'Principal' },
      { href: '/calculators/debt-payoff', label: 'Debt payoff calculator' },
    ],
  },
  {
    slug: 'annual-percentage-rate',
    term: 'Annual percentage rate (APR)',
    definition:
      'The annual percentage rate (APR) is the yearly cost of borrowing, including interest and fees, shown as a percentage of the amount borrowed. It lets you compare loans of different lengths and fee structures on the same basis.',
    detail:
      'A short loan with a “small” fee can have a very high yearly rate: paying KSh 100 to borrow KSh 2,000 for 10 days works out to roughly 180% a year. Before you borrow, ask for the total cost of the loan, including every fee, not just the interest rate.',
    related: [
      { href: '/blog/true-cost-of-mobile-loans', label: 'The true cost of mobile loans' },
      { href: '/glossary#interest-rate', label: 'Interest rate' },
    ],
  },
  {
    slug: 'budget',
    term: 'Budget',
    definition:
      'A budget is a plan for how you’ll use your income over a set period, usually a month, made before you spend the money.',
    detail:
      'A payments-first budget starts by listing everything due this month, such as rent, loan instalments, school fees and the chama contribution, and then plans how to use what’s left after those payments.',
    related: [
      { href: '/guides/how-to-make-a-monthly-budget', label: 'How to make a monthly budget' },
      { href: '/calculators/budget', label: 'Budget calculator' },
    ],
  },
  {
    slug: 'cash-flow',
    term: 'Cash flow',
    definition:
      'Cash flow is the money moving into and out of your accounts over a period. Positive cash flow means more came in than went out; negative cash flow means you spent more than you received.',
    detail:
      'Borrowed money isn’t income. If you earned KSh 70,000, spent KSh 78,000 and covered the gap with a mobile loan, your cash flow from earnings was negative by KSh 8,000.',
    related: [
      { href: '/guides/how-to-track-expenses', label: 'How to track expenses' },
      { href: '/expense-tracker', label: 'Expense tracker' },
    ],
  },
  {
    slug: 'chama',
    term: 'Chama',
    definition:
      'A chama is an informal savings and investment group, common in Kenya, whose members contribute regularly to a shared pot and then lend to each other, take turns receiving the pot, or invest together.',
    detail:
      'In a merry-go-round chama each member receives the whole contribution in turn; others pool money to buy land or shares. Treat your contribution as a fixed monthly payment, and agree written rules on contributions, loans and leaving the group.',
    related: [
      { href: '/glossary#sacco', label: 'SACCO' },
      { href: '/saving-money', label: 'Saving money' },
    ],
  },
  {
    slug: 'compound-interest',
    term: 'Compound interest',
    definition:
      'Compound interest is interest earned on both your original money and the interest it has already earned, so growth speeds up over time. It works the same way against you on debt.',
    detail:
      'At an illustrative 10% a year, KSh 100,000 becomes KSh 110,000 after one year and KSh 121,000 after two, because the second year’s interest is also earned on the first year’s KSh 10,000.',
    related: [
      { href: '/calculators/savings-goal', label: 'Savings goal calculator' },
      { href: '/glossary#interest-rate', label: 'Interest rate' },
    ],
  },
  {
    slug: 'credit-reference-bureau',
    term: 'Credit reference bureau (CRB)',
    definition:
      'A credit reference bureau (CRB) is a company that collects information on how people and businesses repay credit and shares it with lenders, who use it to decide whether to lend and on what terms.',
    detail:
      'In Kenya, CRBs are licensed by the Central Bank of Kenya. Lenders share both positive and negative repayment information, so paying on time builds a good record and late payments can make borrowing harder or more expensive. You can request your own credit report from a licensed CRB.',
    related: [
      { href: '/blog/true-cost-of-mobile-loans', label: 'The true cost of mobile loans' },
      { href: '/guides/how-to-get-out-of-debt', label: 'How to get out of debt' },
    ],
  },
  {
    slug: 'debt-avalanche',
    term: 'Debt avalanche',
    definition:
      'The debt avalanche is a repayment method where you pay the minimum on every debt and put any extra money towards the debt with the highest interest rate first. It usually costs the least in total interest.',
    detail:
      'If a mobile loan costs far more per year than your SACCO loan, every extra shilling goes to the mobile loan until it’s cleared, then to the next most expensive debt.',
    related: [
      { href: '/guides/debt-avalanche-vs-snowball', label: 'Debt avalanche vs snowball' },
      { href: '/calculators/debt-payoff', label: 'Debt payoff calculator' },
    ],
  },
  {
    slug: 'debt-snowball',
    term: 'Debt snowball',
    definition:
      'The debt snowball is a repayment method where you pay the minimum on every debt and put any extra money towards the smallest balance first, whatever its interest rate.',
    detail:
      'When the smallest debt is gone, its payment rolls into the next smallest, so the amount aimed at each debt grows like a snowball. The quick wins keep many people going, though it can cost more interest than the avalanche.',
    related: [
      { href: '/guides/debt-avalanche-vs-snowball', label: 'Debt avalanche vs snowball' },
      { href: '/glossary#debt-avalanche', label: 'Debt avalanche' },
    ],
  },
  {
    slug: 'debt-to-income-ratio',
    term: 'Debt-to-income ratio',
    definition:
      'Your debt-to-income ratio is the share of your monthly income that goes to debt repayments, worked out as total monthly repayments ÷ monthly income × 100.',
    detail:
      'If KSh 30,000 of your KSh 100,000 monthly pay goes to loans, your ratio is 30%. Lenders look at it when deciding how much more you can borrow, and the lower it is, the more room you have to save. Say whether you’re using gross or net pay, because the answer differs.',
    related: [
      { href: '/guides/how-to-get-out-of-debt', label: 'How to get out of debt' },
      { href: '/calculators/debt-payoff', label: 'Debt payoff calculator' },
    ],
  },
  {
    slug: 'emergency-fund',
    term: 'Emergency fund',
    definition:
      'An emergency fund is money set aside only for genuine surprises, such as a job loss, a medical bill or an urgent repair, so you don’t have to borrow when they happen.',
    detail:
      'A common target is three to six months of essential costs. If your essentials come to KSh 50,000 a month, that’s KSh 150,000 to KSh 300,000; a smaller first goal, such as one month, is a good place to start.',
    related: [
      { href: '/guides/how-to-build-an-emergency-fund', label: 'How to build an emergency fund' },
      { href: '/calculators/emergency-fund', label: 'Emergency fund calculator' },
    ],
  },
  {
    slug: 'financial-independence',
    term: 'Financial independence',
    definition:
      'Financial independence is having enough income from savings, investments or other sources that don’t need your work to cover your living costs, so paid work becomes a choice rather than a necessity.',
    detail:
      'A common rough estimate, based on the 4% rule, is about 25 times your yearly spending, invested. Clearing debt and lowering fixed costs both bring it closer, because you then need less to live on.',
    related: [
      { href: '/financial-freedom', label: 'Financial freedom' },
      { href: '/calculators/financial-freedom', label: 'Financial freedom calculator' },
    ],
  },
  {
    slug: 'fixed-expenses',
    term: 'Fixed expenses',
    definition:
      'Fixed expenses are costs that stay the same, or nearly the same, each time they’re due, such as rent, loan instalments, school fees, insurance premiums and chama contributions.',
    detail:
      'Because they’re predictable, plan them first: list them before your salary lands, add them up, and you know what’s left after payments for everything else.',
    related: [
      { href: '/glossary#variable-expenses', label: 'Variable expenses' },
      { href: '/guides/how-to-make-a-monthly-budget', label: 'How to make a monthly budget' },
    ],
  },
  {
    slug: 'gross-pay',
    term: 'Gross pay',
    definition: 'Gross pay is your total salary before any deductions are taken off. It’s usually the headline figure in your contract or offer letter.',
    detail:
      'On a Kenyan payslip, statutory deductions such as PAYE, NSSF, SHIF and the Housing Levy, plus items such as SACCO contributions or loan check-offs, come off gross pay to give your net pay.',
    related: [
      { href: '/glossary#net-pay', label: 'Net pay' },
      { href: '/guides/how-to-make-a-monthly-budget', label: 'How to make a monthly budget' },
    ],
  },
  {
    slug: 'guarantor',
    term: 'Guarantor',
    definition:
      'A guarantor is a person who agrees to repay someone else’s loan if the borrower doesn’t. In Kenyan SACCOs, members commonly guarantee each other’s loans using their own deposits.',
    detail:
      'If the borrower defaults, the lender can recover the money from the guarantor, for example from their SACCO deposits. Only guarantee an amount you could afford to lose.',
    related: [{ href: '/glossary#sacco', label: 'SACCO' }],
  },
  {
    slug: 'inflation',
    term: 'Inflation',
    definition: 'Inflation is the general rise in prices over time, which means the same amount of money buys a little less each year.',
    detail:
      'At an illustrative 5% inflation rate, shopping that costs KSh 10,000 today would cost about KSh 10,500 a year from now. Kenya’s official inflation figures are published monthly by the Kenya National Bureau of Statistics.',
    related: [
      { href: '/saving-money', label: 'Saving money' },
      { href: '/glossary#compound-interest', label: 'Compound interest' },
    ],
  },
  {
    slug: 'interest-rate',
    term: 'Interest rate',
    definition:
      'An interest rate is the price of borrowing money, or the reward for saving it, shown as a percentage of the amount for a set period, usually a year.',
    detail:
      'Always check whether a rate is per month or per year, and whether it’s charged on a reducing balance or “flat” on the original amount. A 12% flat rate costs more than 12% on a reducing balance, because the interest never falls as you repay.',
    related: [
      { href: '/glossary#annual-percentage-rate', label: 'Annual percentage rate (APR)' },
      { href: '/glossary#compound-interest', label: 'Compound interest' },
    ],
  },
  {
    slug: 'lifestyle-inflation',
    term: 'Lifestyle inflation',
    definition:
      'Lifestyle inflation, also called lifestyle creep, is when your spending rises every time your income does, so a pay rise leaves you no better off.',
    detail:
      'Decide where a raise goes before it lands. If your take-home pay rises by KSh 10,000, sending KSh 5,000 to savings or debt still leaves you KSh 5,000 more to enjoy.',
    related: [
      { href: '/blog/why-you-run-out-of-money-before-payday', label: 'Why you run out of money before payday' },
      { href: '/blog/pay-yourself-first', label: 'Pay yourself first' },
    ],
  },
  {
    slug: 'liquidity',
    term: 'Liquidity',
    definition:
      'Liquidity is how quickly and cheaply something can be turned into cash without losing value. Money in a bank account is very liquid; land or a car is not.',
    detail:
      'Emergency money needs to be liquid. SACCO deposits often can’t be withdrawn on demand, and selling a plot can take months, so neither suits an emergency fund on its own.',
    related: [
      { href: '/glossary#emergency-fund', label: 'Emergency fund' },
      { href: '/guides/how-to-build-an-emergency-fund', label: 'How to build an emergency fund' },
    ],
  },
  {
    slug: 'minimum-payment',
    term: 'Minimum payment',
    definition: 'The minimum payment is the smallest amount a lender requires you to pay by the due date to keep an account in good standing.',
    detail:
      'Paying only the minimum keeps you out of default but clears the balance slowly, and on some credit much of it goes to interest. Pay more where you can, starting with your most expensive debt.',
    related: [
      { href: '/glossary#debt-avalanche', label: 'Debt avalanche' },
      { href: '/calculators/debt-payoff', label: 'Debt payoff calculator' },
    ],
  },
  {
    slug: 'mobile-loan',
    term: 'Mobile loan',
    definition:
      'A mobile loan is a short-term loan applied for and paid out through your phone, via an app or a mobile money service, usually with little paperwork and very fast approval.',
    detail:
      'Fees on short loans can look small but add up to a very high yearly rate. In Kenya, digital lenders that aren’t banks must be licensed by the Central Bank of Kenya as digital credit providers.',
    related: [
      { href: '/blog/true-cost-of-mobile-loans', label: 'The true cost of mobile loans' },
      { href: '/glossary#overdraft', label: 'Overdraft' },
    ],
  },
  {
    slug: 'money-market-fund',
    term: 'Money market fund',
    definition:
      'A money market fund is a collective investment scheme that pools investors’ money and puts it into short-term, lower-risk investments such as treasury bills and bank deposits.',
    detail:
      'In Kenya, collective investment schemes such as money market funds are regulated by the Capital Markets Authority. Returns aren’t guaranteed and withdrawals usually take a few working days, so check a fund’s fees and terms before you invest.',
    related: [
      { href: '/saving-money', label: 'Saving money' },
      { href: '/blog/sinking-funds-for-school-fees', label: 'Sinking funds for school fees' },
    ],
  },
  {
    slug: 'needs-and-wants',
    term: 'Needs and wants',
    definition:
      'Needs are the costs you must pay to live and work, such as housing, food, transport, health care and school fees; wants are things that make life nicer but could be cut or paused.',
    detail:
      'The line isn’t always obvious: basic food is a need but eating out is a want, and a phone is a need but the newest model is a want. Labelling each spending category shows you where to cut first.',
    related: [
      { href: '/glossary#50-30-20-rule', label: '50/30/20 rule' },
      { href: '/budgeting', label: 'Budgeting' },
    ],
  },
  {
    slug: 'net-pay',
    term: 'Net pay',
    definition: 'Net pay, also called take-home pay, is the amount that reaches your bank account after all deductions are taken from your gross pay.',
    detail:
      'In Kenya those deductions include PAYE, NSSF, SHIF and the Housing Levy, plus any SACCO contributions or loan check-offs. Budget from net pay, because that’s the money you can actually use.',
    related: [
      { href: '/glossary#gross-pay', label: 'Gross pay' },
      { href: '/guides/how-to-make-a-monthly-budget', label: 'How to make a monthly budget' },
    ],
  },
  {
    slug: 'net-worth',
    term: 'Net worth',
    definition: 'Net worth is everything you own minus everything you owe. It’s a snapshot of your overall financial position at one point in time.',
    detail:
      'If your savings, SACCO deposits and car are worth KSh 900,000 and your loans total KSh 350,000, your net worth is KSh 550,000. The direction it moves over the years matters more than any single month.',
    related: [
      { href: '/financial-health', label: 'Financial health' },
      { href: '/glossary#financial-independence', label: 'Financial independence' },
    ],
  },
  {
    slug: 'overdraft',
    term: 'Overdraft',
    definition:
      'An overdraft lets you spend more than you have in an account, up to a set limit, with the shortfall treated as a loan that’s repaid from the next money you receive.',
    detail:
      'In Kenya, overdrafts are offered on bank accounts and on mobile money lines. Charges are often daily or per transaction, so a small overdraft left unpaid for a few weeks can be expensive when worked out as a yearly rate.',
    related: [
      { href: '/blog/true-cost-of-mobile-loans', label: 'The true cost of mobile loans' },
      { href: '/glossary#annual-percentage-rate', label: 'Annual percentage rate (APR)' },
    ],
  },
  {
    slug: 'pay-yourself-first',
    term: 'Pay yourself first',
    definition:
      'Pay yourself first means moving a set amount into savings or investments as soon as your salary arrives, before you spend on anything else.',
    detail:
      'A standing order for the day after payday, such as KSh 3,000 from a KSh 60,000 salary (5%), makes saving automatic instead of hoping something is left at the end of the month.',
    related: [
      { href: '/blog/pay-yourself-first', label: 'Pay yourself first: how it works' },
      { href: '/glossary#savings-rate', label: 'Savings rate' },
    ],
  },
  {
    slug: 'principal',
    term: 'Principal',
    definition:
      'The principal is the amount you originally borrowed, or the part of a loan balance still owed, not counting interest and fees.',
    detail:
      'On a KSh 200,000 loan, the principal starts at KSh 200,000. Each instalment pays some interest and some principal, and only the principal part reduces what you owe.',
    related: [
      { href: '/glossary#amortisation', label: 'Amortisation' },
      { href: '/glossary#interest-rate', label: 'Interest rate' },
    ],
  },
  {
    slug: 'sacco',
    term: 'SACCO',
    definition:
      'A SACCO (savings and credit co-operative) is a member-owned financial co-operative where members save regularly and can borrow, often up to a multiple of their savings.',
    detail:
      'In Kenya, deposit-taking SACCOs are licensed and supervised by the SACCO Societies Regulatory Authority (SASRA). Many employers deduct SACCO contributions straight from salary through check-off.',
    related: [
      { href: '/saving-money', label: 'Saving money' },
      { href: '/glossary#guarantor', label: 'Guarantor' },
    ],
  },
  {
    slug: 'savings-rate',
    term: 'Savings rate',
    definition: 'Your savings rate is the share of your income that you save or invest, worked out as amount saved ÷ income × 100.',
    detail:
      'Saving KSh 9,000 from net pay of KSh 90,000 is a 10% savings rate. Tracking it month to month shows progress even when the amounts are small.',
    related: [
      { href: '/blog/pay-yourself-first', label: 'Pay yourself first' },
      { href: '/calculators/savings-goal', label: 'Savings goal calculator' },
    ],
  },
  {
    slug: 'sinking-fund',
    term: 'Sinking fund',
    definition:
      'A sinking fund is money you set aside a little at a time for a known future cost, so it doesn’t land on one month’s budget all at once.',
    detail:
      'School fees of KSh 60,000 due in four months need KSh 15,000 a month. Insurance renewals, car servicing and Christmas travel upcountry are other good candidates.',
    related: [
      { href: '/blog/sinking-funds-for-school-fees', label: 'Sinking funds for school fees' },
      { href: '/calculators/savings-goal', label: 'Savings goal calculator' },
    ],
  },
  {
    slug: 'variable-expenses',
    term: 'Variable expenses',
    definition: 'Variable expenses are costs that change from month to month, such as food, fuel, electricity tokens, airtime and eating out.',
    detail:
      'They’re where most overspending happens and the easiest place to adjust. A spending limit for each category, with a warning as you get close, helps keep them in check.',
    related: [
      { href: '/glossary#fixed-expenses', label: 'Fixed expenses' },
      { href: '/guides/how-to-track-expenses', label: 'How to track expenses' },
    ],
  },
  {
    slug: 'zero-based-budget',
    term: 'Zero-based budget',
    definition:
      'A zero-based budget gives every shilling of income a job, such as bills, spending, saving or debt, so that income minus everything planned equals zero.',
    detail:
      'With net pay of KSh 75,000, you keep assigning amounts until all KSh 75,000 is allocated. Zero doesn’t mean spending everything: saving is one of the jobs.',
    related: [
      { href: '/guides/how-to-make-a-monthly-budget', label: 'How to make a monthly budget' },
      { href: '/calculators/budget', label: 'Budget calculator' },
    ],
  },
]
