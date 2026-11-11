import { Download, FileSpreadsheet, KeyRound, Lock, Pencil, Plus, ShieldCheck, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CategoryDialog } from '@/components/Editors'
import { IncomeSchedule } from '@/components/MonthEditors'
import { AmountInput, Field, PageHeader } from '@/components/shared'
import { KIND_LABEL } from '@/lib/defaults'
import { WrongPasswordError } from '@/lib/crypto'
import { money, parseAmount, todayISO } from '@/lib/format'
import { shareOrDownload } from '@/lib/storage'
import type { AppData, Settings } from '@/lib/types'
import { useStore } from '@/store/data'

export function SettingsPage() {
  const { data, update, lock, backupContents, importBackup, wipe } = useStore()
  const st = data.settings
  const set = (patch: Partial<Settings>) => update((d) => ({ ...d, settings: { ...d.settings, ...patch } }))
  const [salary, setSalary] = useState(String(st.expectedIncome || ''))
  const [pwOpen, setPwOpen] = useState(false)
  const [importText, setImportText] = useState<string | null>(null)
  const [wipeOpen, setWipeOpen] = useState(false)
  const [catDlg, setCatDlg] = useState<{ open: boolean; id?: string }>({ open: false })
  const fileRef = useRef<HTMLInputElement>(null)

  const backup = async () => {
    const text = await backupContents()
    await shareOrDownload(`finance-freedom-backup-${todayISO()}.json`, text, 'application/json')
    toast.success('Backup created', { description: 'It is encrypted with your password. Keep it somewhere safe (Google Drive, email to yourself).' })
  }

  const csv = async () => {
    await shareOrDownload(`finance-freedom-${todayISO()}.csv`, toCSV(data), 'text/csv')
  }

  return (
    <div className="grid max-w-3xl gap-6">
      <PageHeader title="Settings" subtitle="Your profile, security and backups." />

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
            <ShieldCheck className="size-4 text-primary" /> Security
          </CardTitle>
          <CardDescription>Your data is encrypted (AES-256) with your password and never leaves this device unless you export it.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
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
          <Button variant="outline" onClick={() => setPwOpen(true)}>
            <KeyRound /> Change password
          </Button>
          <Button variant="outline" onClick={() => void lock()}>
            <Lock /> Lock now
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-navy">Backup & export</CardTitle>
          <CardDescription>
            Your records live in an encrypted file on this phone. Make a backup regularly so you never lose them if the phone is lost.
            {st.lastBackupAt && <> Last backup: <b>{new Date(st.lastBackupAt).toLocaleDateString()}</b>.</>}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Button onClick={backup}>
            <Download /> Save encrypted backup file
          </Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload /> Restore from backup file
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
          <Button variant="outline" onClick={csv}>
            <FileSpreadsheet /> Export to spreadsheet (CSV)
          </Button>
          <p className="text-[13px] text-muted-foreground sm:col-span-2">The CSV file is NOT encrypted — anyone who gets it can read it.</p>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardContent>
          <Button variant="destructive" className="w-full" onClick={() => setWipeOpen(true)}>
            <Trash2 /> Erase all data on this device
          </Button>
        </CardContent>
      </Card>

      <p className="pb-4 text-center text-xs text-muted-foreground">Finance Freedom · works offline · your data, your device</p>

      <ChangePasswordDialog open={pwOpen} onOpenChange={setPwOpen} />
      <CategoryDialog open={catDlg.open} id={catDlg.id} onOpenChange={(open) => setCatDlg((d) => ({ ...d, open }))} />
      <ImportDialog text={importText} onClose={() => setImportText(null)} importBackup={importBackup} />
      <Dialog open={wipeOpen} onOpenChange={setWipeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Erase everything?</DialogTitle>
            <DialogDescription>All expenses, loans, goals and budgets on this device will be deleted forever. Make a backup first if you might need it.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setWipeOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="flex-1" onClick={wipe}>
              Erase
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
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
    if (next.length < 6) return setErr('Use at least 6 characters.')
    if (next !== next2) return setErr('New passwords do not match.')
    setBusy(true)
    try {
      await changePassword(cur, next)
      toast.success('Password changed', { description: 'Make a new backup — old backups still use the old password.' })
      onOpenChange(false)
      setCur('')
      setNext('')
      setNext2('')
    } catch (e) {
      setErr(e instanceof WrongPasswordError ? 'Current password is wrong.' : (e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>Your data will be re-encrypted with the new password.</DialogDescription>
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
      toast.success('Backup restored')
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
          <DialogDescription>This REPLACES all current data on this device with the backup. Enter the password the backup was made with.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Backup password" autoFocus />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button variant="destructive" onClick={submit} disabled={busy || !pw}>
            Replace my data with this backup
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
