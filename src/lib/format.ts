import { format, parse } from 'date-fns'

export { compact, money, moneyCompact, parseAmount, pct } from './money'

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
