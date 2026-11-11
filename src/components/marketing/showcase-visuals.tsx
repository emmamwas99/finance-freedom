/**
 * Original illustrations for the feature showcases, drawn with HTML and SVG in Finfe's palette.
 * All numbers are illustrative sample data, never a real user's.
 */
import {
  AlertTriangle,
  BellRing,
  ArrowDownWideNarrow,
  Calculator,
  CalendarCheck,
  CheckCircle2,
  Compass,
  Database,
  HeartPulse,
  ListChecks,
  Lock,
  Mountain,
  PiggyBank,
  Plus,
  Server,
  Smartphone,
  Tags,
  Timer,
  TrendingUp,
  Umbrella,
  Wallet,
  Zap,
} from 'lucide-react'
import { Chip, Connector, Stage } from './showcase'

const centre = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'

/** Monthly plan: salary in, payments out, what's left. */
export function PlanVisual() {
  return (
    <Stage brand label="Illustration: a salary comes in, planned payments go out, and KSh 31,000 is left after payments, about KSh 1,550 a day">
      <Connector className="top-[47%] right-[18%] left-[18%]" />
      <Chip icon={Wallet} className="top-[47%] left-[3%] -translate-y-1/2">
        Salary in
      </Chip>
      <Chip icon={CalendarCheck} className="top-[47%] right-[3%] -translate-y-1/2">
        Payments out
      </Chip>
      <div className="absolute top-[47%] left-1/2 w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-navy p-3 text-white shadow-[0_12px_30px_rgba(10,60,110,0.25)] sm:w-[42%] sm:p-4">
        <p className="text-[10px] text-white/80 sm:text-[12px]">Left after payments</p>
        <p className="text-[17px] font-semibold tabular-nums sm:text-[26px]">KSh 31,000</p>
        <div className="mt-2 h-1.5 rounded-full bg-white/20">
          <div className="h-full w-2/3 rounded-full bg-[#5bb3e6]" />
        </div>
        <p className="mt-1.5 text-[9px] text-white/80 sm:text-[11px]">4 of 6 payments made</p>
      </div>
      <div className="absolute top-[72%] left-1/2 flex -translate-x-1/2 gap-1 sm:gap-2">
        {['🏠', '🎓', '🚌', '💡', '🧹', '💳'].map((e) => (
          <span key={e} className="flex size-7 items-center justify-center rounded-full border border-border/80 bg-white text-[13px] shadow-sm sm:size-9 sm:text-[16px]">
            {e}
          </span>
        ))}
      </div>
      <Chip icon={Zap} className="bottom-[4%] left-1/2 -translate-x-1/2">
        ≈ KSh 1,550 a day
      </Chip>
    </Stage>
  )
}

/** Expense tracking: quick entries, needs vs wants, a limit warning. */
export function TrackVisual() {
  const rows: [string, string, string][] = [
    ['🍲', 'Naivas', '2,340'],
    ['🚌', 'Matatu', '100'],
    ['🎉', 'Team lunch', '850'],
  ]
  return (
    <Stage label="Illustration: three expenses recorded today, sorted into needs and wants, with a warning that eating out is at 84% of its limit">
      <Chip icon={Zap} className="top-[6%] left-1/2 -translate-x-1/2">
        Recorded in seconds
      </Chip>
      <Connector className="top-[44%] right-[20%] left-[20%]" />
      <Chip icon={Tags} className="top-[44%] left-[3%] -translate-y-1/2">
        Needs 62%
      </Chip>
      <Chip icon={Tags} className="top-[44%] right-[3%] -translate-y-1/2">
        Wants 30%
      </Chip>
      <div className={`${centre} w-[40%] rounded-[18px] border border-border/80 bg-white p-2 shadow-[0_12px_30px_rgba(10,60,110,0.18)] sm:w-[38%] sm:p-3`} style={{ top: '46%' }}>
        <p className="px-1 text-[10px] font-semibold text-navy sm:text-[12px]">Today</p>
        <ul className="mt-1 divide-y divide-border/70">
          {rows.map(([e, n, a]) => (
            <li key={n} className="flex items-center gap-1.5 px-1 py-1.5 sm:gap-2 sm:py-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-muted text-[10px] sm:size-7 sm:text-[13px]">{e}</span>
              <span className="min-w-0 flex-1 truncate text-[10px] text-foreground sm:text-[12px]">{n}</span>
              <span className="text-[10px] font-medium text-navy tabular-nums sm:text-[12px]">−{a}</span>
            </li>
          ))}
        </ul>
      </div>
      <Chip icon={AlertTriangle} tone="warn" className="bottom-[6%] left-1/2 -translate-x-1/2">
        Eating out: 84% of limit
      </Chip>
    </Stage>
  )
}

/** Debt: a falling balance, a debt-free date, and the effect of paying extra. */
export function DebtVisual() {
  return (
    <Stage label="Illustration: total debt falling to zero by August 2028; paying KSh 2,000 extra a month, highest interest first, finishes 11 months sooner">
      <Chip icon={ArrowDownWideNarrow} className="top-[6%] left-1/2 -translate-x-1/2">
        Highest interest first
      </Chip>
      <Connector className="top-[46%] right-[20%] left-[20%]" />
      <Chip icon={Plus} className="top-[46%] left-[3%] -translate-y-1/2">
        Pay extra KSh 2,000
      </Chip>
      <Chip icon={Timer} className="top-[46%] right-[3%] -translate-y-1/2">
        11 months sooner
      </Chip>
      <div className="absolute top-[47%] left-1/2 w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border/80 bg-white p-2.5 shadow-[0_12px_30px_rgba(10,60,110,0.18)] sm:w-[40%] sm:p-3.5">
        <p className="text-[10px] text-muted-foreground sm:text-[12px]">Total debt</p>
        <svg viewBox="0 0 120 50" className="mt-1 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="debt-fall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1470a8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1470a8" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d="M0 6 C 30 10, 55 22, 80 34 S 110 47, 120 48 L120 50 L0 50 Z" fill="url(#debt-fall)" />
          <path d="M0 6 C 30 10, 55 22, 80 34 S 110 47, 120 48" fill="none" stroke="#1470a8" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="119" cy="48" r="3" fill="#0a3c6e" />
        </svg>
        <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-navy sm:text-[13px]">
          <Mountain className="size-3 text-primary sm:size-3.5" /> Debt-free · Aug 2028
        </p>
      </div>
      <div className="absolute bottom-[6%] left-1/2 flex -translate-x-1/2 gap-1.5 sm:gap-2">
        {[
          ['Bank', '16%'],
          ['SACCO', '12%'],
          ['App loan', '60%'],
        ].map(([n, r]) => (
          <span key={n} className="flex items-center gap-1 rounded-full border border-border/80 bg-white px-2 py-0.5 text-[10px] whitespace-nowrap text-navy shadow-sm sm:px-2.5 sm:py-1 sm:text-[12px]">
            {n} <span className="text-muted-foreground">{r}</span>
          </span>
        ))}
      </div>
    </Stage>
  )
}

/** Progress: a score ring and habit checks. */
export function ProgressVisual() {
  const score = 82
  const c = 2 * Math.PI * 42
  return (
    <Stage label="Illustration: a money score of 82 out of 100, with habits checked: living within income, no new loans, debt going down, and wants at 34% needing attention">
      <Chip icon={Compass} className="top-[5%] left-1/2 -translate-x-1/2">
        Am I on track?
      </Chip>
      <Chip icon={CheckCircle2} className="top-[32%] left-[3%]">
        Within income
      </Chip>
      <Chip icon={CheckCircle2} className="top-[58%] left-[3%]">
        No new loans
      </Chip>
      <Chip icon={AlertTriangle} tone="warn" className="top-[32%] right-[3%]">
        Wants at 34%
      </Chip>
      <Chip icon={CheckCircle2} className="top-[58%] right-[3%]">
        Debt going down
      </Chip>
      <div className={`${centre} aspect-square w-[30%] rounded-full bg-white shadow-[0_12px_30px_rgba(10,60,110,0.18)] sm:w-[28%]`} style={{ top: '50%' }}>
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#e8f3fa" strokeWidth="9" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="url(#score)" strokeWidth="9" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} />
          <defs>
            <linearGradient id="score" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0e4a86" />
              <stop offset="100%" stopColor="#1e8fd0" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[22px] leading-none font-semibold text-navy tabular-nums sm:text-[34px]">{score}</span>
          <span className="text-[9px] text-muted-foreground sm:text-[12px]">out of 100</span>
        </span>
      </div>
      <Chip icon={ListChecks} className="bottom-[5%] left-1/2 -translate-x-1/2">
        Your next 3 moves
      </Chip>
    </Stage>
  )
}

/** The account stores an encrypted vault and readable finance records. */
export function PrivacyVisual() {
  return (
    <Stage label="Illustration: your device saves an encrypted vault backup and readable finance records to the Finfe database. The readable records are used for reports.">
      <Chip icon={Smartphone} className="top-[5%] left-1/2 -translate-x-1/2">
        Your device
      </Chip>
      <div className="absolute top-[28%] right-[5%] left-[5%] grid grid-cols-2 gap-2 sm:gap-3">
        <div className="flex min-h-24 flex-col items-center justify-center rounded-xl border border-border/80 bg-white p-2 text-center shadow-sm sm:min-h-28 sm:p-3">
          <Lock className="size-5 text-primary sm:size-6" />
          <span className="mt-1 text-[11px] font-semibold text-navy sm:text-[14px]">Encrypted vault</span>
          <span className="text-[9px] text-muted-foreground sm:text-[12px]">Backup and recovery</span>
        </div>
        <div className="flex min-h-24 flex-col items-center justify-center rounded-xl border border-border/80 bg-white p-2 text-center shadow-sm sm:min-h-28 sm:p-3">
          <Database className="size-5 text-primary sm:size-6" />
          <span className="mt-1 text-[11px] font-semibold text-navy sm:text-[14px]">Finance records</span>
          <span className="text-[9px] text-muted-foreground sm:text-[12px]">Readable for reports</span>
        </div>
      </div>
      <Chip icon={Server} className="bottom-[7%] left-1/2 -translate-x-1/2">
        Saved in Finfe’s database
      </Chip>
    </Stage>
  )
}

/** Free tools orbiting a "no account needed" core. */
export function ToolsVisual() {
  return (
    <Stage label="Illustration: six free tools around a centre marked no account needed: budget, savings, emergency fund, debt payoff, financial freedom and the financial health check">
      <div className={`${centre} flex w-[36%] flex-col items-center rounded-2xl bg-navy px-2 py-3 text-center text-white shadow-[0_12px_30px_rgba(10,60,110,0.25)] sm:w-[32%] sm:py-4`} style={{ top: '50%' }}>
        <Calculator className="size-5 text-[#5bb3e6] sm:size-7" />
        <p className="mt-1.5 text-[12px] font-semibold sm:text-[16px]">Free tools</p>
        <p className="text-[9px] text-white/80 sm:text-[12px]">No account needed</p>
      </div>
      <Chip icon={Wallet} className="top-[12%] left-[12%] sm:left-[16%]">
        Budget
      </Chip>
      <Chip icon={PiggyBank} className="top-[12%] right-[12%] sm:right-[16%]">
        Savings
      </Chip>
      <Chip icon={Umbrella} className="top-[46%] left-[2%] -translate-y-1/2">
        Emergency fund
      </Chip>
      <Chip icon={Mountain} className="top-[46%] right-[2%] -translate-y-1/2">
        Debt payoff
      </Chip>
      <Chip icon={TrendingUp} className="bottom-[12%] left-[8%] sm:left-[12%]">
        Financial freedom
      </Chip>
      <Chip icon={HeartPulse} className="right-[8%] bottom-[12%] sm:right-[12%]">
        Health check
      </Chip>
    </Stage>
  )
}

/** Spending limits filling up, with the early warning. */
export function LimitsVisual() {
  const rows: [string, string, number, 'ok' | 'warn' | 'over'][] = [
    ['🍲', 'Food', 62, 'ok'],
    ['🚌', 'Transport', 78, 'ok'],
    ['🎉', 'Eating out', 84, 'warn'],
  ]
  return (
    <Stage label="Illustration: spending limits for food at 62%, transport at 78% and eating out at 84%, with a warning sent at 80%">
      <Chip icon={BellRing} className="top-[6%] left-1/2 -translate-x-1/2">
        Warned at 80%
      </Chip>
      <div className="absolute top-1/2 left-1/2 w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border/80 bg-white p-3 shadow-[0_12px_30px_rgba(10,60,110,0.18)] sm:w-[52%] sm:p-4">
        <p className="text-[10px] font-semibold text-navy sm:text-[12px]">Limits this month</p>
        <ul className="mt-2 grid gap-2 sm:gap-3">
          {rows.map(([e, n, pct, lvl]) => (
            <li key={n}>
              <div className="flex items-center justify-between text-[10px] sm:text-[12px]">
                <span className="flex items-center gap-1.5 text-foreground">
                  <span>{e}</span> {n}
                </span>
                <span className={lvl === 'warn' ? 'font-medium text-amber-700' : 'text-muted-foreground'}>{pct}%</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-muted">
                <div className={`h-full rounded-full ${lvl === 'warn' ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Chip icon={AlertTriangle} tone="warn" className="bottom-[6%] left-1/2 -translate-x-1/2">
        Eating out: KSh 640 left
      </Chip>
    </Stage>
  )
}
