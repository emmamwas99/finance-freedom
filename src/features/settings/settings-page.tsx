'use client'

import { Download, FileSpreadsheet, KeyRound, Lock, LogOut, Pencil, Plus, ShieldCheck, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProInline } from '@/features/billing/billing-ui'
import { CategoryDialog } from '@/features/editors/editors'
import { IncomeSchedule } from '@/features/plan/month-editors'
import { AmountInput, Field, PageHeader } from '@/components/app/shared'
import { KIND_LABEL } from '@/lib/defaults'
import { WrongKeyError } from '@/lib/cloud/keys'
import { WrongPasswordError } from '@/lib/crypto'
import { money, parseAmount, todayISO } from '@/lib/format'
import { shareOrDownload } from '@/lib/storage'
import type { AppData, Settings } from '@/lib/types'
import { useStore } from '@/store/data'
import { useUI } from '@/store/ui'

export function SettingsPage() {
  const { data, update, lock, signOut, importBackup, exportBackup, deleteAccount, user, legacyOnDevice, importLegacy, regenerateRecoveryCode, sync, backendMode } = useStore()
  const { go } = useUI()
  const st = data.settings
  const set = (patch: Partial<Settings>) => update((d) => ({ ...d, settings: { ...d.settings, ...patch } }))
  const [salary, setSalary] = useState(String(st.expectedIncome || ''))
  const [pwOpen, setPwOpen] = useState(false)
  const [importText, setImportText] = useState<string | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [catDlg, setCatDlg] = useState<{ open: boolean; id?: string }>({ open: false })
  const [prompt, setPrompt] = useState<null | 'backup' | 'recovery' | 'legacy'>(null)
  const [newCode, setNewCode] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const csv = async () => {
    await shareOrDownload(`finfe-${todayISO()}.csv`, toCSV(data), 'text/csv')
  }

  const runPrompt = async (pw: string) => {
    if (prompt === 'backup') {
      const text = await exportBackup(pw)
      await shareOrDownload(`finfe-backup-${todayISO()}.json`, text, 'application/json')
      toast.success('Backup saved', { description: 'It is encrypted with the password you just entered.' })
    } else if (prompt === 'recovery') {
      setNewCode(await regenerateRecoveryCode(pw))
    } else if (prompt === 'legacy') {
      await importLegacy(pw)
      toast.success('Your older data has been added to your account')
    }
  }

  return (
    <div className="grid max-w-3xl gap-6">
      <PageHeader title="Settings" subtitle="Your profile, account, security and backups." />

      {legacyOnDevice && (
        <div className="flex flex-col gap-3 rounded-xl border border-sky-100 bg-accent p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] text-navy">
            <b>Data from before you had an account was found on this device.</b> Bring it into your account so it syncs everywhere.
          </p>
          <Button onClick={() => setPrompt('legacy')}>Import it</Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-navy">Profile & income</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field label="Your name">
            <Input defaultValue={st.name} onBlur={(e) => set({ name: e.target.value.trim() })} />
          </Field>
          <Field label="Usual monthly income (KSh)" hint="Used for any month without its own amount below.">
            <AmountInput value={salary} onChange={(e) => setSalary(e.target.value)} onBlur={() => set({ expectedIncome: parseAmount(salary) })} />
          </Field>
          <IncomeSchedule />
          <Field label="Warn me when a spending limit reaches">
            <Select value={String(st.warnAt)} onValueChange={(v) => set({ warnAt: Number(v) })}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0.6, 0.7, 0.75, 0.8, 0.9, 1].map((v) => (
                  <SelectItem key={v} value={String(v)}>
                    {Math.round(v * 100)}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base text-navy">
            Categories
            <Button size="sm" variant="outline" onClick={() => setCatDlg({ open: true })}>
              <Plus /> Add category
            </Button>
          </CardTitle>
          <CardDescription>Rename, change the type or limit, or remove categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y rounded-lg border">
            {data.categories
              .filter((c) => !c.archived)
              .map((c) => (
                <div key={c.id} className="flex items-center gap-3 px-3 py-2">
                  <span className="text-lg">{c.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px]">{c.name}</span>
                    <span className="text-[13px] text-muted-foreground">
                      {KIND_LABEL[c.kind]}
                      {c.budget > 0 && ` · limit ${money(c.budget)}`}
                    </span>
                  </span>
                  <Button variant="ghost" size="icon" aria-label={`Edit ${c.name}`} onClick={() => setCatDlg({ open: true, id: c.id })}>
                    <Pencil />
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-navy">
            <ShieldCheck className="size-4 text-primary" /> Account & security
          </CardTitle>
          <CardDescription>
            {backendMode === 'go'
              ? 'Your vault backup is encrypted on this device. Finance records are also stored in readable form on the server to power reports.'
              : 'Your data is encrypted on this device before it syncs. Only your password or recovery key can open it.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-1 rounded-lg bg-muted/60 px-4 py-3 text-[15px]">
            <span className="text-[13px] text-muted-foreground">Signed in as</span>
            <span className="font-medium text-navy">{user?.email}</span>
            <span className="text-[13px] text-muted-foreground">
              {backendMode === 'demo' ? 'Demo mode: data is kept in this browser only.' : sync.state === 'synced' ? 'All changes synced.' : sync.state === 'offline' ? 'Offline: changes will sync when you reconnect.' : 'Syncing…'}
            </span>
          </div>
          <Field label="Auto-lock after inactivity">
            <Select value={String(st.autoLockMinutes)} onValueChange={(v) => set({ autoLockMinutes: Number(v) })}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 5, 10, 15, 30].map((v) => (
                  <SelectItem key={v} value={String(v)}>
                    {v} minute{v > 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="outline" onClick={() => setPwOpen(true)}>
              <KeyRound /> Change password
            </Button>
            <Button variant="outline" onClick={() => setPrompt('recovery')}>
              <KeyRound /> New recovery key
            </Button>
            <Button variant="outline" onClick={() => void lock()}>
              <Lock /> Lock now
            </Button>
            <Button variant="outline" onClick={() => void signOut()}>
              <LogOut /> Log out
            </Button>
          </div>
          <Button variant="ghost" className="justify-start text-primary" onClick={() => go('billing')}>
            Plan & billing →
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-navy">Backup & export</CardTitle>
          <CardDescription>
            Your data is already backed up (encrypted) in your account. You can also keep your own copy.
            {st.lastBackupAt && <> Last file backup: <b>{new Date(st.lastBackupAt).toLocaleDateString()}</b>.</>}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <ProInline label="Backup files and spreadsheet export">
            <div className="grid gap-3 sm:grid-cols-2">
              <Button onClick={() => setPrompt('backup')}>
                <Download /> Save encrypted backup file
              </Button>
              <Button variant="outline" onClick={csv}>
                <FileSpreadsheet /> Export to spreadsheet (CSV)
              </Button>
            </div>
          </ProInline>
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload /> Import a backup file
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0]
              e.target.value = ''
              if (f) setImportText(await f.text())
            }}
          />
          <p className="text-[13px] text-muted-foreground">The CSV file is NOT encrypted. Anyone who gets it can read it.</p>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardContent className="grid gap-2">
          <p className="text-[15px] font-medium text-navy">Delete account</p>
          <p className="text-sm text-muted-foreground">Permanently deletes your account and all your data, and stops any card renewal.</p>
          <Button variant="destructive" className="w-fit" onClick={() => setDeleteOpen(true)}>
            <Trash2 /> Delete my account
          </Button>
        </CardContent>
      </Card>

      <ChangePasswordDialog open={pwOpen} onOpenChange={setPwOpen} />
      <CategoryDialog open={catDlg.open} id={catDlg.id} onOpenChange={(open) => setCatDlg((d) => ({ ...d, open }))} />
      <ImportDialog text={importText} onClose={() => setImportText(null)} importBackup={importBackup} />
      <PasswordPrompt
        open={prompt !== null}
        title={prompt === 'backup' ? 'Encrypt your backup file' : prompt === 'recovery' ? 'Create a new recovery key' : 'Import older data'}
        description={
          prompt === 'backup'
            ? 'Choose a password for this file. You’ll need it to restore the backup. Using your account password is fine.'
            : prompt === 'recovery'
              ? 'Enter your password. Your old recovery key will stop working.'
              : 'Enter the password you used for this app before you created an account.'
        }
        onClose={() => setPrompt(null)}
        onSubmit={runPrompt}
      />
      <Dialog open={!!newCode} onOpenChange={(o) => !o && setNewCode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-navy">Your new recovery key</DialogTitle>
            <DialogDescription>Save it somewhere safe. The old key no longer works.</DialogDescription>
          </DialogHeader>
          <p className="rounded-lg border-2 border-dashed border-primary/40 bg-accent p-4 text-center font-mono text-lg font-semibold tracking-wider break-all text-navy">{newCode}</p>
          <Button
            onClick={() => {
              void navigator.clipboard?.writeText(newCode ?? '')
              toast.success('Copied')
            }}
          >
            Copy
          </Button>
        </DialogContent>
      </Dialog>
      <DeleteAccountDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={deleteAccount} email={user?.email ?? ''} />
    </div>
  )
}

function PasswordPrompt({ open, title, description, onClose, onSubmit }: { open: boolean; title: string; description: string; onClose: () => void; onSubmit: (pw: string) => Promise<void> }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      await onSubmit(pw)
      setPw('')
      onClose()
    } catch (ex) {
      setErr(ex instanceof WrongPasswordError || ex instanceof WrongKeyError ? 'Wrong password.' : (ex as Error).message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-navy">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus placeholder="Password" />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button type="submit" disabled={busy || !pw}>
            {busy ? 'Working…' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DeleteAccountDialog({ open, onOpenChange, onConfirm, email }: { open: boolean; onOpenChange: (o: boolean) => void; onConfirm: () => Promise<void>; email: string }) {
  const [typed, setTyped] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-navy">Delete your account?</DialogTitle>
          <DialogDescription>This permanently deletes all your data and cannot be undone. Type your email to confirm.</DialogDescription>
        </DialogHeader>
        <Input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder={email} />
        <Button
          variant="destructive"
          disabled={busy || typed.trim().toLowerCase() !== email}
          onClick={async () => {
            setBusy(true)
            try {
              await onConfirm()
            } catch (e) {
              toast.error((e as Error).message)
              setBusy(false)
            }
          }}
        >
          Delete everything
        </Button>
      </DialogContent>
    </Dialog>
  )
}

function ChangePasswordDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { changePassword } = useStore()
  const [cur, setCur] = useState('')
  const [next, setNext] = useState('')
  const [next2, setNext2] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setErr('')
    if (next.length < 8) return setErr('Use at least 8 characters.')
    if (next !== next2) return setErr('New passwords do not match.')
    setBusy(true)
    try {
      await changePassword(cur, next)
      toast.success('Password changed', { description: 'Use the new password on all your devices. Your recovery key still works.' })
      onOpenChange(false)
      setCur('')
      setNext('')
      setNext2('')
    } catch (e) {
      setErr(e instanceof WrongPasswordError || e instanceof WrongKeyError ? 'Current password is wrong.' : (e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>You'll use the new password to log in on every device.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Field label="Current password">
            <Input type="password" value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" />
          </Field>
          <Field label="New password">
            <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" />
          </Field>
          <Field label="Confirm new password">
            <Input type="password" value={next2} onChange={(e) => setNext2(e.target.value)} autoComplete="new-password" />
          </Field>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button onClick={submit} disabled={busy || !cur}>
            Change password
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ImportDialog({ text, onClose, importBackup }: { text: string | null; onClose: () => void; importBackup: (t: string, p: string) => Promise<void> }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async () => {
    if (!text) return
    setBusy(true)
    setErr('')
    try {
      await importBackup(text, pw)
      toast.success('Backup imported')
      setPw('')
      onClose()
    } catch (e) {
      setErr(e instanceof WrongPasswordError ? 'Wrong password for this backup.' : (e as Error).message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <Dialog open={text !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore backup</DialogTitle>
          <DialogDescription>The records in the backup are added to your account (nothing is deleted). Enter the password the backup was made with.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Backup password" autoFocus />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button onClick={submit} disabled={busy || !pw}>
            Import backup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function toCSV(d: AppData) {
  const cat = new Map(d.categories.map((c) => [c.id, c.name]))
  const loan = new Map(d.loans.map((l) => [l.id, l.name]))
  const goal = new Map(d.goals.map((g) => [g.id, g.name]))
  const esc = (v: unknown) => {
    const s = String(v ?? '')
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const rows: unknown[][] = [['Date', 'Type', 'Amount (KSh)', 'Category / Source', 'Note', 'Loan', 'Goal']]
  for (const e of d.expenses) rows.push([e.date, 'Expense', -e.amount, cat.get(e.categoryId), e.note, loan.get(e.loanId ?? ''), goal.get(e.goalId ?? '')])
  for (const i of d.incomes) rows.push([i.date, i.isLoan ? 'Borrowed' : 'Income', i.amount, i.source, i.note, loan.get(i.loanId ?? ''), ''])
  const body = rows.slice(1).sort((a, b) => String(b[0]).localeCompare(String(a[0])))
  return [rows[0], ...body].map((r) => r.map(esc).join(',')).join('\n')
}
