'use client'

import { ExternalLink, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { fmtDate, MethodCard, planLabel } from '@/features/billing/billing-ui'
import { CardTitleRow, Empty, PageHeader } from '@/components/app/shared'
import { StatusBadge } from '@/components/app/status'
import { isPro, isTrial, PRICES, PRO_FEATURES, type PayMethod, type Period } from '@/lib/plans'
import { getBackend, type PaymentRecord } from '@/lib/cloud'
import { money } from '@/lib/format'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/data'

export function BillingPage() {
  const { subscription, refreshSubscription, backendMode } = useStore()
  const [period, setPeriod] = useState<Period>('yearly')
  const [method, setMethod] = useState<PayMethod>('mpesa')
  const [busy, setBusy] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [payments, setPayments] = useState<PaymentRecord[] | null>(null)
  const handled = useRef(false)
  const router = useRouter()

  const pro = isPro(subscription)
  const trial = isTrial(subscription)
  const label = planLabel(subscription)
  const price = PRICES[period]
  const saving = PRICES.monthly.amount * 12 - PRICES.yearly.amount

  const loadPayments = () =>
    getBackend().listPayments()
      .then(setPayments)
      .catch(() => setPayments([]))

  useEffect(() => {
    void loadPayments()
  }, [])

  // Back from Paystack: /app/billing?reference=...  (Paystack also adds trxref)
  useEffect(() => {
    if (handled.current) return
    const q = new URLSearchParams(window.location.search)
    const ref = q.get('reference') || q.get('trxref')
    if (!ref) return
    handled.current = true
    // Returning from Paystack is an external event: start polling verification once.
    // oxlint-disable-next-line react/set-state-in-effect
    setVerifying(true)
    ;(async () => {
      let status = 'pending'
      for (let i = 0; i < 6 && status === 'pending'; i++) {
        try {
          const r = await getBackend().verifyPayment(ref)
          status = r.status
        } catch (e) {
          toast.error((e as Error).message)
          break
        }
        if (status === 'pending') await new Promise((r) => setTimeout(r, 2500))
      }
      await refreshSubscription()
      await loadPayments()
      setVerifying(false)
      router.replace('/app/billing')
      if (status === 'success') toast.success('Payment received. Pro is active! 🎉')
      else if (status === 'failed') toast.error('The payment did not go through. You have not been charged.')
      else toast('Payment is still processing. It will show here once Paystack confirms it.')
    })()
  }, [refreshSubscription, router])

  const checkout = async () => {
    setBusy(true)
    try {
      const { url } = await getBackend().startCheckout(period, method)
      if (url.startsWith('/')) router.push(url) // demo checkout stays inside the app
      else window.location.href = url // Paystack's hosted checkout
    } catch (e) {
      toast.error((e as Error).message)
      setBusy(false)
    }
  }

  const manage = async () => {
    try {
      window.open(await getBackend().manageLink(), '_blank', 'noopener')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const prepaid = subscription?.billing === 'prepaid' || !subscription?.billing
  const cta = pro && subscription?.billing !== 'card' && subscription?.status !== 'trialing'
    ? `Add ${period === 'yearly' ? 'a year' : 'a month'} (${money(price.amount)})`
    : method === 'mpesa'
      ? `Pay ${money(price.amount)} with M-Pesa`
      : `Pay ${money(price.amount)} by card`

  return (
    <div className="grid gap-8">
      <PageHeader title="Plan & billing" subtitle="Upgrade, renew or manage your subscription." />

      {verifying && (
        <div className="flex items-center gap-3 rounded-lg border bg-accent px-4 py-3 text-sm text-navy">
          <Loader2 className="size-4 animate-spin" /> Confirming your payment with Paystack…
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardContent className="grid gap-6">
            <CardTitleRow title={pro && !trial ? 'Renew or extend Pro' : 'Upgrade to Pro'} sub="Pay safely through Paystack with M-Pesa or a card." />

            <div className="inline-flex w-fit rounded-lg border p-1">
              {(['monthly', 'yearly'] as Period[]).map((p) => (
                <button key={p} onClick={() => setPeriod(p)} className={cn('rounded-md px-4 py-2 text-sm', period === p ? 'bg-navy text-white' : 'text-muted-foreground')}>
                  {p === 'monthly' ? `Monthly · ${money(PRICES.monthly.amount)}` : `Yearly · ${money(PRICES.yearly.amount)}`}
                </button>
              ))}
            </div>
            {period === 'yearly' && <p className="-mt-3 text-sm text-primary">You save {money(saving)} compared to paying monthly.</p>}

            <div className="grid gap-3 sm:grid-cols-2">
              <MethodCard
                method="mpesa"
                active={method === 'mpesa'}
                onClick={() => setMethod('mpesa')}
                title="M-Pesa"
                text={`Pay once for ${period === 'yearly' ? 'a year' : 'a month'}. We remind you before it ends.`}
              />
              <MethodCard method="card" active={method === 'card'} onClick={() => setMethod('card')} title="Card" text="Visa or Mastercard. Can renew automatically. Cancel any time." />
            </div>

            <Button size="lg" className="w-full sm:w-auto" disabled={busy} onClick={checkout}>
              {busy ? <Loader2 className="animate-spin" /> : cta}
            </Button>
            <p className="text-[13px] text-muted-foreground">
              You’ll be taken to Paystack’s secure page to pay. {trial ? 'Your remaining trial days are kept: paid time starts when the trial ends.' : prepaid && pro ? 'Time you pay for is added to the end of your current Pro period.' : ''}
              {backendMode === 'demo' && ' Demo mode: the payment is simulated, no money moves.'}
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardContent className="grid gap-3">
              <p className="text-sm text-muted-foreground">Current plan</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-semibold text-navy">{pro ? 'Pro' : 'Free'}</p>
                <StatusBadge status={!pro ? 'warn' : subscription?.status === 'past_due' ? 'bad' : 'good'} label={label.short} />
              </div>
              <p className="text-[15px]">{label.long}</p>
              {subscription?.hasManageLink && (
                <Button variant="outline" onClick={manage}>
                  Manage card subscription <ExternalLink />
                </Button>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="grid gap-2">
              <p className="text-sm font-medium text-navy">Pro includes</p>
              {PRO_FEATURES.map((f) => (
                <p key={f} className="text-sm text-muted-foreground">
                  ✓ {f}
                </p>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardContent className="grid gap-4">
          <CardTitleRow title="Payment history" />
          {payments === null ? (
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          ) : payments.filter((p) => p.status !== 'pending').length === 0 ? (
            <Empty title="No payments yet" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-[15px]">
                <thead className="text-[13px] text-muted-foreground">
                  <tr className="border-b">
                    <th className="px-2 py-2 text-left font-medium">Date</th>
                    <th className="px-2 py-2 text-left font-medium">Plan</th>
                    <th className="px-2 py-2 text-left font-medium">Method</th>
                    <th className="px-2 py-2 text-right font-medium">Amount</th>
                    <th className="px-2 py-2 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payments
                    .filter((p) => p.status !== 'pending')
                    .map((p) => (
                      <tr key={p.reference}>
                        <td className="px-2 py-2.5">{fmtDate(p.paidAt ?? p.createdAt)}</td>
                        <td className="px-2 py-2.5">Pro {p.period}</td>
                        <td className="px-2 py-2.5 capitalize">{p.method === 'mpesa' ? 'M-Pesa' : (p.method ?? '—')}</td>
                        <td className="px-2 py-2.5 text-right tabular-nums">{money(p.amount)}</td>
                        <td className={cn('px-2 py-2.5 text-right', p.status === 'success' ? 'text-primary' : 'text-red-600')}>{p.status === 'success' ? 'Paid' : 'Failed'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
