/**
 * Three-way merge for syncing between devices.
 *   base   = what this device last saw on the server
 *   local  = this device's current data
 *   remote = what is on the server now (changed by another device)
 *
 * Rules per record (matched by id):
 *   - added on one side → kept
 *   - deleted on one side and untouched on the other → deleted
 *   - changed on both sides → this device wins
 * Settings are merged field by field the same way.
 */
import type { AppData } from '../types'

const COLLECTIONS = ['categories', 'expenses', 'incomes', 'loans', 'goals', 'bills'] as const

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

function mergeList<T extends { id: string }>(base: T[], local: T[], remote: T[]): T[] {
  const b = new Map(base.map((x) => [x.id, x]))
  const l = new Map(local.map((x) => [x.id, x]))
  const r = new Map(remote.map((x) => [x.id, x]))
  const out: T[] = []
  const seen = new Set<string>()
  // keep local order first, then remote additions
  for (const id of [...l.keys(), ...r.keys()]) {
    if (seen.has(id)) continue
    seen.add(id)
    const inB = b.get(id)
    const inL = l.get(id)
    const inR = r.get(id)
    if (inL && inR) {
      out.push(inB && same(inL, inB) ? inR : inL)
    } else if (inL && !inR) {
      // missing remotely: new here, or deleted there
      if (!inB) out.push(inL) // added locally
      else if (!same(inL, inB)) out.push(inL) // deleted there but edited here → keep the edit
      // else deleted remotely → drop
    } else if (inR && !inL) {
      if (!inB) out.push(inR) // added remotely
      else if (!same(inR, inB)) out.push(inR) // deleted here but edited there → keep the edit
      // else deleted locally → drop
    }
  }
  return out
}

function mergeObject<T extends object>(base: T, local: T, remote: T): T {
  const out: Record<string, unknown> = {}
  const keys = new Set([...Object.keys(base ?? {}), ...Object.keys(local ?? {}), ...Object.keys(remote ?? {})])
  for (const k of keys) {
    const bv = (base as Record<string, unknown>)?.[k]
    const lv = (local as Record<string, unknown>)?.[k]
    const rv = (remote as Record<string, unknown>)?.[k]
    const v = same(lv, bv) ? rv : lv
    if (v !== undefined) out[k] = v
  }
  return out as T
}

export function merge3(base: AppData, local: AppData, remote: AppData): AppData {
  const out = { ...remote, version: 1 } as AppData
  out.settings = mergeObject(base.settings, local.settings, remote.settings)
  for (const c of COLLECTIONS) {
    // @ts-expect-error — each collection is an array of records with ids
    out[c] = mergeList(base[c] ?? [], local[c] ?? [], remote[c] ?? [])
  }
  return out
}

export function sameData(a: AppData | null, b: AppData | null) {
  return same(a, b)
}
