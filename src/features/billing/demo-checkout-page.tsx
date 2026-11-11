'use client'

import { Smartphone, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/data'
import { api } from '@/lib/api/client'
import { useEffect, useState } from 'react'
import { PRICES } from '@/lib/plans'
import { demoCheckout, demoMarkPaid } from '@/lib/cloud/demoBackend'
import { money } from '@/lib/format'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

/** Stand-in for the Paystack checkout page, used only in demo mode. */
export function DemoCheckoutPage() {
  const router = useRouter()
  const ref = useSearchParams().get('ref') ?? ''
  const { backendMode } = useStore()
  const [goCheckout, setGoCheckout] = useState<{ period: 'monthly' | 'yearly'; method: 'mpesa' | 'card' } | null>(null)
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_FINFE_API_URL
    if (backendMode !== 'go' || !base || !ref) return
    api<{ checkout: { period: 'monthly' | 'yearly'; method: 'mpesa' | 'card' } }>(base, `/billing/demo/${encodeURIComponent(ref)}`)
      .then((r) => setGoCheckout(r.checkout)).catch(() => setGoCheckout(null))
  }, [backendMode, ref])
  const c = backendMode === 'go' ? goCheckout : demoCheckout(ref)
  const back = async (paid: boolean) => {
    if (backendMode === 'go' && process.env.NEXT_PUBLIC_FINFE_API_URL) {
      await api(process.env.NEXT_PUBLIC_FINFE_API_URL, `/billing/demo/${encodeURIComponent(ref)}`, { method: 'POST', body: JSON.stringify({ paid }) })
    } else if (paid) demoMarkPaid(ref)
    router.replace(`/app/billing?reference=${encodeURIComponent(ref)}`)
  }
  if (!c)
    return (
      <div className="flex min-h-dvh items-center justify-center p-6 text-center">
        <p>Checkout not found. <Link href="/app/billing" className="text-primary underline">Back to billing</Link></p>
      </div>
    )
  const Icon = c.method === 'mpesa' ? Smartphone : CreditCard
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#e9edf2] p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <p className="rounded-md bg-amber-50 px-3 py-2 text-center text-[13px] text-amber-900">Demo checkout: no real money moves</p>
        <div className="mt-6 text-center">
          <Icon className="mx-auto size-8 text-navy" />
          <p className="mt-3 text-sm text-muted-foreground">Finfe Pro · {c.period}</p>
          <p className="text-3xl font-semibold text-navy">{money(PRICES[c.period].amount)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{c.method === 'mpesa' ? 'You would now get an M-Pesa prompt on your phone.' : 'You would now enter your card details.'}</p>
        </div>
        <div className="mt-6 grid gap-2">
          <Button size="lg" onClick={() => back(true)}>
            Simulate successful payment
          </Button>
          <Button variant="ghost" onClick={() => back(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
