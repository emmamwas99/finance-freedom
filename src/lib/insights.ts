import {
  activeCategories,
  debtOverview,
  expectedIncomeFor,
  freedomScore,
  monthPlan,
  openLoans,
  plannedIncome,
  summarize,
} from './calc'
import { currentMonth, money, monthLabel, monthOf, pct, shiftMonth } from './format'
import type { AppData, Category } from './types'

export type Status = 'good' | 'warn' | 'bad'

// =====================================================================
// Monthly report
// =====================================================================

export function monthReport(data: AppData, key: string) {
  const plan = monthPlan(data, key)
  const prevKey = shiftMonth(key, -1)
  const prev = monthPlan(data, prevKey)
  const s = plan.summary
  const ps = prev.summary
  const score = freedomScore(data, s)
  const income = plan.income
  const kept = income - s.spent
  const prevKept = prev.income - ps.spent
  const expected = expectedIncomeFor(data, key)

  const everyday = activeCategories(data).filter((c) => c.kind === 'need' || c.kind === 'want')
  const limitsTotal = everyday.reduce((t, c) => t + c.budget, 0)

  const categories = data.categories
    .map((c) => ({ c, limit: c.budget, spent: s.byCategory[c.id] ?? 0, prev: ps.byCategory[c.id] ?? 0 }))
    .filter((r) => r.spent > 0 || (r.limit > 0 && !r.c.archived))
    .sort((a, b) => b.spent - a.spent)

  const top = data.expenses
    .filter((e) => monthOf(e.date) === key)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)

  const overLimit = categories.filter((r) => r.limit > 0 && r.spent > r.limit)
  const unpaid = plan.payments.filter((p) => !p.paid)
  const paidCount = plan.payments.length - unpaid.length
  const wealth = s.saved + s.invested

  // ---- what went well / what to improve ----
  const wins: string[] = []
  const fixes: string[] = []
  if (income > 0 && s.spent <= income) wins.push(`You spent less than you earned and kept ${money(kept)} (${pct(kept / income)} of income).`)
  if (income > 0 && s.spent > income) fixes.push(`You spent ${money(s.spent - income)} more than your income. Cut "wants" first next month.`)
  if (plan.payments.length && unpaid.length === 0) wins.push(`All ${plan.payments.length} planned payments were made.`)
  if (unpaid.length && key <= currentMonth())
    fixes.push(`${unpaid.length} payment${unpaid.length > 1 ? 's' : ''} not ticked as paid: ${unpaid.map((p) => p.bill.name).join(', ')}.`)
  if (s.debtPaid > 0) wins.push(`You paid ${money(s.debtPaid)} towards your debts.`)
  if (s.borrowed > 0) fixes.push(`You borrowed ${money(s.borrowed)}. Plan the repayment and find what pushed you to borrow.`)
  else if (s.count > 0) wins.push('You did not take any new loans.')
  if (wealth > 0) wins.push(`You put ${money(wealth)} into savings or investments.`)
  else if (s.count > 0) fixes.push('Nothing went to savings or investments. Even 5% of income is a start.')
  if (overLimit.length)
    fixes.push(`Over the limit: ${overLimit.map((r) => `${r.c.name} by ${money(r.spent - r.limit)}`).join(', ')}.`)
  else if (limitsTotal > 0 && s.count > 0) wins.push('Every spending limit was respected.')
  if (ps.spent > 0 && s.spent < ps.spent) wins.push(`You spent ${money(ps.spent - s.spent)} less than in ${monthLabel(prevKey, 'tiny')}.`)
  if (ps.spent > 0 && s.spent > ps.spent * 1.15) fixes.push(`Spending rose ${pct(s.spent / ps.spent - 1)} compared to ${monthLabel(prevKey, 'tiny')}.`)
  if (limitsTotal === 0) fixes.push('Set spending limits on the Monthly plan so you get warned before overspending.')

  const isFuture = key > currentMonth()
  const hasData = s.count > 0 || s.earned > 0
  const verdict: { status: Status; title: string } = isFuture
    ? { status: 'warn', title: "This month hasn't started yet" }
    : !hasData
      ? { status: 'warn', title: 'Nothing recorded for this month' }
      : score.score >= 75
        ? { status: 'good', title: 'A good month 👏' }
        : score.score >= 50
          ? { status: 'warn', title: 'An okay month, with room to improve' }
          : { status: 'bad', title: 'A tough month. Let’s fix it next month' }

  return {
    key,
    prevKey,
    plan,
    prev,
    s,
    ps,
    score,
    income,
    expected,
    kept,
    prevKept,
    limitsTotal,
    categories,
    top,
    paidCount,
    unpaid,
    wealth,
    wins,
    fixes,
    verdict,
    hasData,
  }
}

// =====================================================================
// Am I on track?
// =====================================================================

export interface Check {
  id: string
  title: string
  status: Status
  metric: string
  detail: string
  advice?: string
}

function monthsWithData(data: AppData, keys: string[]) {
  return keys.filter((k) => {
    const s = summarize(data, k)
    return s.count > 0 || s.earned > 0
  })
}

export function progressCheck(data: AppData) {
  const now = currentMonth()
  const window = monthsWithData(data, [shiftMonth(now, -2), shiftMonth(now, -1), now])
  const sums = window.map((k) => summarize(data, k))
  const incomeOf = (i: number) => plannedIncome(data, window[i], sums[i].earned)
  const income = sums.reduce((t, _, i) => t + incomeOf(i), 0)
  const spent = sums.reduce((t, s) => t + s.spent, 0)
  const borrowed = sums.reduce((t, s) => t + s.borrowed, 0)
  const debtPaid = sums.reduce((t, s) => t + s.debtPaid, 0)
  const wealth = sums.reduce((t, s) => t + s.saved + s.invested, 0)
  const wants = sums.reduce((t, s) => t + s.byKind.want, 0)
  const n = Math.max(1, window.length)
  const debt = debtOverview(data)
  const loans = openLoans(data)
  const checks: Check[] = []
  const period = window.length > 1 ? `last ${window.length} months` : 'this month'

  if (window.length === 0) return { empty: true as const }

  // 1. Living within income
  {
    const r = income > 0 ? spent / income : spent > 0 ? 2 : 0
    const over = (spent - income) / n
    checks.push({
      id: 'living',
      title: 'Living within your income',
      status: r <= 0.9 ? 'good' : r <= 1 ? 'warn' : 'bad',
      metric: `${pct(r)} of income spent`,
      detail: `Over the ${period} you spent ${money(spent)} out of ${money(income)}.`,
      advice:
        r > 1
          ? `You overspend by about ${money(over)} a month. Cut that much, starting with “wants”.`
          : r > 0.9
            ? 'You spend almost everything you earn. Aim to keep at least 10% each month.'
            : undefined,
    })
  }

  // 2. No borrowing to survive
  {
    const r = income > 0 ? borrowed / income : 0
    checks.push({
      id: 'borrowing',
      title: 'Not borrowing to get by',
      status: borrowed === 0 ? 'good' : r <= 0.1 ? 'warn' : 'bad',
      metric: borrowed === 0 ? 'No new loans' : `${money(borrowed)} borrowed`,
      detail: borrowed === 0 ? `You haven't taken any new loan in the ${period}.` : `You took ${money(borrowed)} in new loans over the ${period}.`,
      advice: borrowed > 0 ? 'Stop new loans. Build an emergency fund of one month’s needs so surprises don’t force you to borrow.' : undefined,
    })
  }

  // 3. Debt going down
  if (loans.length > 0 || borrowed > 0) {
    const highest = [...loans].sort((a, b) => b.loan.interestRate - a.loan.interestRate)[0]
    checks.push({
      id: 'debt-direction',
      title: 'Debt is going down',
      status: debtPaid > borrowed && debtPaid > 0 ? 'good' : debtPaid > 0 ? 'warn' : 'bad',
      metric: `${money(debtPaid)} repaid vs ${money(borrowed)} borrowed`,
      detail: `Total debt now: ${money(debt.total)}.`,
      advice:
        debtPaid <= borrowed
          ? `You're borrowing as fast as you repay. Freeze new loans${highest ? ` and put any extra into ${highest.loan.name}` : ''}.`
          : highest && highest.loan.interestRate > 0
            ? `Good. Any extra shilling should go to ${highest.loan.name} (${highest.loan.interestRate}% interest).`
            : undefined,
    })
  } else {
    checks.push({ id: 'debt-direction', title: 'Debt is going down', status: 'good', metric: 'No open loans', detail: 'You have no debts recorded. Keep it that way.' })
  }

  // 4. Debt burden
  {
    const inc = expectedIncomeFor(data, now) || income / n
    const monthly = monthPlan(data, now).payments.filter((p) => data.categories.find((c) => c.id === p.bill.categoryId)?.kind === 'debt').reduce((t, p) => t + p.planned, 0) || debt.monthly
    const r = inc > 0 ? monthly / inc : 0
    const smallest = [...loans].sort((a, b) => a.balance - b.balance)[0]
    checks.push({
      id: 'burden',
      title: 'Debt payments are manageable',
      status: monthly === 0 ? 'good' : r < 0.3 ? 'good' : r < 0.5 ? 'warn' : 'bad',
      metric: monthly === 0 ? 'No debt payments' : `${pct(r)} of income`,
      detail: monthly === 0 ? 'None of your income goes to loan repayments.' : `${money(monthly)} a month goes to loan repayments.`,
      advice:
        r >= 0.3
          ? `Over 30% of income going to debt is heavy. Take no new loans${smallest ? `, clear ${smallest.loan.name} (${money(smallest.balance)} left) first, then move its payment to the next loan` : ''}.`
          : undefined,
    })
  }

  // 5. Saving / investing
  {
    const r = income > 0 ? wealth / income : 0
    const target = (income / n) * 0.1
    checks.push({
      id: 'saving',
      title: 'Building wealth (saving or investing)',
      status: r >= 0.1 ? 'good' : r > 0 ? 'warn' : 'bad',
      metric: `${pct(r)} of income`,
      detail: `${money(wealth)} went to savings, the shop or other investments over the ${period}.`,
      advice: r < 0.1 ? `Pay yourself first: move ${money(target)} (10%) to savings or the shop the day your salary arrives.` : undefined,
    })
  }

  // 6. Spending limits
  {
    const withLimit = activeCategories(data).filter((c) => c.budget > 0)
    const keys = [now, shiftMonth(now, -1)]
    const over: { c: Category; by: number; key: string }[] = []
    for (const k of keys) {
      const s = summarize(data, k)
      for (const c of withLimit) if ((s.byCategory[c.id] ?? 0) > c.budget) over.push({ c, by: (s.byCategory[c.id] ?? 0) - c.budget, key: k })
    }
    checks.push({
      id: 'limits',
      title: 'Keeping to your spending limits',
      status: withLimit.length === 0 ? 'warn' : over.length === 0 ? 'good' : over.length <= 2 ? 'warn' : 'bad',
      metric: withLimit.length === 0 ? 'No limits set' : `${over.length} time${over.length === 1 ? '' : 's'} over`,
      detail: withLimit.length === 0 ? 'Without limits the app cannot warn you before you overspend.' : over.length === 0 ? 'Every limit was respected this month and last month.' : `Over the limit: ${over.map((o) => `${o.c.name} (${monthLabel(o.key, 'tiny')}, +${money(o.by)})`).join(', ')}.`,
      advice:
        withLimit.length === 0
          ? 'Set limits for food, transport and fun on the Monthly plan.'
          : over.length
            ? `Either cut back on ${over[0].c.name} or set a realistic limit for it. A limit you always break is not a plan.`
            : undefined,
    })
  }

  // 7. Wants
  {
    const r = spent > 0 ? wants / spent : 0
    const excess = Math.max(0, wants - spent * 0.3) / n
    checks.push({
      id: 'wants',
      title: '“Wants” under control',
      status: r <= 0.3 ? 'good' : r <= 0.4 ? 'warn' : 'bad',
      metric: `${pct(r)} of spending`,
      detail: `${money(wants)} went on eating out, clothes, fun and other wants.`,
      advice: r > 0.3 ? `Bringing wants down to 30% frees about ${money(excess)} a month for debt or the shop.` : undefined,
    })
  }

  // 8. Next months covered
  {
    const next = Array.from({ length: 6 }, (_, i) => monthPlan(data, shiftMonth(now, i + 1)))
    const short = next.filter((p) => p.afterPayments < 0)
    const tight = next.filter((p) => p.afterPayments >= 0 && p.income > 0 && p.afterPayments < p.income * 0.15)
    const first = short[0]
    const monthsAway = first ? next.indexOf(first) + 1 : 0
    checks.push({
      id: 'upcoming',
      title: 'Next 6 months are covered',
      status: short.length ? 'bad' : tight.length ? 'warn' : 'good',
      metric: short.length ? `${short.length} month${short.length > 1 ? 's' : ''} short` : tight.length ? `${tight.length} tight month${tight.length > 1 ? 's' : ''}` : 'All covered',
      detail: short.length
        ? `${short.map((p) => `${monthLabel(p.key, 'short')} (${money(p.afterPayments)})`).join(', ')}: payments are more than income.`
        : tight.length
          ? `Less than 15% left after payments in ${tight.map((p) => monthLabel(p.key, 'short')).join(', ')}.`
          : 'Your income covers all planned payments in the coming months.',
      advice: first ? `Start setting aside ${money(-first.afterPayments / monthsAway)} a month now to cover ${monthLabel(first.key)}.` : undefined,
    })
  }

  // 9. Debt-free date
  if (debt.total > 0) {
    checks.push({
      id: 'debt-free',
      title: 'On course to be debt-free',
      status: !debt.freeKey ? 'bad' : debt.monthsLeft <= 24 ? 'good' : 'warn',
      metric: debt.freeKey ? monthLabel(debt.freeKey, 'short') : 'Never at this rate',
      detail: debt.freeKey ? `${debt.monthsLeft} months to go with ${money(debt.monthly)} a month in repayments.` : 'Your planned repayments do not cover the interest on at least one loan.',
      advice: !debt.freeKey ? 'Increase the monthly payment on that loan, or it will grow forever.' : debt.monthsLeft > 24 ? 'Use the “pay extra” calculator on Debts & goals to see how to finish sooner.' : undefined,
    })
  }

  // 10. Tracking habit
  {
    const since = new Date(Date.now() - 14 * 864e5).toISOString().slice(0, 10)
    const recent = data.expenses.filter((e) => e.date >= since).length
    checks.push({
      id: 'tracking',
      title: 'Recording every expense',
      status: recent >= 8 ? 'good' : recent >= 3 ? 'warn' : 'bad',
      metric: `${recent} entries in 14 days`,
      detail: 'The plan only works if what you spend is recorded.',
      advice: recent < 8 ? 'Record every expense the same day, even KSh 50 for a matatu. On desktop just press N.' : undefined,
    })
  }

  const points = checks.reduce((t, c) => t + (c.status === 'good' ? 2 : c.status === 'warn' ? 1 : 0), 0)
  const score = Math.round((points / (checks.length * 2)) * 100)
  const verdict: { status: Status; title: string; text: string } =
    score >= 75
      ? { status: 'good', title: 'You’re heading in the right direction', text: 'Keep doing what you’re doing, and push any extra money into debt and the shop.' }
      : score >= 50
        ? { status: 'warn', title: 'Mostly on track, with a few things to fix', text: 'Fix the items marked below and you’ll speed up your journey to being debt-free.' }
        : { status: 'bad', title: 'Off track. Time to act', text: 'Your money is moving the wrong way. Start with the top three actions below this month.' }

  const order: Record<Status, number> = { bad: 0, warn: 1, good: 2 }
  const sorted = [...checks].sort((a, b) => order[a.status] - order[b.status])
  const actions = sorted.filter((c) => c.status !== 'good' && c.advice).slice(0, 3)

  // trend: last 6 months
  const trend = Array.from({ length: 6 }, (_, i) => {
    const k = shiftMonth(now, i - 5)
    const s = summarize(data, k)
    const inc = plannedIncome(data, k, s.earned)
    return { key: k, earned: s.earned, income: inc, spent: s.spent, kept: inc - s.spent, debtPaid: s.debtPaid, borrowed: s.borrowed, has: s.count > 0 || s.earned > 0 }
  })
  const withData = trend.filter((t) => t.has)
  const half = Math.floor(withData.length / 2)
  const direction =
    withData.length >= 2
      ? (() => {
          const a = withData.slice(0, half || 1)
          const b = withData.slice(half || 1)
          const avg = (x: typeof a) => x.reduce((t, y) => t + y.kept, 0) / x.length
          const diff = avg(b) - avg(a)
          return diff > 0 ? { up: true, text: `You're keeping ${money(diff)} more per month than before.` } : { up: false, text: `You're keeping ${money(-diff)} less per month than before.` }
        })()
      : null

  return { empty: false as const, checks: sorted, score, verdict, actions, trend, direction, period }
}
