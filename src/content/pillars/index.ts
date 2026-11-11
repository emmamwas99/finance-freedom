import type { Article } from '@/content/types'
import * as budgeting from './budgeting'
import * as debtManagement from './debt-management'
import * as financialFreedom from './financial-freedom'
import * as personalFinance from './personal-finance'
import * as savingMoney from './saving-money'

export type PillarSlug = 'personal-finance' | 'budgeting' | 'debt-management' | 'saving-money' | 'financial-freedom'

export const PILLARS: Record<PillarSlug, Article> = {
  'personal-finance': { meta: personalFinance.meta, Body: personalFinance.default },
  budgeting: { meta: budgeting.meta, Body: budgeting.default },
  'debt-management': { meta: debtManagement.meta, Body: debtManagement.default },
  'saving-money': { meta: savingMoney.meta, Body: savingMoney.default },
  'financial-freedom': { meta: financialFreedom.meta, Body: financialFreedom.default },
}
