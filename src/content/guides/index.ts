import type { Article } from '@/content/types'
import * as monthlyBudget from './how-to-make-a-monthly-budget'
import * as trackExpenses from './how-to-track-expenses'
import * as emergencyFund from './how-to-build-an-emergency-fund'
import * as outOfDebt from './how-to-get-out-of-debt'
import * as avalancheSnowball from './debt-avalanche-vs-snowball'
import * as fiftyThirtyTwenty from './50-30-20-rule'
import * as needsVsWants from './needs-vs-wants'

export const GUIDES: Article[] = [monthlyBudget, trackExpenses, needsVsWants, emergencyFund, outOfDebt, avalancheSnowball, fiftyThirtyTwenty].map((m) => ({
  meta: m.meta,
  Body: m.default,
}))
