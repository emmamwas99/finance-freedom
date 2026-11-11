/**
 * Public financial health check. The thresholds mirror the private app's "Am I on track?" checks
 * (src/lib/insights.ts) so the free check and the app tell the same story.
 */

export type HealthStatus = 'good' | 'warn' | 'bad'

export interface HealthInput {
  monthlyIncome: number
  /** Everything spent in a typical month, loan repayments included. */
  monthlySpending: number
  monthlyDebtPayments: number
  /** New borrowing in a typical month (mobile loans, overdrafts, salary advances). */
  monthlyBorrowing: number
  monthlySaving: number
  emergencySavings: number
  essentialsPerMonth: number
  wantsPerMonth: number
  tracking: 'always' | 'sometimes' | 'never'
}

export interface HealthCheck {
  id: string
  title: string
  status: HealthStatus
  metric: string
  advice?: string
}

const pct = (n: number) => `${Math.round(n * 100)}%`

export function financialHealth(i: HealthInput) {
  const income = Math.max(0, i.monthlyIncome)
  const ratio = (a: number, b: number) => (b > 0 ? a / b : a > 0 ? 2 : 0)
  const checks: HealthCheck[] = []

  const spend = ratio(i.monthlySpending, income)
  checks.push({
    id: 'living',
    title: 'Living within your income',
    status: spend <= 0.9 ? 'good' : spend <= 1 ? 'warn' : 'bad',
    metric: `${pct(spend)} of income spent`,
    advice: spend > 1 ? 'You spend more than you earn. Cut “wants” first until spending is below income.' : spend > 0.9 ? 'You spend almost everything you earn. Aim to keep at least 10% each month.' : undefined,
  })

  const borrow = ratio(i.monthlyBorrowing, income)
  checks.push({
    id: 'borrowing',
    title: 'Not borrowing to get by',
    status: i.monthlyBorrowing <= 0 ? 'good' : borrow <= 0.1 ? 'warn' : 'bad',
    metric: i.monthlyBorrowing <= 0 ? 'No new loans' : `${pct(borrow)} of income borrowed`,
    advice: i.monthlyBorrowing > 0 ? 'Stop new loans. Plan next month’s payments before your salary lands, and build a small buffer.' : undefined,
  })

  const burden = ratio(i.monthlyDebtPayments, income)
  checks.push({
    id: 'burden',
    title: 'Debt payments are manageable',
    status: i.monthlyDebtPayments <= 0 || burden < 0.3 ? 'good' : burden < 0.5 ? 'warn' : 'bad',
    metric: i.monthlyDebtPayments <= 0 ? 'No debt payments' : `${pct(burden)} of income`,
    advice: burden >= 0.3 ? 'Over 30% of income going to debt is heavy. Take no new loans and clear the smallest or most expensive loan first.' : undefined,
  })

  const save = ratio(i.monthlySaving, income)
  checks.push({
    id: 'saving',
    title: 'Saving or investing regularly',
    status: save >= 0.1 ? 'good' : save > 0 ? 'warn' : 'bad',
    metric: `${pct(save)} of income`,
    advice: save < 0.1 ? 'Pay yourself first: move 10% to savings the day your salary arrives. Start with 5% if 10% is too much.' : undefined,
  })

  const cover = i.essentialsPerMonth > 0 ? i.emergencySavings / i.essentialsPerMonth : i.emergencySavings > 0 ? 6 : 0
  checks.push({
    id: 'emergency',
    title: 'An emergency fund',
    status: cover >= 3 ? 'good' : cover >= 1 ? 'warn' : 'bad',
    metric: `${cover >= 10 ? Math.round(cover) : cover.toFixed(1)} months of essentials`,
    advice: cover < 1 ? 'Build one month of essential costs first, so a surprise doesn’t force you to borrow.' : cover < 3 ? 'Keep going until you have three months of essentials set aside.' : undefined,
  })

  const wants = ratio(i.wantsPerMonth, i.monthlySpending)
  checks.push({
    id: 'wants',
    title: '“Wants” under control',
    status: wants <= 0.3 ? 'good' : wants <= 0.4 ? 'warn' : 'bad',
    metric: `${pct(wants)} of spending`,
    advice: wants > 0.3 ? 'Bring wants down to about 30% of spending and send the difference to debt or savings.' : undefined,
  })

  checks.push({
    id: 'tracking',
    title: 'Recording every expense',
    status: i.tracking === 'always' ? 'good' : i.tracking === 'sometimes' ? 'warn' : 'bad',
    metric: i.tracking === 'always' ? 'Every expense' : i.tracking === 'sometimes' ? 'Some expenses' : 'Not tracking',
    advice: i.tracking !== 'always' ? 'Record every expense the same day, even KSh 50. A plan only works if spending is recorded.' : undefined,
  })

  const points = checks.reduce((t, c) => t + (c.status === 'good' ? 2 : c.status === 'warn' ? 1 : 0), 0)
  const score = Math.round((points / (checks.length * 2)) * 100)
  const verdict: { status: HealthStatus; title: string } =
    score >= 75 ? { status: 'good', title: 'You’re in good financial health' } : score >= 50 ? { status: 'warn', title: 'Mostly healthy, with a few things to fix' } : { status: 'bad', title: 'Your money needs attention' }
  const order: Record<HealthStatus, number> = { bad: 0, warn: 1, good: 2 }
  const actions = [...checks].sort((a, b) => order[a.status] - order[b.status]).filter((c) => c.status !== 'good' && c.advice).slice(0, 3)
  return { checks, score, verdict, actions }
}
