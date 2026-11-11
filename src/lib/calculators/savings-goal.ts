/**
 * Savings goal maths with optional interest, compounded monthly (annual rate / 12).
 * Without interest everything reduces to simple division.
 */

/** Monthly amount needed to grow `current` into `target` in `months`. */
export function monthlyForGoal(target: number, current: number, months: number, annualRate = 0) {
  const n = Math.max(1, Math.round(months))
  const r = Math.max(0, annualRate) / 100 / 12
  const grownCurrent = current * (1 + r) ** n
  const remaining = target - grownCurrent
  if (remaining <= 0) return 0
  if (r === 0) return remaining / n
  return (remaining * r) / ((1 + r) ** n - 1)
}

/** Months to reach `target` saving `monthly` from `current`. Infinity if it never gets there (capped at 100 years). */
export function monthsToGoal(target: number, current: number, monthly: number, annualRate = 0) {
  if (current >= target) return 0
  const r = Math.max(0, annualRate) / 100 / 12
  if (monthly <= 0 && (r === 0 || current <= 0)) return Infinity
  let bal = current
  for (let m = 1; m <= 1200; m++) {
    bal = bal * (1 + r) + monthly
    if (bal >= target - 0.005) return m
  }
  return Infinity
}

/** Balance after `months` of saving, with the part that came from interest. */
export function projectSavings(current: number, monthly: number, months: number, annualRate = 0) {
  const r = Math.max(0, annualRate) / 100 / 12
  let bal = current
  for (let m = 0; m < months; m++) bal = bal * (1 + r) + monthly
  const contributed = current + monthly * months
  return { balance: bal, contributed, interest: bal - contributed }
}

/** Whole months from one YYYY-MM to another (to the deadline month, inclusive of saving months before it). */
export function monthsBetween(fromKey: string, toKey: string) {
  const [fy, fm] = fromKey.split('-').map(Number)
  const [ty, tm] = toKey.split('-').map(Number)
  return (ty - fy) * 12 + (tm - fm)
}

/**
 * Savings growth ("how much will I have?"): monthly deposits with interest
 * compounded monthly at annual rate / 12, deposit made at the end of each month.
 * Returns the balance at the end of every year, for a year-by-year table.
 */
export function savingsGrowth(start: number, monthly: number, annualRate: number, years: number) {
  const r = Math.max(0, annualRate) / 100 / 12
  const months = Math.max(0, Math.round(years * 12))
  let bal = Math.max(0, start)
  const yearly: { year: number; balance: number; deposited: number; interest: number }[] = []
  for (let m = 1; m <= months; m++) {
    bal = bal * (1 + r) + Math.max(0, monthly)
    if (m % 12 === 0 || m === months) {
      const deposited = Math.max(0, start) + Math.max(0, monthly) * m
      yearly.push({ year: Math.ceil(m / 12), balance: bal, deposited, interest: bal - deposited })
    }
  }
  const deposited = Math.max(0, start) + Math.max(0, monthly) * months
  return { balance: bal, deposited, interest: bal - deposited, yearly }
}

/** Closed-form future value, used to double-check the month-by-month loop in tests. */
export function futureValue(start: number, monthly: number, annualRate: number, months: number) {
  const r = annualRate / 100 / 12
  if (r === 0) return start + monthly * months
  const g = (1 + r) ** months
  return start * g + (monthly * (g - 1)) / r
}
