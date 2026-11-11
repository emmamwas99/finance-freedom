import { format, parse } from 'date-fns'

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

export const todayISO = () => format(new Date(), 'yyyy-MM-dd')
export const currentMonth = () => format(new Date(), 'yyyy-MM')
export const monthOf = (date: string) => date.slice(0, 7)

export function keyToDate(key: string) {
  return parse(key, 'yyyy-MM', new Date())
}

export function shiftMonth(key: string, delta: number) {
  const [y, m] = key.split('-').map(Number)
  return format(new Date(y, m - 1 + delta, 1), 'yyyy-MM')
}

export function monthLabel(key: string, style: 'long' | 'short' | 'tiny' = 'long') {
  const d = keyToDate(key)
  return format(d, style === 'long' ? 'MMMM yyyy' : style === 'short' ? 'MMM yyyy' : 'MMM')
}

export function dayLabel(date: string) {
  const d = parse(date, 'yyyy-MM-dd', new Date())
  return format(d, 'EEE, d MMM')
}

export function pct(n: number) {
  return `${Math.round(n * 100)}%`
}
