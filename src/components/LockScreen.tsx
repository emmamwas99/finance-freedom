import { Eye, EyeOff, Loader2, Lock, ShieldCheck, Upload } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AmountInput, Field } from '@/components/shared'
import { cryptoAvailable, WrongPasswordError } from '@/lib/crypto'
import { parseAmount } from '@/lib/format'
import { clearAttempts, getAttempts, recordFailedAttempt } from '@/lib/storage'
import { useStore } from '@/store/data'

function PasswordInput(props: React.ComponentProps<typeof Input>) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input type={show ? 'text' : 'password'} className="h-11 pr-10" {...props} />
      <button
        type="button"
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

function Brand() {
  return (
    <div className="mb-6 flex flex-col items-center gap-2 text-center">
      <img src="/logo.svg" alt="" className="size-14 rounded-xl" />
      <h1 className="text-2xl font-semibold tracking-tight text-navy">Finance Freedom</h1>
      <p className="text-[15px] text-muted-foreground">Plan every shilling. Get debt-free.</p>
    </div>
  )
}

export function LockScreen() {
  const { status } = useStore()
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4 pt-safe pb-safe">
      <div className="w-full max-w-md">
        <Brand />
        {!cryptoAvailable() ? (
          <Alert variant="destructive">
            <AlertTitle>Secure connection needed</AlertTitle>
            <AlertDescription>
              Encryption only works over HTTPS (or on localhost). Open the app from its https:// address.
            </AlertDescription>
          </Alert>
        ) : status === 'new' ? (
          <Setup />
        ) : (
          <Unlock />
        )}
      </div>
    </div>
  )
}

function Unlock() {
  const { unlock, wipe } = useStore()
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [wait, setWait] = useState(0)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    const tick = () => setWait(Math.max(0, Math.ceil((getAttempts().until - Date.now()) / 1000)))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!pw || wait > 0) return
    setBusy(true)
    setErr('')
    try {
      await unlock(pw)
      clearAttempts()
    } catch (ex) {
      if (ex instanceof WrongPasswordError) {
        const a = recordFailedAttempt()
        setWait(Math.max(0, Math.ceil((a.until - Date.now()) / 1000)))
        setErr(a.count >= 5 ? `Wrong password. Too many attempts — wait before trying again.` : `Wrong password (${a.count}/5)`)
      } else setErr((ex as Error).message)
      setPw('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-navy">
          <Lock className="size-4" /> Locked
        </CardTitle>
        <CardDescription>Enter your password to open your finances.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-3">
          <PasswordInput autoFocus value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" autoComplete="current-password" />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button size="lg" type="submit" disabled={busy || !pw || wait > 0}>
            {busy ? <Loader2 className="animate-spin" /> : wait > 0 ? `Try again in ${wait}s` : 'Unlock'}
          </Button>
        </form>
        <div className="mt-6 text-center">
          {!confirmReset ? (
            <button className="text-[13px] text-muted-foreground underline" onClick={() => setConfirmReset(true)}>
              Forgot password?
            </button>
          ) : (
            <div className="grid gap-2 rounded-lg border border-destructive/40 p-3 text-left text-[13px]">
              <p>
                Your data is encrypted with your password, so <b>nobody can recover it</b> — not even the developer. You can erase this
                device and start again, then restore a backup file if you have one.
              </p>
              <div className="flex gap-2">
                <Button variant="destructive" size="sm" onClick={wipe}>
                  Erase & start over
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function Setup() {
  const { create } = useStore()
  const [mode, setMode] = useState<'setup' | 'restore'>('setup')
  const [name, setName] = useState('')
  const [salary, setSalary] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  if (mode === 'restore') return <Restore onBack={() => setMode('setup')} />

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (pw.length < 6) return setErr('Use at least 6 characters.')
    if (pw !== pw2) return setErr('Passwords do not match.')
    setBusy(true)
    try {
      await create(pw, { name: name.trim(), expectedIncome: parseAmount(salary) })
    } catch (ex) {
      setErr((ex as Error).message)
      setBusy(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-navy">Let's set you up</CardTitle>
        <CardDescription>This takes 30 seconds. Your data stays on this device, encrypted.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4">
          <Field label="Your name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your first name" />
          </Field>
          <Field label="Monthly salary (take-home, KSh)" hint="You can change this any time.">
            <AmountInput value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. 85,000" />
          </Field>
          <Field label="Create a password">
            <PasswordInput value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" />
          </Field>
          <Field label="Confirm password">
            <PasswordInput value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" />
          </Field>
          <Alert>
            <ShieldCheck />
            <AlertTitle>Only you can open this</AlertTitle>
            <AlertDescription>
              Everything is encrypted with this password. If you forget it, the data cannot be recovered — so remember it and make backups.
            </AlertDescription>
          </Alert>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button size="lg" type="submit" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : 'Start my journey'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setMode('restore')}>
            <Upload /> I have a backup file
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function Restore({ onBack }: { onBack: () => void }) {
  const { importBackup } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      await importBackup(text, pw)
    } catch (ex) {
      setErr(ex instanceof WrongPasswordError ? 'Wrong password for this backup.' : (ex as Error).message)
      setBusy(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-navy">Restore a backup</CardTitle>
        <CardDescription>Pick your backup file and enter the password it was made with.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4">
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0]
              if (!f) return
              setFileName(f.name)
              setText(await f.text())
            }}
          />
          <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload /> {fileName || 'Choose backup file'}
          </Button>
          <Field label="Backup password">
            <PasswordInput value={pw} onChange={(e) => setPw(e.target.value)} />
          </Field>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button size="lg" type="submit" disabled={busy || !text || !pw}>
            {busy ? <Loader2 className="animate-spin" /> : 'Restore'}
          </Button>
          <Button type="button" variant="ghost" onClick={onBack}>
            Back
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
