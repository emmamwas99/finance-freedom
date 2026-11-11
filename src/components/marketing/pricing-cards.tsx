'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { money } from '@/lib/money'
import { FREE_FEATURES, PRICES, PRO_FEATURES, TRIAL_DAYS } from '@/lib/plans'
import { cn } from '@/lib/utils'

/** Free vs Pro cards with a monthly/yearly switch. Both prices are always in the HTML. */
export function PricingCards({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const [yearly, setYearly] = useState(true)
  const price = yearly ? PRICES.yearly : PRICES.monthly
  const saving = PRICES.monthly.amount * 12 - PRICES.yearly.amount
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <div>
      <div className="flex justify-center">
        <fieldset className="inline-flex rounded-lg border bg-card p-1">
          <legend className="sr-only">Billing period</legend>
          {[false, true].map((y) => (
            <label key={String(y)} className={cn('cursor-pointer rounded-md px-4 py-2 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring', yearly === y ? 'bg-navy text-white' : 'text-muted-foreground')}>
              <input type="radio" name="billing-period" className="sr-only" checked={yearly === y} onChange={() => setYearly(y)} />
              {y ? `Yearly (save ${money(saving)})` : 'Monthly'}
            </label>
          ))}
        </fieldset>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-8">
          <H className="text-lg font-semibold text-navy">Free</H>
          <p className="mt-2 text-4xl font-semibold text-navy">KSh 0</p>
          <p className="text-sm text-muted-foreground">forever</p>
          <ul className="mt-6 grid gap-3 text-[15px]">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex gap-2.5">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
              </li>
            ))}
          </ul>
          <Link href="/signup" prefetch={false} className="mt-8 flex h-11 w-full items-center justify-center rounded-lg border bg-background text-[15px] font-medium text-navy hover:bg-muted">
            Create free account
          </Link>
        </div>
        <div className="relative rounded-2xl border-2 border-primary bg-card p-8 shadow-lg shadow-primary/10">
          <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-0.5 text-[13px] font-medium text-white">{TRIAL_DAYS}-day free trial</span>
          <H className="text-lg font-semibold text-navy">Pro</H>
          <p className="mt-2 text-4xl font-semibold text-navy">{money(price.amount)}</p>
          <p className="text-sm text-muted-foreground">
            per {price.per}
            {yearly ? ` · about ${money(Math.round(PRICES.yearly.amount / 12))} a month` : ` · or ${money(PRICES.yearly.amount)} a year`}
          </p>
          <ul className="mt-6 grid gap-3 text-[15px]">
            <li className="flex gap-2.5 font-medium">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" /> Everything in Free, plus:
            </li>
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex gap-2.5">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
              </li>
            ))}
          </ul>
          <Link href="/signup" prefetch={false} className="mt-8 flex h-11 w-full items-center justify-center rounded-lg bg-primary text-[15px] font-medium text-white hover:bg-primary/90">
            Start {TRIAL_DAYS}-day free trial
          </Link>
          <p className="mt-3 text-center text-[13px] text-muted-foreground">
            {yearly ? `Or ${money(PRICES.monthly.amount)} a month.` : `Or ${money(PRICES.yearly.amount)} a year.`} Pay with M-Pesa or card. No card needed for the trial.
          </p>
        </div>
      </div>
    </div>
  )
}
