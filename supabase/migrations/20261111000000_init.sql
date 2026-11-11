-- =====================================================================
-- Finance Freedom — initial schema
-- Money data is end-to-end encrypted in the browser. The server only ever
-- stores ciphertext in `vaults`; it cannot read anyone's finances.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Encrypted vault: one row per user
-- ---------------------------------------------------------------------
create table public.vaults (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  kdf          jsonb not null,                -- { name, iterations, v }
  wrapped_key  jsonb not null,                -- data key encrypted with the password-derived key
  recovery_key jsonb not null,                -- data key encrypted with the recovery key
  data         jsonb not null,                -- { iv, ct } AES-256-GCM ciphertext of the user's data
  version      integer not null default 1 check (version > 0),
  updated_at   timestamptz not null default now(),
  constraint vault_size check (octet_length(data::text) < 10 * 1024 * 1024)
);

alter table public.vaults enable row level security;

create policy "vault: read own"   on public.vaults for select using (auth.uid() = user_id);
create policy "vault: create own" on public.vaults for insert with check (auth.uid() = user_id);
create policy "vault: update own" on public.vaults for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "vault: delete own" on public.vaults for delete using (auth.uid() = user_id);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger vaults_touch before update on public.vaults
  for each row execute function public.touch_updated_at();

-- Optimistic concurrency: a client must send version = old version + 1.
create or replace function public.vaults_check_version() returns trigger language plpgsql as $$
begin
  if new.version <> old.version + 1 then
    raise exception 'version conflict' using errcode = '40001';
  end if;
  return new;
end $$;

create trigger vaults_version before update on public.vaults
  for each row execute function public.vaults_check_version();

-- ---------------------------------------------------------------------
-- Subscriptions: written ONLY by edge functions (service role)
-- ---------------------------------------------------------------------
create table public.subscriptions (
  user_id                    uuid primary key references auth.users (id) on delete cascade,
  email                      text not null,
  status                     text not null default 'trialing'
                               check (status in ('trialing','active','non_renewing','past_due','cancelled','expired')),
  trial_ends_at              timestamptz,
  current_period_end         timestamptz,
  billing                    text check (billing in ('card','prepaid')),
  period                     text check (period in ('monthly','yearly')),
  paystack_customer_code     text,
  paystack_subscription_code text,
  paystack_email_token       text,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);

create index subscriptions_email_idx on public.subscriptions (lower(email));
create index subscriptions_customer_idx on public.subscriptions (paystack_customer_code);

alter table public.subscriptions enable row level security;
create policy "subscription: read own" on public.subscriptions for select using (auth.uid() = user_id);
-- no insert/update/delete policies: clients cannot change their own plan

create trigger subscriptions_touch before update on public.subscriptions
  for each row execute function public.touch_updated_at();

-- Every new account starts a free Pro trial
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.subscriptions (user_id, email, status, trial_ends_at)
  values (new.id, lower(new.email), 'trialing', now() + interval '14 days')
  on conflict (user_id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- Payments (history + idempotency)
-- ---------------------------------------------------------------------
create table public.payments (
  id         bigint generated always as identity primary key,
  user_id    uuid references auth.users (id) on delete set null,
  reference  text not null unique,
  amount     integer not null,                -- whole KSh
  currency   text not null default 'KES',
  period     text not null check (period in ('monthly','yearly')),
  method     text,                            -- mpesa | card
  channel    text,                            -- as reported by Paystack
  status     text not null default 'pending' check (status in ('pending','success','failed')),
  paid_at    timestamptz,
  created_at timestamptz not null default now()
);

create index payments_user_idx on public.payments (user_id, created_at desc);

alter table public.payments enable row level security;
create policy "payments: read own" on public.payments for select using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- Webhook de-duplication (Paystack resends events)
-- ---------------------------------------------------------------------
create table public.webhook_events (
  id          text primary key,
  received_at timestamptz not null default now()
);
alter table public.webhook_events enable row level security;

-- ---------------------------------------------------------------------
-- apply_payment: mark a payment successful and extend Pro. Idempotent.
-- Remaining trial or paid time is kept: the new period starts at the later
-- of now, the end of the trial, and the end of the current paid period.
-- ---------------------------------------------------------------------
create or replace function public.apply_payment(
  p_reference     text,
  p_user          uuid,
  p_amount        integer,
  p_period        text,
  p_billing       text,
  p_method        text,
  p_channel       text,
  p_paid_at       timestamptz,
  p_customer_code text
) returns boolean
language plpgsql security definer set search_path = public as $$
declare
  already boolean;
  base    timestamptz;
begin
  select (status = 'success') into already from public.payments where reference = p_reference for update;
  if already then
    return false; -- processed before
  end if;

  insert into public.payments (user_id, reference, amount, period, method, channel, status, paid_at)
  values (p_user, p_reference, p_amount, p_period, p_method, p_channel, 'success', coalesce(p_paid_at, now()))
  on conflict (reference) do update
    set status = 'success', amount = excluded.amount, channel = excluded.channel,
        paid_at = excluded.paid_at, user_id = coalesce(public.payments.user_id, excluded.user_id);

  select greatest(now(), coalesce(current_period_end, now()), coalesce(trial_ends_at, now()))
    into base from public.subscriptions where user_id = p_user for update;

  update public.subscriptions set
    current_period_end     = base + case when p_period = 'yearly' then interval '1 year' else interval '1 month' end,
    status                 = 'active',
    billing                = p_billing,
    period                 = p_period,
    paystack_customer_code = coalesce(p_customer_code, paystack_customer_code)
  where user_id = p_user;

  return true;
end $$;

revoke all on function public.apply_payment(text, uuid, integer, text, text, text, text, timestamptz, text) from public, anon, authenticated;
grant execute on function public.apply_payment(text, uuid, integer, text, text, text, text, timestamptz, text) to service_role;
