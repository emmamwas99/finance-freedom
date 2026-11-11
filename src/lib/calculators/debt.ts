/**
 * Debt payoff engine shared by the private app (debt-free projection, "pay extra" simulator) and the
 * public debt payoff calculator. Interest is charged monthly on the reducing balance (annual rate / 12).
 */

export interface DebtInput {
  name?: string
  balance: number
  /** Planned monthly payment. */
  payment: number
  /** Annual interest rate in %. */
  annualRate: number
}

export interface DebtSimulation {
  /** Total balance at the start of each month; index 0 = today. */
  totals: number[]
  /** Months until every balance is cleared; Infinity if it never clears within the horizon. */
  months: number
  /** Total interest charged over the simulation. */
  interest: number
  /** Month (1-based) each loan is cleared, in input order; Infinity if not cleared. */
  clearedAt: number[]
}

/** Months to clear one balance with a fixed monthly payment. Infinity = never (payment too small). */
export function monthsToClear(balance: number, payment: number, annualRate: number) {
  if (balance <= 0) return 0
  if (payment <= 0) return Infinity
  const r = annualRate / 100 / 12
  if (r === 0) return Math.ceil(balance / payment)
  if (payment <= balance * r) return Infinity
  return Math.ceil(-Math.log(1 - (r * balance) / payment) / Math.log(1 + r))
}

/** Monthly interest on a balance, i.e. the payment needed just to stop it growing. */
export function monthlyInterest(balance: number, annualRate: number) {
  return balance * (annualRate / 100 / 12)
}

/**
 * Month-by-month simulation.
 * - Every loan gets its planned payment; an overpayment in the month it clears becomes "extra".
 * - Extra money (extraPerMonth + overpayments) goes to the highest-interest loan first (avalanche).
 * - rollover=true also moves a cleared loan's full monthly payment onto the remaining loans
 *   (the usual advice). The private app's projection uses rollover=false, as it always has.
 */
export function simulateDebts(loans: DebtInput[], opts: { extraPerMonth?: number; maxMonths?: number; rollover?: boolean } = {}): DebtSimulation {
  const { extraPerMonth = 0, maxMonths = 120, rollover = false } = opts
  const state = loans.map((l) => ({ bal: Math.max(0, l.balance), pay: Math.max(0, l.payment), r: Math.max(0, l.annualRate) / 100 / 12 }))
  const clearedAt = state.map((l) => (l.bal <= 0 ? 0 : Infinity))
  const total = () => state.reduce((s, l) => s + l.bal, 0)
  const totals = [total()]
  let interest = 0
  let month = 0
  for (; month < maxMonths && total() > 0.5; month++) {
    let extra = extraPerMonth
    if (rollover) for (const l of state) if (l.bal <= 0) extra += l.pay
    const order = [...state].sort((a, b) => b.r - a.r)
    for (const l of state) {
      if (l.bal <= 0) continue
      const charged = l.bal * l.r
      interest += charged
      l.bal = l.bal + charged - l.pay
      if (l.bal < 0) {
        extra += -l.bal
        l.bal = 0
      }
    }
    for (const l of order) {
      if (extra <= 0) break
      if (l.bal <= 0) continue
      const use = Math.min(extra, l.bal)
      l.bal -= use
      extra -= use
    }
    state.forEach((l, i) => {
      if (l.bal <= 0.5 && !Number.isFinite(clearedAt[i])) clearedAt[i] = month + 1
    })
    totals.push(Math.max(0, total()))
  }
  const cleared = total() <= 0.5
  return { totals, months: cleared ? month : Infinity, interest, clearedAt }
}
