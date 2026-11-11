'use client'

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useFmt } from '@/store/data'

export const SERIES = {
  earned: { label: 'Income', color: 'var(--series-income)' },
  spent: { label: 'Spending', color: 'var(--series-spent)' },
  income: { label: 'Expected income', color: 'var(--series-income)' },
  payments: { label: 'Planned payments', color: 'var(--series-spent)' },
} as const

type SeriesKey = keyof typeof SERIES

const nc = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 })
const tick = (v: number) => nc.format(v)

const axis = { stroke: 'var(--muted-foreground)', fontSize: 12, tickLine: false, axisLine: false } as const

export function Legend({ keys }: { keys: SeriesKey[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-muted-foreground">
      {keys.map((k) => (
        <span key={k} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm" style={{ background: SERIES[k].color }} />
          {SERIES[k].label}
        </span>
      ))}
    </div>
  )
}

interface TipProps {
  active?: boolean
  label?: string | number
  payload?: { dataKey?: string | number; value?: number; color?: string; payload?: Record<string, unknown> }[]
}

function Tip({ active, payload, label, fmt, title }: TipProps & { fmt: (n: number) => string; title?: (p: Record<string, unknown>) => string }) {
  if (!active || !payload?.length) return null
  const head = title && payload[0].payload ? title(payload[0].payload) : String(label ?? '')
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-[13px] shadow-md">
      <p className="mb-1 font-medium">{head}</p>
      {payload.map((p) => {
        const s = SERIES[p.dataKey as SeriesKey]
        return (
          <p key={String(p.dataKey)} className="flex items-center gap-2 text-muted-foreground">
            <span className="size-2 rounded-sm" style={{ background: p.color }} />
            {s?.label ?? p.dataKey}
            <span className="ml-auto pl-3 font-medium text-foreground tabular-nums">{fmt(Number(p.value ?? 0))}</span>
          </p>
        )
      })}
    </div>
  )
}

/** Grouped monthly bars: earned vs spent (vs borrowed). One y-axis, shared scale. */
export function MonthlyBars({
  data,
  keys,
  height = 220,
  selected,
  onSelect,
}: {
  data: { key: string; label: string; [k: string]: number | string }[]
  keys: SeriesKey[]
  height?: number
  selected?: string
  onSelect?: (key: string) => void
}) {
  const { m } = useFmt()
  return (
    <div className="grid gap-2">
      <Legend keys={keys} />
      <div style={{ height }} className="-ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barGap={2}
            barCategoryGap="22%"
            onClick={(s) => {
              const idx = s?.activeTooltipIndex
              if (onSelect && typeof idx === 'number') onSelect(data[idx].key)
            }}
          >
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="label" {...axis} interval={0} />
            <YAxis {...axis} width={40} tickFormatter={tick} />
            <Tooltip cursor={{ fill: 'var(--muted)', opacity: 0.6 }} content={<Tip fmt={m} title={(p) => String(p.full ?? p.label)} />} />
            {keys.map((k) => (
              <Bar
                key={k}
                dataKey={k}
                fill={SERIES[k].color}
                radius={[4, 4, 0, 0]}
                maxBarSize={22}
                isAnimationActive={false}
                // dim months that are not selected
                shape={(props: unknown) => {
                  const p = props as { x: number; y: number; width: number; height: number; payload: { key: string } }
                  const dim = selected && p.payload.key !== selected
                  const r = Math.min(4, p.width / 2, Math.max(0, p.height))
                  if (p.height <= 0) return <g />
                  return (
                    <path
                      d={`M${p.x},${p.y + p.height} V${p.y + r} Q${p.x},${p.y} ${p.x + r},${p.y} H${p.x + p.width - r} Q${p.x + p.width},${p.y} ${p.x + p.width},${p.y + r} V${p.y + p.height} Z`}
                      fill={SERIES[k].color}
                      opacity={dim ? 0.35 : 1}
                    />
                  )
                }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/** Single-series area: total debt balance over time. */
export function DebtArea({ data, height = 200 }: { data: { key: string; label: string; total: number }[]; height?: number }) {
  const { m } = useFmt()
  return (
    <div style={{ height }} className="-ml-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="debtFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--series-spent)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--series-spent)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="label" {...axis} minTickGap={24} />
          <YAxis {...axis} width={40} tickFormatter={tick} />
          <ReferenceLine y={0} stroke="var(--border)" />
          <Tooltip
            cursor={{ stroke: 'var(--muted-foreground)', strokeDasharray: '3 3' }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <div className="rounded-lg border bg-popover px-3 py-2 text-[13px] shadow-md">
                  <p className="font-medium">{label}</p>
                  <p className="text-muted-foreground">
                    Debt left: <span className="font-medium text-foreground tabular-nums">{m(Number(payload[0].value))}</span>
                  </p>
                </div>
              ) : null
            }
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="var(--series-spent)"
            strokeWidth={2}
            fill="url(#debtFill)"
            isAnimationActive={false}
            activeDot={{ r: 5, stroke: 'var(--card)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
