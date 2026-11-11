import { PGlite } from '@electric-sql/pglite'
import fs from 'node:fs'
import path from 'node:path'
import { expect, it } from 'vitest'

// Runs the real migration in an in-memory Postgres and checks billing + security rules.
it('database schema: trials, payments, versioning and row-level security', async () => {
  const results: [string, boolean][] = []
  const db = new PGlite()

const q = async (sql: string, params?: unknown[]): Promise<any[]> => (await db.query(sql, params)).rows
const ok = (cond: boolean, msg: string) => results.push([msg, cond])

await db.exec(`
  create role anon; create role authenticated; create role service_role;
  create schema auth;
  create table auth.users (id uuid primary key, email text);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant usage on schema public, auth to anon, authenticated, service_role;
`)
await db.exec(fs.readFileSync(path.join(import.meta.dirname, '../supabase/migrations/20261111000000_init.sql'), 'utf8'))
await db.exec(`grant select, insert, update, delete on all tables in schema public to anon, authenticated, service_role;`)


const A = '11111111-1111-1111-1111-111111111111', B = '22222222-2222-2222-2222-222222222222'
await q(`insert into auth.users values ($1,'Chris@Example.com'), ($2,'b@x.co')`, [A, B])
const [sub] = await q(`select *, trial_ends_at - now() as left from public.subscriptions where user_id=$1`, [A])
ok(sub.status === 'trialing' && sub.email === 'chris@example.com', `trial created on signup (${sub.status}, ${sub.email})`)
ok(Math.round((new Date(sub.trial_ends_at).getTime() - Date.now()) / 864e5) === 14, 'trial lasts 14 days')

// payment applied once, extends from trial end
const args = (ref: string, period: string) => [ref, A, period === 'yearly' ? 2999 : 299, period, 'prepaid', 'mpesa', 'mobile_money', new Date().toISOString(), 'CUS_1']
const call = `select public.apply_payment($1,$2,$3,$4,$5,$6,$7,$8::timestamptz,$9) as r`
const [r1] = await q(call, args('ref_1', 'monthly'))
const [r2] = await q(call, args('ref_1', 'monthly'))
ok(r1.r === true && r2.r === false, 'same reference applied only once (idempotent)')
const [s1] = await q(`select * from public.subscriptions where user_id=$1`, [A])
const expected = new Date(sub.trial_ends_at); expected.setMonth(expected.getMonth() + 1)
ok(Math.abs(new Date(s1.current_period_end).getTime() - expected.getTime()) < 60_000, `paid month starts after trial ends → ${s1.current_period_end.toISOString().slice(0,10)}`)
ok(s1.status === 'active' && s1.billing === 'prepaid' && s1.paystack_customer_code === 'CUS_1', 'status active, billing prepaid, customer saved')
await q(call, args('ref_2', 'yearly'))
const [s2] = await q(`select * from public.subscriptions where user_id=$1`, [A])
const exp2 = new Date(s1.current_period_end); exp2.setFullYear(exp2.getFullYear() + 1)
ok(Math.abs(new Date(s2.current_period_end).getTime() - exp2.getTime()) < 60_000, `yearly payment stacks on top → ${s2.current_period_end.toISOString().slice(0,10)}`)
const pays = await q(`select reference, status from public.payments order by id`)
ok(pays.length === 2 && pays.every((p: any) => p.status === 'success'), 'payment history recorded')

// pending row from checkout then success
await q(`insert into public.payments (user_id, reference, amount, period, method, status) values ($1,'ref_3',299,'monthly','card','pending')`, [A])
await q(call, args('ref_3', 'monthly'))
const [p3] = await q(`select status, method from public.payments where reference='ref_3'`)
ok(p3.status === 'success', 'pending checkout row becomes success')

// vault version check
await q(`insert into public.vaults (user_id, kdf, wrapped_key, recovery_key, data) values ($1,'{}','{}','{}','{"iv":"x","ct":"y"}')`, [A])
let conflict = false
try { await q(`update public.vaults set version = 3 where user_id=$1`, [A]) } catch (e: any) { conflict = /version conflict/.test(e.message) }
ok(conflict, 'skipping a version is rejected (conflict)')
await q(`update public.vaults set version = 2, data='{"iv":"a","ct":"b"}' where user_id=$1`, [A])
ok((await q(`select version from public.vaults where user_id=$1`, [A]))[0].version === 2, 'version +1 accepted')

// RLS as user B
await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${B}', false);`)
ok((await q(`select * from public.vaults`)).length === 0, 'user B cannot read user A’s vault')
ok((await q(`select * from public.subscriptions`)).length === 1, 'user B sees only their own subscription')
const upd = await db.query(`update public.subscriptions set status='active', current_period_end = now() + interval '10 years'`)
ok(upd.affectedRows === 0, 'user cannot give themselves Pro (no update policy)')
let denied = false
try { await q(call, ['hack', B, 299, 'monthly', 'prepaid', 'mpesa', 'x', new Date().toISOString(), null]) } catch (e: any) { denied = /permission denied/.test(e.message) }
ok(denied, 'users cannot call apply_payment')
let insertOther = false
try { await q(`insert into public.vaults (user_id, kdf, wrapped_key, recovery_key, data) values ($1,'{}','{}','{}','{}')`, [A]) } catch (e: any) { insertOther = /row-level security|duplicate/.test(e.message) }
ok(insertOther, 'user B cannot write a vault for user A')
await db.exec(`reset role;`)

// delete cascade
await q(`delete from auth.users where id=$1`, [A])
ok((await q(`select * from public.vaults where user_id=$1`, [A])).length === 0 && (await q(`select * from public.subscriptions where user_id=$1`, [A])).length === 0, 'deleting the user removes vault + subscription')
ok((await q(`select * from public.payments where reference='ref_1'`))[0].user_id === null, 'payment records kept (anonymised) for tax')

  const failed = results.filter(([, ok]) => !ok).map(([m]) => m)
  expect(failed).toEqual([])
  expect(results.length).toBeGreaterThan(15)
}, 60_000)
