'use client'

import { Check, Copy, Download, Eye, EyeOff, KeyRound, Loader2, Lock, MailCheck, Printer, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, type FormEvent, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { AmountInput, Field } from '@/components/app/shared'
import { BRAND } from '@/config/site'
import { cryptoAvailable } from '@/lib/crypto'
import { WrongKeyError } from '@/lib/cloud/keys'
import { parseAmount, todayISO } from '@/lib/format'
import { shareOrDownload } from '@/lib/storage'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/data'

// ---------------------------------------------------------------------
// Layout pieces
// ---------------------------------------------------------------------

export function AuthLayout({ title, sub, children, footer }: { title: string; sub?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  const { backendMode } = useStore()
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-navy">
          <Image src="/logo.svg" alt="" width={28} height={28} className="size-7 rounded-md" />
          {BRAND.name}
        </Link>
      </header>
      <main id="main" className="flex flex-1 items-start justify-center px-4 pt-6 pb-16 sm:pt-12">
        <div className="w-full max-w-md">
          {backendMode === 'demo' && <DemoBanner />}
          <div className="rounded-2xl border bg-card p-6 shadow-[0_1px_3px_rgba(10,60,110,0.06)] sm:p-8">
            <h1 className="text-[22px] font-semibold tracking-tight text-navy sm:text-2xl">{title}</h1>
            {sub && <p className="mt-1.5 text-[15px] text-muted-foreground">{sub}</p>}
            {!cryptoAvailable() ? (
              <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">Encryption needs a secure connection. Open this site using its https:// address.</p>
            ) : (
              <div className="mt-6">{children}</div>
            )}
          </div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </main>
    </div>
  )
}

export function DemoBanner({ className }: { className?: string }) {
  return (
    <p className={cn('mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] text-amber-900', className)}>
      <b>Demo mode.</b> Not connected to a server: accounts and payments are simulated in this browser only.
    </p>
  )
}

function PasswordInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input type={show ? 'text' : 'password'} className={cn('h-11 pr-10', className)} {...props} />
      <button
        type="button"
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

function strength(pw: string) {
  let s = 0
  if (pw.length >= 8) s++
  if (pw.length >= 12) s++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return Math.min(4, s)
}

function StrengthMeter({ pw }: { pw: string }) {
  if (!pw) return null
  const s = strength(pw)
  const label = ['Too weak', 'Weak', 'Okay', 'Strong', 'Very strong'][s]
  return (
    <div className="mt-2 grid gap-1">
      <div className="grid grid-cols-4 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={cn('h-1 rounded-full', i < s ? (s <= 1 ? 'bg-red-500' : s === 2 ? 'bg-amber-500' : 'bg-primary') : 'bg-muted')} />
        ))}
      </div>
      <span className="text-[12px] text-muted-foreground">{label}</span>
    </div>
  )
}

function Submit({ busy, children, disabled }: { busy: boolean; children: ReactNode; disabled?: boolean }) {
  return (
    <Button type="submit" size="lg" className="w-full" disabled={busy || disabled}>
      {busy ? <Loader2 className="animate-spin" /> : children}
    </Button>
  )
}

function ErrorText({ children }: { children: ReactNode }) {
  return children ? <p className="text-sm text-destructive">{children}</p> : null
}

// ---------------------------------------------------------------------
// Sign up
// ---------------------------------------------------------------------

export function SignupPage() {
  const { signUp } = useStore()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [salary, setSalary] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [agree, setAgree] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [sent, setSent] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setErr('')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Enter a valid email address.')
    if (pw.length < 8) return setErr('Use at least 8 characters for your password.')
    if (pw !== pw2) return setErr('The passwords do not match.')
    if (!agree) return setErr('Please accept the terms to continue.')
    setBusy(true)
    try {
      const r = await signUp(email, pw, { name: name.trim(), expectedIncome: parseAmount(salary) })
      if (r === 'confirm-email') setSent(true)
    } catch (ex) {
      setErr((ex as Error).message)
    } finally {
      setBusy(false)
    }
  }

  if (sent)
    return (
      <AuthLayout title="Check your email" sub={<>We sent a confirmation link to <b>{email}</b>.</>}>
        <div className="grid gap-4 text-[15px]">
          <MailCheck className="size-10 text-primary" />
          <p>Click the link in the email, then log in with your password to finish setting up.</p>
          <Button variant="outline" onClick={() => router.push('/login')}>
            Go to log in
          </Button>
        </div>
      </AuthLayout>
    )

  return (
    <AuthLayout
      title="Create your account"
      sub="Free to start, with a 14-day Pro trial. No card needed."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name">
            <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" className="h-11" />
          </Field>
          <Field label="Monthly salary (KSh)">
            <AmountInput value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Optional" className="h-11" />
          </Field>
        </div>
        <Field label="Email">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="h-11" />
        </Field>
        <Field label="Password">
          <PasswordInput value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" />
          <StrengthMeter pw={pw} />
        </Field>
        <Field label="Confirm password">
          <PasswordInput value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" />
        </Field>
        <div className="flex gap-3 rounded-lg bg-accent p-3 text-[13px] text-navy">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          <span>
            Your vault backup is encrypted with this password before upload. In Go mode, readable finance records are also stored for server reports. Next you’ll get a recovery key in case you forget the password.
          </span>
        </div>
        <label className="flex items-start gap-2.5 text-sm">
          <Checkbox checked={agree} onCheckedChange={(c) => setAgree(c === true)} className="mt-0.5" />
          <span>
            I agree to the{' '}
            <Link href="/terms" target="_blank" className="text-primary underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" target="_blank" className="text-primary underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        <ErrorText>{err}</ErrorText>
        <Submit busy={busy}>Create account</Submit>
      </form>
    </AuthLayout>
  )
}

// ---------------------------------------------------------------------
// Log in
// ---------------------------------------------------------------------

export function LoginPage() {
  const { signIn } = useStore()
  const router = useRouter()
  const confirmed = useSearchParams().has('confirmed')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      await signIn(email, pw)
      router.replace('/app')
    } catch (ex) {
      setErr((ex as Error).message)
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      title={confirmed ? 'Email confirmed 🎉' : 'Welcome back'}
      sub={confirmed ? 'Log in to finish setting up your account.' : 'Log in to see your money.'}
      footer={
        <>
          New here?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Create a free account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="grid gap-4">
        <Field label="Email">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus className="h-11" />
        </Field>
        <Field label="Password">
          <PasswordInput value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
        </Field>
        <div className="-mt-1 text-right">
          <Link href="/forgot" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <ErrorText>{err}</ErrorText>
        <Submit busy={busy}>Log in</Submit>
      </form>
    </AuthLayout>
  )
}

// ---------------------------------------------------------------------
// Forgot / reset
// ---------------------------------------------------------------------

export function ForgotPage() {
  const { sendPasswordReset, backendMode } = useStore()
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      await sendPasswordReset(email)
      setSent(true)
    } catch (ex) {
      setErr((ex as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      sub="You’ll need the recovery key you saved when you created your account."
      footer={
        <Link href="/login" className="text-primary hover:underline">
          Back to log in
        </Link>
      }
    >
      {sent ? (
        <div className="grid gap-4 text-[15px]">
          <MailCheck className="size-10 text-primary" />
          <p>If an account exists for <b>{email}</b>, we’ve sent a link to reset the password.</p>
          {backendMode === 'demo' && (
            <Button onClick={() => (window.location.href = '/reset')}>Open the reset link (demo)</Button>
          )}
        </div>
      ) : (
        <form onSubmit={submit} className="grid gap-4">
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus className="h-11" />
          </Field>
          <ErrorText>{err}</ErrorText>
          <Submit busy={busy}>Send reset link</Submit>
        </form>
      )}
    </AuthLayout>
  )
}

export function ResetScreen() {
  const { resetWithRecovery, resetFresh, user } = useStore()
  const [code, setCode] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [lost, setLost] = useState(false)
  const [confirmLost, setConfirmLost] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setErr('')
    if (pw.length < 8) return setErr('Use at least 8 characters.')
    if (pw !== pw2) return setErr('The passwords do not match.')
    setBusy(true)
    try {
      if (lost) await resetFresh(pw)
      else await resetWithRecovery(code, pw)
      toast.success('Password changed')
    } catch (ex) {
      setErr(ex instanceof WrongKeyError ? ex.message : (ex as Error).message)
      setBusy(false)
    }
  }

  return (
    <AuthLayout title="Choose a new password" sub={user ? <>For <b>{user.email}</b></> : undefined}>
      <form onSubmit={submit} className="grid gap-4">
        {!lost ? (
          <Field label="Recovery key" hint="The code you saved when you signed up, e.g. K7QM-2XDA-…">
            <Input value={code} onChange={(e) => setCode(e.target.value)} className="h-11 font-mono tracking-wider uppercase" autoFocus />
          </Field>
        ) : (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-red-800">
            Without the recovery key your old data can’t be decrypted, by anyone. Your account will start empty with the new password.
            <label className="mt-2 flex items-center gap-2">
              <Checkbox checked={confirmLost} onCheckedChange={(c) => setConfirmLost(c === true)} /> I understand my old data will be erased
            </label>
          </div>
        )}
        <Field label="New password">
          <PasswordInput value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" />
          <StrengthMeter pw={pw} />
        </Field>
        <Field label="Confirm new password">
          <PasswordInput value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" />
        </Field>
        <ErrorText>{err}</ErrorText>
        <Submit busy={busy} disabled={lost ? !confirmLost : !code}>
          {lost ? 'Start fresh with this password' : 'Reset password'}
        </Submit>
        <button type="button" className="text-sm text-muted-foreground underline" onClick={() => setLost((l) => !l)}>
          {lost ? 'I have my recovery key' : 'I lost my recovery key'}
        </button>
      </form>
    </AuthLayout>
  )
}

// ---------------------------------------------------------------------
// Unlock (signed in, data locked) and first-time setup
// ---------------------------------------------------------------------

export function UnlockScreen() {
  const { unlock, user, signOut } = useStore()
  const router = useRouter()
  const [pw, setPw] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      await unlock(pw)
      if (!window.location.pathname.startsWith('/app')) router.replace('/app')
    } catch (ex) {
      setErr(ex instanceof WrongKeyError ? 'Wrong password.' : (ex as Error).message)
      setPw('')
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      title="Unlock"
      sub={<>Signed in as <b>{user?.email}</b></>}
      footer={
        <button className="text-primary hover:underline" onClick={() => void signOut()}>
          Not you? Log out
        </button>
      }
    >
      <form onSubmit={submit} className="grid gap-4">
        <Field label="Password">
          <PasswordInput value={pw} onChange={(e) => setPw(e.target.value)} autoFocus autoComplete="current-password" />
        </Field>
        <ErrorText>{err}</ErrorText>
        <Submit busy={busy} disabled={!pw}>
          <Lock /> Unlock
        </Submit>
        <Link href="/forgot" className="text-center text-sm text-muted-foreground hover:underline">
          Forgot password?
        </Link>
      </form>
    </AuthLayout>
  )
}

export function SetupScreen() {
  const { finishSetup, user } = useStore()
  const [pw, setPw] = useState('')
  const [name, setName] = useState('')
  const [salary, setSalary] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const hasPending = !!localStorage.getItem('ff.pendingProfile')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      await finishSetup(pw, hasPending ? undefined : { name: name.trim(), expectedIncome: parseAmount(salary) })
    } catch (ex) {
      setErr((ex as Error).message)
      setBusy(false)
    }
  }

  return (
    <AuthLayout title="Finish setting up" sub={<>Enter your password to create your encrypted space for <b>{user?.email}</b>.</>}>
      <form onSubmit={submit} className="grid gap-4">
        {!hasPending && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name">
              <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
            </Field>
            <Field label="Monthly salary (KSh)">
              <AmountInput value={salary} onChange={(e) => setSalary(e.target.value)} className="h-11" />
            </Field>
          </div>
        )}
        <Field label="Password">
          <PasswordInput value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
        </Field>
        <ErrorText>{err}</ErrorText>
        <Submit busy={busy} disabled={!pw}>
          Continue
        </Submit>
      </form>
    </AuthLayout>
  )
}

// ---------------------------------------------------------------------
// Recovery key (shown once)
// ---------------------------------------------------------------------

export function RecoveryKeyScreen() {
  const { recoveryCode, acknowledgeRecovery, user } = useStore()
  const [saved, setSaved] = useState(false)
  const code = recoveryCode ?? ''
  const text = `${BRAND.name} recovery key\nAccount: ${user?.email}\nCreated: ${todayISO()}\n\n${code}\n\nKeep this somewhere safe. You need it to reset your password. Anyone with this key AND access to your email could open your data.`

  return (
    <AuthLayout title="Save your recovery key" sub="This is the only way back in if you forget your password. We can’t reset it for you, because we can’t read your data.">
      <div className="grid gap-5">
        <div className="rounded-xl border-2 border-dashed border-primary/40 bg-accent p-5 text-center">
          <KeyRound className="mx-auto mb-2 size-6 text-primary" />
          <p className="font-mono text-lg font-semibold tracking-wider break-all text-navy sm:text-xl" data-testid="recovery-code">
            {code}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            onClick={() => {
              void navigator.clipboard?.writeText(code)
              toast.success('Copied')
            }}
          >
            <Copy /> Copy
          </Button>
          <Button variant="outline" onClick={() => void shareOrDownload('finfe-recovery-key.txt', text, 'text/plain')}>
            <Download /> Save
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const w = window.open('', '_blank', 'width=600,height=400')
              if (!w) return
              w.document.write(`<pre style="font:16px/1.6 monospace;padding:32px">${text.replace(/</g, '&lt;')}</pre>`)
              w.print()
            }}
          >
            <Printer /> Print
          </Button>
        </div>
        <label className="flex items-start gap-2.5 text-sm">
          <Checkbox checked={saved} onCheckedChange={(c) => setSaved(c === true)} className="mt-0.5" />
          I’ve saved my recovery key somewhere safe (not only on this device).
        </label>
        <Button size="lg" disabled={!saved} onClick={acknowledgeRecovery}>
          <Check /> Continue to my dashboard
        </Button>
      </div>
    </AuthLayout>
  )
}

export function Splash() {
  return (
    <main id="main" role="status" aria-live="polite" className="flex min-h-dvh items-center justify-center bg-background">
      <Loader2 aria-hidden className="size-6 animate-spin text-primary" />
      <span className="sr-only">Loading…</span>
    </main>
  )
}
