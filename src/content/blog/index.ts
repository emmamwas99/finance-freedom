import type { Article } from '@/content/types'
import * as a from './why-you-run-out-of-money-before-payday'
import * as b from './true-cost-of-mobile-loans'
import * as c from './sinking-funds-for-school-fees'
import * as d from './pay-yourself-first'

export const POSTS: Article[] = [a, b, c, d].map((m) => ({ meta: m.meta, Body: m.default }))
