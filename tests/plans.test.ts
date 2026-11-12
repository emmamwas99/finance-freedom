import { describe, expect, it } from 'vitest'
import { isPro, isTrial, proUntil, type Subscription } from '../src/lib/plans'

const now = Date.parse('2026-11-11T12:00:00Z')
const day = 864e5
const sub = (s: Partial<Subscription>): Subscription => ({ status: 'trialing', trialEndsAt: null, currentPeriodEnd: null, billing: null, period: null, hasManageLink: false, ...s })

describe('Pro access', () => {
  it('trial gives Pro until it ends', () => {
    const s = sub({ trialEndsAt: new Date(now + 3 * day).toISOString() })
    expect(isPro(s, now)).toBe(true)
    expect(isTrial(s, now)).toBe(true)
    expect(isPro(s, now + 4 * day)).toBe(false)
  })

  it('paid period gives Pro; not a trial any more', () => {
    const s = sub({ status: 'active', billing: 'prepaid', trialEndsAt: new Date(now - day).toISOString(), currentPeriodEnd: new Date(now + 20 * day).toISOString() })
    expect(isPro(s, now)).toBe(true)
    expect(isTrial(s, now)).toBe(false)
  })

  it('cancelled keeps Pro until the paid period ends', () => {
    const s = sub({ status: 'cancelled', billing: 'card', currentPeriodEnd: new Date(now + day).toISOString() })
    expect(isPro(s, now)).toBe(true)
    expect(isPro(s, now + 2 * day)).toBe(false)
  })

  it('failed card renewal gets a 3-day grace period', () => {
    const s = sub({ status: 'past_due', billing: 'card', currentPeriodEnd: new Date(now - day).toISOString() })
    expect(isPro(s, now)).toBe(true)
    expect(proUntil(s)!.getTime()).toBe(now + 2 * day)
    expect(isPro(s, now + 3 * day)).toBe(false)
  })

  it('no subscription means Free', () => {
    expect(isPro(null, now)).toBe(false)
  })
})
