/** Money and number formatting with no date dependencies, safe to import in small client islands. */

const whole = new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 })
const compactNf = new Intl.NumberFormat('en-KE', { notation: 'compact', maximumFractionDigits: 1 })

/** KSh 85,000 */
export function money(n: number) {
  const v = Math.round(n)
  return `${v < 0 ? '−' : ''}KSh ${whole.format(Math.abs(v))}`
}

/** KSh 85K */
export function moneyCompact(n: number) {
  return `${n < 0 ? '−' : ''}KSh ${compactNf.format(Math.abs(n))}`
}

export function compact(n: number) {
  return compactNf.format(n)
}

/** Parse user input like "1,500" or "1500.50" */
export function parseAmount(s: string): number {
  const n = Number(String(s).replace(/[,\s]/g, ''))
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : 0
}

export function pct(n: number) {
  return `${Math.round(n * 100)}%`
}
